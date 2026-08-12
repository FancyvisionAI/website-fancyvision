import { NextResponse } from "next/server";

import { contentRepository } from "@/lib/repositories/content";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug") || "a-propos";
    const [page, settings] = await Promise.all([
      contentRepository.page(slug),
      contentRepository.settings(),
    ]);

    if (!page && (!settings || settings.length === 0)) {
      return NextResponse.json(
        { error: "Information entreprise non trouvée." },
        { status: 404 },
      );
    }

    return NextResponse.json({ page, settings });
  } catch {
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération des données entreprise." },
      { status: 500 },
    );
  }
}
