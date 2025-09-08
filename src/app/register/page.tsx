// src/app/register/page.tsx
import AuthShell from "../(auth)/AuthShell";
import RegisterForm from "./RegisterForm";

export const metadata = { title: "회원가입 - Account Shop" };

export default function Page() {
  return (
    <AuthShell title="회원가입">
      <RegisterForm />
    </AuthShell>
  );
}
