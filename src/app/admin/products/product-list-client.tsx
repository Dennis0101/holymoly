"use client";

type Item = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  isActive: boolean;
  totalAccounts: number;
  available: number;
};

export default function ProductListClient({ items }: { items: Item[] }) {
  async function handleDelete(id: string) {
    const ok = confirm("정말 삭제할까요?");
    if (!ok) return;
    const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    if (!res.ok) {
      const d = await res.json().catch(() => ({} as any));
      alert(d?.error ?? "삭제 실패");
      return;
    }
    location.reload();
  }

  if (items.length === 0) {
    return <div className="panel text-white/70">상품이 없습니다. 위에서 추가하세요.</div>;
  }

  return (
    <div className="grid gap-3">
      {items.map((p) => (
        <div
          key={p.id}
          className="card p-4 flex items-center justify-between bg-base-800 border border-white/10"
        >
          <div>
            <div className="font-medium text-white">
              {p.name} {!p.isActive && <span className="text-xs text-red-400">(비활성)</span>}
            </div>
            <div className="text-sm text-white/80 mt-1">
              <span className="font-medium text-neon-400">
                {p.price.toLocaleString()}원
              </span>{" "}
              · 미할당 재고: <span className="text-green-400">{p.available}</span> · 총 계정:{" "}
              <span className="text-blue-400">{p.totalAccounts}</span>
            </div>
            {p.description && <div className="text-sm mt-2 text-white/70">{p.description}</div>}
          </div>

          <button
            className="btn-ghost text-red-400 hover:text-red-300"
            onClick={() => handleDelete(p.id)}
          >
            삭제
          </button>
        </div>
      ))}
    </div>
  );
}
