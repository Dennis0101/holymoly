"use client";

import { useState } from "react";

export default function ProductEditor() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [desc, setDesc] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || price === "" || Number(price) < 0) {
      alert("상품명과 가격을 확인하세요.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        price: Number(price),
        description: desc || undefined,
        isActive,
      }),
    });
    setLoading(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      alert(d?.error ?? "저장 실패");
      return;
    }
    // 초기화 + 새로고침
    setName("");
    setPrice("");
    setDesc("");
    setIsActive(true);
    location.reload();
  }

  return (
    <form onSubmit={onSubmit} className="panel space-y-3">
      <h2 className="font-display text-xl text-white">상품 추가</h2>

      <input
        className="input"
        placeholder="상품명"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="input"
        placeholder="가격(숫자)"
        inputMode="numeric"
        value={price}
        onChange={(e) => {
          const v = e.target.value.replace(/[^\d]/g, "");
          setPrice(v === "" ? "" : Number(v));
        }}
      />

      <textarea
        className="input h-28"
        placeholder="설명(선택)"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />

      <label className="flex items-center gap-2 text-white">
        <input
          type="checkbox"
          className="h-4 w-4 accent-blue-500"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        활성화
      </label>

      <button
        type="submit"
        className="btn-primary w-28"
        disabled={loading}
      >
        {loading ? "저장 중..." : "저장"}
      </button>
    </form>
  );
}
