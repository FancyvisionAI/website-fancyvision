import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { PageHero } from "@/components/public/page-hero";
import { Button } from "@/components/ui/button";
import { dev2Cities, dev2Trainings } from "@/lib/content/dev2";

export default async function PrivateTrainingDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
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
        eyebrow={`Formation à ${city}`}
        title={`Formation IA et ChatGPT à ${city}`}
        description="Développez des usages pratiques de l’intelligence artificielle avec une formation adaptée à votre métier, sur place ou à distance."
        cta={{ label: "Demander un programme", href: "/rendez-vous" }}
      />
      <section className="section-pad bg-white pt-0">
        <div className="container-shell grid border-l border-t border-[#dfe7f4] md:grid-cols-3">
          {[
            ["Une pédagogie pratique", "Des exercices construits autour de situations professionnelles réelles."],
            ["Sur place ou à distance", `Des sessions organisées à ${city}, dans vos locaux, ou en visioconférence.`],
            ["Un programme adapté", "Le niveau, les outils et les cas d’usage sont ajustés à vos objectifs."],
          ].map(([title, description]) => (
            <div
              key={title}
              className="min-h-64 border-b border-r border-[#dfe7f4] p-8"
            >
              <h2 className="text-xl font-medium">{title}</h2>
              <p className="mt-5 leading-7 text-[#566174]">{description}</p>
            </div>
          ))}
        </div>
        <div className="container-shell pt-10">
          <Button asChild>
            <Link href="/rendez-vous">Organiser une formation à {city}</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
