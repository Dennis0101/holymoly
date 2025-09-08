export const revalidate = 0;
// 필요하면 아래 라인으로 프리렌더 방지해도 됩니다.
// export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import ProductEditor from "./product-editor";
import ProductListClient from "./product-list-client";

export default async function AdminProductsPage() {
  try {
    // 1) 전체 상품 목록 + 총 계정 수(_count)
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { accounts: true } } },
    });

    // 2) 각 상품의 "미할당(inventory)" 개수 (groupBy 대신 안전한 count 반복)
    const ids = products.map((p) => p.id);
    const availableCounts = await Promise.all(
      ids.map((id) =>
        prisma.account.count({ where: { productId: id, isAllocated: false } })
      )
    );
    const availableMap = Object.fromEntries(
      ids.map((id, i) => [id, availableCounts[i]])
    );

    const items = products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      isActive: p.isActive,
      totalAccounts: p._count.accounts,
      available: availableMap[p.id] ?? 0,
    }));

    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-white">상품 관리</h1>
        <ProductEditor />
        <ProductListClient items={items} />
      </div>
    );
  } catch (err) {
    // 서버에서 에러가 나도 전체 500로 무너지는 걸 막아줌
    console.error("[admin/products] page error:", err);
    return (
      <div className="panel text-red-300">
        상품 페이지를 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }
}
