import { Search } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { ContentCard } from "@/components/public/content-card";
import { PageHero } from "@/components/public/page-hero";
import { contentRepository } from "@/lib/repositories/content";

// Résultats dépendants du paramètre de recherche : garde un rendu par
// requête (le layout parent utilise désormais l'ISR par défaut, voir
// Lot 2). searchParams force déjà un rendu dynamique dans Next.js, mais
// on le déclare explicitement pour que l'intention soit sans ambiguïté.
export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const t = await getTranslations("Pages.search");
  const locale = await getLocale();
  const q = (await searchParams).q ?? "";
  const results = await contentRepository.globalSearch(q, locale);
  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />
      <section className="section-pad bg-canvas pt-0">
        <div className="container-shell">
          <form className="relative max-w-4xl">
            <Search className="text-ink/40 absolute left-6 top-1/2 size-5 -translate-y-1/2" />
            <input
              name="q"
              defaultValue={q}
              autoFocus
              placeholder={t("placeholder")}
              className="border-ink/15 h-20 w-full rounded-full border bg-canvas pl-16 pr-8 text-lg outline-none focus:border-cobalt"
            />
          </form>
          {q.length >= 2 && (
            <p className="text-ink/45 my-10 text-sm">
              {t("resultCount", { count: results.length, query: q })}
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
