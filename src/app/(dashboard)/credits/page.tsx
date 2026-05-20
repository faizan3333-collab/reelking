"use client";

import { useState } from "react";
import { useCredits } from "@/hooks/useCredits";
import { useAuth } from "@/hooks/useAuth";
import { showRewardedAd, AD_CONFIG } from "@/features/ads";
import { initiateCashfreePayment, PLAN_DETAILS, PlanType } from "@/lib/cashfree";

export default function CreditsPage() {
  const { user } = useAuth();
  const { credits, isPro, lifetimeUsed, proExpiresAt } = useCredits();
  const [adLoading, setAdLoading] = useState(false);
  const [payLoading, setPayLoading] = useState<PlanType | null>(null);
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const freeRemaining = Math.max(0, 3 - (lifetimeUsed || 0));

  function showMsg(text: string, type: "success" | "error") {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 4000);
  }

  async function handleWatchAd() {
    if (adLoading) return;
    setAdLoading(true);
    showMsg("Ad dekh raha hai... 3 seconds wait karo", "success");

    const result = await showRewardedAd();
    if (!result.success) {
      showMsg("Ad complete nahi hua. Dobara try karo.", "error");
      setAdLoading(false);
      return;
    }

    // Call credits API
    const token = await user!.getIdToken();
    const res = await fetch("/api/credits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ type: "ad" }),
    });

    const data = await res.json();
    if (data.success) {
      showMsg(data.message || "+3 credits mile! 🎉", "success");
    } else {
      showMsg(data.error || "Error aa gaya", "error");
    }
    setAdLoading(false);
  }

  async function handleBuyPlan(plan: PlanType) {
    if (payLoading) return;
    setPayLoading(plan);

    const token = await user!.getIdToken();
    const result = await initiateCashfreePayment(token, plan);

    if (result.success && result.payment_link) {
      window.location.href = result.payment_link;
    } else {
      showMsg(result.error || "Payment failed. Try again.", "error");
      setPayLoading(null);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
        💎 Credits & Plans
      </h1>
      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 14, marginBottom: 24 }}>
        Zyada create karo, zyada grow karo
      </p>

      {/* Toast */}
      {msg && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: 10,
            background:
              msg.type === "success"
                ? "rgba(34,197,94,0.15)"
                : "rgba(239,68,68,0.15)",
            border: `1px solid ${msg.type === "success" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
            color: msg.type === "success" ? "#4ade80" : "#f87171",
            fontSize: 14,
            marginBottom: 20,
          }}
        >
          {msg.text}
        </div>
      )}

      {/* Current status */}
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 14,
          padding: "20px",
          marginBottom: 20,
        }}
      >
        {isPro ? (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 24 }}>⚡</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#9F7AEA" }}>
                Pro Active
              </span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
              Unlimited generations • No ads • Full history
            </p>
            {proExpiresAt && (
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginTop: 4 }}>
                Expires:{" "}
                {new Date(proExpiresAt.toDate?.() || proExpiresAt).toLocaleDateString("en-IN")}
              </p>
            )}
          </div>
        ) : (
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            <div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#9F7AEA" }}>{credits}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
                Purchased credits
              </div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>
                {freeRemaining}/3
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>Free gens left</div>
            </div>
          </div>
        )}
      </div>

      {/* Watch Ad section */}
      {!isPro && (
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 14,
            padding: "20px",
            marginBottom: 20,
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 6 }}>
            🎬 Free Credits — Ad Dekho
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>
            1 ad = +{AD_CONFIG.creditsPerAd} credits • Max {AD_CONFIG.maxAdsPerDay} ads/day
          </p>
          <button
            onClick={handleWatchAd}
            disabled={adLoading}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 10,
              border: "none",
              background: adLoading
                ? "rgba(124,58,237,0.3)"
                : "linear-gradient(135deg,#7C3AED,#4F46E5)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              cursor: adLoading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "opacity 0.2s",
              minHeight: 48,
            }}
          >
            {adLoading ? (
              <>
                <span
                  style={{
                    width: 16,
                    height: 16,
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    animation: "spin 0.7s linear infinite",
                    display: "inline-block",
                  }}
                />
                Ad chal raha hai...
              </>
            ) : (
              "▶️ Ad Dekho → +3 Credits"
            )}
          </button>
        </div>
      )}

      {/* Purchase plans */}
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 14,
          padding: "20px",
          marginBottom: 20,
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 16 }}>
          💳 Credits Kharido
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {(["small", "large"] as PlanType[]).map((plan) => {
            const p = PLAN_DETAILS[plan];
            return (
              <button
                key={plan}
                onClick={() => handleBuyPlan(plan)}
                disabled={!!payLoading}
                style={{
                  padding: "14px 16px",
                  borderRadius: 10,
                  border: "1px solid rgba(124,58,237,0.3)",
                  background:
                    payLoading === plan
                      ? "rgba(124,58,237,0.2)"
                      : "rgba(124,58,237,0.08)",
                  color: "#fff",
                  cursor: payLoading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  minHeight: 48,
                }}
              >
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{p.label}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                    {p.description}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#9F7AEA",
                    minWidth: 50,
                    textAlign: "right",
                  }}
                >
                  ₹{p.amount}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pro plan */}
      {!isPro && (
        <div
          style={{
            background: "linear-gradient(135deg,rgba(124,58,237,0.15),rgba(79,70,229,0.1))",
            border: "1px solid rgba(124,58,237,0.4)",
            borderRadius: 14,
            padding: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>
                ⚡ ReelKing Pro
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                Unlimited • No ads • Full history
              </div>
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#9F7AEA" }}>
              ₹99<span style={{ fontSize: 12, fontWeight: 400 }}>/mo</span>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            {[
              "Unlimited generations",
              "No ads kabhi nahi",
              "Full generation history",
              "Priority AI speed",
            ].map((f) => (
              <div
                key={f}
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.6)",
                  display: "flex",
                  gap: 6,
                  marginBottom: 4,
                }}
              >
                <span style={{ color: "#9F7AEA" }}>✓</span> {f}
              </div>
            ))}
          </div>

          <button
            onClick={() => handleBuyPlan("pro")}
            disabled={!!payLoading}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 10,
              border: "none",
              background:
                payLoading === "pro"
                  ? "rgba(124,58,237,0.4)"
                  : "linear-gradient(135deg,#7C3AED,#4F46E5)",
              color: "#fff",
              fontSize: 15,
              fontWeight: 700,
              cursor: payLoading ? "not-allowed" : "pointer",
              minHeight: 48,
            }}
          >
            {payLoading === "pro" ? "Redirecting..." : "Pro Lo — ₹99/month"}
          </button>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", textAlign: "center", marginTop: 8 }}>
            UPI • No auto-debit • Cancel anytime
          </p>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}