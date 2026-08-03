"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export function CookieBanner({ text }: { text: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(!localStorage.getItem("fancyvision-cookie-choice"));
  }, []);
  if (!visible) return null;
  const choose = (value: "essential" | "all") => {
    localStorage.setItem("fancyvision-cookie-choice", value);
    setVisible(false);
  };
  return (
    <aside className="fixed bottom-4 left-4 right-4 z-[90] mx-auto max-w-3xl rounded-3xl border border-white/10 bg-ink p-5 text-white shadow-soft md:flex md:items-center md:gap-6">
      <p className="flex-1 text-sm leading-6 text-white/70">
        {text} <Link href="/confidentialite" className="text-lime underline">En savoir plus</Link>
      </p>
      <div className="mt-4 flex gap-2 md:mt-0">
        <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 hover:text-white" onClick={() => choose("essential")}>
          Essentiels
        </Button>
        <Button size="sm" variant="accent" onClick={() => choose("all")}>Tout accepter</Button>
      </div>
    </aside>
  );
}
