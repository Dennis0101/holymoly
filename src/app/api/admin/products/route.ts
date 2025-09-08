import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";
import { requireAdmin } from "../../../../lib/permissions";

// GET ?q= (검색/목록)
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  requireAdmin(session);

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || undefined;

  const items = await prisma.product.findMany({
    where: q ? { name: { contains: q, mode: "insensitive" } } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { accounts: { where: { isAllocated: false } } } }
    }
  });
  return NextResponse.json({ items });
}

// POST { name, price, description?, isActive? } (생성/수정 겸용)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  requireAdmin(session);

  const body = await req.json();
  const { id, name, price, description, isActive } = body;

  if (!name || typeof price !== "number") {
    return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
  }

  if (id) {
    const updated = await prisma.product.update({
      where: { id },
      data: { name, price, description, isActive }
    });
    return NextResponse.json({ item: updated });
  } else {
    const created = await prisma.product.create({
      data: { name, price, description, isActive: isActive ?? true }
    });
    return NextResponse.json({ item: created });
  }
}

// DELETE ?id=
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  requireAdmin(session);

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "NO_ID" }, { status: 400 });

  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
