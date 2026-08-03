import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
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
  const item = await contentRepository.service((await params).slug);
  if (!item) return {};
  return {
    title: item.seo?.title ?? item.title,
    description: item.seo?.description ?? item.excerpt,
    alternates: { canonical: item.seo?.canonical ?? `/services/${item.slug}` },
    robots: item.seo?.noIndex ? { index: false } : undefined,
    openGraph: { images: item.seo?.ogImage ? [item.seo.ogImage] : undefined },
  };
}

export default async function ServiceDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const item = await contentRepository.service((await params).slug);
  if (!item) notFound();
  return (
    <>
      <PageHero
        eyebrow={item.category?.name}
        title={item.title}
        description={item.excerpt}
        cta={{ label: "Échanger avec un consultant", href: "/rendez-vous" }}
      />
      <section className="section-pad bg-white">
        <div className="container-shell grid gap-16 lg:grid-cols-[.65fr_1.35fr]">
          <aside>
            <div className="sticky top-8 rounded-3xl bg-lime p-7">
              <p className="text-sm font-semibold">Ce que vous obtenez</p>
              <ul className="mt-6 space-y-4 text-sm">
                {[
                  "Diagnostic actionnable",
                  "Livrables sur mesure",
                  "Mesure des résultats",
                  "Transfert de compétences",
                ].map((value) => (
                  <li key={value} className="flex gap-3">
                    <Check className="mt-0.5 size-4 shrink-0" /> {value}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
          <article className="max-w-3xl">
            <span className="eyebrow">L’accompagnement</span>
            <RichContent value={item.content} />
            <Button asChild size="lg" className="mt-8">
              <Link href="/rendez-vous">
                Démarrer un diagnostic <ArrowRight className="ml-3 size-4" />
              </Link>
            </Button>
          </article>
        </div>
      </section>
    </>
  );
}
