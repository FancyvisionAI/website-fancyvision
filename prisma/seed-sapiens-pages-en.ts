import { createRequire } from "node:module";

import { ContentStatus, type Prisma, type PrismaClient } from "@prisma/client";

/**
 * Rend reproductible en base la traduction anglaise de 8 pages "simples"
 * FR (title/headline/description) déjà validée et actuellement présente
 * uniquement en base locale, ainsi que le corps anglais des 3 pages
 * légales parmi elles. Le contenu ci-dessous est une copie exacte de ce
 * qui a déjà été créé et vérifié en base — rien n'est retraduit ni amélioré
 * ici (voir audit consolidé, lot "contenu anglais des pages").
 *
 * Ne couvre PAS : la page d'accueil (locale déjà seedée séparément plus
 * haut dans prisma/seed.ts), les FAQ (traitées séparément, non encore
 * validées sur Preview), les 11 pages formation-ia-* (désactivées), les
 * Service/Training/Article/CaseStudy (mécanismes de seed distincts déjà
 * en place). Réutilise `hashPageSource()` de
 * lib/translation/page-translator.ts — le même mécanisme officiel de
 * suivi de traduction (translationOfId/Status/SourceHash/GeneratedAt/
 * EditedAt) déjà utilisé par l'admin CMS pour Page/Service/Training/
 * Article/CaseStudy — plutôt que d'en dupliquer la logique.
 *
 * `lib/translation/page-translator.ts` commence par `import "server-only"`,
 * qui lève systématiquement une erreur hors du bundler Next.js (ce module
 * n'est normalement chargé que côté route API admin). Ce script tourne en
 * dehors de ce contexte (`tsx prisma/seed.ts`) : on neutralise ce garde-fou
 * en substituant l'entrée du cache CommonJS de "server-only" avant l'import
 * dynamique, exactement comme le fait déjà prisma/verify-page-translation.ts
 * pour la même raison.
 */

type SimplePageEn = {
  slug: string;
  title: string;
  headline: string;
  description: string;
};

const PAGES_EN: SimplePageEn[] = [
  {
    slug: "a-propos",
    title: "About Sapiens IA",
    headline: "Making AI accessible, useful and responsible.",
    description:
      "Sapiens IA brings together consultants, trainers and product experts to support organizations from understanding through to deployment.",
  },
  {
    slug: "blog",
    title: "The Sapiens IA Blog",
    headline: "The Sapiens IA Blog",
    description:
      "Artificial intelligence and data in Morocco: insights, use cases and real-world feedback. Morocco is now taking its first steps into the AI revolution. On this blog, we share our analysis, our on-the-ground experience and practical resources to help executives, business teams and independent professionals understand and make artificial intelligence and data their own — without unnecessary technical jargon, and firmly rooted in Morocco.",
  },
  {
    slug: "conditions",
    title: "Terms of Use",
    headline: "Terms of Use",
    description:
      "The rules governing access to and use of Sapiens IA's digital services.",
  },
  {
    slug: "confidentialite",
    title: "Privacy Policy",
    headline: "Privacy Policy",
    description:
      "How Sapiens IA collects, uses and protects your personal data.",
  },
  {
    slug: "contact",
    title: "Contact",
    headline: "Let's talk about your project.",
    description:
      "Tell us about your situation. A consultant will get back to you within one business day.",
  },
  {
    slug: "formation",
    title: "Artificial Intelligence Training",
    headline: "Train your teams in AI.",
    description:
      "Level- and role-based programs, built around real-world situations, delivered on-site or remotely.",
  },
  {
    slug: "mentions-legales",
    title: "Legal Notice & Privacy",
    headline: "Legal Notice & Privacy",
    description:
      "Legal information, personal data processing and intellectual property.",
  },
  {
    slug: "services",
    title: "Consulting & Data",
    headline: "Turn your ambitions into concrete use cases.",
    description:
      "Audit, governance, integration, Data Engineering, Business Intelligence and Data Science: choose the support that fits your needs.",
  },
];

