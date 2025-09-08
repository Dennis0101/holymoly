export const revalidate = 0;

import prisma from "../../lib/prisma";

export default async function Dashboard() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" }, take: 9 });

  return (
    <>
      <section className="panel neon-border">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl">마켓 플레이스</h1>
            <p className="text-white/60 mt-1">인기 계정/상품을 네온 스타일로 즐겨보세요.</p>
          </div>
          <div className="flex gap-2">
            <a href="/topup" className="btn-ghost">충전하기</a>
            <a href="/orders" className="btn-primary">내 주문</a>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <article key={p.id} className="card group">
            <div className="flex items-start justify-between">
              <h3 className="font-display text-lg">{p.name}</h3>
              <span className="badge">신규</span>
            </div>
            <p className="text-sm text-white/70 mt-2 line-clamp-2">{p.description ?? "설명 없음"}</p>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-xl font-semibold">{p.price.toLocaleString()}원</div>
              <a href={`/products/${p.id}`} className="btn-primary">구매</a>
            </div>
          </article>
        ))}
        {products.length === 0 && (
          <div className="col-span-full panel">상품이 없습니다. 어드민에서 추가하세요.</div>
        )}
      </section>
    </>
  );
}
