import "server-only";

import { createHash } from "node:crypto";

import { GoogleGenAI } from "@google/genai";
import Anthropic from "@anthropic-ai/sdk";
import { Prisma } from "@prisma/client";
import { z } from "zod";

import { db } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

// ============================================================
// Prototype de traduction automatique FR → EN — modèle Service
// UNIQUEMENT (voir consigne P2). Ne pas généraliser à Training,
// Article, Page, CaseStudy, Faq ou Event sans validation explicite.
// ============================================================

const ANTHROPIC_MODEL = "claude-sonnet-5";
const GEMINI_MODEL = "gemini-2.5-flash";

// ---- Arbre Tiptap : uniquement ce dont on a besoin ici ----
type TiptapNode = {
  type?: string;
  text?: string;
  marks?: unknown[];
  attrs?: unknown;
  content?: TiptapNode[];
  [key: string]: unknown;
};

/** Parcourt l'arbre Tiptap dans l'ordre du document et renvoie chaque
 * texte de feuille (`{ type: "text", text: "..." }`). L'ordre est stable
 * et sert de contrat avec `applyTexts`. */
function extractTexts(node: TiptapNode, out: string[] = []): string[] {
  if (typeof node.text === "string") out.push(node.text);
  if (Array.isArray(node.content)) {
    for (const child of node.content) extractTexts(child, out);
  }
  return out;
}

/** Clone l'arbre FR et remplace uniquement les valeurs `text` des feuilles,
 * dans le même ordre que `extractTexts`. Ne touche à aucune clé, à aucun
 * `mark` (donc aucun `href` de lien), à aucun `attrs`. */
function applyTexts(
  node: TiptapNode,
  texts: string[],
  cursor = { i: 0 },
): TiptapNode {
  const clone: TiptapNode = { ...node };
  if (typeof node.text === "string") {
    if (cursor.i >= texts.length) {
      throw new Error("translation-text-count-mismatch");
    }
    clone.text = texts[cursor.i];
    cursor.i += 1;
  }
  if (Array.isArray(node.content)) {
    clone.content = node.content.map((child) =>
      applyTexts(child, texts, cursor),
    );
  }
  return clone;
}

function extractNumbers(text: string): string[] {
  return text.match(/\d[\d.,]*\d|\d/g) ?? [];
}

