import "server-only";

import { createHash } from "node:crypto";

import { GoogleGenAI } from "@google/genai";
import { Prisma } from "@prisma/client";
import { z } from "zod";

import { db } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

// ============================================================
// Prototype de traduction automatique FR → EN — modèle Article
// UNIQUEMENT (voir consigne P4). Ne pas généraliser à Page,
// CaseStudy, Faq ou Event sans validation explicite.
//
// Miroir structurel de lib/translation/service-translator.ts (Article
// a la même forme de données que Service : title/excerpt/content/seo,
// sans champs structurés supplémentaires comme Training). Volontairement
// dupliqué plutôt que partagé : ce fichier ne doit jamais risquer de
// modifier le comportement Service ou Training déjà validés en réel.
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

/** Hash stable des seuls champs réellement envoyés à la traduction. */
export function hashArticleSource(fr: {
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

// ---- Appel LLM (Gemini, Structured JSON Output) ----

const articleTranslationOutputSchema = z.object({
  title: z.string().min(1),
  excerpt: z.string().min(1),
  contentTexts: z.array(z.string()),
  seoTitle: z.string().min(1),
  seoDescription: z.string().min(1),
});
type ArticleTranslationOutput = z.infer<typeof articleTranslationOutputSchema>;

type ArticleTranslationInput = {
  title: string;
  excerpt: string;
  contentTexts: string[];
};

const ARTICLE_SYSTEM_PROMPT = `Tu traduis un article de blog éditorial d'un cabinet de conseil en IA, du français vers l'anglais.

Règles strictes :
- Ton éditorial, clair, informatif, professionnel mais accessible (article de blog, pas une fiche commerciale).
- N'invente aucune information absente du texte source.
- Ne supprime aucune information présente dans le texte source.
- Conserve exactement les chiffres, prix, dates et URLs — ne les traduis jamais, ne les reformule jamais.
- Le nom de marque "Sapiens-IA" doit rester EXACTEMENT "Sapiens-IA" dans la sortie, jamais traduit, jamais reformulé, jamais "Sapiens IA" sans trait d'union.
- Respecte la terminologie professionnelle Data / IA déjà en usage dans le secteur (ne francise pas des anglicismes déjà standards, et vice-versa).
- Le tableau "contentTexts" doit contenir EXACTEMENT le même nombre d'éléments que le tableau fourni en entrée, dans le même ordre — un élément traduit pour un élément source, jamais plus, jamais moins, jamais fusionné.
- Réponds UNIQUEMENT via l'outil fourni. Aucun texte, aucune explication en dehors de l'appel d'outil.`;

function buildArticleUserPrompt(fr: ArticleTranslationInput) {
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

const GEMINI_ARTICLE_RESPONSE_SCHEMA = {
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

async function callGeminiArticleTranslate(
  fr: ArticleTranslationInput,
): Promise<ArticleTranslationOutput> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("missing-gemini-api-key");
  const client = new GoogleGenAI({ apiKey });

  const interaction = await client.interactions.create({
    model: GEMINI_MODEL,
    system_instruction: ARTICLE_SYSTEM_PROMPT,
    input: buildArticleUserPrompt(fr),
    response_format: {
      type: "text",
      mime_type: "application/json",
      schema: GEMINI_ARTICLE_RESPONSE_SCHEMA,
    },
  });

  if (!interaction.output_text) throw new Error("no-output-in-response");
  let raw: unknown;
  try {
    raw = JSON.parse(interaction.output_text);
  } catch {
    throw new Error("invalid-tool-output-shape");
  }
  const parsed = articleTranslationOutputSchema.safeParse(raw);
  if (!parsed.success) throw new Error("invalid-tool-output-shape");
  return parsed.data;
}

// ---- Validation de sortie ----

export type ArticleValidationResult =
  { ok: true; data: ArticleTranslationOutput } | { ok: false; reason: string };

export function validateArticleTranslationOutput(
  fr: ArticleTranslationInput,
  candidate: unknown,
): ArticleValidationResult {
  const parsed = articleTranslationOutputSchema.safeParse(candidate);
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
// Miroir exact de beginServiceTranslation / finishServiceTranslation.
// ============================================================

async function findLinkedEnArticle(frId: string) {
  return db.article.findFirst({
    where: { translationOfId: frId, locale: "en" },
  });
}

export async function beginArticleTranslation(
  frId: string,
  options: { force?: boolean } = {},
): Promise<
  { proceed: false; reason: string } | { proceed: true; enId: string }
> {
  const fr = await db.article.findUnique({
    where: { id: frId },
    select: {
      id: true,
      slug: true,
      locale: true,
      translationOfId: true,
      title: true,
      excerpt: true,
      content: true,
      coverImage: true,
      categoryId: true,
      authorId: true,
      readingTime: true,
      featured: true,
    },
  });
  if (!fr || fr.locale !== "fr" || fr.translationOfId) {
    return { proceed: false, reason: "not-a-fr-source-article" };
  }

  const limit = rateLimit(`translate:article:${frId}`, 1, 30_000);
  if (!limit.allowed && !options.force) {
    return { proceed: false, reason: "rate-limited" };
  }

  const existingEn = await findLinkedEnArticle(frId);
  const sourceHash = hashArticleSource(fr);

  if (!existingEn) {
    // Cas A — aucune EN liée : création immédiate (contenu FR recopié
    // comme placeholder le temps de la vraie traduction). authorId est
    // recopié à l'identique (jamais traduit — c'est la même personne
    // auteure) ; categoryId/coverImage/readingTime/featured préservés.
    // Slug identique au FR, même convention que Service/Training.
    const created = await db.article.create({
      data: {
        locale: "en",
        slug: fr.slug,
        title: fr.title,
        excerpt: fr.excerpt,
        content: fr.content as Prisma.InputJsonValue,
        coverImage: fr.coverImage,
        categoryId: fr.categoryId,
        authorId: fr.authorId,
        readingTime: fr.readingTime,
        featured: fr.featured,
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
  await db.article.update({
    where: { id: existingEn.id },
    data: { translationStatus: "PENDING" },
  });
  return { proceed: true, enId: existingEn.id };
}

export async function finishArticleTranslation(
  frId: string,
  enId: string,
  userId?: string,
) {
  const fr = await db.article.findUnique({
    where: { id: frId },
    select: { id: true, title: true, excerpt: true, content: true },
  });
  if (!fr) return;

  const contentTexts = extractTexts(fr.content as TiptapNode);
  const sourceHash = hashArticleSource(fr);

  try {
    const raw = await callGeminiArticleTranslate({
      title: fr.title,
      excerpt: fr.excerpt,
      contentTexts,
    });
    const validation = validateArticleTranslationOutput(
      { title: fr.title, excerpt: fr.excerpt, contentTexts },
      raw,
    );
    if (!validation.ok) throw new Error(validation.reason);

    const translatedContent = applyTexts(
      fr.content as TiptapNode,
      validation.data.contentTexts,
    );

    await db.article.update({
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
        entity: "articles",
        entityId: enId,
        after: { articleId: frId, result: "OK" },
      },
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "unknown-error";
    await db.article.update({
      where: { id: enId },
      data: { translationStatus: "FAILED" },
    });
    await db.auditLog.create({
      data: {
        userId,
        action: "TRANSLATE",
        entity: "articles",
        entityId: enId,
        after: { articleId: frId, result: "FAILED", reason },
      },
    });
  }
}
