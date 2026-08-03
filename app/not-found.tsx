import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-lime px-5">
      <div className="text-center">
        <p className="text-sm font-bold uppercase tracking-[0.16em]">
          Erreur 404
        </p>
        <h1 className="display-title mt-6 text-[clamp(7rem,28vw,20rem)]">
          Oups.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-lg text-black/60">
          Cette page n’existe plus ou a changé d’adresse.
        </p>
        <Button asChild className="mt-8">
          <Link href="/">
            <ArrowLeft className="mr-3 size-4" /> Retour à l’accueil
          </Link>
        </Button>
      </div>
    </main>
  );
}
