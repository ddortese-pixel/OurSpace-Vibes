import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OS2_ICON = "https://media.base44.com/images/public/69d9b8416964fe31ae3f9932/7bbdaee82_generated_image.png";

const FEATURES = [
  { icon: "📰", title: "Chronological Feed", desc: "See everything in real time — zero algorithm deciding what you miss.", color: "#c084fc" },
  { icon: "🔒", title: "E2EE Messaging", desc: "End-to-end encrypted DMs. Not even we can read them.", color: "#22d3ee" },
  { icon: "✅", title: "Human-Only Filter", desc: "Toggle to see only verified human-created content.", color: "#4ade80" },
  { icon: "🎨", title: "Your Digital Space", desc: "Fully customizable profile — themes, music, mood, guestbook.", color: "#f59e0b" },
  { icon: "📖", title: "Serialized Stories", desc: "Follow creators through episodes and series like a show.", color: "#ec4899" },
];

const VIBES = [
  { id: "purple-pink", label: "Dark Purple", emoji: "💜", bg: "linear-gradient(135deg,#c084fc,#ec4899)" },
  { id: "blue-cyan",   label: "Ocean Blue",  emoji: "💙", bg: "linear-gradient(135deg,#3b82f6,#22d3ee)" },
  { id: "orange-red",  label: "Sunset",      emoji: "🔥", bg: "linear-gradient(135deg,#f97316,#ef4444)" },
  { id: "green-teal",  label: "Forest",      emoji: "🌿", bg: "linear-gradient(135deg,#22c55e,#14b8a6)" },
];

const SOCIAL_PROOF = [
  { name: "Jordan M.", avatar: "J", color: "#f59e0b", text: "Finally a social app that doesn't manipulate what I see 🙌" },
  { name: "Skylar R.", avatar: "S", color: "#22d3ee", text: "The E2EE messaging alone sold me. No one reads my convos." },
  { name: "Alex T.",   avatar: "A", color: "#4ade80", text: "10k+ users and it still feels like a community not a corporation" },
];

function injectGA(id) {
  if (document.getElementById(`ga-${id}`)) return;
  const s1 = document.createElement("script"); s1.id = `ga-${id}`; s1.async = true;
  s1.src = `https://www.googletagmanager.com/gtag/js?id=${id}`; document.head.appendChild(s1);
  const s2 = document.createElement("script");
  s2.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","${id}");`;
  document.head.appendChild(s2);
}

