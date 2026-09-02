import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";

import { Footer } from "@/components/public/footer";
import { Header } from "@/components/public/header";
import { CookieBanner } from "@/components/public/cookie-banner";
import { FloatingContact } from "@/components/public/floating-contact";
import { contentRepository } from "@/lib/repositories/content";

// Public content is database-backed. Plutôt que de forcer un rendu
// dynamique sur CHAQUE page (aucun cache, chaque clic relance toutes les
// requêtes CMS — voir mesures Lot 2), on utilise l'ISR : la page servie
// peut avoir jusqu'à 60s de retard sur la dernière modification CMS, ce
// qui reste quasi immédiat, en échange d'un site nettement plus rapide.
// Les segments qui ont réellement besoin d'un rendu par requête
// (formulaires, recherche) déclarent leur propre `force-dynamic` en plus
// spécifique, ce qui prend le dessus sur cette valeur par défaut.
export const revalidate = 60;

// Setting.value est un Json libre (pas de migration Prisma) : le texte
// cookie peut être soit l'ancien format `string` (FR uniquement), soit le
// nouveau `{ fr, en }`. On résout la locale active avec repli FR.
function resolveCookieText(
  text: string | { fr?: string; en?: string } | undefined,
  locale: string,
): string | undefined {
  if (!text) return undefined;
  if (typeof text === "string") return text;
  return (locale === "en" ? text.en : text.fr) ?? text.fr;
}

// Isolé dans son propre composant + Suspense pour que sa lecture de
// contentRepository.settings() ne bloque plus le rendu de Header/main/
// Footer : avant, PublicLayout attendait ce fetch avant de retourner le
// moindre JSX, créant un waterfall inutile (la bannière cookie n'a besoin
// d'apparaître qu'une fois le reste de la page déjà affiché).
async function CookieBannerLoader({ locale }: { locale: string }) {
  const settings = await contentRepository.settings();
  const cookie = settings.find((item) => item.key === "cookie")?.value as
    | { enabled?: boolean; text?: string | { fr?: string; en?: string } }
    | undefined;
  const cookieText = resolveCookieText(cookie?.text, locale);
  if (!cookie?.enabled || !cookieText) return null;
  return <CookieBanner text={cookieText} />;
}

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Doit être appelé avant tout appel à getLocale()/getTranslations() dans
  // cet arbre (voir app/[locale]/layout.tsx pour le détail) : Header et
  // Footer reçoivent la locale directement en prop plutôt que de la relire
  // eux-mêmes via getLocale(), pour rester compatibles avec l'ISR.
  setRequestLocale(locale);
  return (
    <>
      <Header locale={locale} />
      <main>{children}</main>
      <Footer locale={locale} />
      <Suspense fallback={null}>
        <CookieBannerLoader locale={locale} />
      </Suspense>
      <FloatingContact locale={locale} />
    </>
  );
}
