import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { hash } from "bcrypt";

const KEY = process.env.SEED_KEY; // Variables에 SEED_KEY도 임시로 넣어두세요

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const k = searchParams.get("key");
  if (!KEY || k !== KEY) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });

  const email = "admin@example.com";
  const password = "admin1234"; // 배포 후 바로 변경/삭제 권장

  const pwd = await hash(password, 10);
  const user = await prisma.user.upsert({
    where: { email },
    update: { role: "ADMIN", password: pwd, name: "Admin" },
    create: { email, role: "ADMIN", password: pwd, name: "Admin" }
  });

  return NextResponse.json({ ok: true, user: { id: user.id, email, password } });
}
