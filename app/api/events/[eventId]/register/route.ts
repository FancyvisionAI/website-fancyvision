import { ContentStatus, RequestStatus } from "@prisma/client";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { notifyTeam } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";
import { eventRegistrationSchema } from "@/lib/validators";

// L'API est hors du routing next-intl (/api n'est pas préfixé par la
// locale) : le client indique sa langue via le champ `locale` du payload
// pour permettre une erreur dans la bonne langue, sans dépendre de
// next-intl côté serveur.
const ERROR_MESSAGES = {
  fr: {
    tooManyAttempts: "Trop de tentatives.",
    invalid: "Vérifiez les informations saisies.",
    eventUnavailable: "Cet événement n’est plus disponible.",
  },
  en: {
    tooManyAttempts: "Too many attempts.",
    invalid: "Please check the information entered.",
    eventUnavailable: "This event is no longer available.",
  },
} as const;

function messagesFor(locale: unknown) {
  return ERROR_MESSAGES[locale === "en" ? "en" : "fr"];
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> },
) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const body = await request.json();
  const t = messagesFor(body?.locale);
  if (!rateLimit(`event-registration:${ip}`, 6, 60_000).allowed) {
    return NextResponse.json({ error: t.tooManyAttempts }, { status: 429 });
  }

  const parsed = eventRegistrationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: t.invalid }, { status: 400 });
  }

  const event = await db.event.findFirst({
    where: {
      id: (await params).eventId,
      status: ContentStatus.PUBLISHED,
      startAt: { gte: new Date() },
    },
  });
  if (!event) {
    return NextResponse.json({ error: t.eventUnavailable }, { status: 404 });
  }

  const data = { ...parsed.data };
  delete data.website;
  delete data.locale;
  const registration = await db.eventRegistration.upsert({
    where: {
      eventId_email: { eventId: event.id, email: data.email },
    },
    update: { ...data, status: RequestStatus.NEW },
    create: { ...data, eventId: event.id },
  });

  await notifyTeam(
    `Nouvelle inscription — ${event.title}`,
    `${data.name} (${data.email})\nTéléphone : ${data.phone || "non précisé"}\nÉvénement : ${event.title}`,
  ).catch(() => undefined);

  return NextResponse.json({ id: registration.id }, { status: 201 });
}
