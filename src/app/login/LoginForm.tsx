// src/app/login/LoginForm.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [success, setSuccess] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", { redirect: false, email, password: pw });
    setLoading(false);

    if (res?.error) {
      setToast({ type: "err", msg: "이메일 또는 비밀번호가 올바르지 않습니다." });
      setTimeout(() => setToast(null), 1700);
      return;
    }
    setToast({ type: "ok", msg: "로그인 성공!" });
    setSuccess(true);
    setTimeout(() => (window.location.href = "/"), 1100);
  }

  return (
    <div className="relative">
      {/* 토스트 */}
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

      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block text-sm text-white/80">이메일</label>
        <input
          className="input"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="mt-2 block text-sm text-white/80">비밀번호</label>
        <div className="relative">
          <input
            className="input pr-12"
            type={show ? "text" : "password"}
            placeholder="••••••••"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs text-white/70 hover:text-white/95"
          >
            {show ? "숨김" : "표시"}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`btn-primary mt-2 w-full ${loading ? "opacity-60" : ""}`}
        >
          {loading ? "로그인 중…" : "로그인"}
        </button>

        <p className="pt-1 text-center text-sm text-white/60">
          계정이 없나요?{" "}
          <a href="/register" className="text-neon-400 hover:underline">
            회원가입
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
                className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-2xl shadow-[0_0_28px_rgba(34,197,94,.65)]"
              >
                ✓
              </motion.div>
              <motion.p
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="font-semibold text-green-300"
              >
                로그인 성공!
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
