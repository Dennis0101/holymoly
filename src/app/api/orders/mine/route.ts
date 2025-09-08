import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "UNAUTH" }, { status: 401 });
  }

  const userId = (session.user as any).id as string;
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      product: { select: { name: true, price: true } },
      account: { select: { id: true, username: true, isAllocated: true } },
    },
  });

  return NextResponse.json({ items: orders });
}
