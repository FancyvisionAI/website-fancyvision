"use client";

import { Minus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import type {
  NavigationSector,
  NavigationService,
  NavigationTraining,
} from "@/components/public/header";
import { Link } from "@/i18n/navigation";

type Item = { id: string; label: string; url: string };
type OpenMenu = "services" | "sectors" | null;

export function DesktopNav({
  items,
  services,
  trainings,
  sectors,
}: {
  items: Item[];
  services: NavigationService[];
  trainings: NavigationTraining[];
  sectors: NavigationSector[];
}) {
  const t = useTranslations("DesktopNav");
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeFromOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpenMenu(null);
    };
    const closeFromKeyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(null);
    };
    document.addEventListener("mousedown", closeFromOutside);
    document.addEventListener("keydown", closeFromKeyboard);
    return () => {
      document.removeEventListener("mousedown", closeFromOutside);
      document.removeEventListener("keydown", closeFromKeyboard);
    };
  }, []);

  const consulting = services.filter((item) => item.categorySlug === "conseil");
  const data = services.filter((item) => item.categorySlug === "data");
  const corporate = trainings.filter((item) => item.categorySlug === "entreprise");
  const privateTrainings = trainings.filter(
    (item) => item.categorySlug === "particuliers",
  );
  const sectorColumnSize = Math.ceil(sectors.length / 3);

  return (
    <div ref={rootRef} className="hidden lg:block">
      <nav className="flex items-center justify-center gap-6 xl:gap-8">
        <MenuButton
          label={t("services")}
          open={openMenu === "services"}
          onClick={() =>
            setOpenMenu((current) => (current === "services" ? null : "services"))
          }
        />
        <Link
          href="/#solutions-ia"
          className="py-7 text-sm font-medium transition hover:text-cobalt"
          onClick={() => setOpenMenu(null)}
        >
          {t("solutionsAi")}
        </Link>
        <MenuButton
          label={t("sectors")}
          open={openMenu === "sectors"}
          onClick={() =>
            setOpenMenu((current) => (current === "sectors" ? null : "sectors"))
          }
        />
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.url}
            className="py-7 text-sm font-medium transition hover:text-cobalt"
            onClick={() => setOpenMenu(null)}
          >
            {item.label}
          </Link>
        ))}
        <Link
          href="/blog"
          className="py-7 text-sm font-medium transition hover:text-cobalt"
          onClick={() => setOpenMenu(null)}
        >
          {t("blog")}
        </Link>
        <Link
          href="/contact"
          className="py-7 text-sm font-medium transition hover:text-cobalt"
          onClick={() => setOpenMenu(null)}
        >
          {t("contact")}
        </Link>
      </nav>

      {openMenu === "services" && (
        <div className="absolute inset-x-0 top-full border-t border-white/10 bg-accent text-white shadow-[0_12px_32px_rgba(10,17,32,.35)]">
          <div className="container-shell grid grid-cols-4 border-l border-white/15">
            <CompactColumn title={t("consulting")} items={consulting} prefix="/services" />
            <CompactColumn title={t("data")} items={data} prefix="/services" />
            <CompactColumn
              title={t("corporateTraining")}
              items={corporate}
              prefix="/formations"
              footer={{ label: t("allCorporateTrainings"), href: "/formations" }}
            />
            <CompactColumn
              title={t("individualTraining")}
              items={privateTrainings}
              prefix="/formations"
              footer={{ label: t("allIndividualTrainings"), href: "/formations" }}
            />
          </div>
        </div>
      )}

      {openMenu === "sectors" && (
        <div className="absolute inset-x-0 top-full border-t border-white/10 bg-gradient-to-br from-accent via-[#101b33] to-cobalt-strong text-white shadow-[0_12px_32px_rgba(10,17,32,.35)]">
          <div className="container-shell grid min-h-[20rem] grid-cols-3 border-l border-white/15">
            <SectorColumn
              title={t("ourSectors")}
              items={sectors.slice(0, sectorColumnSize)}
            />
            <SectorColumn
              items={sectors.slice(sectorColumnSize, sectorColumnSize * 2)}
            />
            <SectorColumn items={sectors.slice(sectorColumnSize * 2)} />
          </div>
        </div>
      )}
    </div>
  );
}

function MenuButton({
  label,
  open,
  onClick,
}: {
  label: string;
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="flex items-center gap-2 py-7 text-sm font-medium transition hover:text-cobalt"
      onClick={onClick}
      aria-expanded={open}
    >
      {label}
      {open ? <Minus className="size-3.5" /> : <Plus className="size-3.5" />}
    </button>
  );
}

function CompactColumn({
  title,
  items,
  prefix,
  footer,
}: {
  title: string;
  items: Array<{ id: string; title: string; slug: string }>;
  prefix: string;
  footer?: { label: string; href: string };
}) {
  return (
    <section className="min-h-[19rem] border-r border-white/15 px-7 py-8">
      <h2 className="mb-5 font-mono text-[11px] uppercase tracking-[0.12em] text-cobalt-strong">
        {title}
      </h2>
      <div className="space-y-0.5">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`${prefix}/${item.slug}`}
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
}: {
  title?: string;
  items: NavigationSector[];
}) {
  return (
    <section className="border-r border-white/15 px-8 py-10">
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
            className="block w-fit text-base font-semibold transition hover:translate-x-1 hover:text-cobalt-strong"
          >
            {sector.title}
          </Link>
        ))}
      </div>
    </section>
  );
}
