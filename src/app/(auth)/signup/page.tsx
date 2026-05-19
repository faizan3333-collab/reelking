"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase/client";
import { doc, setDoc } from "firebase/firestore";

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await signup(email, password);
      const uid = result.user.uid;

      // Firestore mein user banao
      await setDoc(doc(db, "users", uid), {
        uid,
        email,
        isPro: false,
        credits: 0,
        lifetimeUsed: 0,
        createdAt: new Date(),
      });

      window.location.href = "/generate";
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("Ye email pehle se registered hai");
      } else if (err.code === "auth/weak-password") {
        setError("Password kam se kam 6 characters ka hona chahiye");
      } else {
        setError("Kuch galat ho gaya — dobara try karo");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#0D0B14" }}>
      {/* Left - Form */}
      <div className="w-full md:w-[44%] flex flex-col justify-between p-8 md:p-10 border-r border-white/5">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base" style={{ background: "linear-gradient(135deg,#7C3AED,#4F46E5)" }}>👑</div>
          <span className="text-white font-bold text-base tracking-tight">ReelKing</span>
        </div>

        {/* Form */}
        <div className="max-w-[300px] mx-auto w-full">
          <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">Account banao</h1>
          <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.35)" }}>
            Free mein shuru karo — 3 gens free milenge
          </p>

          <div className="mb-4">
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>Email</label>
            <input
              type="email"
              placeholder="aap@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>Password</label>
            <input
              type="password"
              placeholder="kam se kam 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            />
          </div>

          {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-50 hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg,#7C3AED,#4F46E5)" }}
          >
            {loading ? "Account ban raha hai..." : "Free Signup Karo →"}
          </button>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }}></div>
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>ya</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }}></div>
          </div>

          <button
            className="w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:opacity-80 transition-all"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Google se signup karo
          </button>

          <p className="text-center mt-6 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            Pehle se account hai?{" "}
            <a href="/login" className="font-semibold" style={{ color: "#9F7AEA" }}>Login karo</a>
          </p>

          <p className="text-center mt-4 text-xs" style={{ color: "rgba(255,255,255,0.15)" }}>
            Signup karke aap hamare Terms aur Privacy Policy se agree karte hain
          </p>
        </div>

        <p className="text-center text-xs" style={{ color: "rgba(255,255,255,0.12)" }}>© 2026 ReelKing · Privacy · Terms</p>
      </div>

      {/* Right - Benefits */}
      <div className="hidden md:flex flex-1 items-center justify-center relative overflow-hidden p-8" style={{ background: "#110F1A" }}>
        <div className="absolute rounded-full pointer-events-none" style={{ width: 400, height: 400, background: "radial-gradient(circle,rgba(124,58,237,0.15) 0%,transparent 65%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}></div>

        <div className="w-full max-w-xs relative z-10">
          <p className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: "rgba(255,255,255,0.25)" }}>Free mein milega</p>

          {[
            { icon: "✨", title: "3 Free Generations", desc: "Signup ke baad seedha try karo — koi credit card nahi" },
            { icon: "📱", title: "Sab Platforms Ek Jagah", desc: "YouTube + Instagram + Facebook — ek idea, sab ready" },
            { icon: "🎯", title: "Hinglish Content", desc: "AI se natural Hindi slang mein content — ekdum creator jaisa" },
            { icon: "📈", title: "Algorithm-Optimized", desc: "Har platform ke algorithm ke hisaab se hooks aur captions" },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="flex gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0" style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.2)" }}>{icon}</div>
              <div>
                <div className="text-sm font-semibold text-white mb-1">{title}</div>
                <div className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>{desc}</div>
              </div>
            </div>
          ))}

          <div className="rounded-2xl p-4 mt-6" style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)" }}>
            <p className="text-xs font-semibold mb-1" style={{ color: "#9F7AEA" }}>💡 Pro tip</p>
            <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
              Free ke baad ad dekho aur 3 aur gens lo — ya ₹99/month mein unlimited
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}