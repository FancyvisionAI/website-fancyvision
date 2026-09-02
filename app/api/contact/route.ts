import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { notifyTeam } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";
import { contactSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  if (!rateLimit(`contact:${ip}`, 4, 60_000).allowed) {
    return NextResponse.json({ error: "Trop de tentatives." }, { status: 429 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Corps de requête invalide." },
      { status: 400 },
    );
  }
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Informations invalides.", fields: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const data = { ...parsed.data };
  delete data.website;
  const contact = await db.contactRequest.create({
    data: { ...data, metadata: { ip } },
  });
  await notifyTeam(
    `Nouveau contact Sapiens IA — ${data.name}`,
    `${data.name} (${data.email})\n${data.company ?? ""}\n\n${data.message}`,
  ).catch(() => undefined);
  return NextResponse.json({ id: contact.id }, { status: 201 });
}
