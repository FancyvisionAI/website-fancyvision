"use client";

import dynamic from "next/dynamic";
import { useLocale } from "next-intl";

// Chargé à la demande côté client uniquement (ssr: false) : le code du
// widget (composant + hook use-chat + CSS module) part dans son propre
// chunk, séparé du JS partagé du layout public chargé sur chaque page.
// Sans impact sur le comportement une fois monté : mêmes props, même
// rendu, juste différé jusqu'à l'hydratation côté navigateur.
const ChatWidget = dynamic(
  () => import("../../lib/chat-widget-src").then((mod) => mod.ChatWidget),
  { ssr: false },
);

export function FancyVisionChat() {
  const rasaUrl = process.env.NEXT_PUBLIC_RASA_URL ?? "http://localhost:5005";
  const locale = useLocale();

  return <ChatWidget rasaUrl={rasaUrl} locale={locale === "en" ? "en" : "fr"} />;
}
