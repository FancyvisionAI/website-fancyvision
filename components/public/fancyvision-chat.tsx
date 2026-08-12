"use client";

import { ChatWidget } from "@fancyvision/chat-widget";

export function FancyVisionChat() {
  const rasaUrl = process.env.NEXT_PUBLIC_RASA_URL ?? "http://localhost:5005";

  return <ChatWidget rasaUrl={rasaUrl} />;
}
