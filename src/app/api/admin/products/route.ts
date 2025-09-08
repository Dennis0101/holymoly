import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

function assertAdmin(session: any) {
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }
}

export async function GET() {
  const session = await auth();
  const forbid = assertAdmin(session); if (forbid) return forbid;
  const items = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const forbid = assertAdmin(session); if (forbid) return forbid;
  const { name, price, description } = await req.json();
  if (!name || isNaN(Number(price))) return NextResponse.json({ error: "INVALID" }, { status: 400 });
  const item = await prisma.product.create({
    data: { name, price: Number(price), description: description ?? null, isActive: true },
  });
  return NextResponse.json({ item });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  const forbid = assertAdmin(session); if (forbid) return forbid;
  const { id, ...data } = await req.json();
  if (!id) return NextResponse.json({ error: "NO_ID" }, { status: 400 });
  const item = await prisma.product.update({ where: { id }, data });
  return NextResponse.json({ item });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  const forbid = assertAdmin(session); if (forbid) return forbid;
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "NO_ID" }, { status: 400 });
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
