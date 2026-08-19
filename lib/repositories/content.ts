import { ContentStatus, MenuLocation, Prisma } from "@prisma/client";
import { cache } from "react";

import { routing } from "@/i18n/routing";
import { db } from "@/lib/db";

const published = {
  status: ContentStatus.PUBLISHED,
  OR: [{ publishedAt: null }, { publishedAt: { lte: new Date() } }],
} satisfies Prisma.PageWhereInput;

// Tries the requested locale first; falls back to the default locale (fr)
// when no content exists yet for that locale.
async function findLocalized<T>(
  locale: string,
  fetchOne: (locale: string) => Promise<T | null>,
): Promise<T | null> {
  const result = await fetchOne(locale);
  if (result || locale === routing.defaultLocale) return result;
  return fetchOne(routing.defaultLocale);
}

// Same fallback rule for lists: never mixes locales within a single list.
async function findLocalizedList<T>(
  locale: string,
  fetchMany: (locale: string) => Promise<T[]>,
): Promise<T[]> {
  const result = await fetchMany(locale);
  if (result.length > 0 || locale === routing.defaultLocale) return result;
  return fetchMany(routing.defaultLocale);
}

export const contentRepository = {
  page: cache((slug: string, locale: string = routing.defaultLocale) => {
    return findLocalized(locale, (loc) =>
      db.page.findFirst({
        where: { locale: loc, slug, ...published },
        include: {
          sections: { where: { visible: true }, orderBy: { order: "asc" } },
          seo: true,
        },
      }),
    );
  }),
  services: cache(
    (featuredOnly = false, locale: string = routing.defaultLocale) => {
      return findLocalizedList(locale, (loc) =>
        db.service.findMany({
          where: {
            locale: loc,
            status: ContentStatus.PUBLISHED,
            ...(featuredOnly ? { featured: true } : {}),
          },
          include: { category: true, seo: true },
          orderBy: [{ order: "asc" }, { title: "asc" }],
        }),
      );
    },
  ),
  service(slug: string, locale: string = routing.defaultLocale) {
    return findLocalized(locale, (loc) =>
      db.service.findFirst({
        where: { locale: loc, slug, status: ContentStatus.PUBLISHED },
        include: { category: true, seo: true, caseStudies: true },
      }),
    );
  },
  servicesByCategory: cache(
    (categorySlug: string, locale: string = routing.defaultLocale) => {
      return findLocalizedList(locale, (loc) =>
        db.service.findMany({
          where: {
            locale: loc,
            status: ContentStatus.PUBLISHED,
            category: { slug: categorySlug },
          },
          include: { category: true, seo: true },
          orderBy: [{ order: "asc" }, { title: "asc" }],
        }),
      );
    },
  ),
  trainings: cache((locale: string = routing.defaultLocale) => {
    return findLocalizedList(locale, (loc) =>
      db.training.findMany({
        where: { locale: loc, status: ContentStatus.PUBLISHED },
        include: { category: true, seo: true },
        orderBy: [{ order: "asc" }, { title: "asc" }],
      }),
    );
  }),
  training(slug: string, locale: string = routing.defaultLocale) {
    return findLocalized(locale, (loc) =>
      db.training.findFirst({
        where: { locale: loc, slug, status: ContentStatus.PUBLISHED },
        include: { category: true, seo: true },
      }),
    );
  },
  trainingsByCategory: cache(
    (categorySlug: string, locale: string = routing.defaultLocale) => {
      return findLocalizedList(locale, (loc) =>
        db.training.findMany({
          where: {
            locale: loc,
            status: ContentStatus.PUBLISHED,
            category: { slug: categorySlug },
          },
          include: { category: true, seo: true },
          orderBy: [{ order: "asc" }, { title: "asc" }],
        }),
      );
    },
  ),
  articles(options?: {
    category?: string;
    query?: string;
    take?: number;
    locale?: string;
  }) {
    const locale = options?.locale ?? routing.defaultLocale;
    return findLocalizedList(locale, (loc) =>
      db.article.findMany({
        where: {
          locale: loc,
          status: ContentStatus.PUBLISHED,
          publishedAt: { lte: new Date() },
          ...(options?.category
            ? { category: { slug: options.category } }
            : {}),
          ...(options?.query
            ? {
                OR: [
                  { title: { contains: options.query, mode: "insensitive" } },
                  { excerpt: { contains: options.query, mode: "insensitive" } },
                ],
              }
            : {}),
        },
        include: {
          category: true,
          author: true,
          tags: { include: { tag: true } },
          seo: true,
        },
        orderBy: { publishedAt: "desc" },
        take: options?.take,
      }),
    );
  },
  article(slug: string, locale: string = routing.defaultLocale) {
    return findLocalized(locale, (loc) =>
      db.article.findFirst({
        where: {
          locale: loc,
          slug,
          status: ContentStatus.PUBLISHED,
          publishedAt: { lte: new Date() },
        },
        include: {
          category: true,
          author: true,
          tags: { include: { tag: true } },
          relatedFrom: { include: { to: true } },
          seo: true,
        },
      }),
    );
  },
  caseStudies: cache((locale: string = routing.defaultLocale) => {
    return findLocalizedList(locale, (loc) =>
      db.caseStudy.findMany({
        where: { locale: loc, status: ContentStatus.PUBLISHED },
        include: { service: true, seo: true },
        orderBy: { publishedAt: "desc" },
      }),
    );
  }),
  caseStudy(slug: string, locale: string = routing.defaultLocale) {
    return findLocalized(locale, (loc) =>
      db.caseStudy.findFirst({
        where: { locale: loc, slug, status: ContentStatus.PUBLISHED },
        include: { service: true, seo: true },
      }),
    );
  },
  faqs: cache(() => {
    return db.faq.findMany({
      where: { visible: true },
      orderBy: { order: "asc" },
    });
  }),
  team: cache(() => {
    return db.teamMember.findMany({
      where: { visible: true },
      orderBy: { order: "asc" },
    });
  }),
  testimonials: cache(() => {
    return db.testimonial.findMany({
      where: { visible: true },
      orderBy: { order: "asc" },
    });
  }),
  events: cache(() => {
    return db.event.findMany({
      where: { status: ContentStatus.PUBLISHED },
      include: { _count: { select: { registrations: true } } },
      orderBy: { startAt: "asc" },
    });
  }),
  menu: cache(
    (location: MenuLocation, locale: string = routing.defaultLocale) => {
      return findLocalized(locale, (loc) =>
        db.menu.findUnique({
          where: { location_locale: { location, locale: loc } },
          include: {
            items: {
              where: { visible: true, parentId: null },
              include: {
                children: {
                  where: { visible: true },
                  orderBy: { order: "asc" },
                },
              },
              orderBy: { order: "asc" },
            },
          },
        }),
      );
    },
  ),
  settings: cache(() => {
    return db.setting.findMany();
  }),
  async globalSearch(query: string, locale: string = routing.defaultLocale) {
    const q = query.trim();
    if (q.length < 2) return [];
    const [services, trainings, articles, cases, faqs] = await Promise.all([
      findLocalizedList(locale, (loc) =>
        db.service.findMany({
          where: {
            locale: loc,
            status: ContentStatus.PUBLISHED,
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { excerpt: { contains: q, mode: "insensitive" } },
            ],
          },
          take: 6,
        }),
      ),
      findLocalizedList(locale, (loc) =>
        db.training.findMany({
          where: {
            locale: loc,
            status: ContentStatus.PUBLISHED,
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { excerpt: { contains: q, mode: "insensitive" } },
            ],
          },
          take: 6,
        }),
      ),
      findLocalizedList(locale, (loc) =>
        db.article.findMany({
          where: {
            locale: loc,
            status: ContentStatus.PUBLISHED,
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { excerpt: { contains: q, mode: "insensitive" } },
            ],
          },
          take: 6,
        }),
      ),
      findLocalizedList(locale, (loc) =>
        db.caseStudy.findMany({
          where: {
            locale: loc,
            status: ContentStatus.PUBLISHED,
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { excerpt: { contains: q, mode: "insensitive" } },
            ],
          },
          take: 6,
        }),
      ),
      db.faq.findMany({
        where: {
          visible: true,
          OR: [
            { question: { contains: q, mode: "insensitive" } },
            { answer: { contains: q, mode: "insensitive" } },
          ],
        },
        take: 6,
      }),
    ]);
    return [
      ...services.map((item) => ({
        ...item,
        type: "Service",
        href: `/services/${item.slug}`,
      })),
      ...trainings.map((item) => ({
        ...item,
        type: "Formation",
        href: `/formations/${item.slug}`,
      })),
      ...articles.map((item) => ({
        ...item,
        type: "Article",
        href: `/blog/${item.slug}`,
      })),
      ...cases.map((item) => ({
        ...item,
        type: "Étude de cas",
        href: `/etudes-de-cas/${item.slug}`,
      })),
      ...faqs.map((item) => ({
        ...item,
        title: item.question,
        excerpt: item.answer,
        type: "FAQ",
        href: "/#faq",
      })),
    ];
  },
};
