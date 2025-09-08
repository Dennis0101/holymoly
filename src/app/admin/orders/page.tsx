"use client";

import { useEffect, useState } from "react";

type Row = {
  id: string;
  status: string;
  price: number;
  createdAt: string;
  user: { email: string | null };
  product: { name: string };
};

export default function AdminOrders() {
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/admin/orders", { cache: "no-store" });
        if (!r.ok) throw new Error("주문 목록을 불러오지 못했습니다.");
        const d = await r.json();
        setItems(d.items || []);
      } catch (e: any) {
        setErr(e.message || "에러가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="panel">
      <h2 className="font-display text-xl mb-2">주문 목록</h2>

      {loading && <div className="text-white/60">불러오는 중…</div>}
      {err && <div className="text-red-400">{err}</div>}

      {!loading && !err && (
        <div className="space-y-2">
          {items.map((o) => (
            <div key={o.id} className="card flex items-center justify-between">
              <div>
                <div className="font-medium">{o.product.name}</div>
                <div className="text-xs text-white/60">
                  {o.user.email ?? "-"} · {o.status} ·{" "}
                  {new Date(o.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="font-semibold">
                {o.price.toLocaleString()}원
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-white/60">주문이 없습니다.</div>
          )}
        </div>
      )}
    </section>
  );
}
