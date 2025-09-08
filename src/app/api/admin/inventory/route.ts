import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { encrypt } from "@/lib/crypto";

function assertAdmin(session: any) {
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }
}

export async function GET(req: NextRequest) {
  const session = await auth();
  const forbid = assertAdmin(session); if (forbid) return forbid;

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId") || undefined;
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("pageSize") || 20);

  const where = { ...(productId ? { productId } : {}) };
  const [items, total] = await Promise.all([
    prisma.account.findMany({
      where, orderBy: [{ isAllocated: "asc" }, { createdAt: "desc" }],
      skip: (page - 1) * pageSize, take: pageSize,
      select: { id: true, username: true, isAllocated: true, allocatedAt: true, product: { select: { name: true } } },
    }),
    prisma.account.count({ where }),
  ]);
  return NextResponse.json({ items, total, page, pageSize });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const forbid = assertAdmin(session); if (forbid) return forbid;

  const { productId, lines } = await req.json();
  if (!productId || !lines) return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });

  const prod = await prisma.product.findUnique({ where: { id: productId } });
  if (!prod) return NextResponse.json({ error: "NO_PRODUCT" }, { status: 404 });

  const rows = String(lines).split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
  const data = rows.map((row) => {
    const [user, pass] = row.split(/[:|,]/);
    if (!user || !pass) return null;
    return { productId, username: user.trim(), passwordEnc: encrypt(pass.trim()) };
  }).filter(Boolean) as any[];

  await prisma.account.createMany({ data, skipDuplicates: true });
  return NextResponse.json({ ok: true, count: data.length });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  const forbid = assertAdmin(session); if (forbid) return forbid;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "NO_ID" }, { status: 400 });
  await prisma.account.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
