"use client";
import { useState } from "react";

export default function ProductEditor() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const onSave = async () => {
    setSaving(true);
    setErr("");
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({
          name, price: typeof price === "string" ? Number(price) : price,
          description, isActive
        })
      });
      if (!res.ok) {
        const j = await res.json().catch(()=>({}));
        throw new Error(j.error || "SAVE_FAIL");
      }
      location.reload();
    } catch (e:any) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border rounded p-4 space-y-3">
      <div className="font-medium">상품 추가</div>
      {err && <div className="text-sm text-red-500">{err}</div>}
      <input className="border rounded p-2 w-full" placeholder="상품명"
        value={name} onChange={e=>setName(e.target.value)} />
      <input className="border rounded p-2 w-full" placeholder="가격(정수)"
        value={price} onChange={e=>setPrice(e.target.value as any)} />
      <textarea className="border rounded p-2 w-full" placeholder="설명(선택)"
        value={description} onChange={e=>setDescription(e.target.value)} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={isActive} onChange={e=>setIsActive(e.target.checked)} />
        활성화
      </label>
      <button disabled={saving} onClick={onSave}
        className="px-3 py-2 border rounded hover:bg-gray-50 disabled:opacity-50">
        저장
      </button>
    </div>
  );
}
