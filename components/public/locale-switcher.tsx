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
      className="flex shrink-0 items-center gap-0.5 rounded-xl border border-lime p-1 text-xs font-semibold"
    >
      {routing.locales.map((loc) => {
        const active = loc === locale;
        return (
          <button
            key={loc}
            type="button"
            aria-current={active ? "true" : undefined}
            onClick={() => router.replace(pathname, { locale: loc })}
            className={`rounded-lg px-2.5 py-1 uppercase tracking-[0.04em] transition ${
              active ? "bg-lime text-ink" : "text-ink/45 hover:text-ink"
            }`}
          >
            {loc}
          </button>
        );
      })}
    </div>
  );
}
