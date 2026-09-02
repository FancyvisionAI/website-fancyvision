"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

/**
 * Formulaire de demande pour une formation du catalogue "Autres thèmes de
 * formations pertinents". Réutilise l'infrastructure d'envoi déjà en place
 * pour le formulaire de rendez-vous (`/api/appointments`, `appointmentSchema`,
 * notification e-mail à l'équipe) plutôt qu'un nouveau canal : seuls
 * quelques champs optionnels (training/role/participants/needs) ont été
 * ajoutés au schéma existant pour porter ces informations, cf.
 * lib/validators.ts et app/api/appointments/route.ts.
 *
 * `training` contrôle l'ouverture : non nul = dialogue ouvert pour cette
 * formation précise, récupérée automatiquement (aucune re-sélection requise
 * par l'utilisateur).
 */
export function TrainingRequestDialog({
  training,
  onOpenChange,
}: {
  training: string | null;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("TrainingRequestForm");
  const [pending, setPending] = useState(false);

  return (
    <Dialog
      open={Boolean(training)}
      onOpenChange={(open) => {
        if (!pending) onOpenChange(open);
      }}
    >
      <DialogContent>
        <DialogTitle>{t("title")}</DialogTitle>
        <DialogDescription>{t("description")}</DialogDescription>

        <div className="mt-5 rounded-2xl bg-white/10 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-white/50">
            {t("selectedTraining")}
          </p>
          <p className="mt-1 font-medium">{training}</p>
        </div>

        <form
          className="mt-6 space-y-4"
          onSubmit={async (submitEvent) => {
            submitEvent.preventDefault();
            setPending(true);
            const form = submitEvent.currentTarget;
            const values = Object.fromEntries(new FormData(form));
            const response = await fetch("/api/appointments", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...values,
                training,
                topic: `Formation catalogue : ${training}`,
              }),
            });
            setPending(false);
            if (!response.ok) {
              toast.error(t("error"));
              return;
            }
            toast.success(t("success"));
            form.reset();
            onOpenChange(false);
          }}
        >
          <Field label={t("name")} required>
            <Input name="name" required minLength={2} className="h-11 bg-canvas/95" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t("company")}>
              <Input name="company" className="h-11 bg-canvas/95" />
            </Field>
            <Field label={t("role")}>
              <Input name="role" className="h-11 bg-canvas/95" />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t("email")} required>
              <Input
                name="email"
                type="email"
                required
                className="h-11 bg-canvas/95"
              />
            </Field>
            <Field label={t("phone")}>
              <Input name="phone" type="tel" className="h-11 bg-canvas/95" />
            </Field>
          </div>
          <Field label={t("participants")}>
            <Input name="participants" className="h-11 bg-canvas/95" />
          </Field>
          <Field label={t("needs")}>
            <Textarea name="needs" rows={3} className="min-h-0 bg-canvas/95" />
          </Field>
          <Field label={t("message")}>
            <Textarea name="message" rows={2} className="min-h-0 bg-canvas/95" />
          </Field>
          <input name="website" className="hidden" tabIndex={-1} autoComplete="off" />

          <Button
            variant="accent"
            size="lg"
            className="w-full"
            disabled={pending}
          >
            {pending && <Loader2 className="mr-2 size-4 animate-spin" />}
            {t("submit")} <ArrowRight className="ml-3 size-4" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5 text-xs font-semibold text-white/80">
      {required ? `${label} *` : label}
      {children}
    </label>
  );
}
