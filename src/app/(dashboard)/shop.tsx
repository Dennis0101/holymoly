"use client";
import { useState } from "react";

type P = { id: string; name: string; price: number; stock: number };
export default function Shop({ products }: { products: P[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [msg, setMsg] = useState<string>("");

  const checkout = async (productId: string) => {
    setMsg(""); setLoadingId(productId);
    try {
      const r = await fetch("/api/orders/checkout", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ productId })
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "CHECKOUT_FAIL");
      setMsg("구매 완료! 주문내역에서 확인하세요.");
    } catch (e:any) {
      const map: Record<string,string> = {
        NO_PRODUCT: "상품을 찾을 수 없습니다.",
        NO_BALANCE: "잔액이 부족합니다.",
        NO_STOCK: "재고가 없습니다.",
      };
      setMsg(map[e.message] || e.message);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-3">
      {msg && <div className="text-sm text-blue-600">{msg}</div>}
      <div className="grid md:grid-cols-2 gap-3">
        {products.map(p => (
          <div key={p.id} className="border rounded p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{p.name}</div>
              <div className="text-sm text-gray-500">가격: {p.price} / 재고: {p.stock}</div>
            </div>
            <button
              disabled={loadingId===p.id || p.stock<=0}
              onClick={()=>checkout(p.id)}
              className="px-3 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              {loadingId===p.id ? "처리중..." : "구매"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
