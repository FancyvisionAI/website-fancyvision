import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { DesktopNav } from "@/components/public/desktop-nav";
import { MobileNav } from "@/components/public/mobile-nav";
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
  const [menu, services, trainings] = await Promise.all([
    contentRepository.menu("HEADER"),
    contentRepository.services(),
    contentRepository.trainings(),
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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#dfe7f4] bg-white/95 text-[#1a203d] shadow-[0_8px_30px_rgba(26,32,61,.05)] backdrop-blur-xl">
      <div className="container-shell flex h-[4.875rem] items-center justify-between gap-5">
        <Link
          href="/"
          className="shrink-0 text-xl font-semibold tracking-[-0.04em]"
          aria-label="FancyVision, accueil"
        >
          FancyVision<span className="font-editorial text-[#597dc1]">.</span>
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
          Prendre rendez-vous
          <ArrowRight className="size-3 transition group-hover:translate-x-0.5" />
        </Link>

        <MobileNav
          items={items}
          services={navigationServices}
          trainings={navigationTrainings}
        />
      </div>
    </header>
  );
}
