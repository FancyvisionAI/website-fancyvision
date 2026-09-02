import type { Metadata } from "next";
import { getLocale } from "next-intl/server";

import { LegalPage } from "@/components/public/legal-page";
import { contentRepository } from "@/lib/repositories/content";
import { languageAlternates, localizedPath } from "@/lib/utils";

// Réutilise le titre/la description déjà affichés par LegalPage (contenu
// CMS existant) : pas de nouveau texte, seulement reflété dans les
// métadonnées.
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const page = await contentRepository.page("mentions-legales", locale);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: localizedPath("/mentions-legales", locale),
      languages: languageAlternates("/mentions-legales"),
    },
  };
}

export default function Page() {
  return <LegalPage slug="mentions-legales" />;
}
