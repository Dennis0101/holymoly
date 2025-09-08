"use client";
import { useSearchParams } from "next/navigation";

export default function LoginClient() {
  const sp = useSearchParams();
  const error = sp.get("error");

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-sm rounded-lg border bg-white p-6 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          계정 로그인
        </h1>

        {error && (
          <div className="mb-4 rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">
            로그인 오류: {error}
          </div>
        )}

        <form
          action="/api/auth/callback/credentials"
          method="post"
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              이메일
            </label>
            <input
              type="email"
              name="email"
              required
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              비밀번호
            </label>
            <input
              type="password"
              name="password"
              required
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700"
          >
            로그인
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          계정이 없으신가요?{" "}
          <a href="/register" className="text-indigo-600 hover:underline">
            회원가입
          </a>
        </p>
      </div>
    </div>
  );
}
