import "dotenv/config";

import { createRequire } from "node:module";

import { PrismaClient } from "@prisma/client";

// ============================================================
// Test local uniquement — prototype P4 (traduction FR -> EN,
// modèle Article exclusivement). N'utilise jamais une base
// Preview/Production : DATABASE_URL doit pointer sur le Postgres
// Docker local (localhost:5433), vérifié ci-dessous avant tout écrit.
//
// Miroir exact de prisma/verify-service-translation.ts. Voir ce fichier
// pour le détail de la technique de mock (substitution du cache
// CommonJS pour "server-only" et "@google/genai" avant l'import du
// module testé, sans jamais toucher au fichier source).
// ============================================================

const db = new PrismaClient();
const require = createRequire(import.meta.url);

if (!/localhost:5433/.test(process.env.DATABASE_URL ?? "")) {
  throw new Error(
    "Ce script ne doit tourner que sur la base Docker locale (localhost:5433). Abandon par sécurité.",
  );
}

const serverOnlyPath = require.resolve("server-only");
require.cache[serverOnlyPath] = {
  id: serverOnlyPath,
  filename: serverOnlyPath,
  loaded: true,
  exports: {},
} as unknown as NodeJS.Module;

type MockToolResponse = { output_text: string };
let mockCandidate: unknown = {};
function setMockTranslation(input: unknown) {
  mockCandidate = input;
}

class FakeGoogleGenAI {
  interactions = {
    create: async (): Promise<MockToolResponse> => ({
      output_text: JSON.stringify(mockCandidate),
    }),
  };
  constructor(_opts: { apiKey: string }) {}
}
const genaiPath = require.resolve("@google/genai");
require.cache[genaiPath] = {
  id: genaiPath,
  filename: genaiPath,
  loaded: true,
  exports: { __esModule: true, GoogleGenAI: FakeGoogleGenAI },
} as unknown as NodeJS.Module;

// L'appel réseau est entièrement mocké (FakeGoogleGenAI ci-dessus) : cette
// clé n'est jamais utilisée pour un vrai appel, elle sert seulement à
// passer le garde-fou `if (!apiKey)`. Scénario E la retire temporairement
// pour tester précisément ce garde-fou.
process.env.GEMINI_API_KEY ??= "test-mock-key-not-real";

const TEST_TAG = `test-p4-translation-${Date.now()}`;
const results: Array<{ scenario: string; ok: boolean; detail?: string }> = [];

function check(scenario: string, condition: boolean, detail?: string) {
  results.push({ scenario, ok: condition, detail });
}

