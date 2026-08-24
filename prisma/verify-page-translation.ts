import "dotenv/config";

import { createRequire } from "node:module";

import { PrismaClient } from "@prisma/client";

// ============================================================
// Test local uniquement — prototype P5 (traduction FR -> EN,
// modèle Page exclusivement, périmètre restreint à
// title/headline/description/SEO). N'utilise jamais une base
// Preview/Production : DATABASE_URL doit pointer sur le Postgres
// Docker local (localhost:5433), vérifié ci-dessous avant tout écrit.
//
// Miroir exact de prisma/verify-service-translation.ts. Voir ce fichier
// pour le détail de la technique de mock (substitution du cache
// CommonJS pour "server-only" et "@google/genai" avant l'import du
// module testé, sans jamais toucher au fichier source). Ce script
// ajoute un scénario propre à Page (G) qui n'existe pas ailleurs :
// vérifier que les pages exclues (accueil, légales, formation-ia-*)
// sont bien refusées avant toute autre logique.
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

const TEST_TAG = `test-p5-translation-${Date.now()}`;
const results: Array<{ scenario: string; ok: boolean; detail?: string }> = [];

function check(scenario: string, condition: boolean, detail?: string) {
  results.push({ scenario, ok: condition, detail });
}

async function main() {
  const {
    beginPageTranslation,
    finishPageTranslation,
    validatePageTranslationOutput,
    isExcludedPage,
  } = await import("../lib/translation/page-translator");

  // ---- Scénario G — exclusions (unitaire, sans base) ----
  check("G — isExcludedPage('accueil')", isExcludedPage("accueil") === true);
  check(
    "G — isExcludedPage('conditions')",
    isExcludedPage("conditions") === true,
  );
  check(
    "G — isExcludedPage('confidentialite')",
    isExcludedPage("confidentialite") === true,
  );
  check(
    "G — isExcludedPage('mentions-legales')",
    isExcludedPage("mentions-legales") === true,
  );
  check(
    "G — isExcludedPage('formation-ia-test')",
    isExcludedPage("formation-ia-test") === true,
  );
  check(
    "G — isExcludedPage('test-p5-page-verification') est FAUX (page autorisée)",
    isExcludedPage("test-p5-page-verification") === false,
  );

  // ---- Scénario C — sortie invalide ----
  const badShapeResult = validatePageTranslationOutput(
    { title: "FR", headline: "FR headline", description: "FR desc" },
    { title: "EN" },
  );
  check(
    "C — JSON incomplet (champs manquants) rejeté",
    !badShapeResult.ok && badShapeResult.reason === "invalid-json-shape",
  );

  // ---- Scénario F — nombres / URL / marque préservés ----
  const frFixture = {
    title: "Audit IA",
    headline: "Un accompagnement à 4 900€",
    description:
      "Notre offre Sapiens-IA coûte 4 900€, voir https://sapiens-ia.test/offre.",
  };
  const goodCandidate = {
    title: "AI Audit",
    headline: "Support starting at 4 900€",
    description:
      "Our Sapiens-IA offer costs 4 900€, see https://sapiens-ia.test/offre.",
    seoTitle: "AI Audit — Sapiens-IA",
    seoDescription: "Professional AI audit support by Sapiens-IA.",
  };
  check(
    "F — traduction valide acceptée",
    validatePageTranslationOutput(frFixture, goodCandidate).ok === true,
  );
  check(
    "F — nombre manquant rejeté",
    !validatePageTranslationOutput(frFixture, {
      ...goodCandidate,
      headline: "Support included",
      description:
        "Our Sapiens-IA offer is affordable, see https://sapiens-ia.test/offre.",
    }).ok,
  );
  check(
    "F — URL manquante rejetée",
    !validatePageTranslationOutput(frFixture, {
      ...goodCandidate,
      description: "Our Sapiens-IA offer costs 4 900€.",
    }).ok,
  );
  check(
    "F — marque altérée rejetée",
    !validatePageTranslationOutput(frFixture, {
      ...goodCandidate,
      description:
        "Our Sapiens IA offer costs 4 900€, see https://sapiens-ia.test/offre.",
    }).ok,
  );

  // ---- Scénario G(bis) — exclusion appliquée en base réelle, sans
  // jamais créer ni modifier de ligne EN ----
  const excludedFr = await db.page.create({
    data: {
      locale: "fr",
      // Doit VRAIMENT commencer par "formation-ia-" pour déclencher
      // isExcludedPage — le tag de nettoyage est mis à la fin, pas au
      // début, précisément pour ça.
      slug: `formation-ia-${TEST_TAG}`,
      title: "TEST — Page exclue",
      status: "DRAFT",
    },
  });
  try {
    const beginExcluded = await beginPageTranslation(excludedFr.id);
    check(
      "G(bis) — beginPageTranslation refuse un slug 'formation-ia-*' réel",
      beginExcluded.proceed === false &&
        beginExcluded.reason === "excluded-page",
    );
    const enCountExcluded = await db.page.count({
      where: { translationOfId: excludedFr.id, locale: "en" },
    });
    check(
      "G(bis) — aucune EN créée pour une page exclue",
      enCountExcluded === 0,
    );
  } finally {
    await db.page.delete({ where: { id: excludedFr.id } });
  }

  // ---- Données de test isolées (base locale uniquement), page
  // AUTORISÉE (slug hors exclusions) ----
  const fr = await db.page.create({
    data: {
      locale: "fr",
      slug: `${TEST_TAG}-page`,
      title: "TEST — Page IA",
      headline: "Un accompagnement à 4 900€",
      description:
        "Notre offre Sapiens-IA coûte 4 900€, voir https://sapiens-ia.test/offre.",
      status: "DRAFT",
    },
  });

  try {
    // ---- Protection des EN existantes — mesurée AVANT toute donnée de
    // test pour ne pas fausser le ratio.
    const protectedCountBefore = await db.page.count({
      where: {
        locale: "en",
        translationOfId: { not: null },
        translationEditedAt: { not: null },
      },
    });
    const totalTranslatedEnBefore = await db.page.count({
      where: { locale: "en", translationOfId: { not: null } },
    });
    console.info(
      `Vérification protection EN Page existantes : ${protectedCountBefore}/${totalTranslatedEnBefore} ont translationEditedAt renseigné.`,
    );

    // ---- Scénario A — FR sans EN -> création DRAFT + PENDING, sections
    // jamais lues/écrites ----
    const beginA = await beginPageTranslation(fr.id);
    check("A — beginPageTranslation proceed=true", beginA.proceed === true);
    if (beginA.proceed) {
      const enA = await db.page.findUnique({
        where: { id: beginA.enId },
        include: { sections: true },
      });
      check(
        "A — EN créée en DRAFT/PENDING liée au FR",
        enA?.locale === "en" &&
          enA?.translationOfId === fr.id &&
          enA?.status === "DRAFT" &&
          enA?.translationStatus === "PENDING",
      );
      check("A — sections de l'EN créée = []", enA?.sections.length === 0);

      // ---- Scénario D — double déclenchement -> pas de 2e EN ----
      const beginD = await beginPageTranslation(fr.id);
      check(
        "D — 2e déclenchement immédiat rejeté (rate-limit)",
        beginD.proceed === false && beginD.reason === "rate-limited",
      );
      const enCount = await db.page.count({
        where: { translationOfId: fr.id, locale: "en" },
      });
      check(
        "D — une seule EN existe après double déclenchement",
        enCount === 1,
      );

      // ---- Scénario finish (succès, mock LLM) ----
      setMockTranslation(goodCandidate);
      await finishPageTranslation(fr.id, beginA.enId);
      const enOk = await db.page.findUnique({
        where: { id: beginA.enId },
        include: { sections: true, seo: true },
      });
      check(
        "A(bis) — finish OK écrit le contenu traduit et le statut OK",
        enOk?.translationStatus === "OK" &&
          enOk?.title === goodCandidate.title &&
          enOk?.headline === goodCandidate.headline &&
          enOk?.description === goodCandidate.description &&
          enOk?.translationGeneratedAt !== null,
      );
      check(
        "A(bis) — sections toujours vides après traduction",
        enOk?.sections.length === 0,
      );
      check(
        "A(bis) — SEO généré (title + description)",
        enOk?.seo?.title === goodCandidate.seoTitle &&
          enOk?.seo?.description === goodCandidate.seoDescription,
      );

      // ---- Scénario C(bis) — sortie invalide en sortie réelle du LLM ----
      await db.page.update({
        where: { id: beginA.enId },
        data: { translationStatus: "PENDING" },
      });
      setMockTranslation({ title: "EN" });
      const beforeInvalid = await db.page.findUnique({
        where: { id: beginA.enId },
      });
      await finishPageTranslation(fr.id, beginA.enId);
      const afterInvalid = await db.page.findUnique({
        where: { id: beginA.enId },
      });
      check(
        "C(bis) — sortie invalide -> statut FAILED, aucune écriture partielle",
        afterInvalid?.translationStatus === "FAILED" &&
          afterInvalid?.title === beforeInvalid?.title,
      );
      const auditInvalid = await db.auditLog.findFirst({
        where: { entity: "pages", entityId: beginA.enId, action: "TRANSLATE" },
        orderBy: { createdAt: "desc" },
      });
      check(
        "C(bis) — AuditLog trace l'échec avec la raison",
        (auditInvalid?.after as { result?: string } | null)?.result ===
          "FAILED",
      );

      // ---- Scénario E — erreur API (clé absente) ----
      await db.page.update({
        where: { id: beginA.enId },
        data: { translationStatus: "PENDING" },
      });
      const savedKey = process.env.GEMINI_API_KEY;
      delete process.env.GEMINI_API_KEY;
      const frBeforeError = await db.page.findUnique({ where: { id: fr.id } });
      await finishPageTranslation(fr.id, beginA.enId);
      if (savedKey !== undefined) process.env.GEMINI_API_KEY = savedKey;
      const enAfterError = await db.page.findUnique({
        where: { id: beginA.enId },
      });
      const frAfterError = await db.page.findUnique({ where: { id: fr.id } });
      check(
        "E — clé API absente -> EN passe en FAILED, FR inchangé",
        enAfterError?.translationStatus === "FAILED" &&
          frAfterError?.title === frBeforeError?.title &&
          frAfterError?.updatedAt.getTime() ===
            frBeforeError?.updatedAt.getTime(),
      );
    }

    // ---- Scénario B — EN déjà éditée manuellement -> jamais écrasée ----
    const fr2 = await db.page.create({
      data: {
        locale: "fr",
        slug: `${TEST_TAG}-page-2`,
        title: "TEST — Page Data",
        status: "DRAFT",
      },
    });
    const en2 = await db.page.create({
      data: {
        locale: "en",
        slug: `${TEST_TAG}-page-2`,
        title: "TEST EN — Edited by human, do not overwrite",
        status: "DRAFT",
        translationOfId: fr2.id,
        translationStatus: "OK",
        translationSourceHash: "irrelevant-old-hash",
        translationEditedAt: new Date(),
      },
    });
    const beginB = await beginPageTranslation(fr2.id);
    check(
      "B — régénération auto refusée sur EN éditée manuellement",
      beginB.proceed === false &&
        beginB.reason === "translation-manually-edited",
    );
    const en2After = await db.page.findUnique({ where: { id: en2.id } });
    check(
      "B — contenu EN édité manuellement inchangé",
      en2After?.title === en2.title,
    );
  } finally {
    await db.page.deleteMany({ where: { slug: { startsWith: TEST_TAG } } });
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
