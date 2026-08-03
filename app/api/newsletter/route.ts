import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { newsletterSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  if (!rateLimit(`newsletter:${ip}`, 8, 60_000).allowed) {
    return NextResponse.json({ error: "Trop de tentatives." }, { status: 429 });
  }
  const parsed = newsletterSchema.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json({ error: "Email invalide." }, { status: 400 });
  const { email } = parsed.data;
  await db.newsletterSubscriber.upsert({
    where: { email },
    update: { unsubscribedAt: null },
    create: { email, source: "website", confirmedAt: new Date() },
  });
  return NextResponse.json({ success: true }, { status: 201 });
}

export async function DELETE(request: Request) {
  const email = new URL(request.url).searchParams.get("email");
  const parsed = newsletterSchema.shape.email.safeParse(email);
  if (!parsed.success)
    return NextResponse.json({ error: "Email invalide." }, { status: 400 });
  await db.newsletterSubscriber.updateMany({
    where: { email: parsed.data },
    data: { unsubscribedAt: new Date() },
  });
  return NextResponse.json({ success: true });
}
