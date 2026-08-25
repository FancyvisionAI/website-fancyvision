import { getLocale, getTranslations } from "next-intl/server";

import { ArticleCard } from "@/components/public/article-card";
import { PageHero } from "@/components/public/page-hero";
import { contentRepository } from "@/lib/repositories/content";

export default async function BlogCategory({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const t = await getTranslations("Pages.blogCategory");
  const tCategories = await getTranslations("Categories");
  const locale = await getLocale();
  const { slug } = await params;
  const articles = await contentRepository.articles({ category: slug, locale });
  const name = tCategories.has(slug)
    ? tCategories(slug)
    : (articles[0]?.category?.name ?? slug.replaceAll("-", " "));
  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={name}
        description={t("articleCount", { count: articles.length })}
      />
      <section className="section-pad pt-0">
        <div className="container-shell grid gap-x-6 gap-y-16 md:grid-cols-2">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} locale={locale} />
          ))}
        </div>
      </section>
    </>
  );
}
