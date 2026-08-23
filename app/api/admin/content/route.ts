import { ContentStatus, Prisma, RequestStatus } from "@prisma/client";
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { adminContentSchema } from "@/lib/validators";

const emptyDoc = { type: "doc", content: [] };
const string = (value: unknown, fallback = "") =>
  typeof value === "string" ? value.trim() : fallback;
const optional = (value: unknown) => {
  const parsed = string(value);
  return parsed || null;
};
const number = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};
const boolean = (value: unknown) => value === true || value === "true";
const status = (value: unknown) =>
  Object.values(ContentStatus).includes(value as ContentStatus)
    ? (value as ContentStatus)
    : ContentStatus.DRAFT;
const requestStatus = (value: unknown) =>
  Object.values(RequestStatus).includes(value as RequestStatus)
    ? (value as RequestStatus)
    : RequestStatus.NEW;
const json = (value: unknown) =>
  value && typeof value === "object"
    ? (value as Prisma.InputJsonValue)
    : emptyDoc;

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return session;
}

/**
 * Quand la fiche modifiée est elle-même une traduction (translationOfId
 * renseigné), on marque translationEditedAt pour la protéger d'une future
 * régénération automatique — cf. audit CMS FR → EN, §08.
 */
async function markTranslationEditedIfApplicable(
  moduleKey: string,
  id: string,
) {
  const where = { id, translationOfId: { not: null } };
  const data = { translationEditedAt: new Date() };
  switch (moduleKey) {
    case "pages":
      await db.page.updateMany({ where, data });
      break;
    case "services":
      await db.service.updateMany({ where, data });
      break;
    case "trainings":
      await db.training.updateMany({ where, data });
      break;
    case "articles":
      await db.article.updateMany({ where, data });
      break;
    case "case-studies":
      await db.caseStudy.updateMany({ where, data });
      break;
    default:
      break;
  }
}

export async function GET(request: Request) {
  const session = await requireAdmin();
  if (!session)
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const moduleKey = searchParams.get("module");
  if (moduleKey !== "media")
    return NextResponse.json(
      { error: "Module non pris en charge." },
      { status: 400 },
    );
  const kind = searchParams.get("kind");
  const items = await db.media.findMany({
    where:
      kind === "pdf"
        ? { mimeType: "application/pdf" }
        : kind === "image"
          ? { mimeType: { startsWith: "image/" } }
          : undefined,
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, url: true, mimeType: true, alt: true },
    take: 100,
  });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session)
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  const parsed = adminContentSchema.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  const { module: moduleKey, data } = parsed.data;
  let result: { id: string };
  switch (moduleKey) {
    case "pages":
      result = await db.page.create({
        data: {
          title: string(data.title),
          slug: string(data.slug),
          headline: optional(data.headline),
          description: optional(data.description),
          status: status(data.status),
          publishedAt: status(data.status) === "PUBLISHED" ? new Date() : null,
        },
      });
      break;
    case "services":
      result = await db.service.create({
        data: {
          title: string(data.title),
          slug: string(data.slug),
          excerpt: string(data.excerpt),
          content: json(data.content),
          icon: optional(data.icon),
          image: optional(data.image),
          categoryId: optional(data.categoryId),
          order: number(data.order),
          featured: boolean(data.featured),
          status: status(data.status),
          publishedAt: status(data.status) === "PUBLISHED" ? new Date() : null,
        },
      });
      break;
    case "trainings":
      result = await db.training.create({
        data: {
          title: string(data.title),
          slug: string(data.slug),
          excerpt: string(data.excerpt),
          content: json(data.content),
          modules: [],
          objectives: [],
          audience: [],
          duration: optional(data.duration),
          priceCents: data.priceCents ? number(data.priceCents) : null,
          instructor: optional(data.instructor),
          image: optional(data.image),
          pdfUrl: optional(data.pdfUrl),
          categoryId: optional(data.categoryId),
          featured: boolean(data.featured),
          status: status(data.status),
          publishedAt: status(data.status) === "PUBLISHED" ? new Date() : null,
        },
      });
      break;
    case "articles":
      result = await db.article.create({
        data: {
          title: string(data.title),
          slug: string(data.slug),
          excerpt: string(data.excerpt),
          content: json(data.content),
          coverImage: optional(data.coverImage),
          categoryId: optional(data.categoryId),
          readingTime: number(data.readingTime, 5),
          featured: boolean(data.featured),
          status: status(data.status),
          authorId: session.user.id,
          publishedAt: status(data.status) === "PUBLISHED" ? new Date() : null,
        },
      });
      break;
    case "team":
      result = await db.teamMember.create({
        data: {
          name: string(data.name),
          position: string(data.position),
          biography: string(data.biography),
          picture: optional(data.picture),
          linkedin: optional(data.linkedin),
          order: number(data.order),
          visible: boolean(data.visible),
        },
      });
      break;
    case "case-studies":
      result = await db.caseStudy.create({
        data: {
          title: string(data.title),
          slug: string(data.slug),
          company: string(data.company),
          sector: optional(data.sector),
          teamSize: data.teamSize ? number(data.teamSize) : null,
          excerpt: string(data.excerpt),
          before: string(data.before),
          after: string(data.after),
          content: json(data.content),
          metrics: [],
          gallery: [],
          coverImage: optional(data.coverImage),
          featured: boolean(data.featured),
          status: status(data.status),
          publishedAt: status(data.status) === "PUBLISHED" ? new Date() : null,
        },
      });
      break;
    case "faq":
      result = await db.faq.create({
        data: {
          category: string(data.category),
          question: string(data.question),
          answer: string(data.answer),
          order: number(data.order),
          visible: boolean(data.visible),
        },
      });
      break;
    case "testimonials":
      result = await db.testimonial.create({
        data: {
          name: string(data.name),
          company: optional(data.company),
          position: optional(data.position),
          quote: string(data.quote),
          avatar: optional(data.avatar),
          rating: number(data.rating, 5),
          visible: boolean(data.visible),
        },
      });
      break;
    case "media":
      result = await db.media.create({
        data: {
          name: string(data.name),
          url: string(data.url),
          alt: string(data.alt),
          folder: string(data.folder, "/"),
          mimeType: string(data.mimeType, "image/jpeg"),
          size: number(data.size),
        },
      });
      break;
    default:
      return NextResponse.json(
        { error: "Module non pris en charge." },
        { status: 400 },
      );
  }
  await db.auditLog.create({
    data: {
      userId: session.user.id,
      action: "CREATE",
      entity: moduleKey,
      entityId: result.id,
      after: data as Prisma.InputJsonValue,
    },
  });
  return NextResponse.json(result, { status: 201 });
}

