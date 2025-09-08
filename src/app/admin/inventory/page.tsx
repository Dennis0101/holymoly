"use client";

import { useEffect, useState } from "react";

type Row = {
  id: string;
  username: string;
  isAllocated: boolean;
  allocatedAt?: string | null;
  product?: { name: string };
};
type Product = { id: string; name: string };

export default function AdminInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState<string>("");
  const [lines, setLines] = useState("");
  const [items, setItems] = useState<Row[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const pageSize = 20;

  async function loadProducts() {
    setErr(null);
    try {
      const r = await fetch("/api/admin/products", { cache: "no-store" });
      if (!r.ok) throw new Error("상품 목록을 불러오지 못했습니다.");
      const d = await r.json();
      setProducts(d.items || []);
      if (!productId && d.items?.[0]) setProductId(d.items[0].id);
    } catch (e: any) {
      setErr(e.message || "에러가 발생했습니다.");
    }
  }

  async function loadList() {
    if (!productId) { setItems([]); return; }
    setLoading(true);
    setErr(null);
    try {
      const url = new URL("/api/admin/inventory", window.location.origin);
      url.searchParams.set("productId", productId);
      url.searchParams.set("page", String(page));
      url.searchParams.set("pageSize", String(pageSize));
      const r = await fetch(url, { cache: "no-store" });
      if (!r.ok) throw new Error("인벤토리를 불러오지 못했습니다.");
      const d = await r.json();
      setItems(d.items || []);
    } catch (e: any) {
      setErr(e.message || "에러가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadProducts(); }, []);
  useEffect(() => { loadList(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [productId, page]);

  async function upload() {
    if (!productId) return alert("상품을 먼저 선택하세요.");
    if (!lines.trim()) return alert("업로드할 계정이 없습니다.");
    try {
      const r = await fetch("/api/admin/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, lines }),
      });
      const d = await r.json();
      if (!r.ok) return alert(d?.error || "업로드 실패");
      alert(`${d.count}건 추가되었습니다.`);
      setLines("");
      loadList();
    } catch {
      alert("업로드 중 오류가 발생했습니다.");
    }
  }

  async function remove(id: string) {
    if (!confirm("삭제할까요?")) return;
    await fetch(`/api/admin/inventory?id=${id}`, { method: "DELETE" });
    loadList();
  }

  return (
    <section className="space-y-4">
      <div className="panel space-y-3">
        <h2 className="font-display text-xl">인벤토리 업로드</h2>

        {err && <div className="text-sm text-red-400">{err}</div>}

        <div className="grid sm:grid-cols-3 gap-2">
          <select
            className="input"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
            {products.length === 0 && <option>상품이 없습니다</option>}
          </select>

          <button onClick={upload} className="btn-primary sm:col-span-2" disabled={!productId}>
            업로드
          </button>

          <textarea
            className="input sm:col-span-3 h-40"
            placeholder="username:password 형식, 한 줄당 하나"
            value={lines}
            onChange={(e) => setLines(e.target.value)}
          />
        </div>
      </div>

      <div className="panel">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display text-lg">계정 목록</h3>
          <div className="flex gap-2">
            <button className="btn-ghost" onClick={() => setPage((p) => Math.max(1, p - 1))}>
              이전
            </button>
            <button className="btn-ghost" onClick={() => setPage((p) => p + 1)}>
              다음
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-white/60">불러오는 중…</div>
        ) : (
          <div className="space-y-2">
            {items.map((r) => (
              <div key={r.id} className="card flex items-center justify-between">
                <div>
                  <div className="font-medium">{r.username}</div>
                  <div className="text-xs text-white/60">
                    {r.product?.name} · {r.isAllocated ? "할당됨" : "미할당"}
                  </div>
                </div>
                <button className="btn-ghost" onClick={() => remove(r.id)}>
                  삭제
                </button>
              </div>
            ))}
            {items.length === 0 && (
              <div className="text-white/60">표시할 항목이 없습니다.</div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
