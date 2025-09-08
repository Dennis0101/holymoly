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
  // 프록시/커스텀 도메인 환경에서 호스트 신뢰 (Railway는 ENV로 AUTH_TRUST_HOST=true도 권장)
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

        // 로그인 성공 시 기본 정보 반환 (role 포함)
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
    // ⚡️ JWT 토큰에 항상 DB의 최신 role을 동기화
    async jwt({ token, user }) {
      // 1) 로그인 직후엔 user에서 값 복사
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
        token.email = (user as any).email;
      }

      // 2) 이후 요청들에선 DB 조회로 최신 role 유지
      if (token?.email) {
        const u = await prisma.user.findUnique({
          where: { email: token.email as string },
          select: { role: true },
        });
        if (u) token.role = u.role;
      }

      return token;
    },

    // 세션 객체에 id/role을 노출
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
});

// app/api/auth/[...nextauth]/route.ts 에서 바로 재노출
export const { GET, POST } = handlers;
