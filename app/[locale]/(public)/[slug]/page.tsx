import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { ContentCard } from "@/components/public/content-card";
import { PageHero } from "@/components/public/page-hero";
import { contentRepository } from "@/lib/repositories/content";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const page = await contentRepository.page(slug, locale);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
  };
}

export default async function DatabaseLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const t = await getTranslations("Pages.trainingLanding");
  const locale = await getLocale();
  const { slug } = await params;
  const [page, trainings] = await Promise.all([
    contentRepository.page(slug, locale),
    contentRepository.trainings(locale),
  ]);
  if (!page || !slug.startsWith("formation-ia-")) notFound();

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={page.headline ?? page.title}
        description={page.description}
        cta={{ label: t("cta"), href: "/rendez-vous" }}
      />
      <section className="section-pad bg-bg">
        <div className="container-shell">
          <div className="mb-9 grid gap-5 lg:grid-cols-[.55fr_1fr] lg:items-end">
            <span className="eyebrow text-cobalt">{t("programsEyebrow")}</span>
            <div>
              <h2 className="max-w-3xl text-[clamp(2rem,3.4vw,2.8rem)] font-normal leading-[1.15] tracking-[-0.03em]">
                {t("programsTitle")}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
                {t("programsDescription")}
              </p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {trainings.slice(0, 6).map((training, index) => (
              <ContentCard
                key={training.id}
                href={`/formations/${training.slug}`}
                index={index}
                eyebrow={training.category?.name}
                title={training.title}
                description={training.excerpt}
                meta={training.duration}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
