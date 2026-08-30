/**
 * Catalogue secondaire de formations DATA & IA — "Autres thèmes de
 * formations pertinents".
 *
 * Source : fichier `0 Catalogue_Formations_DATA_IA.xlsx` fourni par M.
 * Bassit (onglets "Catalogue 80 formations" et "Segmentation & Légende").
 *
 * Ce catalogue est volontairement séparé du modèle Prisma `Training` (qui
 * porte les 7 formations principales affichées sur /formations) : les deux
 * structures restent conceptuellement distinctes, comme demandé, et aucune
 * migration Prisma n'a été ajoutée pour stocker ces données.
 *
 * Écart documenté avec le fichier source : le classeur et l'onglet
 * "Segmentation & Légende" annoncent un total de 80 modules (28
 * transversaux + 52 sectoriels), mais seules 70 lignes de formation sont
 * physiquement présentes dans l'onglet "Catalogue 80 formations" (23
 * transversales + 47 sectorielles). La numérotation d'origine saute les
 * numéros 3, 17, 18, 27, 28, 30, 40, 43, 67 et 80, signe que 10 lignes ont
 * été supprimées d'une version antérieure à 80 sans mise à jour du titre ni
 * de la légende. Conformément à la décision validée, ce fichier utilise
 * uniquement les 70 lignes réellement présentes comme source de vérité ;
 * aucune formation n'a été inventée pour compléter l'écart.
 */

export type NiveauExpertise =
  "Sensibilisation" | "Approfondissement" | "Expertise";

/** Les deux grandes cibles de formations demandées par M. Bassit. */
export type Cible = "cible-1" | "cible-2";

/** Sous-catégories de type d'organisation, rattachées à une ou deux cibles. */
export type TypeOrganisation =
  | "pme"
  | "grande-entreprise"
  | "institution-secteur-public"
  | "tpe-professions-liberales";

/** Les 6 populations "métier" définies dans l'onglet Segmentation & Légende. */
export type PopulationCode = "DIR" | "ITD" | "COM" | "PROD" | "SUP" | "MNG";

export interface PopulationTag {
  /** null si le libellé brut ne correspond à aucune des 6 populations standards
   * (ex. "Tous publics", "Enseignants") — on ne force pas un rattachement
   * artificiel dans ce cas, cf. consigne explicite. */
  code: PopulationCode | null;
  /** Précision entre parenthèses conservée depuis le fichier source (ex. "Finance"). */
  qualifier?: string;
  /** Libellé brut d'origine, toujours conservé pour l'affichage. */
  rawLabel: string;
}

interface RawCatalogueRow {
  numeroOrigine: number;
  blocCibleBrut: string;
  secteur: string;
  populationCibleBrute: string;
  theme: string;
  niveau: NiveauExpertise;
  prerequis: string;
  dureeJours: number;
}

export interface FormationCatalogueEntry extends RawCatalogueRow {
  cibles: Cible[];
  typesOrganisation: TypeOrganisation[];
  populations: PopulationTag[];
}

// ---------------------------------------------------------------------------
// Données brutes (70 lignes réellement présentes dans le fichier Excel)
// ---------------------------------------------------------------------------

