"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import SuccessOverlay from "../../components/SuccessOverlay";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    const res = await signIn("credentials", { redirect: false, email, password });
    setSubmitting(false);

    if (res?.error) {
      setErrorMsg(res.error === "CredentialsSignin" ? "이메일 또는 비밀번호가 올바르지 않습니다." : res.error);
      return;
    }
    setSuccess(true);
    setTimeout(() => (window.location.href = "/"), 1200);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-900 px-4">
      <form onSubmit={handleSubmit} className="panel relative w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold text-center">계정 로그인</h1>

        {errorMsg && (
          <div className="rounded-md bg-red-500/15 border border-red-500/30 text-red-300 text-sm px-3 py-2">
            {errorMsg}
          </div>
        )}

        <div>
          <label className="block text-sm mb-1 text-white/80">이메일</label>
          <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1 text-white/80">비밀번호</label>
          <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? "로그인 중..." : "로그인"}
        </button>

        {/* ✅ 성공 애니메이션 오버레이 */}
        <SuccessOverlay show={success} />
      </form>
    </div>
  );
}
