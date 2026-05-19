"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCredits } from "@/hooks/useCredits";
import { PLATFORMS } from "@/lib/constants";

export default function GeneratePage() {
  const { user, getToken } = useAuth();
  const { canGenerate, creditsLeft, isPro } = useCredits(user?.uid ?? null);
  const [idea, setIdea] = useState("");
  const [selected, setSelected] = useState<string[]>(["youtube", "instagram", "facebook"]);
  const [output, setOutput] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const togglePlatform = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    if (!idea.trim()) { setError("Pehle apna idea likho"); return; }
    if (selected.length === 0) { setError("Kam se kam ek platform select karo"); return; }
    if (!canGenerate) { setError("Credits khatam — ad dekho ya Pro lo"); return; }
    setLoading(true);
    setError("");
    setOutput(null);
    try {
      const token = await getToken();
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ idea, platforms: selected }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOutput(data.output);
    } catch (err: any) {
      if (err.message === "NO_CREDITS") setError("Credits khatam — ad dekho ya Pro lo");
      else setError("Kuch galat ho gaya — dobara try karo");
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const platformMeta: Record<string, { icon: string; color: string; label: string }> = {
    youtube:   { icon: "▶",  color: "rgba(255,0,0,0.15)",     label: "YouTube Shorts" },
    instagram: { icon: "📸", color: "rgba(214,40,120,0.15)",  label: "Instagram Reels" },
    facebook:  { icon: "👥", color: "rgba(24,119,242,0.15)",  label: "Facebook Reels" },
    whatsapp:  { icon: "💬", color: "rgba(37,211,102,0.15)",  label: "WhatsApp" },
  };

  const fieldLabels: Record<string, string> = {
    title: "Title", description: "Description", caption: "Caption",
    hashtags: "Hashtags", message: "Message",
  };

  return (
    <div className="flex flex-col h-full">
      {/* Topbar */}
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-white">Content Generate Karo ✨</h1>
          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
            Apna idea daalo — sab platforms ke liye ready
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-lg text-xs font-semibold"
          style={{ background: isPro ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.05)", color: isPro ? "#9F7AEA" : "rgba(255,255,255,0.4)", border: isPro ? "1px solid rgba(124,58,237,0.3)" : "1px solid rgba(255,255,255,0.08)" }}>
          {isPro ? "👑 Pro" : `${creditsLeft} credits`}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left - Input */}
        <div className="flex-1 p-6 flex flex-col gap-4 overflow-auto">
          {/* Platform selector */}
          <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>Platform select karo</p>
            <div className="grid grid-cols-2 gap-2">
              {PLATFORMS.map(({ id, label, emoji }) => (
                <button key={id} onClick={() => togglePlatform(id)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: selected.includes(id) ? "rgba(124,58,237,0.15)" : "rgba(255,255,255,0.04)",
                    border: selected.includes(id) ? "1px solid rgba(124,58,237,0.4)" : "1px solid rgba(255,255,255,0.08)",
                    color: selected.includes(id) ? "#9F7AEA" : "rgba(255,255,255,0.5)",
                  }}
                >
                  <span>{emoji}</span>
                  <span className="text-xs">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Idea input */}
          <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>Apna idea likho</p>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Jaise: mera pehla vlog, cooking tips, gym motivation, paisa kamane ke tarike..."
              rows={4}
              className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none resize-none"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            />
          </div>

          {error && <p className="text-red-400 text-xs px-1">{error}</p>}

          <button onClick={handleGenerate} disabled={loading}
            className="w-full py-3.5 rounded-xl text-white font-semibold text-sm disabled:opacity-50 transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg,#7C3AED,#4F46E5)" }}
          >
            {loading ? <><span className="animate-spin">⏳</span> Generate ho raha hai...</> : "✨ Generate Karo"}
          </button>
        </div>

        {/* Right - Output */}
        <div className="w-80 p-6 border-l border-white/5 overflow-auto flex flex-col gap-3" style={{ background: "#110F1A" }}>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.25)" }}>Output</p>

          {!output && !loading && (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
              <div className="text-4xl mb-3 opacity-30">✨</div>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>Idea likho aur Generate dabao</p>
            </div>
          )}

          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
              <div className="text-3xl mb-3 animate-pulse">🤖</div>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>AI likh raha hai...</p>
            </div>
          )}

          {output && selected.map(platformId => {
            const meta = platformMeta[platformId];
            const data = output[platformId];
            if (!data) return null;
            return (
              <div key={platformId} className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs" style={{ background: meta.color }}>{meta.icon}</div>
                  <span className="text-xs font-semibold text-white">{meta.label}</span>
                </div>

                {Object.entries(data).map(([key, val]) => {
                  const text = Array.isArray(val) ? (val as string[]).join(" ") : val as string;
                  const copyKey = `${platformId}-${key}`;
                  return (
                    <div key={key} className="rounded-lg p-2.5 mb-2 group relative" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#9F7AEA" }}>
                          {fieldLabels[key] || key}
                        </p>
                        <button onClick={() => copyText(text, copyKey)}
                          className="text-xs transition-colors"
                          style={{ color: copied === copyKey ? "#9F7AEA" : "rgba(255,255,255,0.2)", background: "none", border: "none", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                          {copied === copyKey ? "✓" : "Copy"}
                        </button>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>{text}</p>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}