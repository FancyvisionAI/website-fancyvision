import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/public/page-hero";
import { RichContent } from "@/components/public/rich-content";
import { Button } from "@/components/ui/button";
import { Link, permanentRedirect } from "@/i18n/navigation";
import { contentRepository } from "@/lib/repositories/content";
import { languageAlternates, localizedPath } from "@/lib/utils";

// Catégories dont la route publique n'est plus /services/[slug] mais une
// page dédiée (Phase B) : évite le contenu dupliqué signalé lors de l'audit
// final (agents IA -> /solutions-ia, secteurs -> /solutions-par-secteur).
const RELOCATED_CATEGORY_PATHS: Record<string, string> = {
  "agents-ia": "/solutions-ia",
  secteurs: "/solutions-par-secteur",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const locale = await getLocale();
  const item = await contentRepository.service((await params).slug, locale);
  if (!item) return {};
  const path = `/services/${item.slug}`;
  return {
    title: item.seo?.title ?? item.title,
    description: item.seo?.description ?? item.excerpt,
    alternates: {
      canonical: item.seo?.canonical ?? localizedPath(path, locale),
      languages: languageAlternates(path),
    },
    robots: item.seo?.noIndex ? { index: false } : undefined,
    openGraph: { images: item.seo?.ogImage ? [item.seo.ogImage] : undefined },
  };
}

export default async function ServiceDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const t = await getTranslations("Pages.serviceDetail");
  const tCategories = await getTranslations("Categories");
  const locale = await getLocale();
  const item = await contentRepository.service((await params).slug, locale);
  if (!item) notFound();
  const relocatedPath = RELOCATED_CATEGORY_PATHS[item.category?.slug ?? ""];
  if (relocatedPath) {
    permanentRedirect({ href: `${relocatedPath}/${item.slug}`, locale });
  }
  const values = [t("value1"), t("value2"), t("value3"), t("value4")];
  const categoryLabel = item.category?.slug
    ? tCategories(item.category.slug)
    : undefined;
  return (
    <>
      <PageHero
        eyebrow={categoryLabel}
        title={item.title}
        description={item.excerpt}
        cta={{ label: t("cta"), href: "/rendez-vous" }}
      />
      <section className="section-pad bg-canvas">
        <div className="container-shell grid gap-16 lg:grid-cols-[.65fr_1.35fr]">
          <aside>
            <div className="sticky top-8 rounded-3xl bg-lime p-7">
              <p className="text-sm font-semibold">{t("whatYouGet")}</p>
              <ul className="mt-6 space-y-4 text-sm">
                {values.map((value) => (
                  <li key={value} className="flex gap-3">
                    <Check className="mt-0.5 size-4 shrink-0" /> {value}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
          <article className="max-w-3xl">
            <span className="eyebrow">{t("support")}</span>
            <RichContent value={item.content} />
            {item.slug === "developpement-sur-mesure" ? (
              <div className="mt-10 rounded-3xl bg-lime p-8">
                <p className="text-lg font-semibold">
                  {t("developpementCtaHeading")}
                </p>
                <p className="mt-3 text-sm leading-6 text-muted">
                  {t("developpementCtaDescription")}
                </p>
                <Button asChild size="lg" className="mt-6">
                  <Link href="/rendez-vous">
                    {t("developpementCtaLabel")}{" "}
                    <ArrowRight className="ml-3 size-4" />
                  </Link>
                </Button>
              </div>
            ) : (
              <Button asChild size="lg" className="mt-8">
                <Link href="/rendez-vous">
                  {item.slug === "audit-ia"
                    ? t("auditIaCta")
                    : t("startDiagnostic")}{" "}
                  <ArrowRight className="ml-3 size-4" />
                </Link>
              </Button>
            )}
          </article>
        </div>
      </section>
    </>
  );
}
