import { notFound } from "next/navigation";

import { PageHero } from "@/components/public/page-hero";

const expertise = {
  "ia-finance": {
    title: "L’IA pour la finance",
    cases: [
      "Analyse documentaire",
      "Reporting augmenté",
      "Préparation client",
      "Conformité",
    ],
  },
  "ia-droit": {
    title: "L’IA pour le droit",
    cases: [
      "Veille juridique",
      "Synthèse de dossiers",
      "Rédaction assistée",
      "Recherche documentaire",
    ],
  },
} as const;

export default async function ExpertisePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const item = expertise[(await params).slug as keyof typeof expertise];
  if (!item) notFound();

  return (
    <>
      <PageHero
        eyebrow="Secteur d’expertise"
        title={item.title}
        description="Des cas d’usage ciblés, des outils sécurisés et une adoption adaptée aux exigences du métier."
        cta={{ label: "Parler de votre projet", href: "/rendez-vous" }}
      />
      <section className="section-pad bg-white pt-0">
        <div className="container-shell">
          <span className="eyebrow text-[#303b64]">Cas d’usage</span>
          <h2 className="mt-5 text-4xl font-normal tracking-[-0.03em]">
            Des applications concrètes
          </h2>
          <div className="mt-12 grid border-l border-t border-[#dfe7f4] md:grid-cols-2 lg:grid-cols-4">
            {item.cases.map((useCase, index) => (
              <article
                key={useCase}
                className="flex min-h-64 flex-col justify-between border-b border-r border-[#dfe7f4] p-7"
              >
                <span className="font-mono text-sm text-[#597dc1]">
                  0{index + 1}
                </span>
                <div>
                  <h2 className="text-xl font-medium">{useCase}</h2>
                  <p className="mt-4 text-sm leading-6 text-[#566174]">
                    Des méthodes conçues autour des données, responsabilités et
                    contraintes du métier.
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
