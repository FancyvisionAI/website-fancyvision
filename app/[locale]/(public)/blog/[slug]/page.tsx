import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/public/page-hero";
import { RichContent } from "@/components/public/rich-content";
import { contentRepository } from "@/lib/repositories/content";
import { formatDate, languageAlternates, localizedPath } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const locale = await getLocale();
  const article = await contentRepository.article((await params).slug, locale);
  if (!article) return {};
  const path = `/blog/${article.slug}`;
  return {
    title: article.seo?.title ?? article.title,
    description: article.seo?.description ?? article.excerpt,
    alternates: {
      canonical: article.seo?.canonical ?? localizedPath(path, locale),
      languages: languageAlternates(path),
    },
    openGraph: {
      type: "article",
      images: article.coverImage ? [article.coverImage] : undefined,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const locale = await getLocale();
  const t = await getTranslations("Pages.blog");
  const tCategories = await getTranslations("Categories");
  const article = await contentRepository.article((await params).slug, locale);
  if (!article) notFound();
  const categoryLabel = article.category?.slug
    ? tCategories.has(article.category.slug)
      ? tCategories(article.category.slug)
      : article.category.name
    : undefined;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    datePublished: article.publishedAt?.toISOString(),
    author: { "@type": "Person", name: article.author?.name ?? "Sapiens-IA" },
    publisher: { "@type": "Organization", name: "Sapiens-IA" },
  };
  return (
    <>
      <PageHero
        eyebrow={categoryLabel}
        title={article.title}
        description={article.excerpt}
      />
      <section className="bg-canvas pb-14">
        <div className="container-shell">
          <div className="text-ink/45 flex flex-wrap gap-4 text-xs font-semibold uppercase tracking-[0.1em]">
            {article.publishedAt && (
              <span>{formatDate(article.publishedAt, locale)}</span>
            )}
            <span>·</span>
            <span>{t("readingTime", { count: article.readingTime })}</span>
            <span>·</span>
            <span>{article.author?.name ?? "Sapiens-IA"}</span>
          </div>
          {article.coverImage && (
            <div className="relative mt-10 aspect-[2/1] overflow-hidden rounded-[2rem]">
              <Image
                src={article.coverImage}
                alt=""
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            </div>
          )}
        </div>
      </section>
      <article className="section-pad bg-canvas">
        <div className="mx-auto max-w-3xl px-5">
          <RichContent value={article.content} />
        </div>
      </article>
      <script
        type="application/ld+json"
        // Échappe `<` (notamment la séquence `</script>`) : sans cela, un
        // champ du contenu (titre, description...) contenant littéralement
        // "</script>" pourrait clore prématurément la balise et injecter du
        // HTML/JS arbitraire dans la page. Technique standard recommandée
        // pour l'injection de JSON dans un <script> — ne modifie pas la
        // donnée JSON-LD elle-même, uniquement son encodage à l'affichage.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
