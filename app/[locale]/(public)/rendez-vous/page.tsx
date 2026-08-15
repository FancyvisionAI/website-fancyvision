import { CheckCircle2, Video } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { AppointmentForm } from "@/components/public/appointment-form";

export default async function AppointmentPage() {
  const t = await getTranslations("Pages.appointment");
  return (
    <section className="min-h-screen bg-lime pb-20 pt-32">
      <div className="container-shell max-w-5xl">
        <div className="mb-8 grid gap-5 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
          <div>
            <span className="eyebrow text-ink">{t("eyebrow")}</span>
            <h1 className="mt-4 text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.15] tracking-[-0.035em]">
              {t("title")}
            </h1>
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
        <AppointmentForm />
      </div>
    </section>
  );
}
