import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import {
  CasesSection,
  FaqSection,
  RenderHomeSection,
  TestimonialsSection,
} from "@/components/public/home-sections";
import { contentRepository } from "@/lib/repositories/content";

export const revalidate = 60;

export default async function HomePage() {
  const locale = await getLocale();
  const [page, services, cases, faqs, testimonials] = await Promise.all([
    contentRepository.page("accueil", locale),
    contentRepository.services(false, locale),
    contentRepository.caseStudies(locale),
    contentRepository.faqs(),
    contentRepository.testimonials(),
  ]);
  if (!page) notFound();

  return (
    <>
      {page.sections.map((section) => (
        <div key={section.id} className="contents">
          {section.type === "process" && (
            <>
              <CasesSection cases={cases} />
              <TestimonialsSection items={testimonials} />
            </>
          )}
          <RenderHomeSection section={section} services={services} />
        </div>
      ))}
      <FaqSection items={faqs} />
    </>
  );
}
