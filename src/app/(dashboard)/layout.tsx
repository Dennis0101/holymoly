import { getServerSession } from "next-auth";
import Sidebar from "../../components/Sidebar";
import { authOptions } from "../../lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <div className="p-6">
        로그인이 필요합니다. <a href="/login">로그인</a>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
