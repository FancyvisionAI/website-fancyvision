"use client";

import { useId } from "react";

// Identité visuelle des secteurs ("Solutions pensées pour votre secteur") :
// même famille que AgentVisual (dégradé de marque accent -> cobalt-strong,
// motif abstrait au trait, non figuratif). Un motif géométrique distinct par
// secteur pour rester reconnaissable, sans photo ni illustration IA
// générique. Purement décoratif (aria-hidden) : le nom réel du secteur reste
// porté par le texte à côté.
type SectorSlug =
  | "secteur-immobilier-annonces"
  | "secteur-hotellerie-restauration"
  | "secteur-banques"
  | "secteur-assurances"
  | "secteur-gestion-actifs"
  | "secteur-communication"
  | "secteur-distribution-automobile"
  | "secteur-promoteurs-immobiliers"
  | "secteur-enseignement-superieur"
  | "secteur-industrie-manufacturiere"
  | "secteur-presse-audiovisuel"
  | "secteur-centres-appels"
  | "secteur-collectivites-territoriales"
  | "secteur-experts-automobile"
  | "secteur-agences-voyage"
  | "secteur-avocats-notaires"
  | "secteur-experts-comptables"
  | "secteur-a-valider";

function Motif({ slug, gradientId }: { slug: SectorSlug; gradientId: string }) {
  const stroke = `url(#${gradientId})`;
  switch (slug) {
    // Immobilier / annonces — silhouette de bâtiment simple.
    case "secteur-immobilier-annonces":
      return (
        <>
          <path d="M10 34V18l12-8 12 8v16" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M18 34V24h8v10" stroke={stroke} strokeWidth="1.6" strokeLinejoin="round" fill="none" opacity=".7" />
          <path d="M8 34h28" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" opacity=".4" />
        </>
      );
    // Hôtellerie / restauration — fourchette et couteau croisés.
    case "secteur-hotellerie-restauration":
      return (
        <>
          <path d="M15 8v14a3 3 0 0 0 3 3v11" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" fill="none" />
          <path d="M12 8v9M15 8v9M18 8v9" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" opacity=".8" />
          <path d="M29 8c-3 2-3 8 0 11v17" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity=".85" />
        </>
      );
    // Banques — fronton triangulaire et colonnes.
    case "secteur-banques":
      return (
        <>
          <path d="M8 18 22 9l14 9" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M10 18h24v3H10z" fill={stroke} opacity=".85" />
          <path d="M13 24v8M20 24v8M27 24v8M34 24v8" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" opacity=".7" />
          <path d="M9 34h26" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
        </>
      );
    // Assurances — bouclier avec point central.
    case "secteur-assurances":
      return (
        <>
          <path d="M22 8 34 12v10c0 8-5 12.5-12 14-7-1.5-12-6-12-14V12z" stroke={stroke} strokeWidth="1.8" strokeLinejoin="round" fill="none" />
          <path d="M17 22l4 4 7-8" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity=".85" />
        </>
      );
    // Gestion d'actifs — barres ascendantes (portefeuille).
    case "secteur-gestion-actifs":
      return (
        <>
          <path d="M9 33h26" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" opacity=".4" />
          <rect x="11" y="24" width="5" height="9" rx="1.2" fill={stroke} opacity=".5" />
          <rect x="19.5" y="18" width="5" height="15" rx="1.2" fill={stroke} opacity=".75" />
          <rect x="28" y="11" width="5" height="22" rx="1.2" fill={stroke} />
        </>
      );
    // Communication — bulle de dialogue et ondes.
    case "secteur-communication":
      return (
        <>
          <path d="M10 12h20a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H20l-6 5v-5h-4a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3Z" stroke={stroke} strokeWidth="1.7" strokeLinejoin="round" fill="none" />
          <path d="M29 9c2.5 1 4 3 4 5" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" fill="none" opacity=".6" />
          <path d="M32 6c3.5 1.5 5.5 4.5 5.5 8" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" fill="none" opacity=".35" />
        </>
      );
    // Distribution automobile — silhouette de véhicule.
    case "secteur-distribution-automobile":
      return (
        <>
          <path d="M8 27c0-5 3-9 7-10h14c4 1 7 5 7 10" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <path d="M6 27h32" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="14" cy="29" r="3.2" fill={stroke} />
          <circle cx="30" cy="29" r="3.2" fill={stroke} />
        </>
      );
    // Promoteurs immobiliers — grue de chantier.
    case "secteur-promoteurs-immobiliers":
      return (
        <>
          <path d="M12 36V10" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M12 12 34 16" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M12 16 22 14" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" opacity=".7" />
          <path d="M31 16v6" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" opacity=".85" />
          <rect x="8" y="34" width="9" height="4" rx="1" fill={stroke} opacity=".6" />
        </>
      );
    // Enseignement supérieur — toque de diplômé.
    case "secteur-enseignement-superieur":
      return (
        <>
          <path d="M22 12 38 19 22 26 6 19Z" stroke={stroke} strokeWidth="1.7" strokeLinejoin="round" fill="none" />
          <path d="M14 22v6c0 2.5 3.5 4.5 8 4.5s8-2 8-4.5v-6" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity=".7" />
          <path d="M34 19v8" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" opacity=".6" />
        </>
      );
    // Industrie manufacturière — usine et cheminées.
    case "secteur-industrie-manufacturiere":
      return (
        <>
          <path d="M8 34V20l8 5v-5l8 5v-5l8 5v9Z" stroke={stroke} strokeWidth="1.7" strokeLinejoin="round" fill="none" />
          <path d="M12 20v-6M28 20v-8" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" opacity=".7" />
          <path d="M6 34h32" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
        </>
      );
    // Presse / audiovisuel — lecture et diffusion.
    case "secteur-presse-audiovisuel":
      return (
        <>
          <circle cx="20" cy="22" r="13" stroke={stroke} strokeWidth="1.6" fill="none" opacity=".55" />
          <path d="M17 16.5 26 22l-9 5.5Z" fill={stroke} />
          <path d="M31 14c3 2.5 3 11.5 0 15" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" fill="none" opacity=".5" />
        </>
      );
    // Centres d'appels — casque téléphonique.
    case "secteur-centres-appels":
      return (
        <>
          <path d="M10 24v-2a12 12 0 0 1 24 0v2" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <rect x="7" y="22" width="6" height="9" rx="2.5" fill={stroke} opacity=".85" />
          <rect x="31" y="22" width="6" height="9" rx="2.5" stroke={stroke} strokeWidth="1.6" fill="none" opacity=".7" />
          <path d="M34 31v1.5a3 3 0 0 1-3 3h-3" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity=".7" />
        </>
      );
    // Collectivités territoriales — mairie et fronton arrondi.
    case "secteur-collectivites-territoriales":
      return (
        <>
          <path d="M9 20a13 13 0 0 1 26 0" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <path d="M9 20v13M35 20v13" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" opacity=".7" />
          <path d="M6 33h32" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M22 7V4M22 4l4 2-4 2Z" stroke={stroke} strokeWidth="1.3" strokeLinejoin="round" fill={stroke} opacity=".6" />
        </>
      );
    // Experts automobile — loupe d'inspection.
    case "secteur-experts-automobile":
      return (
        <>
          <path d="M9 26c0-4 2.5-7 6-8h12c3.5 1 6 4 6 8" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" fill="none" opacity=".55" />
          <path d="M7 26h30" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" opacity=".55" />
          <circle cx="26" cy="17" r="7" stroke={stroke} strokeWidth="1.8" fill="none" />
          <path d="M31 22l4.5 4.5" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        </>
      );
    // Agences de voyage — trajectoire de vol.
    case "secteur-agences-voyage":
      return (
        <>
          <path d="M8 30c8-14 20-20 28-18" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeDasharray="1 5" fill="none" opacity=".6" />
          <path d="M31 8 38 12l-3 7-2.5-3.5L29 17l-1.5-2 4-4-3-1.5Z" fill={stroke} />
        </>
      );
    // Avocats et notaires — balance de la justice.
    case "secteur-avocats-notaires":
      return (
        <>
          <path d="M22 8v25M14 33h16" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M8 14h13M22 14h13" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" opacity=".85" />
          <path d="M8 14l-3.5 7a4 4 0 0 0 7.4 0Z" stroke={stroke} strokeWidth="1.4" fill="none" opacity=".55" />
          <path d="M35 14l-3.5 7a4 4 0 0 0 7.4 0Z" stroke={stroke} strokeWidth="1.4" fill="none" opacity=".55" />
        </>
      );
    // Experts-comptables — registre et validation.
    case "secteur-experts-comptables":
      return (
        <>
          <rect x="11" y="8" width="18" height="26" rx="2" stroke={stroke} strokeWidth="1.7" fill="none" />
          <path d="M15 15h10M15 20h10M15 25h6" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" opacity=".7" />
          <path d="M27 26l3 3 6-7" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </>
      );
    // Secteur à valider — traitement neutre, aucun contenu métier inventé.
    case "secteur-a-valider":
      return <circle cx="22" cy="22" r="12" stroke={stroke} strokeWidth="1.6" strokeDasharray="4 5" fill="none" opacity=".6" />;
  }
}

