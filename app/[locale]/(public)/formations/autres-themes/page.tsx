import type { Metadata } from "next";
import { Info } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { CatalogueExplorer } from "@/components/public/catalogue-explorer";
import { PageHero } from "@/components/public/page-hero";
import type { Cible } from "@/lib/content/formations-catalogue";
import { languageAlternates, localizedPath } from "@/lib/utils";

function resolveCible(value: string | undefined): Cible {
  return value === "cible-2" ? "cible-2" : "cible-1";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "Pages.formationsAutresThemes",
  });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: localizedPath("/formations/autres-themes", locale),
      languages: languageAlternates("/formations/autres-themes"),
    },
  };
}

export default async function FormationsAutresThemesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ cible?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { cible: rawCible } = await searchParams;
  const cible = resolveCible(rawCible);
  const t = await getTranslations({
    locale,
    namespace: "Pages.formationsAutresThemes",
  });

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />
      <section className="section-pad bg-canvas">
        <div className="container-shell">
          <div className="border-cobalt/30 bg-cobalt/5 flex items-start gap-3 rounded-2xl border px-5 py-4">
            <Info className="mt-0.5 size-4 shrink-0 text-cobalt" />
            <p className="text-ink/70 text-sm leading-6">
              {t("planAheadNotice")}
            </p>
          </div>
          <div className="mt-10">
            <CatalogueExplorer initialCible={cible} />
          </div>
        </div>
      </section>
    </>
  );
}
