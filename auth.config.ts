import { NextResponse } from "next/server";
import type { NextAuthConfig } from "next-auth";

export default {
  session: { strategy: "jwt" },
  pages: { signIn: "/connexion" },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      // Couche de défense supplémentaire pour /api/admin/** : chaque route
      // admin vérifie déjà individuellement la session (auth()/requireAdmin
      // dans chaque handler, cf. audit) — ce contrôle ne remplace rien, il
      // ajoute un filet de sécurité au niveau middleware pour toute future
      // route qui oublierait ce contrôle. Retourner directement une
      // Response ici est un mécanisme officiellement supporté par
      // NextAuth : elle est respectée telle quelle (401 JSON), sans
      // déclencher la redirection automatique vers /connexion prévue pour
      // les pages HTML.
      if (pathname.startsWith("/api/admin")) {
        if (!auth?.user) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return true;
      }
      const isAdmin = pathname.startsWith("/admin");
      return isAdmin ? Boolean(auth?.user) : true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.permissions = user.permissions ?? [];
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id);
        session.user.role = String(token.role ?? "");
        session.user.permissions = Array.isArray(token.permissions)
          ? (token.permissions as string[])
          : [];
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
