import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET() {
  try {
    const t = await prisma.$queryRaw`SELECT 1 as ok`;
    return NextResponse.json({ ok: true, t });
  } catch (e:any) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
