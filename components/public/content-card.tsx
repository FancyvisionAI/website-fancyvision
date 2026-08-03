import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function ContentCard({
  href,
  index,
  eyebrow,
  title,
  description,
  meta,
}: {
  href: string;
  index: number;
  eyebrow?: string | null;
  title: string;
  description: string;
  meta?: string | null;
}) {
  return (
    <Link
      href={href}
      className="group flex min-h-[390px] flex-col rounded-[2rem] border border-black/15 bg-white p-7 transition duration-500 hover:-translate-y-1 hover:bg-lime hover:shadow-soft md:p-9"
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs tabular-nums text-black/40">0{index + 1}</span>
          {eyebrow && <span className="ml-4 text-xs font-bold uppercase tracking-[0.12em]">{eyebrow}</span>}
        </div>
        <span className="grid size-11 place-items-center rounded-full border border-black/20 transition group-hover:rotate-45 group-hover:bg-ink group-hover:text-white">
          <ArrowUpRight className="size-4" />
        </span>
      </div>
      <div className="mt-auto">
        <h2 className="text-3xl font-semibold tracking-[-0.05em] md:text-4xl">{title}</h2>
        <p className="mt-5 line-clamp-3 leading-7 text-black/55">{description}</p>
        {meta && <p className="mt-6 text-xs font-semibold uppercase tracking-[0.1em] text-black/45">{meta}</p>}
      </div>
    </Link>
  );
}
