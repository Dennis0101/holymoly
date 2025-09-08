import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { sendDiscordPurchaseLog } from "@/lib/discord";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "UNAUTH" }, { status: 401 });
  }

  const isAjax =
    req.headers.get("x-ajax") === "1" ||
    (req.headers.get("accept") || "").includes("application/json");

  const contentType = req.headers.get("content-type") || "";
  let productId: string | undefined;

  if (contentType.includes("application/json")) {
    const body = await req.json();
    productId = body?.productId;
  } else {
    const form = await req.formData();
    productId = String(form.get("productId") || "");
  }

  if (!productId) {
    const resp = { error: "NO_PRODUCT" };
    return isAjax
      ? NextResponse.json(resp, { status: 400 })
      : NextResponse.json(resp, { status: 400 });
  }

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
        data: { userId: user.id, productId: product.id, status: "PAID", price: product.price },
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

    // 디스코드 로그(실패 무시)
    sendDiscordPurchaseLog({
      userId: result.user.id,
      userEmail: result.user.email ?? undefined,
      productName: result.order.product.name,
      orderId: result.order.id,
    }).catch(() => {});

    if (isAjax) {
      return NextResponse.json({ ok: true, orderId: result.order.id });
    }
    return NextResponse.redirect(new URL("/orders", req.url));
  } catch (e: any) {
    const code = e?.message || "ERROR";
    const map: Record<string, string> = {
      NO_PRODUCT: "존재하지 않는 상품입니다.",
      NO_USER: "유저를 찾을 수 없습니다.",
      NO_BALANCE: "잔액이 부족합니다.",
      NO_STOCK: "재고가 없습니다.",
    };
    const msg = map[code] ?? "구매 실패";
    return isAjax
      ? NextResponse.json({ error: msg, code }, { status: 400 })
      : NextResponse.json({ error: msg, code }, { status: 400 });
  }
}
