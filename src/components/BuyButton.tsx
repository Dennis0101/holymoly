"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BuyButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ ok: boolean; msg: string } | null>(null);
  const [pop, setPop] = useState(false);

  async function buy() {
    if (loading) return;
    setLoading(true);
    try {
      const r = await fetch("/api/orders/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-ajax": "1", // ← JSON 응답 유도
          Accept: "application/json",
        },
        body: JSON.stringify({ productId }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d?.error || "구매 실패");

      // 성공 애니메이션
      setToast({ ok: true, msg: "구매 완료! 구매내역을 확인 해주세요." });
      setPop(true);
      setTimeout(() => setPop(false), 1200);
      // 살짝 기다렸다 잔액/리스트 갱신이 필요하면 새로고침 or 상태 리프레시
      // setTimeout(()=>location.href="/orders", 1000);  // 즉시 이동 원하면 주석 해제
    } catch (e: any) {
      setToast({ ok: false, msg: e?.message || "구매 실패" });
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), 1600);
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={buy}
        disabled={loading}
        className={`btn-primary ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        {loading ? "구매 중…" : "구매"}
      </button>

      {/* 상단 토스트 (카드 내부) */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            className={`absolute -top-8 left-1/2 z-20 -translate-x-1/2 rounded-md px-2 py-1 text-xs backdrop-blur
            ${toast.ok ? "bg-green-500/20 text-green-200 ring-1 ring-green-400/30" : "bg-red-500/20 text-red-200 ring-1 ring-red-400/30"}`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 중앙 팝업 */}
      <AnimatePresence>
        {pop && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.7, rotate: -6 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="flex flex-col items-center gap-2"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.25, 1] }}
                transition={{ duration: 0.5 }}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-2xl shadow-[0_0_28px_rgba(34,197,94,.65)]"
              >
                ✓
              </motion.div>
              <motion.p
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="font-semibold text-green-300"
              >
                구매 완료! <span className="text-white/80">구매내역을 확인 해주세요</span>
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
