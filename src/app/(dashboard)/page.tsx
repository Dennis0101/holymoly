import prisma from "../../lib/prisma";
import Shop from "./shop";

export default async function DashboardPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { accounts: { where: { isAllocated: false } } } },
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">대시보드</h1>
      <Shop products={products.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        stock: p._count.accounts
      }))} />
    </div>
  );
}
