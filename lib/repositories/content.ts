import { ContentStatus, MenuLocation, Prisma } from "@prisma/client";
import { cache } from "react";

import { db } from "@/lib/db";

const published = {
  status: ContentStatus.PUBLISHED,
  OR: [{ publishedAt: null }, { publishedAt: { lte: new Date() } }],
} satisfies Prisma.PageWhereInput;

export const contentRepository = {
  page: cache((slug: string) => {
    return db.page.findFirst({
      where: { locale: "fr", slug, ...published },
      include: {
        sections: { where: { visible: true }, orderBy: { order: "asc" } },
        seo: true,
      },
    });
  }),
  services: cache((featuredOnly = false) => {
    return db.service.findMany({
      where: {
        locale: "fr",
        status: ContentStatus.PUBLISHED,
        ...(featuredOnly ? { featured: true } : {}),
      },
      include: { category: true, seo: true },
      orderBy: [{ order: "asc" }, { title: "asc" }],
    });
  }),
  service(slug: string) {
    return db.service.findFirst({
      where: { locale: "fr", slug, status: ContentStatus.PUBLISHED },
      include: { category: true, seo: true, caseStudies: true },
    });
  },
  trainings: cache(() => {
    return db.training.findMany({
      where: { locale: "fr", status: ContentStatus.PUBLISHED },
      include: { category: true, seo: true },
      orderBy: [{ order: "asc" }, { title: "asc" }],
    });
  }),
  training(slug: string) {
    return db.training.findFirst({
      where: { locale: "fr", slug, status: ContentStatus.PUBLISHED },
      include: { category: true, seo: true },
    });
  },
  articles(options?: { category?: string; query?: string; take?: number }) {
    return db.article.findMany({
      where: {
        locale: "fr",
        status: ContentStatus.PUBLISHED,
        publishedAt: { lte: new Date() },
        ...(options?.category ? { category: { slug: options.category } } : {}),
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
    });
  },
  article(slug: string) {
    return db.article.findFirst({
      where: {
        locale: "fr",
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
    });
  },
  caseStudies: cache(() => {
    return db.caseStudy.findMany({
      where: { locale: "fr", status: ContentStatus.PUBLISHED },
      include: { service: true, seo: true },
      orderBy: { publishedAt: "desc" },
    });
  }),
  caseStudy(slug: string) {
    return db.caseStudy.findFirst({
      where: { locale: "fr", slug, status: ContentStatus.PUBLISHED },
      include: { service: true, seo: true },
    });
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
  menu: cache((location: MenuLocation) => {
    return db.menu.findUnique({
      where: { location_locale: { location, locale: "fr" } },
      include: {
        items: {
          where: { visible: true, parentId: null },
          include: {
            children: { where: { visible: true }, orderBy: { order: "asc" } },
          },
          orderBy: { order: "asc" },
        },
      },
    });
  }),
  settings: cache(() => {
    return db.setting.findMany();
  }),
  async globalSearch(query: string) {
    const q = query.trim();
    if (q.length < 2) return [];
    const [services, trainings, articles, cases, faqs] = await Promise.all([
      db.service.findMany({
        where: {
          status: ContentStatus.PUBLISHED,
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { excerpt: { contains: q, mode: "insensitive" } },
          ],
        },
        take: 6,
      }),
      db.training.findMany({
        where: {
          status: ContentStatus.PUBLISHED,
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { excerpt: { contains: q, mode: "insensitive" } },
          ],
        },
        take: 6,
      }),
      db.article.findMany({
        where: {
          status: ContentStatus.PUBLISHED,
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { excerpt: { contains: q, mode: "insensitive" } },
          ],
        },
        take: 6,
      }),
      db.caseStudy.findMany({
        where: {
          status: ContentStatus.PUBLISHED,
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { excerpt: { contains: q, mode: "insensitive" } },
          ],
        },
        take: 6,
      }),
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
