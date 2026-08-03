import { Search } from "lucide-react";

import { ContentCard } from "@/components/public/content-card";
import { PageHero } from "@/components/public/page-hero";
import { contentRepository } from "@/lib/repositories/content";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const q = (await searchParams).q ?? "";
  const results = await contentRepository.globalSearch(q);
  return (
    <>
      <PageHero
        eyebrow="Recherche globale"
        title="Que cherchez-vous ?"
        description="Services, formations, articles, FAQ et études de cas."
      />
      <section className="section-pad bg-canvas pt-0">
        <div className="container-shell">
          <form className="relative max-w-4xl">
            <Search className="absolute left-6 top-1/2 size-5 -translate-y-1/2 text-black/40" />
            <input
              name="q"
              defaultValue={q}
              autoFocus
              placeholder="Ex. formation ChatGPT, audit, sécurité…"
              className="h-20 w-full rounded-full border border-black/15 bg-white pl-16 pr-8 text-lg outline-none focus:border-cobalt"
            />
          </form>
          {q.length >= 2 && (
            <p className="my-10 text-sm text-black/45">
              {results.length} résultat(s) pour “{q}”
            </p>
          )}
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {results.map((item, index) => (
              <ContentCard
                key={`${item.type}-${item.id}`}
                href={item.href}
                index={index}
                eyebrow={item.type}
                title={item.title}
                description={item.excerpt}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
