"use client";
import { useState } from "react";

export default function TopupPage() {
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function submit() {
    if (!amount) return setMsg("금액을 입력해주세요.");
    const r = await fetch("/api/topup/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Number(amount), memo }),
    });
    const d = await r.json();
    if (!r.ok) setMsg(d?.error || "신청 실패");
    else setMsg("충전 신청이 접수되었습니다. 관리자 승인 후 잔액이 반영됩니다.");
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">충전 신청</h1>
      <div className="panel space-y-3 max-w-md">
        <input
          className="input"
          type="number"
          placeholder="충전 금액"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <textarea
          className="input h-24"
          placeholder="메모(입금자명, 송금 스샷 링크 등)"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />
        <button className="btn-primary" onClick={submit}>신청하기</button>
        {msg && <div className="text-sm text-white/70">{msg}</div>}
      </div>
    </div>
  );
}
