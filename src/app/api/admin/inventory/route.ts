import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";
import { encrypt } from "@/lib/crypto";

// GET ?productId=&page=&pageSize=
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  requireAdmin(session);

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId") || undefined;
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("pageSize") || 20);

  const where = {
    ...(productId ? { productId } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.account.findMany({
      where,
      orderBy: [{ isAllocated: "asc" }, { createdAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true, username: true, isAllocated: true, allocatedAt: true,
        product: { select: { name: true } }
      }
    }),
    prisma.account.count({ where }),
  ]);

  return NextResponse.json({ items, total, page, pageSize });
}

// POST { productId, lines: "id:pw\nid2:pw2" }
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  requireAdmin(session);

  const { productId, lines } = await req.json();
  if (!productId || !lines) {
    return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return NextResponse.json({ error: "NO_PRODUCT" }, { status: 404 });

  const rows = String(lines).split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  if (!rows.length) return NextResponse.json({ error: "EMPTY" }, { status: 400 });

  const data = rows.map((row: string) => {
    // "username:password" 또는 "email,password" 등 자유형식 → 가장 단순한 ":" 기준
    const [user, pass] = row.split(/[:|,]/);
    if (!user || !pass) return null;
    return {
      productId,
      username: user.trim(),
      passwordEnc: encrypt(pass.trim()),
    };
  }).filter(Boolean) as any[];

  await prisma.account.createMany({ data, skipDuplicates: true });

  return NextResponse.json({ ok: true, count: data.length });
}

// DELETE ?id= (개별 삭제)
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  requireAdmin(session);

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "NO_ID" }, { status: 400 });

  await prisma.account.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
