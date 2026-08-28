"use client";

import { useEffect, useState } from "react";

// Wrapper visuel uniquement : gère l'état "scrolled" du header (hauteur,
// ombre, flou de fond) via un simple listener de scroll. Ne touche à
// aucune logique de navigation, de route ni de mega-menu — ceux-ci
// restent entièrement dans header.tsx (Server Component), passés ici en
// children.
export function HeaderShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b text-ink transition-[height,box-shadow,background-color,border-color] duration-300 ${
        scrolled
          ? "border-border bg-canvas/90 shadow-[0_10px_30px_rgba(16,27,51,.09)] backdrop-blur-md"
          : "border-border bg-canvas shadow-[0_1px_2px_rgba(16,27,51,.05)]"
      }`}
    >
      <div
        className={`container-shell flex items-center justify-between gap-5 transition-[height] duration-300 ${
          scrolled ? "h-[4.125rem]" : "h-[4.875rem]"
        }`}
      >
        {children}
      </div>
    </header>
  );
}
