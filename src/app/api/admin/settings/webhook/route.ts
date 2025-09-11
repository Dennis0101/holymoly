import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

async function ensureColumn() {
  // DB에 컬럼이 없으면 생성 (여러 번 호출해도 안전)
  await prisma.$executeRawUnsafe(
    `ALTER TABLE "Setting" ADD COLUMN IF NOT EXISTS "discordImageUrl" TEXT`
  );
}

export async function GET() {
  try {
    await ensureColumn(); // ✅ 먼저 보장
    const s = await prisma.setting.findUnique({ where: { id: 1 } });
    return NextResponse.json({
      discordWebhookUrl: s?.discordWebhookUrl ?? "",
      discordImageUrl: s?.discordImageUrl ?? ""
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  try {
    await ensureColumn(); // ✅ 먼저 보장
    const { discordWebhookUrl, discordImageUrl } = await req.json();

    const item = await prisma.setting.upsert({
      where: { id: 1 },
      update: {
        discordWebhookUrl: discordWebhookUrl ?? null,
        discordImageUrl: discordImageUrl ?? null,
      },
      create: {
        id: 1,
        discordWebhookUrl: discordWebhookUrl ?? null,
        discordImageUrl: discordImageUrl ?? null,
      },
    });

    return NextResponse.json({ ok: true, item });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
