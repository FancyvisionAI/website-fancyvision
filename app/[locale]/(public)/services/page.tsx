import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { ContentCard } from "@/components/public/content-card";
import { PageHero } from "@/components/public/page-hero";
import { FaqSection } from "@/components/public/home-sections";
import { contentRepository } from "@/lib/repositories/content";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Pages.services");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function ServicesPage() {
  const t = await getTranslations("Pages.services");
  const tCategories = await getTranslations("Categories");
  const locale = await getLocale();
  const [page, services, faqs] = await Promise.all([
    contentRepository.page("services", locale),
    contentRepository.services(false, locale),
    contentRepository.faqs(),
  ]);
  if (!page) notFound();
  const consulting = services.filter(
    (item) => item.category?.slug === "conseil",
  );
  const dataServices = services.filter(
    (item) => item.category?.slug === "data",
  );
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
            <span className="eyebrow text-ink">{t("consultingEyebrow")}</span>
            <div>
              <h2 className="text-[clamp(2.4rem,4vw,3.25rem)] font-normal leading-[1.15] tracking-[-0.03em]">
                {t("consultingTitle")}
              </h2>
              <p className="mt-5 max-w-2xl leading-7 text-muted">
                {t("consultingDescription")}
              </p>
            </div>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {consulting.map((item, index) => (
              <ContentCard
                key={item.id}
                href={`/services/${item.slug}`}
                index={index}
                eyebrow={tCategories("conseil")}
                title={item.title}
                description={item.excerpt}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-lime">
        <div className="container-shell">
          <div className="grid gap-10 border-b border-lime pb-12 lg:grid-cols-[.55fr_1fr]">
            <span className="eyebrow text-ink">{t("dataEyebrow")}</span>
            <div>
              <h2 className="text-[clamp(2.4rem,4vw,3.25rem)] font-normal leading-[1.15] tracking-[-0.03em]">
                {t("dataTitle")}
              </h2>
              <p className="mt-5 max-w-2xl leading-7 text-muted">
                {t("dataDescription")}
              </p>
            </div>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {dataServices.map((item, index) => (
              <ContentCard
                key={item.id}
                href={`/services/${item.slug}`}
                index={index}
                eyebrow={tCategories("data")}
                title={item.title}
                description={item.excerpt}
              />
            ))}
          </div>
        </div>
      </section>
      <FaqSection items={faqs} />
    </>
  );
}
