import { ContentStatus, RequestStatus } from "@prisma/client";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { notifyTeam } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";
import { eventRegistrationSchema } from "@/lib/validators";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> },
) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  if (!rateLimit(`event-registration:${ip}`, 6, 60_000).allowed) {
    return NextResponse.json({ error: "Trop de tentatives." }, { status: 429 });
  }

  const parsed = eventRegistrationSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Vérifiez les informations saisies." },
      { status: 400 },
    );
  }

  const event = await db.event.findFirst({
    where: {
      id: (await params).eventId,
      status: ContentStatus.PUBLISHED,
      startAt: { gte: new Date() },
    },
  });
  if (!event) {
    return NextResponse.json(
      { error: "Cet événement n’est plus disponible." },
      { status: 404 },
    );
  }

  const data = { ...parsed.data };
  delete data.website;
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
