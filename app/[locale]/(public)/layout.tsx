import { getLocale } from "next-intl/server";

import { Footer } from "@/components/public/footer";
import { Header } from "@/components/public/header";
import { Newsletter } from "@/components/public/newsletter";
import { CookieBanner } from "@/components/public/cookie-banner";
import { FancyVisionChat } from "@/components/public/fancyvision-chat";
import { contentRepository } from "@/lib/repositories/content";

// Public content is database-backed, so it must be resolved at request time.
// This keeps builds independent from database network availability.
export const dynamic = "force-dynamic";

// Setting.value est un Json libre (pas de migration Prisma) : le texte
// cookie peut être soit l'ancien format `string` (FR uniquement), soit le
// nouveau `{ fr, en }`. On résout la locale active avec repli FR.
function resolveCookieText(
  text: string | { fr?: string; en?: string } | undefined,
  locale: string,
): string | undefined {
  if (!text) return undefined;
  if (typeof text === "string") return text;
  return (locale === "en" ? text.en : text.fr) ?? text.fr;
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const settings = await contentRepository.settings();
  const cookie = settings.find((item) => item.key === "cookie")?.value as
    | { enabled?: boolean; text?: string | { fr?: string; en?: string } }
    | undefined;
  const cookieText = resolveCookieText(cookie?.text, locale);
  return (
    <>
      <Header />
      <main>{children}</main>
      <Newsletter />
      <Footer />
      {cookie?.enabled && cookieText ? (
        <CookieBanner text={cookieText} />
      ) : null}
      <FancyVisionChat />
    </>
  );
}
