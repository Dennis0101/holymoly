"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const path = usePathname();

  const Nav = ({ href, label }: { href: string; label: string }) => {
    const active = path === href || path.startsWith(href + "/");
    return (
      <Link href={href} className={`nav-link ${active ? "nav-link--active" : ""}`}>
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 backdrop-blur bg-base-800/60">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-display text-lg tracking-wide">
          <span className="text-neon-400">●</span> Account Shop
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          <Nav href="/" label="대시보드" />
          <Nav href="/orders" label="구매내역" />
          <Nav href="/topup" label="충전신청" />
          <Nav href="/profile" label="프로필" />
          <Nav href="/admin" label="관리" />
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="btn-ghost text-sm">로그인</Link>
          <Link href="/register" className="btn-primary text-sm">회원가입</Link>
        </div>
      </div>
    </header>
  );
}
