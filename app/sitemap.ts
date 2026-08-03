import type { MetadataRoute } from "next";

import { db } from "@/lib/db";
import { absoluteUrl } from "@/lib/utils";

export const revalidate = 3600;

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
  return [
    ...pages.map((item) => ({
      url: absoluteUrl(pagePaths[item.slug] ?? `/${item.slug}`),
      lastModified: item.updatedAt,
    })),
    ...services.map((item) => ({
      url: absoluteUrl(`/services/${item.slug}`),
      lastModified: item.updatedAt,
    })),
    ...trainings.map((item) => ({
      url: absoluteUrl(`/formations/${item.slug}`),
      lastModified: item.updatedAt,
    })),
    ...articles.map((item) => ({
      url: absoluteUrl(`/blog/${item.slug}`),
      lastModified: item.updatedAt,
    })),
    ...cases.map((item) => ({
      url: absoluteUrl(`/etudes-de-cas/${item.slug}`),
      lastModified: item.updatedAt,
    })),
  ];
}
