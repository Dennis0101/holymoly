"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "대시보드" },
  { href: "/orders", label: "구매내역" },
  { href: "/topup", label: "충전신청" },
  { href: "/profile", label: "내 프로필" },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-60 border-r h-screen sticky top-0 p-4">
      <div className="text-xl font-bold mb-6">Account Shop</div>
      <nav className="space-y-2">
        {items.map((i) => (
          <Link
            key={i.href}
            href={i.href}
            className={`block rounded px-3 py-2 ${
              pathname === i.href
                ? "bg-gray-100 font-medium"
                : "hover:bg-gray-50"
            }`}
          >
            {i.label}
          </Link>
        ))}
        <hr className="my-4" />
        <Link
          href="/admin"
          className="block text-sm text-gray-500 hover:text-gray-800"
        >
          어드민
        </Link>
      </nav>
    </aside>
  );
}
