// 잘못된 값: '../../../lib/auth'
import { auth } from "../../lib/auth";          // ✅ src/app/admin → src/lib

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();           // ✅
  if (!session || (session.user as any).role !== "ADMIN") {
    return <div className="p-6">어드민 권한이 없습니다.</div>;
  }
  return <div className="p-6">{children}</div>;
}
