import type { Metadata } from "next";
import { Toaster } from "sonner";

import "./globals.css";

export const metadata: Metadata = {
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
    locale: "fr_FR",
    siteName: "FancyVision",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
