"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCredits } from "@/hooks/useCredits";
import { useRouter } from "next/navigation";

const PLATFORMS = [
  { id: "youtube", label: "YouTube Shorts", icon: "▶️" },
  { id: "instagram", label: "Instagram Reels", icon: "📸" },
  { id: "facebook", label: "Facebook Reels", icon: "👤" },
  { id: "whatsapp", label: "WhatsApp Status", icon: "💬" },
];

type OutputField = {
  label: string;
  value: string;
};

function OutputCard({
  platform,
  fields,
}: {
  platform: string;
  fields: OutputField[];
}) {
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(text: string, key: string) {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  const platformInfo = PLATFORMS.find((p) => p.id === platform);

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
      }}
    >
      <div
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: "#9F7AEA",
          marginBottom: 12,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span>{platformInfo?.icon}</span> {platformInfo?.label || platform}
      </div>

      {fields.map((field) => (
        <div key={field.label} style={{ marginBottom: 12 }}>
          <div
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.3)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: 4,
            }}
          >
            {field.label}
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 8,
              padding: "10px 12px",
              fontSize: 13,
              color: "rgba(255,255,255,0.8)",
              lineHeight: 1.5,
              wordBreak: "break-word",
              position: "relative",
            }}
          >
            <pre
              style={{
                margin: 0,
                fontFamily: "inherit",
                whiteSpace: "pre-wrap",
                fontSize: 13,
              }}
            >
              {field.value}
            </pre>
            <button
              onClick={() => copy(field.value, `${platform}-${field.label}`)}
              style={{
                position: "absolute",
                top: 6,
                right: 6,
                background: "rgba(124,58,237,0.2)",
                border: "1px solid rgba(124,58,237,0.3)",
                borderRadius: 6,
                padding: "3px 8px",
                color: copied === `${platform}-${field.label}` ? "#4ade80" : "#9F7AEA",
                fontSize: 11,
                cursor: "pointer",
              }}
            >
              {copied === `${platform}-${field.label}` ? "✓" : "Copy"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function parseOutput(output: Record<string, unknown>) {
  const result: Record<string, OutputField[]> = {};

  if (output.youtube) {
    const yt = output.youtube as Record<string, unknown>;
    result.youtube = [
      { label: "Title", value: String(yt.title || "") },
      { label: "Description", value: String(yt.description || "") },
      {
        label: "Hashtags",
        value: Array.isArray(yt.hashtags) ? yt.hashtags.join(" ") : String(yt.hashtags || ""),
      },
    ];
  }
  if (output.instagram) {
    const ig = output.instagram as Record<string, unknown>;
    result.instagram = [
      { label: "Caption", value: String(ig.caption || "") },
      {
        label: "Hashtags",
        value: Array.isArray(ig.hashtags) ? ig.hashtags.join(" ") : String(ig.hashtags || ""),
      },
    ];
  }
  if (output.facebook) {
    const fb = output.facebook as Record<string, unknown>;
    result.facebook = [
      { label: "Caption", value: String(fb.caption || "") },
      {
        label: "Hashtags",
        value: Array.isArray(fb.hashtags) ? fb.hashtags.join(" ") : String(fb.hashtags || ""),
      },
    ];
  }
  if (output.whatsapp) {
    const wa = output.whatsapp as Record<string, unknown>;
    result.whatsapp = [{ label: "Message", value: String(wa.message || "") }];
  }

  return result;
}

export default function GeneratePage() {
  const { user } = useAuth();
  const { credits, isPro, lifetimeUsed } = useCredits(user?.uid ?? null);
  const router = useRouter();

  const [idea, setIdea] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["youtube"]);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<Record<string, OutputField[]> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const freeRemaining = Math.max(0, 3 - (lifetimeUsed || 0));
  const canGenerate = isPro || credits > 0 || freeRemaining > 0;

  function togglePlatform(id: string) {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  async function handleGenerate() {
    if (!idea.trim() || selectedPlatforms.length === 0 || loading) return;
    if (!canGenerate) {
      router.push("/credits");
      return;
    }

    setLoading(true);
    setError(null);
    setOutput(null);

    try {
      const token = await user!.getIdToken();
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ idea: idea.trim(), platforms: selectedPlatforms }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 402) router.push("/credits");
        else setError(data.error || "Kuch gadbad ho gayi");
        return;
      }

      const parsed = parseOutput(data.output);
      setOutput(parsed);
    } catch {
      setError("Network error. Dobara try karo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
        ⚡ Content Generate Karo
      </h1>
      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 14, marginBottom: 24 }}>
        Ek idea do, viral content lo — sabhi platforms ke liye
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
        }}
        className="gen-grid"
      >
        {/* Input panel */}
        <div>
          {/* Credit status */}
          {!isPro && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                background: canGenerate
                  ? "rgba(34,197,94,0.08)"
                  : "rgba(239,68,68,0.08)",
                border: `1px solid ${canGenerate ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                fontSize: 13,
                color: canGenerate ? "#4ade80" : "#f87171",
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {canGenerate ? (
                <>
                  <span>✅</span>{" "}
                  {credits > 0
                    ? `${credits} credits available`
                    : `${freeRemaining} free gens left`}
                </>
              ) : (
                <>
                  <span>⚠️</span> Credits khatam!{" "}
                  <button
                    onClick={() => router.push("/credits")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#f87171",
                      textDecoration: "underline",
                      cursor: "pointer",
                      padding: 0,
                      fontSize: 13,
                    }}
                  >
                    Top up karo
                  </button>
                </>
              )}
            </div>
          )}

          {/* Idea input */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                color: "rgba(255,255,255,0.7)",
                marginBottom: 6,
              }}
            >
              Content Idea
            </label>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Example: Diabetes ke liye 5 gharelu nuskhe jo doctor bhi batate hain..."
              rows={5}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10,
                padding: "12px 14px",
                color: "#fff",
                fontSize: 14,
                resize: "vertical",
                outline: "none",
                fontFamily: "inherit",
                boxSizing: "border-box",
                minHeight: 120,
              }}
            />
          </div>

          {/* Platform selection */}
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                color: "rgba(255,255,255,0.7)",
                marginBottom: 8,
              }}
            >
              Platforms
            </label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              {PLATFORMS.map((p) => {
                const selected = selectedPlatforms.includes(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => togglePlatform(p.id)}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: selected
                        ? "1px solid rgba(124,58,237,0.6)"
                        : "1px solid rgba(255,255,255,0.1)",
                      background: selected
                        ? "rgba(124,58,237,0.15)"
                        : "rgba(255,255,255,0.03)",
                      color: selected ? "#9F7AEA" : "rgba(255,255,255,0.5)",
                      fontSize: 13,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontWeight: selected ? 600 : 400,
                      minHeight: 44,
                    }}
                  >
                    <span>{p.icon}</span>
                    <span style={{ fontSize: 12 }}>{p.label.split(" ")[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={loading || !idea.trim() || selectedPlatforms.length === 0}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 10,
              border: "none",
              background:
                loading || !idea.trim() || selectedPlatforms.length === 0
                  ? "rgba(124,58,237,0.3)"
                  : "linear-gradient(135deg,#7C3AED,#4F46E5)",
              color: "#fff",
              fontSize: 15,
              fontWeight: 700,
              cursor:
                loading || !idea.trim() || selectedPlatforms.length === 0
                  ? "not-allowed"
                  : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              minHeight: 48,
            }}
          >
            {loading ? (
              <>
                <span
                  style={{
                    width: 18,
                    height: 18,
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    animation: "spin 0.7s linear infinite",
                    display: "inline-block",
                  }}
                />
                AI soch raha hai...
              </>
            ) : (
              "⚡ Generate Content"
            )}
          </button>
        </div>

        {/* Output panel */}
        <div style={{ background: "#110F1A", borderRadius: 14, padding: 16, minHeight: 200 }}>
          {!output && !error && !loading && (
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(255,255,255,0.2)",
                textAlign: "center",
                minHeight: 200,
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 8 }}>✨</div>
              <p style={{ fontSize: 14 }}>Idea do, viral content yahan aayega</p>
            </div>
          )}

          {loading && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 200,
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  border: "3px solid rgba(124,58,237,0.3)",
                  borderTopColor: "#7C3AED",
                  borderRadius: "50%",
                  animation: "spin 0.7s linear infinite",
                }}
              />
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
                Viral content ban raha hai...
              </p>
            </div>
          )}

          {error && (
            <div
              style={{
                padding: 16,
                borderRadius: 10,
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#f87171",
                fontSize: 14,
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {output && (
            <div>
              <div
                style={{
                  fontSize: 13,
                  color: "#4ade80",
                  marginBottom: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                ✅ Content ready hai! Copy karo aur post karo.
              </div>
              {Object.entries(output).map(([platform, fields]) => (
                <OutputCard key={platform} platform={platform} fields={fields} />
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .gen-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}