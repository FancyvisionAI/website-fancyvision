import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { FaqList } from "@/components/public/faq-list";
import { PageHero } from "@/components/public/page-hero";
import { contentRepository } from "@/lib/repositories/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages.faq" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Pages.faq" });
  const faqs = await contentRepository.faqs(locale);

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
        cta={{ label: t("cta"), href: "/rendez-vous" }}
      />
      <section className="section-pad bg-canvas pt-0">
        <div className="container-shell max-w-4xl">
          <FaqList items={faqs} />
        </div>
      </section>
    </>
  );
}
