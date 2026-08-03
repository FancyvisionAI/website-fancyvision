import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/public/reveal";
import { Button } from "@/components/ui/button";

export function PageHero({
  eyebrow,
  title,
  description,
  cta,
}: {
  eyebrow?: string | null;
  title: string;
  description?: string | null;
  cta?: { label: string; href: string };
}) {
  return (
    <section className="reference-hero relative flex min-h-[56svh] items-center overflow-hidden pb-16 pt-28 text-white">
      <div className="container-shell relative z-10 w-full">
        <Reveal>
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1 className="mt-7 max-w-5xl text-[clamp(2.75rem,5vw,4rem)] font-normal leading-[1.2] tracking-[-0.025em]">{title}</h1>
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <div />
            <div>
              {description && <p className="max-w-2xl text-base leading-6 text-white/80">{description}</p>}
              {cta && (
                <Button asChild size="lg" className="mt-7">
                  <Link href={cta.href}>
                    {cta.label} <ArrowUpRight className="ml-3 size-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </Reveal>
      </div>
      <ArrowDown className="absolute bottom-10 left-8 size-5 animate-bounce text-white md:left-16" />
    </section>
  );
}
