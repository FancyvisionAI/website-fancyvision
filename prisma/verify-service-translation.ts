import "dotenv/config";

import { createRequire } from "node:module";

import { PrismaClient } from "@prisma/client";

// ============================================================
// Test local uniquement — prototype P2 (traduction FR -> EN,
// modèle Service exclusivement). N'utilise jamais une base
// Preview/Production : DATABASE_URL doit pointer sur le Postgres
// Docker local (localhost:5433), vérifié ci-dessous avant tout écrit.
//
// `lib/translation/service-translator.ts` importe "server-only" et
// appelle l'API Anthropic réelle. Ce script neutralise les deux via
// un remplacement du cache CommonJS AVANT l'import du module, afin
// de tester le vrai code (begin/finishServiceTranslation,
// validateTranslationOutput) sans dépendre d'un moteur Next.js ni
// d'une clé API réelle, et sans jamais modifier le fichier source.
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

type MockToolResponse = { content: Array<{ type: string; input: unknown }> };
let mockResponse: MockToolResponse = { content: [] };
function setMockTranslation(input: unknown) {
  mockResponse = { content: [{ type: "tool_use", input }] };
}

class FakeAnthropic {
  messages = { create: async () => mockResponse };
  constructor(_opts: { apiKey: string }) {}
}
const anthropicPath = require.resolve("@anthropic-ai/sdk");
require.cache[anthropicPath] = {
  id: anthropicPath,
  filename: anthropicPath,
  loaded: true,
  exports: { __esModule: true, default: FakeAnthropic },
} as unknown as NodeJS.Module;

// L'appel réseau est entièrement mocké (FakeAnthropic ci-dessus) : cette
// clé n'est jamais utilisée pour un vrai appel, elle sert seulement à
// passer le garde-fou `if (!apiKey)` de callClaudeTranslate. Scénario E
// la retire temporairement pour tester précisément ce garde-fou.
process.env.ANTHROPIC_API_KEY ??= "sk-ant-test-mock-key-not-real";

const TEST_TAG = `test-p2-translation-${Date.now()}`;
const results: Array<{ scenario: string; ok: boolean; detail?: string }> = [];

function check(scenario: string, condition: boolean, detail?: string) {
  results.push({ scenario, ok: condition, detail });
}

