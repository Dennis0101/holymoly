"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "대시보드" },
  { href: "/orders", label: "구매내역" },
  { href: "/topup", label: "충전신청" },
  { href: "/profile", label: "내 프로필" },
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
    return (
      <Link
        href={href}
        className={`block rounded-md px-3 py-2 text-sm transition
          ${active ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
      >
        {label}
      </Link>
    );
  };

  return (
    <aside className="sticky top-0 hidden h-screen w-64 flex-col gap-2 border-r bg-white p-4 md:flex">
      <div className="mb-2 text-lg font-bold">Account Shop</div>
      <div className="space-y-1">
        {items.map((it) => <Nav key={it.href} {...it} />)}
      </div>
      <div className="mt-6 text-xs font-semibold uppercase text-gray-400">Admin</div>
      <div className="space-y-1">
        {admin.map((it) => <Nav key={it.href} {...it} />)}
      </div>
    </aside>
  );
}