function extractUrls(text: string): string[] {
  return text.match(/https?:\/\/[^\s")]+/g) ?? [];
}

const BRAND = "Sapiens-IA";

function joinTexts(texts: string[]) {
  return texts.join("\n");
}

/** Hash stable des seuls champs réellement envoyés à la traduction.
 * Sert à détecter si le FR a changé depuis la dernière génération EN,
 * et à éviter un appel LLM inutile si rien n'a bougé. */
export function hashServiceSource(fr: {
  title: string;
  excerpt: string;
  content: unknown;
}): string {
  return createHash("sha256")
    .update(fr.title, "utf8")
    .update(" ")
    .update(fr.excerpt, "utf8")
    .update(" ")
    .update(JSON.stringify(fr.content))
    .digest("hex");
}

// ---- Appel LLM (Anthropic Claude, tool-use forcé pour un JSON fiable) ----

const translationOutputSchema = z.object({
  title: z.string().min(1),
  excerpt: z.string().min(1),
  contentTexts: z.array(z.string()),
  seoTitle: z.string().min(1),
  seoDescription: z.string().min(1),
});
type TranslationOutput = z.infer<typeof translationOutputSchema>;

const SYSTEM_PROMPT = `Tu traduis le contenu marketing B2B d'un cabinet de conseil en IA, du français vers l'anglais.

Règles strictes :
- Ton professionnel B2B, clair, sans familiarité.
- N'invente aucune information absente du texte source.
- Ne supprime aucune information présente dans le texte source.
- Conserve exactement les chiffres, prix, dates et URLs — ne les traduis jamais, ne les reformule jamais.
- Le nom de marque "Sapiens-IA" doit rester EXACTEMENT "Sapiens-IA" dans la sortie, jamais traduit, jamais reformulé, jamais "Sapiens IA" sans trait d'union.
- Respecte la terminologie professionnelle Data / IA déjà en usage dans le secteur (ne francise pas des anglicismes déjà standards, et vice-versa).
- Le tableau "contentTexts" doit contenir EXACTEMENT le même nombre d'éléments que le tableau fourni en entrée, dans le même ordre — un élément traduit pour un élément source, jamais plus, jamais moins, jamais fusionné.
- Réponds UNIQUEMENT via l'outil fourni. Aucun texte, aucune explication en dehors de l'appel d'outil.`;

function buildUserPrompt(fr: {
  title: string;
  excerpt: string;
  contentTexts: string[];
}) {
  return JSON.stringify(
    {
      title: fr.title,
      excerpt: fr.excerpt,
      contentTexts: fr.contentTexts,
    },
    null,
    2,
  );
}

async function callClaudeTranslate(fr: {
  title: string;
  excerpt: string;
  contentTexts: string[];
}): Promise<TranslationOutput> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("missing-anthropic-api-key");
  const client = new Anthropic({ apiKey });

  const message = await client.messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    tools: [
      {
        name: "submit_translation",
        description:
          "Soumet la traduction anglaise structurée d'un service Sapiens-IA.",
        input_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            excerpt: { type: "string" },
            contentTexts: {
              type: "array",
              items: { type: "string" },
              description:
                "Un élément traduit par élément source, même ordre, même nombre.",
            },
            seoTitle: {
              type: "string",
              description: "Titre SEO anglais, environ 60 caractères.",
            },
            seoDescription: {
              type: "string",
              description:
                "Meta description anglaise, environ 150-160 caractères.",
            },
          },
          required: [
            "title",
            "excerpt",
            "contentTexts",
            "seoTitle",
            "seoDescription",
          ],
        },
        strict: true,
      },
    ],
    tool_choice: { type: "tool", name: "submit_translation" },
    messages: [{ role: "user", content: buildUserPrompt(fr) }],
  });

  const toolUse = message.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use",
  );
  if (!toolUse) throw new Error("no-tool-use-in-response");
  const parsed = translationOutputSchema.safeParse(toolUse.input);
  if (!parsed.success) throw new Error("invalid-tool-output-shape");
  return parsed.data;
}

// ---- Abstraction provider : le seul point que la migration Anthropic
// → Gemini doit toucher. Le prompt système, les règles de traduction et
// la validation de sortie (`validateTranslationOutput`) restent partagés
// et inchangés, quel que soit le provider actif. ----

type TranslationInput = {
  title: string;
  excerpt: string;
  contentTexts: string[];
};

interface TranslationProvider {
  translate(input: TranslationInput): Promise<TranslationOutput>;
}

class AnthropicTranslationProvider implements TranslationProvider {
  translate(input: TranslationInput): Promise<TranslationOutput> {
    return callClaudeTranslate(input);
  }
}

// Même schéma que celui envoyé à Anthropic (submit_translation.input_schema
// ci-dessus), reformulé en JSON Schema pour `response_format` — dupliqué
// volontairement plutôt que partagé, pour ne rien changer au chemin
// Anthropic existant pendant cette migration.
const GEMINI_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    excerpt: { type: "string" },
    contentTexts: {
      type: "array",
      items: { type: "string" },
      description:
        "Un élément traduit par élément source, même ordre, même nombre.",
    },
    seoTitle: {
      type: "string",
      description: "Titre SEO anglais, environ 60 caractères.",
    },
    seoDescription: {
      type: "string",
      description: "Meta description anglaise, environ 150-160 caractères.",
    },
  },
  required: ["title", "excerpt", "contentTexts", "seoTitle", "seoDescription"],
};

class GeminiTranslationProvider implements TranslationProvider {
  async translate(fr: TranslationInput): Promise<TranslationOutput> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("missing-gemini-api-key");
    const client = new GoogleGenAI({ apiKey });

    const interaction = await client.interactions.create({
      model: GEMINI_MODEL,
      system_instruction: SYSTEM_PROMPT,
      input: buildUserPrompt(fr),
      response_format: {
        type: "text",
        mime_type: "application/json",
        schema: GEMINI_RESPONSE_SCHEMA,
      },
    });

