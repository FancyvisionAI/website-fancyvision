import { Footer } from "@/components/public/footer";
import { Header } from "@/components/public/header";
import { Newsletter } from "@/components/public/newsletter";
import { CookieBanner } from "@/components/public/cookie-banner";
import { contentRepository } from "@/lib/repositories/content";

// Public content is database-backed, so it must be resolved at request time.
// This keeps builds independent from database network availability.
export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await contentRepository.settings();
  const cookie = settings.find((item) => item.key === "cookie")?.value as
    { enabled?: boolean; text?: string } | undefined;
  return (
    <>
      <Header />
      <main>{children}</main>
      <Newsletter />
      <Footer />
      {cookie?.enabled && cookie.text ? (
        <CookieBanner text={cookie.text} />
      ) : null}
    </>
  );
}
