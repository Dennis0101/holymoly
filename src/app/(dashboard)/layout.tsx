import Sidebar from "../../components/Sidebar";
import { auth } from "../../lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) {
    return (
      <div className="container py-10">
        <div className="card">
          로그인 필요합니다. <a className="text-indigo-600 underline" href="/login">로그인</a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
