import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/public/page-hero";
import { Reveal } from "@/components/public/reveal";
import { contentRepository } from "@/lib/repositories/content";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Pages.about");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function AboutPage() {
  const t = await getTranslations("Pages.about");
  const locale = await getLocale();
  const [page, team] = await Promise.all([
    contentRepository.page("a-propos", locale),
    contentRepository.team(),
  ]);
  if (!page) notFound();
  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={page.headline ?? page.title}
        description={page.description}
        cta={{ label: t("joinUs"), href: "/contact" }}
      />
      <section className="section-pad bg-lime">
        <div className="container-shell grid gap-14 lg:grid-cols-[.65fr_1.35fr]">
          <Reveal>
            <span className="eyebrow">{t("missionEyebrow")}</span>
          </Reveal>
          <Reveal>
            <p className="max-w-5xl text-4xl font-semibold leading-[1.1] tracking-[-0.05em] sm:text-5xl lg:text-7xl">
              {t("missionText")}
            </p>
          </Reveal>
        </div>
      </section>
      <section className="section-pad bg-canvas">
        <div className="container-shell">
          <Reveal className="max-w-5xl">
            <span className="eyebrow">{t("teamEyebrow")}</span>
            <h2 className="display-title mt-6 text-6xl sm:text-7xl lg:text-9xl">
              {t("teamHeading")}
            </h2>
          </Reveal>
          <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {team.map((member, index) => (
              <Reveal key={member.id} delay={index * 0.07}>
                <article className="overflow-hidden rounded-[2rem] bg-canvas">
                  <div className="relative aspect-[1.05/1] bg-cobalt">
                    {member.picture ? (
                      <Image
                        src={member.picture}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-8xl font-black tracking-[-0.08em] text-lime">
                        {member.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")}
                      </div>
                    )}
                  </div>
                  <div className="p-7">
                    <h2 className="text-2xl font-semibold tracking-[-0.04em]">
                      {member.name}
                    </h2>
                    <p className="mt-1 text-sm text-cobalt">
                      {member.position}
                    </p>
                    <p className="text-ink/55 mt-5 leading-7">
                      {member.biography}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