export const RAW_CATALOGUE_ROWS: RawCatalogueRow[] = [
  {
    numeroOrigine: 1,
    blocCibleBrut: "Tous blocs",
    secteur: "Transversal",
    populationCibleBrute: "DIR / Managers / Chefs de projets",
    theme: "IA Générative : comprendre les enjeux et opportunités",
    niveau: "Sensibilisation",
    prerequis: "Aucun",
    dureeJours: 1,
  },
  {
    numeroOrigine: 2,
    blocCibleBrut: "Tous blocs",
    secteur: "Transversal",
    populationCibleBrute: "DIR / Managers / Chefs de projets",
    theme:
      "IA Générative : Cas réels d'usage métiers et Retour sur investissement",
    niveau: "Approfondissement",
    prerequis: "Module Sensibilisation IA Générative",
    dureeJours: 1,
  },
  {
    numeroOrigine: 4,
    blocCibleBrut: "Tous blocs",
    secteur: "Transversal",
    populationCibleBrute: "Tous publics",
    theme: "Data Literacy instaurer une culture de la donnée",
    niveau: "Approfondissement",
    prerequis: "Aucun",
    dureeJours: 1,
  },
  {
    numeroOrigine: 5,
    blocCibleBrut: "Tous blocs",
    secteur: "Transversal",
    populationCibleBrute: "COM / PROD / SUP",
    theme: "Prompt Engineering pour non-informaticiens",
    niveau: "Sensibilisation",
    prerequis: "Aucun",
    dureeJours: 1,
  },
  {
    numeroOrigine: 6,
    blocCibleBrut: "Tous blocs",
    secteur: "Transversal",
    populationCibleBrute: "COM / PROD / SUP / ITD",
    theme: "Prompt Engineering avancé et automatisation",
    niveau: "Approfondissement",
    prerequis: "Prompt Engineering (Sensibilisation)",
    dureeJours: 2,
  },
  {
    numeroOrigine: 7,
    blocCibleBrut: "Tous blocs",
    secteur: "Transversal",
    populationCibleBrute: "DIR / Tous publics",
    theme: "IA Responsable et Éthique de l'IA",
    niveau: "Sensibilisation",
    prerequis: "Aucun",
    dureeJours: 1,
  },
  {
    numeroOrigine: 8,
    blocCibleBrut: "Tous blocs",
    secteur: "Transversal",
    populationCibleBrute: "SUP (Juridique) / DIR",
    theme:
      "Cadre réglementaire de l'IA et protection des données (Loi 09-08, RGPD)",
    niveau: "Approfondissement",
    prerequis: "Aucun",
    dureeJours: 1,
  },
  {
    numeroOrigine: 9,
    blocCibleBrut: "Tous blocs",
    secteur: "Transversal",
    populationCibleBrute: "ITD / DIR",
    theme: "Cybersécurité et IA : nouveaux risques",
    niveau: "Approfondissement",
    prerequis: "Culture IT de base",
    dureeJours: 2,
  },
  {
    numeroOrigine: 10,
    blocCibleBrut: "Tous blocs",
    secteur: "Transversal",
    populationCibleBrute: "ITD / DIR / SUP",
    theme: "Gouvernance de la donnée (Data Governance) : principes",
    niveau: "Approfondissement",
    prerequis: "Data Literacy",
    dureeJours: 2,
  },
  {
    numeroOrigine: 11,
    blocCibleBrut: "Tous blocs",
    secteur: "Transversal",
    populationCibleBrute: "ITD",
    theme: "Data Governance : mise en œuvre opérationnelle",
    niveau: "Expertise",
    prerequis: "Gouvernance de la donnée (Sensibilisation)",
    dureeJours: 3,
  },
  {
    numeroOrigine: 12,
    blocCibleBrut: "Tous blocs",
    secteur: "Transversal",
    populationCibleBrute: "ITD",
    theme: "Introduction à la Data Science",
    niveau: "Sensibilisation",
    prerequis: "Notions de base en mathématiques/statistiques",
    dureeJours: 1,
  },
  {
    numeroOrigine: 13,
    blocCibleBrut: "Tous blocs",
    secteur: "Transversal",
    populationCibleBrute: "ITD",
    theme: "Data Science : fondamentaux pratiques (Python)",
    niveau: "Approfondissement",
    prerequis: "Introduction à la Data Science + Python de base",
    dureeJours: 4,
  },
  {
    numeroOrigine: 14,
    blocCibleBrut: "Tous blocs",
    secteur: "Transversal",
    populationCibleBrute: "ITD",
    theme: "Machine Learning : concepts et algorithmes",
    niveau: "Approfondissement",
    prerequis: "Data Science : fondamentaux pratiques",
    dureeJours: 4,
  },
  {
    numeroOrigine: 15,
    blocCibleBrut: "Tous blocs",
    secteur: "Transversal",
    populationCibleBrute: "ITD",
    theme: "Machine Learning avancé et mise en production",
    niveau: "Expertise",
    prerequis: "Machine Learning : concepts et algorithmes",
    dureeJours: 5,
  },
  {
    numeroOrigine: 16,
    blocCibleBrut: "Tous blocs",
    secteur: "Transversal",
    populationCibleBrute: "ITD",
    theme: "Deep Learning et réseaux de neurones",
    niveau: "Expertise",
    prerequis: "Machine Learning : concepts et algorithmes",
    dureeJours: 5,
  },
  {
    numeroOrigine: 19,
    blocCibleBrut: "Tous blocs",
    secteur: "Transversal",
    populationCibleBrute: "ITD",
    theme: "IA Générative : développer des applications avec les LLM (API)",
    niveau: "Approfondissement",
    prerequis: "Notions de programmation",
    dureeJours: 3,
  },
  {
    numeroOrigine: 20,
    blocCibleBrut: "Tous blocs",
    secteur: "Transversal",
    populationCibleBrute: "ITD",
    theme: "Agents IA et automatisation des workflows (Agentic AI)",
    niveau: "Expertise",
    prerequis: "Développer des applications avec les LLM",
    dureeJours: 3,
  },
  {
    numeroOrigine: 21,
    blocCibleBrut: "Tous blocs",
    secteur: "Transversal",
    populationCibleBrute: "COM / PROD / SUP",
    theme: "No-code / Low-code : créer des solutions IA sans coder",
    niveau: "Approfondissement",
    prerequis: "Prompt Engineering (Sensibilisation)",
    dureeJours: 2,
  },
  {
    numeroOrigine: 22,
    blocCibleBrut: "Tous blocs",
    secteur: "Transversal",
    populationCibleBrute: "SUP (RH)",
    theme: "IA pour les Ressources Humaines",
    niveau: "Approfondissement",
    prerequis: "Aucun",
    dureeJours: 1,
  },
  {
    numeroOrigine: 23,
    blocCibleBrut: "Tous blocs",
    secteur: "Transversal",
    populationCibleBrute: "SUP (Finance)",
    theme: "IA pour la Finance et le Contrôle de gestion",
    niveau: "Approfondissement",
    prerequis: "Aucun",
    dureeJours: 2,
  },
  {
    numeroOrigine: 24,
    blocCibleBrut: "Tous blocs",
    secteur: "Transversal",
    populationCibleBrute: "SUP (Juridique)",
    theme: "IA pour les fonctions Juridiques et Compliance",
    niveau: "Approfondissement",
    prerequis: "Aucun",
    dureeJours: 1,
  },
  {
    numeroOrigine: 25,
    blocCibleBrut: "Tous blocs",
    secteur: "Transversal",
    populationCibleBrute: "COM",
    theme: "IA pour le Marketing et la Relation Client",
    niveau: "Approfondissement",
    prerequis: "Aucun",
    dureeJours: 2,
  },
  {
    numeroOrigine: 26,
    blocCibleBrut: "Tous blocs",
    secteur: "Transversal",
    populationCibleBrute: "ITD / COM",
    theme: "Chatbots et Assistants virtuels : conception et déploiement",
    niveau: "Approfondissement",
    prerequis: "Développer des applications avec les LLM ou IA Marketing",
    dureeJours: 2,
  },
  {
    numeroOrigine: 29,
    blocCibleBrut: "PME",
    secteur: "Plateforme d'annonces immobilières",
    populationCibleBrute: "COM / PROD",
    theme:
      "IA générative pour la rédaction et l'optimisation d'annonces immobilières",
    niveau: "Sensibilisation",
    prerequis: "Aucun",
    dureeJours: 2,
  },
  {
    numeroOrigine: 31,
    blocCibleBrut: "PME",
    secteur: "Plateforme d'annonces immobilières",
    populationCibleBrute: "ITD",
    theme: "Estimation automatisée des prix (AVM - Automated Valuation Model)",
    niveau: "Expertise",
    prerequis: "Machine Learning : concepts et algorithmes",
    dureeJours: 3,
  },
  {
    numeroOrigine: 32,
    blocCibleBrut: "TPE-PME",
    secteur: "Hôtels",
    populationCibleBrute: "COM / PROD",
    theme:
      "IA pour la gestion de la relation client et la personnalisation de l'expérience",
    niveau: "Sensibilisation",
    prerequis: "Aucun",
    dureeJours: 1,
  },
  {
    numeroOrigine: 33,
    blocCibleBrut: "TPE-PME",
    secteur: "Hôtels",
    populationCibleBrute: "SUP (Finance) / PROD",
    theme: "Revenue Management assisté par IA (yield management)",
    niveau: "Approfondissement",
    prerequis: "Notions de gestion hôtelière",
    dureeJours: 2,
  },
  {
    numeroOrigine: 34,
    blocCibleBrut: "TPE-PME",
    secteur: "Hôtels",
    populationCibleBrute: "COM / ITD",
    theme: "Chatbots et conciergerie digitale pour l'hôtellerie",
    niveau: "Approfondissement",
    prerequis: "No-code/Low-code ou Chatbots (module transversal)",
    dureeJours: 2,
  },
  {
    numeroOrigine: 35,
    blocCibleBrut: "TPE-Professions libérales",
    secteur: "Experts comptables",
    populationCibleBrute: "PROD / SUP",
    theme:
      "IA générative pour l'automatisation des tâches comptables et fiscales",
    niveau: "Sensibilisation",
    prerequis: "Aucun",
    dureeJours: 1,
  },
  {
    numeroOrigine: 36,
    blocCibleBrut: "TPE-Professions libérales",
    secteur: "Experts comptables",
    populationCibleBrute: "PROD",
    theme: "Outils IA pour l'audit et la détection d'anomalies financières",
    niveau: "Approfondissement",
    prerequis: "IA pour la Finance (module transversal)",
    dureeJours: 2,
  },
  {
    numeroOrigine: 37,
    blocCibleBrut: "TPE-Professions libérales",
    secteur: "Experts comptables",
    populationCibleBrute: "SUP (Juridique/Fiscal)",
    theme: "IA et conformité fiscale : veille réglementaire automatisée",
    niveau: "Approfondissement",
    prerequis: "Aucun",
    dureeJours: 1,
  },
  {
    numeroOrigine: 38,
    blocCibleBrut: "Grande entreprise",
    secteur: "Banques",
    populationCibleBrute: "DIR",
    theme: "IA et transformation bancaire : panorama et enjeux stratégiques",
    niveau: "Sensibilisation",
    prerequis: "Aucun",
    dureeJours: 1,
  },
  {
    numeroOrigine: 39,
    blocCibleBrut: "Grande entreprise",
    secteur: "Banques",
    populationCibleBrute: "ITD / SUP (Finance/Risque)",
    theme: "Scoring crédit et modèles de risque par IA",
    niveau: "Approfondissement",
    prerequis: "Machine Learning : concepts et algorithmes",
    dureeJours: 3,
  },
  {
    numeroOrigine: 41,
    blocCibleBrut: "Grande entreprise",
    secteur: "Banques",
    populationCibleBrute: "COM / ITD",
    theme:
      "IA générative pour la relation client bancaire (conseiller augmenté, chatbot)",
    niveau: "Approfondissement",
    prerequis: "Développer des applications avec les LLM ou Chatbots",
    dureeJours: 2,
  },
  {
    numeroOrigine: 42,
    blocCibleBrut: "Grande entreprise",
    secteur: "Assurances",
    populationCibleBrute: "DIR",
    theme: "IA et transformation du secteur assurantiel : panorama",
    niveau: "Sensibilisation",
    prerequis: "Aucun",
    dureeJours: 1,
  },
  {
    numeroOrigine: 44,
    blocCibleBrut: "Grande entreprise",
    secteur: "Assurances",
    populationCibleBrute: "PROD / ITD",
    theme:
      "Gestion des sinistres assistée par IA (détection fraude, automatisation)",
    niveau: "Approfondissement",
    prerequis: "Machine Learning : concepts et algorithmes",
    dureeJours: 3,
  },
  {
    numeroOrigine: 45,
    blocCibleBrut: "Grande entreprise",
    secteur: "Assurances",
    populationCibleBrute: "COM",
    theme: "IA générative pour la relation client et les agents généraux",
    niveau: "Approfondissement",
    prerequis: "IA pour le Marketing/Relation Client",
    dureeJours: 1,
  },
  {
    numeroOrigine: 46,
    blocCibleBrut: "Grande entreprise",
    secteur: "Sociétés de gestion d'actifs",
    populationCibleBrute: "DIR / PROD",
    theme: "IA et marchés financiers : panorama et cas d'usage",
    niveau: "Sensibilisation",
    prerequis: "Aucun",
    dureeJours: 1,
  },
  {
    numeroOrigine: 47,
    blocCibleBrut: "Grande entreprise",
    secteur: "Sociétés de gestion d'actifs",
    populationCibleBrute: "ITD / PROD",
    theme: "Analyse prédictive et algorithmes de trading assistés par IA",
    niveau: "Expertise",
    prerequis: "Machine Learning avancé + notions financières",
    dureeJours: 4,
  },
  {
    numeroOrigine: 48,
    blocCibleBrut: "Grande entreprise",
    secteur: "Sociétés de gestion d'actifs",
    populationCibleBrute: "SUP (Finance) / PROD",
    theme: "Reporting et veille financière augmentés par l'IA générative",
    niveau: "Approfondissement",
    prerequis: "IA et marchés financiers (Sensibilisation)",
    dureeJours: 2,
  },
  {
    numeroOrigine: 49,
    blocCibleBrut: "TPE-Professions libérales",
    secteur: "Les experts automobile",
    populationCibleBrute: "PROD",
    theme: "IA générative pour la rédaction de rapports d'expertise",
    niveau: "Sensibilisation",
    prerequis: "Aucun",
    dureeJours: 1,
  },
  {
    numeroOrigine: 50,
    blocCibleBrut: "TPE-Professions libérales",
    secteur: "Les experts automobile",
    populationCibleBrute: "ITD / PROD",
    theme: "Vision par ordinateur pour l'évaluation automatisée des dommages",
    niveau: "Approfondissement",
    prerequis: "Notions IA de base",
    dureeJours: 2,
  },
  {
    numeroOrigine: 51,
    blocCibleBrut: "TPE-Professions libérales",
    secteur: "Les experts automobile",
    populationCibleBrute: "PROD / SUP",
    theme: "IA et lutte contre la fraude à l'assurance automobile",
    niveau: "Approfondissement",
    prerequis: "Aucun",
    dureeJours: 1,
  },
  {
    numeroOrigine: 52,
    blocCibleBrut: "PME",
    secteur: "Les sociétés de communication",
    populationCibleBrute: "COM / PROD",
    theme: "IA générative pour la création de contenus (texte, image, vidéo)",
    niveau: "Sensibilisation",
    prerequis: "Aucun",
    dureeJours: 1,
  },
  {
    numeroOrigine: 53,
    blocCibleBrut: "PME",
    secteur: "Les sociétés de communication",
    populationCibleBrute: "COM / PROD",
    theme: "IA générative : production de contenus avancée et brand voice",
    niveau: "Approfondissement",
    prerequis: "IA générative pour la création de contenus",
    dureeJours: 2,
  },
  {
    numeroOrigine: 54,
    blocCibleBrut: "PME",
    secteur: "Les sociétés de communication",
    populationCibleBrute: "COM / ITD",
    theme: "Analyse de sentiment et veille média augmentée par l'IA",
    niveau: "Approfondissement",
    prerequis: "Aucun",
    dureeJours: 1,
  },
  {
    numeroOrigine: 55,
    blocCibleBrut: "Grande entreprise-PME",
    secteur: "La distribution automobile au Maroc",
    populationCibleBrute: "DIR",
    theme: "IA et transformation de la distribution automobile : panorama",
    niveau: "Sensibilisation",
    prerequis: "Aucun",
    dureeJours: 1,
  },
  {
    numeroOrigine: 56,
    blocCibleBrut: "Grande entreprise-PME",
    secteur: "La distribution automobile au Maroc",
    populationCibleBrute: "PROD / ITD",
    theme: "IA pour la gestion prédictive des stocks et de la supply chain",
    niveau: "Approfondissement",
    prerequis: "Aucun",
    dureeJours: 2,
  },
  {
    numeroOrigine: 57,
    blocCibleBrut: "Grande entreprise-PME",
    secteur: "La distribution automobile au Maroc",
    populationCibleBrute: "COM",
    theme: "Chatbots et assistants commerciaux IA pour la vente automobile",
    niveau: "Approfondissement",
    prerequis: "IA pour le Marketing/Relation Client",
    dureeJours: 1,
  },
  {
    numeroOrigine: 58,
    blocCibleBrut: "Grande entreprise-PME",
    secteur: "La distribution automobile au Maroc",
    populationCibleBrute: "PROD / ITD",
    theme: "Maintenance prédictive assistée par IA (SAV et après-vente)",
    niveau: "Expertise",
    prerequis: "Machine Learning : concepts et algorithmes",
    dureeJours: 3,
  },
  {
    numeroOrigine: 59,
    blocCibleBrut: "PME-Grande entreprise",
    secteur: "Les centres d'appels",
    populationCibleBrute: "DIR / PROD",
    theme:
      "IA générative et centres d'appels : panorama des usages (voicebot, copilotes)",
    niveau: "Sensibilisation",
    prerequis: "Aucun",
    dureeJours: 1,
  },
  {
    numeroOrigine: 60,
    blocCibleBrut: "PME-Grande entreprise",
    secteur: "Les centres d'appels",
    populationCibleBrute: "ITD",
    theme: "Conception et déploiement de voicebots et callbots IA",
    niveau: "Approfondissement",
    prerequis: "Développer des applications avec les LLM",
    dureeJours: 3,
  },
  {
    numeroOrigine: 61,
    blocCibleBrut: "PME-Grande entreprise",
    secteur: "Les centres d'appels",
    populationCibleBrute: "ITD / SUP (Qualité)",
    theme: "Analyse de la voix et du discours (speech analytics) par IA",
    niveau: "Approfondissement",
    prerequis: "Aucun",
    dureeJours: 2,
  },
  {
    numeroOrigine: 62,
    blocCibleBrut: "TPE-PME",
    secteur: "Les agences de voyage",
    populationCibleBrute: "COM / PROD",
    theme:
      "IA générative pour la conception d'itinéraires et offres personnalisées",
    niveau: "Sensibilisation",
    prerequis: "Aucun",
    dureeJours: 1,
  },
  {
    numeroOrigine: 63,
    blocCibleBrut: "TPE-PME",
    secteur: "Les agences de voyage",
    populationCibleBrute: "COM / ITD",
    theme: "Chatbots pour la réservation et le conseil voyage",
    niveau: "Approfondissement",
    prerequis: "No-code/Low-code ou Chatbots (module transversal)",
    dureeJours: 2,
  },
  {
    numeroOrigine: 64,
    blocCibleBrut: "TPE-PME",
    secteur: "Les agences de voyage",
    populationCibleBrute: "SUP (Finance) / PROD",
    theme: "Pricing dynamique et prévision de la demande touristique par IA",
    niveau: "Approfondissement",
    prerequis: "Notions de Data",
    dureeJours: 2,
  },
  {
    numeroOrigine: 65,
    blocCibleBrut: "TPE-Professions libérales",
    secteur: "Les avocats et notaires",
    populationCibleBrute: "PROD (Juristes)",
    theme: "IA générative pour la recherche juridique et la rédaction d'actes",
    niveau: "Sensibilisation",
    prerequis: "Aucun",
    dureeJours: 1,
  },
  {
    numeroOrigine: 66,
    blocCibleBrut: "TPE-Professions libérales",
    secteur: "Les avocats et notaires",
    populationCibleBrute: "PROD (Juristes)",
    theme: "Legal Tech : analyse et revue automatisée de contrats par IA",
    niveau: "Approfondissement",
    prerequis: "IA générative pour la recherche juridique",
    dureeJours: 2,
  },
  {
    numeroOrigine: 68,
    blocCibleBrut: "Institution/Grande entreprise",
    secteur: "L'enseignement supérieur",
    populationCibleBrute: "DIR / Enseignants",
    theme:
      "IA générative dans l'enseignement : enjeux pédagogiques et intégrité académique",
    niveau: "Sensibilisation",
    prerequis: "Aucun",
    dureeJours: 1,
  },
  {
    numeroOrigine: 69,
    blocCibleBrut: "Institution/Grande entreprise",
    secteur: "L'enseignement supérieur",
    populationCibleBrute: "Enseignants",
    theme: "Concevoir des contenus pédagogiques et évaluations assistés par IA",
    niveau: "Approfondissement",
    prerequis: "Module Sensibilisation IA dans l'enseignement",
    dureeJours: 2,
  },
  {
    numeroOrigine: 70,
    blocCibleBrut: "Institution/Grande entreprise",
    secteur: "L'enseignement supérieur",
    populationCibleBrute: "DIR / Enseignants",
    theme:
      "Intégrer l'IA dans les cursus : former les étudiants aux compétences IA",
    niveau: "Approfondissement",
    prerequis: "Aucun",
    dureeJours: 1,
  },
  {
    numeroOrigine: 71,
    blocCibleBrut: "Institution publique",
    secteur: "Collectivités territoriales",
    populationCibleBrute: "DIR (élus/cadres)",
    theme: "IA et modernisation du service public : panorama et enjeux",
    niveau: "Sensibilisation",
    prerequis: "Aucun",
    dureeJours: 1,
  },
  {
    numeroOrigine: 72,
    blocCibleBrut: "Institution publique",
    secteur: "Collectivités territoriales",
    populationCibleBrute: "PROD / SUP",
    theme:
      "IA générative pour l'amélioration des services aux citoyens (guichet, courrier)",
    niveau: "Approfondissement",
    prerequis: "Aucun",
    dureeJours: 2,
  },
  {
    numeroOrigine: 73,
    blocCibleBrut: "Institution publique",
    secteur: "Collectivités territoriales",
    populationCibleBrute: "SUP / DIR",
    theme:
      "Data et pilotage territorial : tableaux de bord et aide à la décision",
    niveau: "Approfondissement",
    prerequis: "Data Literacy",
    dureeJours: 2,
  },
  {
    numeroOrigine: 74,
    blocCibleBrut: "PME-Grande entreprise",
    secteur: "L'industrie",
    populationCibleBrute: "DIR",
    theme: "IA et Industrie 4.0 : panorama et feuille de route",
    niveau: "Sensibilisation",
    prerequis: "Aucun",
    dureeJours: 1,
  },
  {
    numeroOrigine: 75,
    blocCibleBrut: "PME-Grande entreprise",
    secteur: "L'industrie",
    populationCibleBrute: "ITD / PROD",
    theme: "Maintenance prédictive par IA (IoT et capteurs)",
    niveau: "Approfondissement",
    prerequis: "Notions de Data",
    dureeJours: 3,
  },
  {
    numeroOrigine: 76,
    blocCibleBrut: "PME-Grande entreprise",
    secteur: "L'industrie",
    populationCibleBrute: "ITD / PROD",
    theme: "Contrôle qualité par vision industrielle (Computer Vision)",
    niveau: "Expertise",
    prerequis: "Machine Learning : concepts et algorithmes",
    dureeJours: 3,
  },
  {
    numeroOrigine: 77,
    blocCibleBrut: "PME-Grande entreprise",
    secteur: "L'industrie",
    populationCibleBrute: "PROD / ITD",
    theme: "Optimisation de la production et de la supply chain par IA",
    niveau: "Approfondissement",
    prerequis: "Aucun",
    dureeJours: 2,
  },
  {
    numeroOrigine: 78,
    blocCibleBrut: "PME-Grande entreprise",
    secteur: "Les promoteurs immobiliers",
    populationCibleBrute: "COM",
    theme:
      "IA générative pour le marketing et la commercialisation immobilière",
    niveau: "Sensibilisation",
    prerequis: "Aucun",
    dureeJours: 1,
  },
  {
    numeroOrigine: 79,
    blocCibleBrut: "PME-Grande entreprise",
    secteur: "Les promoteurs immobiliers",
    populationCibleBrute: "SUP (Finance) / PROD",
    theme: "Études de faisabilité et analyse de marché assistées par IA",
    niveau: "Approfondissement",
    prerequis: "Aucun",
    dureeJours: 2,
  },
];

