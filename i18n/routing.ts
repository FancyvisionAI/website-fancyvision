import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  localePrefix: "as-needed",
  // Sans ceci, next-intl redirige automatiquement "/" vers "/en" quand le
  // navigateur du visiteur envoie un Accept-Language anglais, avant même de
  // retomber sur defaultLocale. Le site doit toujours démarrer en français
  // sur une URL sans préfixe, quelle que soit la langue du navigateur.
  localeDetection: false,
});