async function main() {
  const {
    beginArticleTranslation,
    finishArticleTranslation,
    validateArticleTranslationOutput,
  } = await import("../lib/translation/article-translator");

  // ---- Scénario C — sortie invalide (nombre d'éléments incorrect) ----
  const badCountResult = validateArticleTranslationOutput(
    { title: "FR", excerpt: "FR excerpt", contentTexts: ["a", "b"] },
    {
      title: "EN",
      excerpt: "EN excerpt",
      contentTexts: ["only one"],
      seoTitle: "SEO",
      seoDescription: "SEO desc",
    },
  );
  check(
    "C — contentTexts.length mismatch rejeté",
    !badCountResult.ok &&
      badCountResult.reason === "content-texts-count-mismatch",
  );

  const badShapeResult = validateArticleTranslationOutput(
    { title: "FR", excerpt: "FR excerpt", contentTexts: [] },
    { title: "EN" },
  );
  check(
    "C — JSON incomplet (champs manquants) rejeté",
    !badShapeResult.ok && badShapeResult.reason === "invalid-json-shape",
  );

  // ---- Scénario F — nombres / URL / marque préservés ----
  const frFixture = {
    title: "Audit IA",
    excerpt: "Un accompagnement à 4 900€.",
    contentTexts: [
      "Notre offre Sapiens-IA coûte 4 900€, voir https://sapiens-ia.test/offre.",
    ],
  };
  const goodCandidate = {
    title: "AI Audit",
    excerpt: "Support starting at 4 900€.",
    contentTexts: [
      "Our Sapiens-IA offer costs 4 900€, see https://sapiens-ia.test/offre.",
    ],
    seoTitle: "AI Audit — Sapiens-IA",
    seoDescription: "Professional AI audit support by Sapiens-IA.",
  };
  check(
    "F — traduction valide acceptée",
    validateArticleTranslationOutput(frFixture, goodCandidate).ok === true,
  );
  check(
    "F — nombre manquant rejeté",
    !validateArticleTranslationOutput(frFixture, {
      ...goodCandidate,
      excerpt: "Support included.",
      contentTexts: [
        "Our Sapiens-IA offer is affordable, see https://sapiens-ia.test/offre.",
      ],
    }).ok,
  );
  check(
    "F — URL manquante rejetée",
    !validateArticleTranslationOutput(frFixture, {
      ...goodCandidate,
      contentTexts: ["Our Sapiens-IA offer costs 4 900€."],
    }).ok,
  );
  check(
    "F — marque altérée rejetée",
    !validateArticleTranslationOutput(frFixture, {
      ...goodCandidate,
      contentTexts: [
        "Our Sapiens IA offer costs 4 900€, see https://sapiens-ia.test/offre.",
      ],
    }).ok,
  );

  // ---- Auteur de test (réutilise un utilisateur existant réel, jamais
  // inventé) ----
  const testAuthor = await db.user.findFirst({ select: { id: true } });
  if (!testAuthor) throw new Error("Aucun utilisateur en base pour le test.");

  // ---- Données de test isolées (base locale uniquement), contenu
  // Tiptap structuré (heading + paragraphe + liste) comme un vrai article ----
  const fr = await db.article.create({
    data: {
      locale: "fr",
      slug: `${TEST_TAG}-article`,
      title: "TEST — Article IA",
      excerpt: "TEST PREVIEW — Ne pas publier.",
      authorId: testAuthor.id,
      content: {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "Introduction" }],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Notre offre Sapiens-IA coûte 4 900€, voir https://sapiens-ia.test/offre.",
              },
            ],
          },
          {
            type: "bulletList",
            content: [
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: "Premier point clé" }],
                  },
                ],
              },
            ],
          },
        ],
      },
      status: "DRAFT",
    },
  });

  try {
    // ---- Protection des EN existantes — mesurée AVANT toute donnée de
    // test pour ne pas fausser le ratio avec les lignes créées ci-dessous.
    const protectedCountBefore = await db.article.count({
      where: {
        locale: "en",
        translationOfId: { not: null },
        translationEditedAt: { not: null },
      },
    });
    const totalTranslatedEnBefore = await db.article.count({
      where: { locale: "en", translationOfId: { not: null } },
    });
    console.info(
      `Vérification protection EN Article existantes : ${protectedCountBefore}/${totalTranslatedEnBefore} ont translationEditedAt renseigné.`,
    );

    // ---- Scénario A — FR sans EN -> création DRAFT + PENDING ----
    const beginA = await beginArticleTranslation(fr.id);
    check("A — beginArticleTranslation proceed=true", beginA.proceed === true);
    if (beginA.proceed) {
      const enA = await db.article.findUnique({ where: { id: beginA.enId } });
      check(
        "A — EN créée en DRAFT/PENDING liée au FR",
        enA?.locale === "en" &&
          enA?.translationOfId === fr.id &&
          enA?.status === "DRAFT" &&
          enA?.translationStatus === "PENDING",
      );
      check(
        "A — authorId EN identique au FR (jamais traduit)",
        enA?.authorId === testAuthor.id,
      );

      // ---- Scénario D — double déclenchement -> pas de 2e EN ----
      const beginD = await beginArticleTranslation(fr.id);
      check(
        "D — 2e déclenchement immédiat rejeté (rate-limit)",
        beginD.proceed === false && beginD.reason === "rate-limited",
      );
      const enCount = await db.article.count({
        where: { translationOfId: fr.id, locale: "en" },
      });
      check(
        "D — une seule EN existe après double déclenchement",
        enCount === 1,
      );

      // ---- Scénario finish (succès, mock LLM) — vérifie l'écriture réelle,
      // y compris le contenu Tiptap structuré (heading + liste préservés) ----
      const structuredCandidate = {
        title: "TEST — AI Article",
        excerpt: "TEST PREVIEW — Do not publish.",
        contentTexts: [
          "Introduction",
          "Our Sapiens-IA offer costs 4 900€, see https://sapiens-ia.test/offre.",
          "First key point",
        ],
        seoTitle: "AI Article — Sapiens-IA",
        seoDescription: "Professional AI article by Sapiens-IA.",
      };
      setMockTranslation(structuredCandidate);
      await finishArticleTranslation(fr.id, beginA.enId);
      const enOk = await db.article.findUnique({
        where: { id: beginA.enId },
      });
      const enContent = enOk?.content as {
        content?: Array<{ type?: string; content?: unknown[] }>;
      };
      check(
        "A(bis) — finish OK écrit le contenu traduit et le statut OK",
        enOk?.translationStatus === "OK" &&
          enOk?.title === structuredCandidate.title &&
          enOk?.translationGeneratedAt !== null,
      );
      check(
        "A(bis) — structure Tiptap préservée (heading + liste toujours présents)",
        enContent?.content?.[0]?.type === "heading" &&
          enContent?.content?.[2]?.type === "bulletList",
      );
      check(
        "A(bis) — authorId EN toujours identique au FR après traduction",
        enOk?.authorId === testAuthor.id,
      );
      const enSeo = await db.seo.findUnique({ where: { articleId: enOk?.id } });
      check(
        "A(bis) — SEO généré (title + description)",
        enSeo?.title === structuredCandidate.seoTitle &&
          enSeo?.description === structuredCandidate.seoDescription,
      );

      // ---- Scénario C(bis) — sortie invalide en sortie réelle du LLM ----
      await db.article.update({
        where: { id: beginA.enId },
        data: { translationStatus: "PENDING" },
      });
      setMockTranslation({
        title: "EN",
        excerpt: "EN",
        contentTexts: ["mismatched"],
        seoTitle: "t",
        seoDescription: "d",
      });
      const beforeInvalid = await db.article.findUnique({
        where: { id: beginA.enId },
      });
      await finishArticleTranslation(fr.id, beginA.enId);
      const afterInvalid = await db.article.findUnique({
        where: { id: beginA.enId },
      });
      check(
        "C(bis) — sortie invalide -> statut FAILED, aucune écriture partielle du contenu",
        afterInvalid?.translationStatus === "FAILED" &&
          JSON.stringify(afterInvalid?.content) ===
            JSON.stringify(beforeInvalid?.content) &&
          afterInvalid?.title === beforeInvalid?.title,
      );
      const auditInvalid = await db.auditLog.findFirst({
        where: {
          entity: "articles",
          entityId: beginA.enId,
          action: "TRANSLATE",
        },
        orderBy: { createdAt: "desc" },
      });
      check(
        "C(bis) — AuditLog trace l'échec avec la raison",
        (auditInvalid?.after as { result?: string } | null)?.result ===
          "FAILED",
      );

      // ---- Scénario E — erreur API (clé absente) ----
      await db.article.update({
        where: { id: beginA.enId },
        data: { translationStatus: "PENDING" },
      });
      const savedKey = process.env.GEMINI_API_KEY;
      delete process.env.GEMINI_API_KEY;
      const frBeforeError = await db.article.findUnique({
        where: { id: fr.id },
      });
      await finishArticleTranslation(fr.id, beginA.enId);
      if (savedKey !== undefined) process.env.GEMINI_API_KEY = savedKey;
      const enAfterError = await db.article.findUnique({
        where: { id: beginA.enId },
      });
      const frAfterError = await db.article.findUnique({
        where: { id: fr.id },
      });
      check(
        "E — clé API absente -> EN passe en FAILED, FR inchangé",
        enAfterError?.translationStatus === "FAILED" &&
          frAfterError?.title === frBeforeError?.title &&
          frAfterError?.updatedAt.getTime() ===
            frBeforeError?.updatedAt.getTime(),
      );
    }

    // ---- Scénario B — EN déjà éditée manuellement -> jamais écrasée ----
    const fr2 = await db.article.create({
      data: {
        locale: "fr",
        slug: `${TEST_TAG}-article-2`,
        title: "TEST — Article Data",
        excerpt: "TEST PREVIEW — Ne pas publier.",
        authorId: testAuthor.id,
        content: { type: "doc", content: [] },
        status: "DRAFT",
      },
    });
    const en2 = await db.article.create({
      data: {
        locale: "en",
        slug: `${TEST_TAG}-article-2`,
        title: "TEST EN — Edited by human, do not overwrite",
        excerpt: "Edited manually.",
        authorId: testAuthor.id,
        content: { type: "doc", content: [] },
        status: "DRAFT",
        translationOfId: fr2.id,
        translationStatus: "OK",
        translationSourceHash: "irrelevant-old-hash",
        translationEditedAt: new Date(),
      },
    });
    const beginB = await beginArticleTranslation(fr2.id);
    check(
      "B — régénération auto refusée sur EN éditée manuellement",
      beginB.proceed === false &&
        beginB.reason === "translation-manually-edited",
    );
    const en2After = await db.article.findUnique({ where: { id: en2.id } });
    check(
      "B — contenu EN édité manuellement inchangé",
      en2After?.title === en2.title,
    );
  } finally {
    await db.article.deleteMany({
      where: { slug: { startsWith: TEST_TAG } },
    });
  }

  const failed = results.filter((r) => !r.ok);
  console.info(JSON.stringify(results, null, 2));
  if (failed.length) {
    throw new Error(
      `${failed.length} scénario(s) en échec : voir détail ci-dessus.`,
    );
  }
  console.info(`${results.length} scénarios vérifiés avec succès.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
