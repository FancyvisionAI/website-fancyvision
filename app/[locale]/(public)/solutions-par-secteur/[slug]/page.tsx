import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/public/page-hero";
import { RichContent } from "@/components/public/rich-content";
import { SectorVisual } from "@/components/public/sector-visual";
import { permanentRedirect } from "@/i18n/navigation";
import { contentRepository } from "@/lib/repositories/content";
import { languageAlternates, localizedPath } from "@/lib/utils";

// L'ancienne page fusionnée "Les avocats et notaires" a été scindée en deux
// secteurs distincts (cf. audit) ; le slug d'origine devient une redirection
// permanente vers "avocats" (qui a hérité de l'ancien enregistrement CMS)
// pour ne jamais casser un lien externe ou un signet existant.
const LEGACY_SLUG_REDIRECTS: Record<string, string> = {
  "secteur-avocats-notaires": "secteur-avocats",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const locale = await getLocale();
  const item = await contentRepository.service((await params).slug, locale);
  if (!item || item.category?.slug !== "secteurs") return {};
  const path = `/solutions-par-secteur/${item.slug}`;
  return {
    title: item.seo?.title ?? item.title,
    description: item.seo?.description ?? item.excerpt,
    alternates: {
      canonical: item.seo?.canonical ?? localizedPath(path, locale),
      languages: languageAlternates(path),
    },
    robots: item.seo?.noIndex ? { index: false } : undefined,
    openGraph: { images: item.seo?.ogImage ? [item.seo.ogImage] : undefined },
  };
}

export default async function SecteurDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const t = await getTranslations("Pages.secteurDetail");
  const tCategories = await getTranslations("Categories");
  const locale = await getLocale();
  const { slug } = await params;
  const redirectSlug = LEGACY_SLUG_REDIRECTS[slug];
  if (redirectSlug) {
    permanentRedirect({
      href: `/solutions-par-secteur/${redirectSlug}`,
      locale,
    });
  }
  const item = await contentRepository.service(slug, locale);
  if (!item || item.category?.slug !== "secteurs") notFound();

  return (
    <>
      <PageHero
        eyebrow={tCategories("secteurs")}
        title={item.title}
        description={item.excerpt}
        cta={{ label: t("cta"), href: "/rendez-vous?context=consultation" }}
      />
      <section className="section-pad bg-canvas">
        <div className="container-shell grid gap-12 lg:grid-cols-[.4fr_1fr]">
          <div className="-mt-10 hidden pb-16 lg:block">
            {/* aspect-[4/3] (plutôt que aspect-square) : sur les écrans
                larges, un visuel carré à 40% de la largeur du conteneur
                devenait très haut. `pb-16` sur ce conteneur (et non sur
                `.section-pad`, utilisé par tout le site) ajoute une marge de
                sécurité propre à cette colonne : quand le contenu texte à
                droite est court, c'est la hauteur du visuel qui détermine la
                hauteur de la ligne de grille — sans cet espace, son bord
                inférieur ne laissait qu'un espace minime avant le Footer. */}
            <SectorVisual
              slug={item.slug}
              className="sticky top-20 aspect-[4/3] w-full"
              iconScale="72%"
            />
          </div>
          <article className="max-w-3xl">
            <SectorVisual
              slug={item.slug}
              className="mb-8 aspect-[2.4/1] w-full lg:hidden"
              iconScale="72%"
            />
            <RichContent value={item.content} />
          </article>
        </div>
      </section>
    </>
  );
}
