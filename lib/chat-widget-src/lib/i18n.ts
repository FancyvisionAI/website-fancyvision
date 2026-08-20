import type { ChatLocale } from "../types";

/** Widget UI strings. Self-contained — the widget does not depend on next-intl. */
export interface ChatWidgetStrings {
  title: string;
  subtitle: string;
  openChat: string;
  closeChat: string;
  emptyState: string;
  loading: string;
  inputPlaceholder: string;
  inputAriaLabel: string;
  sendMessage: string;
  networkError: string;
  genericNetworkError: string;
  httpError: (status: number) => string;
  parseError: string;
  unexpectedFormatError: string;
  emptyResponseError: string;
  unexpectedError: string;
}

const STRINGS: Record<ChatLocale, ChatWidgetStrings> = {
  fr: {
    title: "Sapiens IA",
    subtitle: "Réponses en français · en ligne",
    openChat: "Ouvrir le chat",
    closeChat: "Fermer le chat",
    emptyState:
      "Bonjour. Écrivez votre message pour démarrer la conversation avec l'assistant Sapiens IA.",
    loading: "L'assistant répond…",
    inputPlaceholder: "Votre message…",
    inputAriaLabel: "Votre message",
    sendMessage: "Envoyer le message",
    networkError:
      'Impossible de joindre le serveur Rasa. Vérifiez que Rasa est démarré avec --enable-api --cors "*".',
    genericNetworkError: "Erreur réseau lors de la communication avec Rasa.",
    httpError: (status) =>
      `Le serveur Rasa a répondu avec une erreur (HTTP ${status}).`,
    parseError: "Réponse Rasa illisible (JSON invalide).",
    unexpectedFormatError: "Format de réponse Rasa inattendu.",
    emptyResponseError: "Rasa n'a renvoyé aucun message.",
    unexpectedError: "Une erreur inattendue est survenue.",
  },
  en: {
    title: "Sapiens IA",
    subtitle: "Responses in English · online",
    openChat: "Open chat",
    closeChat: "Close chat",
    emptyState:
      "Hello. Type your message to start the conversation with the Sapiens IA assistant.",
    loading: "The assistant is replying…",
    inputPlaceholder: "Your message…",
    inputAriaLabel: "Your message",
    sendMessage: "Send message",
    networkError:
      'Unable to reach the Rasa server. Check that Rasa is running with --enable-api --cors "*".',
    genericNetworkError: "Network error while communicating with Rasa.",
    httpError: (status) =>
      `The Rasa server responded with an error (HTTP ${status}).`,
    parseError: "Unreadable Rasa response (invalid JSON).",
    unexpectedFormatError: "Unexpected Rasa response format.",
    emptyResponseError: "Rasa did not return any message.",
    unexpectedError: "An unexpected error occurred.",
  },
};

export function getChatWidgetStrings(locale?: ChatLocale): ChatWidgetStrings {
  return STRINGS[locale ?? "fr"] ?? STRINGS.fr;
}
