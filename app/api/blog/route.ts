import { NextResponse } from "next/server";

import { contentRepository } from "@/lib/repositories/content";

// Plafond du paramètre `take` (audit sécurité, finding F8) : sans limite,
// un client pouvait demander un nombre arbitrairement grand d'articles en
// une seule requête. Sans effet sur le comportement par défaut (`take`
// absent reste sans limite, comme aujourd'hui) ni sur les valeurs déjà
// raisonnables — seules les valeurs excessives ou invalides sont ramenées
// à une valeur sûre.
const MAX_BLOG_TAKE = 50;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const category = searchParams.get("category") || undefined;
    const query =
      searchParams.get("q") || searchParams.get("query") || undefined;
    const takeParam = searchParams.get("take");
    const parsedTake = takeParam ? parseInt(takeParam, 10) : undefined;
    const take =
      parsedTake !== undefined && Number.isInteger(parsedTake) && parsedTake > 0
        ? Math.min(parsedTake, MAX_BLOG_TAKE)
        : undefined;

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
      take,
    });
    return NextResponse.json(articles);
  } catch {
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération des articles du blog." },
      { status: 500 },
    );
  }
}
