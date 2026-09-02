import type { Session } from "next-auth";

// Vérification minimale des permissions RBAC (Role / Permission /
// RolePermission, cf. prisma/schema.prisma). Les clés de permission sont
// résolues une seule fois à la connexion (auth.ts) et portées par le JWT —
// cette fonction ne fait qu'un contrôle en mémoire, aucune requête DB.
//
// À ce jour, un seul rôle existe ("Administrateur", cf. prisma/seed.ts)
// avec l'intégralité des permissions déjà attachées : activer ce contrôle
// ne change donc rien pour l'accès actuel. Il devient utile dès qu'un
// second rôle à droits restreints sera créé — voir docs/PRODUCTION_CHECKLIST.md.
export function hasPermission(
  session: Session | null | undefined,
  permissionKey: string,
): boolean {
  return Boolean(session?.user?.permissions?.includes(permissionKey));
}
