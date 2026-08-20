"use client";

import { ChatWidget } from "../../lib/chat-widget-src";
import { useLocale } from "next-intl";

export function FancyVisionChat() {
  const rasaUrl = process.env.NEXT_PUBLIC_RASA_URL ?? "http://localhost:5005";
  const locale = useLocale();

  return <ChatWidget rasaUrl={rasaUrl} locale={locale === "en" ? "en" : "fr"} />;
}
