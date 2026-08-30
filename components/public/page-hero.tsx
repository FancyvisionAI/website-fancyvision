import { ArrowDown, ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/public/reveal";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

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
    <section className="reference-hero relative flex min-h-[42svh] items-center overflow-hidden pb-14 pt-20 text-white">
      <div className="container-shell relative z-10 w-full">
        <Reveal>
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1 className="mt-5 max-w-3xl text-[clamp(2.75rem,5vw,4rem)] font-normal leading-[1.2] tracking-[-0.025em]">{title}</h1>
          <div className="mt-6 max-w-2xl">
            {description && <p className="text-base leading-6 text-white/80">{description}</p>}
            {cta && (
              <Button asChild size="lg" className="mt-7">
                <Link href={cta.href}>
                  {cta.label} <ArrowUpRight className="ml-3 size-4" />
                </Link>
              </Button>
            )}
          </div>
        </Reveal>
      </div>
      <ArrowDown className="absolute bottom-6 left-8 size-5 animate-bounce text-white md:left-16" />
    </section>
  );
}
