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
  const [page, services, cases, faqs, testimonials] = await Promise.all([
    contentRepository.page("accueil"),
    contentRepository.services(),
    contentRepository.caseStudies(),
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
