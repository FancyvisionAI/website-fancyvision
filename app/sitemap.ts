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

// Catégories de Service dont la route publique n'est PAS /services/[slug] :
// agents IA -> /solutions-ia, secteurs -> /solutions-par-secteur. Le reste
// (conseil, data) reste sous /services/[slug].
const SERVICE_CATEGORY_PATHS: Record<string, string> = {
  "agents-ia": "/solutions-ia",
  secteurs: "/solutions-par-secteur",
};

// Sections principales sans ligne `Page` dédiée en base : indexées ici
// directement plutôt que d'ajouter des lignes CMS vides.
const STATIC_PATHS = [
  "/solutions-ia",
  "/solutions-par-secteur",
  "/formations",
  "/faq",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, services, trainings, articles, cases] = await Promise.all([
    db.page.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    }),
    db.service.findMany({
      where: { status: "PUBLISHED" },
      select: {
        slug: true,
        updatedAt: true,
        category: { select: { slug: true } },
      },
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
    formation: "/formations",
    "a-propos": "/a-propos",
    "etudes-de-cas": "/etudes-de-cas",
    blog: "/blog",
    contact: "/contact",
    "mentions-legales": "/mentions-legales",
    confidentialite: "/confidentialite",
    conditions: "/conditions",
  };
  const now = new Date();
  const entries: Array<{ path: string; lastModified: Date }> = [
    ...pages.map((item) => ({
      path: pagePaths[item.slug] ?? `/${item.slug}`,
      lastModified: item.updatedAt,
    })),
    ...services.map((item) => ({
      path: `${SERVICE_CATEGORY_PATHS[item.category?.slug ?? ""] ?? "/services"}/${item.slug}`,
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
    ...STATIC_PATHS.map((path) => ({ path, lastModified: now })),
  ];

  // Sécurité : ne jamais indexer une même URL deux fois.
  const seen = new Set<string>();
  const uniqueEntries = entries.filter(({ path }) => {
    if (seen.has(path)) return false;
    seen.add(path);
    return true;
  });

  return uniqueEntries.flatMap(({ path, lastModified }) =>
    routing.locales.map((locale) => ({
      url: absoluteUrl(localizedPath(path, locale)),
      lastModified,
      alternates: languageAlternates(path),
    })),
  );
}
