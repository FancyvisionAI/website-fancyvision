const STORAGE_KEY = "fancyvision_rasa_sender";

function createUuid(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const rand = Math.floor(Math.random() * 16);
    const value = char === "x" ? rand : (rand & 0x3) | 0x8;
    return value.toString(16);
  });
}

/** Returns a stable sender id persisted in localStorage for the Rasa session. */
export function getOrCreateSenderId(): string {
  if (typeof window === "undefined") {
    return "";
  }

  const existing = localStorage.getItem(STORAGE_KEY);
  if (existing) {
    return existing;
  }

  const id = createUuid();
  localStorage.setItem(STORAGE_KEY, id);
  return id;
}
