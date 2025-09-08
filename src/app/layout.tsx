import "@/styles/globals.css"; // 또는 app/globals.css면 "./globals.css"
import Providers from "./providers";

export const metadata = { title: "Account Shop" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