// ---------------------------------------------------------------------------
// Normalisation — cible / type d'organisation
// ---------------------------------------------------------------------------

export const CIBLE_LABELS: Record<Cible, string> = {
  "cible-1": "Grandes entreprises et PME",
  "cible-2": "TPE, professions libérales et particuliers",
};

export const TYPE_ORGANISATION_LABELS: Record<TypeOrganisation, string> = {
  pme: "PME",
  "grande-entreprise": "Grande entreprise",
  "institution-secteur-public": "Institution / Secteur public",
  "tpe-professions-liberales": "TPE / Professions libérales",
};

/**
 * Table de correspondance entre les 9 valeurs brutes de "Bloc cible"
 * rencontrées dans le fichier Excel et leur rattachement normalisé aux deux
 * grandes cibles + aux 4 types d'organisation. Les blocs combinés (ex.
 * "Grande entreprise-PME") sont répartis sur plusieurs types sans perdre la
 * valeur d'origine (conservée telle quelle dans `blocCibleBrut`).
 */
const BLOC_CIBLE_MAPPING: Record<
  string,
  { cibles: Cible[]; typesOrganisation: TypeOrganisation[] }
> = {
  "Tous blocs": {
    cibles: ["cible-1", "cible-2"],
    typesOrganisation: [
      "pme",
      "grande-entreprise",
      "institution-secteur-public",
      "tpe-professions-liberales",
    ],
  },
  PME: { cibles: ["cible-1"], typesOrganisation: ["pme"] },
  "TPE-PME": {
    cibles: ["cible-1", "cible-2"],
    typesOrganisation: ["tpe-professions-liberales", "pme"],
  },
  "TPE-Professions libérales": {
    cibles: ["cible-2"],
    typesOrganisation: ["tpe-professions-liberales"],
  },
  "Grande entreprise": {
    cibles: ["cible-1"],
    typesOrganisation: ["grande-entreprise"],
  },
  "Grande entreprise-PME": {
    cibles: ["cible-1"],
    typesOrganisation: ["grande-entreprise", "pme"],
  },
  "PME-Grande entreprise": {
    cibles: ["cible-1"],
    typesOrganisation: ["pme", "grande-entreprise"],
  },
  "Institution/Grande entreprise": {
    cibles: ["cible-1"],
    typesOrganisation: ["institution-secteur-public", "grande-entreprise"],
  },
  "Institution publique": {
    cibles: ["cible-1"],
    typesOrganisation: ["institution-secteur-public"],
  },
};

