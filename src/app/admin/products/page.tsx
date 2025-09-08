import prisma from "@/lib/prisma";
import ProductEditor from "./product-editor";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { accounts: { where: { isAllocated: false } } } }
    }
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">상품 관리</h1>
      <ProductEditor />
      <div className="grid gap-3">
        {products.map(p => (
          <div key={p.id} className="border rounded p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{p.name} {p.isActive ? "" : <span className="text-xs text-red-500">(비활성)</span>}</div>
                <div className="text-sm text-gray-500">가격: {p.price} / 재고(미할당): {p._count.accounts}</div>
                {p.description && <div className="text-sm mt-1">{p.description}</div>}
              </div>
              <div className="flex gap-2">
                <form action={`/api/admin/products`} method="post">
                  <input type="hidden" name="id" value={p.id} />
                  {/* 간단 편집은 클라 컴포넌트 사용 권장. 여기선 삭제 버튼만 예시 */}
                </form>
                <button
                  className="text-sm px-3 py-1 border rounded"
                  onClick={async ()=>{
                    await fetch(`/api/admin/products?id=${p.id}`, { method:"DELETE" });
                    location.reload();
                  }}
                >삭제</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
