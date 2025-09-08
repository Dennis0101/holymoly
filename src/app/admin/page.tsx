import Link from "next/link";

export default function AdminPage() {
  const menus = [
    { href: "/admin/products", title: "상품 관리", desc: "상품 생성, 수정, 삭제" },
    { href: "/admin/inventory", title: "인벤토리", desc: "계정 업로드 및 관리" },
    { href: "/admin/orders", title: "주문 기록", desc: "사용자 주문 내역 확인" },
    { href: "/admin/settings", title: "웹훅 설정", desc: "알림/자동화 관련 설정" },
  ];

  return (
    <div className="space-y-6">
      {/* 홈으로 가기 버튼 */}
      <div className="flex justify-end">
        <Link
          href="/"
          className="btn-ghost text-sm px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10"
        >
          ← 홈으로
        </Link>
      </div>

      <h1 className="text-2xl font-semibold">어드민 대시보드</h1>
      <p className="text-white/70">관리자 전용 기능에 접근하세요.</p>

      <div className="grid gap-4 sm:grid-cols-2">
        {menus.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="panel hover:ring-2 ring-neon-400 transition rounded-lg p-4 block"
          >
            <h2 className="font-medium text-lg mb-1">{m.title}</h2>
            <p className="text-sm text-white/60">{m.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
