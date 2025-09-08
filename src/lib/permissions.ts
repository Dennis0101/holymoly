import type { Session } from "next-auth";

export function requireAdmin(session?: Session | null) {
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    const err = new Error("ADMIN_ONLY");
    (err as any).status = 403;
    throw err;
  }
}
