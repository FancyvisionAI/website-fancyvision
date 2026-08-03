import { notFound } from "next/navigation";

import { ContentManager } from "@/components/admin/content-manager";
import { adminModules } from "@/lib/admin-modules";
import { db } from "@/lib/db";

async function itemsFor(moduleKey: string) {
  switch (moduleKey) {
    case "pages":
      return db.page.findMany({ orderBy: { updatedAt: "desc" } });
    case "services":
      return db.service.findMany({ orderBy: { order: "asc" } });
    case "trainings":
      return db.training.findMany({ orderBy: { order: "asc" } });
    case "articles":
      return db.article.findMany({ orderBy: { updatedAt: "desc" } });
    case "team":
      return db.teamMember.findMany({ orderBy: { order: "asc" } });
    case "case-studies":
      return db.caseStudy.findMany({ orderBy: { updatedAt: "desc" } });
    case "faq":
      return db.faq.findMany({ orderBy: { order: "asc" } });
    case "testimonials":
      return db.testimonial.findMany({ orderBy: { order: "asc" } });
    case "contacts":
      return db.contactRequest.findMany({ orderBy: { createdAt: "desc" } });
    case "appointments":
      return db.appointment.findMany({ orderBy: { createdAt: "desc" } });
    case "newsletter":
      return db.newsletterSubscriber.findMany({
        orderBy: { createdAt: "desc" },
      });
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

export default async function AdminModulePage({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  const moduleKey = (await params).module;
  const config = adminModules[moduleKey];
  if (!config) notFound();
  const items = await itemsFor(moduleKey);
  if (!items) notFound();
  return (
    <ContentManager
      moduleKey={moduleKey}
      config={config}
      initialItems={JSON.parse(JSON.stringify(items))}
    />
  );
}
