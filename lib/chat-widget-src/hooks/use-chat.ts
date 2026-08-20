import { useCallback, useEffect, useRef, useState } from "react";

import { getChatWidgetStrings } from "../lib/i18n";
import { parseRasaResponse } from "../lib/parse-rasa-response";
import { sendMessageToRasa } from "../lib/rasa-client";
import { getOrCreateSenderId } from "../lib/sender-id";
import type { ChatError, ChatLocale, ChatMessage } from "../types";

function createUserMessage(text: string): ChatMessage {
  const id =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? `user-${crypto.randomUUID()}`
      : `user-${Date.now()}`;
  return { id, role: "user", text: text.trim() };
}

function isChatError(value: unknown): value is ChatError {
  return (
    typeof value === "object" &&
    value !== null &&
    "kind" in value &&
    "message" in value
  );
}

export function useChat(rasaUrl: string, locale: ChatLocale = "fr") {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ChatError | null>(null);
  const senderRef = useRef<string>("");

  useEffect(() => {
    senderRef.current = getOrCreateSenderId();
  }, []);

  const sendMessage = useCallback(
    async (rawText: string) => {
      const text = rawText.trim();
      if (!text || isLoading) {
        return;
      }

      setError(null);
      setMessages((prev: ChatMessage[]) => [...prev, createUserMessage(text)]);
      setIsLoading(true);

      try {
        const sender = senderRef.current || getOrCreateSenderId();
        senderRef.current = sender;

        const items = await sendMessageToRasa(rasaUrl, sender, text, locale);
        const botMessages = parseRasaResponse(items);

        if (botMessages.length === 0) {
          setError({
            kind: "empty",
            message: getChatWidgetStrings(locale).emptyResponseError,
          });
        } else {
          setMessages((prev: ChatMessage[]) => [...prev, ...botMessages]);
        }
      } catch (err) {
        if (isChatError(err)) {
          setError(err);
        } else {
          setError({
            kind: "network",
            message: getChatWidgetStrings(locale).unexpectedError,
          });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, rasaUrl, locale],
  );

  const clearError = useCallback(() => setError(null), []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearError,
  };
}