function resolveBlocCible(blocCibleBrut: string) {
  const mapping = BLOC_CIBLE_MAPPING[blocCibleBrut];
  if (!mapping) {
    throw new Error(
      `Valeur "Bloc cible" inconnue dans le catalogue de formations : "${blocCibleBrut}". Ajoutez-la à BLOC_CIBLE_MAPPING dans lib/content/formations-catalogue.ts.`,
    );
  }
  return mapping;
}

// ---------------------------------------------------------------------------
// Normalisation — population cible
// ---------------------------------------------------------------------------

export const POPULATION_LABELS: Record<PopulationCode, string> = {
  DIR: "Dirigeants / Comité de direction",
  ITD: "IT / Data / Ingénieurs",
  COM: "Commercial / Marketing / Relation client",
  PROD: "Production / Métier opérationnel",
  SUP: "Fonctions support (Finance, RH, Juridique, Compliance)",
  MNG: "Managers / Chefs de projet",
};

const POPULATION_CODE_ALIASES: Record<string, PopulationCode> = {
  DIR: "DIR",
  ITD: "ITD",
  COM: "COM",
  PROD: "PROD",
  SUP: "SUP",
  MNG: "MNG",
};

/**
 * Découpe une valeur brute de "Population cible" (ex. "SUP (Finance) / PROD",
 * "DIR / Managers / Chefs de projets", "Tous publics") en une liste de tags
 * normalisés, en conservant systématiquement le libellé d'origine.
 *
 * Règle de découpage : le fichier source sépare toujours les populations
 * multiples par " / " (espace-slash-espace), tandis que les précisions
 * entre parenthèses utilisent un "/" sans espaces (ex. "Juridique/Fiscal") —
 * ce qui permet de découper sur " / " sans jamais couper une parenthèse.
 */
