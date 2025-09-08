import { Suspense } from "react";
import LoginClient from "./LoginClient";
export default function LoginPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <div className="panel neon-border">
        <h1 className="font-display text-xl mb-4">계정 로그인</h1>
        <Suspense fallback={<div>로딩…</div>}>
          <LoginClient />
        </Suspense>
      </div>
    </div>
  );
}
