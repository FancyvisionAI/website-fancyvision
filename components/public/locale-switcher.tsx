"use client";

import { Suspense } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

// useSearchParams() impose un Suspense boundary (sinon toute la route perd
// son rendu statique) : on isole donc la logique dans un composant interne
// et on garde le même gabarit (boutons FR/EN non câblés) comme fallback,
// pour éviter tout saut de mise en page pendant l'hydratation.
function LocaleButtons() {
  const locale = useLocale();
  return (
    <>
      {routing.locales.map((loc) => (
        <span
          key={loc}
          aria-hidden
          className={`grid h-full min-w-9 place-items-center rounded-[6px] px-2 uppercase tracking-[0.04em] ${
            loc === locale ? "bg-lime text-ink" : "text-muted"
          }`}
        >
          {loc}
        </span>
      ))}
    </>
  );
}

function LocaleSwitcherInner() {
  const locale = useLocale();
  const pathname = usePathname();
  // Conserve les paramètres de requête existants (ex. ?context=&training=
  // sur /rendez-vous) lors du changement de langue : pathname (next-intl)
  // ne les inclut jamais, il faut donc les reconstruire explicitement.
  const searchParams = useSearchParams();
  const router = useRouter();

  return (
    <>
      {routing.locales.map((loc) => {
        const active = loc === locale;
        return (
          <button
            key={loc}
            type="button"
            aria-current={active ? "true" : undefined}
            onClick={() =>
              router.replace(
                { pathname, query: Object.fromEntries(searchParams.entries()) },
                { locale: loc },
              )
            }
            className={`focus-visible:ring-cobalt focus-visible:ring-offset-canvas grid h-full min-w-9 place-items-center rounded-[6px] px-2 uppercase tracking-[0.04em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
              active ? "bg-lime text-ink" : "text-muted hover:text-ink"
            }`}
          >
            {loc}
          </button>
        );
      })}
    </>
  );
}

export function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  return (
    <div
      role="group"
      aria-label={t("ariaLabel")}
      className="flex h-11 shrink-0 items-center gap-0.5 rounded-control border border-border p-1 text-xs font-semibold"
    >
      <Suspense fallback={<LocaleButtons />}>
        <LocaleSwitcherInner />
      </Suspense>
    </div>
  );
}