export async function PATCH(request: Request) {
  const session = await requireAdmin();
  if (!session)
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  const parsed = adminContentSchema.safeParse(await request.json());
  if (!parsed.success || !parsed.data.id)
    return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  const { module: moduleKey, id, data } = parsed.data;
  switch (moduleKey) {
    case "pages":
      await db.page.update({
        where: { id },
        data: {
          title: string(data.title),
          slug: string(data.slug),
          headline: optional(data.headline),
          description: optional(data.description),
          status: status(data.status),
          publishedAt: status(data.status) === "PUBLISHED" ? new Date() : null,
        },
      });
      break;
    case "services":
      await db.service.update({
        where: { id },
        data: {
          title: string(data.title),
          slug: string(data.slug),
          excerpt: string(data.excerpt),
          content: json(data.content),
          icon: optional(data.icon),
          image: optional(data.image),
          categoryId: optional(data.categoryId),
          order: number(data.order),
          featured: boolean(data.featured),
          status: status(data.status),
          publishedAt: status(data.status) === "PUBLISHED" ? new Date() : null,
        },
      });
      break;
    case "trainings":
      await db.training.update({
        where: { id },
        data: {
          title: string(data.title),
          slug: string(data.slug),
          excerpt: string(data.excerpt),
          content: json(data.content),
          duration: optional(data.duration),
          priceCents: data.priceCents ? number(data.priceCents) : null,
          instructor: optional(data.instructor),
          image: optional(data.image),
          pdfUrl: optional(data.pdfUrl),
          categoryId: optional(data.categoryId),
          featured: boolean(data.featured),
          status: status(data.status),
          publishedAt: status(data.status) === "PUBLISHED" ? new Date() : null,
        },
      });
      break;
    case "articles":
      await db.article.update({
        where: { id },
        data: {
          title: string(data.title),
          slug: string(data.slug),
          excerpt: string(data.excerpt),
          content: json(data.content),
          coverImage: optional(data.coverImage),
          categoryId: optional(data.categoryId),
          readingTime: number(data.readingTime, 5),
          featured: boolean(data.featured),
          status: status(data.status),
          publishedAt: status(data.status) === "PUBLISHED" ? new Date() : null,
        },
      });
      break;
    case "team":
      await db.teamMember.update({
        where: { id },
        data: {
          name: string(data.name),
          position: string(data.position),
          biography: string(data.biography),
          picture: optional(data.picture),
          linkedin: optional(data.linkedin),
          order: number(data.order),
          visible: boolean(data.visible),
        },
      });
      break;
    case "case-studies":
      await db.caseStudy.update({
        where: { id },
        data: {
          title: string(data.title),
          slug: string(data.slug),
          company: string(data.company),
          sector: optional(data.sector),
          teamSize: data.teamSize ? number(data.teamSize) : null,
          excerpt: string(data.excerpt),
          before: string(data.before),
          after: string(data.after),
          content: json(data.content),
          coverImage: optional(data.coverImage),
          featured: boolean(data.featured),
          status: status(data.status),
          publishedAt: status(data.status) === "PUBLISHED" ? new Date() : null,
        },
      });
      break;
    case "faq":
      await db.faq.update({
        where: { id },
        data: {
          category: string(data.category),
          question: string(data.question),
          answer: string(data.answer),
          order: number(data.order),
          visible: boolean(data.visible),
        },
      });
      break;
    case "testimonials":
      await db.testimonial.update({
        where: { id },
        data: {
          name: string(data.name),
          company: optional(data.company),
          position: optional(data.position),
          quote: string(data.quote),
          avatar: optional(data.avatar),
          rating: number(data.rating, 5),
          visible: boolean(data.visible),
        },
      });
      break;
    case "media":
      await db.media.update({
        where: { id },
        data: {
          name: string(data.name),
          url: string(data.url),
          alt: string(data.alt),
          folder: string(data.folder, "/"),
          mimeType: string(data.mimeType, "image/jpeg"),
          size: number(data.size),
        },
      });
      break;
    case "contacts":
      await db.contactRequest.update({
        where: { id },
        data: {
          name: string(data.name),
          email: string(data.email),
          message: string(data.message),
          status: requestStatus(data.status),
          replyStatus: optional(data.replyStatus),
        },
      });
      break;
    case "appointments":
      await db.appointment.update({
        where: { id },
        data: {
          name: string(data.name),
          email: string(data.email),
          topic: optional(data.topic),
          status: requestStatus(data.status),
          notes: optional(data.notes),
        },
      });
      break;
    case "settings":
      await db.setting.update({
        where: { id },
        data: {
          key: string(data.key),
          group: string(data.group, "general"),
          value: json(data.value),
        },
      });
      break;
    case "menus":
      await db.menuItem.update({
        where: { id },
        data: {
          label: string(data.label),
          url: string(data.url),
          external: boolean(data.external),
          order: number(data.order),
          visible: boolean(data.visible),
        },
      });
      break;
    case "seo":
      await db.seo.update({
        where: { id },
        data: {
          title: string(data.title),
          description: string(data.description),
          keywords: Array.isArray(data.keywords)
            ? data.keywords.map(String)
            : [],
          canonical: optional(data.canonical),
          ogImage: optional(data.ogImage),
          schema: data.schema ? json(data.schema) : Prisma.JsonNull,
          noIndex: boolean(data.noIndex),
        },
      });
      break;
    default:
      return NextResponse.json(
        { error: "Module non pris en charge." },
        { status: 400 },
      );
  }
  await markTranslationEditedIfApplicable(moduleKey, id);
  await db.auditLog.create({
    data: {
      userId: session.user.id,
      action: "UPDATE",
      entity: moduleKey,
      entityId: id,
      after: data as Prisma.InputJsonValue,
    },
  });
  return NextResponse.json({ id });
}

