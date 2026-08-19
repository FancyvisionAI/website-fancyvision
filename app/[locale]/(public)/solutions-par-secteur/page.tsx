import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { ContentCard } from "@/components/public/content-card";
import { PageHero } from "@/components/public/page-hero";
import { contentRepository } from "@/lib/repositories/content";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Pages.secteurs");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function SolutionsParSecteurPage() {
  const t = await getTranslations("Pages.secteurs");
  const tCategories = await getTranslations("Categories");
  const locale = await getLocale();
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
