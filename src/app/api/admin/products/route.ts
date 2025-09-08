import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../lib/auth";            // ✅
import prisma from "../../../../lib/prisma";
import { requireAdmin } from "../../../../lib/permissions";

export async function GET(req: NextRequest) {
  const session = await auth();                        // ✅
  requireAdmin(session);
  // ...
}

export async function POST(req: NextRequest) {
  const session = await auth();                        // ✅
  requireAdmin(session);
  // ...
}

export async function DELETE(req: NextRequest) {
  const session = await auth();                        // ✅
  requireAdmin(session);
  // ...
}
