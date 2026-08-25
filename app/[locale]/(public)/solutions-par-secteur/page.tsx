import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ContentCard } from "@/components/public/content-card";
import { PageHero } from "@/components/public/page-hero";
import { contentRepository } from "@/lib/repositories/content";

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
  const tCategories = await getTranslations({ locale, namespace: "Categories" });
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
        cta={{ label: t("cta"), href: "/rendez-vous" }}
      />
      <section className="section-pad bg-canvas pt-0">
        <div className="container-shell">
          <div className="grid gap-5 md:grid-cols-2">
            {secteurs.map((item, index) => (
              <ContentCard
                key={item.id}
                href={`/solutions-par-secteur/${item.slug}`}
                index={index}
                eyebrow={tCategories("secteurs")}
                title={item.title}
                description={item.excerpt}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
