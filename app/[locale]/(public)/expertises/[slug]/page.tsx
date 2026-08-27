import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/public/page-hero";

const expertiseKeys = {
  "ia-finance": {
    titleKey: "financeTitle",
    caseKeys: ["financeCase1", "financeCase2", "financeCase3", "financeCase4"],
  },
  "ia-droit": {
    titleKey: "lawTitle",
    caseKeys: ["lawCase1", "lawCase2", "lawCase3", "lawCase4"],
  },
} as const;

// Contenu antérieur au PDF officiel Sapiens IA, sans lien interne actif et
// absent du sitemap (voir audit consolidé) : désactivé publiquement sans
// supprimer les traductions Pages.expertise.* ni le code de réactivation.
const DISABLED_EXPERTISE_SLUGS = new Set(["ia-finance", "ia-droit"]);

export default async function ExpertisePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const t = await getTranslations("Pages.expertise");
  const slug = (await params).slug;
  if (DISABLED_EXPERTISE_SLUGS.has(slug)) notFound();
  const item = expertiseKeys[slug as keyof typeof expertiseKeys];
  if (!item) notFound();

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t(item.titleKey)}
        description={t("description")}
        cta={{ label: t("cta"), href: "/rendez-vous" }}
      />
      <section className="section-pad bg-canvas pt-0">
        <div className="container-shell">
          <span className="eyebrow text-ink">{t("useCasesEyebrow")}</span>
          <h2 className="mt-5 text-4xl font-normal tracking-[-0.03em]">
            {t("useCasesTitle")}
          </h2>
          <div className="mt-12 grid border-l border-t border-lime md:grid-cols-2 lg:grid-cols-4">
            {item.caseKeys.map((caseKey, index) => (
              <article
                key={caseKey}
                className="flex min-h-64 flex-col justify-between border-b border-r border-lime p-7"
              >
                <span className="font-mono text-sm text-cobalt">
                  0{index + 1}
                </span>
                <div>
                  <h2 className="text-xl font-medium">{t(caseKey)}</h2>
                  <p className="mt-4 text-sm leading-6 text-muted">
                    {t("caseDescription")}
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