export async function DELETE(request: Request) {
  const session = await requireAdmin();
  if (!session)
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const moduleKey = searchParams.get("module");
  const id = searchParams.get("id");
  if (!moduleKey || !id)
    return NextResponse.json(
      { error: "Paramètres manquants." },
      { status: 400 },
    );
  switch (moduleKey) {
    case "pages":
      await db.page.delete({ where: { id } });
      break;
    case "services":
      await db.service.delete({ where: { id } });
      break;
    case "trainings":
      await db.training.delete({ where: { id } });
      break;
    case "articles":
      await db.article.delete({ where: { id } });
      break;
    case "team":
      await db.teamMember.delete({ where: { id } });
      break;
    case "case-studies":
      await db.caseStudy.delete({ where: { id } });
      break;
    case "faq":
      await db.faq.delete({ where: { id } });
      break;
    case "testimonials":
      await db.testimonial.delete({ where: { id } });
      break;
    case "media":
      await db.media.delete({ where: { id } });
      break;
    case "contacts":
      await db.contactRequest.delete({ where: { id } });
      break;
    case "appointments":
      await db.appointment.delete({ where: { id } });
      break;
    case "newsletter":
      await db.newsletterSubscriber.delete({ where: { id } });
      break;
    default:
      return NextResponse.json(
        { error: "Module non pris en charge." },
        { status: 400 },
      );
  }
  await db.auditLog.create({
    data: {
      userId: session.user.id,
      action: "DELETE",
      entity: moduleKey,
      entityId: id,
    },
  });
  return NextResponse.json({ success: true });
}
