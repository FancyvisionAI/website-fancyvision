import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

import "./globals.css";

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
      default: "FancyVision — Conseil & formation IA",
      template: "%s — FancyVision",
    },
    description:
      "FancyVision accompagne les organisations dans l’adoption concrète et responsable de l’intelligence artificielle.",
    openGraph: {
      type: "website",
      locale: openGraphLocales[locale] ?? openGraphLocales.fr,
      siteName: "FancyVision",
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <Toaster position="bottom-right" richColors />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
