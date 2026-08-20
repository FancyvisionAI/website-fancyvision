import type { ChatMessage, RasaBotResponseItem } from "../types";

function createId(prefix: string): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Converts Rasa REST webhook items into chat messages for the UI. */
export function parseRasaResponse(items: RasaBotResponseItem[]): ChatMessage[] {
  const messages: ChatMessage[] = [];

  for (const item of items) {
    const parts: string[] = [];

    if (item.text?.trim()) {
      parts.push(item.text.trim());
    }

    if (item.image?.trim()) {
      parts.push(item.image.trim());
    }

    if (parts.length === 0 && item.custom) {
      parts.push(JSON.stringify(item.custom));
    }

    if (parts.length === 0) {
      continue;
    }

    messages.push({
      id: createId("bot"),
      role: "bot",
      text: parts.join("\n"),
      buttons: item.buttons?.filter((btn) => btn.title && btn.payload),
    });
  }

  return messages;
}
