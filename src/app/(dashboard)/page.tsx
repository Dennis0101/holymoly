export const revalidate = 0;

import prisma from "../../lib/prisma";

export default async function Dashboard() {
  const products = await prisma.product.findMany({ take: 6, orderBy: { createdAt: "desc" } });

  return (
    <div className="container space-y-6">
      <h1 className="text-2xl font-bold">대시보드</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <div key={p.id} className="card">
            <div className="font-semibold">{p.name}</div>
            <div className="mt-2 text-sm text-gray-500">{p.description ?? "설명 없음"}</div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-lg font-bold">{p.price.toLocaleString()}원</span>
              <a href={`/products/${p.id}`} className="btn-primary">구매</a>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="col-span-full card">상품이 없습니다. 어드민에서 추가하세요.</div>
        )}
      </div>
    </div>
  );
}
