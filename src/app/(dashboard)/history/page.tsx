"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCredits } from "@/hooks/useCredits";
import { db } from "@/lib/firebase/client";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";

interface Generation {
  id: string;
  idea: string;
  platforms: string[];
  output: any;
  createdAt: any;
}

const platformMeta: Record<string, { icon: string; label: string }> = {
  youtube:   { icon: "▶",  label: "YouTube Shorts" },
  instagram: { icon: "📸", label: "Instagram Reels" },
  facebook:  { icon: "👥", label: "Facebook Reels" },
  whatsapp:  { icon: "💬", label: "WhatsApp" },
};

export default function HistoryPage() {
  const { user } = useAuth();
  const { isPro } = useCredits(user?.uid ?? null);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid || !isPro) { setLoading(false); return; }

    const fetchHistory = async () => {
      try {
        const q = query(
          collection(db, "generations"),
          where("uid", "==", user.uid),
          orderBy("createdAt", "desc"),
          limit(20)
        );
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Generation));
        setGenerations(data);
      } catch (err) {
        console.error("History fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user?.uid, isPro]);

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatDate = (ts: any) => {
    if (!ts) return "";
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString("hi-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  // Pro wall
  if (!loading && !isPro) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-6 py-4 border-b border-white/5">
          <h1 className="text-base font-bold text-white">History 📜</h1>
          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>Pichle generations dekho</p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <div className="text-5xl mb-4">👑</div>
          <h2 className="text-lg font-bold text-white mb-2">Pro Feature Hai Ye</h2>
          <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>
            History dekhne ke liye Pro plan lo — sirf ₹99/month
          </p>
          <a href="/credits"
            className="px-6 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg,#7C3AED,#4F46E5)" }}
          >
            Pro Lo — ₹99/month
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-auto" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Topbar */}
      <div className="px-6 py-4 border-b border-white/5">
        <h1 className="text-base font-bold text-white">History 📜</h1>
        <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
          Pichle 20 generations
        </p>
      </div>

      <div className="p-6 flex flex-col gap-3 max-w-2xl">
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-2xl animate-pulse">⏳</div>
          </div>
        )}

        {!loading && generations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-4xl mb-3 opacity-30">📜</div>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
              Abhi koi generation nahi — pehle kuch banao!
            </p>
            <a href="/generate" className="mt-4 text-sm font-semibold" style={{ color: "#9F7AEA" }}>
              Generate karo →
            </a>
          </div>
        )}

        {generations.map(gen => (
          <div key={gen.id} className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            {/* Card Header */}
            <div
              className="p-4 cursor-pointer hover:bg-white/5 transition-colors flex items-start justify-between gap-3"
              onClick={() => setExpanded(expanded === gen.id ? null : gen.id)}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{gen.idea}</p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  {gen.platforms.map(p => (
                    <span key={p} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(124,58,237,0.15)", color: "#9F7AEA" }}>
                      {platformMeta[p]?.icon} {platformMeta[p]?.label}
                    </span>
                  ))}
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
                    {formatDate(gen.createdAt)}
                  </span>
                </div>
              </div>
              <span className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                {expanded === gen.id ? "▲" : "▼"}
              </span>
            </div>

            {/* Expanded Output */}
            {expanded === gen.id && (
              <div className="px-4 pb-4 flex flex-col gap-3 border-t border-white/5 pt-3">
                {gen.platforms.map(platformId => {
                  const data = gen.output?.[platformId];
                  if (!data) return null;
                  return (
                    <div key={platformId} className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm">{platformMeta[platformId]?.icon}</span>
                        <span className="text-xs font-semibold text-white">{platformMeta[platformId]?.label}</span>
                      </div>
                      {Object.entries(data).map(([key, val]) => {
                        const text = Array.isArray(val) ? (val as string[]).join(" ") : val as string;
                        const copyKey = `${gen.id}-${platformId}-${key}`;
                        return (
                          <div key={key} className="rounded-lg p-2.5 mb-1.5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#9F7AEA" }}>{key}</p>
                              <button onClick={() => copyText(text, copyKey)}
                                className="text-xs"
                                style={{ color: copied === copyKey ? "#9F7AEA" : "rgba(255,255,255,0.2)", background: "none", border: "none", cursor: "pointer" }}
                              >
                                {copied === copyKey ? "✓" : "Copy"}
                              </button>
                            </div>
                            <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>{text}</p>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}