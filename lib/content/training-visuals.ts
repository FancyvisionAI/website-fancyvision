import {
  BarChart3,
  Briefcase,
  Calculator,
  Compass,
  Cpu,
  Factory,
  HeartPulse,
  HelpCircle,
  Home,
  Layers,
  Lightbulb,
  type LucideIcon,
  MessageCircle,
  Plane,
  Scale,
  ShieldCheck,
  Sparkles,
  Store,
  TrendingUp,
  Users,
  Wrench,
} from "lucide-react";

// Mapping statique slug -> icône, en attendant une migration éventuelle vers
// le champ Training.image/icon en base (déjà présent dans le schema Prisma,
// non renseigné pour l'instant). Centralisé ici pour ne pas disperser de
// if/switch dans les composants ; il suffira de remplacer l'appel à
// getTrainingIcon par la valeur venant de la base le jour où ces champs
// seront peuplés.
const TRAINING_ICONS: Record<string, LucideIcon> = {
  "piloter-strategie-ia": Compass,
  "contenu-campagnes-ia-generative": Sparkles,
  "automatiser-relation-client-agents-ia": MessageCircle,
  "performance-commerciale-ia": TrendingUp,
  "reporting-analyse-financiere-ia": BarChart3,
  "recruter-former-ia": Users,
  "securiser-contrats-conformite-ia": ShieldCheck,
  "production-supply-chain-data-ia": Factory,
  "concevoir-deployer-agents-ia-entreprise": Cpu,
  "decouvrir-ia-generative-quotidien": Lightbulb,
  "ia-avocats-notaires": Scale,
  "ia-experts-comptables": Calculator,
  "ia-immobilier": Home,
  "ia-professionnels-sante-independants": HeartPulse,
  "vendre-communiquer-ia-commercants-tpe": Store,
  "ia-agences-voyage": Plane,
  "productivite-ia-consultants-freelances": Briefcase,
  "ia-artisans-experts-automobile": Wrench,
  "maitriser-outils-ia-quotidien": Layers,
};

// Traitement neutre pour tout slug non mappé (ex. thèmes "à valider") :
// on ne devine jamais un contenu métier, juste une icône générique.
const DEFAULT_TRAINING_ICON: LucideIcon = HelpCircle;

export function getTrainingIcon(slug: string): LucideIcon {
  return TRAINING_ICONS[slug] ?? DEFAULT_TRAINING_ICON;
}
