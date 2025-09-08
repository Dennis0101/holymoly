import "./globals.css";
import { Inter, Space_Grotesk } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });

export const metadata = {
  title: "Account Shop",
  description: "계정 판매 사이트",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="dark">
      <body className={`${inter.variable} ${space.variable} font-sans bg-base-900 text-white`}>
        {/* 배경 그리드 + 은은한 그라디언트 */}
        <div className="fixed inset-0 -z-10 bg-grid bg-grid"></div>
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(60%_60%_at_30%_-10%,rgba(74,162,255,0.25),transparent),radial-gradient(40%_40%_at_100%_0%,rgba(147,51,234,0.2),transparent)]"></div>
        {children}
      </body>
    </html>
  );
}
