import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContentCard } from "@/components/public/content-card";
import { PageHero } from "@/components/public/page-hero";
import { contentRepository } from "@/lib/repositories/content";

export const metadata: Metadata = {
  title: "Études de cas",
  description: "Des transformations IA concrètes menées avec FancyVision.",
};

export default async function CaseStudiesPage() {
  const [page, cases] = await Promise.all([
    contentRepository.page("etudes-de-cas"),
    contentRepository.caseStudies(),
  ]);
  if (!page) notFound();
  return (
    <>
      <PageHero
        eyebrow="Cas clients"
        title={page.headline ?? page.title}
        description={page.description}
      />
      <section className="section-pad bg-canvas pt-0">
        <div className="container-shell grid gap-5 md:grid-cols-2">
          {cases.map((item, index) => (
            <ContentCard
              key={item.id}
              href={`/etudes-de-cas/${item.slug}`}
              index={index}
              eyebrow={item.sector}
              title={item.title}
              description={item.excerpt}
              meta={
                item.teamSize
                  ? `${item.teamSize.toLocaleString("fr-FR")} collaborateurs`
                  : null
              }
            />
          ))}
        </div>
      </section>
    </>
  );
}
