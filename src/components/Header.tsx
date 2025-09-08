// src/components/Header.tsx (서버 컴포넌트)
import Link from "next/link";
import { auth } from "@/lib/auth";

export default async function Header() {
  const session = await auth();
  const user = session?.user as any | undefined;
  const isAdmin = user?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 backdrop-blur bg-base-800/60">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between gap-3">
        {/* 로고 */}
        <Link href="/" className="font-display text-lg tracking-wide flex items-center gap-2">
          <span className="text-neon-400">●</span>
          <span>Account Shop</span>
          {isAdmin && (
            <span className="hidden sm:inline-flex items-center text-xs rounded-md px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
              ADMIN
            </span>
          )}
        </Link>

        {/* 내비게이션 (모바일에선 최소화) */}
        <nav className="hidden md:flex items-center gap-2">
          <Link href="/" className="nav-link">대시보드</Link>
          <Link href="/orders" className="nav-link">구매내역</Link>
          <Link href="/topup" className="nav-link">충전신청</Link>
          {isAdmin && <Link href="/admin" className="nav-link">관리</Link>}
        </nav>

        {/* 우측 액션 */}
        <div className="flex items-center gap-2">
          {session ? (
            <>
              {/* 이메일 & 잔액 표시 (잔액 필드가 있다면) */}
              <span className="hidden sm:inline text-sm text-white/70">
                {user?.email}
              </span>
              {/* 간단 프로필 칩(이니셜) */}
              <div
                aria-label="profile"
                className="hidden sm:inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 border border-white/10 text-white/80 text-sm"
                title={user?.email || "user"}
              >
                {(user?.name?.[0] || user?.email?.[0] || "U").toUpperCase()}
              </div>

              {/* 로그아웃 (NextAuth v5 핸들러 지원) */}
              <a href="/api/auth/signout" className="btn-ghost text-sm">
                로그아웃
              </a>

              {/* 모바일 간단 메뉴(로그아웃/관리만 노출) */}
              <div className="md:hidden flex items-center gap-2">
                {isAdmin && (
                  <Link href="/admin" className="btn-ghost text-sm">
                    관리
                  </Link>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost text-sm">로그인</Link>
              <Link href="/register" className="btn-primary text-sm">회원가입</Link>
            </>
          )}
        </div>
      </div>

      {/* 모바일 하단 탭 네비(선택): 로그인 상태와 무관하게 주요 경로 제공 */}
      <div className="md:hidden border-t border-white/10 bg-base-800/60 backdrop-blur">
        <div className="mx-auto max-w-6xl px-2 py-2 flex items-center justify-around text-sm">
          <Link href="/" className="nav-link">대시보드</Link>
          <Link href="/orders" className="nav-link">구매내역</Link>
          <Link href="/topup" className="nav-link">충전신청</Link>
          {isAdmin && <Link href="/admin" className="nav-link">관리</Link>}
        </div>
      </div>
    </header>
  );
}
