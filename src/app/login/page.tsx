"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (!res?.error) {
      // ✅ 성공 애니메이션 실행
      setSuccess(true);

      // 1.5초 뒤 페이지 이동
      setTimeout(() => {
        window.location.href = "/dashboard"; // 원하는 경로
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-900">
      <form
        onSubmit={handleSubmit}
        className="panel w-full max-w-sm space-y-4 relative"
      >
        <h1 className="text-xl font-semibold text-center">계정 로그인</h1>

        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input"
        />

        <button type="submit" className="btn-primary w-full">
          로그인
        </button>

        {/* ✅ 성공 애니메이션 */}
        {success && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm rounded-2xl animate-fade">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center animate-bounce">
                ✅
              </div>
              <p className="text-green-400 font-medium animate-pulse">
                로그인 성공!
              </p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
