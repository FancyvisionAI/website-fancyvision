import "server-only";

import { createHash } from "node:crypto";

import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

import { db } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

// ============================================================
// Prototype de traduction automatique FR → EN — modèle Page
// UNIQUEMENT (voir consigne P5). Ne pas généraliser à CaseStudy, Faq
// ou Event sans validation explicite.
//
// Périmètre volontairement restreint : title/headline/description/SEO
// SEULEMENT. `sections` (le page-builder) est entièrement hors
// périmètre — jamais lu, jamais écrit ici, voir beginPageTranslation
// et finishPageTranslation. `accueil`, les pages légales et les
// landing pages `formation-ia-*` sont exclues avant toute autre
// logique (isExcludedPage), y compris pour une régénération forcée.
//
// Miroir structurel de lib/translation/service-translator.ts, mais
// plus simple : Page n'a pas de champ `content` Tiptap, donc aucune
// extraction/réinjection de texte structuré n'est nécessaire ici.
// Volontairement dupliqué plutôt que partagé avec les trois autres
// fichiers translator, pour ne jamais risquer de modifier leur
// comportement déjà validé en réel.
// ============================================================

const GEMINI_MODEL = "gemini-3.5-flash";

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

// ---- Exclusions — appliquées avant toute autre logique, y compris
// pour une régénération forcée via le bouton "Régénérer". ----
const EXCLUDED_PAGE_SLUGS = new Set([
  "accueil",
  "conditions",
  "confidentialite",
  "mentions-legales",
]);

export function isExcludedPage(slug: string): boolean {
  return EXCLUDED_PAGE_SLUGS.has(slug) || slug.startsWith("formation-ia-");
}

/** Hash stable des seuls champs réellement envoyés à la traduction. */
export function hashPageSource(fr: {
  title: string;
  headline: string | null;
  description: string | null;
}): string {
  return createHash("sha256")
    .update(fr.title, "utf8")
    .update(" ")
    .update(fr.headline ?? "", "utf8")
    .update(" ")
    .update(fr.description ?? "", "utf8")
    .digest("hex");
}

// ---- Appel LLM (Gemini, Structured JSON Output) ----

const pageTranslationOutputSchema = z.object({
  title: z.string().min(1),
  headline: z.string(),
  description: z.string(),
  seoTitle: z.string().min(1),
  seoDescription: z.string().min(1),
});
type PageTranslationOutput = z.infer<typeof pageTranslationOutputSchema>;

type PageTranslationInput = {
  title: string;
  headline: string;
  description: string;
};

const PAGE_SYSTEM_PROMPT = `Tu traduis les métadonnées d'une page publique d'un cabinet de conseil en IA, du français vers l'anglais.

Règles strictes :
- Ton professionnel, clair, sans familiarité.
- N'invente aucune information absente du texte source.
- Ne supprime aucune information présente dans le texte source.
- Conserve exactement les chiffres, prix, dates et URLs — ne les traduis jamais, ne les reformule jamais.
- Le nom de marque "Sapiens-IA" doit rester EXACTEMENT "Sapiens-IA" dans la sortie, jamais traduit, jamais reformulé, jamais "Sapiens IA" sans trait d'union.
- Si "headline" ou "description" sont des chaînes vides en entrée, renvoie-les vides en sortie — n'invente jamais de contenu absent.
- Réponds UNIQUEMENT via l'outil fourni. Aucun texte, aucune explication en dehors de l'appel d'outil.`;

function buildPageUserPrompt(fr: PageTranslationInput) {
  return JSON.stringify(
    {
      title: fr.title,
      headline: fr.headline,
      description: fr.description,
    },
    null,
    2,
  );
}

const GEMINI_PAGE_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    headline: { type: "string" },
    description: { type: "string" },
    seoTitle: {
      type: "string",
      description: "Titre SEO anglais, environ 60 caractères.",
    },
    seoDescription: {
      type: "string",
      description: "Meta description anglaise, environ 150-160 caractères.",
    },
  },
  required: ["title", "headline", "description", "seoTitle", "seoDescription"],
};

async function callGeminiPageTranslate(
  fr: PageTranslationInput,
): Promise<PageTranslationOutput> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("missing-gemini-api-key");
  const client = new GoogleGenAI({ apiKey });

  const interaction = await client.interactions.create({
    model: GEMINI_MODEL,
    system_instruction: PAGE_SYSTEM_PROMPT,
    input: buildPageUserPrompt(fr),
    response_format: {
      type: "text",
      mime_type: "application/json",
      schema: GEMINI_PAGE_RESPONSE_SCHEMA,
    },
  });

  if (!interaction.output_text) throw new Error("no-output-in-response");
  let raw: unknown;
  try {
    raw = JSON.parse(interaction.output_text);
  } catch {
    throw new Error("invalid-tool-output-shape");
  }
  const parsed = pageTranslationOutputSchema.safeParse(raw);
  if (!parsed.success) throw new Error("invalid-tool-output-shape");
  return parsed.data;
}

