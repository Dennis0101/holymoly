import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return <div className="p-6">어드민 권한이 없습니다.</div>;
  }

  return <div className="p-6">{children}</div>;
}
