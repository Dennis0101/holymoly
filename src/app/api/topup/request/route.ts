import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "UNAUTH" }, { status: 401 });

  const { amount, memo } = await req.json();
  if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
    return NextResponse.json({ error: "INVALID_AMOUNT" }, { status: 400 });
  }

  await prisma.topup.create({
    data: {
      userId: (session.user as any).id,
      amount: Number(amount),
      status: "REQUESTED",
      memo: memo ?? null,
    },
  });

  return NextResponse.json({ ok: true });
}
