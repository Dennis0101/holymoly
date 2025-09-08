import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import dynamic from "next/dynamic";

export const revalidate = 0;

// 클라 컴포넌트(애니메이션 포함 구매 버튼) 동적 임포트
const BuyButton = dynamic(() => import("@/components/BuyButton"), { ssr: false });

export default async function DashboardPage() {
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;

  const [me, products] = await Promise.all([
    userId
      ? prisma.user.findUnique({
          where: { id: userId },
          select: { balance: true, email: true },
        })
      : Promise.resolve(null),
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, price: true, description: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">대시보드</h1>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="panel">
          <div className="text-sm text-white/60">내 잔액</div>
          <div className="text-2xl font-bold">
            {me ? me.balance.toLocaleString() : "-"} 원
          </div>
        </div>
        <a href="/topup" className="panel hover:ring-1 hover:ring-indigo-400/40">
          <div className="text-sm text-white/60">충전하기</div>
          <div className="text-lg font-medium">포인트 충전</div>
        </a>
        <a href="/orders" className="panel hover:ring-1 hover:ring-indigo-400/40">
          <div className="text-sm text-white/60">구매내역</div>
          <div className="text-lg font-medium">주문 기록 보기</div>
        </a>
      </div>

      <div className="panel">
        <h2 className="font-display text-xl mb-3">상품 목록</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div key={p.id} className="card p-4 flex flex-col justify-between">
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-white/60 text-sm">
                  {p.description ?? ""}
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="font-semibold">
                  {p.price.toLocaleString()} 원
                </div>
                {/* ✅ AJAX + 애니메이션 구매 버튼 */}
                <BuyButton productId={p.id} />
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="text-white/60">판매중인 상품이 없습니다.</div>
          )}
        </div>
      </div>
    </div>
  );
}
