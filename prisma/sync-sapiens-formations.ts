import "dotenv/config";

import fs from "node:fs";
import path from "node:path";

import { Difficulty, PrismaClient, type Prisma } from "@prisma/client";

// ============================================================
// Synchronisation ISOLÉE des formations officielles Sapiens IA.
//
// Ne touche QUE le modèle Training (lecture seule sur TrainingCategory,
// pour résoudre categoryId — jamais d'écriture dessus). N'appelle jamais
// seed.ts, seedDev2Content ou seedSapiensOfficialContent : ce script est
// volontairement indépendant du seed global pour pouvoir être exécuté
// sans risque contre une base déjà en production (Supabase), qui contient
// du contenu CMS (articles, pages, sections, menus, settings, case
// studies, témoignages, membres d'équipe, FAQ, événements) que ce script
// ne doit jamais lire ni modifier.
//
// Aucun delete ni deleteMany : uniquement des upsert sur Training, keyés
// par la contrainte unique (locale, slug) — deux exécutions successives
// avec le même JSON réappliquent les mêmes valeurs sans créer de doublon.
//
// Usage :
//   npx tsx prisma/sync-sapiens-formations.ts --dry-run   (aucune écriture)
//   npx tsx prisma/sync-sapiens-formations.ts             (écriture réelle)
// ============================================================

type TrainingRow = {
  locale: string;
  slug: string;
  title: string;
  excerpt: string;
  content: Prisma.InputJsonValue;
  objectives: string[];
  audience: string[];
  modules: Prisma.InputJsonValue;
  duration: string | null;
  priceCents: number | null;
  image: string | null;
  pdfUrl: string | null;
  instructor: string | null;
  difficulty: keyof typeof Difficulty;
  status: "PUBLISHED" | "DRAFT";
  order: number;
  category_slug: "entreprise" | "particuliers";
};

const DRY_RUN = process.argv.includes("--dry-run");

const db = new PrismaClient();

function loadTrainings(): TrainingRow[] {
  const filePath = path.join(
    process.cwd(),
    "prisma",
    "data",
    "sapiens-formations.json",
  );
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as TrainingRow[];
}

// Champs réellement synchronisés par ce script (correspond exactement à
// la liste validée) — sert à la fois à construire le payload d'upsert et
// à calculer le diff affiché en dry-run.
function buildUpdateData(item: TrainingRow, categoryId: string) {
  const status = item.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT";
  return {
    categoryId,
    title: item.title,
    excerpt: item.excerpt,
    content: item.content,
    objectives: item.objectives,
    audience: item.audience,
    modules: item.modules,
    duration: item.duration,
    priceCents: item.priceCents,
    image: item.image,
    pdfUrl: item.pdfUrl,
    instructor: item.instructor,
    difficulty: Difficulty[item.difficulty],
    status,
    order: item.order,
    publishedAt: status === "PUBLISHED" ? new Date() : null,
  } as const;
}

// Masque tout sauf l'hôte, pour permettre de vérifier visuellement la
// cible sans jamais exposer les identifiants.
function maskedHost(databaseUrl: string | undefined): string {
  if (!databaseUrl) return "(DATABASE_URL absente)";
  try {
    const url = new URL(databaseUrl);
    return `${url.hostname}${url.port ? `:${url.port}` : ""}${url.pathname}`;
  } catch {
    return "(DATABASE_URL illisible)";
  }
}

async function main() {
  console.info(`Cible de connexion : ${maskedHost(process.env.DATABASE_URL)}`);
  console.info(
    DRY_RUN ? "Mode : DRY-RUN (aucune écriture)" : "Mode : ÉCRITURE RÉELLE",
  );

  const trainings = loadTrainings();

  // Résolution en lecture seule des catégories existantes — jamais de
  // création/mise à jour de TrainingCategory par ce script.
  const categorySlugs = [...new Set(trainings.map((t) => t.category_slug))];
  const categories = await db.trainingCategory.findMany({
    where: { slug: { in: categorySlugs } },
  });
  const categoryIdBySlug = new Map(categories.map((c) => [c.slug, c.id]));
  for (const slug of categorySlugs) {
    if (!categoryIdBySlug.has(slug)) {
      throw new Error(
        `TrainingCategory "${slug}" introuvable en base. Ce script ne crée jamais de catégorie : ` +
          `vérifiez manuellement avant de continuer.`,
      );
    }
  }

  let toCreate = 0;
  let toUpdate = 0;
  let unchanged = 0;

  for (const item of trainings) {
    const categoryId = categoryIdBySlug.get(item.category_slug)!;
    const nextData = buildUpdateData(item, categoryId);

    const existing = await db.training.findUnique({
      where: { locale_slug: { locale: item.locale, slug: item.slug } },
    });

    if (!existing) {
      toCreate += 1;
      console.info(
        `[CREATE] ${item.locale}/${item.slug} — order=${item.order} pdfUrl=${item.pdfUrl ?? "null"}`,
      );
      if (!DRY_RUN) {
        await db.training.create({
          data: {
            locale: item.locale,
            slug: item.slug,
            ...nextData,
          },
        });
      }
      continue;
    }

    const changedFields: string[] = [];
    if (existing.order !== nextData.order) {
      changedFields.push(`order: ${existing.order} → ${nextData.order}`);
    }
    if (existing.pdfUrl !== nextData.pdfUrl) {
      changedFields.push(
        `pdfUrl: ${existing.pdfUrl ?? "null"} → ${nextData.pdfUrl ?? "null"}`,
      );
    }
    if (existing.title !== nextData.title) {
      changedFields.push(`title: "${existing.title}" → "${nextData.title}"`);
    }
    if (existing.duration !== nextData.duration) {
      changedFields.push(
        `duration: ${existing.duration ?? "null"} → ${nextData.duration ?? "null"}`,
      );
    }
    if (existing.status !== nextData.status) {
      changedFields.push(`status: ${existing.status} → ${nextData.status}`);
    }
    if (existing.categoryId !== nextData.categoryId) {
      changedFields.push("categoryId: modifié");
    }

    if (changedFields.length > 0) {
      toUpdate += 1;
      console.info(
        `[UPDATE] ${item.locale}/${item.slug} — ${changedFields.join(" | ")}`,
      );
    } else {
      unchanged += 1;
    }

    if (!DRY_RUN) {
      await db.training.update({
        where: { locale_slug: { locale: item.locale, slug: item.slug } },
        data: nextData,
      });
    }
  }

  console.info(
    `\nRésumé : ${toCreate} à créer, ${toUpdate} à mettre à jour, ${unchanged} déjà à jour, ${trainings.length} au total.`,
  );
  if (DRY_RUN) {
    console.info("Dry-run terminé — aucune écriture effectuée.");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