    if (!interaction.output_text) throw new Error("no-output-in-response");
    let raw: unknown;
    try {
      raw = JSON.parse(interaction.output_text);
    } catch {
      throw new Error("invalid-tool-output-shape");
    }
    const parsed = translationOutputSchema.safeParse(raw);
    if (!parsed.success) throw new Error("invalid-tool-output-shape");
    return parsed.data;
  }
}

// Les deux providers sont exportés pour permettre un rollback instantané
// (aucune donnée en base ne dépend du provider utilisé) — voir
// `activeProvider` ci-dessous, seul point à modifier pour basculer.
export const anthropicProvider: TranslationProvider =
  new AnthropicTranslationProvider();
export const geminiProvider: TranslationProvider =
  new GeminiTranslationProvider();

// Bascule du provider actif — point unique à modifier pour revenir à
// Anthropic (`activeProvider = anthropicProvider`). GEMINI_API_KEY n'étant
// pas encore configurée à ce stade de la migration, toute traduction
// réelle échouera avec "missing-gemini-api-key" (capturé par le catch
// existant de `finishServiceTranslation`, sans changement de comportement)
// tant que la clé n'est pas ajoutée.
const activeProvider: TranslationProvider = geminiProvider;

// ---- Validation de sortie (indépendante du provider) ----

export type ValidationResult =
  { ok: true; data: TranslationOutput } | { ok: false; reason: string };

export function validateTranslationOutput(
  fr: { title: string; excerpt: string; contentTexts: string[] },
  candidate: unknown,
): ValidationResult {
  const parsed = translationOutputSchema.safeParse(candidate);
  if (!parsed.success) return { ok: false, reason: "invalid-json-shape" };
  const output = parsed.data;

  if (output.contentTexts.length !== fr.contentTexts.length) {
    return { ok: false, reason: "content-texts-count-mismatch" };
  }

  const frFullText = joinTexts([fr.title, fr.excerpt, ...fr.contentTexts]);
  const enFullText = joinTexts([
    output.title,
    output.excerpt,
    ...output.contentTexts,
  ]);

  const frNumbers = extractNumbers(frFullText);
  const enNumbers = new Set(extractNumbers(enFullText));
  const missingNumber = frNumbers.find((n) => !enNumbers.has(n));
  if (missingNumber) {
    return { ok: false, reason: `missing-number:${missingNumber}` };
  }

  const frUrls = extractUrls(frFullText);
  const enUrls = new Set(extractUrls(enFullText));
  const missingUrl = frUrls.find((u) => !enUrls.has(u));
  if (missingUrl) {
    return { ok: false, reason: `missing-url:${missingUrl}` };
  }

  const frBrandCount = frFullText.split(BRAND).length - 1;
  const enBrandCount = enFullText.split(BRAND).length - 1;
  if (frBrandCount > 0 && enBrandCount < frBrandCount) {
    return { ok: false, reason: "brand-name-altered" };
  }

  return { ok: true, data: output };
}

// ============================================================
// Orchestration — appelée depuis les routes API admin uniquement.
// ============================================================

async function findLinkedEn(frId: string) {
  return db.service.findFirst({
    where: { translationOfId: frId, locale: "en" },
  });
}

/**
 * Étape rapide et synchrone : détermine le cas A/B/C, applique la
 * protection contre l'écrasement (§14), pose translationStatus="PENDING"
 * et renvoie s'il faut effectivement lancer l'appel LLM (différé via
 * `after()` par l'appelant). Ne fait jamais d'appel réseau au LLM.
 */
export async function beginServiceTranslation(
  frId: string,
  options: { force?: boolean } = {},
): Promise<
  { proceed: false; reason: string } | { proceed: true; enId: string }
