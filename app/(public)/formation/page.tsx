import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContentCard } from "@/components/public/content-card";
import { PageHero } from "@/components/public/page-hero";
import { contentRepository } from "@/lib/repositories/content";

export const metadata: Metadata = {
  title: "Formations en intelligence artificielle",
  description:
    "Formations IA pour entreprises et particuliers, pratiques et orientées résultats.",
};

export default async function TrainingPage() {
  const [page, trainings] = await Promise.all([
    contentRepository.page("formation"),
    contentRepository.trainings(),
  ]);
  if (!page) notFound();
  return (
    <>
      <PageHero
        eyebrow="Organisme de formation"
        title={page.headline ?? page.title}
        description={page.description}
        cta={{ label: "Construire votre parcours", href: "/rendez-vous" }}
      />
      <section className="section-pad bg-canvas pt-0">
        <div className="container-shell grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {trainings.map((item, index) => (
            <ContentCard
              key={item.id}
              href={`/formations/${item.slug}`}
              index={index}
              eyebrow={item.category?.name}
              title={item.title}
              description={item.excerpt}
              meta={item.duration}
            />
          ))}
        </div>
      </section>
    </>
  );
}
