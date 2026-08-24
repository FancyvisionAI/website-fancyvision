import "server-only";

import { createHash } from "node:crypto";

import { GoogleGenAI } from "@google/genai";
import { Prisma } from "@prisma/client";
import { z } from "zod";

import { db } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

// ============================================================
// Prototype de traduction automatique FR → EN — modèle Training
// UNIQUEMENT (voir consigne P3). Ne pas généraliser à Article, Page,
// CaseStudy, Faq ou Event sans validation explicite.
//
// Miroir structurel de lib/translation/service-translator.ts, adapté
// aux champs propres à Training (objectives, audience, modules,
// duration). Volontairement dupliqué plutôt que partagé avec le fichier
// Service : la forme des données diffère assez pour qu'un partage forcé
// ajoute de la complexité, et ce fichier ne doit jamais risquer de
// modifier le comportement Service déjà validé en réel.
// ============================================================

const GEMINI_MODEL = "gemini-3.5-flash";

// ---- Arbre Tiptap : identique à service-translator.ts ----
type TiptapNode = {
  type?: string;
  text?: string;
  marks?: unknown[];
  attrs?: unknown;
  content?: TiptapNode[];
  [key: string]: unknown;
};

function extractTexts(node: TiptapNode, out: string[] = []): string[] {
  if (typeof node.text === "string") out.push(node.text);
  if (Array.isArray(node.content)) {
    for (const child of node.content) extractTexts(child, out);
  }
  return out;
}

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

type TrainingModule = { title: string; description: string };

/** Hash stable des seuls champs réellement envoyés à la traduction. */
export function hashTrainingSource(fr: {
  title: string;
  excerpt: string;
  content: unknown;
  objectives: string[];
  audience: string[];
  modules: unknown;
  duration: string | null;
}): string {
  return createHash("sha256")
    .update(fr.title, "utf8")
    .update(" ")
    .update(fr.excerpt, "utf8")
    .update(" ")
    .update(JSON.stringify(fr.content))
    .update(" ")
    .update(JSON.stringify(fr.objectives))
    .update(" ")
    .update(JSON.stringify(fr.audience))
    .update(" ")
    .update(JSON.stringify(fr.modules))
    .update(" ")
    .update(fr.duration ?? "", "utf8")
    .digest("hex");
}

// ---- Appel LLM (Gemini, Structured JSON Output) ----

const trainingTranslationOutputSchema = z.object({
  title: z.string().min(1),
  excerpt: z.string().min(1),
  contentTexts: z.array(z.string()),
  objectives: z.array(z.string()),
  audience: z.array(z.string()),
  modules: z.array(z.object({ title: z.string(), description: z.string() })),
  duration: z.string(),
  seoTitle: z.string().min(1),
  seoDescription: z.string().min(1),
});
type TrainingTranslationOutput = z.infer<
  typeof trainingTranslationOutputSchema
>;

type TrainingTranslationInput = {
  title: string;
  excerpt: string;
  contentTexts: string[];
  objectives: string[];
  audience: string[];
  modules: TrainingModule[];
  duration: string;
};

const TRAINING_SYSTEM_PROMPT = `Tu traduis le contenu marketing B2B d'un cabinet de conseil en IA, du français vers l'anglais, pour une fiche de formation professionnelle (catalogue de formations).

Règles strictes :
- Ton professionnel B2B, clair, sans familiarité.
- N'invente aucune information absente du texte source.
- Ne supprime aucune information présente dans le texte source.
- Conserve exactement les chiffres, prix, dates et URLs — ne les traduis jamais, ne les reformule jamais.
- Le nom de marque "Sapiens-IA" doit rester EXACTEMENT "Sapiens-IA" dans la sortie, jamais traduit, jamais reformulé, jamais "Sapiens IA" sans trait d'union.
- Respecte la terminologie professionnelle Data / IA déjà en usage dans le secteur (ne francise pas des anglicismes déjà standards, et vice-versa).
- Les tableaux "contentTexts", "objectives", "audience" et "modules" doivent chacun contenir EXACTEMENT le même nombre d'éléments que le tableau fourni en entrée, dans le même ordre — un élément traduit pour un élément source, jamais plus, jamais moins, jamais fusionné.
- Le champ "duration" doit être traduit dans un anglais idiomatique de durée (ex : "1 journée" → "1 day", "1 à 2 heures" → "1 to 2 hours"), sans inventer de valeur si le texte source est vide.
- Réponds UNIQUEMENT via l'outil fourni. Aucun texte, aucune explication en dehors de l'appel d'outil.`;

