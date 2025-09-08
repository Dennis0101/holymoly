"use client";

import { useState } from "react";

export default function LoginClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-950 to-gray-900">
      <div className="bg-gray-900/70 backdrop-blur-xl p-8 rounded-2xl shadow-xl w-full max-w-md border border-white/10">
        <h1 className="text-2xl font-bold text-center mb-6 text-white">
          계정 로그인
        </h1>

        <form
          method="post"
          action="/api/auth/callback/credentials"
          className="space-y-4"
        >
          {/* 이메일 */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              이메일
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input"
              placeholder="example@email.com"
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              비밀번호
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input"
              placeholder="••••••••"
            />
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-neon-500 hover:bg-neon-400 
                       text-white font-semibold transition"
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}
