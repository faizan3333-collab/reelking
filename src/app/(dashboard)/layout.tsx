"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCredits } from "@/hooks/useCredits";

const NAV = [
  { href: "/generate", label: "Generate", icon: "⚡" },
  { href: "/credits", label: "Credits", icon: "💎" },
  { href: "/history", label: "History", icon: "📜" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const { credits, isPro, lifetimeUsed } = useCredits(user?.uid ?? null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (loading || !user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0D0B14",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="spinner" />
        <style>{`
          .spinner {
            width: 32px; height: 32px;
            border: 2px solid rgba(124,58,237,0.3);
            border-top-color: #7C3AED;
            border-radius: 50%;
            animation: spin 0.7s linear infinite;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  const freeRemaining = Math.max(0, 3 - (lifetimeUsed || 0));

  return (
    <div style={{ minHeight: "100vh", background: "#0D0B14", display: "flex" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 40,
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: 220,
          background: "#0F0D1A",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          flexDirection: "column",
          padding: "20px 12px",
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          zIndex: 50,
          transform: sidebarOpen ? "translateX(0)" : undefined,
          transition: "transform 0.25s ease",
        }}
        className="sidebar-desktop"
      >
        {/* Logo */}
        <div style={{ padding: "0 8px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 32,
                height: 32,
                background: "linear-gradient(135deg,#7C3AED,#4F46E5)",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
              }}
            >
              👑
            </div>
            <span style={{ fontWeight: 700, fontSize: 16, color: "#fff" }}>ReelKing</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, marginTop: 16, display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: active ? 600 : 400,
                  color: active ? "#fff" : "rgba(255,255,255,0.5)",
                  background: active
                    ? "linear-gradient(135deg,rgba(124,58,237,0.2),rgba(79,70,229,0.15))"
                    : "transparent",
                  border: active ? "1px solid rgba(124,58,237,0.3)" : "1px solid transparent",
                  textDecoration: "none",
                  transition: "all 0.15s",
                }}
              >
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Credits badge */}
        <div
          style={{
            marginTop: "auto",
            padding: "12px",
            background: "rgba(255,255,255,0.03)",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {isPro ? (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 16 }}>⚡</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#9F7AEA" }}>Pro Active</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>Unlimited gens</div>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 4 }}>
                Credits
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#9F7AEA" }}>{credits}</div>
              {freeRemaining > 0 && (
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>
                  +{freeRemaining} free left
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="mobile-topbar">
        <button
          onClick={() => setSidebarOpen(true)}
          style={{
            background: "none",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            padding: 8,
            borderRadius: 8,
            fontSize: 20,
          }}
          aria-label="Open menu"
        >
          ☰
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 24,
              height: 24,
              background: "linear-gradient(135deg,#7C3AED,#4F46E5)",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
            }}
          >
            👑
          </div>
          <span style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>ReelKing</span>
        </div>
        <div style={{ fontSize: 13, color: "#9F7AEA", fontWeight: 600 }}>
          {isPro ? "⚡ Pro" : `💎 ${credits}`}
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="mobile-bottomnav">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                padding: "6px 0",
                flex: 1,
                textDecoration: "none",
                color: active ? "#9F7AEA" : "rgba(255,255,255,0.4)",
                fontSize: 10,
                fontWeight: active ? 600 : 400,
              }}
            >
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Main content */}
      <main className="main-content">{children}</main>

      <style>{`
        /* Desktop: sidebar always visible */
        .sidebar-desktop {
          transform: none !important;
        }
        .main-content {
          margin-left: 220px;
          flex: 1;
          padding: 24px;
          min-height: 100vh;
        }
        .mobile-topbar {
          display: none;
        }
        .mobile-bottomnav {
          display: none;
        }

        @media (max-width: 768px) {
          .sidebar-desktop {
            transform: ${sidebarOpen ? "translateX(0)" : "translateX(-100%)"} !important;
            width: 260px !important;
          }
          .main-content {
            margin-left: 0;
            padding: 16px;
            padding-top: 70px;
            padding-bottom: 80px;
          }
          .mobile-topbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 56px;
            background: #0F0D1A;
            border-bottom: 1px solid rgba(255,255,255,0.06);
            padding: 0 16px;
            z-index: 30;
          }
          .mobile-bottomnav {
            display: flex;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 64px;
            background: #0F0D1A;
            border-top: 1px solid rgba(255,255,255,0.06);
            z-index: 30;
            padding: 4px 8px;
          }
        }
      `}</style>
    </div>
  );
}