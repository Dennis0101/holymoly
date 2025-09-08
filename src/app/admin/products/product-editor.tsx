"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductEditor() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [successPop, setSuccessPop] = useState(false);

  async function submit() {
    if (!name.trim() || !price.trim()) {
      setToast({ type: "err", msg: "상품명과 가격을 입력하세요." });
      setTimeout(() => setToast(null), 2000);
      return;
    }

    setLoading(true);
    try {
      const r = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price: Number(price),
          description: description || null,
          isActive,
        }),
      });
      const d = await r.json();

      if (!r.ok) throw new Error(d?.error || "등록 실패");

      setToast({ type: "ok", msg: "상품이 등록되었습니다." });
      setSuccessPop(true);
      setName("");
      setPrice("");
      setDescription("");
      setIsActive(true);

      setTimeout(() => setSuccessPop(false), 1400);
    } catch (e: any) {
      setToast({ type: "err", msg: e?.message || "오류가 발생했습니다." });
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), 1800);
    }
  }

  return (
    <div className="panel space-y-3 relative overflow-hidden">
      {/* 토스트 */}
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

      <h2 className="font-display text-xl">상품 추가</h2>

      <input
        type="text"
        placeholder="상품명"
        className="input w-full"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="number"
        placeholder="가격 (원)"
        className="input w-full"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <textarea
        placeholder="설명 (선택)"
        className="input w-full h-20"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        활성화
      </label>

      <button
        onClick={submit}
        disabled={loading}
        className={`btn-primary w-full ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        {loading ? "등록 중…" : "저장"}
      </button>

      {/* ✅ 성공 팝업 */}
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
                상품 추가 완료!
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
