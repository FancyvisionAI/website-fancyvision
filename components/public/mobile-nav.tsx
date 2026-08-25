"use client";

import { ChevronDown, Menu, Plus, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type {
  NavigationSector,
  NavigationService,
  NavigationTraining,
} from "@/components/public/header";
import { LocaleSwitcher } from "@/components/public/locale-switcher";
import { Link } from "@/i18n/navigation";

type OpenSection = "services" | "formations" | "sectors" | null;

export function MobileNav({
  services,
  trainings,
  sectors,
}: {
  services: NavigationService[];
  trainings: NavigationTraining[];
  sectors: NavigationSector[];
}) {
  const t = useTranslations("MobileNav");
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [openSection, setOpenSection] = useState<OpenSection>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => {
    setOpen(false);
    setOpenSection(null);
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

  const toggleSection = (section: Exclude<OpenSection, null>) =>
    setOpenSection((current) => (current === section ? null : section));

  const overlay = mounted && open
    ? createPortal(
        <div
          className="fixed inset-0 z-[200] flex h-[100dvh] w-screen flex-col overflow-hidden bg-canvas text-ink lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={t("navigationAriaLabel")}
        >
          <div className="flex h-[4.875rem] shrink-0 items-center justify-between border-b border-lime bg-canvas px-5 shadow-[0_8px_30px_rgba(26,32,61,.05)]">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-display text-xl font-semibold tracking-[-0.03em]"
              onClick={close}
            >
              <Image
                src="/images/sapiens-ia-logo.png"
                alt=""
                width={32}
                height={32}
                className="size-8 shrink-0"
              />
              Sapiens-IA
            </Link>
            <div className="flex items-center gap-3">
              <LocaleSwitcher />
              <button
                ref={closeButtonRef}
                className="grid size-10 place-items-center rounded-control border border-border bg-canvas transition hover:bg-lime"
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
              onClick={() => toggleSection("services")}
              aria-expanded={openSection === "services"}
            >
              {t("services")}
              <ChevronDown
                aria-hidden="true"
                className={`size-5 shrink-0 transition-transform duration-200 ${
                  openSection === "services" ? "rotate-180" : ""
                }`}
              />
            </button>
            {openSection === "services" && (
              <div className="my-2 rounded-card bg-accent px-5 text-white shadow-[0_12px_32px_rgba(10,17,32,.3)]">
                <MobileGroup
                  title={t("consulting")}
                  items={services.filter((item) => item.categorySlug === "conseil")}
                  prefix="/services"
                  close={close}
                />
                <MobileGroup
                  title={t("data")}
                  items={services.filter((item) => item.categorySlug === "data")}
                  prefix="/services"
                  close={close}
                />
              </div>
            )}

            <button
              type="button"
              className="flex w-full items-center justify-between border-b border-lime py-4 text-left text-[1.15rem] font-medium tracking-[-0.025em]"
              onClick={() => toggleSection("formations")}
              aria-expanded={openSection === "formations"}
            >
              {t("formations")}
              <ChevronDown
                aria-hidden="true"
                className={`size-5 shrink-0 transition-transform duration-200 ${
                  openSection === "formations" ? "rotate-180" : ""
                }`}
              />
            </button>
            {openSection === "formations" && (
              <div className="my-2 rounded-card bg-accent px-5 text-white shadow-[0_12px_32px_rgba(10,17,32,.3)]">
                <MobileGroup
                  title={t("corporateTraining")}
                  items={trainings.filter((item) => item.categorySlug === "entreprise")}
                  prefix="/formations"
                  close={close}
                />
                <MobileGroup
                  title={t("individualTraining")}
                  items={trainings.filter(
                    (item) => item.categorySlug === "particuliers",
                  )}
                  prefix="/formations"
                  close={close}
                />
              </div>
            )}

            <Link
              href="/solutions-ia"
              className="flex items-center border-b border-lime py-4 text-[1.15rem] font-medium tracking-[-0.025em]"
              onClick={close}
            >
              {t("solutionsAi")}
            </Link>

            <button
              type="button"
              className="flex w-full items-center justify-between border-b border-lime py-4 text-left text-[1.15rem] font-medium tracking-[-0.025em]"
              onClick={() => toggleSection("sectors")}
              aria-expanded={openSection === "sectors"}
            >
              {t("sectors")}
              <ChevronDown
                aria-hidden="true"
                className={`size-5 shrink-0 transition-transform duration-200 ${
                  openSection === "sectors" ? "rotate-180" : ""
                }`}
              />
            </button>
            {openSection === "sectors" && (
              <div className="my-2 rounded-card bg-gradient-to-br from-accent to-cobalt-strong p-5 text-white shadow-[0_12px_32px_rgba(10,17,32,.3)]">
                <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.15em] text-cobalt-strong">
                  {t("ourSectors")}
                </p>
                <div className="space-y-1">
                  {sectors.map((sector) => (
                    <Link
                      key={sector.id}
                      href={`/solutions-par-secteur/${sector.slug}`}
                      onClick={close}
                      className="block py-2.5 text-sm font-semibold"
                    >
                      {sector.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <Link
              href="/blog"
              className="flex items-center border-b border-lime py-4 text-[1.15rem] font-medium tracking-[-0.025em]"
              onClick={close}
            >
              {t("blog")}
            </Link>
            <Link
              href="/contact"
              className="flex items-center border-b border-lime py-4 text-[1.15rem] font-medium tracking-[-0.025em]"
              onClick={close}
            >
              {t("contact")}
            </Link>
          </nav>

          <div className="flex shrink-0 gap-3 border-t border-border bg-canvas px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
            <Link
              href="/recherche"
              className="grid size-11 place-items-center rounded-control border border-border"
              onClick={close}
              aria-label={t("search")}
            >
              <Search className="size-4" />
            </Link>
            <Link
              href="/rendez-vous"
              className="flex h-11 flex-1 items-center justify-center rounded-control bg-ink px-4 text-sm font-semibold text-canvas shadow-[0_1px_2px_rgba(16,27,51,.08)]"
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
          className="focus-visible:ring-cobalt focus-visible:ring-offset-canvas grid size-11 place-items-center rounded-control border border-border text-ink transition hover:bg-lime focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
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
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.15em] text-cobalt-strong">{title}</p>
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
