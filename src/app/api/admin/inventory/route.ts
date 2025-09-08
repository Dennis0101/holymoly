import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";
import { encrypt } from "@/lib/crypto";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    requireAdmin(session);

    const { productId, lines } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: "NO_PRODUCT_ID" }, { status: 400 });
    }
    if (!lines || typeof lines !== "string") {
      return NextResponse.json({ error: "EMPTY" }, { status: 400 });
    }

    // 제품 존재 확인
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ error: "NO_PRODUCT" }, { status: 404 });
    }

    // 라인 파싱: "username:password" | "username,password" | "username|password"
    const rows = lines
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);

    const parsed = rows
      .map((row) => {
        const [user, pass] = row.split(/[:|,]/);
        if (!user || !pass) return null;
        return { username: user.trim(), password: pass.trim() };
      })
      .filter(Boolean) as { username: string; password: string }[];

    if (parsed.length === 0) {
      return NextResponse.json({ error: "INVALID_FORMAT" }, { status: 400 });
    }

    // 암호화 키 점검 (lib/crypto가 키 없으면 throw 하도록 되어 있다면 try/catch)
    let data: { productId: string; username: string; passwordEnc: string }[] = [];
    try {
      data = parsed.map(({ username, password }) => ({
        productId,
        username,
        passwordEnc: encrypt(password), // 🔐
      }));
    } catch {
      return NextResponse.json({ error: "NO_CRYPTO_KEY" }, { status: 500 });
    }

    // 대량 생성 (중복은 skip)
    const result = await prisma.account.createMany({
      data,
      skipDuplicates: true, // (productId, username) 유니크 인덱스가 있으면 효과적
    });

    return NextResponse.json({ ok: true, count: result.count });
  } catch (e: any) {
    console.error("[inventory upload] error:", e);
    return NextResponse.json(
      { error: e?.message || "UPLOAD_ERROR" },
      { status: 500 }
    );
  }
}
