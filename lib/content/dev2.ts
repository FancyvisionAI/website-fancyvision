export const dev2Assets = {
  hero: "/images/fancyvision-ai-strategy.webp",
  audit: "/images/fancyvision-ai-strategy.webp",
  change: "/images/fancyvision-training.webp",
  custom: "/images/fancyvision-data-systems.webp",
  training: "/images/fancyvision-training.webp",
  meeting: "/images/fancyvision-ai-strategy.webp",
  events: "/images/fancyvision-events.webp",
  og: "/images/fancyvision-ai-strategy.webp",
} as const;

export const dev2Services = [
  {
    category: "conseil",
    slug: "audit-ia",
    title: "Audit IA",
    headline: "Audit IA : identifiez les cas d’usage à fort impact",
    description:
      "Cartographiez les opportunités, priorisez les quick wins et repartez avec une feuille de route opérationnelle.",
    image: dev2Assets.audit,
    features: [
      "Cadrage de la mission",
      "Entretiens métiers",
      "Priorisation des cas d’usage",
      "Roadmap de déploiement",
    ],
  },
  {
    category: "conseil",
    slug: "conduite-du-changement",
    title: "Conduite du changement",
    headline:
      "Conduite du changement IA : installez une dynamique durable",
    description:
      "Gouvernance, ambassadeurs, veille et mesure des usages pour faire progresser l’adoption dans la durée.",
    image: dev2Assets.change,
    features: [
      "Gouvernance IA",
      "Animation des ambassadeurs",
      "Veille technologique",
      "Mesure de l’adoption",
    ],
  },
  {
    category: "conseil",
    slug: "developpement-sur-mesure",
    title: "Développement sur-mesure",
    headline: "Agents IA sur mesure : automatisez vos workflows",
    description:
      "Concevez des assistants et automatisations connectés à vos outils, données et contraintes de sécurité.",
    image: dev2Assets.custom,
    features: [
      "Cadrage du besoin",
      "Prototype rapide",
      "Connexion aux outils",
      "Déploiement et suivi",
    ],
  },
  {
    category: "conseil",
    slug: "gestion-des-licences-ia",
    title: "Gestion de licences IA",
    headline: "Gestion externalisée des licences IA",
    description:
      "Sélection, configuration, déploiement sécurisé et pilotage des solutions utilisées par vos équipes.",
    image: dev2Assets.meeting,
    features: [
      "Choix des solutions",
      "Configuration",
      "Déploiement",
      "Suivi des usages",
    ],
  },
  {
    category: "data",
    slug: "strategie-gouvernance",
    title: "Stratégie & gouvernance Data",
    headline: "Construisez une stratégie Data claire et gouvernable",
    description:
      "Alignez les données avec vos objectifs, définissez les responsabilités et installez un cadre de qualité, sécurité et conformité.",
    image: dev2Assets.custom,
    features: [
      "Diagnostic de maturité",
      "Gouvernance et rôles",
      "Qualité des données",
      "Roadmap Data",
    ],
  },
  {
    category: "data",
    slug: "data-engineering",
    title: "Data Engineering",
    headline: "Transformez vos données en fondations fiables",
    description:
      "Concevez des pipelines modernes, automatisez les flux et rendez les données accessibles aux équipes et aux produits.",
    image: dev2Assets.meeting,
    features: [
      "Architecture Data",
      "Pipelines ETL / ELT",
      "Cloud & modernisation",
      "Monitoring des flux",
    ],
  },
  {
    category: "data",
    slug: "business-intelligence",
    title: "Business Intelligence",
    headline: "Pilotez votre activité avec les bons indicateurs",
    description:
      "Créez des tableaux de bord lisibles, des modèles de données cohérents et un reporting réellement utilisé par les métiers.",
    image: dev2Assets.audit,
    features: [
      "Cadrage des KPI",
      "Modélisation analytique",
      "Dashboards interactifs",
      "Adoption des outils BI",
    ],
  },
  {
    category: "data",
    slug: "data-science-ia",
    title: "Data Science & IA",
    headline: "Passez de la donnée à la prédiction",
    description:
      "Développez des modèles prédictifs et des solutions d’IA adaptés aux enjeux de prévision, segmentation et optimisation.",
    image: dev2Assets.change,
    features: [
      "Exploration des données",
      "Modèles prédictifs",
      "MLOps & déploiement",
      "Mesure de performance",
    ],
  },
] as const;

