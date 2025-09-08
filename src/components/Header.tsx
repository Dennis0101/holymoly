// src/components/Header.tsx (서버 컴포넌트)
import Link from "next/link";
import { auth } from "@/lib/auth";

export default async function Header() {
  const session = await auth();
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 backdrop-blur bg-base-800/60">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-display text-lg tracking-wide">
          <span className="text-neon-400">●</span> Account Shop
        </Link>
        <nav className="hidden md:flex items-center gap-2">
          <Link href="/" className="nav-link">대시보드</Link>
          <Link href="/orders" className="nav-link">구매내역</Link>
          <Link href="/topup" className="nav-link">충전신청</Link>
          {isAdmin && <Link href="/admin" className="nav-link">관리</Link>}
        </nav>
        <div className="flex items-center gap-2">
          {session ? (
            <>
              <span className="text-sm text-white/70">{session.user?.email}</span>
              <a href="/api/auth/signout" className="btn-ghost text-sm">로그아웃</a>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost text-sm">로그인</Link>
              <Link href="/register" className="btn-primary text-sm">회원가입</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
