import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const isAdmin = (session?.user as any)?.role === "ADMIN";
  if (!isAdmin) redirect("/login?callbackUrl=/admin");

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-4">
      <div className="panel">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-xl">어드민</h1>
          <nav className="flex gap-2">
            <Link href="/admin" className="btn-ghost">대시보드</Link>
            <Link href="/admin/products" className="btn-ghost">상품</Link>
            <Link href="/admin/inventory" className="btn-ghost">인벤토리</Link>
            <Link href="/admin/orders" className="btn-ghost">주문</Link>
            <Link href="/admin/settings" className="btn-ghost">설정</Link>
          </nav>
        </div>
      </div>
      {children}
    </div>
  );
}
