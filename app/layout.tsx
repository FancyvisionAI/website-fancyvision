import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { Inter, Sora } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const openGraphLocales: Record<string, string> = {
  fr: "fr_FR",
  en: "en_US",
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    ),
    title: {
      default: "Sapiens IA — Conseil & formation IA",
      template: "%s — Sapiens IA",
    },
    description:
      "Sapiens IA accompagne les organisations dans l’adoption concrète et responsable de l’intelligence artificielle.",
    openGraph: {
      type: "website",
      locale: openGraphLocales[locale] ?? openGraphLocales.fr,
      siteName: "Sapiens IA",
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      className={`${sora.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
