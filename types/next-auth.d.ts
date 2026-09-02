import "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
    // Clés de Permission (RBAC) rattachées au rôle de l'utilisateur —
    // résolues une seule fois à la connexion, portées ensuite par le JWT.
    // Non exploité pour restreindre l'accès admin existant (rôle unique
    // "Administrateur" avec toutes les permissions) : cf. lib/rbac.ts.
    permissions?: string[];
  }

  interface Session {
    user: {
      id: string;
      role: string;
      permissions: string[];
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
