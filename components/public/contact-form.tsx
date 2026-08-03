"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contactSchema } from "@/lib/validators";

type Values = z.infer<typeof contactSchema>;

export function ContactForm() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Values>({
    resolver: zodResolver(contactSchema),
  });

  return (
    <form
      className="grid gap-5 rounded-[2rem] bg-white p-6 shadow-soft md:p-10"
      onSubmit={handleSubmit(async (values) => {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        if (!response.ok) return toast.error("Votre message n’a pas pu être envoyé.");
        toast.success("Merci. Notre équipe vous répond sous un jour ouvré.");
        reset();
      })}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nom" error={errors.name?.message}><Input {...register("name")} placeholder="Marie Dupont" /></Field>
        <Field label="Email" error={errors.email?.message}><Input {...register("email")} type="email" placeholder="marie@entreprise.fr" /></Field>
        <Field label="Téléphone" error={errors.phone?.message}><Input {...register("phone")} placeholder="+33 6…" /></Field>
        <Field label="Entreprise" error={errors.company?.message}><Input {...register("company")} placeholder="Votre organisation" /></Field>
      </div>
      <Field label="Objet" error={errors.subject?.message}><Input {...register("subject")} placeholder="Audit, formation, développement…" /></Field>
      <Field label="Votre message" error={errors.message?.message}>
        <Textarea {...register("message")} placeholder="Parlez-nous de vos enjeux, de vos équipes et de vos objectifs…" />
      </Field>
      <input {...register("website")} className="hidden" tabIndex={-1} autoComplete="off" />
      <Button size="lg" disabled={isSubmitting} className="w-fit">
        {isSubmitting ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
        Envoyer le message <ArrowRight className="ml-3 size-4" />
      </Button>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      {label}
      {children}
      {error && <span className="text-xs font-normal text-red-600">{error}</span>}
    </label>
  );
}
