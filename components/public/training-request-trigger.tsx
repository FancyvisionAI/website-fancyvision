"use client";

import { useState } from "react";
import type { ComponentProps, ReactNode } from "react";

import { TrainingRequestDialog } from "@/components/public/training-request-dialog";
import { Button } from "@/components/ui/button";

/**
 * Bouton client réutilisable qui ouvre TrainingRequestDialog pour une
 * formation donnée. Isole le seul bout d'interactivité nécessaire pour les
 * pages Server Component (ex. formations/[slug]/page.tsx) : pas besoin de
 * transformer toute la page en composant client pour ce seul CTA — même
 * dialogue, même backend (/api/appointments) que le catalogue.
 */
export function TrainingRequestTrigger({
  training,
  label,
  icon,
  variant,
  size,
  className,
}: {
  training: string;
  label: string;
  icon?: ReactNode;
  variant?: ComponentProps<typeof Button>["variant"];
  size?: ComponentProps<typeof Button>["size"];
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size}
        className={className}
        onClick={() => setOpen(true)}
      >
        {icon}
        {label}
      </Button>
      <TrainingRequestDialog training={open ? training : null} onOpenChange={setOpen} />
    </>
  );
}
