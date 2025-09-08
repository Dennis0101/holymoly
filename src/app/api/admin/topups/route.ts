import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

function ensureAdmin(session: any) {
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    throw new Response("FORBIDDEN", { status: 403 });
  }
}

export async function GET() {
  const session = await auth(); ensureAdmin(session);
  const items = await prisma.topup.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { email: true } } },
    take: 200,
  });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const session = await auth(); ensureAdmin(session);
  const { id, action } = await req.json(); // action: "APPROVE" | "REJECT"
  if (!id || !["APPROVE", "REJECT"].includes(action)) {
    return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
  }

  if (action === "APPROVE") {
    const r = await prisma.$transaction(async (tx) => {
      const t = await tx.topup.update({
        where: { id },
        data: { status: "APPROVED" },
      });
      await tx.user.update({
        where: { id: t.userId },
        data: { balance: { increment: t.amount } },
      });
      return t;
    });
    return NextResponse.json({ ok: true, topup: r });
  } else {
    const r = await prisma.topup.update({
      where: { id },
      data: { status: "REJECTED" },
    });
    return NextResponse.json({ ok: true, topup: r });
  }
}
