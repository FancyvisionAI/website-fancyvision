import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { ContentCard } from "@/components/public/content-card";
import { PageHero } from "@/components/public/page-hero";
import { contentRepository } from "@/lib/repositories/content";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Pages.caseStudies");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function CaseStudiesPage() {
  const t = await getTranslations("Pages.caseStudies");
  const locale = await getLocale();
  const [page, cases] = await Promise.all([
    contentRepository.page("etudes-de-cas", locale),
    contentRepository.caseStudies(locale),
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
        <div className="container-shell grid gap-5 md:grid-cols-2">
          {cases.map((item, index) => (
            <ContentCard
              key={item.id}
              href={`/etudes-de-cas/${item.slug}`}
              index={index}
              eyebrow={item.sector}
              title={item.title}
              description={item.excerpt}
              meta={
                item.teamSize ? t("teamSize", { count: item.teamSize }) : null
              }
            />
          ))}
        </div>
      </section>
    </>
  );
}
