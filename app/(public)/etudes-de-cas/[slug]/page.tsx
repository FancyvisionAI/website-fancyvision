import type { Metadata } from "next";
import { ArrowDownRight } from "lucide-react";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/public/page-hero";
import { RichContent } from "@/components/public/rich-content";
import { contentRepository } from "@/lib/repositories/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const item = await contentRepository.caseStudy((await params).slug);
  return item
    ? {
        title: item.seo?.title ?? item.title,
        description: item.seo?.description ?? item.excerpt,
      }
    : {};
}

export default async function CaseStudyDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const item = await contentRepository.caseStudy((await params).slug);
  if (!item) notFound();
  const metrics = Array.isArray(item.metrics)
    ? (item.metrics as Array<{ value?: string; label?: string }>)
    : [];
  return (
    <>
      <PageHero
        eyebrow={`${item.company} · ${item.sector ?? "Transformation IA"}`}
        title={item.title}
        description={item.excerpt}
      />
      <section className="bg-cobalt py-14 text-white">
        <div className="container-shell grid gap-4 sm:grid-cols-3">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-3xl border border-white/20 p-7"
            >
              <p className="text-5xl font-semibold tracking-[-0.06em] text-lime">
                {metric.value}
              </p>
              <p className="mt-3 text-sm text-white/60">{metric.label}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="section-pad bg-white">
        <div className="container-shell">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-[2rem] bg-canvas p-8 md:p-12">
              <span className="eyebrow">Avant</span>
              <p className="mt-8 text-3xl font-semibold leading-tight tracking-[-0.04em]">
                {item.before}
              </p>
            </div>
            <div className="rounded-[2rem] bg-lime p-8 md:p-12">
              <span className="eyebrow">Après</span>
              <p className="mt-8 text-3xl font-semibold leading-tight tracking-[-0.04em]">
                {item.after}
              </p>
              <ArrowDownRight className="mt-12 size-7" />
            </div>
          </div>
          <article className="mx-auto mt-20 max-w-3xl">
            <RichContent value={item.content} />
          </article>
        </div>
      </section>
    </>
  );
}
