"use client";

export const revalidate = 0; // 항상 최신 데이터

import { useEffect, useState } from "react";
type Row = {
  id: string; status: string; price: number; createdAt: string;
  user: { email: string | null }, product: { name: string };
};

export default function AdminOrders() {
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const r = await fetch("/api/admin/orders");
      const d = await r.json();
      setItems(d.items || []); setLoading(false);
    })();
  }, []);

  return (
    <section className="panel">
      <h2 className="font-display text-xl mb-2">주문 목록</h2>
      {loading ? "불러오는 중…" : (
        <div className="space-y-2">
          {items.map(o=>(
            <div key={o.id} className="card flex items-center justify-between">
              <div>
                <div className="font-medium">{o.product.name}</div>
                <div className="text-xs text-white/60">
                  {o.user.email ?? "-"} · {o.status} · {new Date(o.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="font-semibold">{o.price.toLocaleString()}원</div>
            </div>
          ))}
          {items.length===0 && <div className="text-white/60">주문이 없습니다.</div>}
        </div>
      )}
    </section>
  );
}
