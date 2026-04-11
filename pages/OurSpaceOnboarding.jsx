import { useState } from "react";

const steps = [
  {
    id: "age",
    title: "First things first",
    subtitle: "How old are you?",
    emoji: "🎂"
  },
  {
    id: "welcome",
    title: "Welcome to OurSpace 2.0",
    subtitle: "Your Space. Your Rules. No Algorithms.",
    emoji: "🌐"
  },
  {
    id: "features",
    title: "Here's what makes us different",
    subtitle: "The social network built for humans",
    emoji: "⚡"
  },
  {
    id: "customize",
    title: "Make it yours",
    subtitle: "Pick a vibe to start with",
    emoji: "🎨"
  },
  {
    id: "ready",
    title: "You're all set!",
    subtitle: "Welcome to the underground",
    emoji: "🚀"
  }
];

const features = [
  { icon: "📰", title: "The Underground Feed", desc: "Chronological only. No algorithm deciding what you see." },
  { icon: "🎨", title: "Your Digital Mirror", desc: "Fully customizable profile — themes, music, widgets, guestbook." },
  { icon: "🔒", title: "The Shield", desc: "End-to-end encrypted DMs. We literally cannot read them." },
  { icon: "✅", title: "Human-Only Filter", desc: "Toggle to see only verified human-created content." },
  { icon: "📺", title: "Serialized Stories", desc: "Follow creators through chapters and series." },
];

const vibes = [
  { id: "dark", label: "Dark Mode", color: "#1a1a2e", accent: "#c084fc", emoji: "🌙" },
  { id: "neon", label: "Neon Nights", color: "#0d0d1a", accent: "#22d3ee", emoji: "⚡" },
  { id: "retro", label: "Retro Web", color: "#1a0f00", accent: "#f59e0b", emoji: "🕹️" },
  { id: "minimal", label: "Clean & Minimal", color: "#111827", accent: "#6ee7b7", emoji: "✨" },
];

