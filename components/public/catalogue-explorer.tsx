"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

import { NiveauxExpertiseCards } from "@/components/public/niveaux-expertise-cards";
import { cn } from "@/lib/utils";
import {
  CIBLE_LABELS,
  TYPE_ORGANISATION_LABELS,
  formationsCatalogue,
  getPopulationFilterOptions,
  populationTagLabel,
  type Cible,
  type NiveauExpertise,
  type TypeOrganisation,
} from "@/lib/content/formations-catalogue";

// Types d'organisation pertinents pour chaque cible (cf. brief : la cible 2
// s'organise "principalement" selon un seul type, donc pas d'étape de
// filtrage supplémentaire nécessaire pour elle).
const TYPES_PAR_CIBLE: Record<Cible, TypeOrganisation[]> = {
  "cible-1": ["pme", "grande-entreprise", "institution-secteur-public"],
  "cible-2": ["tpe-professions-liberales"],
};

const CIBLES: Cible[] = ["cible-1", "cible-2"];

export function CatalogueExplorer({ initialCible }: { initialCible: Cible }) {
  const t = useTranslations("FormationsCatalogue");
  const [cible, setCible] = useState<Cible>(initialCible);
  const [type, setType] = useState<TypeOrganisation | null>(null);
  const [population, setPopulation] = useState<string | null>(null);
  const [niveau, setNiveau] = useState<NiveauExpertise | null>(null);

  const typesDisponibles = TYPES_PAR_CIBLE[cible];

  const byCibleAndType = useMemo(() => {
    return formationsCatalogue.filter((entry) => {
      if (!entry.cibles.includes(cible)) return false;
      if (type && !entry.typesOrganisation.includes(type)) return false;
      return true;
    });
  }, [cible, type]);

  const populationOptions = useMemo(() => {
    const all = getPopulationFilterOptions();
    const present = new Set<string>();
    for (const entry of byCibleAndType) {
      for (const tag of entry.populations) {
        present.add(tag.code ?? tag.rawLabel);
      }
    }
    return all.filter((option) => present.has(option.key));
  }, [byCibleAndType]);

  // Filtré par Cible + Type + Population, sans le Niveau : sert de base au
  // compteur par niveau (le niveau ne doit pas se filtrer lui-même).
  const byCibleTypePopulation = useMemo(() => {
    return byCibleAndType.filter((entry) => {
      if (
        population &&
        !entry.populations.some((tag) => (tag.code ?? tag.rawLabel) === population)
      ) {
        return false;
      }
      return true;
    });
  }, [byCibleAndType, population]);

  const niveauCounts = useMemo(() => {
    const counts: Record<NiveauExpertise, number> = {
      Sensibilisation: 0,
      Approfondissement: 0,
      Expertise: 0,
    };
    for (const entry of byCibleTypePopulation) counts[entry.niveau]++;
    return counts;
  }, [byCibleTypePopulation]);

  const filtered = useMemo(() => {
    return byCibleTypePopulation.filter((entry) => {
      if (niveau && entry.niveau !== niveau) return false;
      return true;
    });
  }, [byCibleTypePopulation, niveau]);

  function resetBelowCible() {
    setType(null);
    setPopulation(null);
    setNiveau(null);
  }

  // Un changement de Type d'organisation invalide potentiellement la
  // Population/le Niveau déjà choisis (options recalculées) : on les
  // réinitialise pour éviter un filtre actif mais invisible.
  function resetBelowType() {
    setPopulation(null);
    setNiveau(null);
  }

  const hasActiveFilters = Boolean(type || population || niveau);

  return (
    <div className="space-y-10">
      {/* Étape 1 : cible */}
      <div className="flex flex-wrap gap-2">
        {CIBLES.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => {
              setCible(value);
              resetBelowCible();
            }}
            className={cn(
              "rounded-pill border px-5 py-2 text-sm font-semibold transition",
              cible === value
                ? "border-accent bg-accent text-white"
                : "border-lime bg-canvas text-ink hover:border-cobalt",
            )}
          >
            {CIBLE_LABELS[value]}
          </button>
        ))}
      </div>

      {/* Étape 2 : type d'organisation (seulement si plusieurs options) */}
      {typesDisponibles.length > 1 && (
        <div>
          <p className="text-ink/45 text-xs font-semibold uppercase tracking-[0.1em]">
            {t("step2")}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {typesDisponibles.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setType(type === value ? null : value);
                  resetBelowType();
                }}
                className={cn(
                  "rounded-pill border px-4 py-1.5 text-sm font-medium transition",
                  type === value
                    ? "border-cobalt bg-cobalt text-white"
                    : "border-lime bg-canvas text-ink hover:border-cobalt",
                )}
              >
                {TYPE_ORGANISATION_LABELS[value]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Étape 3 : population cible */}
      {populationOptions.length > 0 && (
        <div>
          <p className="text-ink/45 text-xs font-semibold uppercase tracking-[0.1em]">
            {t("step3")}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {populationOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() =>
                  setPopulation(population === option.key ? null : option.key)
                }
                className={cn(
                  "rounded-pill border px-4 py-1.5 text-sm font-medium transition",
                  population === option.key
                    ? "border-cobalt bg-cobalt text-white"
                    : "border-lime bg-canvas text-ink hover:border-cobalt",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Étape 4 : niveau d'expertise */}
      <div>
        <p className="text-ink/45 text-xs font-semibold uppercase tracking-[0.1em]">
          {t("step4")}
        </p>
        <div className="mt-3">
          <NiveauxExpertiseCards
            selected={niveau}
            onSelect={(value) => setNiveau(niveau === value ? null : value)}
            counts={niveauCounts}
          />
        </div>
      </div>

      {/* Étape 5 : formations correspondantes */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-ink/45 text-xs font-semibold uppercase tracking-[0.1em]">
            {t("results")}
          </p>
          <div className="flex items-center gap-3">
            <span className="text-ink/50 text-sm">
              {t("resultsCount", { count: filtered.length })}
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetBelowCible}
                className="text-ink/50 hover:text-ink flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.08em]"
              >
                <X className="size-3.5" /> {t("reset")}
              </button>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-ink/50 mt-6 text-sm">{t("empty")}</p>
        ) : (
          <ul className="mt-5 divide-y divide-lime overflow-hidden rounded-3xl border border-lime bg-canvas">
            {filtered.map((entry) => (
              <li key={entry.numeroOrigine} className="p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    {entry.secteur !== "Transversal" && (
                      <span className="eyebrow text-cobalt">{entry.secteur}</span>
                    )}
                    <h3 className="mt-1 text-lg font-semibold tracking-[-0.02em]">
                      {entry.theme}
                    </h3>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-pill px-3 py-1 text-xs font-semibold",
                      entry.niveau === "Sensibilisation" && "bg-lime text-ink",
                      entry.niveau === "Approfondissement" &&
                        "bg-cobalt/10 text-cobalt-strong",
                      entry.niveau === "Expertise" && "bg-accent text-white",
                    )}
                  >
                    {entry.niveau}
                  </span>
                </div>
                {entry.populations.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {entry.populations.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="text-ink/70 rounded-pill bg-lime px-2.5 py-0.5 text-xs font-medium"
                      >
                        {populationTagLabel(tag)}
                      </span>
                    ))}
                  </div>
                )}
                <div className="text-ink/55 mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                  <span>
                    {t("duree")} : {t("joursCount", { count: entry.dureeJours })}
                  </span>
                  {entry.prerequis !== "Aucun" && (
                    <span>
                      {t("prerequis")} : {entry.prerequis}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
