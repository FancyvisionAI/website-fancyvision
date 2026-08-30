import { getTrainingIcon } from "@/lib/content/training-visuals";
import { cn } from "@/lib/utils";

// Tuile icône + dégradé pour les formations, dans le même langage visuel
// que AgentVisual (dégradé accent -> cobalt-strong, glow au survol).
// Purement décoratif (aria-hidden) : le titre réel de la formation reste
// porté par le texte à côté. Animation limitée à transform/opacity, via les
// variantes Tailwind motion-safe:/motion-reduce: (respecte
// prefers-reduced-motion sans JS supplémentaire).
// `className` (fusionné via cn/tailwind-merge) permet d'adapter taille et
// espacement au contexte (grande carte sur /formations, rangée compacte sur
// l'accueil) sans dupliquer ce composant.
export function TrainingIconTile({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const Icon = getTrainingIcon(slug);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "glow-cobalt relative mb-6 flex size-14 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-accent via-[#101b33] to-cobalt-strong transition-transform duration-500 motion-safe:group-hover:scale-110 motion-safe:group-hover:-rotate-3",
        className,
      )}
    >
      <Icon className="size-6 text-white/90" strokeWidth={1.75} />
    </div>
  );
}