export default function OurSpaceOnboarding() {
  const [step, setStep] = useState(0);
  const [age, setAge] = useState("");
  const [ageError, setAgeError] = useState("");
  const [selectedVibe, setSelectedVibe] = useState(null);
  const [parentEmail, setParentEmail] = useState("");
  const [parentConsent, setParentConsent] = useState(false);
  const [needsParent, setNeedsParent] = useState(false);

  const handleAgeSubmit = () => {
    const num = parseInt(age);
    if (!age || isNaN(num) || num < 1 || num > 120) {
      setAgeError("Please enter a valid age.");
      return;
    }
    if (num < 12) {
      setAgeError("OurSpace 2.0 is for users aged 12 and older. If you're under 12, please check out The Legacy Circle — our app for younger learners! 🛡️");
      return;
    }
    if (num < 18) {
      setNeedsParent(true);
      setAgeError("");
    } else {
      setNeedsParent(false);
      setAgeError("");
      setStep(1);
    }
  };

  const handleParentConsent = () => {
    if (!parentEmail || !parentEmail.includes("@")) {
      setAgeError("Please enter a valid parent/guardian email.");
      return;
    }
    if (!parentConsent) {
      setAgeError("Parent/guardian must agree to the Terms of Service.");
      return;
    }
    setAgeError("");
    setStep(1);
  };

  const currentStep = steps[step];

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d1a", color: "#f0f0f0", fontFamily: "'Segoe UI', sans-serif", display: "flex", flexDirection: "column" }}>

      {/* Progress dots */}
      {step > 0 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: "20px 0 0" }}>
          {steps.slice(1).map((_, i) => (
            <div key={i} style={{ width: i === step - 1 ? 24 : 8, height: 8, borderRadius: 999, background: i <= step - 1 ? "#c084fc" : "#2a2a45", transition: "all 0.3s" }} />
          ))}
        </div>
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "32px 24px", maxWidth: 480, margin: "0 auto", width: "100%" }}>

        {/* STEP 0: Age Gate */}
        {step === 0 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🌐</div>
              <h1 style={{ fontSize: 28, fontWeight: 900, margin: "0 0 8px", background: "linear-gradient(90deg, #c084fc, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                OurSpace 2.0
              </h1>
              <p style={{ color: "#64748b", margin: 0 }}>Your Space. Your Rules.</p>
            </div>

            {!needsParent ? (
              <div>
                <label style={{ color: "#94a3b8", fontSize: 14, display: "block", marginBottom: 8 }}>Enter your age to continue</label>
                <input
                  type="number"
                  value={age}
                  onChange={e => { setAge(e.target.value); setAgeError(""); }}
                  onKeyDown={e => e.key === "Enter" && handleAgeSubmit()}
                  placeholder="Your age"
                  style={{ width: "100%", padding: "14px 16px", background: "#16162a", border: "1px solid #2a2a45", borderRadius: 12, color: "#f0f0f0", fontSize: 18, outline: "none", boxSizing: "border-box" }}
                />
                {ageError && (
                  <div style={{ marginTop: 12, padding: 12, background: "#2a1515", borderRadius: 8, color: "#f87171", fontSize: 13 }}>{ageError}</div>
                )}
                <button
                  onClick={handleAgeSubmit}
                  style={{ width: "100%", marginTop: 16, padding: "14px", background: "linear-gradient(135deg, #c084fc, #22d3ee)", border: "none", borderRadius: 12, color: "#000", fontWeight: 800, fontSize: 16, cursor: "pointer" }}
                >
                  Continue →
                </button>
              </div>
            ) : (
              <div>
                <div style={{ padding: 16, background: "#1e1a2e", borderRadius: 12, border: "1px solid #c084fc30", marginBottom: 20 }}>
                  <p style={{ color: "#c084fc", fontSize: 14, margin: 0 }}>👋 Since you're under 18, we need a parent or guardian to approve your account.</p>
                </div>
                <label style={{ color: "#94a3b8", fontSize: 14, display: "block", marginBottom: 8 }}>Parent/Guardian Email</label>
                <input
                  type="email"
                  value={parentEmail}
                  onChange={e => { setParentEmail(e.target.value); setAgeError(""); }}
                  placeholder="parent@email.com"
                  style={{ width: "100%", padding: "14px 16px", background: "#16162a", border: "1px solid #2a2a45", borderRadius: 12, color: "#f0f0f0", fontSize: 16, outline: "none", boxSizing: "border-box", marginBottom: 16 }}
                />
                <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", color: "#94a3b8", fontSize: 13 }}>
                  <input
                    type="checkbox"
                    checked={parentConsent}
                    onChange={e => setParentConsent(e.target.checked)}
                    style={{ marginTop: 2, accentColor: "#c084fc" }}
                  />
                  I am the parent/guardian of this user. I have read and agree to the <span style={{ color: "#c084fc" }}>Terms of Service</span> and <span style={{ color: "#22d3ee" }}>Privacy Policy</span> on behalf of my child.
                </label>
                {ageError && (
                  <div style={{ marginTop: 12, padding: 12, background: "#2a1515", borderRadius: 8, color: "#f87171", fontSize: 13 }}>{ageError}</div>
                )}
                <button
                  onClick={handleParentConsent}
                  style={{ width: "100%", marginTop: 16, padding: "14px", background: "linear-gradient(135deg, #c084fc, #22d3ee)", border: "none", borderRadius: 12, color: "#000", fontWeight: 800, fontSize: 16, cursor: "pointer" }}
                >
                  Approve & Continue →
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 1: Welcome */}
        {step === 1 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 72, marginBottom: 24 }}>🌐</div>
            <h1 style={{ fontSize: 30, fontWeight: 900, margin: "0 0 12px", background: "linear-gradient(90deg, #c084fc, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Welcome to OurSpace 2.0
            </h1>
            <p style={{ color: "#94a3b8", fontSize: 16, lineHeight: 1.6, marginBottom: 32 }}>
              The internet used to feel like home.<br />We're bringing that back — with 2026 security and zero algorithm manipulation.
            </p>
            <img src="https://media.base44.com/images/public/69d9b8416964fe31ae3f9932/d95f6b9ab_generated_image.png" alt="Welcome" style={{ width: "100%", borderRadius: 16, marginBottom: 32, maxHeight: 240, objectFit: "cover" }} />
            <button onClick={() => setStep(2)} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #c084fc, #22d3ee)", border: "none", borderRadius: 12, color: "#000", fontWeight: 800, fontSize: 16, cursor: "pointer" }}>
              Show Me What's New →
            </button>
          </div>
        )}

        {/* STEP 2: Features */}
        {step === 2 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>⚡</div>
              <h2 style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>What makes us different</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
              {features.map((f, i) => (
                <div key={i} style={{ background: "#16162a", borderRadius: 12, padding: "14px 16px", border: "1px solid #2a2a45", display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <span style={{ fontSize: 28 }}>{f.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{f.title}</div>
                    <div style={{ color: "#64748b", fontSize: 13 }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setStep(3)} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #c084fc, #22d3ee)", border: "none", borderRadius: 12, color: "#000", fontWeight: 800, fontSize: 16, cursor: "pointer" }}>
              Customize My Space →
            </button>
          </div>
        )}

        {/* STEP 3: Pick a vibe */}
        {step === 3 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎨</div>
              <h2 style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>Pick your starting vibe</h2>
              <p style={{ color: "#64748b", fontSize: 14, marginTop: 6 }}>You can change this anytime</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 32 }}>
              {vibes.map(v => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVibe(v.id)}
                  style={{ padding: "20px 16px", background: selectedVibe === v.id ? v.color : "#16162a", border: `2px solid ${selectedVibe === v.id ? v.accent : "#2a2a45"}`, borderRadius: 12, color: "#f0f0f0", cursor: "pointer", textAlign: "center", transition: "all 0.2s" }}
                >
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{v.emoji}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: selectedVibe === v.id ? v.accent : "#f0f0f0" }}>{v.label}</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => selectedVibe && setStep(4)}
              style={{ width: "100%", padding: "14px", background: selectedVibe ? "linear-gradient(135deg, #c084fc, #22d3ee)" : "#2a2a45", border: "none", borderRadius: 12, color: selectedVibe ? "#000" : "#64748b", fontWeight: 800, fontSize: 16, cursor: selectedVibe ? "pointer" : "not-allowed" }}
            >
              {selectedVibe ? "Let's Go →" : "Pick a vibe first"}
            </button>
          </div>
        )}

        {/* STEP 4: Ready */}
        {step === 4 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 72, marginBottom: 16, animation: "bounce 0.5s" }}>🚀</div>
            <h1 style={{ fontSize: 28, fontWeight: 900, margin: "0 0 12px", background: "linear-gradient(90deg, #c084fc, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              You're in!
            </h1>
            <p style={{ color: "#94a3b8", fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
              Your corner of the internet is ready.<br />
              Customize your profile, find your people, and post freely — no algorithm in sight.
            </p>
            <div style={{ background: "#16162a", borderRadius: 12, padding: 20, marginBottom: 24, border: "1px solid #c084fc30" }}>
              <p style={{ color: "#c084fc", fontWeight: 700, margin: "0 0 8px" }}>Quick Start Tips</p>
              <ul style={{ color: "#94a3b8", fontSize: 13, textAlign: "left", paddingLeft: 20, lineHeight: 2, margin: 0 }}>
                <li>Set up your profile — add music, a theme, your Top 8</li>
                <li>Follow a few people to fill your feed</li>
                <li>Post something — your timeline starts now</li>
                <li>Turn on The Shield for private chats</li>
              </ul>
            </div>
            <button
              onClick={() => window.location.href = "/"}
              style={{ width: "100%", padding: "16px", background: "linear-gradient(135deg, #c084fc, #22d3ee)", border: "none", borderRadius: 12, color: "#000", fontWeight: 900, fontSize: 18, cursor: "pointer" }}
            >
              Enter OurSpace →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
