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

// Repli mémoire (non persisté) utilisé uniquement si localStorage est
// inaccessible (mode privé strict, politique navigateur, etc.) — garantit
// que l'utilisateur peut toujours discuter avec le chatbot dans ce cas,
// simplement sans continuité d'identifiant entre deux rafraîchissements.
let inMemorySenderId: string | null = null;

/** Returns a stable sender id persisted in localStorage for the Rasa session.
 * Falls back to an in-memory id (stable for the current page load only) if
 * localStorage throws or is unavailable — never blocks the conversation. */
export function getOrCreateSenderId(): string {
  if (typeof window === "undefined") {
    return "";
  }

  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing) {
      return existing;
    }
    const id = createUuid();
    localStorage.setItem(STORAGE_KEY, id);
    return id;
  } catch {
    if (!inMemorySenderId) {
      inMemorySenderId = createUuid();
    }
    return inMemorySenderId;
  }
}
