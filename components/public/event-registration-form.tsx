"use client";

import { ArrowRight, Loader2, UserPlus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";

export function EventRegistrationForm({
  eventId,
  eventTitle,
}: {
  eventId: string;
  eventTitle: string;
}) {
  const t = useTranslations("EventRegistrationForm");
  const locale = useLocale();
  const [pending, setPending] = useState(false);
  const detailsRef = useRef<HTMLDetailsElement>(null);

  return (
    <details ref={detailsRef} className="group mt-5 border-t border-white/10 pt-4">
      <summary className="flex w-fit cursor-pointer list-none items-center gap-2 rounded-lg bg-[#6fda75] px-3.5 py-2 text-xs font-semibold text-accent transition hover:bg-[#8be590] [&::-webkit-details-marker]:hidden">
        <UserPlus className="size-3.5" />
        {t("register")}
        <span className="ml-1 group-open:hidden">+</span>
        <span className="ml-1 hidden group-open:inline">−</span>
      </summary>
      <form
        className="mt-4 grid gap-2 rounded-xl border border-white/10 bg-accent p-3 sm:grid-cols-[1fr_1fr_.8fr_auto]"
        onSubmit={async (submitEvent) => {
          submitEvent.preventDefault();
          setPending(true);
          const form = submitEvent.currentTarget;
          const values = Object.fromEntries(new FormData(form));
          const response = await fetch(`/api/events/${eventId}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...values, locale }),
          });
          const result = (await response.json().catch(() => ({}))) as {
            error?: string;
          };
          setPending(false);
          if (!response.ok) {
            toast.error(result.error ?? t("error"));
            return;
          }
          toast.success(t("success", { eventTitle }));
          form.reset();
          if (detailsRef.current) detailsRef.current.open = false;
        }}
      >
        <Input
          name="name"
          required
          minLength={2}
          placeholder={t("name")}
          aria-label={t("name")}
          className="h-9 rounded-lg border-white/15 bg-white/5 text-xs text-white placeholder:text-white/35"
        />
        <Input
          name="email"
          type="email"
          required
          placeholder={t("email")}
          aria-label={t("email")}
          className="h-9 rounded-lg border-white/15 bg-white/5 text-xs text-white placeholder:text-white/35"
        />
        <Input
          name="phone"
          type="tel"
          required
          placeholder={t("phone")}
          aria-label={t("phone")}
          className="h-9 rounded-lg border-white/15 bg-white/5 text-xs text-white placeholder:text-white/35"
        />
        <input name="website" className="hidden" tabIndex={-1} autoComplete="off" />
        <button
          type="submit"
          disabled={pending}
          className="flex h-9 items-center justify-center gap-2 rounded-lg bg-white px-4 text-xs font-semibold text-accent disabled:opacity-60"
        >
          {pending ? <Loader2 className="size-3.5 animate-spin" /> : t("submit")}
          {!pending && <ArrowRight className="size-3.5" />}
        </button>
      </form>
    </details>
  );
}
