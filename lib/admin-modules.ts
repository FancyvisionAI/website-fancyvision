export type AdminField = {
  name: string;
  label: string;
  type?:
    | "text"
    | "textarea"
    | "number"
    | "boolean"
    | "select"
    | "richtext"
    | "json"
    | "media"
    | "relation"
    | "list";
  options?: Array<{ label: string; value: string }>;
  required?: boolean;
  /** Uniquement pour type "media" : restreint le sélecteur au bon type de fichier. */
  mediaKind?: "image" | "pdf";
  /** Uniquement pour type "relation" : clé dans `relationOptions` fournie par la page admin. */
  relationOptionsKey?: string;
};

export type AdminModule = {
  title: string;
  description: string;
  singular: string;
  fields: AdminField[];
  readonly?: boolean;
  exportable?: boolean;
  allowCreate?: boolean;
  allowDelete?: boolean;
};

const statusOptions = [
  { label: "Brouillon", value: "DRAFT" },
  { label: "Planifié", value: "SCHEDULED" },
  { label: "Publié", value: "PUBLISHED" },
  { label: "Archivé", value: "ARCHIVED" },
];

const localeOptions = [
  { label: "Français", value: "fr" },
  { label: "English", value: "en" },
];

const difficultyOptions = [
  { label: "Débutant", value: "BEGINNER" },
  { label: "Intermédiaire", value: "INTERMEDIATE" },
  { label: "Avancé", value: "ADVANCED" },
  { label: "Tous niveaux", value: "ALL_LEVELS" },
];

