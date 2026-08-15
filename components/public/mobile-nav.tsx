"use client";

import { Menu, Minus, Plus, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type {
  NavigationService,
  NavigationTraining,
} from "@/components/public/header";
import { LocaleSwitcher } from "@/components/public/locale-switcher";
import { Link } from "@/i18n/navigation";
import { sectors } from "@/lib/content/sectors";

type Item = { id: string; label: string; url: string };

export function MobileNav({
  items,
  services,
  trainings,
}: {
  items: Item[];
  services: NavigationService[];
  trainings: NavigationTraining[];
}) {
  const t = useTranslations("MobileNav");
  const tSectors = useTranslations("Sectors");
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [sectorsOpen, setSectorsOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => {
    setOpen(false);
    setServicesOpen(false);
    setSectorsOpen(false);
  }, []);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const closeFromKeyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", closeFromKeyboard);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeFromKeyboard);
    };
  }, [close, open]);

  const overlay = mounted && open
    ? createPortal(
        <div
          className="fixed inset-0 z-[200] flex h-[100dvh] w-screen flex-col overflow-hidden bg-canvas text-ink lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={t("navigationAriaLabel")}
        >
          <div className="flex h-[4.875rem] shrink-0 items-center justify-between border-b border-lime bg-canvas px-5 shadow-[0_8px_30px_rgba(26,32,61,.05)]">
            <Link href="/" className="text-xl font-semibold tracking-[-0.04em]" onClick={close}>
              FancyVision<span className="font-editorial text-cobalt">.</span>
            </Link>
            <div className="flex items-center gap-3">
              <LocaleSwitcher />
              <button
                ref={closeButtonRef}
                className="grid size-10 place-items-center rounded-xl border border-[#d7e0ee] bg-[#f8faff] transition hover:bg-[#edf2fa]"
                onClick={close}
                aria-label={t("closeMenu")}
              >
                <X className="size-5" />
              </button>
            </div>
          </div>

          <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-3">
            <button
              type="button"
              className="flex w-full items-center justify-between border-b border-lime py-4 text-left text-[1.15rem] font-medium tracking-[-0.025em]"
              onClick={() => {
                setServicesOpen((value) => !value);
                setSectorsOpen(false);
              }}
              aria-expanded={servicesOpen}
            >
              {t("services")}
              {servicesOpen ? <Minus className="size-5" /> : <Plus className="size-5" />}
            </button>
            {servicesOpen && (
              <div className="my-2 rounded-2xl bg-[#11162d] px-5 text-white shadow-[0_18px_45px_rgba(4,7,27,.18)]">
                <MobileGroup title={t("consulting")} items={services.filter((item) => item.categorySlug === "conseil")} prefix="/services" close={close} />
                <MobileGroup title={t("data")} items={services.filter((item) => item.categorySlug === "data")} prefix="/services" close={close} />
                <MobileGroup title={t("corporateTraining")} items={trainings.filter((item) => item.categorySlug === "entreprise")} prefix="/formations" close={close} />
                <MobileGroup title={t("individualTraining")} items={trainings.filter((item) => item.categorySlug === "particuliers")} prefix="/formations" close={close} />
              </div>
            )}
            <button
              type="button"
              className="flex w-full items-center justify-between border-b border-lime py-4 text-left text-[1.15rem] font-medium tracking-[-0.025em]"
              onClick={() => {
                setSectorsOpen((value) => !value);
                setServicesOpen(false);
              }}
              aria-expanded={sectorsOpen}
            >
              {t("sectors")}
              {sectorsOpen ? <Minus className="size-5" /> : <Plus className="size-5" />}
            </button>
            {sectorsOpen && (
              <div className="my-2 rounded-2xl bg-gradient-to-br from-[#071027] to-[#263b68] p-5 text-white shadow-[0_18px_45px_rgba(4,7,27,.18)]">
                <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.15em] text-[#b8c9e8]">
                  {t("ourSectors")}
                </p>
                <div className="space-y-1">
                  {sectors.map((sector) =>
                    sector.available ? (
                      <Link
                        key={sector.key}
                        href={sector.href}
                        onClick={close}
                        className="block py-2.5 text-sm font-semibold"
                      >
                        {tSectors(sector.key)}
                      </Link>
                    ) : (
                      <div
                        key={sector.key}
                        className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm text-white/70"
                      >
                        <span>{tSectors(sector.key)}</span>
                        <span className="rounded-full bg-white/85 px-2.5 py-1 text-[10px] text-[#263b68]">
                          {t("comingSoon")}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
            {items.map((item, index) => (
              <Link
                key={item.id}
                href={item.url}
                className="flex items-center border-b border-lime py-4 text-[1.15rem] font-medium tracking-[-0.025em]"
                onClick={close}
              >
                <span className="mr-4 font-mono text-[10px] text-cobalt">0{index + 2}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 gap-3 border-t border-lime bg-canvas px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
            <Link
              href="/recherche"
              className="grid size-11 place-items-center rounded-xl border border-lime"
              onClick={close}
              aria-label={t("search")}
            >
              <Search className="size-4" />
            </Link>
            <Link
              href="/rendez-vous"
              className="flex h-11 flex-1 items-center justify-center rounded-xl bg-gradient-to-br from-[#1a203d] to-[#4765b2] px-4 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(26,32,61,.2)]"
              onClick={close}
            >
              {t("bookAppointment")}
            </Link>
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      <div className="lg:hidden">
        <button
          type="button"
          className="grid size-10 place-items-center rounded-xl border border-lime text-ink transition hover:bg-[#f1f5fa]"
          onClick={() => setOpen(true)}
          aria-label={t("openMenu")}
          aria-expanded={open}
          aria-haspopup="dialog"
        >
          <Menu className="size-5" />
        </button>
      </div>
      {overlay}
    </>
  );
}

function MobileGroup({
  title,
  items,
  prefix,
  close,
}: {
  title: string;
  items: Array<{ id: string; title: string; slug: string }>;
  prefix: string;
  close: () => void;
}) {
  return (
    <section className="border-b border-white/15 py-4 last:border-0">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.15em] text-[#a9c5ff]">{title}</p>
      {items.map((item) => (
        <Link
          key={item.id}
          href={`${prefix}/${item.slug}`}
          className="flex items-center justify-between gap-3 py-2 text-sm text-white/80"
          onClick={close}
        >
          {item.title} <Plus className="size-3" />
        </Link>
      ))}
    </section>
  );
}
