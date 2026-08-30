"use client";

import { ChevronDown, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

import type {
  NavigationSector,
  NavigationService,
  NavigationTraining,
} from "@/components/public/header";
import { Link } from "@/i18n/navigation";

type OpenMenu = "services" | "formations" | "sectors" | null;

// Délai de grâce avant fermeture au survol : évite qu'un mouvement de
// souris rapide entre le déclencheur et le panneau (ou un léger
// dépassement du panneau) ne ferme le menu par erreur.
const CLOSE_DELAY = 150;

export function DesktopNav({
  services,
  trainings,
  sectors,
}: {
  services: NavigationService[];
  trainings: NavigationTraining[];
  sectors: NavigationSector[];
}) {
  const t = useTranslations("DesktopNav");
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimeoutRef.current = setTimeout(() => setOpenMenu(null), CLOSE_DELAY);
  }, [cancelClose]);

  const openOnHover = useCallback(
    (menu: Exclude<OpenMenu, null>) => {
      cancelClose();
      setOpenMenu(menu);
    },
    [cancelClose],
  );

  const closeNow = useCallback(() => {
    cancelClose();
    setOpenMenu(null);
  }, [cancelClose]);

  useEffect(() => {
    const closeFromOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) closeNow();
    };
    const closeFromKeyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeNow();
    };
    document.addEventListener("mousedown", closeFromOutside);
    document.addEventListener("keydown", closeFromKeyboard);
    return () => {
      document.removeEventListener("mousedown", closeFromOutside);
      document.removeEventListener("keydown", closeFromKeyboard);
    };
  }, [closeNow]);

  // Nettoyage du timer de fermeture en attente si le composant démonte
  // pendant le délai de grâce.
  useEffect(() => () => cancelClose(), [cancelClose]);

  const consulting = services.filter((item) => item.categorySlug === "conseil");
  const data = services.filter((item) => item.categorySlug === "data");
  const corporate = trainings.filter((item) => item.categorySlug === "entreprise");
  const privateTrainings = trainings.filter(
    (item) => item.categorySlug === "particuliers",
  );
  const sectorColumnSize = Math.ceil(sectors.length / 3);

  return (
    <div
      ref={rootRef}
      className="hidden lg:block"
      onMouseLeave={scheduleClose}
    >
      <nav className="flex items-center justify-center gap-6 xl:gap-8">
        <MenuButton
          label={t("services")}
          open={openMenu === "services"}
          onMouseEnter={() => openOnHover("services")}
          onClick={() =>
            setOpenMenu((current) => (current === "services" ? null : "services"))
          }
        />
        <MenuButton
          label={t("formations")}
          open={openMenu === "formations"}
          onMouseEnter={() => openOnHover("formations")}
          onClick={() =>
            setOpenMenu((current) =>
              current === "formations" ? null : "formations",
            )
          }
        />
        <Link
          href="/solutions-ia"
          className="py-7 text-sm font-medium transition hover:text-cobalt"
          onMouseEnter={closeNow}
          onClick={closeNow}
        >
          {t("solutionsAi")}
        </Link>
        <MenuButton
          label={t("sectors")}
          open={openMenu === "sectors"}
          onMouseEnter={() => openOnHover("sectors")}
          onClick={() =>
            setOpenMenu((current) => (current === "sectors" ? null : "sectors"))
          }
        />
        <Link
          href="/blog"
          className="py-7 text-sm font-medium transition hover:text-cobalt"
          onMouseEnter={closeNow}
          onClick={closeNow}
        >
          {t("blog")}
        </Link>
        <Link
          href="/contact"
          className="py-7 text-sm font-medium transition hover:text-cobalt"
          onMouseEnter={closeNow}
          onClick={closeNow}
        >
          {t("contact")}
        </Link>
      </nav>

      {openMenu === "services" && (
        <div
          className="absolute left-1/2 top-full z-10 mt-3 w-[42rem] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-6.5rem)] -translate-x-1/2 overflow-y-auto overflow-x-hidden rounded-card border border-white/10 bg-accent text-white shadow-[0_20px_45px_rgba(10,17,32,.35)]"
          onMouseEnter={cancelClose}
        >
          <div className="grid grid-cols-2 divide-x divide-white/15">
            <CompactColumn
              title={t("consulting")}
              titleHref="/services#conseil"
              items={consulting}
              prefix="/services"
              onNavigate={closeNow}
            />
            <CompactColumn
              title={t("data")}
              titleHref="/services#data"
              items={data}
              prefix="/services"
              onNavigate={closeNow}
            />
          </div>
        </div>
      )}

      {openMenu === "formations" && (
        <div
          className="absolute left-1/2 top-full z-10 mt-3 w-[42rem] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-6.5rem)] -translate-x-1/2 overflow-y-auto overflow-x-hidden rounded-card border border-white/10 bg-accent text-white shadow-[0_20px_45px_rgba(10,17,32,.35)]"
          onMouseEnter={cancelClose}
        >
          <div className="grid grid-cols-2 divide-x divide-white/15">
            <CompactColumn
              title={t("corporateTraining")}
              items={corporate}
              prefix="/formations"
              footer={{
                label: t("allCorporateTrainings"),
                href: "/formations/autres-themes?cible=cible-1",
              }}
              onNavigate={closeNow}
            />
            <CompactColumn
              title={t("individualTraining")}
              items={privateTrainings}
              prefix="/formations"
              footer={{
                label: t("allIndividualTrainings"),
                href: "/formations/autres-themes?cible=cible-2",
              }}
              onNavigate={closeNow}
            />
          </div>
        </div>
      )}

      {openMenu === "sectors" && (
        <div
          className="absolute left-1/2 top-full z-10 mt-3 w-[56rem] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-6.5rem)] -translate-x-1/2 overflow-y-auto overflow-x-hidden rounded-card border border-white/10 bg-gradient-to-br from-accent via-[#101b33] to-cobalt-strong text-white shadow-[0_20px_45px_rgba(10,17,32,.35)]"
          onMouseEnter={cancelClose}
        >
          <div className="grid grid-cols-3 divide-x divide-white/15">
            <SectorColumn
              title={t("ourSectors")}
              items={sectors.slice(0, sectorColumnSize)}
              onNavigate={closeNow}
            />
            <SectorColumn
              items={sectors.slice(sectorColumnSize, sectorColumnSize * 2)}
              onNavigate={closeNow}
            />
            <SectorColumn
              items={sectors.slice(sectorColumnSize * 2)}
              onNavigate={closeNow}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function MenuButton({
  label,
  open,
  onMouseEnter,
  onClick,
}: {
  label: string;
  open: boolean;
  onMouseEnter: () => void;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="flex items-center gap-1.5 py-7 text-sm font-medium transition hover:text-cobalt"
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      aria-expanded={open}
    >
      {label}
      <ChevronDown
        aria-hidden="true"
        className={`size-3.5 shrink-0 transition-transform duration-200 ${
          open ? "rotate-180" : ""
        }`}
      />
    </button>
  );
}

function CompactColumn({
  title,
  titleHref,
  items,
  prefix,
  footer,
  onNavigate,
}: {
  title: string;
  titleHref?: string;
  items: Array<{ id: string; title: string; slug: string }>;
  prefix: string;
  footer?: { label: string; href: string };
  onNavigate: () => void;
}) {
  return (
    <section className="px-7 py-8">
      <h2 className="mb-5 font-mono text-[11px] uppercase tracking-[0.12em] text-cobalt-strong">
        {titleHref ? (
          <Link
            href={titleHref}
            onClick={onNavigate}
            className="transition hover:text-white"
          >
            {title}
          </Link>
        ) : (
          title
        )}
      </h2>
      <div className="space-y-0.5">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`${prefix}/${item.slug}`}
            onClick={onNavigate}
            className="group flex items-center justify-between gap-4 py-2.5 text-[15px] font-medium text-white/90 transition hover:translate-x-1 hover:text-white"
          >
            {item.title}
            <Plus className="size-3.5 shrink-0 text-white/40 transition group-hover:rotate-90 group-hover:text-white" />
          </Link>
        ))}
      </div>
      {footer && (
        <Link
          href={footer.href}
          onClick={onNavigate}
          className="mt-4 inline-block text-sm font-semibold text-white transition hover:text-cobalt-strong"
        >
          {footer.label}
        </Link>
      )}
    </section>
  );
}

function SectorColumn({
  title,
  items,
  onNavigate,
}: {
  title?: string;
  items: NavigationSector[];
  onNavigate: () => void;
}) {
  return (
    <section className="px-8 py-10">
      {title && (
        <h2 className="mb-6 font-mono text-xs uppercase tracking-[0.1em] text-cobalt-strong">
          {title}
        </h2>
      )}
      <div className={title ? "space-y-5" : "space-y-6 pt-8"}>
        {items.map((sector) => (
          <Link
            key={sector.id}
            href={`/solutions-par-secteur/${sector.slug}`}
            onClick={onNavigate}
            className="block w-fit text-base font-semibold transition hover:translate-x-1 hover:text-cobalt-strong"
          >
            {sector.title}
          </Link>
        ))}
      </div>
    </section>
  );
}
