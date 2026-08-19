import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { routing } from "@/i18n/routing";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Préfixe un chemin avec la locale courante (sauf la locale par défaut,
// sans préfixe côté routing next-intl) — utilisé pour les canonical/hreflang
// des pages de détail, qui doivent refléter la locale réellement affichée.
export function localizedPath(path: string, locale: string) {
  if (locale === routing.defaultLocale) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

// Construit la map hreflang { fr: "...", en: "..." } pour un chemin donné
// (chemin non préfixé, ex. "/services/audit-ia").
export function languageAlternates(path: string): Record<string, string> {
  return Object.fromEntries(
    routing.locales.map((locale) => [locale, localizedPath(path, locale)]),
  );
}

export function absoluteUrl(path = "") {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}

export function formatDate(date: Date | string, locale: string = "fr") {
  const intlLocale = locale === "en" ? "en-US" : "fr-FR";
  return new Intl.DateTimeFormat(intlLocale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
