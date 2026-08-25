import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { formatDate } from "@/lib/utils";

export async function ArticleCard({
  article,
  locale,
}: {
  article: {
    slug: string;
    title: string;
    excerpt: string;
    coverImage: string | null;
    publishedAt: Date | null;
    readingTime: number;
    category: { name: string; slug: string } | null;
  };
  locale: string;
}) {
  const tCategories = await getTranslations({ locale, namespace: "Categories" });
  const categoryLabel = article.category?.slug
    ? tCategories.has(article.category.slug)
      ? tCategories(article.category.slug)
      : article.category.name
    : undefined;
  return (
    <Link href={`/blog/${article.slug}`} className="group">
      <div className="relative aspect-[1.35/1] overflow-hidden rounded-[2rem] bg-accent">
        {article.coverImage && (
          <Image
            src={article.coverImage}
            alt=""
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        )}
        <span className="absolute right-5 top-5 grid size-11 place-items-center rounded-full bg-lime transition group-hover:rotate-45">
          <ArrowUpRight className="size-4" />
        </span>
      </div>
      <div className="px-2 pt-6">
        <div className="flex gap-3 text-xs font-semibold uppercase tracking-[0.1em] text-cobalt">
          <span>{categoryLabel}</span><span>·</span><span>{article.readingTime} min</span>
        </div>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em]">{article.title}</h2>
        <p className="mt-4 line-clamp-2 leading-7 text-ink/55">{article.excerpt}</p>
        {article.publishedAt && <p className="mt-5 text-xs text-ink/40">{formatDate(article.publishedAt, locale)}</p>}
      </div>
    </Link>
  );
}
