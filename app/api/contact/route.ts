import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { notifyTeam } from "@/lib/email";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { contactSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);
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
  // L'IP n'est utilisée que pour le rate-limiting ci-dessus : elle n'est
  // jamais relue une fois la demande créée (pas d'affichage admin, pas
  // d'export, pas d'audit) — inutile de la conserver dans metadata (audit
  // sécurité, finding F9).
  const contact = await db.contactRequest.create({ data });
  await notifyTeam(
    `Nouveau contact Sapiens IA — ${data.name}`,
    `${data.name} (${data.email})\n${data.company ?? ""}\n\n${data.message}`,
  ).catch((error) => console.error("notifyTeam failed", error));
  return NextResponse.json({ id: contact.id }, { status: 201 });
}
