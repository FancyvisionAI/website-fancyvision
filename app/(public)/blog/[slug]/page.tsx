import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/public/page-hero";
import { RichContent } from "@/components/public/rich-content";
import { contentRepository } from "@/lib/repositories/content";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const article = await contentRepository.article((await params).slug);
  if (!article) return {};
  return {
    title: article.seo?.title ?? article.title,
    description: article.seo?.description ?? article.excerpt,
    alternates: {
      canonical: article.seo?.canonical ?? `/blog/${article.slug}`,
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
  const article = await contentRepository.article((await params).slug);
  if (!article) notFound();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    datePublished: article.publishedAt?.toISOString(),
    author: { "@type": "Person", name: article.author?.name ?? "FancyVision" },
    publisher: { "@type": "Organization", name: "FancyVision" },
  };
  return (
    <>
      <PageHero
        eyebrow={article.category?.name}
        title={article.title}
        description={article.excerpt}
      />
      <section className="bg-canvas pb-14">
        <div className="container-shell">
          <div className="flex flex-wrap gap-4 text-xs font-semibold uppercase tracking-[0.1em] text-black/45">
            {article.publishedAt && (
              <span>{formatDate(article.publishedAt)}</span>
            )}
            <span>·</span>
            <span>{article.readingTime} minutes de lecture</span>
            <span>·</span>
            <span>{article.author?.name ?? "FancyVision"}</span>
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
      <article className="section-pad bg-white">
        <div className="mx-auto max-w-3xl px-5">
          <RichContent value={article.content} />
        </div>
      </article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
