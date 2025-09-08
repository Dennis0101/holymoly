"use client";
import { useEffect, useState } from "react";

export default function AdminSettings() {
  const [url, setUrl] = useState("");
  const [img, setImg] = useState("");                // 👈 추가
  const [ok, setOk] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const r = await fetch("/api/admin/settings/webhook", { cache: "no-store" });
      const d = await r.json();
      setUrl(d?.discordWebhookUrl || "");
      setImg(d?.discordImageUrl || "");              // 👈 추가
    })();
  }, []);

  async function save() {
    const r = await fetch("/api/admin/settings/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        discordWebhookUrl: url,
        discordImageUrl: img,                        // 👈 추가
      }),
    });
    setOk(r.ok ? "저장되었습니다." : "실패했습니다.");
    setTimeout(() => setOk(null), 1500);
  }

  return (
    <section className="panel space-y-4">
      <h2 className="font-display text-xl">설정</h2>

      <div className="space-y-2">
        <label className="text-sm text-white/70">디스코드 구매 웹훅 URL</label>
        <input
          className="input"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://discord.com/api/webhooks/..."
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-white/70">웹훅 이미지(큰 이미지) PNG URL</label>
        <input
          className="input"
          value={img}
          onChange={(e) => setImg(e.target.value)}
          placeholder="https://.../image.png"
        />
        {!!img && (
          <div className="mt-2">
            <div className="text-xs text-white/60 mb-1">미리보기</div>
            {/* 미리보기 */}
            <img
              src={img}
              alt="webhook preview"
              className="w-full max-w-md rounded-lg border border-white/10"
            />
          </div>
        )}
      </div>

      <button className="btn-primary" onClick={save}>저장</button>
      {ok && <div className="text-sm text-emerald-300">{ok}</div>}
    </section>
  );
}
