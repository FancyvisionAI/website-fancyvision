"use client";

import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type {
  NavigationService,
  NavigationTraining,
} from "@/components/public/header";
import { sectors } from "@/lib/content/sectors";

type Item = { id: string; label: string; url: string };
type OpenMenu = "services" | "sectors" | null;

export function DesktopNav({
  items,
  services,
  trainings,
}: {
  items: Item[];
  services: NavigationService[];
  trainings: NavigationTraining[];
}) {
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

  return (
    <div ref={rootRef} className="hidden lg:block">
      <nav className="flex items-center justify-center gap-6 xl:gap-8">
        <MenuButton
          label="Nos services"
          open={openMenu === "services"}
          onClick={() =>
            setOpenMenu((current) => (current === "services" ? null : "services"))
          }
        />
        <MenuButton
          label="Secteurs"
          open={openMenu === "sectors"}
          onClick={() =>
            setOpenMenu((current) => (current === "sectors" ? null : "sectors"))
          }
        />
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.url}
            className="py-7 text-sm font-medium transition hover:text-[#4765b2]"
            onClick={() => setOpenMenu(null)}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {openMenu === "services" && (
        <div className="absolute inset-x-0 top-full border-t border-white/10 bg-[#11162d] text-white shadow-[0_24px_65px_rgba(4,7,27,.28)]">
          <div className="container-shell grid grid-cols-4 border-l border-white/15">
            <CompactColumn title="Conseil" items={consulting} prefix="/services" />
            <CompactColumn title="Data" items={data} prefix="/services" />
            <CompactColumn
              title="Formation en entreprise"
              items={corporate}
              prefix="/formations"
              footer={{ label: "Toutes nos formations en entreprise", href: "/formations" }}
            />
            <CompactColumn
              title="Formations pour particuliers"
              items={privateTrainings}
              prefix="/formations"
              footer={{ label: "Toutes nos formations pour particuliers", href: "/formations" }}
            />
          </div>
        </div>
      )}

      {openMenu === "sectors" && (
        <div className="absolute inset-x-0 top-full border-t border-white/10 bg-gradient-to-br from-[#071027] via-[#101b3b] to-[#263b68] text-white shadow-[0_24px_65px_rgba(4,7,27,.28)]">
          <div className="container-shell grid min-h-[20rem] grid-cols-3 border-l border-white/15">
            <SectorColumn title="Nos secteurs d’expertise" items={sectors.slice(0, 3)} />
            <SectorColumn items={sectors.slice(3, 6)} />
            <SectorColumn items={sectors.slice(6)} />
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
      className="flex items-center gap-2 py-7 text-sm font-medium transition hover:text-[#4765b2]"
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
      <h2 className="mb-5 font-mono text-[11px] uppercase tracking-[0.12em] text-[#a9c5ff]">
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
          className="mt-4 inline-block text-sm font-semibold text-white transition hover:text-[#a9c5ff]"
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
  items: ReadonlyArray<
    | { readonly name: string; readonly href: string; readonly available: true }
    | { readonly name: string; readonly available: false }
  >;
}) {
  return (
    <section className="border-r border-white/15 px-8 py-10">
      {title && (
        <h2 className="mb-6 font-mono text-xs uppercase tracking-[0.1em] text-[#b8c9e8]">
          {title}
        </h2>
      )}
      <div className={title ? "space-y-5" : "space-y-6 pt-8"}>
        {items.map((sector) =>
          sector.available ? (
            <Link
              key={sector.name}
              href={sector.href}
              className="block w-fit text-base font-semibold transition hover:translate-x-1 hover:text-[#a9c5ff]"
            >
              {sector.name}
            </Link>
          ) : (
            <div key={sector.name} className="flex flex-wrap items-center gap-3 text-base text-white/70">
              <span>{sector.name}</span>
              <span className="rounded-full bg-white/85 px-3 py-1 text-[11px] font-medium text-[#263b68]">
                Coming soon
              </span>
            </div>
          ),
        )}
      </div>
    </section>
  );
}
