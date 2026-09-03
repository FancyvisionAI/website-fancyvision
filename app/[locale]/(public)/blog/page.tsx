import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { ArticleCard } from "@/components/public/article-card";
import { PageHero } from "@/components/public/page-hero";
import { contentRepository } from "@/lib/repositories/content";
import { languageAlternates, localizedPath } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("Pages.blog");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: localizedPath("/blog", locale),
      languages: languageAlternates("/blog"),
    },
  };
}

export default async function BlogPage() {
  const t = await getTranslations("Pages.blog");
  const locale = await getLocale();
  const [page, articles] = await Promise.all([
    contentRepository.page("blog", locale),
    contentRepository.articles({ locale }),
  ]);
  if (!page) notFound();
  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={page.headline ?? page.title}
        description={page.description}
      />
      <section className="section-pad bg-canvas pt-0">
        <div className="container-shell grid gap-x-6 gap-y-16 md:grid-cols-2">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} locale={locale} />
          ))}
        </div>
      </section>
    </>
  );
}
