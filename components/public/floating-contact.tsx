import { contentRepository } from "@/lib/repositories/content";

import { FancyVisionChat } from "./fancyvision-chat";
import { WhatsAppFloatButton } from "./whatsapp-float-button";

// Bascule chatbot actif / brouillon (draft) : le widget Rasa (code,
// entraînement, backend) n'est pas touché, seul son affichage public est
// désactivé. CHATBOT_STATUS="active" pour réafficher le chatbot ; toute
// autre valeur (ou son absence) affiche l'icône WhatsApp à la même place.
const CHATBOT_STATUS = process.env.CHATBOT_STATUS ?? "draft";

export async function FloatingContact({ locale }: { locale: string }) {
  if (CHATBOT_STATUS === "active") {
    return <FancyVisionChat />;
  }

  const settings = await contentRepository.settings();
  const company = settings.find((item) => item.key === "company")?.value as
    | { phone?: string }
    | undefined;
  if (!company?.phone) return null;

  const label = locale === "en" ? "Chat on WhatsApp" : "Discuter sur WhatsApp";
  return <WhatsAppFloatButton phone={company.phone} label={label} />;
}
