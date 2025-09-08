"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Row = {
  id: string;
  amount: number;
  status: "REQUESTED" | "APPROVED" | "REJECTED";
  memo: string | null;
  createdAt: string;
  user: { email: string | null };
};

export default function AdminTopupsPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [tab, setTab] = useState<"ALL" | "REQ" | "DONE">("ALL");

  async function load() {
    setLoading(true);
    const r = await fetch("/api/admin/topups", { cache: "no-store" });
    const d = await r.json();
    setItems(d.items || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function act(id: string, action: "APPROVE" | "REJECT") {
    const r = await fetch("/api/admin/topups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    const d = await r.json();
    if (!r.ok) {
      setToast({ type: "err", msg: d?.error || "처리 실패" });
    } else {
      setToast({ type: "ok", msg: action === "APPROVE" ? "승인 완료" : "거절 완료" });
      load();
    }
    setTimeout(() => setToast(null), 1500);
  }

  const filtered = useMemo(() => {
    if (tab === "REQ") return items.filter(i => i.status === "REQUESTED");
    if (tab === "DONE") return items.filter(i => i.status !== "REQUESTED");
    return items;
  }, [items, tab]);

  return (
    <section className="space-y-4">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            className={`fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-xl px-3 py-2 text-sm backdrop-blur
            ${toast.type === "ok" ? "bg-green-500/20 text-green-300 ring-1 ring-green-400/40" : "bg-red-500/20 text-red-300 ring-1 ring-red-400/40"}`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <h1 className="text-2xl font-semibold">충전 신청 관리</h1>

      {/* 탭 */}
      <div className="panel flex gap-2">
        <button className={`btn-ghost ${tab==="ALL"?"ring-1 ring-white/20":""}`} onClick={()=>setTab("ALL")}>전체</button>
        <button className={`btn-ghost ${tab==="REQ"?"ring-1 ring-white/20":""}`} onClick={()=>setTab("REQ")}>대기</button>
        <button className={`btn-ghost ${tab==="DONE"?"ring-1 ring-white/20":""}`} onClick={()=>setTab("DONE")}>처리완료</button>
        <div className="ml-auto text-sm text-white/60">
          총 {items.length}건 · 대기 {items.filter(i=>i.status==="REQUESTED").length}건
        </div>
      </div>

      <div className="space-y-2">
        {loading && <div className="panel">불러오는 중…</div>}
        {!loading && filtered.length === 0 && (
          <div className="panel text-white/60">표시할 항목이 없습니다.</div>
        )}

        {filtered.map(t => (
          <div key={t.id} className="card p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{t.user.email ?? "(이메일 없음)"}</div>
              <div className="text-xs text-white/60">
                {new Date(t.createdAt).toLocaleString()} · 상태{" "}
                <span className={
                  t.status === "REQUESTED" ? "text-yellow-300" :
                  t.status === "APPROVED" ? "text-green-300" : "text-red-300"
                }>
                  {t.status}
                </span>
              </div>
              {t.memo && <div className="text-sm mt-1 text-white/80">메모: {t.memo}</div>}
            </div>
            <div className="flex items-center gap-3">
              <div className="font-semibold">{t.amount.toLocaleString()} 원</div>
              {t.status === "REQUESTED" ? (
                <>
                  <button className="btn-primary" onClick={()=>act(t.id, "APPROVE")}>승인</button>
                  <button className="btn-ghost" onClick={()=>act(t.id, "REJECT")}>거절</button>
                </>
              ) : (
                <span className="text-white/50 text-sm w-16 text-center">완료</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
