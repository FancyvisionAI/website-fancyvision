import { ArticleCard } from "@/components/public/article-card";
import { PageHero } from "@/components/public/page-hero";
import { contentRepository } from "@/lib/repositories/content";

export default async function BlogCategory({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const articles = await contentRepository.articles({ category: slug });
  const name = articles[0]?.category?.name ?? slug.replaceAll("-", " ");
  return (
    <>
      <PageHero
        eyebrow="Catégorie"
        title={name}
        description={`${articles.length} article(s) à découvrir.`}
      />
      <section className="section-pad pt-0">
        <div className="container-shell grid gap-x-6 gap-y-16 md:grid-cols-2">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </>
  );
}
