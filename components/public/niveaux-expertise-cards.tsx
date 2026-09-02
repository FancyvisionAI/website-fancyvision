"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import {
  NIVEAU_EXPERTISE_ORDER,
  type NiveauExpertise,
} from "@/lib/content/formations-catalogue";

// Les 3 niveaux sont génériques (pas liés à une formation précise) : leur
// libellé et leur description viennent des traductions Pages.trainingDetail
// (déjà utilisées pour la carte "Niveau" des formations non ALL_LEVELS)
// plutôt que des constantes françaises de formations-catalogue.ts.
export const LEVEL_TRANSLATION_KEYS: Record<
  NiveauExpertise,
  { label: string; description: string }
> = {
  Sensibilisation: { label: "levelBeginner", description: "levelBeginnerDescription" },
  Approfondissement: { label: "levelIntermediate", description: "levelIntermediateDescription" },
  Expertise: { label: "levelAdvanced", description: "levelAdvancedDescription" },
};

/**
 * Présentation des 3 niveaux d'expertise (Sensibilisation, Approfondissement,
 * Expertise) en cartes équilibrées et responsives — remplace l'ancien
 * affichage en une seule ligne de texte compressée dans une carte étroite,
 * jugé visuellement déséquilibré à côté des cartes "Durée"/"Public".
 *
 * `selected`/`onSelect` sont optionnels : sans eux, le composant est un
 * simple bloc informatif (utilisé sur les pages de formation) ; avec eux,
 * les cartes deviennent cliquables pour servir de filtre (catalogue).
 *
 * `counts` (optionnel) affiche, sous chaque description, le nombre de
 * formations disponibles pour ce niveau dans le contexte de filtres courant
 * (catalogue) ; un niveau à 0 résultat reste cliquable (pas de blocage de
 * parcours) mais s'affiche visuellement atténué.
 */
export function NiveauxExpertiseCards({
  selected,
  onSelect,
  counts,
}: {
  selected?: NiveauExpertise | null;
  onSelect?: (niveau: NiveauExpertise) => void;
  counts?: Partial<Record<NiveauExpertise, number>>;
}) {
  const t = useTranslations("FormationsCatalogue");
  const tLevel = useTranslations("Pages.trainingDetail");
  const interactive = typeof onSelect === "function";
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {NIVEAU_EXPERTISE_ORDER.map((niveau, index) => {
        const isSelected = selected === niveau;
        const count = counts?.[niveau];
        const isEmpty = count === 0;
        const Comp = interactive ? "button" : "div";
        return (
          <Comp
            key={niveau}
            type={interactive ? "button" : undefined}
            onClick={interactive ? () => onSelect(niveau) : undefined}
            aria-pressed={interactive ? isSelected : undefined}
            className={cn(
              "rounded-3xl border p-6 text-left transition",
              interactive && "cursor-pointer",
              isSelected
                ? "border-accent bg-accent text-white"
                : "border-lime bg-canvas hover:border-cobalt",
              isEmpty && !isSelected && "opacity-50",
            )}
          >
            <span
              className={cn(
                "text-xs font-semibold uppercase tracking-[0.1em]",
                isSelected ? "text-white/60" : "text-ink/40",
              )}
            >
              0{index + 1}
            </span>
            <h3 className="mt-3 text-lg font-semibold tracking-[-0.02em]">
              {tLevel(LEVEL_TRANSLATION_KEYS[niveau].label)}
            </h3>
            <p
              className={cn(
                "mt-3 text-sm leading-6",
                isSelected ? "text-white/80" : "text-ink/60",
              )}
            >
              {tLevel(LEVEL_TRANSLATION_KEYS[niveau].description)}
            </p>
            {count !== undefined && (
              <p
                className={cn(
                  "mt-3 text-xs font-semibold uppercase tracking-[0.08em]",
                  isSelected ? "text-white/70" : "text-cobalt-strong",
                )}
              >
                {t("resultsCount", { count })}
              </p>
            )}
          </Comp>
        );
      })}
    </div>
  );
}
