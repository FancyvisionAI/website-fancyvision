import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { contentRepository } from "@/lib/repositories/content";

export async function Footer() {
  const [menu, settings, services, trainings] = await Promise.all([
    contentRepository.menu("FOOTER"),
    contentRepository.settings(),
    contentRepository.services(),
    contentRepository.trainings(),
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
  const aboutLinks = (menu?.items ?? [])
    .filter((item) => !item.label.toLowerCase().includes("blog"))
    .filter((item) =>
      ["/evenements", "/etudes-de-cas", "/a-propos", "/mentions-legales"].includes(
        item.url,
      ),
    );

  return (
    <footer className="bg-[#11162d] text-white">
      <div className="container-shell py-14 md:py-16">
        <div className="grid border-l border-t border-white/15 md:grid-cols-2 xl:grid-cols-[1.2fr_repeat(4,1fr)]">
          <div className="border-b border-r border-white/15 p-7">
            <Link href="/" className="text-2xl font-semibold tracking-[-0.04em]">
              FancyVision<span className="font-editorial text-[#a9c5ff]">.</span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-6 text-white/55">
              Conseil, formation et intégration de l’intelligence artificielle,
              de la sensibilisation au déploiement.
            </p>
            <div className="mt-7 space-y-2 text-xs leading-5 text-white/65">
              <p>{company?.address}</p>
              <a href={`tel:${company?.phone}`} className="block hover:text-white">
                {company?.phone}
              </a>
              <a href={`mailto:${company?.email}`} className="block hover:text-white">
                {company?.email}
              </a>
            </div>
            <Link
              href="/rendez-vous"
              className="mt-7 inline-flex h-10 items-center gap-3 rounded-xl bg-white px-4 text-xs font-semibold text-[#1a203d] transition hover:-translate-y-0.5 hover:bg-[#dfe7f4]"
            >
              Parler à un consultant <ArrowUpRight className="size-3.5" />
            </Link>
          </div>

          <FooterColumn
            title="Conseil"
            items={consulting.map((item) => ({
              id: item.id,
              label: item.title,
              href: `/services/${item.slug}`,
            }))}
          />
          <FooterColumn
            title="Data"
            items={data.map((item) => ({
              id: item.id,
              label: item.title,
              href: `/services/${item.slug}`,
            }))}
          />
          <FooterColumn
            title="Formation"
            items={[...corporate, ...privateTrainings].map((item) => ({
              id: item.id,
              label: item.title,
              href: `/formations/${item.slug}`,
            }))}
          />
          <FooterColumn
            title="À propos"
            items={aboutLinks.map((item) => ({
              id: item.id,
              label: item.url === "/a-propos" ? "À propos" : item.label,
              href: item.url,
            }))}
          />
        </div>
        <div className="flex flex-col gap-4 pt-7 text-xs text-white/40 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} FancyVision. Tous droits réservés.</p>
          <p>Conseil & formation en intelligence artificielle</p>
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
      <h2 className="mb-5 font-mono text-[10px] uppercase tracking-[0.15em] text-[#a9c5ff]">
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
