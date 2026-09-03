import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ContentCard } from "@/components/public/content-card";
import { PageHero } from "@/components/public/page-hero";
import { Reveal } from "@/components/public/reveal";
import { SectorVisual } from "@/components/public/sector-visual";
import { contentRepository } from "@/lib/repositories/content";
import { languageAlternates, localizedPath } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages.secteurs" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: localizedPath("/solutions-par-secteur", locale),
      languages: languageAlternates("/solutions-par-secteur"),
    },
  };
}

export default async function SolutionsParSecteurPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Pages.secteurs" });
  const tCategories = await getTranslations({
    locale,
    namespace: "Categories",
  });
  const secteurs = await contentRepository.servicesByCategory(
    "secteurs",
    locale,
  );

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
        cta={{ label: t("cta"), href: "/rendez-vous?context=consultation" }}
      />
      <section className="section-pad bg-canvas pt-0">
        <div className="container-shell">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {secteurs.map((item, index) => (
              <Reveal key={item.id} delay={(index % 3) * 0.08}>
                <ContentCard
                  href={`/solutions-par-secteur/${item.slug}`}
                  index={index}
                  eyebrow={tCategories("secteurs")}
                  title={item.title}
                  description={item.excerpt}
                  visual={<SectorVisual slug={item.slug} className="size-14" />}
                  compact
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
