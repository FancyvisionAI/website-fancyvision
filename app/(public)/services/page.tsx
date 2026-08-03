import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContentCard } from "@/components/public/content-card";
import { PageHero } from "@/components/public/page-hero";
import { FaqSection } from "@/components/public/home-sections";
import { contentRepository } from "@/lib/repositories/content";

export const metadata: Metadata = {
  title: "Conseil en intelligence artificielle",
  description:
    "Audit, conduite du changement, développement et gouvernance IA avec FancyVision.",
};

export default async function ServicesPage() {
  const [page, services, faqs] = await Promise.all([
    contentRepository.page("services"),
    contentRepository.services(),
    contentRepository.faqs(),
  ]);
  if (!page) notFound();
  const consulting = services.filter((item) => item.category?.slug === "conseil");
  const dataServices = services.filter((item) => item.category?.slug === "data");
  return (
    <>
      <PageHero
        eyebrow="Cabinet de conseil"
        title={page.headline ?? page.title}
        description={page.description}
        cta={{ label: "Parler de votre projet", href: "/rendez-vous" }}
      />
      <section className="section-pad bg-white pt-0">
        <div className="container-shell">
          <div className="grid gap-10 border-b border-[#dfe7f4] pb-12 lg:grid-cols-[.55fr_1fr]">
            <span className="eyebrow text-[#303b64]">Conseil</span>
            <div>
              <h2 className="text-[clamp(2.4rem,4vw,3.25rem)] font-normal leading-[1.15] tracking-[-0.03em]">
                Nos services de conseil en IA
              </h2>
              <p className="mt-5 max-w-2xl leading-7 text-[#566174]">
                De l’audit au déploiement, nous structurons vos projets, vos usages
                et l’adoption de l’intelligence artificielle dans la durée.
              </p>
            </div>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {consulting.map((item, index) => (
              <ContentCard
                key={item.id}
                href={`/services/${item.slug}`}
                index={index}
                eyebrow={item.category?.name}
                title={item.title}
                description={item.excerpt}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-[#f1f5fa]">
        <div className="container-shell">
          <div className="grid gap-10 border-b border-[#d5dfed] pb-12 lg:grid-cols-[.55fr_1fr]">
            <span className="eyebrow text-[#303b64]">Data</span>
            <div>
              <h2 className="text-[clamp(2.4rem,4vw,3.25rem)] font-normal leading-[1.15] tracking-[-0.03em]">
                Des données fiables, utiles et activables
              </h2>
              <p className="mt-5 max-w-2xl leading-7 text-[#566174]">
                De la stratégie à la Data Science, FancyVision construit les
                fondations et les produits qui transforment vos données en décisions.
              </p>
            </div>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {dataServices.map((item, index) => (
              <ContentCard
                key={item.id}
                href={`/services/${item.slug}`}
                index={index}
                eyebrow={item.category?.name}
                title={item.title}
                description={item.excerpt}
              />
            ))}
          </div>
        </div>
      </section>
      <FaqSection items={faqs} />
    </>
  );
}
