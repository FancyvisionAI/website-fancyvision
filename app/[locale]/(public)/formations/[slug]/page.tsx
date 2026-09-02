import type { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  Gauge,
  Users,
} from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { NiveauxExpertiseCards } from "@/components/public/niveaux-expertise-cards";
import { PageHero } from "@/components/public/page-hero";
import { RichContent } from "@/components/public/rich-content";
import { TrainingRequestTrigger } from "@/components/public/training-request-trigger";
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

// Le contenu CMS contient systématiquement un paragraphe redondant avec le
// bloc "Trois niveaux" (cartes) juste au-dessus : "Cette formation peut être
// déclinée selon trois niveaux : ...". Retiré partout (FR/EN, avec ou sans
// PDF) — seules les 3 cartes de niveaux doivent rester. Repéré par son texte
// (pas par sa position) pour rester fiable même si l'ordre des paragraphes
// change. Pour les formations avec PDF, le premier paragraphe générique
// ("Cette formation s'adresse à...") reste en plus masqué (correction
// précédente).
const THREE_LEVELS_SENTENCE_MARKERS = [
  "peut être déclinée selon trois niveaux",
  "can be delivered at three levels",
];

function isThreeLevelsSentence(node: {
  content?: Array<{ text?: string }>;
}): boolean {
  const text = node.content?.[0]?.text ?? "";
  return THREE_LEVELS_SENTENCE_MARKERS.some((marker) => text.includes(marker));
}

function filterFormationContent(
  value: unknown,
  hideIntroParagraph: boolean,
): unknown {
  const doc = value as {
    content?: Array<{ content?: Array<{ text?: string }> }>;
  } | null;
  if (!doc?.content) return value;
  const withoutThreeLevelsSentence = doc.content.filter(
    (node) => !isThreeLevelsSentence(node),
  );
  const result = hideIntroParagraph
    ? withoutThreeLevelsSentence.slice(1)
    : withoutThreeLevelsSentence;
  return { ...doc, content: result };
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
  // Quand un PDF existe et qu'aucune durée réelle n'est renseignée, la carte
  // "Durée" n'affichait que la valeur de repli "Sur mesure" : masquée dans
  // ce cas précis (une vraie durée, si elle existe un jour pour une
  // formation avec PDF, continuerait à s'afficher normalement).
  const showDuration = Boolean(item.duration) || !item.pdfUrl;
  // Pour ALL_LEVELS, les trois niveaux sont présentés dans un bloc dédié à
  // trois cartes plus bas (cf. NiveauxExpertiseCards) plutôt que compressés
  // dans une carte étroite au même format que Durée/Public.
  const infoCardCount =
    (showDuration ? 1 : 0) + (hasAudience ? 1 : 0) + (isAllLevels ? 0 : 1);
  const trainingCustomHref = `/rendez-vous?context=formation-personnalisee&training=${encodeURIComponent(item.title)}`;

  return (
    <>
      <PageHero
        eyebrow={categoryLabel}
        title={item.title}
        description={item.excerpt}
      />
      <section className="section-pad bg-canvas">
        <div className="container-shell">
          <div
            className={`grid gap-3 ${infoCardCount === 3 ? "sm:grid-cols-3" : infoCardCount === 2 ? "sm:grid-cols-2" : "sm:grid-cols-1"}`}
          >
            {showDuration && (
              <div className="rounded-3xl bg-canvas p-6">
                <Clock className="size-5" />
                <p className="text-ink/45 mt-8 text-sm">{t("duration")}</p>
                <p className="mt-1 text-xl font-semibold">
                  {item.duration ?? t("custom")}
                </p>
              </div>
            )}
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
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {item.pdfUrl && (
              <Button asChild variant="outline" size="lg">
                <a href={item.pdfUrl} target="_blank" rel="noopener noreferrer">
                  <FileText className="mr-3 size-4" /> {t("pdfCta")}
                </a>
              </Button>
            )}
            <TrainingRequestTrigger
              training={item.title}
              label={t("consultCta")}
              variant={item.pdfUrl ? "ghost" : "default"}
              size="lg"
            />
          </div>
          {item.pdfUrl && (
            <p className="text-ink/55 mt-4 max-w-2xl text-sm leading-6">
              {t("pdfAdaptationNotice")}
            </p>
          )}
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
                {/* Redondant avec le bouton PDF déjà proposé plus haut sur
                    la fiche (qui annonce déjà "le programme") : masqué
                    uniquement quand un PDF existe, cf. audit dédié. */}
                {!item.pdfUrl && (
                  <span className="eyebrow">{t("curriculum")}</span>
                )}
                <RichContent
                  value={filterFormationContent(
                    item.content,
                    Boolean(item.pdfUrl),
                  )}
                />
              </article>
            </div>
          )}
          {item.objectives.length === 0 && (
            <article className="mt-16 max-w-3xl">
              {!item.pdfUrl && (
                <span className="eyebrow">{t("curriculum")}</span>
              )}
              <RichContent
                value={filterFormationContent(
                  item.content,
                  Boolean(item.pdfUrl),
                )}
              />
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
