import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { notifyTeam } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";
import { appointmentSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  if (!rateLimit(`appointment:${ip}`, 4, 60_000).allowed) {
    return NextResponse.json({ error: "Trop de tentatives." }, { status: 429 });
  }
  const parsed = appointmentSchema.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json(
      { error: "Informations invalides." },
      { status: 400 },
    );
  const payload = { ...parsed.data };
  delete payload.website;
  const { preferredDate, ...data } = payload;
  const appointment = await db.appointment.create({
    data: {
      ...data,
      preferredDate: preferredDate ? new Date(preferredDate) : null,
    },
  });
  await notifyTeam(
    `Nouvelle demande de rendez-vous — ${data.name}`,
    `${data.name} (${data.email})\nSujet : ${data.topic}\nDate souhaitée : ${preferredDate || "non précisée"}`,
  ).catch(() => undefined);
  return NextResponse.json({ id: appointment.id }, { status: 201 });
}
