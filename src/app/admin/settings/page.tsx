"use client";
import { useEffect, useState } from "react";

export default function AdminSettings() {
  const [url, setUrl] = useState("");
  const [ok, setOk] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const r = await fetch("/api/admin/settings/webhook");
      const d = await r.json();
      setUrl(d?.discordWebhookUrl || "");
    })();
  }, []);

  async function save() {
    const r = await fetch("/api/admin/settings/webhook", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ discordWebhookUrl: url }),
    });
    setOk(r.ok ? "저장되었습니다." : "실패했습니다.");
    setTimeout(() => setOk(null), 1500);
  }

  return (
    <section className="panel space-y-3">
      <h2 className="font-display text-xl">설정</h2>
      <label className="text-sm text-white/70">디스코드 구매 웹훅 URL</label>
      <input className="input" value={url} onChange={(e)=>setUrl(e.target.value)} placeholder="https://discord.com/api/webhooks/..." />
      <button className="btn-primary" onClick={save}>저장</button>
      {ok && <div className="text-sm text-emerald-300">{ok}</div>}
    </section>
  );
}
