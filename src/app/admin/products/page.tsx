// src/app/admin/products/page.tsx
export const dynamic = "force-dynamic"; // 매 요청 새로
import prisma from "@/lib/prisma";
import ProductRow from "./product-row";
import ProductEditor from "./product-editor";

export default async function AdminProductsPage() {
  // 상품 목록
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, description: true, price: true, isActive: true, createdAt: true },
  });

  // 미할당 재고 카운트 (1쿼리로 groupBy)
  const stock = await prisma.account.groupBy({
    by: ["productId"],
    where: { isAllocated: false },
    _count: { _all: true },
  });
  const stockMap = new Map(stock.map(s => [s.productId, s._count._all]));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">상품 관리</h1>
        <a href="/admin/inventory" className="btn-ghost">인벤토리로 이동</a>
      </div>

      {/* 신규 상품 생성 폼 (기존 컴포넌트) */}
      <ProductEditor />

      {/* 검색 입력 */}
      <form className="sm:w-80">
        <input
          name="q"
          placeholder="상품명 검색…"
          className="input"
          defaultValue=""
          onChange={(e) => {
            const v = e.currentTarget.value.toLowerCase();
            document.querySelectorAll<HTMLElement>("[data-row-name]").forEach(el => {
              const name = el.dataset.rowName!.toLowerCase();
              el.style.display = name.includes(v) ? "" : "none";
            });
          }}
        />
      </form>

      <div className="grid gap-3">
        {products.map(p => (
          <ProductRow
            key={p.id}
            product={{
              ...p,
              stock: stockMap.get(p.id) ?? 0,
            }}
          />
        ))}
        {products.length === 0 && (
          <div className="card text-white/70">등록된 상품이 없습니다. 상단에서 추가하세요.</div>
        )}
      </div>
    </div>
  );
}
