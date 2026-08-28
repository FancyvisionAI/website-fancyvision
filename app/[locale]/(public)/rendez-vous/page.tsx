import { CheckCircle2, Video } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { AppointmentForm } from "@/components/public/appointment-form";
import { contentRepository } from "@/lib/repositories/content";

// Formulaire de prise de rendez-vous : garde un rendu par requête (le
// layout parent utilise désormais l'ISR par défaut, voir Lot 2).
export const dynamic = "force-dynamic";

type AppointmentContext =
  "audit" | "formation-programme" | "formation-personnalisee";

function resolveContext(value: string | undefined): AppointmentContext {
  if (value === "formation-programme" || value === "formation-personnalisee") {
    return value;
  }
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
  const locale = await getLocale();
  const sectors = await contentRepository.servicesByCategory(
    "secteurs",
    locale,
  );
  const sectorOptions = sectors.map((sector) => sector.title);

  const eyebrow =
    context === "formation-programme"
      ? t("eyebrowFormationProgramme")
      : context === "formation-personnalisee"
        ? t("eyebrowFormationPersonnalisee")
        : t("eyebrow");
  const title =
    context === "formation-programme"
      ? training
        ? t("titleFormationProgrammeNamed", { training })
        : t("titleFormationProgramme")
      : context === "formation-personnalisee"
        ? training
          ? t("titleFormationPersonnaliseeNamed", { training })
          : t("titleFormationPersonnalisee")
        : t("title");
  const leadText =
    context === "formation-programme"
      ? t("leadTextFormationProgramme")
      : context === "formation-personnalisee"
        ? t("leadTextFormationPersonnalisee")
        : t("leadText");
  const topic =
    context === "formation-programme"
      ? "Programme de formation"
      : context === "formation-personnalisee"
        ? "Formation personnalisée"
        : "Appel découverte";
  const prefillMessage = training
    ? t("trainingPrefill", { training })
    : undefined;

  return (
    <section className="min-h-screen bg-lime pb-20 pt-32">
      <div className="container-shell max-w-5xl">
        <div className="mb-8 grid gap-5 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
          <div>
            <span className="eyebrow text-ink">{eyebrow}</span>
            <h1 className="mt-4 text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.15] tracking-[-0.035em]">
              {title}
            </h1>
            <p className="mt-5 max-w-xl leading-7 text-muted">{leadText}</p>
          </div>
          <div className="grid gap-2 text-sm text-muted sm:grid-cols-2">
            <span className="flex items-center gap-2">
              <Video className="size-4 text-cobalt" /> {t("videoCall")}
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
        />
      </div>
    </section>
  );
}
