import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { FaqList } from "@/components/public/faq-list";
import { PageHero } from "@/components/public/page-hero";
import { contentRepository } from "@/lib/repositories/content";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Pages.faq");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function FaqPage() {
  const t = await getTranslations("Pages.faq");
  const locale = await getLocale();
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
