import type { ReactNode } from "react";

import { ArrowUpRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { cardVariants } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function ContentCard({
  href,
  index,
  eyebrow,
  title,
  description,
  meta,
  visual,
  compact,
}: {
  href: string;
  index: number;
  eyebrow?: string | null;
  title: string;
  description: string;
  meta?: string | null;
  // Optionnel : rendu au-dessus du titre, sous la ligne index/eyebrow.
  // Non fourni par défaut, donc aucun changement pour les pages qui
  // utilisent déjà ContentCard (services, secteurs, études de cas...).
  visual?: ReactNode;
  // Optionnel : variante plus resserrée pour les grilles à 3 colonnes+
  // (ex. /services#data) où le format par défaut (min-h 390px) rend les
  // cartes disproportionnées. Défaut à false : aucun changement pour les
  // pages existantes qui n'utilisent pas cette prop.
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        cardVariants({ variant: "interactive", padding: "none" }),
        "group flex flex-col rounded-[2rem] duration-500 hover:bg-lime",
        compact ? "min-h-[260px] p-6 md:p-7" : "min-h-[390px] p-7 md:p-9",
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs tabular-nums text-ink/40">0{index + 1}</span>
          {eyebrow && <span className="ml-4 text-xs font-bold uppercase tracking-[0.12em]">{eyebrow}</span>}
        </div>
        <div className="flex items-center gap-2">
          <span className="grid size-11 place-items-center rounded-full border border-ink/20 transition group-hover:rotate-45 group-hover:bg-accent group-hover:text-white">
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
      {visual}
      <div className="mt-auto">
        {/* line-clamp-2 uniquement en variante compacte : les titres plus
            longs (ex. Agents IA, ~38 caractères en moyenne contre ~21 pour
            les Secteurs) débordaient sur 2-3 lignes et gonflaient la
            hauteur réelle de la carte au-delà du gabarit compact visé. */}
        <h2
          className={cn(
            "font-semibold tracking-[-0.05em]",
            compact ? "line-clamp-2 text-2xl md:text-3xl" : "text-3xl md:text-4xl",
          )}
        >
          {title}
        </h2>
        <p className="mt-5 line-clamp-3 leading-7 text-ink/55">{description}</p>
        {meta && <p className="mt-6 text-xs font-semibold uppercase tracking-[0.1em] text-ink/45">{meta}</p>}
      </div>
    </Link>
  );
}
