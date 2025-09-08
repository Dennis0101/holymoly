import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }
  const items = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { email: true } }, product: { select: { name: true } } },
    take: 200,
  });
  return NextResponse.json({ items });
}
