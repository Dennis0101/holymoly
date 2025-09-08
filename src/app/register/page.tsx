import AuthShell from "../(auth)/AuthShell";
import RegisterForm from "./register-form"; // ← 파일명과 일치!

export const metadata = { title: "회원가입 - Account Shop" };

export default function Page() {
  return (
    <AuthShell title="회원가입">
      <RegisterForm />
    </AuthShell>
  );
}
