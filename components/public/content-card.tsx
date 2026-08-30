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
}) {
  return (
    <Link
      href={href}
      className={cn(
        cardVariants({ variant: "interactive", padding: "none" }),
        "group flex min-h-[390px] flex-col rounded-[2rem] p-7 duration-500 hover:bg-lime md:p-9",
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs tabular-nums text-ink/40">0{index + 1}</span>
          {eyebrow && <span className="ml-4 text-xs font-bold uppercase tracking-[0.12em]">{eyebrow}</span>}
        </div>
        <span className="grid size-11 place-items-center rounded-full border border-ink/20 transition group-hover:rotate-45 group-hover:bg-accent group-hover:text-white">
          <ArrowUpRight className="size-4" />
        </span>
      </div>
      {visual}
      <div className="mt-auto">
        <h2 className="text-3xl font-semibold tracking-[-0.05em] md:text-4xl">{title}</h2>
        <p className="mt-5 line-clamp-3 leading-7 text-ink/55">{description}</p>
        {meta && <p className="mt-6 text-xs font-semibold uppercase tracking-[0.1em] text-ink/45">{meta}</p>}
      </div>
    </Link>
  );
}
