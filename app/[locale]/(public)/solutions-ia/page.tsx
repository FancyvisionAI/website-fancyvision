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
  const t = await getTranslations({ locale, namespace: "Pages.solutionsIa" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function SolutionsIaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Pages.solutionsIa" });
  const tCategories = await getTranslations({
    locale,
    namespace: "Categories",
  });
  const agents = await contentRepository.servicesByCategory(
    "agents-ia",
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
            {agents.map((item, index) => (
              <ContentCard
                key={item.id}
                href={`/solutions-ia/${item.slug}`}
                index={index}
                eyebrow={tCategories("agents-ia")}
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
