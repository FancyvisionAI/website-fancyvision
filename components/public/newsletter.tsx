"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

export function Newsletter() {
  const [pending, setPending] = useState(false);

  return (
    <section className="border-b border-white/15 bg-[#04071b] py-16 text-white md:py-20">
      <div className="container-shell grid items-end gap-10 md:grid-cols-[1.35fr_.65fr]">
        <div>
          <span className="eyebrow text-[#c3d5eb]">Newsletter</span>
          <h2 className="mt-5 max-w-4xl text-[clamp(2.5rem,4vw,3.5rem)] font-normal leading-[1.2]">
            La newsletter sur l’<span className="font-editorial">IA</span>, suivie par les décideurs.
          </h2>
        </div>
        <form
          className="space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setPending(true);
            const data = new FormData(event.currentTarget);
            const response = await fetch("/api/newsletter", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(Object.fromEntries(data)),
            });
            setPending(false);
            if (response.ok) {
              toast.success("Bienvenue dans la newsletter FancyVision.");
              event.currentTarget.reset();
            } else toast.error("Impossible de vous inscrire pour le moment.");
          }}
        >
          <div className="relative">
            <input
              name="email"
              type="email"
              required
              placeholder="votre@email.fr"
              className="h-14 w-full border border-white/25 bg-transparent px-5 pr-16 outline-none placeholder:text-white/40 focus:border-white"
            />
            <button
              disabled={pending}
              className="absolute right-1 top-1 grid size-12 place-items-center bg-white text-[#04071b] transition hover:bg-[#dfe7f4]"
              aria-label="S’inscrire"
            >
              <ArrowRight className="size-5" />
            </button>
          </div>
          <input name="website" className="hidden" tabIndex={-1} autoComplete="off" />
          <p className="text-xs leading-5 text-white/45">
            Un décryptage utile chaque semaine. Désinscription en un clic.
          </p>
        </form>
      </div>
    </section>
  );
}
