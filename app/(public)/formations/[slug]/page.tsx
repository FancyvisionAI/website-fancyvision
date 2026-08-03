import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, Gauge, Users } from "lucide-react";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/public/page-hero";
import { RichContent } from "@/components/public/rich-content";
import { Button } from "@/components/ui/button";
import { contentRepository } from "@/lib/repositories/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const item = await contentRepository.training((await params).slug);
  if (!item) return {};
  return {
    title: item.seo?.title ?? item.title,
    description: item.seo?.description ?? item.excerpt,
  };
}

export default async function TrainingDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const item = await contentRepository.training((await params).slug);
  if (!item) notFound();
  const modules = Array.isArray(item.modules)
    ? (item.modules as Array<{ title?: string; description?: string }>)
    : [];
  return (
    <>
      <PageHero
        eyebrow={item.category?.name}
        title={item.title}
        description={item.excerpt}
        cta={{ label: "Demander le programme", href: "/rendez-vous" }}
      />
      <section className="section-pad bg-white">
        <div className="container-shell">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl bg-canvas p-6">
              <Clock className="size-5" />
              <p className="mt-8 text-sm text-black/45">Durée</p>
              <p className="mt-1 text-xl font-semibold">
                {item.duration ?? "Sur mesure"}
              </p>
            </div>
            <div className="rounded-3xl bg-canvas p-6">
              <Users className="size-5" />
              <p className="mt-8 text-sm text-black/45">Public</p>
              <p className="mt-1 text-xl font-semibold">
                {item.audience.join(", ")}
              </p>
            </div>
            <div className="rounded-3xl bg-lime p-6">
              <Gauge className="size-5" />
              <p className="mt-8 text-sm text-black/45">Niveau</p>
              <p className="mt-1 text-xl font-semibold">
                {item.difficulty.replaceAll("_", " ")}
              </p>
            </div>
          </div>
          <div className="mt-20 grid gap-16 lg:grid-cols-[1fr_1fr]">
            <div>
              <span className="eyebrow">Objectifs</span>
              <ul className="mt-8 space-y-4">
                {item.objectives.map((objective) => (
                  <li
                    key={objective}
                    className="flex items-start gap-4 border-b border-black/10 pb-4 text-lg"
                  >
                    <CheckCircle2 className="mt-1 size-5 shrink-0 text-cobalt" />{" "}
                    {objective}
                  </li>
                ))}
              </ul>
            </div>
            <article>
              <span className="eyebrow">Le programme</span>
              <RichContent value={item.content} />
            </article>
          </div>
          <div className="mt-24">
            <span className="eyebrow">Modules</span>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {modules.map((module, index) => (
                <div
                  key={index}
                  className="rounded-3xl border border-black/15 p-7"
                >
                  <span className="text-xs text-black/40">0{index + 1}</span>
                  <h2 className="mt-8 text-2xl font-semibold tracking-[-0.04em]">
                    {module.title}
                  </h2>
                  <p className="mt-3 leading-7 text-black/55">
                    {module.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <Button asChild size="lg" className="mt-12">
            <Link href="/rendez-vous">
              Concevoir votre formation <ArrowRight className="ml-3 size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