export function parsePopulationCibleBrute(raw: string): PopulationTag[] {
  const withMergedManagers = raw.replace(
    /Managers\s*\/\s*Chefs de projets?/gi,
    "MNG",
  );
  return withMergedManagers
    .split(" / ")
    .map((segment) => segment.trim())
    .filter(Boolean)
    .map((segment) => {
      const match = segment.match(/^([^(]+?)\s*(?:\(([^)]+)\))?$/);
      const label = (match?.[1] ?? segment).trim();
      const qualifier = match?.[2]?.trim();
      const code = POPULATION_CODE_ALIASES[label.toUpperCase()] ?? null;
      return { code, qualifier, rawLabel: segment };
    });
}

// ---------------------------------------------------------------------------
// Niveaux d'expertise (descriptions demandées par M. Bassit)
// ---------------------------------------------------------------------------

export const NIVEAU_EXPERTISE_ORDER: NiveauExpertise[] = [
  "Sensibilisation",
  "Approfondissement",
  "Expertise",
];

export const NIVEAU_EXPERTISE_INFO: Record<
  NiveauExpertise,
  { description: string }
> = {
  Sensibilisation: {
    description:
      "Découverte des concepts et des enjeux, aucun prérequis, orientée décision et culture générale.",
  },
  Approfondissement: {
    description:
      "Usages métiers concrets, prise en main d'outils, cas pratiques. Prérequis : module Sensibilisation ou culture numérique de base.",
  },
  Expertise: {
    description:
      "Maîtrise technique et opérationnelle, conception/déploiement de solutions. Prérequis : bases techniques (programmation, statistiques) ou module Approfondissement.",
  },
};

