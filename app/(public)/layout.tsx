import { Footer } from "@/components/public/footer";
import { Header } from "@/components/public/header";
import { Newsletter } from "@/components/public/newsletter";
import { CookieBanner } from "@/components/public/cookie-banner";
import { contentRepository } from "@/lib/repositories/content";

export const revalidate = 60;

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
