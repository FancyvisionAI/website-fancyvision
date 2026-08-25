import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

import { Link } from "@/i18n/navigation";
import { contentRepository } from "@/lib/repositories/content";

export async function Footer({ locale }: { locale: string }) {
  // Locale reçue en prop, voir header.tsx pour la justification (ISR / Lot 2).
  const t = await getTranslations({ locale, namespace: "Footer" });
  const [settings, services, trainings] = await Promise.all([
    contentRepository.settings(),
    contentRepository.services(false, locale),
    contentRepository.trainings(locale),
  ]);
  const company = settings.find((item) => item.key === "company")?.value as
    | { email?: string; phone?: string; address?: string; linkedin?: string }
    | undefined;
  const consulting = services.filter((item) => item.category?.slug === "conseil");
  const data = services.filter((item) => item.category?.slug === "data");
  const corporate = trainings.filter(
    (item) => item.category?.slug === "entreprise",
  );
  const privateTrainings = trainings.filter(
    (item) => item.category?.slug === "particuliers",
  );
  // Liens structurels de la nouvelle architecture Sapiens IA, à l'image du
  // header (desktop-nav.tsx) : gérés directement dans le code plutôt que
  // via le menu CMS "FOOTER", qui reste réservé aux pages éditoriales
  // (mentions légales, etc.).
  const discoverLinks: Array<{ id: string; label: string; href: string }> = [
    { id: "solutions-ia", label: t("solutionsAi"), href: "/solutions-ia" },
    { id: "secteurs", label: t("sectors"), href: "/solutions-par-secteur" },
    { id: "blog", label: t("blog"), href: "/blog" },
    { id: "faq", label: t("faq"), href: "/faq" },
    { id: "contact", label: t("contact"), href: "/contact" },
    { id: "mentions-legales", label: t("legal"), href: "/mentions-legales" },
  ];

  return (
    <footer className="bg-accent text-white">
      <div className="container-shell py-14 md:py-16">
        <div className="grid border-l border-t border-white/15 md:grid-cols-2 xl:grid-cols-[1.2fr_repeat(4,1fr)]">
          <div className="border-b border-r border-white/15 p-7">
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
            <p className="mt-5 max-w-xs text-sm leading-6 text-white/55">
              {t("description")}
            </p>
            <div className="mt-7 space-y-2 text-xs leading-5 text-white/65">
              <p>{company?.address}</p>
              <a href={`tel:${company?.phone}`} className="block hover:text-white">
                {company?.phone}
              </a>
              {/* Lien LinkedIn volontairement masqué : la valeur actuelle
                  de Setting.company.linkedin est un placeholder générique,
                  pas une page Sapiens IA confirmée. À réactiver dès qu'une
                  URL officielle est fournie. */}
            </div>
            <Link
              href="/rendez-vous"
              className="mt-7 inline-flex h-10 items-center gap-3 rounded-xl bg-white px-4 text-xs font-semibold text-accent transition hover:-translate-y-0.5 hover:bg-slate-100"
            >
              {t("talkToConsultant")} <ArrowUpRight className="size-3.5" />
            </Link>
          </div>

          <FooterColumn
            title={t("consulting")}
            items={consulting.map((item) => ({
              id: item.id,
              label: item.title,
              href: `/services/${item.slug}`,
            }))}
          />
          <FooterColumn
            title={t("data")}
            items={data.map((item) => ({
              id: item.id,
              label: item.title,
              href: `/services/${item.slug}`,
            }))}
          />
          <FooterColumn
            title={t("training")}
            items={[...corporate, ...privateTrainings].map((item) => ({
              id: item.id,
              label: item.title,
              href: `/formations/${item.slug}`,
            }))}
          />
          <FooterColumn title={t("discover")} items={discoverLinks} />
        </div>
        <div className="flex flex-col gap-4 pt-7 text-xs text-white/40 md:flex-row md:items-center md:justify-between">
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
    <section className="border-b border-r border-white/15 p-7">
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
