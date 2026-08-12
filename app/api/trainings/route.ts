import { NextResponse } from "next/server";

import { contentRepository } from "@/lib/repositories/content";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const item = await contentRepository.training(slug);
      if (!item) {
        return NextResponse.json(
          { error: "Formation non trouvée." },
          { status: 404 },
        );
      }
      return NextResponse.json(item);
    }

    const items = await contentRepository.trainings();
    return NextResponse.json(items);
  } catch {
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération des formations." },
      { status: 500 },
    );
  }
}
