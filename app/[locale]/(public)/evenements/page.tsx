import type { Metadata } from "next";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Plus,
  Radio,
  Users,
  X,
} from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";

import { EventRegistrationForm } from "@/components/public/event-registration-form";
import { Link } from "@/i18n/navigation";
import { contentRepository } from "@/lib/repositories/content";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Pages.events");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

type EventFilters = {
  view: "upcoming" | "past";
  audience?: string;
  month?: string;
  day?: string;
};

const monthValue = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

function eventsHref(
  filters: EventFilters,
  updates: Partial<Record<keyof EventFilters, string | undefined>>,
) {
  const next = { ...filters, ...updates };
  const query = new URLSearchParams();
  if (next.view === "past") query.set("view", "past");
  if (next.audience) query.set("audience", next.audience);
  if (next.month) query.set("month", next.month);
  if (next.day) query.set("day", next.day);
  const value = query.toString();
  return value ? `/evenements?${value}` : "/evenements";
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{
    view?: string;
    audience?: string;
    month?: string;
    day?: string;
  }>;
}) {
  const t = await getTranslations("Pages.events");
  const locale = await getLocale();
  const intlLocale = locale === "en" ? "en-US" : "fr-FR";
  const allEvents = await contentRepository.events();
  const params = await searchParams;
  const now = new Date();
  const view: EventFilters["view"] =
    params.view === "past" ? "past" : "upcoming";
  const audiences = [
    ...new Set(allEvents.map((event) => event.audience).filter(Boolean)),
  ] as string[];
  const audience = audiences.includes(params.audience ?? "")
    ? params.audience
    : undefined;
  const requestedMonth = /^\d{4}-\d{2}$/.test(params.month ?? "")
    ? params.month
    : undefined;
  const [requestedYear, requestedMonthNumber] = requestedMonth
    ? requestedMonth.split("-").map(Number)
    : [undefined, undefined];
  const validMonth = Boolean(
    requestedYear &&
    requestedMonthNumber &&
    requestedMonthNumber >= 1 &&
    requestedMonthNumber <= 12,
  );
  const selectedMonth = validMonth ? requestedMonth : undefined;
  const selectedDay =
    selectedMonth && /^\d{1,2}$/.test(params.day ?? "")
      ? Number(params.day)
      : undefined;
  const filters: EventFilters = {
    view,
    audience,
    month: selectedMonth,
    day: selectedDay ? String(selectedDay) : undefined,
  };

  const viewEvents = allEvents.filter((event) =>
    view === "past" ? event.startAt < now : event.startAt >= now,
  );
  const audienceEvents = audience
    ? viewEvents.filter((event) => event.audience === audience)
    : viewEvents;
  const events = audienceEvents.filter((event) => {
    if (selectedMonth && monthValue(event.startAt) !== selectedMonth)
      return false;
    if (selectedDay && event.startAt.getDate() !== selectedDay) return false;
    return true;
  });
  const calendarDate = selectedMonth
    ? new Date(requestedYear!, requestedMonthNumber! - 1, 1)
    : (audienceEvents[0]?.startAt ?? now);
  const hasExtraFilters = Boolean(audience || selectedMonth || selectedDay);

  return (
    <section className="min-h-screen bg-[#06142c] pb-24 pt-28 text-white">
      <div className="container-shell max-w-6xl">
        <div className="mb-7 flex flex-col justify-between gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-end">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#91abd6]">
              Sapiens-IA Sessions
            </span>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.035em]">
              {t("title")}
            </h1>
          </div>
          <Link
            href="/rendez-vous"
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#142746] px-4 text-xs font-semibold text-white/80 transition hover:bg-[#1b3155] hover:text-white"
          >
            <Plus className="size-4" /> {t("organizeEvent")}
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_17.5rem]">
          <main>
            <div className="mb-6 rounded-2xl border border-white/10 bg-[#0c1b35] p-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={eventsHref(filters, {
                    view: "upcoming",
                    month: undefined,
                    day: undefined,
                  })}
                  className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${view === "upcoming" ? "bg-white text-[#07142e]" : "text-white/55 hover:bg-white/5 hover:text-white"}`}
                >
                  {t("upcoming")}
                </Link>
                <Link
                  href={eventsHref(filters, {
                    view: "past",
                    month: undefined,
                    day: undefined,
                  })}
                  className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${view === "past" ? "bg-white text-[#07142e]" : "text-white/55 hover:bg-white/5 hover:text-white"}`}
                >
                  {t("past")}
                </Link>
                <span className="mx-1 hidden h-5 w-px bg-white/10 sm:block" />
                {audiences.map((item) => (
                  <Link
                    key={item}
                    href={eventsHref(filters, {
                      audience: audience === item ? undefined : item,
                      day: undefined,
                    })}
                    className={`rounded-xl border px-3 py-2 text-xs transition ${audience === item ? "border-[#91abd6] bg-[#1b3155] text-white" : "border-white/10 text-white/50 hover:border-white/25 hover:text-white"}`}
                  >
                    {item}
                  </Link>
                ))}
                {hasExtraFilters && (
                  <Link
                    href={eventsHref(filters, {
                      audience: undefined,
                      month: undefined,
                      day: undefined,
                    })}
                    className="ml-auto inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs text-[#91abd6] transition hover:bg-white/5 hover:text-white"
                  >
                    <X className="size-3.5" /> {t("clearFilters")}
                  </Link>
                )}
              </div>
            </div>

            <div className="mb-5 flex items-center gap-2">
              <span className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/70">
                {t("sessionCount", { count: events.length })}
              </span>
              {selectedMonth && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-xs capitalize text-white/55">
                  <CalendarDays className="size-3.5" />
                  {new Intl.DateTimeFormat(intlLocale, {
                    month: "long",
                    year: "numeric",
                  }).format(calendarDate)}
                  {selectedDay ? ` · ${selectedDay}` : ""}
                </span>
              )}
            </div>

            {events.length ? (
              <div className="relative space-y-7 pl-7 before:absolute before:bottom-0 before:left-[6px] before:top-2 before:border-l before:border-dashed before:border-[#3b5072]">
                {events.map((event) => (
                  <article key={event.id} className="relative">
                    <span className="absolute -left-[27px] top-2 size-3 rounded-full border-2 border-[#06142c] bg-[#6f83a7]" />
                    <p className="mb-3 text-sm font-semibold text-white/90">
                      {new Intl.DateTimeFormat(intlLocale, {
                        weekday: "long",
                        day: "numeric",
                        month: "short",
                      }).format(event.startAt)}
                    </p>
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#102342] p-4 shadow-[0_18px_45px_rgba(0,0,0,.12)] sm:p-5">
                      <div className="grid gap-5 sm:grid-cols-[1fr_9rem]">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-white/55">
                            <span className="inline-flex items-center gap-1.5">
                              <Clock3 className="size-3.5" />
                              {new Intl.DateTimeFormat(intlLocale, {
                                hour: "2-digit",
                                minute: "2-digit",
                              }).format(event.startAt)}
                              {event.endAt && (
                                <>
                                  {" "}
                                  –{" "}
                                  {new Intl.DateTimeFormat(intlLocale, {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }).format(event.endAt)}
                                </>
                              )}
                            </span>
                            <span className="text-[#ffd166]">
                              {t("parisTime")}
                            </span>
                          </div>
                          <h2 className="mt-3 max-w-2xl text-xl font-semibold leading-[1.25] tracking-[-0.025em] sm:text-2xl">
                            {event.title}
                          </h2>
                          <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-6 text-white/55">
                            {event.description}
                          </p>
                          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/60">
                            <span className="inline-flex items-center gap-2">
                              <Users className="size-4" />{" "}
                              {t("hostedBy", { host: event.host })}
                            </span>
                            <span className="inline-flex items-center gap-2">
                              <MapPin className="size-4" /> {event.location}
                            </span>
                          </div>
                          <div className="mt-4 flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-[#193a36] px-3 py-1 text-xs font-semibold text-[#6fda75]">
                              {event.type}
                            </span>
                            {event.capacity && (
                              <span className="text-xs text-white/40">
                                {t("spotsRemaining", {
                                  count: Math.max(
                                    0,
                                    event.capacity - event._count.registrations,
                                  ),
                                })}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="relative min-h-32 overflow-hidden rounded-xl border border-white/10 bg-[#09162e]">
                          {event.image ? (
                            <Image
                              src={event.image}
                              alt=""
                              fill
                              className="object-cover opacity-85"
                              sizes="144px"
                            />
                          ) : (
                            <div className="grid h-full place-items-center">
                              <Radio className="size-7 text-[#91abd6]" />
                            </div>
                          )}
                        </div>
                      </div>
                      {view !== "past" && (
                        <EventRegistrationForm
                          eventId={event.id}
                          eventTitle={event.title}
                        />
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-[#102342] p-10 text-center text-white/55">
                {t("noEvents")}
              </div>
            )}
          </main>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <MiniEventCalendar
              date={calendarDate}
              events={audienceEvents}
              filters={filters}
              selectedDay={selectedDay}
            />
            <div className="mt-4 rounded-2xl border border-white/10 bg-[#0c1b35] p-5">
              <p className="text-sm font-semibold">{t("questionTitle")}</p>
              <p className="mt-2 text-xs leading-5 text-white/50">
                {t("questionText")}
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-flex text-xs font-semibold text-[#91abd6] hover:text-white"
              >
                {t("contactTeam")}
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

async function MiniEventCalendar({
  date,
  events,
  filters,
  selectedDay,
}: {
  date: Date;
  events: Array<{ startAt: Date }>;
  filters: EventFilters;
  selectedDay?: number;
}) {
  const t = await getTranslations("Pages.events");
  const locale = await getLocale();
  const intlLocale = locale === "en" ? "en-US" : "fr-FR";
  const weekdays = t("weekdays").split(",");
  const year = date.getFullYear();
  const month = date.getMonth();
  const first = new Date(year, month, 1);
  const offset = first.getDay();
  const total = new Date(year, month + 1, 0).getDate();
  const eventDays = new Set(
    events
      .filter(
        (event) =>
          event.startAt.getFullYear() === year &&
          event.startAt.getMonth() === month,
      )
      .map((event) => event.startAt.getDate()),
  );
  const previousMonth = new Date(year, month - 1, 1);
  const nextMonth = new Date(year, month + 1, 1);
  const currentMonth = monthValue(date);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0c1b35] p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold capitalize tracking-[-0.02em]">
          {new Intl.DateTimeFormat(intlLocale, {
            month: "long",
            year: "numeric",
          }).format(date)}
        </h2>
        <div className="flex items-center gap-1">
          <Link
            href={eventsHref(filters, {
              month: monthValue(previousMonth),
              day: undefined,
            })}
            aria-label={t("previousMonth")}
            className="grid size-8 place-items-center rounded-lg text-white/45 transition hover:bg-white/10 hover:text-white"
          >
            <ChevronLeft className="size-4" />
          </Link>
          <Link
            href={eventsHref(filters, { month: undefined, day: undefined })}
            aria-label={t("resetCalendar")}
            className="grid size-8 place-items-center rounded-lg text-white/45 transition hover:bg-white/10 hover:text-white"
          >
            <span className="size-1.5 rounded-full bg-current" />
          </Link>
          <Link
            href={eventsHref(filters, {
              month: monthValue(nextMonth),
              day: undefined,
            })}
            aria-label={t("nextMonth")}
            className="grid size-8 place-items-center rounded-lg text-white/45 transition hover:bg-white/10 hover:text-white"
          >
            <ChevronRight className="size-4" />
          </Link>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-y-2 text-center text-xs">
        {weekdays.map((day, index) => (
          <span key={`${day}-${index}`} className="font-semibold text-white/40">
            {day}
          </span>
        ))}
        {Array.from({ length: offset }, (_, index) => (
          <span key={`empty-${index}`} />
        ))}
        {Array.from({ length: total }, (_, index) => index + 1).map((day) => {
          const hasEvent = eventDays.has(day);
          const active = selectedDay === day && filters.month === currentMonth;
          return hasEvent ? (
            <Link
              key={day}
              href={eventsHref(filters, {
                month: currentMonth,
                day: active ? undefined : String(day),
              })}
              aria-label={t("filterDay", { day })}
              className={`relative mx-auto grid size-8 place-items-center rounded-lg font-semibold transition ${active ? "bg-[#91abd6] text-[#07142e]" : "text-white hover:bg-white/10"}`}
            >
              {day}
              {!active && (
                <i className="absolute bottom-0.5 size-1 rounded-full bg-[#91abd6]" />
              )}
            </Link>
          ) : (
            <span
              key={day}
              className="grid h-8 place-items-center text-white/30"
            >
              {day}
            </span>
          );
        })}
      </div>
      <div className="mt-5 grid grid-cols-2 rounded-xl bg-[#142746] p-1 text-center text-xs font-semibold">
        <Link
          href={eventsHref(filters, {
            view: "upcoming",
            month: undefined,
            day: undefined,
          })}
          className={`rounded-lg px-3 py-2 transition ${filters.view === "upcoming" ? "bg-[#50627f] text-white" : "text-white/45 hover:text-white"}`}
        >
          {t("upcoming")}
        </Link>
        <Link
          href={eventsHref(filters, {
            view: "past",
            month: undefined,
            day: undefined,
          })}
          className={`rounded-lg px-3 py-2 transition ${filters.view === "past" ? "bg-[#50627f] text-white" : "text-white/45 hover:text-white"}`}
        >
          {t("past")}
        </Link>
      </div>
    </div>
  );
}
