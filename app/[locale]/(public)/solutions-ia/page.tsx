import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { AgentVisual } from "@/components/public/agent-visual";
import { ContentCard } from "@/components/public/content-card";
import { PageHero } from "@/components/public/page-hero";
import { Reveal } from "@/components/public/reveal";
import { contentRepository } from "@/lib/repositories/content";
import { languageAlternates, localizedPath } from "@/lib/utils";

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
    alternates: {
      canonical: localizedPath("/solutions-ia", locale),
      languages: languageAlternates("/solutions-ia"),
    },
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
        cta={{ label: t("cta"), href: "/rendez-vous?context=consultation" }}
      />
      <section className="section-pad bg-canvas pt-0">
        <div className="container-shell">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {agents.map((item, index) => (
              <Reveal key={item.id} delay={(index % 3) * 0.08} offset={12}>
                <ContentCard
                  href={`/solutions-ia/${item.slug}`}
                  index={index}
                  eyebrow={tCategories("agents-ia")}
                  title={item.title}
                  description={item.excerpt}
                  visual={<AgentVisual slug={item.slug} className="size-14" />}
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
