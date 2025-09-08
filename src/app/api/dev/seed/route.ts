import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { hash } from "bcrypt";

const KEY = process.env.SEED_KEY;

async function runSeed() {
  const email = "admin@example.com";
  const password = "admin1234"; // 로그인 후 반드시 비번 변경!
  const pwd = await hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: { role: "ADMIN", password: pwd, name: "Admin" },
    create: { email, role: "ADMIN", password: pwd, name: "Admin" },
  });

  return { id: user.id, email, password };
}

// GET/POST 둘 다 허용 (폰에서 주소창으로 호출하기 쉽도록)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const k = searchParams.get("key");
  if (!KEY || k !== KEY) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }
  const user = await runSeed();
  return NextResponse.json({ ok: true, user });
}

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const k = searchParams.get("key");
  if (!KEY || k !== KEY) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }
  const user = await runSeed();
  return NextResponse.json({ ok: true, user });
}