> {
  const fr = await db.service.findUnique({
    where: { id: frId },
    select: {
      id: true,
      slug: true,
      locale: true,
      translationOfId: true,
      title: true,
      excerpt: true,
      content: true,
      image: true,
      categoryId: true,
    },
  });
  if (!fr || fr.locale !== "fr" || fr.translationOfId) {
    return { proceed: false, reason: "not-a-fr-source-service" };
  }

  const limit = rateLimit(`translate:service:${frId}`, 1, 30_000);
  if (!limit.allowed && !options.force) {
    return { proceed: false, reason: "rate-limited" };
  }

  const existingEn = await findLinkedEn(frId);
  const sourceHash = hashServiceSource(fr);

  if (!existingEn) {
    // Cas A — aucune EN liée : on crée la ligne tout de suite (contenu FR
    // recopié comme placeholder le temps de la vraie traduction), jamais
    // une deuxième ligne ensuite puisque translationOfId est déjà posé.
    // Slug identique au FR : c'est déjà la convention utilisée par les
    // 71 traductions existantes (vérifié en base avant implémentation),
    // le routage FR/EN se fait par le préfixe de locale, pas par le slug.
    const created = await db.service.create({
      data: {
        locale: "en",
        slug: fr.slug,
        title: fr.title,
        excerpt: fr.excerpt,
        content: fr.content as Prisma.InputJsonValue,
        image: fr.image,
        categoryId: fr.categoryId,
        status: "DRAFT",
        translationOfId: fr.id,
        translationStatus: "PENDING",
        translationSourceHash: sourceHash,
      },
    });
    return { proceed: true, enId: created.id };
  }

  // Cas C — EN déjà éditée manuellement : ne JAMAIS écraser sans `force`.
  if (existingEn.translationEditedAt && !options.force) {
    return { proceed: false, reason: "translation-manually-edited" };
  }

  // Optimisation coût : le FR n'a pas changé depuis la dernière génération
  // et ce n'est pas une régénération forcée explicite → rien à refaire.
  if (
    !options.force &&
    existingEn.translationSourceHash === sourceHash &&
    existingEn.translationStatus === "OK"
  ) {
    return { proceed: false, reason: "source-unchanged" };
  }

  // Cas B (ou C forcé) — on met à jour la ligne EN existante, jamais une
  // nouvelle ligne.
  await db.service.update({
    where: { id: existingEn.id },
    data: { translationStatus: "PENDING" },
  });
  return { proceed: true, enId: existingEn.id };
}

/**
 * Étape lente : appelle le LLM, valide, écrit le résultat. Conçue pour
 * être passée à `after()` — ne doit jamais être attendue par la requête
 * qui a déclenché la sauvegarde FR.
 */
export async function finishServiceTranslation(
  frId: string,
  enId: string,
  userId?: string,
) {
  const fr = await db.service.findUnique({
    where: { id: frId },
    select: { id: true, title: true, excerpt: true, content: true },
  });
  if (!fr) return;

  const contentTexts = extractTexts(fr.content as TiptapNode);
  const sourceHash = hashServiceSource(fr);

  try {
    const raw = await activeProvider.translate({
      title: fr.title,
      excerpt: fr.excerpt,
      contentTexts,
    });
    const validation = validateTranslationOutput(
      { title: fr.title, excerpt: fr.excerpt, contentTexts },
      raw,
    );
    if (!validation.ok) throw new Error(validation.reason);

    const translatedContent = applyTexts(
      fr.content as TiptapNode,
      validation.data.contentTexts,
    );

    await db.service.update({
      where: { id: enId },
      data: {
        title: validation.data.title,
        excerpt: validation.data.excerpt,
        content: translatedContent as Prisma.InputJsonValue,
        translationStatus: "OK",
        translationGeneratedAt: new Date(),
        translationSourceHash: sourceHash,
        translationEditedAt: null,
        seo: {
          upsert: {
            create: {
              title: validation.data.seoTitle,
              description: validation.data.seoDescription,
              keywords: [],
              noIndex: false,
            },
            update: {
              title: validation.data.seoTitle,
              description: validation.data.seoDescription,
            },
          },
        },
      },
    });
    await db.auditLog.create({
      data: {
        userId,
        action: "TRANSLATE",
        entity: "services",
        entityId: enId,
        after: { serviceId: frId, result: "OK" },
      },
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "unknown-error";
    await db.service.update({
      where: { id: enId },
      data: { translationStatus: "FAILED" },
    });
    await db.auditLog.create({
      data: {
        userId,
        action: "TRANSLATE",
        entity: "services",
        entityId: enId,
        after: { serviceId: frId, result: "FAILED", reason },
      },
    });
  }
}
