// 상단 import 바꾸기
// 잘못된 값: '../../../components/Sidebar', '../../../lib/auth'
import Sidebar from "../../components/Sidebar";  // ✅ src/app/(dashboard) → src/components
import { auth } from "../../lib/auth";          // ✅ src/app/(dashboard) → src/lib

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();           // ✅ getServerSession → auth()
  if (!session) {
    return <div className="p-6">로그인이 필요합니다. <a href="/login">로그인</a></div>;
  }
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
