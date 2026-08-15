import { ArrowRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

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

export async function Header() {
  const t = await getTranslations("Header");
  const locale = await getLocale();
  const [menu, services, trainings] = await Promise.all([
    contentRepository.menu("HEADER", locale),
    contentRepository.services(false, locale),
    contentRepository.trainings(locale),
  ]);
  const items = (menu?.items ?? [])
    .filter((item) => item.url !== "/services" && item.url !== "/formations")
    .filter((item) => !item.label.toLowerCase().includes("blog"))
    .map((item) => ({
      id: item.id,
      label: item.url === "/a-propos" ? "À propos" : item.label,
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

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-lime bg-canvas/95 text-ink shadow-[0_8px_30px_rgba(26,32,61,.05)] backdrop-blur-xl">
      <div className="container-shell flex h-[4.875rem] items-center justify-between gap-5">
        <Link
          href="/"
          className="shrink-0 text-xl font-semibold tracking-[-0.04em]"
          aria-label={t("homeAriaLabel")}
        >
          FancyVision<span className="font-editorial text-cobalt">.</span>
        </Link>

        <DesktopNav
          items={items}
          services={navigationServices}
          trainings={navigationTrainings}
        />

        <Link
          href="/rendez-vous"
          className="group hidden h-9 shrink-0 items-center gap-3 rounded-xl bg-gradient-to-br from-[#1a203d] to-[#4765b2] px-3.5 text-[11px] font-semibold text-white shadow-[0_8px_18px_rgba(26,32,61,.14)] transition hover:-translate-y-0.5 hover:shadow-[0_11px_22px_rgba(26,32,61,.2)] lg:flex"
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
        />
      </div>
    </header>
  );
}
