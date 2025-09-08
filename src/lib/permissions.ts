import type { Session } from "next-auth";

export function requireAdmin(session: Session | null) {
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }
}
