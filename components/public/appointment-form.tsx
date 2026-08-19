"use client";

import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const slots = ["09:30", "11:00", "14:00", "15:30", "17:00"];

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const ORGANIZATION_SIZES = [
  "sizeIndividual",
  "sizeSme",
  "sizeLarge",
] as const;

export function AppointmentForm({
  sectorOptions,
}: {
  sectorOptions: string[];
}) {
  const t = useTranslations("AppointmentForm");
  const locale = useLocale();
  const intlLocale = locale === "en" ? "en-US" : "fr-FR";
  const weekdays = t("weekdays").split(",");
  const today = useMemo(() => {
    const value = new Date();
    value.setHours(0, 0, 0, 0);
    return value;
  }, []);
  const [cursor, setCursor] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [pending, setPending] = useState(false);

  const calendarDays = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const offset = (first.getDay() + 6) % 7;
    const total = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
    return [
      ...Array.from({ length: offset }, () => null),
      ...Array.from(
        { length: total },
        (_, index) => new Date(cursor.getFullYear(), cursor.getMonth(), index + 1),
      ),
    ];
  }, [cursor]);

  return (
    <form
      className="overflow-hidden rounded-2xl border border-lime bg-canvas shadow-[0_22px_70px_rgba(26,32,61,.09)]"
      onSubmit={async (submitEvent) => {
        submitEvent.preventDefault();
        if (!selectedDate || !selectedTime) {
          toast.error(t("missingSlot"));
          return;
        }
        setPending(true);
        const form = submitEvent.currentTarget;
        const values = Object.fromEntries(new FormData(form));
        const firstName = String(values.firstName ?? "").trim();
        const lastName = String(values.lastName ?? "").trim();
        values.name = `${firstName} ${lastName}`.trim();
        delete values.firstName;
        delete values.lastName;
        values.preferredDate = new Date(
          `${selectedDate}T${selectedTime}:00`,
        ).toISOString();
        const response = await fetch("/api/appointments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        setPending(false);
        if (!response.ok) {
          toast.error(t("invalid"));
          return;
        }
        toast.success(t("success"));
        form.reset();
        setSelectedDate("");
        setSelectedTime("");
      }}
    >
      <div className="grid lg:grid-cols-[.9fr_1.1fr]">
        <div className="border-b border-lime bg-lime p-5 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold capitalize">
              <CalendarDays className="size-4 text-cobalt" />
              {new Intl.DateTimeFormat(intlLocale, {
                month: "long",
                year: "numeric",
              }).format(cursor)}
            </div>
            <div className="flex gap-1">
              <CalendarButton
                label={t("previousMonth")}
                onClick={() =>
                  setCursor(
                    new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1),
                  )
                }
              >
                <ChevronLeft className="size-4" />
              </CalendarButton>
              <CalendarButton
                label={t("nextMonth")}
                onClick={() =>
                  setCursor(
                    new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1),
                  )
                }
              >
                <ChevronRight className="size-4" />
              </CalendarButton>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-7 gap-1 text-center">
            {weekdays.map((weekday, index) => (
              <span key={`${weekday}-${index}`} className="py-1 text-[10px] font-semibold text-muted">
                {weekday}
              </span>
            ))}
            {calendarDays.map((date, index) => {
              if (!date) return <span key={`empty-${index}`} />;
              const key = dateKey(date);
              const disabled = date < today || date.getDay() === 0;
              const selected = selectedDate === key;
              return (
                <button
                  key={key}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    setSelectedDate(key);
                    setSelectedTime("");
                  }}
                  className={`grid aspect-square place-items-center rounded-lg text-xs transition ${
                    selected
                      ? "bg-accent font-semibold text-white"
                      : disabled
                        ? "cursor-not-allowed text-muted"
                        : "text-ink hover:bg-canvas"
                  }`}
                  aria-pressed={selected}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <div className="mt-5 border-t border-lime pt-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
              {t("availableSlots")}
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {slots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  disabled={!selectedDate}
                  onClick={() => setSelectedTime(slot)}
                  className={`h-8 rounded-lg border text-xs font-medium transition ${
                    selectedTime === slot
                      ? "border-accent bg-accent text-white"
                      : "border-lime bg-canvas text-ink hover:border-cobalt disabled:cursor-not-allowed disabled:opacity-40"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cobalt">
              {t("discoveryCall")}
            </p>
            <h2 className="mt-2 text-2xl font-medium tracking-[-0.03em]">
              {t("yourDetails")}
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t("firstName")}>
              <Input name="firstName" required minLength={2} className="h-10 rounded-lg" />
            </Field>
            <Field label={t("lastName")}>
              <Input name="lastName" required minLength={2} className="h-10 rounded-lg" />
            </Field>
            <Field label={t("email")}>
              <Input name="email" type="email" required className="h-10 rounded-lg" />
            </Field>
            <Field label={t("phone")}>
              <Input name="phone" type="tel" required className="h-10 rounded-lg" />
            </Field>
            <Field label={t("company")}>
              <Input name="company" className="h-10 rounded-lg" />
            </Field>
            <Field label={t("sector")}>
              <select
                name="sector"
                defaultValue=""
                className="border-ink/15 bg-canvas/70 focus:ring-cobalt/10 flex h-10 w-full rounded-lg border px-4 text-sm outline-none transition focus:border-cobalt focus:ring-2"
              >
                <option value="" disabled>
                  {t("sectorPlaceholder")}
                </option>
                {sectorOptions.map((sector) => (
                  <option key={sector} value={sector}>
                    {sector}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t("organizationSize")}>
              <select
                name="organizationSize"
                defaultValue=""
                className="border-ink/15 bg-canvas/70 focus:ring-cobalt/10 flex h-10 w-full rounded-lg border px-4 text-sm outline-none transition focus:border-cobalt focus:ring-2"
              >
                <option value="" disabled>
                  {t("organizationSizePlaceholder")}
                </option>
                {ORGANIZATION_SIZES.map((key) => (
                  <option key={key} value={t(key)}>
                    {t(key)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t("message")} className="sm:col-span-2">
              <textarea
                name="message"
                rows={3}
                className="border-ink/15 bg-canvas/70 placeholder:text-ink/40 focus:ring-cobalt/10 w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition focus:border-cobalt focus:ring-2"
              />
            </Field>
          </div>
          {/* Valeur envoyée à l'API volontairement non traduite : identifiant métier interne, cf. Phase 2 */}
          <input name="topic" type="hidden" value="Appel découverte" />
          <input name="website" className="hidden" tabIndex={-1} autoComplete="off" />

          <div className="mt-5 flex min-h-10 items-center justify-between gap-4 rounded-xl bg-lime px-4 py-2 text-xs text-muted">
            <span>
              {selectedDate && selectedTime
                ? t("slotSummary", {
                    date: new Intl.DateTimeFormat(intlLocale, { dateStyle: "medium" }).format(
                      new Date(`${selectedDate}T12:00:00`),
                    ),
                    time: selectedTime,
                  })
                : t("selectSlot")}
            </span>
            {selectedDate && selectedTime && <Check className="size-4 text-cobalt" />}
          </div>

          <Button className="mt-5 h-10 w-full rounded-xl text-sm" disabled={pending}>
            {pending && <Loader2 className="mr-2 size-4 animate-spin" />}
            {t("confirm")}
            <ArrowRight className="ml-3 size-4" />
          </Button>
        </div>
      </div>
    </form>
  );
}

function CalendarButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid size-8 place-items-center rounded-lg border border-lime bg-canvas text-ink"
      aria-label={label}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`grid gap-1.5 text-xs font-semibold ${className}`}>
      {label}
      {children}
    </label>
  );
}
