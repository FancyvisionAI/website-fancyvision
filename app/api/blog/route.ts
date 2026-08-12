import { NextResponse } from "next/server";

import { contentRepository } from "@/lib/repositories/content";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const category = searchParams.get("category") || undefined;
    const query = searchParams.get("q") || searchParams.get("query") || undefined;
    const takeParam = searchParams.get("take");
    const take = takeParam ? parseInt(takeParam, 10) : undefined;

    if (slug) {
      const article = await contentRepository.article(slug);
      if (!article) {
        return NextResponse.json(
          { error: "Article non trouvé." },
          { status: 404 },
        );
      }
      return NextResponse.json(article);
    }

    const articles = await contentRepository.articles({
      category,
      query,
      take: Number.isNaN(take) ? undefined : take,
    });
    return NextResponse.json(articles);
  } catch {
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération des articles du blog." },
      { status: 500 },
    );
  }
}