// ---------------------------------------------------------------------------
// Assemblage final + sélecteurs
// ---------------------------------------------------------------------------

function normalizeRow(row: RawCatalogueRow): FormationCatalogueEntry {
  const { cibles, typesOrganisation } = resolveBlocCible(row.blocCibleBrut);
  return {
    ...row,
    cibles,
    typesOrganisation,
    populations: parsePopulationCibleBrute(row.populationCibleBrute),
  };
}

export const formationsCatalogue: FormationCatalogueEntry[] =
  RAW_CATALOGUE_ROWS.map(normalizeRow);

export function getFormationsByCible(cible: Cible): FormationCatalogueEntry[] {
  return formationsCatalogue.filter((entry) => entry.cibles.includes(cible));
}

export function getFormationsByTypeOrganisation(
  type: TypeOrganisation,
): FormationCatalogueEntry[] {
  return formationsCatalogue.filter((entry) =>
    entry.typesOrganisation.includes(type),
  );
}

export function getFormationsByNiveau(
  niveau: NiveauExpertise,
): FormationCatalogueEntry[] {
  return formationsCatalogue.filter((entry) => entry.niveau === niveau);
}

/** Formations dont au moins une population correspond au code demandé. */
export function getFormationsByPopulationCode(
  code: PopulationCode,
): FormationCatalogueEntry[] {
  return formationsCatalogue.filter((entry) =>
    entry.populations.some((population) => population.code === code),
  );
}