export const dev2Trainings = [
  {
    category: "entreprise",
    slug: "ia-booster",
    title: "IA Booster",
    level: "Débutant",
    headline: "Formation IA Booster : maîtrisez ChatGPT",
    description:
      "Comprendre l’IA générative, structurer ses prompts et gagner du temps sur les tâches quotidiennes.",
    duration: "1 journée",
    audience: "Tous collaborateurs",
    image: dev2Assets.training,
  },
  {
    category: "entreprise",
    slug: "ia-performer",
    title: "IA Performer",
    level: "Avancé",
    headline: "IA Performer : perfectionnement et nouveaux outils",
    description:
      "Développez des workflows plus avancés et apprenez à orchestrer plusieurs modèles et outils.",
    duration: "1 à 2 jours",
    audience: "Utilisateurs confirmés",
    image: dev2Assets.custom,
  },
  {
    category: "entreprise",
    slug: "conferences-ia",
    title: "Conférences IA",
    level: "Sensibilisation",
    headline: "Conférences IA pour vos collaborateurs",
    description:
      "Une intervention dynamique et adaptée à votre secteur pour comprendre les transformations en cours.",
    duration: "1 à 2 heures",
    audience: "Grandes audiences",
    image: dev2Assets.change,
  },
  {
    category: "entreprise",
    slug: "coaching-ia-pour-dirigeant",
    title: "Coaching dirigeant",
    level: "Individuel",
    headline: "Coaching individuel en IA pour dirigeants",
    description:
      "Cinq sessions privées pour accélérer la prise de décision et construire votre feuille de route IA.",
    duration: "5 sessions",
    audience: "Dirigeants et COMEX",
    image: dev2Assets.audit,
  },
  {
    category: "particuliers",
    slug: "ia-productivite",
    title: "IA Productivité",
    level: "Tous niveaux",
    headline: "Formation IA Productivité",
    description:
      "Maîtrisez ChatGPT, Claude et les meilleurs outils pour rédiger, synthétiser et analyser plus vite.",
    duration: "Programme intensif",
    audience: "Indépendants et particuliers",
    image: dev2Assets.training,
  },
  {
    category: "particuliers",
    slug: "ia-vente",
    title: "IA Vente",
    level: "Commercial",
    headline: "Formation IA Vente",
    description:
      "Ciblez vos prospects, personnalisez vos messages et accélérez le suivi commercial avec l’IA.",
    duration: "Programme opérationnel",
    audience: "Commerciaux et entrepreneurs",
    image: dev2Assets.custom,
  },
] as const;

export const dev2Cities = [
  ["paris", "Paris"],
  ["marseille", "Marseille"],
  ["lyon", "Lyon"],
  ["lille", "Lille"],
  ["nantes", "Nantes"],
  ["montpellier", "Montpellier"],
  ["grenoble", "Grenoble"],
  ["clermont-ferrand", "Clermont-Ferrand"],
  ["bordeaux", "Bordeaux"],
  ["angers", "Angers"],
  ["formations-dijon", "Dijon"],
] as const;

export const dev2ArticleCategories = [
  ["actualite", "Actualité"],
  ["chatgpt", "ChatGPT"],
  ["claude", "Claude"],
  ["etudes-et-analyses", "Études et analyses"],
  ["guide-pratiques", "Guide pratiques"],
  ["opinions", "Opinions"],
  ["productivite", "Productivité"],
] as const;

