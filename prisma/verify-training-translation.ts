import "dotenv/config";

import { createRequire } from "node:module";

import { PrismaClient } from "@prisma/client";

// ============================================================
// Test local uniquement — prototype P3 (traduction FR -> EN,
// modèle Training exclusivement). N'utilise jamais une base
// Preview/Production : DATABASE_URL doit pointer sur le Postgres
// Docker local (localhost:5433), vérifié ci-dessous avant tout écrit.
//
// Miroir exact de prisma/verify-service-translation.ts, adapté aux
// champs Training (objectives, audience, modules, duration). Voir ce
// fichier pour le détail de la technique de mock (substitution du
// cache CommonJS pour "server-only" et "@google/genai" avant l'import
// du module testé, sans jamais toucher au fichier source).
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

const TEST_TAG = `test-p3-translation-${Date.now()}`;
const results: Array<{ scenario: string; ok: boolean; detail?: string }> = [];

function check(scenario: string, condition: boolean, detail?: string) {
  results.push({ scenario, ok: condition, detail });
}

async function main() {
  const {
    beginTrainingTranslation,
    finishTrainingTranslation,
    validateTrainingTranslationOutput,
  } = await import("../lib/translation/training-translator");

  const frFixture = {
    title: "Formation IA",
    excerpt: "Programme à 4 900€.",
    contentTexts: [
      "Formation Sapiens-IA pratique, 4 900€, voir https://sapiens-ia.test/offre.",
    ],
    objectives: ["Comprendre les modèles Sapiens-IA"],
    audience: ["Dirigeants"],
    modules: [{ title: "Module 1", description: "Introduction pratique" }],
    duration: "1 journée",
  };
  const goodCandidate = {
    title: "AI Training",
    excerpt: "Program at 4 900€.",
    contentTexts: [
      "Hands-on Sapiens-IA training, 4 900€, see https://sapiens-ia.test/offre.",
    ],
    objectives: ["Understand Sapiens-IA models"],
    audience: ["Executives"],
    modules: [{ title: "Module 1", description: "Hands-on introduction" }],
    duration: "1 day",
    seoTitle: "AI Training — Sapiens-IA",
    seoDescription: "Professional AI training by Sapiens-IA.",
  };

  // ---- Scénario C — sortie invalide ----
  check(
    "C — contentTexts.length mismatch rejeté",
    !validateTrainingTranslationOutput(frFixture, {
      ...goodCandidate,
      contentTexts: ["a", "b"],
    }).ok,
  );
  check(
    "C — objectives.length mismatch rejeté",
    !validateTrainingTranslationOutput(frFixture, {
      ...goodCandidate,
      objectives: [],
    }).ok,
  );
  check(
    "C — audience.length mismatch rejeté",
    !validateTrainingTranslationOutput(frFixture, {
      ...goodCandidate,
      audience: ["a", "b"],
    }).ok,
  );
  check(
    "C — modules.length mismatch rejeté",
    !validateTrainingTranslationOutput(frFixture, {
      ...goodCandidate,
      modules: [],
    }).ok,
  );
  check(
    "C — JSON incomplet (champs manquants) rejeté",
    !validateTrainingTranslationOutput(frFixture, { title: "EN" }).ok,
  );

  // ---- Scénario F — nombres / URL / marque préservés ----
  check(
    "F — traduction valide acceptée",
    validateTrainingTranslationOutput(frFixture, goodCandidate).ok === true,
  );
  check(
    "F — nombre manquant rejeté",
    !validateTrainingTranslationOutput(frFixture, {
      ...goodCandidate,
      excerpt: "Program included.",
      contentTexts: [
        "Hands-on Sapiens-IA training, see https://sapiens-ia.test/offre.",
      ],
    }).ok,
  );
  check(
    "F — URL manquante rejetée",
    !validateTrainingTranslationOutput(frFixture, {
      ...goodCandidate,
      contentTexts: ["Hands-on Sapiens-IA training, 4 900€."],
    }).ok,
  );
  check(
    "F — marque altérée rejetée",
    !validateTrainingTranslationOutput(frFixture, {
      ...goodCandidate,
      contentTexts: [
        "Hands-on Sapiens IA training, 4 900€, see https://sapiens-ia.test/offre.",
      ],
    }).ok,
  );

  // ---- Données de test isolées (base locale uniquement) ----
  const fr = await db.training.create({
    data: {
      locale: "fr",
      slug: `${TEST_TAG}-training`,
      title: "TEST — Formation IA",
      excerpt: "TEST PREVIEW — Ne pas publier.",
      content: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Formation Sapiens-IA pratique, 4 900€, voir https://sapiens-ia.test/offre.",
              },
            ],
          },
        ],
      },
      objectives: ["Comprendre les modèles Sapiens-IA"],
      audience: ["Dirigeants"],
      modules: [{ title: "Module 1", description: "Introduction pratique" }],
      duration: "1 journée",
      status: "DRAFT",
    },
  });

  try {
    // ---- Protection des EN Training existantes — mesurée AVANT toute
    // donnée de test pour ne pas fausser le ratio.
    const protectedCountBefore = await db.training.count({
      where: {
        locale: "en",
        translationOfId: { not: null },
        translationEditedAt: { not: null },
      },
    });
    const totalTranslatedEnBefore = await db.training.count({
      where: { locale: "en", translationOfId: { not: null } },
    });
    console.info(
      `Vérification protection EN Training existantes : ${protectedCountBefore}/${totalTranslatedEnBefore} ont translationEditedAt renseigné.`,
    );

    // ---- Scénario A — FR sans EN -> création DRAFT + PENDING ----
    const beginA = await beginTrainingTranslation(fr.id);
    check("A — beginTrainingTranslation proceed=true", beginA.proceed === true);
    if (beginA.proceed) {
      const enA = await db.training.findUnique({
        where: { id: beginA.enId },
      });
      check(
        "A — EN créée en DRAFT/PENDING liée au FR",
        enA?.locale === "en" &&
          enA?.translationOfId === fr.id &&
          enA?.status === "DRAFT" &&
          enA?.translationStatus === "PENDING",
      );

      // ---- Scénario D — double déclenchement -> pas de 2e EN ----
      const beginD = await beginTrainingTranslation(fr.id);
      check(
        "D — 2e déclenchement immédiat rejeté (rate-limit)",
        beginD.proceed === false && beginD.reason === "rate-limited",
      );
      const enCount = await db.training.count({
        where: { translationOfId: fr.id, locale: "en" },
      });
      check(
        "D — une seule EN existe après double déclenchement",
        enCount === 1,
      );

      // ---- Scénario finish (succès, mock Gemini) ----
      setMockTranslation(goodCandidate);
      await finishTrainingTranslation(fr.id, beginA.enId);
      const enOk = await db.training.findUnique({
        where: { id: beginA.enId },
      });
      check(
        "A(bis) — finish OK écrit le contenu traduit et le statut OK",
        enOk?.translationStatus === "OK" &&
          enOk?.title === goodCandidate.title &&
          enOk?.duration === goodCandidate.duration &&
          JSON.stringify(enOk?.objectives) ===
            JSON.stringify(goodCandidate.objectives) &&
          JSON.stringify(enOk?.audience) ===
            JSON.stringify(goodCandidate.audience) &&
          JSON.stringify(enOk?.modules) ===
            JSON.stringify(goodCandidate.modules) &&
          enOk?.translationGeneratedAt !== null,
      );

      // ---- Scénario C(bis) — sortie invalide en sortie réelle ----
      await db.training.update({
        where: { id: beginA.enId },
        data: { translationStatus: "PENDING" },
      });
      setMockTranslation({
        title: "EN",
        excerpt: "EN",
        contentTexts: ["one", "two"],
        objectives: [],
        audience: [],
        modules: [],
        duration: "d",
        seoTitle: "t",
        seoDescription: "d",
      });
      const beforeInvalid = await db.training.findUnique({
        where: { id: beginA.enId },
      });
      await finishTrainingTranslation(fr.id, beginA.enId);
      const afterInvalid = await db.training.findUnique({
        where: { id: beginA.enId },
      });
      check(
        "C(bis) — sortie invalide -> statut FAILED, aucune écriture partielle du contenu",
        afterInvalid?.translationStatus === "FAILED" &&
          afterInvalid?.title === beforeInvalid?.title &&
          JSON.stringify(afterInvalid?.objectives) ===
            JSON.stringify(beforeInvalid?.objectives),
      );
      const auditInvalid = await db.auditLog.findFirst({
        where: {
          entity: "trainings",
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
      await db.training.update({
        where: { id: beginA.enId },
        data: { translationStatus: "PENDING" },
      });
      const savedGeminiKey = process.env.GEMINI_API_KEY;
      delete process.env.GEMINI_API_KEY;
      const frBeforeError = await db.training.findUnique({
        where: { id: fr.id },
      });
      await finishTrainingTranslation(fr.id, beginA.enId);
      if (savedGeminiKey !== undefined)
        process.env.GEMINI_API_KEY = savedGeminiKey;
      const enAfterError = await db.training.findUnique({
        where: { id: beginA.enId },
      });
      const frAfterError = await db.training.findUnique({
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
    const fr2 = await db.training.create({
      data: {
        locale: "fr",
        slug: `${TEST_TAG}-training-2`,
        title: "TEST — Formation Data",
        excerpt: "TEST PREVIEW — Ne pas publier.",
        content: { type: "doc", content: [] },
        objectives: [],
        audience: [],
        modules: [],
        status: "DRAFT",
      },
    });
    const en2 = await db.training.create({
      data: {
        locale: "en",
        slug: `${TEST_TAG}-training-2`,
        title: "TEST EN — Edited by human, do not overwrite",
        excerpt: "Edited manually.",
        content: { type: "doc", content: [] },
        objectives: [],
        audience: [],
        modules: [],
        status: "DRAFT",
        translationOfId: fr2.id,
        translationStatus: "OK",
        translationSourceHash: "irrelevant-old-hash",
        translationEditedAt: new Date(),
      },
    });
    const beginB = await beginTrainingTranslation(fr2.id);
    check(
      "B — régénération auto refusée sur EN éditée manuellement",
      beginB.proceed === false &&
        beginB.reason === "translation-manually-edited",
    );
    const en2After = await db.training.findUnique({ where: { id: en2.id } });
    check(
      "B — contenu EN édité manuellement inchangé",
      en2After?.title === en2.title,
    );
  } finally {
    await db.training.deleteMany({ where: { slug: { startsWith: TEST_TAG } } });
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
