import { NextResponse } from "next/server";

import { contentRepository } from "@/lib/repositories/content";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const featuredParam = searchParams.get("featured");

    if (slug) {
      const item = await contentRepository.service(slug);
      if (!item) {
        return NextResponse.json(
          { error: "Service non trouvé." },
          { status: 404 },
        );
      }
      return NextResponse.json(item);
    }

    const featuredOnly = featuredParam === "true";
    const items = await contentRepository.services(featuredOnly);
    return NextResponse.json(items);
  } catch {
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération des services." },
      { status: 500 },
    );
  }
}
