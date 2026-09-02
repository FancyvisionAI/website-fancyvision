"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { groups } from "@/components/admin/sidebar";

// Tiroir de navigation admin sur mobile/tablette : le bouton hamburger de
// app/admin/layout.tsx n'avait aucun gestionnaire (Sidebar est `hidden
// lg:block`, donc la navigation admin était totalement inaccessible sous le
// breakpoint desktop). Repris à l'identique du patron déjà utilisé par le
// site public (components/public/mobile-nav.tsx) : état local, portail vers
// document.body, fermeture au clavier (Échap) et verrouillage du scroll.
export function AdminMobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setOpen(false), []);

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

  const overlay =
    mounted && open
      ? createPortal(
          <div
            className="fixed inset-0 z-[200] flex h-[100dvh] w-screen flex-col overflow-y-auto bg-accent p-5 text-white lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation admin"
          >
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="inline-flex p-3 text-2xl font-black tracking-[-0.06em]"
                onClick={close}
              >
                Sapiens-IA<span className="text-white">.</span>
              </Link>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={close}
                aria-label="Fermer le menu"
                className="grid size-10 place-items-center rounded-full border border-white/20"
              >
                <X className="size-4" />
              </button>
            </div>
            <nav className="mt-8 space-y-8 overflow-y-auto">
              {groups.map((group) => (
                <div key={group.label}>
                  <p className="px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white/30">
                    {group.label}
                  </p>
                  <div className="mt-3 space-y-1">
                    {group.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={close}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/65 transition hover:bg-white/10 hover:text-white"
                      >
                        <item.icon className="size-4" />
                        <span className="flex-1">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="grid size-10 place-items-center rounded-full border border-border lg:hidden"
        aria-label="Ouvrir le menu de navigation"
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <Menu className="size-4" />
      </button>
      {overlay}
    </>
  );
}
