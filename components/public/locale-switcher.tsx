"use client";

import { useLocale, useTranslations } from "next-intl";

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      role="group"
      aria-label={t("ariaLabel")}
      className="flex h-11 shrink-0 items-center gap-0.5 rounded-control border border-border p-1 text-xs font-semibold"
    >
      {routing.locales.map((loc) => {
        const active = loc === locale;
        return (
          <button
            key={loc}
            type="button"
            aria-current={active ? "true" : undefined}
            onClick={() => router.replace(pathname, { locale: loc })}
            className={`focus-visible:ring-cobalt focus-visible:ring-offset-canvas grid h-full min-w-9 place-items-center rounded-[6px] px-2 uppercase tracking-[0.04em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
              active ? "bg-lime text-ink" : "text-muted hover:text-ink"
            }`}
          >
            {loc}
          </button>
        );
      })}
    </div>
  );
}
