import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { ContactForm } from "@/components/public/contact-form";
import { PageHero } from "@/components/public/page-hero";
import { contentRepository } from "@/lib/repositories/content";
import { languageAlternates, localizedPath } from "@/lib/utils";

// Formulaire de contact : garde un rendu par requête (le layout parent
// utilise désormais l'ISR par défaut, voir Lot 2).
export const dynamic = "force-dynamic";

// Réutilise le titre/la description déjà affichés par PageHero (contenu
// CMS existant, cf. contentRepository.page ci-dessous) : pas de nouveau
// texte, seulement reflété dans les métadonnées, comme sur les fiches
// détail (services/[slug], etc.).
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const page = await contentRepository.page("contact", locale);
  if (!page) return {};
  return {
    title: page.headline ?? page.title,
    description: page.description,
    alternates: {
      canonical: localizedPath("/contact", locale),
      languages: languageAlternates("/contact"),
    },
  };
}

export default async function ContactPage() {
  const t = await getTranslations("Pages.contact");
  const locale = await getLocale();
  const [page, settings] = await Promise.all([
    contentRepository.page("contact", locale),
    contentRepository.settings(),
  ]);
  if (!page) notFound();
  const company = settings.find((item) => item.key === "company")?.value as
    { email?: string; phone?: string; address?: string } | undefined;
  const coordinates = [
    company?.email && { key: "email", Icon: Mail, value: company.email },
    company?.phone && { key: "phone", Icon: Phone, value: company.phone },
    company?.address && {
      key: "address",
      Icon: MapPin,
      value: company.address,
    },
  ].filter(Boolean) as Array<{ key: string; Icon: typeof Mail; value: string }>;

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={page.headline ?? page.title}
        description={page.description}
      />
      <section className="section-pad bg-canvas pt-0">
        <div className="container-shell grid gap-12 lg:grid-cols-[.55fr_1.45fr]">
          <div>
            <span className="eyebrow">{t("firstContactEyebrow")}</span>
            <p className="text-ink/55 mt-6 max-w-sm text-lg leading-8">
              {t("firstContactText")}
            </p>
            {coordinates.length > 0 && (
              <div className="mt-10 max-w-sm rounded-card border border-border bg-bg p-6 shadow-card">
                <p className="text-sm font-semibold text-ink">
                  {t("coordinatesTitle")}
                </p>
                <div className="mt-5 space-y-4">
                  {coordinates.map(({ key, Icon, value }) => (
                    <div
                      key={key}
                      className="text-ink/70 flex items-center gap-3 text-sm"
                    >
                      <Icon className="size-4 shrink-0 text-cobalt" />
                      {key === "phone" ? (
                        <a
                          href={`tel:${value.replace(/\s+/g, "")}`}
                          className="hover:text-ink"
                        >
                          {value}
                        </a>
                      ) : (
                        <span>{value}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
