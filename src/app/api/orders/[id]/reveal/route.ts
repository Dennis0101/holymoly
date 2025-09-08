// 상단 임포트 전부 교체
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";
import prisma from "../../../../../lib/prisma";
import { decrypt } from "../../../../../lib/crypto";

// 이하 기존 코드 그대로…
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "UNAUTH" }, { status: 401 });

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

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "UNAUTH" }, { status: 401 });

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
