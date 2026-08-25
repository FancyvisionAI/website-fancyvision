import fs from "node:fs";
import path from "node:path";

import {
  ContentStatus,
  Difficulty,
  Prisma,
  type PrismaClient,
} from "@prisma/client";

/**
 * Consolidates into the versioned seed pipeline the content that was
 * validated against the client's PDF brief ("Sapiens-IA-Contenu-Site-Web")
 * but, until now, only existed in the ad hoc dump `preview-content-export.sql`
 * (not part of `npm run db:seed`). The JSON files in `prisma/data/` are a
 * verbatim export of the matching rows from that dump — nothing here is
 * invented or rewritten, this module only makes that content reproducible
 * via `prisma migrate reset` + `npm run db:seed`.
 *
 * Scope: the 9 "Agents IA" (Offre 3), the 17 published "Secteurs" + 1 DRAFT
 * placeholder (Offre 5), and the 19 published "Formations" + 1 DRAFT
 * placeholder (Offre 4). It does not touch Conseil IA / Conseil Data IA
 * services, articles, pages, FAQ, menus, or any other content.
 */

type ServiceRow = {
  locale: string;
  slug: string;
  title: string;
  excerpt: string;
  content: Prisma.InputJsonValue;
  icon: string | null;
  image: string | null;
  status: "PUBLISHED" | "DRAFT";
  order: number;
};

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

