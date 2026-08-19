"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export function Newsletter() {
  const t = useTranslations("Newsletter");
  const [pending, setPending] = useState(false);

  return (
    <section className="border-b border-white/15 bg-accent py-16 text-white md:py-20">
      <div className="container-shell grid items-end gap-10 md:grid-cols-[1.35fr_.65fr]">
        <div>
          <span className="eyebrow text-cobalt-strong">{t("eyebrow")}</span>
          <h2 className="mt-5 max-w-4xl text-[clamp(2.5rem,4vw,3.5rem)] font-normal leading-[1.2]">
            {t.rich("heading", {
              em: (chunks) => <span className="font-editorial">{chunks}</span>,
            })}
          </h2>
        </div>
        <form
          className="space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setPending(true);
            const data = new FormData(event.currentTarget);
            const response = await fetch("/api/newsletter", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(Object.fromEntries(data)),
            });
            setPending(false);
            if (response.ok) {
              toast.success(t("success"));
              event.currentTarget.reset();
            } else toast.error(t("error"));
          }}
        >
          <div className="relative">
            <input
              name="email"
              type="email"
              required
              placeholder={t("emailPlaceholder")}
              className="h-14 w-full border border-white/25 bg-transparent px-5 pr-16 outline-none placeholder:text-white/40 focus:border-white"
            />
            <button
              disabled={pending}
              className="absolute right-1 top-1 grid size-12 place-items-center bg-white text-accent transition hover:bg-slate-100"
              aria-label={t("subscribe")}
            >
              <ArrowRight className="size-5" />
            </button>
          </div>
          <input name="website" className="hidden" tabIndex={-1} autoComplete="off" />
          <p className="text-xs leading-5 text-white/45">
            {t("helper")}
          </p>
        </form>
      </div>
    </section>
  );
}
