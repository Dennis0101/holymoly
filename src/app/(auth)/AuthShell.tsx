// src/app/(auth)/AuthShell.tsx
import { ReactNode } from "react";

export default function AuthShell({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div className="relative min-h-[100svh] overflow-hidden bg-base-900">
      {/* 그리드 배경 */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.12]"
           style={{
             backgroundImage:
               "linear-gradient(to right, rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.15) 1px, transparent 1px)",
             backgroundSize: "44px 44px",
           }}
      />
      {/* 코너 그라디언트 */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-fuchsia-600/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-indigo-600/25 blur-3xl" />

      <div className="relative z-10 mx-auto flex max-w-md flex-col items-center px-5 py-14">
        <h1 className="font-display mb-6 text-3xl tracking-tight text-white/95">{title}</h1>
        <div className="w-full rounded-3xl border border-white/10 bg-base-800/60 p-5 shadow-[0_10px_40px_rgba(0,0,0,.35)] backdrop-blur">
          {children}
        </div>

        {/* 하단 링크 */}
        <p className="mt-6 text-center text-sm text-white/60">
          © {new Date().getFullYear()} Account Shop
        </p>
      </div>
    </div>
  );
}
