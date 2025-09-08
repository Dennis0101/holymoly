"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const main = [
  { href: "/", label: "대시보드" },
  { href: "/orders", label: "구매내역" },
  { href: "/topup", label: "충전신청" },
  { href: "/profile", label: "프로필" },
];
const admin = [
  { href: "/admin", label: "어드민 홈" },
  { href: "/admin/products", label: "상품관리" },
  { href: "/admin/inventory", label: "인벤토리" },
  { href: "/admin/orders", label: "주문관리" },
  { href: "/admin/settings", label: "설정" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const Nav = ({ href, label }: { href: string; label: string }) => {
    const active = pathname === href || pathname.startsWith(href + "/");
    return <Link href={href} className={`nav-link ${active ? "nav-link--active" : ""}`}>{label}</Link>;
  };

  return (
    <aside className="hidden md:block w-64 p-4 sticky top-14 h-[calc(100vh-56px)]">
      <div className="panel">
        <div className="text-sm font-semibold text-white/70 mb-2">메뉴</div>
        <div className="space-y-1">{main.map((i) => <Nav key={i.href} {...i} />)}</div>
        <div className="mt-4 text-xs uppercase text-white/40 tracking-wider">Admin</div>
        <div className="mt-2 space-y-1">{admin.map((i) => <Nav key={i.href} {...i} />)}</div>
      </div>
    </aside>
  );
}
