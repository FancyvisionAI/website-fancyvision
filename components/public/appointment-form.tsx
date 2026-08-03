"use client";

import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const weekdays = ["L", "M", "M", "J", "V", "S", "D"];
const slots = ["09:30", "11:00", "14:00", "15:30", "17:00"];

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function AppointmentForm() {
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
      className="overflow-hidden rounded-2xl border border-[#dfe7f4] bg-white shadow-[0_22px_70px_rgba(26,32,61,.09)]"
      onSubmit={async (submitEvent) => {
        submitEvent.preventDefault();
        if (!selectedDate || !selectedTime) {
          toast.error("Choisissez une date et un horaire.");
          return;
        }
        setPending(true);
        const form = submitEvent.currentTarget;
        const values = Object.fromEntries(new FormData(form));
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
          toast.error("Vérifiez les informations saisies.");
          return;
        }
        toast.success("Votre demande de rendez-vous est enregistrée.");
        form.reset();
        setSelectedDate("");
        setSelectedTime("");
      }}
    >
      <div className="grid lg:grid-cols-[.9fr_1.1fr]">
        <div className="border-b border-[#dfe7f4] bg-[#f4f7fb] p-5 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold capitalize">
              <CalendarDays className="size-4 text-[#597dc1]" />
              {new Intl.DateTimeFormat("fr-FR", {
                month: "long",
                year: "numeric",
              }).format(cursor)}
            </div>
            <div className="flex gap-1">
              <CalendarButton
                label="Mois précédent"
                onClick={() =>
                  setCursor(
                    new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1),
                  )
                }
              >
                <ChevronLeft className="size-4" />
              </CalendarButton>
              <CalendarButton
                label="Mois suivant"
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
              <span key={`${weekday}-${index}`} className="py-1 text-[10px] font-semibold text-[#788397]">
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
                      ? "bg-[#1a203d] font-semibold text-white"
                      : disabled
                        ? "cursor-not-allowed text-[#b8c0cd]"
                        : "text-[#303b64] hover:bg-white"
                  }`}
                  aria-pressed={selected}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <div className="mt-5 border-t border-[#dfe7f4] pt-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#788397]">
              Horaires disponibles
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
                      ? "border-[#1a203d] bg-[#1a203d] text-white"
                      : "border-[#d5dfed] bg-white text-[#303b64] hover:border-[#597dc1] disabled:cursor-not-allowed disabled:opacity-40"
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
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#597dc1]">
              Appel découverte · 30 min
            </p>
            <h2 className="mt-2 text-2xl font-medium tracking-[-0.03em]">
              Vos coordonnées
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nom">
              <Input name="name" required minLength={2} className="h-10 rounded-lg" />
            </Field>
            <Field label="Email">
              <Input name="email" type="email" required className="h-10 rounded-lg" />
            </Field>
            <Field label="Téléphone">
              <Input name="phone" type="tel" required className="h-10 rounded-lg" />
            </Field>
            <Field label="Entreprise">
              <Input name="company" className="h-10 rounded-lg" />
            </Field>
          </div>
          <input name="topic" type="hidden" value="Appel découverte" />
          <input name="website" className="hidden" tabIndex={-1} autoComplete="off" />

          <div className="mt-5 flex min-h-10 items-center justify-between gap-4 rounded-xl bg-[#f4f7fb] px-4 py-2 text-xs text-[#566174]">
            <span>
              {selectedDate && selectedTime
                ? `${new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(
                    new Date(`${selectedDate}T12:00:00`),
                  )} à ${selectedTime}`
                : "Sélectionnez votre créneau"}
            </span>
            {selectedDate && selectedTime && <Check className="size-4 text-[#4765b2]" />}
          </div>

          <Button className="mt-5 h-10 w-full rounded-xl text-sm" disabled={pending}>
            {pending && <Loader2 className="mr-2 size-4 animate-spin" />}
            Confirmer le rendez-vous
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
      className="grid size-8 place-items-center rounded-lg border border-[#d5dfed] bg-white text-[#303b64]"
      aria-label={label}
    >
      {children}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-1.5 text-xs font-semibold">{label}{children}</label>;
}