// Corps exact des 3 pages légales, déjà validé en base — copie conforme,
// pas une nouvelle traduction. Structure identique à celle des sections
// FR correspondantes (headings pour mentions-legales, simples paragraphes
// pour confidentialite/conditions).
const LEGAL_BODIES_EN: Record<string, Prisma.InputJsonValue> = {
  conditions: {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            text: "Access to the site implies acceptance of these terms. The information published is of a general nature and does not constitute legal or financial advice.",
            type: "text",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            text: "Users agree not to disrupt the operation of the site, misuse its forms, or attempt to access protected areas.",
            type: "text",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            text: "Sapiens IA may update the site and these terms at any time. These terms are governed by the applicable legal provisions.",
            type: "text",
          },
        ],
      },
    ],
  },
  confidentialite: {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            text: "Data submitted through our forms is used solely to respond to your request or manage an appointment.",
            type: "text",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            text: "The legal basis depends on the service concerned: consent, pre-contractual measures, or legitimate interest. Your data is never resold.",
            type: "text",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            text: "You may request access to, rectification, erasure, restriction or portability of your data by writing to contact@sapiens-ia.com.",
            type: "text",
          },
        ],
      },
    ],
  },
  "mentions-legales": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ text: "Publisher", type: "text" }],
      },
      {
        type: "paragraph",
        content: [
          {
            text: "Sapiens IA presents its artificial intelligence consulting and training activities.",
            type: "text",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ text: "Personal Data", type: "text" }],
      },
      {
        type: "paragraph",
        content: [
          {
            text: "The data provided is used to respond to inquiries and manage the business relationship.",
            type: "text",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ text: "Your Rights", type: "text" }],
      },
      {
        type: "paragraph",
        content: [
          {
            text: "You may request access to, rectification or erasure of your data at contact@sapiens-ia.com.",
            type: "text",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ text: "Intellectual Property", type: "text" }],
      },
      {
        type: "paragraph",
        content: [
          {
            text: "Trademarks, text, visuals and graphic elements remain protected by their respective owners' rights.",
            type: "text",
          },
        ],
      },
    ],
  },
};

export async function seedSapiensPagesEn(prisma: PrismaClient) {
  const require = createRequire(import.meta.url);
  const serverOnlyPath = require.resolve("server-only");
  if (!require.cache[serverOnlyPath]) {
    require.cache[serverOnlyPath] = {
      id: serverOnlyPath,
      filename: serverOnlyPath,
      loaded: true,
      exports: {},
    } as unknown as NodeJS.Module;
  }
  const { hashPageSource } = await import("../lib/translation/page-translator");

  const now = new Date();
  let pagesUpserted = 0;
  let sectionsUpserted = 0;

  for (const item of PAGES_EN) {
    const frPage = await prisma.page.findUnique({
      where: { locale_slug: { locale: "fr", slug: item.slug } },
    });
    if (!frPage) {
      console.warn(
        `seedSapiensPagesEn : page FR introuvable pour le slug "${item.slug}", ignorée.`,
      );
      continue;
    }

    const sourceHash = hashPageSource({
      title: frPage.title,
      headline: frPage.headline,
      description: frPage.description,
    });

    const enPage = await prisma.page.upsert({
      where: { locale_slug: { locale: "en", slug: item.slug } },
      update: {
        title: item.title,
        headline: item.headline,
        description: item.description,
        status: ContentStatus.PUBLISHED,
        translationOfId: frPage.id,
        translationStatus: "OK",
        translationSourceHash: sourceHash,
        translationGeneratedAt: now,
        translationEditedAt: now,
      },
      create: {
        locale: "en",
        slug: item.slug,
        title: item.title,
        headline: item.headline,
        description: item.description,
        status: ContentStatus.PUBLISHED,
        publishedAt: now,
        translationOfId: frPage.id,
        translationStatus: "OK",
        translationSourceHash: sourceHash,
        translationGeneratedAt: now,
        translationEditedAt: now,
      },
    });
    pagesUpserted++;

    const legalBody = LEGAL_BODIES_EN[item.slug];
    if (legalBody) {
      const existingSection = await prisma.section.findFirst({
        where: { pageId: enPage.id, type: "legal" },
      });
      if (existingSection) {
        await prisma.section.update({
          where: { id: existingSection.id },
          data: { data: { body: legalBody } },
        });
      } else {
        await prisma.section.create({
          data: {
            pageId: enPage.id,
            name: "Legal content",
            type: "legal",
            order: 0,
            visible: true,
            data: { body: legalBody },
          },
        });
      }
      sectionsUpserted++;
    }
  }

  console.info(
    `Pages anglaises consolidées : ${pagesUpserted} pages, ${sectionsUpserted} sections légales.`,
  );
}
