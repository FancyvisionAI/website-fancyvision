import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleCard } from "@/components/public/article-card";
import { PageHero } from "@/components/public/page-hero";
import { contentRepository } from "@/lib/repositories/content";

export const metadata: Metadata = {
  title: "Blog IA",
  description:
    "Guides, analyses et opinions sur l’intelligence artificielle générative.",
};

export default async function BlogPage() {
  const [page, articles] = await Promise.all([
    contentRepository.page("blog"),
    contentRepository.articles(),
  ]);
  if (!page) notFound();
  return (
    <>
      <PageHero
        eyebrow="Le média"
        title={page.headline ?? page.title}
        description={page.description}
      />
      <section className="section-pad bg-canvas pt-0">
        <div className="container-shell grid gap-x-6 gap-y-16 md:grid-cols-2">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </>
  );
}
