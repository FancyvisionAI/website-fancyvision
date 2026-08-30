import { getTrainingIcon } from "@/lib/content/training-visuals";

// Tuile icône + dégradé pour les cartes de formation, dans le même langage
// visuel que AgentVisual (dégradé accent -> cobalt-strong, glow au survol).
// Purement décoratif (aria-hidden) : le titre réel de la formation reste
// porté par le texte de la carte. Animation limitée à transform/opacity,
// via les variantes Tailwind motion-safe:/motion-reduce: (respecte
// prefers-reduced-motion sans JS supplémentaire).
export function TrainingIconTile({ slug }: { slug: string }) {
  const Icon = getTrainingIcon(slug);

  return (
    <div
      aria-hidden="true"
      className="glow-cobalt relative mb-6 flex size-14 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-accent via-[#101b33] to-cobalt-strong transition-transform duration-500 motion-safe:group-hover:scale-110 motion-safe:group-hover:-rotate-3"
    >
      <Icon className="size-6 text-white/90" strokeWidth={1.75} />
    </div>
  );
}
