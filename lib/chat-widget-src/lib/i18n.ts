import type { ChatLocale } from "../types";

/** Widget UI strings. Self-contained — the widget does not depend on next-intl. */
export interface ChatWidgetStrings {
  title: string;
  subtitle: string;
  openChat: string;
  closeChat: string;
  inviteBubble: string;
  dismissInvite: string;
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
  timeoutError: string;
}

const STRINGS: Record<ChatLocale, ChatWidgetStrings> = {
  fr: {
    title: "Sapiens-IA",
    subtitle: "Réponses en français · en ligne",
    openChat: "Ouvrir le chat",
    closeChat: "Fermer le chat",
    inviteBubble: "Bonjour 👋 Une question ? Discutez avec notre assistant IA.",
    dismissInvite: "Fermer la bulle d'invitation",
    emptyState:
      "Bonjour. Écrivez votre message pour démarrer la conversation avec l'assistant Sapiens-IA.",
    loading: "L'assistant répond…",
    inputPlaceholder: "Votre message…",
    inputAriaLabel: "Votre message",
    sendMessage: "Envoyer le message",
    networkError:
      "Je rencontre momentanément une difficulté pour répondre. Veuillez réessayer dans quelques instants.",
    genericNetworkError:
      "Je rencontre momentanément une difficulté pour répondre. Veuillez réessayer dans quelques instants.",
    httpError: () =>
      "Je rencontre momentanément une difficulté pour répondre. Veuillez réessayer dans quelques instants.",
    parseError:
      "Je n'ai pas pu traiter la réponse reçue. Veuillez réessayer dans quelques instants.",
    unexpectedFormatError:
      "Je n'ai pas pu traiter la réponse reçue. Veuillez réessayer dans quelques instants.",
    emptyResponseError:
      "Je n'ai pas de réponse à vous proposer pour le moment. Pouvez-vous reformuler ?",
    unexpectedError: "Une erreur inattendue est survenue. Veuillez réessayer.",
    timeoutError:
      "La réponse prend plus de temps que prévu. Veuillez réessayer dans quelques instants.",
  },
  en: {
    title: "Sapiens-IA",
    subtitle: "Responses in English · online",
    openChat: "Open chat",
    closeChat: "Close chat",
    inviteBubble: "Hello 👋 A question? Chat with our AI assistant.",
    dismissInvite: "Dismiss invitation bubble",
    emptyState:
      "Hello. Type your message to start the conversation with the Sapiens-IA assistant.",
    loading: "The assistant is replying…",
    inputPlaceholder: "Your message…",
    inputAriaLabel: "Your message",
    sendMessage: "Send message",
    networkError:
      "I'm temporarily having trouble responding. Please try again in a few moments.",
    genericNetworkError:
      "I'm temporarily having trouble responding. Please try again in a few moments.",
    httpError: () =>
      "I'm temporarily having trouble responding. Please try again in a few moments.",
    parseError:
      "I couldn't process the response I received. Please try again in a few moments.",
    unexpectedFormatError:
      "I couldn't process the response I received. Please try again in a few moments.",
    emptyResponseError:
      "I don't have an answer for you right now. Could you rephrase?",
    unexpectedError: "An unexpected error occurred. Please try again.",
    timeoutError:
      "This is taking longer than expected. Please try again in a few moments.",
  },
};

export function getChatWidgetStrings(locale?: ChatLocale): ChatWidgetStrings {
  return STRINGS[locale ?? "fr"] ?? STRINGS.fr;
}
