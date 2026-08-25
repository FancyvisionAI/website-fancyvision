// Affiché automatiquement par Next.js (Suspense) pendant que le contenu
// d'une page se charge — au clic sur un lien comme lors d'un premier
// chargement — pour éviter l'écran figé le temps que les données CMS
// soient prêtes. Header/Footer restent affichés et interactifs, seule
// cette zone (à la place de {children}) montre le squelette.
export default function PublicLoading() {
  return (
    <div className="container-shell animate-pulse py-16">
      <div className="mx-auto h-10 w-2/3 max-w-xl rounded-control bg-lime/60" />
      <div className="mx-auto mt-4 h-5 w-1/2 max-w-md rounded-control bg-lime/40" />
      <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-48 rounded-card border border-border bg-lime/20"
          />
        ))}
      </div>
    </div>
  );
}
