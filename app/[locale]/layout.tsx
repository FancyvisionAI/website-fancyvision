import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

import { routing } from "@/i18n/routing";

// Indique à Next.js les valeurs connues du segment [locale] (fr/en), requis
// avec `setRequestLocale` pour que l'ISR fonctionne sur ce segment dynamique
// (sans ça, Next.js n'a pas de variantes pré-calculées à mettre en cache et
// retombe sur un rendu par requête). Ne change ni les locales supportées ni
// leur détection : /fr et /en restent gérés exactement comme avant.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Ce layout vit à l'intérieur du segment dynamique [locale] : contrairement
// au layout racine (app/layout.tsx), il est ré-exécuté par Next.js à chaque
// fois que le paramètre de route `locale` change. C'est nécessaire pour que
// le contexte next-intl (locale + messages) des composants client (nav,
// locale-switcher, formulaires) reste synchronisé avec l'URL après une
// navigation côté client (Link/router.replace), et pas seulement après un
// rechargement complet de la page.
//
// `setRequestLocale` (au lieu de `getLocale`) : `getLocale`/`getTranslations`
// lisent la locale via `headers()`, une "Dynamic API" Next.js qui force à
// elle seule un rendu dynamique sur toute la route, quel que soit le
// `revalidate` déclaré (limitation documentée de next-intl avec l'App
// Router). `setRequestLocale` fournit la même locale — déjà connue de façon
// fiable via le segment d'URL `params.locale` — sans déclencher cette
// détection dynamique, ce qui permet l'ISR (Lot 2). Le comportement FR/EN
// rendu (contenu, switch, URLs) reste strictement identique.
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
