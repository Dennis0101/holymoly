import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";
import { sendDiscordPurchaseLog } from "../../../../lib/discord";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "UNAUTH" }, { status: 401 });
  }
  const { productId } = await req.json();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { id: productId } });
      if (!product || !product.isActive) throw new Error("NO_PRODUCT");

      const user = await tx.user.findUnique({ where: { id: (session.user as any).id } });
      if (!user) throw new Error("NO_USER");
      if (user.balance < product.price) throw new Error("NO_BALANCE");

      const account = await tx.account.findFirst({
        where: { productId, isAllocated: false },
        orderBy: { createdAt: "asc" },
      });
      if (!account) throw new Error("NO_STOCK");

      const order = await tx.order.create({
        data: {
          userId: user.id,
          productId: product.id,
          status: "PAID",
          price: product.price,
        },
      });

      await tx.account.update({
        where: { id: account.id },
        data: {
          isAllocated: true,
          allocatedAt: new Date(),
          allocatedToId: user.id,
          order: { connect: { id: order.id } },
        },
      });
      await tx.user.update({
        where: { id: user.id },
        data: { balance: { decrement: product.price } },
      });
      const final = await tx.order.update({
        where: { id: order.id },
        data: { accountId: account.id, status: "FULFILLED" },
        include: { product: true },
      });

      return { order: final, user };
    });

    await sendDiscordPurchaseLog({
      userId: result.user.id,
      userEmail: result.user.email ?? undefined,
      productName: result.order.product.name,
      orderId: result.order.id,
    }).catch(() => {});

    return NextResponse.json({ ok: true, orderId: result.order.id });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "ERROR" }, { status: 400 });
  }
}