function loadJson<T>(filename: string): T {
  const filePath = path.join(process.cwd(), "prisma", "data", filename);
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

export async function seedSapiensOfficialContent(prisma: PrismaClient) {
  const now = new Date();

  // ---------------------------------------------------------------------
  // Offre 3 — Nos solutions et agents IA (9 agents, FR + EN)
  // ---------------------------------------------------------------------
  const agentsCategory = await prisma.serviceCategory.upsert({
    where: { slug: "agents-ia" },
    update: { name: "Agents IA", order: 2 },
    create: { slug: "agents-ia", name: "Agents IA", order: 2 },
  });

  const agents = loadJson<ServiceRow[]>("sapiens-agents-ia.json");
  for (const item of agents) {
    const status =
      item.status === "PUBLISHED"
        ? ContentStatus.PUBLISHED
        : ContentStatus.DRAFT;
    await prisma.service.upsert({
      where: { locale_slug: { locale: item.locale, slug: item.slug } },
      update: {
        categoryId: agentsCategory.id,
        title: item.title,
        excerpt: item.excerpt,
        content: item.content,
        icon: item.icon,
        image: item.image,
        status,
        order: item.order,
        publishedAt: status === ContentStatus.PUBLISHED ? now : null,
      },
      create: {
        locale: item.locale,
        categoryId: agentsCategory.id,
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt,
        content: item.content,
        icon: item.icon,
        image: item.image,
        status,
        order: item.order,
        featured: false,
        publishedAt: status === ContentStatus.PUBLISHED ? now : null,
      },
    });
  }

  // ---------------------------------------------------------------------
  // Offre 5 — Solutions par secteur d'activité (17 secteurs publiés
  // + 1 placeholder DRAFT "Secteur à valider", FR + EN)
  // ---------------------------------------------------------------------
  const secteursCategory = await prisma.serviceCategory.upsert({
    where: { slug: "secteurs" },
    update: { name: "Secteurs", order: 3 },
    create: { slug: "secteurs", name: "Secteurs", order: 3 },
  });

  const secteurs = loadJson<ServiceRow[]>("sapiens-secteurs.json");
  for (const item of secteurs) {
    const status =
      item.status === "PUBLISHED"
        ? ContentStatus.PUBLISHED
        : ContentStatus.DRAFT;
    await prisma.service.upsert({
      where: { locale_slug: { locale: item.locale, slug: item.slug } },
      update: {
        categoryId: secteursCategory.id,
        title: item.title,
        excerpt: item.excerpt,
        content: item.content,
        icon: item.icon,
        image: item.image,
        status,
        order: item.order,
        publishedAt: status === ContentStatus.PUBLISHED ? now : null,
      },
      create: {
        locale: item.locale,
        categoryId: secteursCategory.id,
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt,
        content: item.content,
        icon: item.icon,
        image: item.image,
        status,
        order: item.order,
        featured: false,
        publishedAt: status === ContentStatus.PUBLISHED ? now : null,
      },
    });
  }

  // ---------------------------------------------------------------------
  // Offre 4 — Formations (Cible A: Grandes entreprises et PME — 9 publiées
  // + 1 placeholder DRAFT "Thème 10" ; Cible B: Particuliers, TPE et
  // professions libérales — 10 publiées ; FR + EN)
  // ---------------------------------------------------------------------
  const entrepriseCategory = await prisma.trainingCategory.upsert({
    where: { slug: "entreprise" },
    update: {
      name: "Grandes entreprises et PME",
      description:
        "Des parcours par niveau et par métier, partout en France ou à distance.",
    },
    create: {
      slug: "entreprise",
      name: "Grandes entreprises et PME",
      description:
        "Des parcours par niveau et par métier, partout en France ou à distance.",
      order: 0,
    },
  });
  const particuliersCategory = await prisma.trainingCategory.upsert({
    where: { slug: "particuliers" },
    update: {
      name: "Particuliers, TPE et professions libérales",
      description:
        "Des formations pratiques et des ateliers en ligne pour développer vos compétences.",
    },
    create: {
      slug: "particuliers",
      name: "Particuliers, TPE et professions libérales",
      description:
        "Des formations pratiques et des ateliers en ligne pour développer vos compétences.",
      order: 1,
    },
  });
  const trainingCategoriesBySlug = {
    entreprise: entrepriseCategory,
    particuliers: particuliersCategory,
  } as const;

  const trainings = loadJson<TrainingRow[]>("sapiens-formations.json");
  for (const item of trainings) {
    const status =
      item.status === "PUBLISHED"
        ? ContentStatus.PUBLISHED
        : ContentStatus.DRAFT;
    const categoryId = trainingCategoriesBySlug[item.category_slug].id;
    await prisma.training.upsert({
      where: { locale_slug: { locale: item.locale, slug: item.slug } },
      update: {
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
        publishedAt: status === ContentStatus.PUBLISHED ? now : null,
      },
      create: {
        locale: item.locale,
        categoryId,
        title: item.title,
        slug: item.slug,
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
        featured: false,
        publishedAt: status === ContentStatus.PUBLISHED ? now : null,
      },
    });
  }

  // ---------------------------------------------------------------------
  // Garde-fou : anciennes formations génériques ("IA Booster", "IA
  // Performer", "Conférences IA", "Coaching dirigeant", "IA Productivité",
  // "IA Vente"), définies dans dev2Trainings (lib/content/dev2.ts) et
  // absentes du PDF officiel Sapiens IA. Décision validée par M. Bassit :
  // on les conserve (aucune suppression), mais elles doivent rester DRAFT
  // après CHAQUE exécution complète du seed. Or seedDev2Content() (appelé
  // juste avant, plus haut dans prisma/seed.ts) les repasse en PUBLISHED à
  // chaque fois, puisque leurs slugs restent dans sa propre liste
  // dev2Trainings — ce comportement pré-existant n'est volontairement pas
  // modifié ici (voir consigne : ne pas toucher seed-dev2.ts sauf
  // nécessité technique). Ce bloc s'exécute donc en dernier pour forcer
  // leur statut, sans toucher à leur contenu, ni à leur slug, ni à aucune
  // des 19 formations officielles / 9 agents / 17 secteurs ci-dessus.
  // ---------------------------------------------------------------------
  const LEGACY_TRAINING_SLUGS_TO_KEEP_DRAFT = [
    "ia-booster",
    "ia-performer",
    "conferences-ia",
    "coaching-ia-pour-dirigeant",
    "ia-productivite",
    "ia-vente",
  ] as const;

  const legacyDraftResult = await prisma.training.updateMany({
    where: {
      locale: "fr",
      slug: { in: [...LEGACY_TRAINING_SLUGS_TO_KEEP_DRAFT] },
    },
    data: { status: ContentStatus.DRAFT, featured: false },
  });

  console.info(
    `Contenu officiel Sapiens IA consolidé : ${agents.length} agents IA, ${secteurs.length} secteurs, ${trainings.length} formations (FR+EN). ${legacyDraftResult.count} formations legacy forcées en DRAFT.`,
  );
}