export const adminModules: Record<string, AdminModule> = {
  pages: {
    title: "Pages & accueil",
    description:
      "Titres, sections, visibilité, ordre et métadonnées des pages publiques.",
    singular: "page",
    fields: [
      { name: "title", label: "Titre", required: true },
      { name: "slug", label: "Slug", required: true },
      { name: "headline", label: "Titre principal" },
      { name: "description", label: "Description", type: "textarea" },
      {
        name: "status",
        label: "Statut",
        type: "select",
        options: statusOptions,
      },
    ],
  },
  services: {
    title: "Services",
    description:
      "Gérez l’offre de conseil, son ordre, sa publication et son référencement.",
    singular: "service",
    fields: [
      { name: "title", label: "Titre", required: true },
      { name: "slug", label: "Slug", required: true },
      { name: "excerpt", label: "Résumé", type: "textarea", required: true },
      { name: "content", label: "Contenu", type: "richtext" },
      { name: "icon", label: "Icône" },
      { name: "image", label: "Image", type: "media", mediaKind: "image" },
      {
        name: "categoryId",
        label: "Catégorie",
        type: "relation",
        relationOptionsKey: "categories",
      },
      {
        name: "status",
        label: "Statut",
        type: "select",
        options: statusOptions,
      },
      { name: "featured", label: "Mis en avant", type: "boolean" },
      { name: "order", label: "Ordre", type: "number" },
    ],
  },
  trainings: {
    title: "Formations",
    description:
      "Programmes, tarifs, objectifs, supports, formateurs et publication.",
    singular: "formation",
    fields: [
      { name: "title", label: "Titre", required: true },
      { name: "slug", label: "Slug", required: true },
      { name: "excerpt", label: "Résumé", type: "textarea", required: true },
      { name: "content", label: "Contenu", type: "richtext" },
      { name: "duration", label: "Durée" },
      {
        name: "difficulty",
        label: "Niveau",
        type: "select",
        options: difficultyOptions,
      },
      { name: "priceCents", label: "Prix (centimes)", type: "number" },
      { name: "instructor", label: "Formateur" },
      { name: "image", label: "Image", type: "media", mediaKind: "image" },
      { name: "pdfUrl", label: "PDF", type: "media", mediaKind: "pdf" },
      {
        name: "categoryId",
        label: "Catégorie",
        type: "relation",
        relationOptionsKey: "categories",
      },
      {
        name: "objectives",
        label: "Objectifs (un par ligne)",
        type: "list",
      },
      {
        name: "audience",
        label: "Public visé (un par ligne)",
        type: "list",
      },
      {
        name: "modules",
        label: "Programme (JSON — tableau de {title, description})",
        type: "json",
      },
      {
        name: "status",
        label: "Statut",
        type: "select",
        options: statusOptions,
      },
      { name: "featured", label: "Mis en avant", type: "boolean" },
      {
        name: "order",
        label: "Ordre d'affichage",
        type: "number",
      },
    ],
  },
  articles: {
    title: "Blog",
    description:
      "CMS éditorial avec brouillons, planification, couverture et SEO.",
    singular: "article",
    fields: [
      { name: "title", label: "Titre", required: true },
      { name: "slug", label: "Slug", required: true },
      { name: "excerpt", label: "Chapeau", type: "textarea", required: true },
      { name: "content", label: "Article", type: "richtext" },
      {
        name: "coverImage",
        label: "Image de couverture",
        type: "media",
        mediaKind: "image",
      },
      {
        name: "categoryId",
        label: "Catégorie",
        type: "relation",
        relationOptionsKey: "categories",
      },
      { name: "readingTime", label: "Lecture (min)", type: "number" },
      {
        name: "status",
        label: "Statut",
        type: "select",
        options: statusOptions,
      },
      { name: "featured", label: "Mis en avant", type: "boolean" },
    ],
  },
  team: {
    title: "Équipe",
    description: "Profils, biographies, photos et ordre d’affichage.",
    singular: "membre",
    fields: [
      { name: "name", label: "Nom", required: true },
      { name: "position", label: "Poste", required: true },
      {
        name: "biography",
        label: "Biographie",
        type: "textarea",
        required: true,
      },
      { name: "picture", label: "Photo" },
      { name: "linkedin", label: "LinkedIn" },
      { name: "order", label: "Ordre", type: "number" },
      { name: "visible", label: "Visible", type: "boolean" },
    ],
  },
  "case-studies": {
    title: "Études de cas",
    description: "Problème, solution, résultats, métriques et galerie client.",
    singular: "étude de cas",
    fields: [
      { name: "title", label: "Titre", required: true },
      { name: "slug", label: "Slug", required: true },
      { name: "company", label: "Entreprise", required: true },
      { name: "sector", label: "Secteur" },
      { name: "teamSize", label: "Taille d’équipe", type: "number" },
      { name: "excerpt", label: "Résumé", type: "textarea", required: true },
      { name: "before", label: "Avant", type: "textarea" },
      { name: "after", label: "Après", type: "textarea" },
      { name: "content", label: "Récit", type: "richtext" },
      {
        name: "coverImage",
        label: "Couverture",
        type: "media",
        mediaKind: "image",
      },
      {
        name: "status",
        label: "Statut",
        type: "select",
        options: statusOptions,
      },
      { name: "featured", label: "Mis en avant", type: "boolean" },
    ],
  },
  faq: {
    title: "Questions fréquentes",
    description:
      "Questions, réponses, langue, catégories, ordre et visibilité.",
    singular: "question",
    fields: [
      {
        name: "locale",
        label: "Langue",
        type: "select",
        options: localeOptions,
      },
      { name: "category", label: "Catégorie", required: true },
      { name: "question", label: "Question", required: true },
      { name: "answer", label: "Réponse", type: "textarea", required: true },
      { name: "order", label: "Ordre", type: "number" },
      { name: "visible", label: "Visible", type: "boolean" },
    ],
  },
  testimonials: {
    title: "Témoignages",
    description: "Avis clients, avatars, entreprises, notes et visibilité.",
    singular: "témoignage",
    fields: [
      { name: "name", label: "Nom", required: true },
      { name: "company", label: "Entreprise" },
      { name: "position", label: "Poste" },
      { name: "quote", label: "Témoignage", type: "textarea", required: true },
      { name: "avatar", label: "Avatar" },
      { name: "rating", label: "Note", type: "number" },
      { name: "visible", label: "Visible", type: "boolean" },
    ],
  },
  contacts: {
    title: "Demandes de contact",
    description: "Boîte de réception et suivi des réponses.",
    singular: "contact",
    allowCreate: false,
    fields: [
      { name: "name", label: "Nom" },
      { name: "email", label: "Email" },
      { name: "message", label: "Message", type: "textarea" },
      {
        name: "status",
        label: "Statut",
        type: "select",
        options: [
          { label: "Nouveau", value: "NEW" },
          { label: "En cours", value: "IN_PROGRESS" },
          { label: "Terminé", value: "COMPLETED" },
          { label: "Spam", value: "SPAM" },
          { label: "Archivé", value: "ARCHIVED" },
        ],
      },
      { name: "replyStatus", label: "Suivi de réponse" },
    ],
    exportable: true,
  },
  appointments: {
    title: "Rendez-vous",
    description: "Demandes, calendrier, attribution et notes.",
    singular: "rendez-vous",
    allowCreate: false,
    fields: [
      { name: "name", label: "Nom" },
      { name: "email", label: "Email" },
      { name: "phone", label: "Téléphone" },
      { name: "company", label: "Entreprise" },
      { name: "topic", label: "Sujet" },
      { name: "preferredDate", label: "Date souhaitée" },
      { name: "message", label: "Message", type: "textarea" },
      {
        name: "status",
        label: "Statut",
        type: "select",
        options: [
          { label: "Nouveau", value: "NEW" },
          { label: "En cours", value: "IN_PROGRESS" },
          { label: "Terminé", value: "COMPLETED" },
          { label: "Archivé", value: "ARCHIVED" },
        ],
      },
      { name: "notes", label: "Notes internes", type: "textarea" },
    ],
    exportable: true,
  },
  "event-registrations": {
    title: "Inscriptions événements",
    description:
      "Inscriptions reçues pour les événements et sessions publiques.",
    singular: "inscription",
    allowCreate: false,
    allowDelete: false,
    fields: [
      { name: "eventTitle", label: "Événement" },
      { name: "name", label: "Nom" },
      { name: "email", label: "Email" },
      { name: "phone", label: "Téléphone" },
      { name: "company", label: "Entreprise" },
      { name: "message", label: "Message", type: "textarea" },
      {
        name: "status",
        label: "Statut",
        type: "select",
        options: [
          { label: "Nouveau", value: "NEW" },
          { label: "En cours", value: "IN_PROGRESS" },
          { label: "Terminé", value: "COMPLETED" },
          { label: "Spam", value: "SPAM" },
          { label: "Archivé", value: "ARCHIVED" },
        ],
      },
    ],
  },
  users: {
    title: "Utilisateurs",
    description: "Administrateurs, éditeurs, rédacteurs et rôles.",
    singular: "utilisateur",
    fields: [],
    readonly: true,
  },
  media: {
    title: "Médiathèque",
    description:
      "Images, documents, dossiers, compression et textes alternatifs.",
    singular: "média",
    fields: [
      { name: "name", label: "Nom", required: true },
      { name: "url", label: "URL", required: true },
      { name: "alt", label: "Texte alternatif", required: true },
      { name: "folder", label: "Dossier" },
      { name: "mimeType", label: "Type MIME" },
      { name: "size", label: "Taille", type: "number" },
    ],
  },
  settings: {
    title: "Paramètres globaux",
    description:
      "Identité, coordonnées, réseaux, cookies, analytics et footer.",
    singular: "paramètre",
    allowCreate: false,
    fields: [
      { name: "key", label: "Clé" },
      { name: "group", label: "Groupe" },
      { name: "value", label: "Valeur structurée", type: "json" },
    ],
  },
  menus: {
    title: "Navigation",
    description: "Menus header/footer, liens externes, ordre et visibilité.",
    singular: "lien",
    allowCreate: false,
    fields: [
      { name: "label", label: "Libellé" },
      { name: "url", label: "URL" },
      { name: "external", label: "Lien externe", type: "boolean" },
      { name: "order", label: "Ordre", type: "number" },
      { name: "visible", label: "Visible", type: "boolean" },
    ],
  },
  seo: {
    title: "SEO Manager",
    description:
      "Titres, descriptions, canonicals, OpenGraph, schema, noIndex et redirections.",
    singular: "métadonnée",
    allowCreate: false,
    fields: [
      { name: "title", label: "Titre" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "keywords", label: "Mots-clés", type: "json" },
      { name: "canonical", label: "URL canonique" },
      { name: "ogImage", label: "Image OpenGraph" },
      { name: "schema", label: "Schema JSON-LD", type: "json" },
      { name: "noIndex", label: "Ne pas indexer", type: "boolean" },
    ],
  },
  analytics: {
    title: "Statistiques",
    description: "Événements, trafic et indicateurs de conversion.",
    singular: "événement",
    fields: [],
    readonly: true,
  },
  audit: {
    title: "Journal d’activité",
    description: "Historique sécurisé des actions de l’équipe.",
    singular: "activité",
    fields: [],
    readonly: true,
  },
};
