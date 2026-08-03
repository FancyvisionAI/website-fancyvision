import type { NextAuthConfig } from "next-auth";

export default {
  session: { strategy: "jwt" },
  pages: { signIn: "/connexion" },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const isAdmin = request.nextUrl.pathname.startsWith("/admin");
      return isAdmin ? Boolean(auth?.user) : true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id);
        session.user.role = String(token.role ?? "");
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
