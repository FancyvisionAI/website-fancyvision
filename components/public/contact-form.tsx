"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contactSchema } from "@/lib/validators";

type Values = z.infer<typeof contactSchema>;

export function ContactForm() {
  const t = useTranslations("ContactForm");
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Values>({
    resolver: zodResolver(contactSchema),
  });

  return (
    <form
      className="grid gap-5 rounded-[2rem] bg-canvas p-6 shadow-soft md:p-10"
      onSubmit={handleSubmit(async (values) => {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        if (!response.ok) return toast.error(t("error"));
        toast.success(t("success"));
        reset();
      })}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t("name")} error={errors.name?.message}><Input {...register("name")} placeholder={t("namePlaceholder")} /></Field>
        <Field label={t("email")} error={errors.email?.message}><Input {...register("email")} type="email" placeholder={t("emailPlaceholder")} /></Field>
        <Field label={t("phone")} error={errors.phone?.message}><Input {...register("phone")} placeholder={t("phonePlaceholder")} /></Field>
        <Field label={t("company")} error={errors.company?.message}><Input {...register("company")} placeholder={t("companyPlaceholder")} /></Field>
      </div>
      <Field label={t("subject")} error={errors.subject?.message}><Input {...register("subject")} placeholder={t("subjectPlaceholder")} /></Field>
      <Field label={t("message")} error={errors.message?.message}>
        <Textarea {...register("message")} placeholder={t("messagePlaceholder")} />
      </Field>
      <input {...register("website")} className="hidden" tabIndex={-1} autoComplete="off" />
      <Button size="lg" disabled={isSubmitting} className="w-fit">
        {isSubmitting ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
        {t("submit")} <ArrowRight className="ml-3 size-4" />
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
