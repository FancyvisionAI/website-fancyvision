import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

// Ce layout vit à l'intérieur du segment dynamique [locale] : contrairement
// au layout racine (app/layout.tsx), il est ré-exécuté par Next.js à chaque
// fois que le paramètre de route `locale` change. C'est nécessaire pour que
// le contexte next-intl (locale + messages) des composants client (nav,
// locale-switcher, formulaires) reste synchronisé avec l'URL après une
// navigation côté client (Link/router.replace), et pas seulement après un
// rechargement complet de la page.
export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
