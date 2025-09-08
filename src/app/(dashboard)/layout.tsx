import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { auth } from "../../lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div>
      <Header />
      <div className="mx-auto max-w-6xl px-4 py-6 md:flex gap-6">
        <Sidebar />
        <main className="flex-1 space-y-6">
          {!session && (
            <div className="panel neon-border">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl">로그인이 필요합니다</h2>
                  <p className="text-white/60 mt-1">구매내역, 충전 등은 로그인 후 이용 가능해요.</p>
                </div>
                <a href="/login" className="btn-primary">로그인</a>
              </div>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
