export type ChatRole = "user" | "bot";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  buttons?: RasaButton[];
  /** Validated image URL (http/https/relative only) — see parse-rasa-response.ts */
  image?: string;
}

export interface RasaButton {
  title: string;
  payload: string;
}

/** Single element returned by POST /webhooks/rest/webhook */
export interface RasaBotResponseItem {
  recipient_id?: string;
  text?: string;
  image?: string;
  buttons?: RasaButton[];
  custom?: unknown;
}

export type ChatLocale = "fr" | "en";

export interface ChatWidgetProps {
  /** Base Rasa server URL, e.g. http://localhost:5005 */
  rasaUrl?: string;
  /** Widget title in the chat header */
  title?: string;
  /** Subtitle shown under the title */
  subtitle?: string;
  /** UI language and language sent to Rasa via metadata.language. Defaults to "fr". */
  locale?: ChatLocale;
}

export type ChatErrorKind = "network" | "http" | "parse" | "empty" | "timeout";

export interface ChatError {
  kind: ChatErrorKind;
  message: string;
}
