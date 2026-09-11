import { contentRepository } from "@/lib/repositories/content";

import { FancyVisionChat } from "./fancyvision-chat";
import { WhatsAppFloatButton } from "./whatsapp-float-button";

// Bascule chatbot actif / brouillon (draft) : le widget Rasa (code,
// entraînement, backend) n'est pas touché, seul son affichage public est
// désactivé. CHATBOT_STATUS="active" pour réafficher le chatbot ; toute
// autre valeur (ou son absence) affiche l'icône WhatsApp à la même place.
const CHATBOT_STATUS = process.env.CHATBOT_STATUS ?? "draft";

// Setting.value est un Json libre : "phone" peut être soit l'ancien format
// `string`, soit un nouveau format multilingue `{ fr, en }` — même
// situation que "cookie" (cf. resolveCookieText dans
// app/[locale]/(public)/layout.tsx). Un objet est truthy : `if
// (!company?.phone)` seul ne suffit pas à écarter ce cas avant de le
// transmettre à WhatsAppFloatButton (React error #31).
type LocalizedText = string | { fr?: string; en?: string };

function resolveLocalizedText(
  value: LocalizedText | undefined,
  locale: string,
): string | undefined {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  return (locale === "en" ? value.en : value.fr) ?? value.fr;
}

export async function FloatingContact({ locale }: { locale: string }) {
  if (CHATBOT_STATUS === "active") {
    return <FancyVisionChat />;
  }

  const settings = await contentRepository.settings();
  const company = settings.find((item) => item.key === "company")?.value as
    | { phone?: LocalizedText }
    | undefined;
  const phone = resolveLocalizedText(company?.phone, locale);
  if (!phone) return null;

  const label = locale === "en" ? "Chat on WhatsApp" : "Discuter sur WhatsApp";
  return <WhatsAppFloatButton phone={phone} label={label} />;
}
