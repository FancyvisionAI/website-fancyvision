import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Alternative aux grilles à bordures systématiques (border-l/border-t +
// cellules border-b/border-r) utilisées historiquement dans
// home-sections.tsx/footer.tsx : un composant partagé, à base d'ombres
// douces et de coins arrondis plutôt que de bordures visibles partout.
// Utilisé progressivement là où il apporte une réelle amélioration —
// ne remplace pas systématiquement les grilles existantes.
const cardVariants = cva("rounded-card bg-canvas transition-all duration-300", {
  variants: {
    variant: {
      simple: "shadow-soft",
      floating: "shadow-card hover:-translate-y-1 hover:shadow-soft",
      interactive:
        "glow-cobalt shadow-soft hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(16,27,51,.12)]",
      featured:
        "bg-accent text-white shadow-[0_20px_55px_rgba(10,17,32,.35)] hover:-translate-y-1",
    },
    padding: {
      none: "",
      sm: "p-5",
      default: "p-7",
      lg: "p-9",
    },
  },
  defaultVariants: { variant: "simple", padding: "default" },
});

export interface CardProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding, className }))}
      {...props}
    />
  ),
);
Card.displayName = "Card";

export { Card, cardVariants };
