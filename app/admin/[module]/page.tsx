import { notFound } from "next/navigation";

import { ContentManager } from "@/components/admin/content-manager";
import { adminModules } from "@/lib/admin-modules";
import { db } from "@/lib/db";

// Modèles couverts par la relation FR ↔ EN (P0). Sur ces modules, la liste
// admin n'affiche que le français — plus une éventuelle ligne EN orpheline
// (sans translationOfId) pour ne jamais la rendre inaccessible — et chaque
// fiche embarque sa traduction éventuelle via `translations`.
const TRANSLATABLE_MODULES = new Set([
  "pages",
  "services",
  "trainings",
  "articles",
  "case-studies",
]);

const frOrOrphanEn = {
  OR: [{ locale: "fr" }, { locale: "en", translationOfId: null }],
};

async function itemsFor(moduleKey: string) {
  switch (moduleKey) {
    case "pages":
      return db.page.findMany({
        where: frOrOrphanEn,
        include: { translations: true },
        orderBy: { updatedAt: "desc" },
      });
    case "services":
      return db.service.findMany({
        where: frOrOrphanEn,
        include: { translations: true, category: true },
        orderBy: { order: "asc" },
      });
    case "trainings":
      return db.training.findMany({
        where: frOrOrphanEn,
        include: { translations: true, category: true },
        orderBy: { order: "asc" },
      });
    case "articles":
      return db.article.findMany({
        where: frOrOrphanEn,
        include: { translations: true, category: true },
        orderBy: { updatedAt: "desc" },
      });
    case "team":
      return db.teamMember.findMany({ orderBy: { order: "asc" } });
    case "case-studies":
      return db.caseStudy.findMany({
        where: frOrOrphanEn,
        include: { translations: true },
        orderBy: { updatedAt: "desc" },
      });
    case "faq":
      return db.faq.findMany({
        orderBy: [{ locale: "asc" }, { order: "asc" }],
      });
    case "testimonials":
      return db.testimonial.findMany({ orderBy: { order: "asc" } });
    case "contacts":
      return db.contactRequest.findMany({ orderBy: { createdAt: "desc" } });
    case "appointments":
      return db.appointment.findMany({ orderBy: { createdAt: "desc" } });
    case "users":
      return db.user.findMany({
        include: { role: true },
        orderBy: { createdAt: "desc" },
      });
    case "media":
      return db.media.findMany({ orderBy: { createdAt: "desc" } });
    case "settings":
      return db.setting.findMany({ orderBy: { group: "asc" } });
    case "menus":
      return db.menuItem.findMany({
        include: { menu: true },
        orderBy: { order: "asc" },
      });
    case "seo":
      return db.seo.findMany({ orderBy: { id: "desc" } });
    case "analytics":
      return db.analyticsEvent.findMany({
        orderBy: { createdAt: "desc" },
        take: 500,
      });
    case "audit":
      return db.auditLog.findMany({
        include: { user: true },
        orderBy: { createdAt: "desc" },
        take: 500,
      });
    default:
      return null;
  }
}

async function relationOptionsFor(moduleKey: string) {
  switch (moduleKey) {
    case "services": {
      const categories = await db.serviceCategory.findMany({
        orderBy: { order: "asc" },
      });
      return {
        categories: categories.map((c) => ({ label: c.name, value: c.id })),
      };
    }
    case "trainings": {
      const categories = await db.trainingCategory.findMany({
        orderBy: { order: "asc" },
      });
      return {
        categories: categories.map((c) => ({ label: c.name, value: c.id })),
      };
    }
    case "articles": {
      const categories = await db.articleCategory.findMany({
        orderBy: { name: "asc" },
      });
      return {
        categories: categories.map((c) => ({ label: c.name, value: c.id })),
      };
    }
    default:
      return undefined;
  }
}

export default async function AdminModulePage({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  const moduleKey = (await params).module;
  const config = adminModules[moduleKey];
  if (!config) notFound();
  const [items, relationOptions] = await Promise.all([
    itemsFor(moduleKey),
    relationOptionsFor(moduleKey),
  ]);
  if (!items) notFound();
  return (
    <ContentManager
      moduleKey={moduleKey}
      config={config}
      initialItems={JSON.parse(JSON.stringify(items))}
      relationOptions={relationOptions}
      translatable={TRANSLATABLE_MODULES.has(moduleKey)}
    />
  );
}
