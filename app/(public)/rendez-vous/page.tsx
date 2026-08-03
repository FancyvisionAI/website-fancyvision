import { CheckCircle2, Video } from "lucide-react";

import { AppointmentForm } from "@/components/public/appointment-form";

export default function AppointmentPage() {
  return (
    <section className="min-h-screen bg-[#f4f7fb] pb-20 pt-32">
      <div className="container-shell max-w-5xl">
        <div className="mb-8 grid gap-5 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
          <div>
            <span className="eyebrow text-[#303b64]">Rendez-vous</span>
            <h1 className="mt-4 text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.15] tracking-[-0.035em]">
              Parlons de votre projet.
            </h1>
          </div>
          <div className="grid gap-2 text-sm text-[#566174] sm:grid-cols-2">
            <span className="flex items-center gap-2">
              <Video className="size-4 text-[#597dc1]" /> Visioconférence · 30 minutes
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-[#597dc1]" /> Sans engagement
            </span>
          </div>
        </div>
        <AppointmentForm />
      </div>
    </section>
  );
}
