import type { Article, CaseStudy, Faq, Section, Service, Testimonial, Training } from "@prisma/client";
import { ArrowRight, ArrowUpRight, Check, MoveRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";

import { ArticleCard } from "@/components/public/article-card";
import { FaqList } from "@/components/public/faq-list";
import { Reveal } from "@/components/public/reveal";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

type HomeService = Service & {
  category?: { slug: string; name: string } | null;
};

type HomeArticle = Article & {
  category: { name: string; slug: string } | null;
};

type HomeTraining = Training & {
  category?: { slug: string; name: string } | null;
};

const text = (value: unknown, fallback = "") =>
  typeof value === "string" ? value : fallback;
const list = <T,>(value: unknown) =>
  Array.isArray(value) ? (value as T[]) : [];

function EditorialHeading({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  // FR + EN : le contenu CMS (Section.title) peut être français (fallback
  // volontaire) ou anglais (une fois traduit) — les deux jeux de mots
  // doivent déclencher la mise en emphase éditoriale.
  const emphasisPattern =
    /(conseil|consulting|formation en IA|formation|training|IA|AI|résultats|results|équipes|teams|impact)/gi;
  const words = children.split(emphasisPattern);
  return (
    <span className={className}>
      {words.map((word, index) =>
        /^(conseil|consulting|formation en IA|formation|training|IA|AI|résultats|results|équipes|teams|impact)$/i.test(word) ? (
          <em key={`${word}-${index}`} className="font-editorial">
            {word}
          </em>
        ) : (
          word
        ),
      )}
    </span>
  );
}

export async function HeroSection({ data }: { data: Record<string, unknown> }) {
  const t = await getTranslations("HomeSections");
  const title = text(data.title);
  const [firstLine, ...remaining] = title.split("\n");
  return (
    <section className="reference-hero relative flex min-h-[75svh] items-center overflow-hidden pb-16 pt-28 text-white">
      <div className="container-shell relative z-10 flex flex-col items-center text-center">
        <Reveal className="flex w-full flex-col items-center">
          <h1 className="font-display max-w-[950px] text-[clamp(2.75rem,5vw,4rem)] font-normal leading-[1.2] tracking-[-0.025em]">
            <EditorialHeading>{firstLine || title}</EditorialHeading>
            {remaining.length > 0 && (
              <>
                <br />
                <EditorialHeading>{remaining.join(" ")}</EditorialHeading>
              </>
            )}
          </h1>
          <p className="mt-8 max-w-[680px] text-base leading-6 text-white/90">
            {text(data.description)}
          </p>
          <Button asChild variant="accent" className="mt-8 h-12 px-6">
            <Link href={text(data.primaryHref, "/rendez-vous")}>
              {text(data.primaryLabel, t("heroPrimaryCta"))}
              <ArrowRight className="ml-5 size-4" />
            </Link>
          </Button>
          {text(data.secondaryHref) && (
            <Button
              asChild
              variant="outline"
              className="mt-3 border-white/30 bg-transparent text-white hover:bg-white/10"
            >
              <Link href={text(data.secondaryHref)}>
                {text(data.secondaryLabel, t("heroSecondaryCta"))}
              </Link>
            </Button>
          )}
        </Reveal>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-[-4rem] h-28 bg-gradient-to-b from-white/0 via-white/70 to-white blur-xl" />
    </section>
  );
}

export function LogosSection({ data }: { data: Record<string, unknown> }) {
  const logos = list<string>(data.logos);
  return (
    <section className="border-b border-lime bg-canvas py-14">
      <div className="container-shell">
        <p className="mb-10 text-center text-base font-medium text-ink">
          {text(data.title)}
        </p>
        <div className="grid grid-cols-2 items-center border-l border-t border-lime sm:grid-cols-4 lg:grid-cols-8">
          {logos.map((logo) => (
            <span
              key={logo}
              className="grid h-20 place-items-center border-b border-r border-lime px-3 text-sm font-semibold tracking-[-0.02em] text-muted"
            >
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export async function ServicesSection({
  data,
  services,
}: {
  data: Record<string, unknown>;
  services: HomeService[];
}) {
  const t = await getTranslations("HomeSections");
  const categorySlug = text(data.categorySlug);
  const visibleServices = categorySlug
    ? services.filter((service) => service.category?.slug === categorySlug)
    : services;
  return (
    <section className="section-pad bg-canvas">
      <div className="container-shell grid border-l border-t border-lime lg:grid-cols-[.5fr_1fr]">
        <Reveal className="flex min-h-64 flex-col justify-between border-b border-r border-lime p-7 lg:min-h-full lg:p-9">
          <div>
            <span className="eyebrow text-ink">{text(data.eyebrow)}</span>
            <h2 className="font-display mt-5 max-w-sm text-4xl font-normal leading-[1.18] tracking-[-0.025em]">
              <EditorialHeading>{text(data.title).replace("\n", " ")}</EditorialHeading>
            </h2>
            {text(data.description) && (
              <p className="mt-5 max-w-md text-sm leading-6 text-muted">
                {text(data.description)}
              </p>
            )}
          </div>
          <div className="relative mt-12 aspect-[1.6/1] overflow-hidden">
            <Image
              src={text(data.image, "/images/fancyvision-ai-strategy.webp")}
              alt={t("servicesImageAlt")}
              fill
              className="masked-image object-cover"
              sizes="(max-width: 1024px) 100vw, 35vw"
            />
          </div>
        </Reveal>
        <div className="grid md:grid-cols-2">
          {visibleServices.map((service, index) => (
            <Reveal key={service.id} delay={index * 0.05} className="h-full">
              <Link
                href={`/services/${service.slug}`}
                className="group flex h-full min-h-48 items-center gap-5 border-b border-r border-lime p-6 transition hover:bg-lime/40 lg:p-8"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-xl font-medium tracking-[-0.025em] text-ink">
                    {service.title}
                  </h3>
                  <p className="mt-3 line-clamp-4 text-sm leading-6 text-muted">
                    {service.excerpt}
                  </p>
                </div>
                <span className="grid size-10 shrink-0 place-items-center transition group-hover:translate-x-1">
                  <ArrowRight className="size-5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// Sélection éditoriale d'agents IA (données réelles, catégorie "agents-ia").
// Mise en page volontairement non-uniforme : une carte mise en avant +
// une pile de cartes compactes, plutôt qu'une grille régulière.
export async function SolutionsAiSection({ agents }: { agents: HomeService[] }) {
  if (!agents.length) return null;
  const t = await getTranslations("HomeSections");
  const tCategories = await getTranslations("Categories");
  const [featured, ...rest] = agents;
  return (
    <section id="solutions-ia" className="section-pad bg-canvas">
      <div className="container-shell">
        <Reveal className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="eyebrow text-cobalt">{t("solutionsAiEyebrow")}</span>
            <h2 className="font-display mt-5 text-[clamp(2rem,3.4vw,2.8rem)] font-normal leading-[1.15] tracking-[-0.03em]">
              {t("solutionsAiTitle")}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-6 text-muted">
              {t("solutionsAiDescription")}
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/solutions-ia">
              {t("solutionsAiViewAll")}
              <ArrowRight className="ml-5 size-4" />
            </Link>
          </Button>
        </Reveal>
        <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
          <Link
            href={`/solutions-ia/${featured.slug}`}
            className="group flex min-h-[340px] flex-col justify-between rounded-card border border-border bg-accent p-8 text-white transition hover:-translate-y-1 hover:shadow-card md:p-10"
          >
            <span className="eyebrow text-white/70">{tCategories("agents-ia")}</span>
            <div>
              <h3 className="font-display mt-5 text-3xl font-medium leading-[1.2] tracking-[-0.025em] md:text-4xl">
                {featured.title}
              </h3>
              <p className="mt-5 max-w-md leading-7 text-white/75">{featured.excerpt}</p>
            </div>
            <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold">
              {t("solutionsAiViewAll")}
              <ArrowUpRight className="size-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
            </span>
          </Link>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            {rest.map((agent) => (
              <Link
                key={agent.id}
                href={`/solutions-ia/${agent.slug}`}
                className="group flex flex-col justify-between rounded-card border border-border bg-canvas p-6 transition hover:-translate-y-1 hover:border-cobalt/40 hover:shadow-card"
              >
                <h3 className="font-display text-xl font-medium tracking-[-0.02em] text-ink">
                  {agent.title}
                </h3>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">{agent.excerpt}</p>
                <ArrowUpRight className="mt-4 size-4 text-cobalt transition group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Sélection éditoriale de secteurs (données réelles, catégorie "secteurs").
export async function SectorsSection({ items }: { items: HomeService[] }) {
  if (!items.length) return null;
  const t = await getTranslations("HomeSections");
  return (
    <section id="secteurs" className="section-pad bg-lime">
      <div className="container-shell">
        <Reveal className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="eyebrow text-ink">{t("sectorsEyebrow")}</span>
            <h2 className="font-display mt-5 text-[clamp(2rem,3.4vw,2.8rem)] font-normal leading-[1.15] tracking-[-0.03em]">
              {t("sectorsTitle")}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-6 text-muted">
              {t("sectorsDescription")}
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/solutions-par-secteur">
              {t("sectorsViewAll")}
              <ArrowRight className="ml-5 size-4" />
            </Link>
          </Button>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((sector) => (
            <Link
              key={sector.id}
              href={`/solutions-par-secteur/${sector.slug}`}
              className="group flex min-h-40 flex-col justify-between rounded-card border border-border bg-canvas p-6 transition hover:-translate-y-1 hover:border-cobalt/40 hover:shadow-card"
            >
              <span className="text-lg font-medium text-ink">{sector.title}</span>
              <div className="mt-3 flex items-end justify-between gap-3">
                <p className="line-clamp-2 text-sm leading-6 text-muted">{sector.excerpt}</p>
                <ArrowUpRight className="size-5 shrink-0 text-cobalt transition group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// Sélection éditoriale de formations (données réelles, catégories
// "entreprise" / "particuliers"), séparant clairement les deux cibles
// plutôt qu'une grille uniforme.
export async function TrainingsSection({
  enterprise,
  individual,
}: {
  enterprise: HomeTraining[];
  individual: HomeTraining[];
}) {
  if (!enterprise.length && !individual.length) return null;
  const t = await getTranslations("HomeSections");
  return (
    <section id="formations" className="section-pad bg-canvas">
      <div className="container-shell">
        <Reveal className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="eyebrow text-cobalt">{t("trainingsEyebrow")}</span>
            <h2 className="font-display mt-5 text-[clamp(2rem,3.4vw,2.8rem)] font-normal leading-[1.15] tracking-[-0.03em]">
              {t("trainingsTitle")}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-6 text-muted">
              {t("trainingsDescription")}
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/formations">
              {t("trainingsViewAll")}
              <ArrowRight className="ml-5 size-4" />
            </Link>
          </Button>
        </Reveal>
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.12em] text-ink/50">
              {t("trainingsEnterprise")}
            </h3>
            <div className="mt-5 space-y-4">
              {enterprise.map((training) => (
                <Link
                  key={training.id}
                  href={`/formations/${training.slug}`}
                  className="group flex items-center justify-between gap-4 rounded-card border border-border bg-canvas p-6 transition hover:-translate-y-1 hover:border-cobalt/40 hover:shadow-card"
                >
                  <span className="text-lg font-medium leading-[1.3] text-ink">
                    {training.title}
                  </span>
                  <ArrowUpRight className="size-5 shrink-0 text-cobalt transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.12em] text-ink/50">
              {t("trainingsIndividual")}
            </h3>
            <div className="mt-5 space-y-4">
              {individual.map((training) => (
                <Link
                  key={training.id}
                  href={`/formations/${training.slug}`}
                  className="group flex items-center justify-between gap-4 rounded-card border border-border bg-canvas p-6 transition hover:-translate-y-1 hover:border-cobalt/40 hover:shadow-card"
                >
                  <span className="text-lg font-medium leading-[1.3] text-ink">
                    {training.title}
                  </span>
                  <ArrowUpRight className="size-5 shrink-0 text-cobalt transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SplitFeature({ data }: { data: Record<string, unknown> }) {
  const reverse = data.reverse === true;
  return (
    <section className="bg-canvas">
      <div className="container-shell grid border-l border-t border-lime lg:grid-cols-2">
        <Reveal
          className={`flex min-h-[380px] flex-col justify-center border-b border-r border-lime p-7 lg:p-12 ${
            reverse ? "lg:order-2" : ""
          }`}
        >
          <span className="eyebrow text-ink">{text(data.eyebrow)}</span>
          <h2 className="font-display mt-5 max-w-xl text-[clamp(2.25rem,4vw,3rem)] font-normal leading-[1.18] tracking-[-0.025em]">
            <EditorialHeading>{text(data.title)}</EditorialHeading>
          </h2>
          <p className="mt-5 max-w-xl text-base leading-6 text-muted">
            {text(data.description)}
          </p>
          <Button asChild className="mt-8 w-fit">
            <Link href={text(data.ctaHref, "/formation")}>
              {text(data.ctaLabel)}
              <ArrowRight className="ml-5 size-4" />
            </Link>
          </Button>
        </Reveal>
        <div
          className={`flex min-h-[340px] items-center border-b border-r border-lime p-7 lg:min-h-[440px] lg:p-12 ${
            reverse ? "lg:order-1" : ""
          }`}
        >
          <div className="relative aspect-[1.57/1] w-full overflow-hidden">
            <Image
              src={text(data.image, "/images/fancyvision-ai-strategy.webp")}
              alt=""
              fill
              className="masked-image object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export async function CtaSection({ data }: { data: Record<string, unknown> }) {
  const t = await getTranslations("HomeSections");
  return (
    <section className="reference-hero relative overflow-hidden py-20 text-center text-white md:py-24">
      <div className="container-shell relative z-10 flex flex-col items-center">
        <Reveal className="flex flex-col items-center">
          <h2 className="font-display max-w-4xl text-[clamp(2.5rem,4vw,3.5rem)] font-normal leading-[1.2]">
            <EditorialHeading>{text(data.title)}</EditorialHeading>
          </h2>
          <p className="mt-5 max-w-[680px] leading-6 text-white/85">
            {text(data.description)}
          </p>
          <Button asChild variant="accent" className="mt-8">
            <Link href={text(data.ctaHref, "/rendez-vous")}>
              {text(data.ctaLabel, t("ctaLabel"))}
              <ArrowRight className="ml-5 size-4" />
            </Link>
          </Button>
          {text(data.reassurance) && (
            <p className="mt-5 text-xs font-medium uppercase tracking-[0.08em] text-white/60">
              {text(data.reassurance)}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}

type Advantage = {
  number: string;
  title: string;
  description: string;
  stats: Array<{ value: string; label: string }>;
};

export async function AdvantagesSection({ data }: { data: Record<string, unknown> }) {
  const t = await getTranslations("HomeSections");
  const items = list<Advantage>(data.items);
  return (
    <section className="section-pad overflow-hidden bg-bg">
      <div className="container-shell">
        <Reveal className="mb-9 grid gap-5 lg:grid-cols-[.45fr_1fr] lg:items-end">
          <span className="eyebrow text-cobalt">{text(data.eyebrow)}</span>
          <h2 className="font-display max-w-3xl text-[clamp(2rem,3.4vw,2.8rem)] font-normal leading-[1.15] tracking-[-0.03em]">
            <EditorialHeading>{text(data.title)}</EditorialHeading>
          </h2>
        </Reveal>
        <div className="grid gap-4 lg:grid-cols-3">
          {items.map((item, index) => (
            <Reveal
              key={item.number}
              delay={index * 0.06}
              className="group relative overflow-hidden rounded-card border border-border bg-canvas p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:border-cobalt/40 lg:p-7"
            >
              <div className="absolute -right-12 -top-14 size-36 rounded-full bg-lime opacity-55 blur-2xl transition group-hover:scale-125" />
              <div className="relative flex items-center justify-between">
                <span className="grid size-10 place-items-center rounded-full bg-accent font-mono text-xs text-white">
                  {item.number}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                  {t("step", { number: index + 1 })}
                </span>
              </div>
              <h3 className="font-display relative mt-7 text-2xl font-medium tracking-[-0.03em] text-ink">
                {item.title}
              </h3>
              <p className="relative mt-3 min-h-[4.5rem] text-sm leading-6 text-muted">
                {item.description}
              </p>
              <div className="relative mt-6 flex flex-wrap gap-2 border-t border-border pt-5">
                {item.stats.map((stat) => (
                  <span key={stat.label} className="rounded-full bg-lime px-3 py-2 text-xs text-ink/70">
                    <strong className="mr-1 font-semibold text-ink">{stat.value}</strong>
                    {stat.label}
                  </span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export async function CasesSection({ cases }: { cases: CaseStudy[] }) {
  if (!cases.length) return null;
  const t = await getTranslations("HomeSections");
  return (
    <section className="section-pad bg-lime">
      <div className="container-shell">
        <Reveal className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="eyebrow text-ink">{t("casesEyebrow")}</span>
            <h2 className="font-display mt-5 max-w-3xl text-[clamp(2.5rem,4vw,3rem)] font-normal leading-[1.2]">
              {t.rich("casesTitle", {
                em: (chunks) => <span className="font-editorial">{chunks}</span>,
              })}
            </h2>
          </div>
          <Button asChild variant="outline">
            <Link href="/etudes-de-cas">
              {t("casesViewAll")}
              <MoveRight className="ml-5 size-4" />
            </Link>
          </Button>
        </Reveal>
        <div className="space-y-6">
          {cases.slice(0, 3).map((item) => (
            <Link
              href={`/etudes-de-cas/${item.slug}`}
              key={item.id}
              className="group grid min-h-72 bg-canvas p-6 transition hover:shadow-[0_20px_55px_rgba(26,32,61,.08)] md:grid-cols-[.7fr_1fr]"
            >
              <div className="relative min-h-52 overflow-hidden bg-accent">
                {item.coverImage && (
                  <Image
                    src={item.coverImage}
                    alt=""
                    fill
                    className="object-cover opacity-75 transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 42vw"
                  />
                )}
                <div className="absolute left-5 top-5 bg-canvas px-4 py-3 text-sm font-semibold">
                  {item.company}
                </div>
              </div>
              <div className="flex flex-col justify-between p-3 md:p-7">
                <h3 className="font-display max-w-2xl text-2xl font-medium leading-[1.35] tracking-[-0.025em]">
                  {item.title}
                </h3>
                <div className="mt-8 flex items-end justify-between">
                  <div className="flex flex-wrap gap-2">
                    {item.sector && (
                      <span className="bg-accent px-3 py-2 text-xs text-white">{item.sector}</span>
                    )}
                    {item.teamSize && (
                      <span className="bg-lime px-3 py-2 text-xs">
                        {t("teamSize", { count: item.teamSize })}
                      </span>
                    )}
                  </div>
                  <ArrowUpRight className="size-5 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProcessSection({ data }: { data: Record<string, unknown> }) {
  const steps = list<string>(data.steps);
  return (
    <section className="section-pad bg-canvas">
      <div className="container-shell">
        <Reveal className="mb-9 max-w-3xl">
          <span className="eyebrow text-ink">{text(data.eyebrow)}</span>
          <h2 className="font-display mt-5 text-[clamp(2.5rem,4vw,3rem)] font-normal leading-[1.2]">
            <EditorialHeading>{text(data.title).replace("\n", " ")}</EditorialHeading>
          </h2>
        </Reveal>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Reveal
              key={step}
              className="group flex min-h-44 flex-col justify-between rounded-card border border-lime bg-lime p-6 transition hover:-translate-y-1 hover:border-cobalt/40 hover:bg-canvas hover:shadow-card"
            >
              <span className="text-right text-3xl font-medium text-muted transition group-hover:text-ink">0{index + 1}</span>
              <h3 className="font-display text-lg font-medium leading-[1.4]">{step}</h3>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

type EventPreviewItem = {
  id: string;
  title: string;
  type: string;
  audience: string;
  location: string;
  offsetDays: number;
  hour: number;
  href: string;
};

export async function EventsPreview({ data }: { data: Record<string, unknown> }) {
  const t = await getTranslations("HomeSections");
  const locale = await getLocale();
  const intlLocale = locale === "en" ? "en-US" : "fr-FR";
  const items = list<EventPreviewItem>(data.items).slice(0, 3);
  return (
    <section className="section-pad bg-lime">
      <div className="container-shell">
        <Reveal className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="eyebrow text-ink">{text(data.eyebrow)}</span>
            <h2 className="font-display mt-5 max-w-3xl text-[clamp(2.5rem,4vw,3rem)] font-normal leading-[1.2]">
              <EditorialHeading>{text(data.title)}</EditorialHeading>
            </h2>
            <p className="mt-4 max-w-2xl leading-6 text-muted">
              {text(data.description)}
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/evenements">
              {t("eventsViewAll")}
              <ArrowRight className="ml-5 size-4" />
            </Link>
          </Button>
        </Reveal>
        <div className="grid border-l border-t border-lime lg:grid-cols-3">
          {items.map((item) => {
            const date = new Date();
            date.setDate(date.getDate() + item.offsetDays);
            date.setHours(item.hour, 0, 0, 0);
            return (
              <Link
                key={item.id}
                href={item.href}
                className="group flex min-h-60 flex-col border-b border-r border-lime bg-canvas p-6 transition hover:bg-lime/40"
              >
                <div className="flex justify-between gap-4 text-xs font-semibold uppercase tracking-[0.08em] text-cobalt">
                  <span>{item.type}</span>
                  <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <h3 className="font-display mt-8 text-2xl font-medium leading-[1.3] tracking-[-0.025em]">
                  {item.title}
                </h3>
                <div className="mt-auto pt-8 text-sm leading-6 text-muted">
                  <p>
                    {new Intl.DateTimeFormat(intlLocale, {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      hour: "2-digit",
                      minute: "2-digit",
                    }).format(date)}
                  </p>
                  <p>{item.location}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function AboutSection({ data }: { data: Record<string, unknown> }) {
  return (
    <section className="section-pad bg-canvas">
      <div className="container-shell grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
        <Reveal>
          <div className="relative aspect-[4/3] max-h-[430px] overflow-hidden rounded-card">
            <Image
              src={text(data.image)}
              alt=""
              fill
              className="masked-image object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
        </Reveal>
        <Reveal className="flex flex-col justify-between py-8 lg:items-end lg:px-10">
          <div className="max-w-3xl">
            <span className="eyebrow text-ink">{text(data.eyebrow)}</span>
            <h2 className="font-display mt-5 text-[clamp(2.5rem,4vw,3rem)] font-normal leading-[1.2]">
              <EditorialHeading>{text(data.title)}</EditorialHeading>
            </h2>
          </div>
          <div className="mt-10 max-w-[558px]">
            <p className="leading-6 text-muted">{text(data.description)}</p>
            <Button asChild variant="outline" className="mt-8">
              <Link href={text(data.ctaHref)}>
                {text(data.ctaLabel)}
                <ArrowRight className="ml-5 size-4" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export async function BlogPreviewSection({ articles }: { articles: HomeArticle[] }) {
  if (!articles.length) return null;
  const t = await getTranslations("HomeSections");
  return (
    <section className="section-pad bg-canvas">
      <div className="container-shell">
        <Reveal className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="eyebrow text-ink">{t("blogEyebrow")}</span>
            <h2 className="font-display mt-5 max-w-3xl text-[clamp(2.5rem,4vw,3rem)] font-normal leading-[1.2]">
              {t("blogTitle")}
            </h2>
          </div>
          <Button asChild variant="outline">
            <Link href="/blog">
              {t("blogViewAll")}
              <ArrowRight className="ml-5 size-4" />
            </Link>
          </Button>
        </Reveal>
        <div className="grid gap-x-6 gap-y-12 md:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}

export async function TestimonialsSection({ items }: { items: Testimonial[] }) {
  if (!items.length) return null;
  const t = await getTranslations("HomeSections");
  return (
    <section className="section-pad bg-canvas">
      <div className="container-shell border-y border-lime py-16 text-center">
        <Reveal>
          <span className="eyebrow text-ink">{t("testimonialsEyebrow")}</span>
          <blockquote className="mx-auto mt-8 max-w-4xl text-[clamp(1.75rem,3vw,2.5rem)] font-normal leading-[1.35] tracking-[-0.025em]">
            “{items[0].quote}”
          </blockquote>
          <p className="mt-6 text-sm italic text-muted">
            {items[0].name} · {items[0].position}, {items[0].company}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export async function FaqSection({ items }: { items: Faq[] }) {
  const t = await getTranslations("HomeSections");
  return (
    <section id="faq" className="section-pad bg-canvas">
      <div className="container-shell grid gap-12 lg:grid-cols-[.75fr_1fr] lg:gap-20">
        <Reveal className="lg:sticky lg:top-32 lg:self-start">
          <span className="eyebrow text-ink">{t("faqEyebrow")}</span>
          <h2 className="font-display mt-5 max-w-lg text-[clamp(2.5rem,4vw,3rem)] font-normal leading-[1.2]">
            {t.rich("faqTitle", {
              em: (chunks) => <span className="font-editorial">{chunks}</span>,
            })}
          </h2>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/contact">
                <Check className="mr-3 size-4" />
                {t("faqWriteToUs")}
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/faq">
                {t("faqViewAll")}
                <ArrowRight className="ml-3 size-4" />
              </Link>
            </Button>
          </div>
        </Reveal>
        <FaqList items={items} />
      </div>
    </section>
  );
}

export function RenderHomeSection({
  section,
  services,
}: {
  section: Section;
  services: HomeService[];
}) {
  const data = section.data as Record<string, unknown>;
  switch (section.type) {
    case "hero":
      return <HeroSection data={data} />;
    case "logos":
      return <LogosSection data={data} />;
    case "services-intro":
      return <ServicesSection data={data} services={services} />;
    case "split-feature":
      return <SplitFeature data={data} />;
    case "cta":
      return <CtaSection data={data} />;
    case "advantages":
      return <AdvantagesSection data={data} />;
    case "process":
      return <ProcessSection data={data} />;
    case "events-preview":
      return <EventsPreview data={data} />;
    case "about":
      return <AboutSection data={data} />;
    default:
      return null;
  }
}