export default function OurSpaceOnboarding() {
  const [step, setStep] = useState(0); // 0=age 1=social-proof 2=features 3=vibe 4=name 5=done
  const [age, setAge] = useState("");
  const [ageError, setAgeError] = useState("");
  const [needsParent, setNeedsParent] = useState(false);
  const [parentEmail, setParentEmail] = useState("");
  const [parentConsent, setParentConsent] = useState(false);
  const [selectedVibe, setSelectedVibe] = useState("purple-pink");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { injectGA("G-1N8GD2WM6L"); setTimeout(() => setVisible(true), 80); }, []);

  const TOTAL_STEPS = 6;
  const progress = Math.round((step / TOTAL_STEPS) * 100);

  const handleAge = () => {
    const n = parseInt(age);
    if (!age || isNaN(n) || n < 1 || n > 120) { setAgeError("Please enter a valid age."); return; }
    if (n < 13) { setAgeError("OurSpace 2.0 is for users 13+. Under 13? Check out The Legacy Circle — made for younger learners! 🛡️"); return; }
    if (n < 18) { setNeedsParent(true); setAgeError(""); return; }
    setNeedsParent(false); setAgeError(""); setStep(1);
  };

  const handleParent = () => {
    if (!parentEmail.includes("@")) { setAgeError("Enter a valid parent/guardian email."); return; }
    if (!parentConsent) { setAgeError("Parent/guardian must agree to Terms of Service."); return; }
    setAgeError(""); setStep(1);
  };

  const handleFinish = () => {
    if (!displayName.trim()) return;
    const finalEmail = email.trim() || `${displayName.toLowerCase().replace(/\s+/g, ".")}.${Date.now()}@ourspace.local`;
    localStorage.setItem("os2_email", finalEmail);
    localStorage.setItem("os2_name", displayName.trim());
    localStorage.setItem("os2_vibe", selectedVibe);
    // GA event
    if (window.gtag) window.gtag("event", "sign_up", { method: "onboarding" });
    setStep(5);
    setTimeout(() => navigate("/Home"), 2200);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0d0d1a", color: "#f0f0f0",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      display: "flex", flexDirection: "column",
      opacity: visible ? 1 : 0, transition: "opacity 0.4s",
    }}>

      {/* Progress bar */}
      {step > 0 && step < 5 && (
        <div style={{ height: 3, background: "#1e1e3a", position: "fixed", top: 0, left: 0, right: 0, zIndex: 100 }}>
          <div style={{ height: "100%", background: "linear-gradient(90deg,#c084fc,#22d3ee)", width: `${progress}%`, transition: "width 0.4s ease" }} />
        </div>
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 24px", maxWidth: 500, margin: "0 auto", width: "100%" }}>

        {/* STEP 0: Age Gate */}
        {step === 0 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <img src={OS2_ICON} alt="OurSpace 2.0" style={{ width: 80, height: 80, borderRadius: 20, marginBottom: 20, boxShadow: "0 0 40px #c084fc40" }} />
              <h1 style={{ fontSize: 32, fontWeight: 900, margin: "0 0 8px", background: "linear-gradient(90deg,#c084fc,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>OurSpace 2.0</h1>
              <p style={{ color: "#64748b", margin: "0 0 4px", fontSize: 15 }}>Your Space. No Algorithms.</p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#1e1e3a", borderRadius: 20, padding: "5px 14px", marginTop: 12 }}>
                <span style={{ fontSize: 12 }}>🔥</span>
                <span style={{ color: "#c084fc", fontSize: 12, fontWeight: 700 }}>10,247 active members</span>
              </div>
            </div>

            {!needsParent ? (
              <>
                <label style={{ color: "#94a3b8", fontSize: 13, display: "block", marginBottom: 8 }}>Enter your age to continue</label>
                <input type="number" value={age} onChange={e => { setAge(e.target.value); setAgeError(""); }} onKeyDown={e => e.key === "Enter" && handleAge()} placeholder="Your age"
                  style={{ width: "100%", padding: "16px", background: "#13132b", border: "1px solid #2a2a45", borderRadius: 14, color: "#f0f0f0", fontSize: 20, outline: "none", boxSizing: "border-box", textAlign: "center", fontWeight: 700 }} />
                {ageError && <div style={{ marginTop: 10, padding: 12, background: "#2a1515", borderRadius: 10, color: "#f87171", fontSize: 13 }}>{ageError}</div>}
                <button onClick={handleAge} style={{ width: "100%", marginTop: 14, padding: "16px", background: "linear-gradient(135deg,#c084fc,#22d3ee)", border: "none", borderRadius: 14, color: "#000", fontWeight: 900, fontSize: 17, cursor: "pointer" }}>
                  Join OurSpace →
                </button>
                <p style={{ color: "#475569", fontSize: 12, textAlign: "center", marginTop: 14, lineHeight: 1.6 }}>
                  By continuing you agree to our{" "}
                  <span style={{ color: "#c084fc", cursor: "pointer" }} onClick={() => navigate("/TermsOfService")}>Terms</span>
                  {" "}and{" "}
                  <span style={{ color: "#22d3ee", cursor: "pointer" }} onClick={() => navigate("/PrivacyPolicy")}>Privacy Policy</span>
                </p>
              </>
            ) : (
              <>
                <div style={{ padding: 16, background: "#1e1a2e", borderRadius: 14, border: "1px solid #c084fc30", marginBottom: 20 }}>
                  <p style={{ color: "#c084fc", fontSize: 14, margin: 0, lineHeight: 1.6 }}>👋 Since you're under 18, a parent or guardian needs to approve your account first.</p>
                </div>
                <label style={{ color: "#94a3b8", fontSize: 13, display: "block", marginBottom: 8 }}>Parent/Guardian Email</label>
                <input type="email" value={parentEmail} onChange={e => { setParentEmail(e.target.value); setAgeError(""); }} placeholder="parent@email.com"
                  style={{ width: "100%", padding: "14px 16px", background: "#13132b", border: "1px solid #2a2a45", borderRadius: 14, color: "#f0f0f0", fontSize: 15, outline: "none", boxSizing: "border-box", marginBottom: 16 }} />
                <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", color: "#94a3b8", fontSize: 13 }}>
                  <input type="checkbox" checked={parentConsent} onChange={e => setParentConsent(e.target.checked)} style={{ marginTop: 3, accentColor: "#c084fc" }} />
                  I am the parent/guardian and have read and agree to the <span style={{ color: "#c084fc" }}>Terms of Service</span> and <span style={{ color: "#22d3ee" }}>Privacy Policy</span> on behalf of my child.
                </label>
                {ageError && <div style={{ marginTop: 10, padding: 12, background: "#2a1515", borderRadius: 10, color: "#f87171", fontSize: 13 }}>{ageError}</div>}
                <button onClick={handleParent} style={{ width: "100%", marginTop: 16, padding: "16px", background: "linear-gradient(135deg,#c084fc,#22d3ee)", border: "none", borderRadius: 14, color: "#000", fontWeight: 900, fontSize: 17, cursor: "pointer" }}>
                  Approve & Continue →
                </button>
              </>
            )}
          </div>
        )}

        {/* STEP 1: Social Proof */}
        {step === 1 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{ fontSize: 52, marginBottom: 12 }}>🌐</div>
              <h2 style={{ fontSize: 28, fontWeight: 900, margin: "0 0 8px" }}>10,000+ people already here</h2>
              <p style={{ color: "#64748b", fontSize: 15, margin: 0 }}>Here's what they're saying</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
              {SOCIAL_PROOF.map((r, i) => (
                <div key={i} style={{ background: "#13132b", borderRadius: 16, padding: "16px 18px", border: "1px solid #2a2a45" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: r.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#000", fontSize: 15 }}>{r.avatar}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{r.name}</div>
                      <div style={{ color: "#f59e0b", fontSize: 11 }}>★★★★★</div>
                    </div>
                    <span style={{ marginLeft: "auto", fontSize: 10, color: "#475569", background: "#1e1e3a", borderRadius: 10, padding: "2px 8px" }}>Verified Member</span>
                  </div>
                  <p style={{ color: "#94a3b8", fontSize: 14, margin: 0, lineHeight: 1.6 }}>{r.text}</p>
                </div>
              ))}
            </div>
            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 28 }}>
              {[["10K+","Members"],["4.8★","Avg Rating"],["#1","No-Algo Feed"]].map(([v, l]) => (
                <div key={l} style={{ background: "#13132b", borderRadius: 14, padding: "14px 8px", textAlign: "center", border: "1px solid #2a2a45" }}>
                  <div style={{ fontWeight: 900, fontSize: 20, color: "#c084fc" }}>{v}</div>
                  <div style={{ color: "#64748b", fontSize: 11, marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
            <button onClick={() => setStep(2)} style={{ width: "100%", padding: "16px", background: "linear-gradient(135deg,#c084fc,#22d3ee)", border: "none", borderRadius: 14, color: "#000", fontWeight: 900, fontSize: 17, cursor: "pointer" }}>
              See What's Inside →
            </button>
          </div>
        )}

        {/* STEP 2: Features */}
        {step === 2 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>⚡</div>
              <h2 style={{ fontSize: 26, fontWeight: 900, margin: "0 0 6px" }}>Built different</h2>
              <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>Everything the big platforms refuse to give you</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
              {FEATURES.map((f, i) => (
                <div key={i} style={{ background: "#13132b", borderRadius: 14, padding: "14px 16px", border: "1px solid #2a2a45", display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: f.color + "20", border: `1px solid ${f.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{f.icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{f.title}</div>
                    <div style={{ color: "#64748b", fontSize: 13, lineHeight: 1.4 }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setStep(3)} style={{ width: "100%", padding: "16px", background: "linear-gradient(135deg,#c084fc,#22d3ee)", border: "none", borderRadius: 14, color: "#000", fontWeight: 900, fontSize: 17, cursor: "pointer" }}>
              Pick Your Vibe →
            </button>
          </div>
        )}

        {/* STEP 3: Vibe Picker */}
        {step === 3 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎨</div>
              <h2 style={{ fontSize: 26, fontWeight: 900, margin: "0 0 6px" }}>Make it yours</h2>
              <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>Pick a color theme to start with. You can change it anytime.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 32 }}>
              {VIBES.map(v => (
                <button key={v.id} onClick={() => setSelectedVibe(v.id)}
                  style={{ padding: "0", background: "none", border: `3px solid ${selectedVibe === v.id ? "#ffffff" : "transparent"}`, borderRadius: 18, cursor: "pointer", overflow: "hidden", boxShadow: selectedVibe === v.id ? "0 0 24px rgba(255,255,255,0.2)" : "none", transition: "all 0.2s" }}>
                  <div style={{ background: v.bg, height: 80, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>{v.emoji}</div>
                  <div style={{ background: "#13132b", padding: "10px", fontWeight: selectedVibe === v.id ? 700 : 400, fontSize: 14, color: selectedVibe === v.id ? "#fff" : "#94a3b8" }}>{v.label}</div>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(4)} style={{ width: "100%", padding: "16px", background: "linear-gradient(135deg,#c084fc,#22d3ee)", border: "none", borderRadius: 14, color: "#000", fontWeight: 900, fontSize: 17, cursor: "pointer" }}>
              Almost There →
            </button>
          </div>
        )}

        {/* STEP 4: Name + Email */}
        {step === 4 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>👤</div>
              <h2 style={{ fontSize: 26, fontWeight: 900, margin: "0 0 6px" }}>What should we call you?</h2>
              <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>You can edit this anytime from your profile.</p>
            </div>
            <label style={{ color: "#94a3b8", fontSize: 13, display: "block", marginBottom: 8 }}>Display name *</label>
            <input value={displayName} onChange={e => setDisplayName(e.target.value)} onKeyDown={e => e.key === "Enter" && email.trim() && handleFinish()} placeholder="Your name or username"
              style={{ width: "100%", padding: "16px", background: "#13132b", border: "1px solid #2a2a45", borderRadius: 14, color: "#f0f0f0", fontSize: 17, outline: "none", boxSizing: "border-box", marginBottom: 14, fontWeight: 600 }} />
            <label style={{ color: "#94a3b8", fontSize: 13, display: "block", marginBottom: 8 }}>Email address <span style={{ color: "#475569" }}>(optional — for account recovery)</span></label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com"
              style={{ width: "100%", padding: "16px", background: "#13132b", border: "1px solid #2a2a45", borderRadius: 14, color: "#f0f0f0", fontSize: 16, outline: "none", boxSizing: "border-box", marginBottom: 20 }} />
            <button onClick={handleFinish} disabled={!displayName.trim()}
              style={{ width: "100%", padding: "16px", background: displayName.trim() ? "linear-gradient(135deg,#c084fc,#22d3ee)" : "#1e1e3a", border: "none", borderRadius: 14, color: displayName.trim() ? "#000" : "#475569", fontWeight: 900, fontSize: 17, cursor: displayName.trim() ? "pointer" : "default", transition: "all 0.2s" }}>
              Enter OurSpace 🚀
            </button>
            <p style={{ color: "#475569", fontSize: 12, textAlign: "center", marginTop: 12, lineHeight: 1.6 }}>
              By joining you agree to our{" "}
              <span style={{ color: "#c084fc", cursor: "pointer" }} onClick={() => navigate("/TermsOfService")}>Terms</span>
              {" "}and{" "}
              <span style={{ color: "#22d3ee", cursor: "pointer" }} onClick={() => navigate("/PrivacyPolicy")}>Privacy Policy</span>
            </p>
          </div>
        )}

        {/* STEP 5: Welcome animation */}
        {step === 5 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 80, marginBottom: 20, animation: "pop 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}>🎉</div>
            <h2 style={{ fontSize: 28, fontWeight: 900, margin: "0 0 10px", background: "linear-gradient(90deg,#c084fc,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Welcome to OurSpace, {displayName || "friend"}!
            </h2>
            <p style={{ color: "#64748b", fontSize: 15, marginBottom: 28 }}>You're now part of 10,000+ humans who chose authenticity over algorithms.</p>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 24 }}>
              {["🌐 No algorithms","🔒 E2EE messaging","✅ Human-only filter"].map(t => (
                <span key={t} style={{ background: "#1e1e3a", borderRadius: 20, padding: "6px 14px", fontSize: 13, color: "#94a3b8" }}>{t}</span>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
              <div style={{ width: 40, height: 4, background: "linear-gradient(90deg,#c084fc,#22d3ee)", borderRadius: 99, animation: "load 2s linear forwards" }} />
              <span style={{ color: "#475569", fontSize: 13 }}>Taking you to the feed...</span>
            </div>
          </div>
        )}

      </div>

      <style>{`
        @keyframes pop { 0%{transform:scale(0.5);opacity:0} 100%{transform:scale(1);opacity:1} }
        @keyframes load { 0%{width:40px} 100%{width:200px} }
      `}</style>
    </div>
  );
}
