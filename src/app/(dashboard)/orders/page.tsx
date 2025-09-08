import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const revalidate = 0;

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) return <div className="panel">로그인이 필요합니다.</div>;
  const userId = (session.user as any).id as string;

  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { product: { select: { name: true, price: true } }, account: { select: { id: true, username: true } } },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">구매내역</h1>
      <div className="space-y-2">
        {orders.map((o) => (
          <div key={o.id} className="card p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{o.product.name}</div>
              <div className="text-xs text-white/60">
                {new Date(o.createdAt).toLocaleString()} · {o.status}
              </div>
              <div className="text-sm mt-1">아이디: {o.account?.username ?? "-"}</div>
            </div>
            <div className="font-semibold">{o.price.toLocaleString()} 원</div>
          </div>
        ))}
        {orders.length === 0 && <div className="panel text-white/60">구매한 항목이 없습니다.</div>}
      </div>
    </div>
  );
}