// ---- Validation de sortie ----

export type PageValidationResult =
  { ok: true; data: PageTranslationOutput } | { ok: false; reason: string };

export function validatePageTranslationOutput(
  fr: PageTranslationInput,
  candidate: unknown,
): PageValidationResult {
  const parsed = pageTranslationOutputSchema.safeParse(candidate);
  if (!parsed.success) return { ok: false, reason: "invalid-json-shape" };
  const output = parsed.data;

  const frFullText = joinTexts([fr.title, fr.headline, fr.description]);
  const enFullText = joinTexts([
    output.title,
    output.headline,
    output.description,
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
// Miroir du Cas A/B/C déjà validé sur Service/Training/Article, avec
// le garde-fou d'exclusion appliqué en tout premier.
// ============================================================

async function findLinkedEnPage(frId: string) {
  return db.page.findFirst({
    where: { translationOfId: frId, locale: "en" },
  });
}

export async function beginPageTranslation(
  frId: string,
  options: { force?: boolean } = {},
): Promise<
  { proceed: false; reason: string } | { proceed: true; enId: string }
> {
  const fr = await db.page.findUnique({
    where: { id: frId },
    select: {
      id: true,
      slug: true,
      locale: true,
      translationOfId: true,
      title: true,
      headline: true,
      description: true,
    },
  });
  if (!fr || fr.locale !== "fr" || fr.translationOfId) {
    return { proceed: false, reason: "not-a-fr-source-page" };
  }

  // Exclusion — vérifiée avant toute autre logique, y compris avant le
  // rate-limit, et jamais contournable par `force` (régénération
  // manuelle incluse).
  if (isExcludedPage(fr.slug)) {
    return { proceed: false, reason: "excluded-page" };
  }

  const limit = rateLimit(`translate:page:${frId}`, 1, 30_000);
  if (!limit.allowed && !options.force) {
    return { proceed: false, reason: "rate-limited" };
  }

  const existingEn = await findLinkedEnPage(frId);
  const sourceHash = hashPageSource(fr);

  if (!existingEn) {
    // Cas A — aucune EN liée : création immédiate. `sections` n'est
    // jamais lu ci-dessus ni écrit ici : la ligne EN créée a
    // volontairement `sections = []` (comportement par défaut de
    // Prisma quand la relation n'est pas incluse dans `data`). Slug
    // identique au FR, même convention que Service/Training/Article.
    const created = await db.page.create({
      data: {
        locale: "en",
        slug: fr.slug,
        title: fr.title,
        headline: fr.headline,
        description: fr.description,
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

  if (
    !options.force &&
    existingEn.translationSourceHash === sourceHash &&
    existingEn.translationStatus === "OK"
  ) {
    return { proceed: false, reason: "source-unchanged" };
  }

  // Cas B (ou C forcé) — mise à jour de la ligne EN existante. Ne
  // touche jamais `sections`.
  await db.page.update({
    where: { id: existingEn.id },
    data: { translationStatus: "PENDING" },
  });
  return { proceed: true, enId: existingEn.id };
}

export async function finishPageTranslation(
  frId: string,
  enId: string,
  userId?: string,
) {
  const fr = await db.page.findUnique({
    where: { id: frId },
    select: { id: true, title: true, headline: true, description: true },
  });
  if (!fr) return;

  const input: PageTranslationInput = {
    title: fr.title,
    headline: fr.headline ?? "",
    description: fr.description ?? "",
  };
  const sourceHash = hashPageSource(fr);

  try {
    const raw = await callGeminiPageTranslate(input);
    const validation = validatePageTranslationOutput(input, raw);
    if (!validation.ok) throw new Error(validation.reason);

    // `sections` n'apparaît jamais dans ce `data` : la relation reste
    // strictement intacte, qu'elle soit vide (cas normal ici, toute
    // page avec sections étant exclue) ou non.
    await db.page.update({
      where: { id: enId },
      data: {
        title: validation.data.title,
        headline: validation.data.headline || null,
        description: validation.data.description || null,
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
        entity: "pages",
        entityId: enId,
        after: { pageId: frId, result: "OK" },
      },
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "unknown-error";
    await db.page.update({
      where: { id: enId },
      data: { translationStatus: "FAILED" },
    });
    await db.auditLog.create({
      data: {
        userId,
        action: "TRANSLATE",
        entity: "pages",
        entityId: enId,
        after: { pageId: frId, result: "FAILED", reason },
      },
    });
  }
}
