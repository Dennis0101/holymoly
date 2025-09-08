import { Suspense } from "react";
import LoginClient from "./LoginClient";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-6">로그인 로딩 중…</div>}>
      <LoginClient />
    </Suspense>
  );
}
