import type { Metadata } from "next";
import { ArrowRight, CheckCircle2, Clock, Gauge, Users } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { NiveauxExpertiseCards } from "@/components/public/niveaux-expertise-cards";
import { PageHero } from "@/components/public/page-hero";
import { RichContent } from "@/components/public/rich-content";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { contentRepository } from "@/lib/repositories/content";
import { languageAlternates, localizedPath } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const locale = await getLocale();
  const item = await contentRepository.training((await params).slug, locale);
  if (!item) return {};
  const path = `/formations/${item.slug}`;
  return {
    title: item.seo?.title ?? item.title,
    description: item.seo?.description ?? item.excerpt,
    alternates: {
      canonical: item.seo?.canonical ?? localizedPath(path, locale),
      languages: languageAlternates(path),
    },
  };
}

const LEVEL_LABEL_KEYS = {
  BEGINNER: "levelBeginner",
  INTERMEDIATE: "levelIntermediate",
  ADVANCED: "levelAdvanced",
  ALL_LEVELS: "levelAllLevels",
} as const;

export default async function TrainingDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const t = await getTranslations("Pages.trainingDetail");
  const tCategories = await getTranslations("Categories");
  const locale = await getLocale();
  const item = await contentRepository.training((await params).slug, locale);
  if (!item) notFound();
  const modules = Array.isArray(item.modules)
    ? (item.modules as Array<{ title?: string; description?: string }>)
    : [];
  // Une formation sans objectifs ni modules confirmés n'a pas encore reçu
  // son contenu détaillé (programme, prérequis, livrables) : on l'indique
  // clairement plutôt que d'afficher des sections vides.
  const detailsConfirmed = item.objectives.length > 0 || modules.length > 0;
  const categoryLabel = item.category?.slug
    ? tCategories(item.category.slug)
    : undefined;

  const hasAudience = item.audience.length > 0;
  const isAllLevels = item.difficulty === "ALL_LEVELS";
  // Pour ALL_LEVELS, les trois niveaux sont présentés dans un bloc dédié à
  // trois cartes plus bas (cf. NiveauxExpertiseCards) plutôt que compressés
  // dans une carte étroite au même format que Durée/Public.
  const infoCardCount = (hasAudience ? 2 : 1) + (isAllLevels ? 0 : 1);
  const trainingRequestHref = `/rendez-vous?context=formation-programme&training=${encodeURIComponent(item.title)}`;
  const trainingCustomHref = `/rendez-vous?context=formation-personnalisee&training=${encodeURIComponent(item.title)}`;

  return (
    <>
      <PageHero
        eyebrow={categoryLabel}
        title={item.title}
        description={item.excerpt}
        cta={{ label: t("cta"), href: trainingRequestHref }}
      />
      <section className="section-pad bg-canvas">
        <div className="container-shell">
          <div
            className={`grid gap-3 ${infoCardCount === 3 ? "sm:grid-cols-3" : infoCardCount === 2 ? "sm:grid-cols-2" : "sm:grid-cols-1"}`}
          >
            <div className="rounded-3xl bg-canvas p-6">
              <Clock className="size-5" />
              <p className="text-ink/45 mt-8 text-sm">{t("duration")}</p>
              <p className="mt-1 text-xl font-semibold">
                {item.duration ?? t("custom")}
              </p>
            </div>
            {hasAudience && (
              <div className="rounded-3xl bg-canvas p-6">
                <Users className="size-5" />
                <p className="text-ink/45 mt-8 text-sm">{t("audience")}</p>
                <p className="mt-1 text-xl font-semibold">
                  {item.audience.join(", ")}
                </p>
              </div>
            )}
            {!isAllLevels && (
              <div className="rounded-3xl bg-lime p-6">
                <Gauge className="size-5" />
                <p className="text-ink/45 mt-8 text-sm">{t("level")}</p>
                <p className="mt-1 text-xl font-semibold">
                  {t(LEVEL_LABEL_KEYS[item.difficulty])}
                </p>
              </div>
            )}
          </div>
          {isAllLevels && (
            <div className="mt-10">
              <div className="flex items-center gap-2">
                <Gauge className="size-5 text-cobalt" />
                <span className="eyebrow">{t("allLevelsHeading")}</span>
              </div>
              <div className="mt-5">
                <NiveauxExpertiseCards />
              </div>
              <p className="text-ink/60 mt-5 max-w-2xl text-sm leading-6">
                {t("notGenericNotice")}
              </p>
            </div>
          )}
          {item.objectives.length > 0 && (
            <div className="mt-20 grid gap-16 lg:grid-cols-[1fr_1fr]">
              <div>
                <span className="eyebrow">{t("objectives")}</span>
                <ul className="mt-8 space-y-4">
                  {item.objectives.map((objective) => (
                    <li
                      key={objective}
                      className="border-ink/10 flex items-start gap-4 border-b pb-4 text-lg"
                    >
                      <CheckCircle2 className="mt-1 size-5 shrink-0 text-cobalt" />{" "}
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>
              <article>
                <span className="eyebrow">{t("curriculum")}</span>
                <RichContent value={item.content} />
              </article>
            </div>
          )}
          {item.objectives.length === 0 && (
            <article className="mt-16 max-w-3xl">
              <span className="eyebrow">{t("curriculum")}</span>
              <RichContent value={item.content} />
            </article>
          )}
          {modules.length > 0 && (
            <div className="mt-24">
              <span className="eyebrow">{t("modules")}</span>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {modules.map((module, index) => (
                  <div
                    key={index}
                    className="border-ink/15 rounded-3xl border p-7"
                  >
                    <span className="text-ink/40 text-xs">0{index + 1}</span>
                    <h2 className="mt-8 text-2xl font-semibold tracking-[-0.04em]">
                      {module.title}
                    </h2>
                    <p className="text-ink/55 mt-3 leading-7">
                      {module.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {!detailsConfirmed && (
            <div className="mt-16 max-w-2xl">
              <h2 className="text-2xl font-semibold tracking-[-0.03em]">
                {t("moreInfoHeading")}
              </h2>
              <p className="text-ink/70 mt-3 leading-6">{t("moreInfoText")}</p>
            </div>
          )}
          <Button asChild size="lg" className="mt-8">
            <Link href={trainingCustomHref}>
              {t("designTraining")} <ArrowRight className="ml-3 size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