async function main() {
  const {
    beginServiceTranslation,
    finishServiceTranslation,
    validateTranslationOutput,
  } = await import("../lib/translation/service-translator");

  // ---- Scénario C — sortie invalide (nombre d'éléments incorrect) ----
  const badCountResult = validateTranslationOutput(
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

  const badShapeResult = validateTranslationOutput(
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
    validateTranslationOutput(frFixture, goodCandidate).ok === true,
  );
  check(
    "F — nombre manquant rejeté",
    !validateTranslationOutput(frFixture, {
      ...goodCandidate,
      excerpt: "Support included.",
      contentTexts: [
        "Our Sapiens-IA offer is affordable, see https://sapiens-ia.test/offre.",
      ],
    }).ok,
  );
  check(
    "F — URL manquante rejetée",
    !validateTranslationOutput(frFixture, {
      ...goodCandidate,
      contentTexts: ["Our Sapiens-IA offer costs 4 900€."],
    }).ok,
  );
  check(
    "F — marque altérée rejetée",
    !validateTranslationOutput(frFixture, {
      ...goodCandidate,
      contentTexts: [
        "Our Sapiens IA offer costs 4 900€, see https://sapiens-ia.test/offre.",
      ],
    }).ok,
  );

  // ---- Données de test isolées (base locale uniquement) ----
  const fr = await db.service.create({
    data: {
      locale: "fr",
      slug: `${TEST_TAG}-service`,
      title: "TEST — Conseil IA",
      excerpt: "TEST PREVIEW — Ne pas publier.",
      content: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Notre offre Sapiens-IA coûte 4 900€, voir https://sapiens-ia.test/offre.",
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
    const protectedCountBefore = await db.service.count({
      where: {
        locale: "en",
        translationOfId: { not: null },
        translationEditedAt: { not: null },
      },
    });
    const totalTranslatedEnBefore = await db.service.count({
      where: { locale: "en", translationOfId: { not: null } },
    });
    console.info(
      `Vérification protection EN existantes : ${protectedCountBefore}/${totalTranslatedEnBefore} ont translationEditedAt renseigné.`,
    );

    // ---- Scénario A — FR sans EN -> création DRAFT + PENDING ----
    const beginA = await beginServiceTranslation(fr.id);
    check("A — beginServiceTranslation proceed=true", beginA.proceed === true);
    if (beginA.proceed) {
      const enA = await db.service.findUnique({ where: { id: beginA.enId } });
      check(
        "A — EN créée en DRAFT/PENDING liée au FR",
        enA?.locale === "en" &&
          enA?.translationOfId === fr.id &&
          enA?.status === "DRAFT" &&
          enA?.translationStatus === "PENDING",
      );

      // ---- Scénario D — double déclenchement -> pas de 2e EN ----
      const beginD = await beginServiceTranslation(fr.id);
      check(
        "D — 2e déclenchement immédiat rejeté (rate-limit)",
        beginD.proceed === false && beginD.reason === "rate-limited",
      );
      const enCount = await db.service.count({
        where: { translationOfId: fr.id, locale: "en" },
      });
      check(
        "D — une seule EN existe après double déclenchement",
        enCount === 1,
      );

      // ---- Scénario finish (succès, mock LLM) — vérifie l'écriture réelle ----
      setMockTranslation(goodCandidate);
      await finishServiceTranslation(fr.id, beginA.enId);
      const enOk = await db.service.findUnique({ where: { id: beginA.enId } });
      check(
        "A(bis) — finish OK écrit le contenu traduit et le statut OK",
        enOk?.translationStatus === "OK" &&
          enOk?.title === goodCandidate.title &&
          enOk?.translationGeneratedAt !== null,
      );

      // ---- Scénario C(bis) — sortie invalide en sortie réelle du LLM ----
      // On force une régénération : le hash source n'a pas changé mais on
      // simule un cas "force" pour repasser en PENDING sans attendre 30s.
      await db.service.update({
        where: { id: beginA.enId },
        data: { translationStatus: "PENDING" },
      });
      setMockTranslation({
        title: "EN",
        excerpt: "EN",
        contentTexts: ["one", "two"],
        seoTitle: "t",
        seoDescription: "d",
      });
      const beforeInvalid = await db.service.findUnique({
        where: { id: beginA.enId },
      });
      await finishServiceTranslation(fr.id, beginA.enId);
      const afterInvalid = await db.service.findUnique({
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
          entity: "services",
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
      await db.service.update({
        where: { id: beginA.enId },
        data: { translationStatus: "PENDING" },
      });
      const savedKey = process.env.ANTHROPIC_API_KEY;
      delete process.env.ANTHROPIC_API_KEY;
      const frBeforeError = await db.service.findUnique({
        where: { id: fr.id },
      });
      await finishServiceTranslation(fr.id, beginA.enId);
      if (savedKey !== undefined) process.env.ANTHROPIC_API_KEY = savedKey;
      const enAfterError = await db.service.findUnique({
        where: { id: beginA.enId },
      });
      const frAfterError = await db.service.findUnique({
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
    const fr2 = await db.service.create({
      data: {
        locale: "fr",
        slug: `${TEST_TAG}-service-2`,
        title: "TEST — Formation IA",
        excerpt: "TEST PREVIEW — Ne pas publier.",
        content: { type: "doc", content: [] },
        status: "DRAFT",
      },
    });
    const en2 = await db.service.create({
      data: {
        locale: "en",
        slug: `${TEST_TAG}-service-2`,
        title: "TEST EN — Edited by human, do not overwrite",
        excerpt: "Edited manually.",
        content: { type: "doc", content: [] },
        status: "DRAFT",
        translationOfId: fr2.id,
        translationStatus: "OK",
        translationSourceHash: "irrelevant-old-hash",
        translationEditedAt: new Date(),
      },
    });
    const beginB = await beginServiceTranslation(fr2.id);
    check(
      "B — régénération auto refusée sur EN éditée manuellement",
      beginB.proceed === false &&
        beginB.reason === "translation-manually-edited",
    );
    const en2After = await db.service.findUnique({ where: { id: en2.id } });
    check(
      "B — contenu EN édité manuellement inchangé",
      en2After?.title === en2.title,
    );
  } finally {
    await db.service.deleteMany({ where: { slug: { startsWith: TEST_TAG } } });
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
