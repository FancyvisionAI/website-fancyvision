"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";

import { useChat } from "../hooks/use-chat";
import { getChatWidgetStrings } from "../lib/i18n";
import { normalizeRasaUrl } from "../lib/rasa-client";
import type { ChatMessage as ChatMessageType, ChatWidgetProps } from "../types";
import styles from "./chat-widget.module.css";

function ChatMessageItem({
  message,
  onQuickReply,
  disabled,
}: {
  message: ChatMessageType;
  onQuickReply: (payload: string) => void;
  disabled: boolean;
}) {
  const isUser = message.role === "user";

  return (
    <div
      className={`${styles.messageRow} ${isUser ? styles.messageRowUser : styles.messageRowBot}`}
    >
      <div
        className={`${styles.bubble} ${isUser ? styles.bubbleUser : styles.bubbleBot}`}
      >
        {message.text}
        {!isUser && message.buttons && message.buttons.length > 0 ? (
          <div className={styles.buttons}>
            {message.buttons.map((button) => (
              <button
                key={`${message.id}-${button.payload}`}
                type="button"
                className={styles.quickReply}
                disabled={disabled}
                onClick={() => onQuickReply(button.payload)}
              >
                {button.title}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function BrandIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="sapiens-ia-brand-gradient"
          x1="5"
          y1="6"
          x2="19"
          y2="18"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#60A5FA" />
          <stop offset="1" stopColor="#67E8F9" />
        </linearGradient>
      </defs>
      <path
        d="M6 7c2 1.5 3 3.5 5 5.5s3.5 3 7 4.5"
        stroke="url(#sapiens-ia-brand-gradient)"
        strokeWidth="1.75"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="6" cy="7" r="1.9" fill="url(#sapiens-ia-brand-gradient)" />
      <circle
        cx="12"
        cy="12.2"
        r="1.9"
        fill="url(#sapiens-ia-brand-gradient)"
      />
      <circle cx="18" cy="17" r="1.9" fill="url(#sapiens-ia-brand-gradient)" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChatWidget({
  rasaUrl,
  title,
  subtitle,
  locale = "fr",
}: ChatWidgetProps) {
  const strings = getChatWidgetStrings(locale);
  const resolvedTitle = title ?? strings.title;
  const resolvedSubtitle = subtitle ?? strings.subtitle;
  const resolvedRasaUrl = normalizeRasaUrl(rasaUrl);
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { messages, isLoading, error, sendMessage, clearError } = useChat(
    resolvedRasaUrl,
    locale,
  );

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, error]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const handleSubmit = async (event?: FormEvent) => {
    event?.preventDefault();
    const value = draft.trim();
    if (!value || isLoading) {
      return;
    }
    setDraft("");
    clearError();
    await sendMessage(value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSubmit();
    }
  };

  return (
    <div className={styles.widget}>
      {isOpen ? (
        <section
          className={styles.panel}
          role="dialog"
          aria-label={resolvedTitle}
          aria-live="polite"
        >
          <header className={styles.header}>
            <div className={styles.headerAvatar} aria-hidden="true">
              <BrandIcon size={18} />
            </div>
            <div className={styles.headerText}>
              <h2 className={styles.title}>{resolvedTitle}</h2>
              <p className={styles.subtitle}>
                <span className={styles.statusDot} aria-hidden="true" />
                {resolvedSubtitle}
              </p>
            </div>
            <button
              type="button"
              className={styles.closeButton}
              aria-label={strings.closeChat}
              onClick={() => setIsOpen(false)}
            >
              <CloseIcon />
            </button>
          </header>

          <div className={styles.messages}>
            {messages.length === 0 ? (
              <p className={styles.emptyState}>{strings.emptyState}</p>
            ) : (
              messages.map((message: ChatMessageType) => (
                <ChatMessageItem
                  key={message.id}
                  message={message}
                  disabled={isLoading}
                  onQuickReply={(payload) => {
                    clearError();
                    void sendMessage(payload);
                  }}
                />
              ))
            )}

            {isLoading ? (
              <div
                className={styles.loading}
                aria-live="polite"
                aria-busy="true"
              >
                <span className={styles.dots} aria-hidden="true">
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                </span>
                {strings.loading}
              </div>
            ) : null}

            <div ref={messagesEndRef} />
          </div>

          {error ? (
            <div className={styles.errorBanner} role="alert">
              {error.message}
            </div>
          ) : null}

          <footer className={styles.footer}>
            <form className={styles.form} onSubmit={handleSubmit}>
              <textarea
                ref={inputRef}
                className={styles.input}
                rows={1}
                value={draft}
                placeholder={strings.inputPlaceholder}
                disabled={isLoading}
                aria-label={strings.inputAriaLabel}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                type="submit"
                className={styles.sendButton}
                disabled={isLoading || !draft.trim()}
                aria-label={strings.sendMessage}
              >
                <SendIcon />
              </button>
            </form>
          </footer>
        </section>
      ) : null}

      <button
        type="button"
        className={styles.launcher}
        aria-label={isOpen ? strings.closeChat : strings.openChat}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open: boolean) => !open)}
      >
        {isOpen ? <CloseIcon /> : <BrandIcon />}
        {!isOpen ? (
          <span className={styles.launcherStatusDot} aria-hidden="true" />
        ) : null}
      </button>
    </div>
  );
}
