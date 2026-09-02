"use client";

import { useMemo, useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import {
  LEVEL_TRANSLATION_KEYS,
  NiveauxExpertiseCards,
} from "@/components/public/niveaux-expertise-cards";
import { TrainingRequestDialog } from "@/components/public/training-request-dialog";
import { cn } from "@/lib/utils";
import {
  getFormationsCatalogue,
  getPopulationFilterOptions,
  populationTagLabel,
  type Cible,
  type NiveauExpertise,
  type PopulationCode,
  type TypeOrganisation,
} from "@/lib/content/formations-catalogue";

// Types d'organisation pertinents pour chaque cible (cf. brief : la cible 2
// s'organise "principalement" selon un seul type, donc pas d'étape de
// filtrage supplémentaire nécessaire pour elle).
const TYPES_PAR_CIBLE: Record<Cible, TypeOrganisation[]> = {
  "cible-1": ["pme", "grande-entreprise", "institution-secteur-public"],
  "cible-2": ["tpe-professions-liberales"],
};

// Phase 2 (traduction EN) : `entry.prerequis` vaut "Aucun" en FR et "None"
// en EN — la condition d'affichage doit comparer contre le bon sentinel
// selon la locale active, sinon "None" s'afficherait à tort comme un vrai
// prérequis sur la version anglaise.
const NO_PREREQUIS_LABEL: Record<string, string> = { fr: "Aucun", en: "None" };

// Phase 3 (traduction des libellés visibles) : ces valeurs (cible, type
// d'organisation, population) restent les clés techniques utilisées par la
// logique de filtrage — seule leur correspondance vers une clé de
// traduction next-intl (namespace FormationsCatalogue) est ajoutée ici.
const CIBLE_LABEL_KEYS: Record<Cible, string> = {
  "cible-1": "cibleGrandesEntreprises",
  "cible-2": "cibleTpe",
};

const TYPE_LABEL_KEYS: Record<TypeOrganisation, string> = {
  pme: "typePme",
  "grande-entreprise": "typeGrandeEntreprise",
  "institution-secteur-public": "typeInstitutionSecteurPublic",
  "tpe-professions-liberales": "typeTpeProfessionsLiberales",
};

const POPULATION_LABEL_KEYS: Record<PopulationCode, string> = {
  DIR: "populationDir",
  ITD: "populationItd",
  COM: "populationCom",
  PROD: "populationProd",
  SUP: "populationSup",
  MNG: "populationMng",
};

export function CatalogueExplorer({ initialCible }: { initialCible: Cible }) {
  const t = useTranslations("FormationsCatalogue");
  const tLevel = useTranslations("Pages.trainingDetail");
  const locale = useLocale();
  const populationLabels = useMemo(
    () =>
      Object.fromEntries(
        (Object.keys(POPULATION_LABEL_KEYS) as PopulationCode[]).map(
          (code) => [code, t(POPULATION_LABEL_KEYS[code])],
        ),
      ) as Record<PopulationCode, string>,
    [t],
  );
  const [cible, setCible] = useState<Cible>(initialCible);
  const [type, setType] = useState<TypeOrganisation | null>(null);
  const [population, setPopulation] = useState<string | null>(null);
  const [niveau, setNiveau] = useState<NiveauExpertise | null>(null);
  const [selectedTraining, setSelectedTraining] = useState<string | null>(null);

  const typesDisponibles = TYPES_PAR_CIBLE[cible];

  // Catalogue résolu dans la langue active : contenu des 70 formations
  // (theme/secteur/prerequis/populationCibleBrute) traduit (Phase 2).
  const entries = useMemo(() => getFormationsCatalogue(locale), [locale]);

  const byCibleAndType = useMemo(() => {
    return entries.filter((entry) => {
      if (!entry.cibles.includes(cible)) return false;
      if (type && !entry.typesOrganisation.includes(type)) return false;
      return true;
    });
  }, [entries, cible, type]);

  const populationOptions = useMemo(() => {
    const all = getPopulationFilterOptions(entries, populationLabels);
    const present = new Set<string>();
    for (const entry of byCibleAndType) {
      for (const tag of entry.populations) {
        present.add(tag.code ?? tag.rawLabel);
      }
    }
    return all.filter((option) => present.has(option.key));
  }, [entries, populationLabels, byCibleAndType]);

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
  const otherCible: Cible = cible === "cible-1" ? "cible-2" : "cible-1";

  return (
    <div className="space-y-10">
      {/* La cible est déterminée en amont (lien "Autres thèmes de formations
          pertinentes" depuis la section correspondante) : ce n'est plus une
          étape de choix, seulement un rappel + une échappatoire pour changer
          de cible si l'utilisateur s'est trompé de lien. */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-lime px-5 py-4">
        <div>
          <p className="text-ink/45 text-xs font-semibold uppercase tracking-[0.1em]">
            {t("cibleLabel")}
          </p>
          <p className="mt-1 text-lg font-semibold">{t(CIBLE_LABEL_KEYS[cible])}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setCible(otherCible);
            resetBelowCible();
          }}
          className="text-cobalt-strong text-sm font-semibold hover:underline"
        >
          {t("switchCible", { cible: t(CIBLE_LABEL_KEYS[otherCible]) })}
        </button>
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
                {t(TYPE_LABEL_KEYS[value])}
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
                    {tLevel(LEVEL_TRANSLATION_KEYS[entry.niveau].label)}
                  </span>
                </div>
                {entry.populations.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {entry.populations.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="text-ink/70 rounded-pill bg-lime px-2.5 py-0.5 text-xs font-medium"
                      >
                        {populationTagLabel(tag, populationLabels)}
                      </span>
                    ))}
                  </div>
                )}
                <div className="text-ink/55 mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                  <span>
                    {t("duree")} : {t("joursCount", { count: entry.dureeJours })}
                  </span>
                  {entry.prerequis !== (NO_PREREQUIS_LABEL[locale] ?? NO_PREREQUIS_LABEL.fr) && (
                    <span>
                      {t("prerequis")} : {entry.prerequis}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedTraining(entry.theme)}
                  className="text-cobalt-strong mt-4 inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
                >
                  {t("chooseTraining")} <ArrowRight className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <TrainingRequestDialog
        training={selectedTraining}
        onOpenChange={(open) => {
          if (!open) setSelectedTraining(null);
        }}
      />
    </div>
  );
}
