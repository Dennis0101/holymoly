import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../lib/auth";         // ✅ 경로 주의 (settings/webhook/)
import prisma from "../../../../../lib/prisma";
import { requireAdmin } from "../../../../../lib/permissions";

export async function GET() {
  const setting = await prisma.setting.findUnique({ where: { id: 1 } });
  return NextResponse.json({ url: setting?.discordWebhookUrl ?? "" });
}

export async function POST(req: NextRequest) {
  const session = await auth();                        // ✅
  requireAdmin(session);
  // ...
}
