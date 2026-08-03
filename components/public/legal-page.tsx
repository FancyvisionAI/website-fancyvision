import { notFound } from "next/navigation";

import { PageHero } from "@/components/public/page-hero";
import { RichContent } from "@/components/public/rich-content";
import { contentRepository } from "@/lib/repositories/content";

export async function LegalPage({ slug }: { slug: string }) {
  const page = await contentRepository.page(slug);
  if (!page) notFound();
  const data = page.sections.find((section) => section.type === "legal")?.data as
    | { body?: unknown }
    | undefined;
  return (
    <>
      <PageHero eyebrow="Informations" title={page.title} description={page.description} />
      <section className="section-pad bg-white">
        <article className="mx-auto max-w-3xl px-5"><RichContent value={data?.body} /></article>
      </section>
    </>
  );
}
