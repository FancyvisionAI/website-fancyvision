import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { ContentCard } from "@/components/public/content-card";
import { PageHero } from "@/components/public/page-hero";
import { contentRepository } from "@/lib/repositories/content";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Pages.training");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function TrainingPage() {
  const t = await getTranslations("Pages.training");
  const locale = await getLocale();
  const [page, trainings] = await Promise.all([
    contentRepository.page("formation", locale),
    contentRepository.trainings(locale),
  ]);
  if (!page) notFound();
  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={page.headline ?? page.title}
        description={page.description}
        cta={{ label: t("cta"), href: "/rendez-vous" }}
      />
      <section className="section-pad bg-canvas pt-0">
        <div className="container-shell grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {trainings.map((item, index) => (
            <ContentCard
              key={item.id}
              href={`/formations/${item.slug}`}
              index={index}
              eyebrow={item.category?.name}
              title={item.title}
              description={item.excerpt}
              meta={item.duration}
            />
          ))}
        </div>
      </section>
    </>
  );
}
