import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

const escape = (value: unknown) =>
  `"${String(value ?? "").replaceAll('"', '""')}"`;

export async function GET(
  _: Request,
  { params }: { params: Promise<{ module: string }> },
) {
  if (!(await auth())?.user)
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  const moduleKey = (await params).module;
  let rows: unknown[][] = [];
  if (moduleKey === "contacts") {
    const items = await db.contactRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
    rows = [
      [
        "Nom",
        "Email",
        "Téléphone",
        "Entreprise",
        "Sujet",
        "Message",
        "Statut",
        "Date",
      ],
      ...items.map((item) => [
        item.name,
        item.email,
        item.phone,
        item.company,
        item.subject,
        item.message,
        item.status,
        item.createdAt.toISOString(),
      ]),
    ];
  } else if (moduleKey === "appointments") {
    const items = await db.appointment.findMany({
      orderBy: { createdAt: "desc" },
    });
    rows = [
      [
        "Nom",
        "Email",
        "Téléphone",
        "Entreprise",
        "Sujet",
        "Date souhaitée",
        "Statut",
      ],
      ...items.map((item) => [
        item.name,
        item.email,
        item.phone,
        item.company,
        item.topic,
        item.preferredDate?.toISOString(),
        item.status,
      ]),
    ];
  } else if (moduleKey === "newsletter") {
    const items = await db.newsletterSubscriber.findMany({
      orderBy: { createdAt: "desc" },
    });
    rows = [
      ["Email", "Source", "Inscription", "Désinscription"],
      ...items.map((item) => [
        item.email,
        item.source,
        item.createdAt.toISOString(),
        item.unsubscribedAt?.toISOString(),
      ]),
    ];
  } else
    return NextResponse.json(
      { error: "Export non pris en charge." },
      { status: 400 },
    );
  const csv = `\uFEFF${rows.map((row) => row.map(escape).join(";")).join("\n")}`;
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="fancyvision-${moduleKey}.csv"`,
    },
  });
}
