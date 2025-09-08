// src/app/login/page.tsx
import AuthShell from "../(auth)/AuthShell";
import LoginForm from "./LoginForm";

export const metadata = { title: "로그인 - Account Shop" };

export default function Page() {
  return (
    <AuthShell title="계정 로그인">
      <LoginForm />
    </AuthShell>
  );
}
