import { cn } from "@/lib/utils";
import {
  NIVEAU_EXPERTISE_INFO,
  NIVEAU_EXPERTISE_ORDER,
  type NiveauExpertise,
} from "@/lib/content/formations-catalogue";

/**
 * Présentation des 3 niveaux d'expertise (Sensibilisation, Approfondissement,
 * Expertise) en cartes équilibrées et responsives — remplace l'ancien
 * affichage en une seule ligne de texte compressée dans une carte étroite,
 * jugé visuellement déséquilibré à côté des cartes "Durée"/"Public".
 *
 * `selected`/`onSelect` sont optionnels : sans eux, le composant est un
 * simple bloc informatif (utilisé sur les pages de formation) ; avec eux,
 * les cartes deviennent cliquables pour servir de filtre (catalogue).
 */
export function NiveauxExpertiseCards({
  selected,
  onSelect,
}: {
  selected?: NiveauExpertise | null;
  onSelect?: (niveau: NiveauExpertise) => void;
}) {
  const interactive = typeof onSelect === "function";
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {NIVEAU_EXPERTISE_ORDER.map((niveau, index) => {
        const isSelected = selected === niveau;
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
            <h3 className="mt-3 text-lg font-semibold tracking-[-0.02em]">{niveau}</h3>
            <p
              className={cn(
                "mt-3 text-sm leading-6",
                isSelected ? "text-white/80" : "text-ink/60",
              )}
            >
              {NIVEAU_EXPERTISE_INFO[niveau].description}
            </p>
          </Comp>
        );
      })}
    </div>
  );
}
