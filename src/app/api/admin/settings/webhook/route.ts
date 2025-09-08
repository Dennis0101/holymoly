import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN")
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });

  const s = await prisma.setting.findUnique({ where: { id: 1 } });
  return NextResponse.json({ discordWebhookUrl: s?.discordWebhookUrl ?? null });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN")
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });

  const { discordWebhookUrl } = await req.json();
  const s = await prisma.setting.upsert({
    where: { id: 1 },
    update: { discordWebhookUrl },
    create: { id: 1, discordWebhookUrl },
  });
  return NextResponse.json({ ok: true, setting: s });
}