/** Formations dont au moins une population "hors standard" correspond au
 * libellé brut demandé (ex. "Tous publics", "Enseignants"). */
export function getFormationsByPopulationRawLabel(
  rawLabel: string,
): FormationCatalogueEntry[] {
  return formationsCatalogue.filter((entry) =>
    entry.populations.some(
      (population) =>
        population.code === null && population.rawLabel === rawLabel,
    ),
  );
}

export interface PopulationFilterOption {
  key: string;
  label: string;
  code: PopulationCode | null;
}

/**
 * Liste des options de filtrage "population cible" à proposer dans
 * l'interface : les 6 populations standards (toujours affichées, même sans
 * résultat, pour rester cohérent avec la légende) puis, triées par ordre
 * d'apparition, les valeurs hors-standard réellement présentes dans les
 * données (ex. "Tous publics", "Enseignants") — sans les perdre ni les
 * forcer dans une catégorie incorrecte.
 */
export function getPopulationFilterOptions(): PopulationFilterOption[] {
  const standard: PopulationFilterOption[] = (
    Object.keys(POPULATION_LABELS) as PopulationCode[]
  ).map((code) => ({ key: code, label: POPULATION_LABELS[code], code }));

  const seenOther = new Set<string>();
  const other: PopulationFilterOption[] = [];
  for (const entry of formationsCatalogue) {
    for (const population of entry.populations) {
      if (population.code === null && !seenOther.has(population.rawLabel)) {
        seenOther.add(population.rawLabel);
        other.push({
          key: population.rawLabel,
          label: population.rawLabel,
          code: null,
        });
      }
    }
  }

  return [...standard, ...other];
}

export function getSecteursDisponibles(): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const entry of formationsCatalogue) {
    if (entry.secteur !== "Transversal" && !seen.has(entry.secteur)) {
      seen.add(entry.secteur);
      result.push(entry.secteur);
    }
  }
  return result;
}
