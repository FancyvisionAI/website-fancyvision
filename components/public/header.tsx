import { ArrowRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";

import { DesktopNav } from "@/components/public/desktop-nav";
import { LocaleSwitcher } from "@/components/public/locale-switcher";
import { MobileNav } from "@/components/public/mobile-nav";
import { ThemeToggle } from "@/components/public/theme-toggle";
import { Link } from "@/i18n/navigation";
import { contentRepository } from "@/lib/repositories/content";

export type NavigationService = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  categorySlug: string;
};

export type NavigationTraining = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  categorySlug: string;
};

export type NavigationSector = {
  id: string;
  title: string;
  slug: string;
};

export async function Header() {
  const t = await getTranslations("Header");
  const locale = await getLocale();
  const [menu, services, trainings, sectorServices] = await Promise.all([
    contentRepository.menu("HEADER", locale),
    contentRepository.services(false, locale),
    contentRepository.trainings(locale),
    contentRepository.servicesByCategory("secteurs", locale),
  ]);
  // Nav desktop/mobile suit la structure officielle (M. Bassit) : seuls les
  // items explicitement listés (Formations) sont repris du menu CMS ;
  // Solutions IA / Secteurs / Blog / Contact sont ajoutés directement dans
  // DesktopNav/MobileNav.
  // Le label CMS (Menu.items, non localisé) est ignoré au profit de la
  // traduction next-intl pour que la version EN affiche "Training" sans
  // modifier la donnée Menu FR en base.
  const items = (menu?.items ?? [])
    .filter((item) => item.url === "/formations")
    .map((item) => ({
      id: item.id,
      label: t("trainingNavLabel"),
      url: item.url,
    }));
  const navigationServices: NavigationService[] = services.map((item) => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt,
    categorySlug: item.category?.slug ?? "conseil",
  }));
  const navigationTrainings: NavigationTraining[] = trainings.map((item) => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt,
    categorySlug: item.category?.slug ?? "entreprise",
  }));
  const navigationSectors: NavigationSector[] = sectorServices.map((item) => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
  }));

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-canvas text-ink shadow-[0_1px_2px_rgba(16,27,51,.05)]">
      <div className="container-shell flex h-[4.875rem] items-center justify-between gap-5">
        <Link
          href="/"
          className="focus-visible:ring-cobalt focus-visible:ring-offset-canvas flex shrink-0 items-center gap-2.5 rounded-control text-xl font-display font-semibold tracking-[-0.03em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          aria-label={t("homeAriaLabel")}
        >
          <Image
            src="/images/sapiens-ia-logo.png"
            alt=""
            width={36}
            height={36}
            className="size-9 shrink-0"
            priority
          />
          Sapiens-IA<span className="text-cobalt">.</span>
        </Link>

        <DesktopNav
          items={items}
          services={navigationServices}
          trainings={navigationTrainings}
          sectors={navigationSectors}
        />

        <Link
          href="/rendez-vous"
          className="focus-visible:ring-cobalt focus-visible:ring-offset-canvas group hidden h-11 shrink-0 items-center gap-3 rounded-control bg-ink px-4 text-xs font-semibold text-canvas shadow-[0_1px_2px_rgba(16,27,51,.08)] transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 lg:flex"
        >
          {t("bookAppointment")}
          <ArrowRight className="size-3 transition group-hover:translate-x-0.5" />
        </Link>

        <LocaleSwitcher />

        <ThemeToggle />

        <MobileNav
          items={items}
          services={navigationServices}
          trainings={navigationTrainings}
          sectors={navigationSectors}
        />
      </div>
    </header>
  );
}
