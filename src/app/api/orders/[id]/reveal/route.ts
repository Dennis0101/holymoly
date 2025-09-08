// src/app/api/orders/[id]/reveal/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../lib/auth";     // ✅ v5
import prisma from "../../../../../lib/prisma";
import { decrypt } from "../../../../../lib/crypto";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();                     // ✅
  if (!session?.user) {
    return NextResponse.json({ error: "UNAUTH" }, { status: 401 });
  }

  const userId = (session.user as any).id as string;
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { account: true, user: { select: { id: true } } },
  });

  if (!order || order.user.id !== userId) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }
  if (!order.account || !order.account.passwordEnc) {
    return NextResponse.json({ error: "NO_ACCOUNT" }, { status: 400 });
  }

  const username = order.account.username;
  const password = decrypt(order.account.passwordEnc);
  return NextResponse.json({ username, password });
}
