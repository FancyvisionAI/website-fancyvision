import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { AgentVisual } from "@/components/public/agent-visual";
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
  if (!item || item.category?.slug !== "agents-ia") return {};
  const path = `/solutions-ia/${item.slug}`;
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

export default async function SolutionIaDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const t = await getTranslations("Pages.solutionsIaDetail");
  const tCategories = await getTranslations("Categories");
  const locale = await getLocale();
  const item = await contentRepository.service((await params).slug, locale);
  if (!item || item.category?.slug !== "agents-ia") notFound();

  return (
    <>
      <PageHero
        eyebrow={tCategories("agents-ia")}
        title={item.title}
        description={item.excerpt}
        cta={{ label: t("cta"), href: "/rendez-vous" }}
      />
      <section className="section-pad bg-canvas">
        <div className="container-shell grid gap-12 lg:grid-cols-[.4fr_1fr]">
          <div className="hidden lg:block">
            <AgentVisual
              slug={item.slug}
              className="sticky top-28 aspect-square w-full"
            />
          </div>
          <article className="max-w-3xl">
            <AgentVisual
              slug={item.slug}
              className="mb-8 aspect-[2.4/1] w-full lg:hidden"
            />
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
