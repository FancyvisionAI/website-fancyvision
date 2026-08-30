import type { Metadata } from "next";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { ContentCard } from "@/components/public/content-card";
import { PageHero } from "@/components/public/page-hero";
import { FaqSection } from "@/components/public/home-sections";
import { ScrollToHash } from "@/components/public/scroll-to-hash";
import { contentRepository } from "@/lib/repositories/content";

// Images de section (mêmes fichiers que sur la Home, cf. Section
// "services-intro" catégories "conseil"/"data" en base — réutilisées à
// l'identique, pas de nouvel asset créé).
import consultingImage from "@/public/images/fancyvision-ai-strategy.webp";
import dataImage from "@/public/images/fancyvision-data-systems.webp";

// Photos des sous-services, ajoutées par l'équipe le 30/08 dans
// public/images/. Noms de fichiers conservés tels quels (accents/espaces
// inclus) : l'import statique gère ces caractères sans souci d'encodage URL.
import auditIaImage from "@/public/images/audit_ia.jpg";
import conduiteChangementImage from "@/public/images/conduit_changement_ia.jpg";
import developpementSurMesureImage from "@/public/images/développement sur mesure.jpg";
import dataMarketingImage from "@/public/images/data Marketing & digital.jpg";
import plateformeDataImage from "@/public/images/platforme data et architecture.jpg";
import strategieDataImage from "@/public/images/stratégie data & gouvernance.jpg";

const SUB_SERVICE_IMAGES: Record<string, StaticImageData> = {
  "audit-ia": auditIaImage,
  "conduite-du-changement": conduiteChangementImage,
  "developpement-sur-mesure": developpementSurMesureImage,
  "business-intelligence": dataMarketingImage,
  "data-engineering": plateformeDataImage,
  "strategie-gouvernance": strategieDataImage,
};

function subServiceVisual(slug: string, title: string) {
  const image = SUB_SERVICE_IMAGES[slug];
  if (!image) return undefined;
  return (
    <div className="relative my-4 aspect-[1.6/1] w-full overflow-hidden rounded-2xl">
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages.services" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Pages.services" });
  const tCategories = await getTranslations({
    locale,
    namespace: "Categories",
  });
  const [page, services, faqs] = await Promise.all([
    contentRepository.page("services", locale),
    contentRepository.services(false, locale),
    contentRepository.faqs(locale),
  ]);
  if (!page) notFound();
  const consulting = services.filter(
    (item) => item.category?.slug === "conseil",
  );
  const dataServices = services.filter(
    (item) => item.category?.slug === "data",
  );
  return (
    <>
      <ScrollToHash />
      <PageHero
        eyebrow={t("eyebrow")}
        title={page.headline ?? page.title}
        description={page.description}
        cta={{ label: t("cta"), href: "/rendez-vous" }}
      />
      <section id="conseil" className="section-pad scroll-mt-28 bg-canvas pt-0">
        <div className="container-shell">
          <div className="grid items-center gap-10 border-b border-lime pb-12 lg:grid-cols-[.9fr_1fr]">
            <div className="relative aspect-[1.6/1] overflow-hidden">
              <Image
                src={consultingImage}
                alt={t("consultingTitle")}
                fill
                className="masked-image object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
            </div>
            <div>
              <span className="eyebrow text-ink">{t("consultingEyebrow")}</span>
              <h2 className="mt-5 text-[clamp(2.4rem,4vw,3.25rem)] font-normal leading-[1.15] tracking-[-0.03em]">
                {t("consultingTitle")}
              </h2>
              <p className="mt-5 max-w-2xl leading-7 text-muted">
                {t("consultingDescription")}
              </p>
            </div>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {consulting.map((item, index) => (
              <ContentCard
                key={item.id}
                href={`/services/${item.slug}`}
                index={index}
                eyebrow={tCategories("conseil")}
                title={item.title}
                description={item.excerpt}
                visual={subServiceVisual(item.slug, item.title)}
                compact
              />
            ))}
          </div>
        </div>
      </section>

      <section id="data" className="section-pad scroll-mt-28 bg-lime">
        <div className="container-shell">
          <div className="grid items-center gap-10 border-b border-lime pb-12 lg:grid-cols-[.9fr_1fr]">
            <div className="relative aspect-[1.6/1] overflow-hidden">
              <Image
                src={dataImage}
                alt={t("dataTitle")}
                fill
                className="masked-image object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
            </div>
            <div>
              <span className="eyebrow text-ink">{t("dataEyebrow")}</span>
              <h2 className="mt-5 text-[clamp(2.4rem,4vw,3.25rem)] font-normal leading-[1.15] tracking-[-0.03em]">
                {t("dataTitle")}
              </h2>
              <p className="mt-5 max-w-2xl leading-7 text-muted">
                {t("dataDescription")}
              </p>
            </div>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {dataServices.map((item, index) => (
              <ContentCard
                key={item.id}
                href={`/services/${item.slug}`}
                index={index}
                eyebrow={tCategories("data")}
                title={item.title}
                description={item.excerpt}
                visual={subServiceVisual(item.slug, item.title)}
                compact
              />
            ))}
          </div>
        </div>
      </section>
      <FaqSection items={faqs} locale={locale} />
    </>
  );
}
