// src/app/admin/products/product-row.tsx
"use client";

import { useState, useTransition } from "react";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  isActive: boolean;
  stock: number; // 미할당 재고
};

export default function ProductRow({ product }: { product: Product }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState<number>(product.price);
  const [description, setDescription] = useState(product.description ?? "");
  const [isActive, setIsActive] = useState(product.isActive);
  const [pending, startTransition] = useTransition();

  async function patch(body: any) {
    const res = await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: product.id, ...body }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      alert(d?.error || "실패했습니다.");
      return false;
    }
    return true;
  }

  const toggleActive = () =>
    startTransition(async () => {
      if (await patch({ isActive: !isActive })) setIsActive(v => !v);
    });

  const save = () =>
    startTransition(async () => {
      if (await patch({ name, price: Number(price), description })) {
        setEditing(false);
      }
    });

  const remove = () =>
    startTransition(async () => {
      if (!confirm("정말 삭제하시겠어요? 이 작업은 되돌릴 수 없습니다.")) return;
      const res = await fetch(`/api/admin/products?id=${product.id}`, { method: "DELETE" });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        alert(d?.error || "삭제 실패");
        return;
      }
      // 간단 리프레시
      location.reload();
    });

  return (
    <div
      className="card flex flex-col gap-3"
      data-row-name={product.name}
    >
      <div className="flex items-center justify-between gap-3">
        {/* 이름/상태/가격/재고 */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="font-medium truncate">{product.name}</div>
            {isActive ? (
              <span className="text-xs rounded px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">판매중</span>
            ) : (
              <span className="text-xs rounded px-2 py-0.5 bg-rose-500/15 border border-rose-500/30 text-rose-300">비활성</span>
            )}
          </div>
          <div className="text-sm text-white/60">
            가격: {price.toLocaleString()}원 · 재고(미할당): {product.stock}
          </div>
          {description && <div className="text-sm mt-1 text-white/80 line-clamp-2">{description}</div>}
        </div>

        {/* 우측 액션 */}
        <div className="flex items-center gap-2 shrink-0">
          <Link href={`/admin/inventory?productId=${product.id}`} className="btn-ghost">재고보기</Link>
          <button className="btn-ghost" onClick={() => setEditing(v => !v)}>
            {editing ? "취소" : "편집"}
          </button>
          <button className="btn-ghost" onClick={toggleActive} disabled={pending}>
            {isActive ? "비활성화" : "활성화"}
          </button>
          <button className="btn-ghost" onClick={remove} disabled={pending}>삭제</button>
        </div>
      </div>

      {/* 인라인 편집 영역 */}
      {editing && (
        <div className="grid sm:grid-cols-3 gap-2">
          <input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="상품명" />
          <input className="input" type="number" value={price} onChange={e=>setPrice(Number(e.target.value))} placeholder="가격" />
          <input className="input sm:col-span-3" value={description} onChange={e=>setDescription(e.target.value)} placeholder="설명(선택)" />
          <div className="sm:col-span-3 flex gap-2">
            <button className="btn-primary" onClick={save} disabled={pending}>저장</button>
            <button className="btn-ghost" onClick={()=>setEditing(false)} disabled={pending}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}
