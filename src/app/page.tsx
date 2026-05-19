"use client";

export default function LandingPage() {
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#0D0B14", minHeight: "100vh", color: "white" }}>

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5 sticky top-0 z-50" style={{ background: "rgba(13,11,20,0.9)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base" style={{ background: "linear-gradient(135deg,#7C3AED,#4F46E5)" }}>👑</div>
          <span className="font-bold text-base tracking-tight">ReelKing</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="/login" className="text-sm px-4 py-2 rounded-lg transition-all hover:opacity-80" style={{ color: "rgba(255,255,255,0.5)" }}>Login</a>
          <a href="/signup" className="text-sm px-4 py-2 rounded-xl font-semibold text-white hover:opacity-90 transition-opacity" style={{ background: "linear-gradient(135deg,#7C3AED,#4F46E5)" }}>
            Free Mein Try Karo
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 py-20 text-center overflow-hidden">
        <div className="absolute rounded-full pointer-events-none" style={{ width: 600, height: 600, background: "radial-gradient(circle,rgba(124,58,237,0.12) 0%,transparent 65%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}></div>

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6" style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", color: "#9F7AEA" }}>
            🔥 Indian Creators Ka Viral Content OS
          </div>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4" style={{ letterSpacing: "-1px" }}>
            Ek Idea Daalo —<br />
            <span style={{ background: "linear-gradient(135deg,#7C3AED,#9F7AEA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Sab Platforms Ready
            </span>
          </h1>

          <p className="text-base mb-8" style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
            YouTube Shorts, Instagram Reels, Facebook — ek jagah se sab ke liye<br />
            Hinglish mein viral titles, captions aur hashtags. Bilkul free shuru karo.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/signup"
              className="px-8 py-3.5 rounded-xl text-white font-bold text-sm hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg,#7C3AED,#4F46E5)" }}
            >
              Free Mein Shuru Karo →
            </a>
            <a href="/login"
              className="px-8 py-3.5 rounded-xl text-sm font-semibold hover:opacity-80 transition-opacity"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}
            >
              Already Account Hai? Login Karo
            </a>
          </div>

          <p className="text-xs mt-4" style={{ color: "rgba(255,255,255,0.25)" }}>
            3 generations free · Koi credit card nahi · UPI se pay karo
          </p>
        </div>
      </section>

      {/* Platform Logos */}
      <section className="px-6 py-8 border-t border-white/5">
        <p className="text-center text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: "rgba(255,255,255,0.25)" }}>
          In platforms ke liye content banao
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {[
            { icon: "▶", label: "YouTube Shorts", color: "rgba(255,0,0,0.15)" },
            { icon: "📸", label: "Instagram Reels", color: "rgba(214,40,120,0.15)" },
            { icon: "👥", label: "Facebook Reels", color: "rgba(24,119,242,0.15)" },
            { icon: "💬", label: "WhatsApp", color: "rgba(37,211,102,0.15)" },
          ].map(({ icon, label, color }) => (
            <div key={label} className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: color, border: "1px solid rgba(255,255,255,0.08)" }}>
              <span>{icon}</span>
              <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Live Demo */}
      <section className="px-6 py-16 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.25)" }}>Live Example</p>
          <h2 className="text-2xl font-bold text-center mb-10" style={{ letterSpacing: "-0.5px" }}>
            Ek idea — 4 platforms ka content ready
          </h2>

          <div className="rounded-2xl p-4 mb-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.25)" }}>Idea</p>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
              "Acidity aur gas ka desi nuskha — ghar pe theek karo"
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            {[
              { icon: "▶", platform: "YouTube Shorts", color: "rgba(255,0,0,0.12)", content: "Bhai! Ye 1 Desi Nuskha se Acidity 5 min mein theek ho gayi 🔥 | Ghar ka ilaaj" },
              { icon: "📸", platform: "Instagram Reels", color: "rgba(214,40,120,0.12)", content: "Acidity ne jeena haram kar rakha? 😫 Ye desi jugaad try karo — instant relief milegi! Save kar le bhai 🙏" },
              { icon: "👥", platform: "Facebook Reels", color: "rgba(24,119,242,0.12)", content: "Dosto, aaj ek dhansu nuskha share kar raha hoon jo meri acidity ki problem hamesha ke liye khatam kar di..." },
              { icon: "💬", platform: "WhatsApp", color: "rgba(37,211,102,0.12)", content: "Acidity se pareshaan? 🤢 Ghar ke nuskhe se paayein instant relief! ✨ Share karo sab dosto ko!" },
            ].map(({ icon, platform, color, content }) => (
              <div key={platform} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm" style={{ background: color }}>{icon}</div>
                  <span className="text-xs font-semibold text-white">{platform}</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.25)" }}>Kaise Kaam Karta Hai</p>
          <h2 className="text-2xl font-bold mb-10" style={{ letterSpacing: "-0.5px" }}>3 steps — bas itna</h2>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { num: "1", title: "Idea Likho", desc: "Hinglish mein apna content idea type karo — koi bhi topic" },
              { num: "2", title: "Platform Chuno", desc: "YouTube, Instagram, Facebook — jo chahiye wo select karo" },
              { num: "3", title: "Copy Karo", desc: "AI-generated viral content ready — seedha post kar do" },
            ].map(({ num, title, desc }) => (
              <div key={num} className="rounded-2xl p-5 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg mx-auto mb-3" style={{ background: "linear-gradient(135deg,#7C3AED,#4F46E5)" }}>
                  {num}
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-16 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.25)" }}>Pricing</p>
          <h2 className="text-2xl font-bold mb-10" style={{ letterSpacing: "-0.5px" }}>Indian creators ke liye Indian prices</h2>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Free */}
            <div className="rounded-2xl p-6 text-left" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="text-2xl mb-3">🆓</div>
              <h3 className="text-lg font-bold text-white mb-1">Free Plan</h3>
              <div className="text-2xl font-bold mb-4" style={{ color: "#9F7AEA" }}>₹0</div>
              {["3 lifetime generations", "Sab platforms", "Ad dekho → 3 aur credits", "Hinglish content"].map(f => (
                <div key={f} className="flex items-center gap-2 mb-2">
                  <span className="text-xs" style={{ color: "#4ade80" }}>✓</span>
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{f}</span>
                </div>
              ))}
              <a href="/signup" className="mt-4 flex items-center justify-center w-full py-2.5 rounded-xl text-sm font-semibold hover:opacity-80 transition-opacity"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>
                Free Shuru Karo
              </a>
            </div>

            {/* Pro */}
            <div className="rounded-2xl p-6 text-left relative" style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.35)" }}>
              <div className="absolute top-4 right-4 text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "linear-gradient(135deg,#7C3AED,#4F46E5)", color: "white" }}>BEST</div>
              <div className="text-2xl mb-3">👑</div>
              <h3 className="text-lg font-bold text-white mb-1">Pro Plan</h3>
              <div className="text-2xl font-bold mb-4" style={{ color: "#9F7AEA" }}>₹99<span className="text-sm font-normal" style={{ color: "rgba(255,255,255,0.4)" }}>/month</span></div>
              {["Unlimited generations", "No ads", "History dekho", "Priority support", "Sabse sasta in India"].map(f => (
                <div key={f} className="flex items-center gap-2 mb-2">
                  <span className="text-xs" style={{ color: "#9F7AEA" }}>✓</span>
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>{f}</span>
                </div>
              ))}
              <a href="/signup" className="mt-4 flex items-center justify-center w-full py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                style={{ background: "linear-gradient(135deg,#7C3AED,#4F46E5)" }}>
                Pro Lo — ₹99/month
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-white/5 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-md flex items-center justify-center text-sm" style={{ background: "linear-gradient(135deg,#7C3AED,#4F46E5)" }}>👑</div>
          <span className="font-bold text-sm">ReelKing</span>
        </div>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
          © 2026 ReelKing · Indian creators ka viral content OS · Made with ❤️ in Bisauli, UP
        </p>
        <div className="flex justify-center gap-4 mt-3">
          {["Privacy", "Terms", "Contact"].map(l => (
            <a key={l} href="#" className="text-xs hover:opacity-60 transition-opacity" style={{ color: "rgba(255,255,255,0.25)" }}>{l}</a>
          ))}
        </div>
      </footer>

    </div>
  );
}