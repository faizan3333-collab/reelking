"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCredits } from "@/hooks/useCredits";
import { db } from "@/lib/firebase/client";
import { doc, onSnapshot } from "firebase/firestore";

export default function CreditsPage() {
  const { user, getToken } = useAuth();
  const { credits, isPro, proExpiresAt } = useCredits(user?.uid ?? null);
  const [adLoading, setAdLoading] = useState(false);
  const [adDone, setAdDone] = useState(false);
  const [message, setMessage] = useState("");

  const handleAdWatch = async () => {
    setAdLoading(true);
    setMessage("");
    // Simulate ad watch (AdSense integration Phase 2)
    await new Promise(r => setTimeout(r, 3000));
    try {
      const token = await getToken();
      const res = await fetch("/api/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ type: "ad" }),
      });
      const data = await res.json();
      if (res.ok) {
        setAdDone(true);
        setMessage("3 credits mil gaye! ✅");
      } else {
        setMessage(data.error || "Kuch galat ho gaya");
      }
    } catch {
      setMessage("Error aaya — dobara try karo");
    } finally {
      setAdLoading(false);
    }
  };

  const handlePurchase = async (plan: "small" | "large" | "pro") => {
    setMessage("");
    try {
      const token = await getToken();
      const res = await fetch("/api/cashfree/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.payment_link) {
        window.location.href = data.payment_link;
      } else {
        setMessage("Payment start nahi ho saki — dobara try karo");
      }
    } catch {
      setMessage("Error aaya — dobara try karo");
    }
  };

  return (
    <div className="flex flex-col h-full overflow-auto" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Topbar */}
      <div className="px-6 py-4 border-b border-white/5">
        <h1 className="text-base font-bold text-white">Credits & Plans 💰</h1>
        <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
          Ad dekho ya plan lo — unlimited content banao
        </p>
      </div>

      <div className="p-6 flex flex-col gap-5 max-w-2xl">

        {/* Current Status */}
        <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>Abhi ka Status</p>
          <div className="flex items-center gap-4">
            <div className="flex-1 rounded-xl p-4 text-center" style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}>
              <div className="text-2xl font-bold" style={{ color: "#9F7AEA" }}>
                {isPro ? "∞" : credits ?? 0}
              </div>
              <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                {isPro ? "Unlimited" : "Credits baaki"}
              </div>
            </div>
            <div className="flex-1 rounded-xl p-4 text-center" style={{ background: isPro ? "rgba(124,58,237,0.1)" : "rgba(255,255,255,0.03)", border: isPro ? "1px solid rgba(124,58,237,0.2)" : "1px solid rgba(255,255,255,0.07)" }}>
              <div className="text-2xl font-bold" style={{ color: isPro ? "#9F7AEA" : "rgba(255,255,255,0.4)" }}>
                {isPro ? "👑" : "🆓"}
              </div>
              <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                {isPro ? `Pro — ${proExpiresAt ? new Date(proExpiresAt).toLocaleDateString("hi-IN") : "Active"}` : "Free Plan"}
              </div>
            </div>
          </div>
        </div>

        {/* Ad Section */}
        {!isPro && (
          <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>Free Credits</p>
            <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.6)" }}>
              Ek short ad dekho → <span style={{ color: "#9F7AEA", fontWeight: 600 }}>3 credits free</span> pao
            </p>

            <button
              onClick={handleAdWatch}
              disabled={adLoading || adDone}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
              style={{
                background: adDone ? "rgba(34,197,94,0.15)" : "rgba(124,58,237,0.15)",
                border: adDone ? "1px solid rgba(34,197,94,0.3)" : "1px solid rgba(124,58,237,0.3)",
                color: adDone ? "#4ade80" : "#9F7AEA",
              }}
            >
              {adLoading ? "⏳ Ad chal raha hai..." : adDone ? "✅ Credits mil gaye!" : "▶ Ad Dekho → 3 Credits Pao"}
            </button>

            {message && (
              <p className="text-xs mt-2 text-center" style={{ color: message.includes("✅") ? "#4ade80" : "#f87171" }}>
                {message}
              </p>
            )}
          </div>
        )}

        {/* Purchase Plans */}
        <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>Plans</p>

          <div className="flex flex-col gap-3">
            {/* Pro */}
            <div className="rounded-xl p-4 relative" style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.35)" }}>
              <div className="absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "linear-gradient(135deg,#7C3AED,#4F46E5)", color: "white" }}>
                BEST
              </div>
              <div className="flex items-start gap-3 mb-3">
                <div className="text-2xl">👑</div>
                <div>
                  <div className="text-sm font-bold text-white">Pro Plan</div>
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Unlimited gens + no ads + history</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-lg font-bold" style={{ color: "#9F7AEA" }}>₹99</div>
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>/month</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {["Unlimited generations", "No ads", "History access", "Priority support"].map(f => (
                  <span key={f} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(124,58,237,0.2)", color: "#9F7AEA" }}>✓ {f}</span>
                ))}
              </div>
              <button
                onClick={() => handlePurchase("pro")}
                disabled={isPro}
                className="w-full py-2.5 rounded-xl text-white font-semibold text-sm disabled:opacity-40 hover:opacity-90 transition-opacity"
                style={{ background: "linear-gradient(135deg,#7C3AED,#4F46E5)" }}
              >
                {isPro ? "Already Pro Ho ✅" : "Pro Lo — ₹99/month"}
              </button>
            </div>

            {/* Credit Packs */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { plan: "small" as const, credits: 200, price: "₹49", label: "Starter Pack" },
                { plan: "large" as const, credits: 500, price: "₹149", label: "Creator Pack" },
              ].map(({ plan, credits, price, label }) => (
                <div key={plan} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="text-sm font-bold text-white mb-0.5">{label}</div>
                  <div className="text-xs mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>{credits} credits · kabhi expire nahi</div>
                  <div className="text-lg font-bold mb-3" style={{ color: "#9F7AEA" }}>{price}</div>
                  <button
                    onClick={() => handlePurchase(plan)}
                    className="w-full py-2 rounded-lg text-sm font-semibold hover:opacity-80 transition-opacity"
                    style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", color: "#9F7AEA" }}
                  >
                    Kharido
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            💡 Credit packs kabhi expire nahi hote · UPI, PhonePe, GPay sab accept · Auto-renewal nahi — manual ping milega
          </p>
        </div>

      </div>
    </div>
  );
}