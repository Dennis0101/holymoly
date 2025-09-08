"use client";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [url, setUrl] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      const r = await fetch("/api/admin/settings/webhook");
      const j = await r.json();
      setUrl(j.url || "");
    })();
  }, []);

  const onSave = async () => {
    setMsg("");
    const r = await fetch("/api/admin/settings/webhook", {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ url })
    });
    setMsg(r.ok ? "저장되었습니다." : "저장 실패");
  };

  return (
    <div className="space-y-4 max-w-xl">
      <h1 className="text-2xl font-semibold">설정</h1>
      <label className="block text-sm font-medium">디스코드 웹훅 URL</label>
      <input className="w-full border rounded p-2" placeholder="https://discord.com/api/webhooks/..."
             value={url} onChange={e=>setUrl(e.target.value)} />
      <button className="px-3 py-2 border rounded hover:bg-gray-50" onClick={onSave}>저장</button>
      {msg && <div className="text-sm text-gray-600">{msg}</div>}
    </div>
  );
}
