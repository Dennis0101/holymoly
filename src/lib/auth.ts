// src/lib/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import prisma from "./prisma";
import { z } from "zod";

const creds = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { auth, signIn, signOut, handlers } = NextAuth({
  // ✅ 프록시/커스텀 도메인 환경에서 호스트 신뢰 (AUTH_TRUST_HOST=true 와 함께 안전)
  trustHost: true,

  session: { strategy: "jwt" },
  pages: { signIn: "/login", error: "/login" },
  providers: [
    Credentials({
      name: "Email & Password",
      credentials: { email: {}, password: {} },
      async authorize(c) {
        const s = creds.safeParse(c);
        if (!s.success) return null;

        const { email, password } = s.data;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) return null;

        const ok = await compare(password, user.password);
        if (!ok) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          role: user.role,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
});

// ✅ app/api/auth/[...nextauth]/route.ts 에서 재노출 가능하도록
export const { GET, POST } = handlers;
