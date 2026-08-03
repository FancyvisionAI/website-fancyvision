import "dotenv/config";

import { ContentStatus, PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const result = {
    services: await db.service.count({
      where: { status: ContentStatus.PUBLISHED },
    }),
    trainings: await db.training.count({
      where: { status: ContentStatus.PUBLISHED },
    }),
    cases: await db.caseStudy.count({
      where: { status: ContentStatus.PUBLISHED },
    }),
    articles: await db.article.count({
      where: { status: ContentStatus.PUBLISHED },
    }),
    faqs: await db.faq.count({ where: { visible: true } }),
    homeSections: await db.section.count({
      where: { page: { slug: "accueil", locale: "fr" } },
    }),
  };

  console.info(JSON.stringify(result));
}

main().finally(async () => {
  await db.$disconnect();
});
