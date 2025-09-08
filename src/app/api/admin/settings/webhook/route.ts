import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

function forbidIfNotAdmin(session: any) {
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }
}

export async function GET() {
  const session = await auth();
  const fb = forbidIfNotAdmin(session);
  if (fb) return fb;

  try {
    // 컬럼이 있을 때
    const s = await prisma.setting.findUnique({ where: { id: 1 } });
    return NextResponse.json({
      discordWebhookUrl: s?.discordWebhookUrl ?? "",
      discordImageUrl: (s as any)?.discordImageUrl ?? "",  // 없으면 빈문자열
    });
  } catch {
    // 컬럼이 아직 없을 때(임시 대응)
    const s = await prisma.setting.findUnique({ where: { id: 1 } });
    return NextResponse.json({
      discordWebhookUrl: s?.discordWebhookUrl ?? "",
      discordImageUrl: "",
    });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const fb = forbidIfNotAdmin(session);
  if (fb) return fb;

  const { discordWebhookUrl, discordImageUrl } = await req.json();

  try {
    // 컬럼이 있을 때 정상 업데이트
    await prisma.setting.upsert({
      where: { id: 1 },
      update: { discordWebhookUrl, discordImageUrl },
      create: { id: 1, discordWebhookUrl, discordImageUrl },
    });
  } catch {
    // 컬럼이 없으면 이미지 필드를 제외하고라도 저장
    await prisma.setting.upsert({
      where: { id: 1 },
      update: { discordWebhookUrl },
      create: { id: 1, discordWebhookUrl },
    });
  }

  return NextResponse.json({ ok: true });
}
