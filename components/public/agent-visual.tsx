"use client";

import { useId } from "react";

// Identité visuelle des 9 Agents IA (Offre 3) : une famille de motifs
// abstraits géométriques partageant le même dégradé de marque (cobalt/
// brand/cyan, cohérent avec l'icône du chatbot), différenciés par un
// motif propre à l'univers de chaque agent. Volontairement non
// figuratif — pas de robot, de mascotte ni d'illustration IA générique
// — pour rester premium et sobre. Purement décoratif (aria-hidden) :
// le titre réel de l'agent reste porté par le texte à côté.
type AgentSlug =
  | "agent-hotellerie"
  | "agent-call-center"
  | "agent-marketing"
  | "agent-commercial"
  | "agent-rh"
  | "agent-juridique"
  | "agent-media"
  | "agent-finance"
  | "agent-direction";

function Motif({ slug, gradientId }: { slug: AgentSlug; gradientId: string }) {
  const stroke = `url(#${gradientId})`;
  switch (slug) {
    // Hôtellerie — accueil, arc chaleureux + point rayonnant.
    case "agent-hotellerie":
      return (
        <>
          <path d="M8 30c4-10 24-10 28 0" stroke={stroke} strokeWidth="2" strokeLinecap="round" fill="none" />
          <circle cx="22" cy="14" r="3.2" fill={stroke} />
          <path d="M14 20c2-2.5 5-4 8-4s6 1.5 8 4" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" fill="none" opacity=".55" />
        </>
      );
    // Call Center — ondes sonores concentriques.
    case "agent-call-center":
      return (
        <>
          <circle cx="22" cy="22" r="3" fill={stroke} />
          <circle cx="22" cy="22" r="9" stroke={stroke} strokeWidth="1.6" fill="none" opacity=".7" />
          <circle cx="22" cy="22" r="15" stroke={stroke} strokeWidth="1.4" fill="none" opacity=".4" />
          <circle cx="22" cy="22" r="20" stroke={stroke} strokeWidth="1.2" fill="none" opacity=".2" />
        </>
      );
    // Marketing — cercles qui rayonnent, campagnes/audience.
    case "agent-marketing":
      return (
        <>
          <circle cx="15" cy="16" r="5" stroke={stroke} strokeWidth="1.8" fill="none" />
          <circle cx="27" cy="15" r="3.4" stroke={stroke} strokeWidth="1.6" fill="none" opacity=".75" />
          <circle cx="24" cy="27" r="6.4" stroke={stroke} strokeWidth="1.8" fill="none" opacity=".55" />
          <circle cx="15" cy="16" r="1.6" fill={stroke} />
        </>
      );
    // Commercial — progression ascendante, opportunités.
    case "agent-commercial":
      return (
        <>
          <path d="M8 30 16 24 24 27 34 12" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <circle cx="34" cy="12" r="2.6" fill={stroke} />
          <path d="M28 12h6v6" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity=".7" />
        </>
      );
    // RH — connexion humaine, deux nœuds reliés.
    case "agent-rh":
      return (
        <>
          <circle cx="15" cy="16" r="4.4" stroke={stroke} strokeWidth="1.8" fill="none" />
          <circle cx="29" cy="16" r="4.4" stroke={stroke} strokeWidth="1.8" fill="none" opacity=".8" />
          <path d="M19 18c3 3 5 3 8 0" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" fill="none" />
          <path d="M12 32c1.5-4.5 5-6.5 10-6.5s8.5 2 10 6.5" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" fill="none" opacity=".5" />
        </>
      );
    // Juridique — structure, documents empilés et équilibrés.
    case "agent-juridique":
      return (
        <>
          <path d="M22 8v26" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M9 15h13M22 15h13" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" opacity=".85" />
          <path d="M9 15l-4 8a4.4 4.4 0 0 0 8 0z" stroke={stroke} strokeWidth="1.4" fill="none" opacity=".55" />
          <path d="M35 15l-4 8a4.4 4.4 0 0 0 8 0z" stroke={stroke} strokeWidth="1.4" fill="none" opacity=".55" />
          <path d="M14 33h16" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
        </>
      );
    // Media — mosaïque de contenus/campagnes.
    case "agent-media":
      return (
        <>
          <rect x="9" y="9" width="10" height="10" rx="2.5" fill={stroke} opacity=".85" />
          <rect x="23" y="9" width="10" height="10" rx="2.5" stroke={stroke} strokeWidth="1.6" opacity=".55" />
          <rect x="9" y="23" width="10" height="10" rx="2.5" stroke={stroke} strokeWidth="1.6" opacity=".55" />
          <rect x="23" y="23" width="10" height="10" rx="2.5" fill={stroke} opacity=".35" />
        </>
      );
    // Finance — courbe de données ascendante, précision.
    case "agent-finance":
      return (
        <>
          <path d="M8 28 15 20 21 24 34 10" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <circle cx="15" cy="20" r="1.8" fill={stroke} />
          <circle cx="21" cy="24" r="1.8" fill={stroke} />
          <circle cx="34" cy="10" r="1.8" fill={stroke} />
          <path d="M8 33h28" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" opacity=".35" />
        </>
      );
    // Direction — coordination, structure concentrique (boussole).
    case "agent-direction":
      return (
        <>
          <circle cx="22" cy="22" r="13" stroke={stroke} strokeWidth="1.6" fill="none" opacity=".5" />
          <path d="M22 22 27 13 22 22 17 31Z" fill={stroke} opacity=".85" />
          <circle cx="22" cy="22" r="2.2" fill={stroke} />
        </>
      );
  }
}

export function AgentVisual({
  slug,
  className = "",
}: {
  slug: string;
  className?: string;
}) {
  const gradientId = useId();
  const validSlug = (
    [
      "agent-hotellerie",
      "agent-call-center",
      "agent-marketing",
      "agent-commercial",
      "agent-rh",
      "agent-juridique",
      "agent-media",
      "agent-finance",
      "agent-direction",
    ] as const
  ).includes(slug as AgentSlug)
    ? (slug as AgentSlug)
    : "agent-direction";

  return (
    <div
      className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-card bg-gradient-to-br from-accent via-[#101b33] to-cobalt-strong ${className}`}
      aria-hidden="true"
    >
      <div className="glow-cobalt absolute inset-0" />
      <svg viewBox="0 0 44 44" className="relative size-[55%]" fill="none">
        <defs>
          <linearGradient id={gradientId} x1="6" y1="8" x2="38" y2="34" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A5FA" />
            <stop offset="1" stopColor="#67E8F9" />
          </linearGradient>
        </defs>
        <Motif slug={validSlug} gradientId={gradientId} />
      </svg>
    </div>
  );
}
