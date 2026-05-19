"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0D0B14" }}>
      <div className="text-white opacity-50">Load ho raha hai...</div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="flex min-h-screen" style={{ background: "#0D0B14", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Sidebar */}
      <aside className="w-[220px] flex-shrink-0 flex flex-col p-5 border-r border-white/5" style={{ background: "#0F0D1A" }}>
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm" style={{ background: "linear-gradient(135deg,#7C3AED,#4F46E5)" }}>👑</div>
          <span className="text-white font-bold text-sm tracking-tight">ReelKing</span>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 flex-1">
          {[
            { href: "/generate", icon: "✨", label: "Generate" },
            { href: "/history", icon: "📜", label: "History" },
            { href: "/credits", icon: "💰", label: "Credits" },
            { href: "/settings", icon: "⚙️", label: "Settings" },
          ].map(({ href, icon, label }) => {
            const isActive = pathname === href;
            return (
              <a key={href} href={href}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
                style={{
                  color: isActive ? "#9F7AEA" : "rgba(255,255,255,0.4)",
                  background: isActive ? "rgba(124,58,237,0.12)" : "transparent",
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                <span className="w-5 text-center">{icon}</span>
                {label}
              </a>
            );
          })}
        </nav>

        {/* Bottom */}
        <div>
          <div className="rounded-xl p-3 mb-3" style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}>
            <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>Credits</p>
            <p className="text-lg font-bold" style={{ color: "#9F7AEA" }}>3 free</p>
            <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>lifetime gens baaki</p>
          </div>
          <a href="/credits">
            <button className="w-full py-2 rounded-lg text-white text-xs font-semibold" style={{ background: "linear-gradient(135deg,#7C3AED,#4F46E5)" }}>
              ⚡ Pro lo — ₹99/month
            </button>
          </a>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}