import { NextResponse } from "next/server";

import { contentRepository } from "@/lib/repositories/content";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    let items = await contentRepository.faqs();
    if (category) {
      items = items.filter(
        (faq) => faq.category.toLowerCase() === category.toLowerCase(),
      );
    }
    return NextResponse.json(items);
  } catch {
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération des FAQ." },
      { status: 500 },
    );
  }
}
