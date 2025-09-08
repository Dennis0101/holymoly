"use client";
import { useEffect, useState } from "react";

type OrderItem = {
  id: string;
  status: string;
  price: number;
  createdAt: string;
  product: { name: string; price: number };
  account?: { id: string; username: string | null; isAllocated: boolean };
};

export default function OrdersPage() {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [reveal, setReveal] = useState<{ [k:string]: { u:string; p:string } }>({});
  const [loading, setLoading] = useState<string | null>(null);

  const load = async () => {
    const r = await fetch("/api/orders/mine");
    const j = await r.json();
    setItems(j.items || []);
  };

  useEffect(()=>{ load(); }, []);

  const onReveal = async (id: string) => {
    setLoading(id);
    try {
      const r = await fetch(`/api/orders/${id}/reveal`);
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "REVEAL_FAIL");
      setReveal(prev => ({ ...prev, [id]: { u: j.username, p: j.password } }));
    } catch (e:any) {
      alert(e.message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">구매내역</h1>
      <div className="border rounded">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-2">상품</th>
              <th className="text-left p-2">상태</th>
              <th className="text-left p-2">가격</th>
              <th className="text-left p-2">일시</th>
              <th className="text-left p-2">계정정보</th>
            </tr>
          </thead>
          <tbody>
            {items.map(o => (
              <tr key={o.id} className="border-t">
                <td className="p-2">{o.product?.name ?? "-"}</td>
                <td className="p-2">{o.status}</td>
                <td className="p-2">{o.price}</td>
                <td className="p-2">{new Date(o.createdAt).toLocaleString()}</td>
                <td className="p-2">
                  {reveal[o.id] ? (
                    <div className="space-y-1">
                      <div><b>ID:</b> {reveal[o.id].u}</div>
                      <div><b>PW:</b> {reveal[o.id].p}</div>
                    </div>
                  ) : o.account?.isAllocated ? (
                    <button
                      className="px-2 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                      disabled={loading===o.id}
                      onClick={()=>onReveal(o.id)}
                    >
                      {loading===o.id ? "불러오는 중..." : "계정정보 보기"}
                    </button>
                  ) : (
                    <span className="text-gray-500">준비중</span>
                  )}
                </td>
              </tr>
            ))}
            {!items.length && (
              <tr><td colSpan={5} className="p-4 text-center text-gray-500">주문이 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
