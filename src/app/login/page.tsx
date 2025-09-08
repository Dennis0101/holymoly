"use client";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const error = sp.get("error");

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm border rounded p-6 space-y-4">
        <h1 className="text-xl font-semibold">로그인</h1>
        {error && <p className="text-sm text-red-500">로그인 실패. 정보를 확인해주세요.</p>}
        <input className="w-full border rounded p-2" placeholder="Email" value={email}
               onChange={(e)=>setEmail(e.target.value)} />
        <input className="w-full border rounded p-2" placeholder="Password" type="password"
               value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button
          className="w-full border rounded p-2 hover:bg-gray-50"
          onClick={async ()=>{
            const res = await signIn("credentials", { email, password, redirect: false });
            if (!res?.error) router.replace("/");
          }}>
          로그인
        </button>
        <a href="/register" className="block text-center text-sm text-gray-600 hover:underline">회원가입</a>
      </div>
    </div>
  );
}