export const dev2Articles = [
  ["analyse-pdf-notebooklm", "Analyser un PDF avec NotebookLM", "Guide pratiques"],
  ["claude-mindmap-projet", "Créer une mindmap de projet avec Claude", "Claude"],
  ["comprendre-ia-definitions", "Comprendre l’IA : les définitions essentielles", "Études et analyses"],
  ["comptes-rendus-reunion-ia", "Automatiser ses comptes rendus de réunion avec l’IA", "Productivité"],
  ["creer-images-reseaux-sociaux-chatgpt", "Créer des images avec ChatGPT", "ChatGPT"],
  ["ecrire-emails-chatgpt", "Mieux écrire ses e-mails avec ChatGPT", "Productivité"],
  ["financement-formation-ia", "Comment financer une formation en IA ?", "Guide pratiques"],
  ["formation-ia-pme", "Pourquoi former les équipes d’une PME à l’IA ?", "Guide pratiques"],
  ["ia-consommation-energetique", "IA et consommation énergétique", "Études et analyses"],
  ["ia-drh", "L’IA au service des ressources humaines", "Actualité"],
  ["ia-la-plus-securisee", "Quelle IA choisir pour protéger ses données ?", "Études et analyses"],
  ["ia-marche-emploi-france", "L’IA et le marché de l’emploi en France", "Études et analyses"],
  ["ia-securite-chatgpt-donnees", "ChatGPT et sécurité des données", "ChatGPT"],
  ["introduction-intelligence-artificielle-chatgpt", "Introduction à l’intelligence artificielle", "ChatGPT"],
  ["peur-mefiance-ia", "Transformer la méfiance en curiosité", "Opinions"],
  ["risques-ia-entreprise-incidents", "Prévenir les risques de l’IA en entreprise", "Études et analyses"],
  ["service-client-chatbot-ia", "Améliorer le service client avec les chatbots", "Productivité"],
  ["tribune-du-prompt-au-contexte", "Du prompt au contexte", "Opinions"],
  ["veille-juridique-notaires", "Faciliter la veille juridique avec l’IA", "Guide pratiques"],
] as const;

export const dev2Faq = [
  [
    "Comment commencer à intégrer l’IA ?",
    "Commencez par une formation pour créer une culture commune ou par un audit pour cartographier et prioriser les opportunités.",
  ],
  [
    "Pouvez-vous former plusieurs centaines de personnes ?",
    "Oui. Les parcours sont segmentés par métier, niveau, zone géographique et calendrier de déploiement.",
  ],
  [
    "Quand voit-on les premiers résultats ?",
    "Les premiers gains apparaissent souvent dès les jours suivant la formation. Un audit complet dure généralement quatre à six semaines.",
  ],
  [
    "Comment mesurez-vous les résultats ?",
    "Nous suivons l’adoption, le temps gagné, la qualité produite et la satisfaction des participants.",
  ],
] as const;

export const dev2Events = [
  {
    id: "booster-paris",
    title: "IA Booster — session intensive",
    type: "Formation FancyVision",
    audience: "Entreprise",
    location: "Paris · La Boétie",
    host: "Équipe FancyVision",
    offsetDays: 2,
    hour: 18,
    image: dev2Assets.events,
    href: "/formations/ia-booster",
  },
  {
    id: "conference-agents",
    title: "Agents IA : de l’idée au premier workflow",
    type: "FancyVision Lab",
    audience: "Ouvert à tous",
    location: "En ligne",
    host: "FancyVision Lab",
    offsetDays: 8,
    hour: 15,
    image: dev2Assets.events,
    href: "/formations/conferences-ia",
  },
  {
    id: "performer-lyon",
    title: "IA Performer — niveau avancé",
    type: "Formation FancyVision",
    audience: "Entreprise",
    location: "Lyon",
    host: "Équipe FancyVision",
    offsetDays: 15,
    hour: 9,
    image: dev2Assets.events,
    href: "/formations/ia-performer",
  },
  {
    id: "productivite-online",
    title: "Atelier IA Productivité",
    type: "Atelier en direct",
    audience: "Particuliers",
    location: "En ligne",
    host: "FancyVision Academy",
    offsetDays: 23,
    hour: 14,
    image: dev2Assets.events,
    href: "/formations/ia-productivite",
  },
  {
    id: "vente-bordeaux",
    title: "IA Vente — prospecter avec méthode",
    type: "Formation FancyVision",
    audience: "Particuliers",
    location: "Bordeaux",
    host: "FancyVision Academy",
    offsetDays: 31,
    hour: 9,
    image: dev2Assets.events,
    href: "/formations/ia-vente",
  },
  {
    id: "ai-breakfast",
    title: "Petit-déjeuner des décideurs IA",
    type: "Rencontre privée",
    audience: "Entreprise",
    location: "Paris",
    host: "FancyVision Conseil",
    offsetDays: 40,
    hour: 8,
    image: dev2Assets.events,
    href: "/rendez-vous",
  },
] as const;
