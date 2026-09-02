import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { ContentCard } from "@/components/public/content-card";
import { PageHero } from "@/components/public/page-hero";
import { contentRepository } from "@/lib/repositories/content";

export const revalidate = 3600;

// Pages de SEO local (ciblage villes françaises) jugées non conformes au
// positionnement officiel Sapiens IA (Casablanca, Maroc) — décision validée
// par M. Bassit (voir audit consolidé). Désactivées publiquement sans
// supprimer les lignes `Page` en base, pour permettre une réactivation
// future, individuelle ou complète.
const DISABLED_FORMATION_IA_SLUGS = new Set([
  "formation-ia-angers",
  "formation-ia-bordeaux",
  "formation-ia-clermont-ferrand",
  "formation-ia-formations-dijon",
  "formation-ia-grenoble",
  "formation-ia-lille",
  "formation-ia-lyon",
  "formation-ia-marseille",
  "formation-ia-montpellier",
  "formation-ia-nantes",
  "formation-ia-paris",
]);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  if (DISABLED_FORMATION_IA_SLUGS.has(slug)) return {};
  const page = await contentRepository.page(slug, locale);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
  };
}

export default async function DatabaseLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const t = await getTranslations("Pages.trainingLanding");
  const locale = await getLocale();
  const { slug } = await params;
  if (DISABLED_FORMATION_IA_SLUGS.has(slug)) notFound();
  const [page, trainings] = await Promise.all([
    contentRepository.page(slug, locale),
    contentRepository.trainings(locale),
  ]);
  if (!page || !slug.startsWith("formation-ia-")) notFound();

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={page.headline ?? page.title}
        description={page.description}
        cta={{ label: t("cta"), href: "/rendez-vous?context=consultation" }}
      />
      <section className="section-pad bg-bg">
        <div className="container-shell">
          <div className="mb-9 grid gap-5 lg:grid-cols-[.55fr_1fr] lg:items-end">
            <span className="eyebrow text-cobalt">{t("programsEyebrow")}</span>
            <div>
              <h2 className="max-w-3xl text-[clamp(2rem,3.4vw,2.8rem)] font-normal leading-[1.15] tracking-[-0.03em]">
                {t("programsTitle")}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
                {t("programsDescription")}
              </p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {trainings.slice(0, 6).map((training, index) => (
              <ContentCard
                key={training.id}
                href={`/formations/${training.slug}`}
                index={index}
                eyebrow={training.category?.name}
                title={training.title}
                description={training.excerpt}
                meta={training.duration}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
