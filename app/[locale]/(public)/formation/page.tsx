import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { ContentCard } from "@/components/public/content-card";
import { PageHero } from "@/components/public/page-hero";
import { Reveal } from "@/components/public/reveal";
import { TrainingIconTile } from "@/components/public/training-icon-tile";
import { contentRepository } from "@/lib/repositories/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages.training" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function TrainingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Pages.training" });
  const tCategories = await getTranslations({
    locale,
    namespace: "Categories",
  });
  const [page, enterprise, individual] = await Promise.all([
    contentRepository.page("formation", locale),
    contentRepository.trainingsByCategory("entreprise", locale),
    contentRepository.trainingsByCategory("particuliers", locale),
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
        <div className="container-shell">
          <div className="grid gap-10 border-b border-lime pb-12 lg:grid-cols-[.55fr_1fr]">
            <span className="eyebrow text-ink">{t("enterpriseEyebrow")}</span>
            <div>
              <h2 className="text-[clamp(2.4rem,4vw,3.25rem)] font-normal leading-[1.15] tracking-[-0.03em]">
                {t("enterpriseTitle")}
              </h2>
              <p className="mt-5 max-w-2xl leading-7 text-muted">
                {t("enterpriseDescription")}
              </p>
            </div>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {enterprise.map((item, index) => (
              <Reveal key={item.id} delay={(index % 3) * 0.08}>
                <ContentCard
                  href={`/formations/${item.slug}`}
                  index={index}
                  eyebrow={tCategories("entreprise")}
                  title={item.title}
                  description={item.excerpt}
                  meta={item.duration}
                  visual={<TrainingIconTile slug={item.slug} />}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-lime">
        <div className="container-shell">
          <div className="grid gap-10 border-b border-lime pb-12 lg:grid-cols-[.55fr_1fr]">
            <span className="eyebrow text-ink">{t("individualEyebrow")}</span>
            <div>
              <h2 className="text-[clamp(2.4rem,4vw,3.25rem)] font-normal leading-[1.15] tracking-[-0.03em]">
                {t("individualTitle")}
              </h2>
              <p className="mt-5 max-w-2xl leading-7 text-muted">
                {t("individualDescription")}
              </p>
            </div>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {individual.map((item, index) => (
              <Reveal key={item.id} delay={(index % 3) * 0.08}>
                <ContentCard
                  href={`/formations/${item.slug}`}
                  index={index}
                  eyebrow={tCategories("particuliers")}
                  title={item.title}
                  description={item.excerpt}
                  meta={item.duration}
                  visual={<TrainingIconTile slug={item.slug} />}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
