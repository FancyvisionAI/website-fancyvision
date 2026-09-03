import type { Metadata } from "next";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/public/page-hero";
import { FaqSection } from "@/components/public/home-sections";
import { ScrollToHash } from "@/components/public/scroll-to-hash";
import { cardVariants } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { contentRepository } from "@/lib/repositories/content";
import { cn, languageAlternates, localizedPath } from "@/lib/utils";

// Images de section (mêmes fichiers que sur la Home, cf. Section
// "services-intro" catégories "conseil"/"data" en base — réutilisées à
// l'identique, pas de nouvel asset créé).
import consultingImage from "@/public/images/fancyvision-ai-strategy.webp";
// Photo réelle fournie par le client pour la section Data (cf. commentaire
// équivalent dans prisma/seed-dev2.ts) : remplace l'ancienne illustration
// générique fancyvision-data-systems.webp.
import dataImage from "@/public/images/data.jpg";

// Photos des sous-services, ajoutées par l'équipe le 30/08 dans
// public/images/. Noms de fichiers conservés tels quels (accents/espaces
// inclus) : l'import statique gère ces caractères sans souci d'encodage URL.
import auditIaImage from "@/public/images/services/audit_ia.jpg";
import conduiteChangementImage from "@/public/images/services/conduit_changement_ia.jpg";
import developpementSurMesureImage from "@/public/images/services/développement sur mesure.jpg";
import dataMarketingImage from "@/public/images/services/data Marketing & digital.jpg";
import plateformeDataImage from "@/public/images/services/platforme data et architecture.jpg";
import strategieDataImage from "@/public/images/services/stratégie data & gouvernance.jpg";

const SUB_SERVICE_IMAGES: Record<string, StaticImageData> = {
  "audit-ia": auditIaImage,
  "conduite-du-changement": conduiteChangementImage,
  "developpement-sur-mesure": developpementSurMesureImage,
  "business-intelligence": dataMarketingImage,
  "data-engineering": plateformeDataImage,
  "strategie-gouvernance": strategieDataImage,
};

// Carte "photo à gauche, texte à droite" pour les sous-services #conseil et
// #data : remplace l'ancien format "photo pleine largeur au-dessus du
// titre" (cartes jugées trop hautes/imposantes) par une mise en page plus
// compacte en largeur, sans toucher au composant partagé ContentCard
// (utilisé par 7 autres pages) — celles qui n'ont pas de photo gardent une
// mise en page texte seule, sans bloc image vide.
function SubServiceCard({
  href,
  index,
  eyebrow,
  title,
  description,
  slug,
}: {
  href: string;
  index: number;
  eyebrow: string;
  title: string;
  description: string;
  slug: string;
}) {
  const image = SUB_SERVICE_IMAGES[slug];
  return (
    <Link
      href={href}
      className={cn(
        cardVariants({ variant: "interactive", padding: "none" }),
        "group flex flex-col overflow-hidden rounded-[2rem] duration-500 hover:bg-lime sm:flex-row",
      )}
    >
      {image && (
        <div className="relative aspect-[1.6/1] w-full shrink-0 sm:aspect-auto sm:w-[42%]">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-ink/40 text-xs tabular-nums">
              0{index + 1}
            </span>
            <span className="ml-4 text-xs font-bold uppercase tracking-[0.12em]">
              {eyebrow}
            </span>
          </div>
          <span className="border-ink/20 grid size-11 shrink-0 place-items-center rounded-full border transition group-hover:rotate-45 group-hover:bg-accent group-hover:text-white">
            <ArrowUpRight className="size-4" />
          </span>
        </div>
        <div className="mt-auto pt-5">
          <h2 className="text-xl font-semibold tracking-[-0.03em] md:text-2xl">
            {title}
          </h2>
          <p className="text-ink/55 mt-3 line-clamp-2 text-sm leading-6">
            {description}
          </p>
        </div>
      </div>
    </Link>
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
    alternates: {
      canonical: localizedPath("/services", locale),
      languages: languageAlternates("/services"),
    },
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
        cta={{ label: t("cta"), href: "/rendez-vous?context=consultation" }}
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
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {consulting.map((item, index) => (
              <SubServiceCard
                key={item.id}
                href={`/services/${item.slug}`}
                index={index}
                eyebrow={tCategories("conseil")}
                title={item.title}
                description={item.excerpt}
                slug={item.slug}
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
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {dataServices.map((item, index) => (
              <SubServiceCard
                key={item.id}
                href={`/services/${item.slug}`}
                index={index}
                eyebrow={tCategories("data")}
                title={item.title}
                description={item.excerpt}
                slug={item.slug}
              />
            ))}
          </div>
        </div>
      </section>
      <FaqSection items={faqs} locale={locale} />
    </>
  );
}