function buildTrainingUserPrompt(fr: TrainingTranslationInput) {
  return JSON.stringify(
    {
      title: fr.title,
      excerpt: fr.excerpt,
      contentTexts: fr.contentTexts,
      objectives: fr.objectives,
      audience: fr.audience,
      modules: fr.modules,
      duration: fr.duration,
    },
    null,
    2,
  );
}

// Même structure que le schéma Anthropic de service-translator.ts,
// reformulée en JSON Schema pour Structured JSON Output Gemini.
const GEMINI_TRAINING_RESPONSE_SCHEMA = {
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
    objectives: {
      type: "array",
      items: { type: "string" },
      description:
        "Un élément traduit par élément source, même ordre, même nombre.",
    },
    audience: {
      type: "array",
      items: { type: "string" },
      description:
        "Un élément traduit par élément source, même ordre, même nombre.",
    },
    modules: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
        },
        required: ["title", "description"],
      },
      description:
        "Un module traduit par module source, même ordre, même nombre.",
    },
    duration: { type: "string" },
    seoTitle: {
      type: "string",
      description: "Titre SEO anglais, environ 60 caractères.",
    },
    seoDescription: {
      type: "string",
      description: "Meta description anglaise, environ 150-160 caractères.",
    },
  },
  required: [
    "title",
    "excerpt",
    "contentTexts",
    "objectives",
    "audience",
    "modules",
    "duration",
    "seoTitle",
    "seoDescription",
  ],
};

async function callGeminiTrainingTranslate(
  fr: TrainingTranslationInput,
): Promise<TrainingTranslationOutput> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("missing-gemini-api-key");
  const client = new GoogleGenAI({ apiKey });

  const interaction = await client.interactions.create({
    model: GEMINI_MODEL,
    system_instruction: TRAINING_SYSTEM_PROMPT,
    input: buildTrainingUserPrompt(fr),
    response_format: {
      type: "text",
      mime_type: "application/json",
      schema: GEMINI_TRAINING_RESPONSE_SCHEMA,
    },
  });

  if (!interaction.output_text) throw new Error("no-output-in-response");
  let raw: unknown;
  try {
    raw = JSON.parse(interaction.output_text);
  } catch {
    throw new Error("invalid-tool-output-shape");
  }
  const parsed = trainingTranslationOutputSchema.safeParse(raw);
  if (!parsed.success) throw new Error("invalid-tool-output-shape");
  return parsed.data;
}

// ---- Validation de sortie ----

export type TrainingValidationResult =
  { ok: true; data: TrainingTranslationOutput } | { ok: false; reason: string };

