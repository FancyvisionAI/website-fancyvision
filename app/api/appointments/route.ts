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
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Corps de requête invalide." },
      { status: 400 },
    );
  }
  const parsed = appointmentSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: "Informations invalides.", fields: parsed.error.flatten() },
      { status: 400 },
    );
  const payload = { ...parsed.data };
  delete payload.website;
  const {
    preferredDate,
    sector,
    sectorOther,
    organizationSize,
    training,
    role,
    participants,
    needs,
    message,
    ...data
  } = payload;
  // Le modèle Appointment n'a pas de colonne dédiée pour ces champs
  // (formulaire Audit gratuit, puis demandes du catalogue de formations) :
  // on les intègre au message plutôt que d'ajouter une migration Prisma
  // pour cette phase.
  const composedMessage = [
    training ? `Formation sélectionnée : ${training}` : null,
    role ? `Fonction / poste : ${role}` : null,
    participants ? `Nombre de participants : ${participants}` : null,
    needs ? `Besoins / objectifs spécifiques : ${needs}` : null,
    sector ? `Secteur d'activité : ${sector}` : null,
    sectorOther ? `Précision secteur : ${sectorOther}` : null,
    organizationSize ? `Profil de l'organisation : ${organizationSize}` : null,
    message ? message : null,
  ]
    .filter(Boolean)
    .join("\n");
  const appointment = await db.appointment.create({
    data: {
      ...data,
      message: composedMessage || null,
      preferredDate: preferredDate ? new Date(preferredDate) : null,
    },
  });
  await notifyTeam(
    `Nouvelle demande de rendez-vous — ${data.name}`,
    `${data.name} (${data.email})\nSujet : ${data.topic}\nDate souhaitée : ${preferredDate || "non précisée"}${composedMessage ? `\n\n${composedMessage}` : ""}`,
  ).catch((error) => console.error("notifyTeam failed", error));
  return NextResponse.json({ id: appointment.id }, { status: 201 });
}
