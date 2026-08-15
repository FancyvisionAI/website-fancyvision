import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import { db } from "@/lib/db";
import { absoluteUrl } from "@/lib/utils";

// The sitemap reflects live CMS records and must not require a database during builds.
export const dynamic = "force-dynamic";

function localizedPath(path: string, locale: string) {
  if (locale === routing.defaultLocale) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

function languageAlternates(path: string) {
  return {
    languages: Object.fromEntries(
      routing.locales.map((locale) => [
        locale,
        absoluteUrl(localizedPath(path, locale)),
      ]),
    ),
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, services, trainings, articles, cases] = await Promise.all([
    db.page.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    }),
    db.service.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    }),
    db.training.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    }),
    db.article.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    }),
    db.caseStudy.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    }),
  ]);
  const pagePaths: Record<string, string> = {
    accueil: "/",
    services: "/services",
    formation: "/formation",
    "a-propos": "/a-propos",
    "etudes-de-cas": "/etudes-de-cas",
    blog: "/blog",
    contact: "/contact",
    "mentions-legales": "/mentions-legales",
    confidentialite: "/confidentialite",
    conditions: "/conditions",
  };
  const entries: Array<{ path: string; lastModified: Date }> = [
    ...pages.map((item) => ({
      path: pagePaths[item.slug] ?? `/${item.slug}`,
      lastModified: item.updatedAt,
    })),
    ...services.map((item) => ({
      path: `/services/${item.slug}`,
      lastModified: item.updatedAt,
    })),
    ...trainings.map((item) => ({
      path: `/formations/${item.slug}`,
      lastModified: item.updatedAt,
    })),
    ...articles.map((item) => ({
      path: `/blog/${item.slug}`,
      lastModified: item.updatedAt,
    })),
    ...cases.map((item) => ({
      path: `/etudes-de-cas/${item.slug}`,
      lastModified: item.updatedAt,
    })),
  ];

  return entries.flatMap(({ path, lastModified }) =>
    routing.locales.map((locale) => ({
      url: absoluteUrl(localizedPath(path, locale)),
      lastModified,
      alternates: languageAlternates(path),
    })),
  );
}