export function validateTrainingTranslationOutput(
  fr: TrainingTranslationInput,
  candidate: unknown,
): TrainingValidationResult {
  const parsed = trainingTranslationOutputSchema.safeParse(candidate);
  if (!parsed.success) return { ok: false, reason: "invalid-json-shape" };
  const output = parsed.data;

  if (output.contentTexts.length !== fr.contentTexts.length) {
    return { ok: false, reason: "content-texts-count-mismatch" };
  }
  if (output.objectives.length !== fr.objectives.length) {
    return { ok: false, reason: "objectives-count-mismatch" };
  }
  if (output.audience.length !== fr.audience.length) {
    return { ok: false, reason: "audience-count-mismatch" };
  }
  if (output.modules.length !== fr.modules.length) {
    return { ok: false, reason: "modules-count-mismatch" };
  }

  const frFullText = joinTexts([
    fr.title,
    fr.excerpt,
    ...fr.contentTexts,
    ...fr.objectives,
    ...fr.audience,
    ...fr.modules.flatMap((m) => [m.title, m.description]),
    fr.duration,
  ]);
  const enFullText = joinTexts([
    output.title,
    output.excerpt,
    ...output.contentTexts,
    ...output.objectives,
    ...output.audience,
    ...output.modules.flatMap((m) => [m.title, m.description]),
    output.duration,
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
// Miroir exact de beginServiceTranslation / finishServiceTranslation.
// ============================================================

function normalizeModules(raw: unknown): TrainingModule[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((m) => {
    const entry = m as { title?: unknown; description?: unknown };
    return {
      title: typeof entry.title === "string" ? entry.title : "",
      description:
        typeof entry.description === "string" ? entry.description : "",
    };
  });
}

async function findLinkedEnTraining(frId: string) {
  return db.training.findFirst({
    where: { translationOfId: frId, locale: "en" },
  });
}

export async function beginTrainingTranslation(
  frId: string,
  options: { force?: boolean } = {},
): Promise<
  { proceed: false; reason: string } | { proceed: true; enId: string }
> {
  const fr = await db.training.findUnique({
    where: { id: frId },
    select: {
      id: true,
      slug: true,
      locale: true,
      translationOfId: true,
      title: true,
      excerpt: true,
      content: true,
      objectives: true,
      audience: true,
      modules: true,
      duration: true,
      image: true,
      pdfUrl: true,
      categoryId: true,
      instructor: true,
      difficulty: true,
      priceCents: true,
    },
  });
  if (!fr || fr.locale !== "fr" || fr.translationOfId) {
    return { proceed: false, reason: "not-a-fr-source-training" };
  }

  const limit = rateLimit(`translate:training:${frId}`, 1, 30_000);
  if (!limit.allowed && !options.force) {
    return { proceed: false, reason: "rate-limited" };
  }

  const existingEn = await findLinkedEnTraining(frId);
  const sourceHash = hashTrainingSource(fr);

  if (!existingEn) {
    // Cas A — aucune EN liée : création immédiate (contenu FR recopié
    // comme placeholder, y compris objectives/audience/modules/duration,
    // le temps de la vraie traduction). instructor/difficulty/priceCents
    // ne sont jamais traduits, recopiés tels quels. Slug identique au FR,
    // même convention que Service.
    const created = await db.training.create({
      data: {
        locale: "en",
        slug: fr.slug,
        title: fr.title,
        excerpt: fr.excerpt,
        content: fr.content as Prisma.InputJsonValue,
        objectives: fr.objectives,
        audience: fr.audience,
        modules: fr.modules as Prisma.InputJsonValue,
        duration: fr.duration,
        image: fr.image,
        pdfUrl: fr.pdfUrl,
        categoryId: fr.categoryId,
        instructor: fr.instructor,
        difficulty: fr.difficulty,
        priceCents: fr.priceCents,
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

  // Cas B (ou C forcé) — mise à jour de la ligne EN existante.
  await db.training.update({
    where: { id: existingEn.id },
    data: { translationStatus: "PENDING" },
  });
  return { proceed: true, enId: existingEn.id };
}

export async function finishTrainingTranslation(
  frId: string,
  enId: string,
  userId?: string,
) {
  const fr = await db.training.findUnique({
    where: { id: frId },
    select: {
      id: true,
      title: true,
      excerpt: true,
      content: true,
      objectives: true,
      audience: true,
      modules: true,
      duration: true,
    },
  });
  if (!fr) return;

  const contentTexts = extractTexts(fr.content as TiptapNode);
  const modules = normalizeModules(fr.modules);
  const input: TrainingTranslationInput = {
    title: fr.title,
    excerpt: fr.excerpt,
    contentTexts,
    objectives: fr.objectives,
    audience: fr.audience,
    modules,
    duration: fr.duration ?? "",
  };
  const sourceHash = hashTrainingSource(fr);

  try {
    const raw = await callGeminiTrainingTranslate(input);
    const validation = validateTrainingTranslationOutput(input, raw);
    if (!validation.ok) throw new Error(validation.reason);

    const translatedContent = applyTexts(
      fr.content as TiptapNode,
      validation.data.contentTexts,
    );

    await db.training.update({
      where: { id: enId },
      data: {
        title: validation.data.title,
        excerpt: validation.data.excerpt,
        content: translatedContent as Prisma.InputJsonValue,
        objectives: validation.data.objectives,
        audience: validation.data.audience,
        modules: validation.data.modules as Prisma.InputJsonValue,
        duration: validation.data.duration,
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
        entity: "trainings",
        entityId: enId,
        after: { trainingId: frId, result: "OK" },
      },
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "unknown-error";
    await db.training.update({
      where: { id: enId },
      data: { translationStatus: "FAILED" },
    });
    await db.auditLog.create({
      data: {
        userId,
        action: "TRANSLATE",
        entity: "trainings",
        entityId: enId,
        after: { trainingId: frId, result: "FAILED", reason },
      },
    });
  }
}
