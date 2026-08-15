import { getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";

import { PageHero } from "@/components/public/page-hero";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { dev2Cities, dev2Trainings } from "@/lib/content/dev2";

export default async function PrivateTrainingDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const t = await getTranslations("Pages.trainingCity");
  const { slug } = await params;
  if (
    dev2Trainings.some(
      (training) =>
        training.category === "particuliers" && training.slug === slug,
    )
  ) {
    redirect(`/formations/${slug}`);
  }

  const city = dev2Cities.find(([citySlug]) => citySlug === slug)?.[1];
  if (!city) notFound();

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow", { city })}
        title={t("title", { city })}
        description={t("description")}
        cta={{ label: t("cta"), href: "/rendez-vous" }}
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
            <Link href="/rendez-vous">{t("organize", { city })}</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
