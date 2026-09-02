import type { Metadata } from "next";
import { CheckCircle2, Video } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { AppointmentForm } from "@/components/public/appointment-form";
import { contentRepository } from "@/lib/repositories/content";
import { languageAlternates, localizedPath } from "@/lib/utils";

// Formulaire de prise de rendez-vous : garde un rendu par requête (le
// layout parent utilise désormais l'ISR par défaut, voir Lot 2).
export const dynamic = "force-dynamic";

// Reflète le titre/texte déjà affichés pour le contexte par défaut (Audit
// IA gratuit, l'entrée canonique de cette page) — mêmes clés de traduction
// que celles utilisées plus bas dans le composant, aucun nouveau texte.
// Les variantes par contexte (?context=...) ne sont pas dupliquées ici :
// ce n'est pas un audit SEO complet, seulement la métadonnée de base
// manquante.
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("Pages.appointment");
  return {
    title: t("title"),
    description: t("leadText"),
    alternates: {
      canonical: localizedPath("/rendez-vous", locale),
      languages: languageAlternates("/rendez-vous"),
    },
  };
}

type AppointmentContext =
  "audit" | "consultation" | "formation-programme" | "formation-personnalisee";

function resolveContext(value: string | undefined): AppointmentContext {
  if (
    value === "consultation" ||
    value === "formation-programme" ||
    value === "formation-personnalisee"
  ) {
    return value;
  }
  // "audit" reste le contexte implicite par défaut (aucun changement) pour
  // toutes les autres CTA du site qui ne transmettent pas de contexte
  // (Header, Footer, Home, Solutions IA, Solutions par secteur, bouton
  // "Démarrer un diagnostic") : seul le bouton "Échanger avec un
  // consultant" (pages Services) a été mis à jour pour transmettre
  // explicitement `context=consultation`, cf. audit dédié.
  return "audit";
}

export default async function AppointmentPage({
  searchParams,
}: {
  searchParams: Promise<{ context?: string; training?: string }>;
}) {
  const { context: rawContext, training } = await searchParams;
  const context = resolveContext(rawContext);
  const t = await getTranslations("Pages.appointment");
  const tForm = await getTranslations("AppointmentForm");
  const locale = await getLocale();
  const sectors = await contentRepository.servicesByCategory(
    "secteurs",
    locale,
  );
  const sectorOptions = sectors.map((sector) => sector.title);

  const eyebrow =
    context === "consultation"
      ? t("eyebrowConsultation")
      : context === "formation-programme"
        ? t("eyebrowFormationProgramme")
        : context === "formation-personnalisee"
          ? t("eyebrowFormationPersonnalisee")
          : t("eyebrow");
  const title =
    context === "consultation"
      ? t("titleConsultation")
      : context === "formation-programme"
        ? training
          ? t("titleFormationProgrammeNamed", { training })
          : t("titleFormationProgramme")
        : context === "formation-personnalisee"
          ? training
            ? t("titleFormationPersonnaliseeNamed", { training })
            : t("titleFormationPersonnalisee")
          : t("title");
  const leadText =
    context === "consultation"
      ? t("leadTextConsultation")
      : context === "formation-programme"
        ? t("leadTextFormationProgramme")
        : context === "formation-personnalisee"
          ? t("leadTextFormationPersonnalisee")
          : t("leadText");
  const topic =
    context === "consultation"
      ? "Échange avec un consultant"
      : context === "formation-programme"
        ? "Programme de formation"
        : context === "formation-personnalisee"
          ? "Formation personnalisée"
          : "Appel découverte";
  const prefillMessage = training
    ? t("trainingPrefill", { training })
    : undefined;
  // Seul le contexte "audit" correspond réellement à l'Audit IA gratuit
  // (2 heures, cf. auditIaCta). Tous les autres contextes ("consultation",
  // formation programme/personnalisée) sont d'autres types de réunion :
  // 30 minutes.
  const isAuditCall = context === "audit";
  const durationLabel = isAuditCall ? t("videoCall") : t("videoCall30");
  const formDurationCaption = isAuditCall
    ? tForm("discoveryCall60")
    : tForm("discoveryCall");
  // Le titre nommé embarque le nom de la formation (potentiellement long) :
  // une taille plus réduite évite un H1 surdimensionné sur cette variante.
  const isNamedTitle = Boolean(training);

  return (
    <section className="min-h-screen bg-lime pb-20 pt-32">
      <div className="container-shell max-w-5xl">
        <div className="mb-8 grid gap-5 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
          <div>
            <span className="eyebrow text-ink">{eyebrow}</span>
            <h1
              className={`mt-4 font-normal leading-[1.15] tracking-[-0.035em] ${isNamedTitle ? "text-[clamp(1.5rem,2.6vw,2.1rem)]" : "text-[clamp(2rem,4vw,3rem)]"}`}
            >
              {title}
            </h1>
            <p className="mt-5 max-w-xl leading-7 text-muted">{leadText}</p>
          </div>
          <div className="grid gap-2 text-sm text-muted sm:grid-cols-2">
            <span className="flex items-center gap-2">
              <Video className="size-4 text-cobalt" /> {durationLabel}
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-cobalt" />{" "}
              {t("noCommitment")}
            </span>
          </div>
        </div>
        <p className="text-ink/60 mb-8 text-xs font-semibold uppercase tracking-[0.08em]">
          {t("reassurance")}
        </p>
        <AppointmentForm
          sectorOptions={sectorOptions}
          topic={topic}
          prefillMessage={prefillMessage}
          training={training}
          durationCaption={formDurationCaption}
        />
      </div>
    </section>
  );
}
