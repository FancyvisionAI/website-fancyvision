import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { ContactForm } from "@/components/public/contact-form";
import { PageHero } from "@/components/public/page-hero";
import { contentRepository } from "@/lib/repositories/content";

export default async function ContactPage() {
  const t = await getTranslations("Pages.contact");
  const locale = await getLocale();
  const page = await contentRepository.page("contact", locale);
  if (!page) notFound();
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
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
