import { getChatWidgetStrings } from "./i18n";
import type { ChatError, ChatLocale, RasaBotResponseItem } from "../types";

const DEFAULT_RASA_URL = "http://localhost:5005";

// Le serveur d'actions Rasa peut enchaîner plusieurs appels vers l'API du
// site (timeout Python 3s connect + 8s read, 1 retry — cf. api_client.py) :
// 20s laisse une marge raisonnable avant de considérer la requête bloquée,
// sans jamais laisser l'utilisateur sur "L'assistant répond…" indéfiniment.
const REQUEST_TIMEOUT_MS = 20_000;

export function normalizeRasaUrl(url?: string): string {
  return (url?.trim() || DEFAULT_RASA_URL).replace(/\/+$/, "");
}

function buildWebhookUrl(rasaUrl: string): string {
  return `${normalizeRasaUrl(rasaUrl)}/webhooks/rest/webhook`;
}

function mapFetchError(error: unknown, locale: ChatLocale): ChatError {
  // Détail technique conservé pour le debug (console uniquement) — le
  // message affiché à l'utilisateur reste générique, cf. i18n.ts.
  console.error("[rasa-client] Request to Rasa failed:", error);
  const strings = getChatWidgetStrings(locale);
  if (error instanceof DOMException && error.name === "AbortError") {
    return { kind: "timeout", message: strings.timeoutError };
  }
  if (error instanceof TypeError) {
    return { kind: "network", message: strings.networkError };
  }
  return { kind: "network", message: strings.genericNetworkError };
}

function mapHttpError(status: number, locale: ChatLocale): ChatError {
  // Détail technique conservé pour le debug (console uniquement) — le
  // message affiché à l'utilisateur reste générique, cf. i18n.ts.
  console.error(`[rasa-client] Rasa webhook responded with HTTP ${status}`);
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

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

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
      signal: controller.signal,
    });
  } catch (error) {
    throw mapFetchError(error, locale);
  } finally {
    clearTimeout(timeoutId);
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
