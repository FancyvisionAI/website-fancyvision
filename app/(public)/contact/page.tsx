import { notFound } from "next/navigation";

import { ContactForm } from "@/components/public/contact-form";
import { PageHero } from "@/components/public/page-hero";
import { contentRepository } from "@/lib/repositories/content";

export default async function ContactPage() {
  const page = await contentRepository.page("contact");
  if (!page) notFound();
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={page.headline ?? page.title}
        description={page.description}
      />
      <section className="section-pad bg-canvas pt-0">
        <div className="container-shell grid gap-12 lg:grid-cols-[.55fr_1.45fr]">
          <div>
            <span className="eyebrow">Un premier échange</span>
            <p className="mt-6 max-w-sm text-lg leading-8 text-black/55">
              Nous répondons sous un jour ouvré et vous orientons vers la bonne
              expertise dès le premier contact.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
