import { NextResponse } from "next/server";

import { contentRepository } from "@/lib/repositories/content";

export async function GET() {
  try {
    const team = await contentRepository.team();
    return NextResponse.json(team);
  } catch {
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération de l'équipe." },
      { status: 500 },
    );
  }
}
