import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/public/page-hero";
import { Button } from "@/components/ui/button";
import { Link, redirect } from "@/i18n/navigation";
import { dev2Cities, dev2Trainings } from "@/lib/content/dev2";
import { languageAlternates, localizedPath } from "@/lib/utils";

// Réutilise le titre/la description déjà affichés par PageHero pour cette
// ville (traductions Pages.trainingCity existantes) : pas de nouveau texte.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const city = dev2Cities.find(([citySlug]) => citySlug === slug)?.[1];
  if (!city) return {};
  const locale = await getLocale();
  const t = await getTranslations("Pages.trainingCity");
  const path = `/formations-particuliers/${slug}`;
  return {
    title: t("title", { city }),
    description: t("description"),
    alternates: {
      canonical: localizedPath(path, locale),
      languages: languageAlternates(path),
    },
  };
}

export default async function PrivateTrainingDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const t = await getTranslations("Pages.trainingCity");
  const locale = await getLocale();
  const { slug } = await params;
  if (
    dev2Trainings.some(
      (training) =>
        training.category === "particuliers" && training.slug === slug,
    )
  ) {
    redirect({ href: `/formations/${slug}`, locale });
  }

  const city = dev2Cities.find(([citySlug]) => citySlug === slug)?.[1];
  if (!city) notFound();

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow", { city })}
        title={t("title", { city })}
        description={t("description")}
        cta={{
          label: t("cta"),
          href: "/rendez-vous?context=formation-programme",
        }}
      />
      <section className="section-pad bg-canvas pt-0">
        <div className="container-shell grid border-l border-t border-lime md:grid-cols-3">
          {[
            [t("practicalTitle"), t("practicalDescription")],
            [t("onsiteTitle"), t("onsiteDescription", { city })],
            [t("adaptedTitle"), t("adaptedDescription")],
          ].map(([title, description]) => (
            <div
              key={title}
              className="min-h-64 border-b border-r border-lime p-8"
            >
              <h2 className="text-xl font-medium">{title}</h2>
              <p className="mt-5 leading-7 text-muted">{description}</p>
            </div>
          ))}
        </div>
        <div className="container-shell pt-10">
          <Button asChild>
            <Link href="/rendez-vous?context=formation-personnalisee">
              {t("organize", { city })}
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
