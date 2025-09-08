// src/app/api/admin/inventory/route.ts
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
      where,
      orderBy: [{ isAllocated: "asc" }, { createdAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        username: true,
        isAllocated: true,
        allocatedAt: true,
        product: { select: { name: true } },
      },
    }),
    prisma.account.count({ where }),
  ]);

  return NextResponse.json({ items, total, page, pageSize });
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const forbid = assertAdmin(session); if (forbid) return forbid;

    const { productId, lines } = await req.json();
    if (!productId) return NextResponse.json({ error: "NO_PRODUCT_ID" }, { status: 400 });
    if (!lines || typeof lines !== "string") {
      return NextResponse.json({ error: "EMPTY" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return NextResponse.json({ error: "NO_PRODUCT" }, { status: 404 });

    const rows = lines.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    const parsed = rows
      .map(r => {
        const [u, p] = r.split(/[:|,]/);
        if (!u || !p) return null;
        return { username: u.trim(), password: p.trim() };
      })
      .filter(Boolean) as { username: string; password: string }[];

    if (!parsed.length) {
      return NextResponse.json({ error: "INVALID_FORMAT" }, { status: 400 });
    }

    let data: { productId: string; username: string; passwordEnc: string }[];
    try {
      data = parsed.map(({ username, password }) => ({
        productId,
        username,
        passwordEnc: encrypt(password),
      }));
    } catch {
      return NextResponse.json({ error: "NO_CRYPTO_KEY" }, { status: 500 });
    }

    const result = await prisma.account.createMany({
      data,
      skipDuplicates: true, // ※ 아래 #2 참고(유니크 인덱스 권장)
    });

    return NextResponse.json({ ok: true, count: result.count });
  } catch (e: any) {
    console.error("[inventory upload] error:", e);
    return NextResponse.json({ error: e?.message || "UPLOAD_ERROR" }, { status: 500 });
  }
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
