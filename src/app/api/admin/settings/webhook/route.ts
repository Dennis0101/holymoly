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

  const s = await prisma.setting.findUnique({ where: { id: 1 } });
  return NextResponse.json({
    discordWebhookUrl: s?.discordWebhookUrl ?? "",
    discordImageUrl: s?.discordImageUrl ?? "",
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const fb = forbidIfNotAdmin(session);
  if (fb) return fb;

  const { discordWebhookUrl, discordImageUrl } = await req.json();

  await prisma.setting.upsert({
    where: { id: 1 },
    update: { discordWebhookUrl, discordImageUrl },
    create: { id: 1, discordWebhookUrl, discordImageUrl },
  });

  return NextResponse.json({ ok: true });
}
