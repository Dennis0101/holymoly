// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hash } from "bcrypt";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).max(30).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.parse(body);

    const exists = await prisma.user.findUnique({ where: { email: parsed.email } });
    if (exists) return NextResponse.json({ error: "EMAIL_IN_USE" }, { status: 400 });

    const pwHash = await hash(parsed.password, 10);
    await prisma.user.create({
      data: { email: parsed.email, password: pwHash, name: parsed.name ?? null },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
  }
}
