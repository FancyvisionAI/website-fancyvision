import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2_678_400,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "utfs.io" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  poweredByHeader: false,
  // Security headers indépendants d'une CSP (audit sécurité, finding F5).
  // Une Content-Security-Policy n'est volontairement pas ajoutée ici : elle
  // nécessiterait de couvrir le script inline de next-themes (anti-FOUC),
  // le domaine d'upload UploadThing (résolu à l'exécution depuis
  // UPLOADTHING_TOKEN, non connu statiquement) et l'URL Rasa du widget de
  // chat (NEXT_PUBLIC_RASA_URL, configurable par environnement) — une CSP
  // mal calibrée casserait ces fonctionnalités plutôt que de les protéger.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
