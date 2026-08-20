import { getChatWidgetStrings } from "./i18n";
import type { ChatError, ChatLocale, RasaBotResponseItem } from "../types";

const DEFAULT_RASA_URL = "http://localhost:5005";

export function normalizeRasaUrl(url?: string): string {
  return (url?.trim() || DEFAULT_RASA_URL).replace(/\/+$/, "");
}

function buildWebhookUrl(rasaUrl: string): string {
  return `${normalizeRasaUrl(rasaUrl)}/webhooks/rest/webhook`;
}

function mapFetchError(error: unknown, locale: ChatLocale): ChatError {
  const strings = getChatWidgetStrings(locale);
  if (error instanceof TypeError) {
    return { kind: "network", message: strings.networkError };
  }
  return { kind: "network", message: strings.genericNetworkError };
}

function mapHttpError(status: number, locale: ChatLocale): ChatError {
  return {
    kind: "http",
    message: getChatWidgetStrings(locale).httpError(status),
  };
}

export async function sendMessageToRasa(
  rasaUrl: string,
  sender: string,
  message: string,
  locale: ChatLocale = "fr",
): Promise<RasaBotResponseItem[]> {
  const trimmed = message.trim();
  if (!trimmed) {
    return [];
  }

  let response: Response;
  try {
    response = await fetch(buildWebhookUrl(rasaUrl), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender,
        message: trimmed,
        metadata: { language: locale },
      }),
    });
  } catch (error) {
    throw mapFetchError(error, locale);
  }

  if (!response.ok) {
    throw mapHttpError(response.status, locale);
  }

  const strings = getChatWidgetStrings(locale);

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw { kind: "parse", message: strings.parseError } satisfies ChatError;
  }

  if (!Array.isArray(data)) {
    throw {
      kind: "parse",
      message: strings.unexpectedFormatError,
    } satisfies ChatError;
  }

  return data as RasaBotResponseItem[];
}
