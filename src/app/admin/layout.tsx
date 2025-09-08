// src/app/admin/layout.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect("/login?callbackUrl=/admin");
  }
  return <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>;
}
