import { NextResponse } from "next/server";

import { contentRepository } from "@/lib/repositories/content";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || searchParams.get("query");

    if (!q || q.trim().length < 2) {
      return NextResponse.json(
        {
          error:
            "Le paramètre de recherche 'q' doit contenir au moins 2 caractères.",
        },
        { status: 400 },
      );
    }

    const results = await contentRepository.globalSearch(q);
    return NextResponse.json(results);
  } catch {
    return NextResponse.json(
      { error: "Erreur serveur lors de la recherche globale." },
      { status: 500 },
    );
  }
}
