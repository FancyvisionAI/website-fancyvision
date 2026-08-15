import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { PageHero } from "@/components/public/page-hero";
import { RichContent } from "@/components/public/rich-content";
import { contentRepository } from "@/lib/repositories/content";

export async function LegalPage({ slug }: { slug: string }) {
  const t = await getTranslations("LegalPage");
  const locale = await getLocale();
  const page = await contentRepository.page(slug, locale);
  if (!page) notFound();
  const data = page.sections.find((section) => section.type === "legal")?.data as
    | { body?: unknown }
    | undefined;
  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={page.title} description={page.description} />
      <section className="section-pad bg-canvas">
        <article className="mx-auto max-w-3xl px-5"><RichContent value={data?.body} /></article>
      </section>
    </>
  );
}
