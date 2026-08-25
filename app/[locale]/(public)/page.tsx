import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import {
  BlogPreviewSection,
  CasesSection,
  FaqSection,
  RenderHomeSection,
  SectorsSection,
  SolutionsAiSection,
  TestimonialsSection,
  TrainingsSection,
} from "@/components/public/home-sections";
import { contentRepository } from "@/lib/repositories/content";

export const revalidate = 60;

// Sections CMS qui n'appartiennent pas à la structure officielle du site
// (M. Bassit) : les données restent intactes en base et sur leurs pages
// dédiées (/evenements, /a-propos), elles ne sont simplement plus rendues
// sur la page d'accueil. "split-feature" (les 2 anciens blocs génériques
// "Formation en entreprise" / "Formation pour particuliers") fait doublon
// avec la nouvelle TrainingsSection basée sur les 19 vraies formations —
// masqué ici, données conservées en base.
const HIDDEN_SECTION_TYPES = new Set([
  "advantages",
  "events-preview",
  "process",
  "about",
  "split-feature",
]);

// Sélection éditoriale (non exhaustive) mise en avant sur la page d'accueil ;
// le catalogue complet reste disponible sur /solutions-ia et
// /solutions-par-secteur.
const HOME_AGENT_SLUGS = [
  "agent-call-center",
  "agent-commercial",
  "agent-rh",
  "agent-marketing",
];
const HOME_SECTOR_SLUGS = [
  "secteur-banques",
  "secteur-hotellerie-restauration",
  "secteur-distribution-automobile",
  "secteur-promoteurs-immobiliers",
  "secteur-centres-appels",
  "secteur-assurances",
];
const HOME_TRAINING_ENTERPRISE_SLUGS = [
  "piloter-strategie-ia",
  "concevoir-deployer-agents-ia-entreprise",
];
const HOME_TRAINING_INDIVIDUAL_SLUGS = [
  "decouvrir-ia-generative-quotidien",
  "maitriser-outils-ia-quotidien",
];

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [
    page,
    services,
    cases,
    faqs,
    testimonials,
    articles,
    agents,
    sectorItems,
    enterpriseTrainings,
    individualTrainings,
  ] = await Promise.all([
    contentRepository.page("accueil", locale),
    contentRepository.services(false, locale),
    contentRepository.caseStudies(locale),
    contentRepository.faqs(locale),
    contentRepository.testimonials(),
    contentRepository.articles({ take: 3, locale }),
    contentRepository.servicesByCategory("agents-ia", locale),
    contentRepository.servicesByCategory("secteurs", locale),
    contentRepository.trainingsByCategory("entreprise", locale),
    contentRepository.trainingsByCategory("particuliers", locale),
  ]);
  if (!page) notFound();

  const homeAgents = HOME_AGENT_SLUGS.map((slug) =>
    agents.find((agent) => agent.slug === slug),
  ).filter((agent): agent is (typeof agents)[number] => Boolean(agent));
  const homeSectors = HOME_SECTOR_SLUGS.map((slug) =>
    sectorItems.find((sector) => sector.slug === slug),
  ).filter((sector): sector is (typeof sectorItems)[number] => Boolean(sector));
  const homeTrainingsEnterprise = HOME_TRAINING_ENTERPRISE_SLUGS.map((slug) =>
    enterpriseTrainings.find((training) => training.slug === slug),
  ).filter((training): training is (typeof enterpriseTrainings)[number] =>
    Boolean(training),
  );
  const homeTrainingsIndividual = HOME_TRAINING_INDIVIDUAL_SLUGS.map((slug) =>
    individualTrainings.find((training) => training.slug === slug),
  ).filter((training): training is (typeof individualTrainings)[number] =>
    Boolean(training),
  );
  const homeFaqs = faqs.slice(0, 4);

  const splitFeatureSections = page.sections.filter(
    (section) => section.type === "split-feature",
  );
  const firstSplitFeatureId = splitFeatureSections[0]?.id;
  const lastSplitFeatureId =
    splitFeatureSections[splitFeatureSections.length - 1]?.id;

  return (
    <>
      {page.sections.map((section) => (
        <div key={section.id} className="contents">
          {section.id === firstSplitFeatureId && (
            <>
              <SolutionsAiSection agents={homeAgents} />
              <SectorsSection items={homeSectors} />
            </>
          )}
          {section.type === "cta" && <FaqSection items={homeFaqs} />}
          {!HIDDEN_SECTION_TYPES.has(section.type) && (
            <RenderHomeSection section={section} services={services} />
          )}
          {/* Preuve/crédibilité (études de cas + témoignages) : masquée tant
              qu'aucun contenu réel n'est publié (0 étude de cas, 0
              témoignage en base au moment de cette phase) pour éviter
              d'inventer une preuve sociale. CasesSection/TestimonialsSection
              se réaffichent automatiquement, sans autre changement de code,
              dès qu'une étude de cas ou un témoignage est publié en CMS. */}
          {section.type === "hero" &&
            (cases.length > 0 || testimonials.length > 0) && (
              <>
                <CasesSection cases={cases} />
                <TestimonialsSection items={testimonials} />
              </>
            )}
          {section.id === lastSplitFeatureId && (
            <>
              <TrainingsSection
                enterprise={homeTrainingsEnterprise}
                individual={homeTrainingsIndividual}
              />
              <BlogPreviewSection articles={articles} />
            </>
          )}
        </div>
      ))}
    </>
  );
}
