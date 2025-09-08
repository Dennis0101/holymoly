// src/app/admin/products/page.tsx
export const revalidate = 0;

import prisma from "@/lib/prisma";
import ProductEditor from "./product-editor";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { accounts: true } },
    },
  });

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
      <h1 className="text-2xl font-semibold text-white">상품 관리</h1>

      {/* 상품 생성/수정 UI */}
      <ProductEditor />

      <div className="grid gap-3">
        {products.map((p) => {
          const avail = availableMap[p.id] ?? 0;
          return (
            <div
              key={p.id}
              className="card p-4 flex items-center justify-between bg-base-800 border border-white/10"
            >
              <div>
                <div className="font-medium text-white">
                  {p.name}{" "}
                  {!p.isActive && (
                    <span className="text-xs text-red-400">(비활성)</span>
                  )}
                </div>
                <div className="text-sm text-white/80 mt-1">
                  <span className="font-medium text-neon-400">
                    {p.price.toLocaleString()}원
                  </span>{" "}
                  · 미할당 재고:{" "}
                  <span className="text-green-400">{avail}</span> · 총 계정:{" "}
                  <span className="text-blue-400">{p._count.accounts}</span>
                </div>
                {p.description && (
                  <div className="text-sm mt-2 text-white/70">
                    {p.description}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  className="btn-ghost text-red-400 hover:text-red-300"
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
          <div className="panel text-white/70">
            상품이 없습니다. 위에서 추가하세요.
          </div>
        )}
      </div>
    </div>
  );
}
