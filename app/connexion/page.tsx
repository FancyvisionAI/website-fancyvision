import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AuthError } from "next-auth";

import { auth, signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { rateLimit } from "@/lib/rate-limit";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await auth()) redirect("/admin");
  const { error } = await searchParams;
  const hasError = error === "credentials";
  const isRateLimited = error === "rate-limit";
  return (
    <main className="grid min-h-screen place-items-center bg-accent p-5">
      <div className="w-full max-w-md rounded-[2rem] bg-canvas p-7 md:p-10">
        <Link
          href="/"
          className="text-2xl font-black tracking-[-0.06em] text-ink"
        >
          Sapiens-IA<span className="text-cobalt">.</span>
        </Link>
        <h1 className="mt-12 text-4xl font-semibold tracking-[-0.06em] text-ink">
          Espace administration
        </h1>
        <p className="text-ink/55 mt-3 text-sm leading-6">
          Connectez-vous avec votre compte autorisé.
        </p>
        {hasError && (
          <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">
            Identifiants incorrects.
          </p>
        )}
        {isRateLimited && (
          <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">
            Trop de tentatives. Réessayez dans une minute.
          </p>
        )}
        <form
          className="mt-8 grid gap-4"
          action={async (formData) => {
            "use server";
            // Même mécanisme et même clé de nommage que les autres
            // formulaires publics (contact, rendez-vous, inscription) —
            // cf. lib/rate-limit.ts. Cette page n'est pas une route API,
            // l'IP est donc lue via next/headers plutôt que request.headers.
            const ip =
              (await headers()).get("x-forwarded-for")?.split(",")[0] ??
              "unknown";
            if (!rateLimit(`connexion:${ip}`, 5, 60_000).allowed) {
              redirect("/connexion?error=rate-limit");
            }
            try {
              await signIn("credentials", {
                email: formData.get("email"),
                password: formData.get("password"),
                redirectTo: "/admin",
              });
            } catch (error) {
              if (error instanceof AuthError)
                redirect("/connexion?error=credentials");
              throw error;
            }
          }}
        >
          <label className="grid gap-2 text-sm font-semibold">
            Email
            <Input name="email" type="email" required />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Mot de passe
            <Input name="password" type="password" required minLength={8} />
          </label>
          <Button size="lg" className="mt-2">
            Se connecter
          </Button>
        </form>
      </div>
    </main>
  );
}
