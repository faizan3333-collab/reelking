"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCredits } from "@/hooks/useCredits";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { credits, isPro, proExpiresAt } = useCredits(user?.uid ?? null);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col h-full overflow-auto" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Topbar */}
      <div className="px-6 py-4 border-b border-white/5">
        <h1 className="text-base font-bold text-white">Settings ⚙️</h1>
        <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
          Account aur subscription manage karo
        </p>
      </div>

      <div className="p-6 flex flex-col gap-4 max-w-xl">

        {/* Account Info */}
        <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>Account</p>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold" style={{ background: "linear-gradient(135deg,#7C3AED,#4F46E5)" }}>
              {user?.email?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{user?.email}</p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                {user?.providerData?.[0]?.providerId === "google.com" ? "Google se login" : "Email se login"}
              </p>
            </div>
          </div>

          <div className="h-px mb-4" style={{ background: "rgba(255,255,255,0.06)" }}></div>

          <div className="flex items-center justify-between">
            <span className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>Login method</span>
            <span className="text-xs px-2 py-1 rounded-lg" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)" }}>
              {user?.providerData?.[0]?.providerId === "google.com" ? "🔵 Google" : "📧 Email"}
            </span>
          </div>
        </div>

        {/* Subscription */}
        <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>Subscription</p>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">{isPro ? "👑" : "🆓"}</span>
              <div>
                <p className="text-sm font-semibold text-white">{isPro ? "Pro Plan" : "Free Plan"}</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {isPro
                    ? `Expires: ${proExpiresAt ? new Date(proExpiresAt).toLocaleDateString("hi-IN") : "Active"}`
                    : `${credits ?? 0} credits baaki`}
                </p>
              </div>
            </div>
            <span className="text-xs px-2 py-1 rounded-lg font-semibold"
              style={{
                background: isPro ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.05)",
                color: isPro ? "#9F7AEA" : "rgba(255,255,255,0.4)",
                border: isPro ? "1px solid rgba(124,58,237,0.3)" : "1px solid rgba(255,255,255,0.08)"
              }}>
              {isPro ? "Active" : "Free"}
            </span>
          </div>

          {!isPro && (
            <a href="/credits"
              className="flex items-center justify-center w-full py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg,#7C3AED,#4F46E5)" }}
            >
              👑 Pro Lo — ₹99/month
            </a>
          )}
        </div>

        {/* Danger Zone */}
        <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>Account Actions</p>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 hover:opacity-80"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}
          >
            {loggingOut ? "Logout ho raha hai..." : "🚪 Logout Karo"}
          </button>

          <p className="text-xs mt-3 text-center" style={{ color: "rgba(255,255,255,0.2)" }}>
            Account delete — Phase 2 mein aayega
          </p>
        </div>

        {/* App Info */}
        <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md flex items-center justify-center text-sm" style={{ background: "linear-gradient(135deg,#7C3AED,#4F46E5)" }}>👑</div>
              <span className="text-sm font-bold text-white">ReelKing</span>
            </div>
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>v1.0.0</span>
          </div>
          <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.2)" }}>
            Indian creators ka viral content OS · Made with ❤️ in Bisauli, UP
          </p>
        </div>

      </div>
    </div>
  );
}