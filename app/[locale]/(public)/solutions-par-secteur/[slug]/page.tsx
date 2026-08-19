import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/public/page-hero";
import { RichContent } from "@/components/public/rich-content";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { contentRepository } from "@/lib/repositories/content";
import { languageAlternates, localizedPath } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const locale = await getLocale();
  const item = await contentRepository.service((await params).slug, locale);
  if (!item || item.category?.slug !== "secteurs") return {};
  const path = `/solutions-par-secteur/${item.slug}`;
  return {
    title: item.seo?.title ?? item.title,
    description: item.seo?.description ?? item.excerpt,
    alternates: {
      canonical: item.seo?.canonical ?? localizedPath(path, locale),
      languages: languageAlternates(path),
    },
    robots: item.seo?.noIndex ? { index: false } : undefined,
    openGraph: { images: item.seo?.ogImage ? [item.seo.ogImage] : undefined },
  };
}

export default async function SecteurDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const t = await getTranslations("Pages.secteurDetail");
  const tCategories = await getTranslations("Categories");
  const locale = await getLocale();
  const item = await contentRepository.service((await params).slug, locale);
  if (!item || item.category?.slug !== "secteurs") notFound();

  return (
    <>
      <PageHero
        eyebrow={tCategories("secteurs")}
        title={item.title}
        description={item.excerpt}
        cta={{ label: t("cta"), href: "/rendez-vous" }}
      />
      <section className="section-pad bg-canvas">
        <div className="container-shell">
          <article className="max-w-3xl">
            <RichContent value={item.content} />
            <Button asChild size="lg" className="mt-8">
              <Link href="/rendez-vous">
                {t("cta")} <ArrowRight className="ml-3 size-4" />
              </Link>
            </Button>
          </article>
        </div>
      </section>
    </>
  );
}
