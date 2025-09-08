import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";
import prisma from "../../../../../lib/prisma";
import { requireAdmin } from "../../../../../lib/permissions";

// GET 현재 설정 읽기
export async function GET() {
  const setting = await prisma.setting.findUnique({ where: { id: 1 } });
  return NextResponse.json({ url: setting?.discordWebhookUrl ?? "" });
}

// POST { url }
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  requireAdmin(session);

  const { url } = await req.json();
  await prisma.setting.upsert({
    where: { id: 1 },
    create: { id: 1, discordWebhookUrl: url || null },
    update: { discordWebhookUrl: url || null },
  });
  return NextResponse.json({ ok: true });
}
