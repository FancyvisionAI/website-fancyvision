import type { ChatMessage, RasaBotResponseItem } from "../types";

/**
 * Valide une URL d'image renvoyée par Rasa avant de la rendre en <img> —
 * uniquement http(s) absolu ou chemin relatif du site (jamais javascript:,
 * data:, ni une chaîne arbitraire). N'invente jamais d'image à partir d'une
 * URL texte ordinaire : seul le champ dédié `item.image` est concerné.
 */
function safeImageUrl(url: string): string | null {
  const trimmed = url.trim();
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return trimmed;
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.toString();
    }
  } catch {
    return null;
  }
  return null;
}

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

    const image = item.image?.trim() ? safeImageUrl(item.image.trim()) : null;

    if (parts.length === 0 && !image && item.custom) {
      parts.push(JSON.stringify(item.custom));
    }

    if (parts.length === 0 && !image) {
      continue;
    }

    messages.push({
      id: createId("bot"),
      role: "bot",
      text: parts.join("\n"),
      buttons: item.buttons?.filter((btn) => btn.title && btn.payload),
      image: image ?? undefined,
    });
  }

  return messages;
}
