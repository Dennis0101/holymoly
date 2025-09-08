"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [successPop, setSuccessPop] = useState(false);

  const pageSize = 20;

  async function loadProducts() {
    try {
      const r = await fetch("/api/admin/products", { cache: "no-store" });
      if (!r.ok) throw new Error();
      const d = await r.json();
      setProducts(d.items || []);
      if (!productId && d.items?.[0]) setProductId(d.items[0].id);
    } catch {
      setToast({ type: "err", msg: "인벤토리를 불러오지 못했습니다." });
    }
  }

  async function loadList() {
    const url = new URL("/api/admin/inventory", location.origin);
    if (productId) url.searchParams.set("productId", productId);
    url.searchParams.set("page", String(page));
    url.searchParams.set("pageSize", String(pageSize));
    const r = await fetch(url, { cache: "no-store" });
    const d = await r.json();
    setItems(d.items || []);
  }

  useEffect(() => { loadProducts(); }, []);
  useEffect(() => { if (productId) loadList(); }, [productId, page]);

  async function upload() {
    if (!productId || !lines.trim()) {
      setToast({ type: "err", msg: "상품과 계정 목록을 입력하세요." });
      return;
    }
    setLoading(true);
    try {
      const r = await fetch("/api/admin/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, lines }),
      });
      const d = await r.json();

      if (!r.ok) throw new Error(d?.error || "업로드 실패");

      // ✅ 성공 토스트 + 팝 애니메이션
      setToast({ type: "ok", msg: `${d.count}건 추가되었습니다.` });
      setSuccessPop(true);
      setLines("");
      await loadList();
      setTimeout(() => setSuccessPop(false), 1400);
    } catch (e: any) {
      setToast({ type: "err", msg: e?.message || "업로드 중 오류가 발생했습니다." });
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), 1800);
    }
  }

  async function remove(id: string) {
    if (!confirm("삭제할까요?")) return;
    await fetch(`/api/admin/inventory?id=${id}`, { method: "DELETE" });
    loadList();
  }

  return (
    <section className="space-y-4">
      {/* 상단 토스트 */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className={`fixed left-1/2 top-4 z-[60] -translate-x-1/2 rounded-xl px-4 py-2 shadow-lg backdrop-blur
            ${toast.type === "ok" ? "bg-green-500/20 text-green-300 ring-1 ring-green-400/40" : "bg-red-500/20 text-red-300 ring-1 ring-red-400/40"}`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 업로드 카드 */}
      <div className="panel space-y-3 relative overflow-hidden">
        <h2 className="font-display text-xl">인벤토리 업로드</h2>

        <div className="grid sm:grid-cols-3 gap-2">
          <select
            className="input"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <button
            onClick={upload}
            disabled={loading}
            className={`btn-primary sm:col-span-2 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {loading ? "업로드 중…" : "업로드"}
          </button>

          <textarea
            className="input sm:col-span-3 h-40"
            placeholder="username:password 형식, 한 줄당 하나"
            value={lines}
            onChange={(e) => setLines(e.target.value)}
          />
        </div>

        {/* ✅ 성공 팝 애니메이션 */}
        <AnimatePresence>
          {successPop && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center rounded-2xl bg-black/60 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.6, rotate: -8 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="flex flex-col items-center gap-2"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ times: [0, 0.7, 1], duration: 0.6 }}
                  className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-[0_0_25px_rgba(34,197,94,.7)]"
                >
                  <span className="text-2xl">✓</span>
                </motion.div>
                <motion.p
                  initial={{ y: 6, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-green-300 font-semibold"
                >
                  계정 추가 완료!
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 목록 카드 */}
      <div className="panel">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display text-lg">계정 목록</h3>
          <div className="flex gap-2">
            <button className="btn-ghost" onClick={() => setPage((p) => Math.max(1, p - 1))}>이전</button>
            <button className="btn-ghost" onClick={() => setPage((p) => p + 1)}>다음</button>
          </div>
        </div>

        <div className="space-y-2">
          {items.map((r) => (
            <div key={r.id} className="card flex items-center justify-between">
              <div>
                <div className="font-medium">{r.username}</div>
                <div className="text-xs text-white/60">
                  {r.product?.name} · {r.isAllocated ? "할당됨" : "미할당"}
                </div>
              </div>
              <button className="btn-ghost" onClick={() => remove(r.id)}>삭제</button>
            </div>
          ))}
          {items.length === 0 && <div className="text-white/60">표시할 항목이 없습니다.</div>}
        </div>
      </div>
    </section>
  );
}
