// src/app/register/RegisterForm.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [success, setSuccess] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pw !== pw2) {
      setToast({ type: "err", msg: "비밀번호가 일치하지 않습니다." });
      setTimeout(() => setToast(null), 1700);
      return;
    }
    setLoading(true);
    try {
      const r = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pw }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d?.error || "회원가입 실패");
      setToast({ type: "ok", msg: "회원가입 완료! 로그인 페이지로 이동합니다." });
      setSuccess(true);
      setTimeout(() => (window.location.href = "/login"), 1100);
    } catch (e: any) {
      setToast({ type: "err", msg: e?.message || "오류가 발생했습니다." });
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), 1800);
    }
  }

  return (
    <div className="relative">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            className={`mb-4 w-full rounded-xl px-3 py-2 text-sm ${
              toast.type === "ok"
                ? "bg-green-500/15 text-green-300 ring-1 ring-green-400/40"
                : "bg-red-500/15 text-red-300 ring-1 ring-red-400/40"
            }`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={submit} className="space-y-3">
        <label className="block text-sm text-white/80">이메일</label>
        <input
          className="input"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="block text-sm text-white/80">비밀번호</label>
        <input
          className="input"
          type="password"
          placeholder="최소 6자"
          value={pw}
          minLength={6}
          onChange={(e) => setPw(e.target.value)}
          required
        />

        <label className="block text-sm text-white/80">비밀번호 확인</label>
        <input
          className="input"
          type="password"
          placeholder="한 번 더 입력"
          value={pw2}
          minLength={6}
          onChange={(e) => setPw2(e.target.value)}
          required
        />

        <button type="submit" disabled={loading} className={`btn-primary mt-2 w-full ${loading ? "opacity-60" : ""}`}>
          {loading ? "가입 중…" : "가입하기"}
        </button>

        <p className="pt-1 text-center text-sm text-white/60">
          이미 계정이 있나요?{" "}
          <a href="/login" className="text-neon-400 hover:underline">
            로그인
          </a>
        </p>
      </form>

      {/* 성공 팝업 */}
      <AnimatePresence>
        {success && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center rounded-3xl bg-black/60 backdrop-blur-sm"
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
                transition={{ duration: 0.55 }}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-500 text-2xl shadow-[0_0_28px_rgba(14,165,233,.65)]"
              >
                ✓
              </motion.div>
              <motion.p
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="font-semibold text-sky-300"
              >
                회원가입 완료!
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
