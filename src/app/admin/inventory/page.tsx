"use client";

export const revalidate = 0; // 또는: export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";


type Row = { id: string; username: string; isAllocated: boolean; allocatedAt?: string | null; product?: { name: string } };
type Product = { id: string; name: string };

export default function AdminInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState<string>("");
  const [lines, setLines] = useState("");
  const [items, setItems] = useState<Row[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  async function loadProducts() {
    const r = await fetch("/api/admin/products");
    const d = await r.json();
    setProducts(d.items || []);
    if (!productId && d.items?.[0]) setProductId(d.items[0].id);
  }
  async function loadList() {
    const url = new URL("/api/admin/inventory", location.origin);
    if (productId) url.searchParams.set("productId", productId);
    url.searchParams.set("page", String(page));
    url.searchParams.set("pageSize", String(pageSize));
    const r = await fetch(url);
    const d = await r.json();
    setItems(d.items || []);
  }

  useEffect(() => { loadProducts(); }, []);
  useEffect(() => { loadList(); }, [productId, page]);

  async function upload() {
    const r = await fetch("/api/admin/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, lines }),
    });
    const d = await r.json();
    if (!r.ok) alert(d?.error || "업로드 실패");
    else { alert(`${d.count}건 추가되었습니다.`); setLines(""); loadList(); }
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
        <div className="grid sm:grid-cols-3 gap-2">
          <select className="input" value={productId} onChange={e=>setProductId(e.target.value)}>
            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <button onClick={upload} className="btn-primary sm:col-span-2">업로드</button>
          <textarea className="input sm:col-span-3 h-40" placeholder="username:password 형식, 한 줄당 하나"
            value={lines} onChange={e=>setLines(e.target.value)} />
        </div>
      </div>

      <div className="panel">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display text-lg">계정 목록</h3>
          <div className="flex gap-2">
            <button className="btn-ghost" onClick={()=>setPage(p=>Math.max(1,p-1))}>이전</button>
            <button className="btn-ghost" onClick={()=>setPage(p=>p+1)}>다음</button>
          </div>
        </div>
        <div className="space-y-2">
          {items.map((r)=>(
            <div key={r.id} className="card flex items-center justify-between">
              <div>
                <div className="font-medium">{r.username}</div>
                <div className="text-xs text-white/60">
                  {r.product?.name} · {r.isAllocated ? "할당됨" : "미할당"}
                </div>
              </div>
              <button className="btn-ghost" onClick={()=>remove(r.id)}>삭제</button>
            </div>
          ))}
          {items.length===0 && <div className="text-white/60">표시할 항목이 없습니다.</div>}
        </div>
      </div>
    </section>
  );
}
