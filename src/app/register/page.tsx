"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = async () => {
    setErr("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ email, name, password }),
    });
    const json = await res.json();
    if (!res.ok) setErr(json.error || "REGISTER_FAILED");
    else router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm border rounded p-6 space-y-4">
        <h1 className="text-xl font-semibold">회원가입</h1>
        {err && <p className="text-sm text-red-500">{err}</p>}
        <input className="w-full border rounded p-2" placeholder="Email" value={email}
               onChange={(e)=>setEmail(e.target.value)} />
        <input className="w-full border rounded p-2" placeholder="Name(선택)" value={name}
               onChange={(e)=>setName(e.target.value)} />
        <input className="w-full border rounded p-2" placeholder="Password(6자 이상)" type="password"
               value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button className="w-full border rounded p-2 hover:bg-gray-50" onClick={submit}>가입하기</button>
        <a href="/login" className="block text-center text-sm text-gray-600 hover:underline">로그인으로</a>
      </div>
    </div>
  );
}