export function SectorVisual({ slug, className = "" }: { slug: string; className?: string }) {
  const gradientId = useId();
  const validSlug = (
    [
      "secteur-immobilier-annonces",
      "secteur-hotellerie-restauration",
      "secteur-banques",
      "secteur-assurances",
      "secteur-gestion-actifs",
      "secteur-communication",
      "secteur-distribution-automobile",
      "secteur-promoteurs-immobiliers",
      "secteur-enseignement-superieur",
      "secteur-industrie-manufacturiere",
      "secteur-presse-audiovisuel",
      "secteur-centres-appels",
      "secteur-collectivites-territoriales",
      "secteur-experts-automobile",
      "secteur-agences-voyage",
      "secteur-avocats-notaires",
      "secteur-experts-comptables",
      "secteur-a-valider",
    ] as const
  ).includes(slug as SectorSlug)
    ? (slug as SectorSlug)
    : "secteur-a-valider";

  return (
    <div
      aria-hidden="true"
      className={`glow-cobalt relative flex size-14 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-accent via-[#101b33] to-cobalt-strong transition-transform duration-500 motion-safe:group-hover:scale-110 motion-safe:group-hover:-rotate-3 ${className}`}
    >
      <svg viewBox="0 0 44 44" className="relative size-[62%]" fill="none">
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
