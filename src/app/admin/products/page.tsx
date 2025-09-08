// src/app/admin/products/page.tsx
export const revalidate = 0;

import prisma from "@/lib/prisma";
import ProductEditor from "./product-editor";

export default async function AdminProductsPage() {
  // 1) 상품 목록(총 재고 수만 _count로)
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { accounts: true } }, // ✅ where 불가(총 개수만)
    },
  });

  // 2) 미할당 재고 수는 별도로 groupBy로 계산
  const available = await prisma.account.groupBy({
    by: ["productId"],
    where: { isAllocated: false },
    _count: { _all: true },
  });
  const availableMap = Object.fromEntries(
    available.map((g) => [g.productId, g._count._all])
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">상품 관리</h1>

      {/* 상품 생성/수정 UI */}
      <ProductEditor />

      <div className="grid gap-3">
        {products.map((p) => {
          const avail = availableMap[p.id] ?? 0;
          return (
            <div key={p.id} className="card p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">
                  {p.name}{" "}
                  {!p.isActive && (
                    <span className="text-xs text-red-500">(비활성)</span>
                  )}
                </div>
                <div className="text-sm text-white/60">
                  가격: {p.price.toLocaleString()}원 · 재고(미할당): {avail} · 총계정: {p._count.accounts}
                </div>
                {p.description && (
                  <div className="text-sm mt-1">{p.description}</div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  className="btn-ghost"
                  onClick={async () => {
                    const ok = confirm("정말 삭제할까요?");
                    if (!ok) return;
                    await fetch(`/api/admin/products?id=${p.id}`, {
                      method: "DELETE",
                    });
                    location.reload();
                  }}
                >
                  삭제
                </button>
              </div>
            </div>
          );
        })}

        {products.length === 0 && (
          <div className="panel text-white/70">상품이 없습니다. 위에서 추가하세요.</div>
        )}
      </div>
    </div>
  );
}
