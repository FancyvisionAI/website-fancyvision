import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

import { Link } from "@/i18n/navigation";
import { contentRepository } from "@/lib/repositories/content";

export async function Footer({ locale }: { locale: string }) {
  // Locale reçue en prop, voir header.tsx pour la justification (ISR / Lot 2).
  const t = await getTranslations({ locale, namespace: "Footer" });
  const settings = await contentRepository.settings();
  const company = settings.find((item) => item.key === "company")?.value as
    | { email?: string; phone?: string; address?: string; linkedin?: string }
    | undefined;
  // Footer volontairement simplifié (Lot Design) : ne reproduit plus
  // l'arborescence complète du site (tous les Services/Formations) —
  // seulement une sélection de pages essentielles + les pages légales.
  const navigationLinks: Array<{ id: string; label: string; href: string }> = [
    { id: "about", label: t("about"), href: "/a-propos" },
    { id: "services", label: t("services"), href: "/services" },
    { id: "training", label: t("training"), href: "/formation" },
    { id: "blog", label: t("blog"), href: "/blog" },
    { id: "contact", label: t("contact"), href: "/contact" },
  ];
  const legalLinks: Array<{ id: string; label: string; href: string }> = [
    { id: "legal", label: t("legal"), href: "/mentions-legales" },
    { id: "privacy", label: t("privacyPolicy"), href: "/confidentialite" },
    { id: "terms", label: t("terms"), href: "/conditions" },
  ];

  return (
    <footer className="bg-accent text-white">
      <div className="container-shell py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr] md:gap-8">
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-2.5 text-2xl font-semibold tracking-[-0.04em]">
              <Image
                src="/images/sapiens-ia-logo.png"
                alt=""
                width={36}
                height={36}
                className="size-9 shrink-0"
              />
              Sapiens-IA
            </Link>
            <p className="mt-5 text-sm leading-6 text-white/55">{t("description")}</p>
            <div className="mt-7 space-y-2 text-xs leading-5 text-white/65">
              <p>{company?.address}</p>
              <a
                href={`tel:${company?.phone?.replace(/\s+/g, "")}`}
                className="block hover:text-white"
              >
                {company?.phone}
              </a>
              {/* Lien LinkedIn volontairement masqué : la valeur actuelle
                  de Setting.company.linkedin est un placeholder générique,
                  pas une page Sapiens IA confirmée. À réactiver dès qu'une
                  URL officielle est fournie. */}
            </div>
            <Link
              href="/rendez-vous?context=consultation"
              className="mt-7 inline-flex h-10 items-center gap-3 rounded-xl bg-white px-4 text-xs font-semibold text-accent transition hover:-translate-y-0.5 hover:bg-slate-100"
            >
              {t("talkToConsultant")} <ArrowUpRight className="size-3.5" />
            </Link>
          </div>

          <FooterColumn title={t("navigationHeading")} items={navigationLinks} />
          <FooterColumn title={t("legalHeading")} items={legalLinks} />
        </div>
        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-7 text-xs text-white/40 md:flex-row md:items-center md:justify-between">
          <p>{t("copyright", { year: new Date().getFullYear() })}</p>
          <p>{t("tagline")}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: Array<{ id: string; label: string; href: string }>;
}) {
  return (
    <section>
      <h2 className="mb-5 font-mono text-[10px] uppercase tracking-[0.15em] text-cobalt-strong">
        {title}
      </h2>
      <div className="space-y-3">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="block text-xs leading-5 text-white/65 transition hover:translate-x-0.5 hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
