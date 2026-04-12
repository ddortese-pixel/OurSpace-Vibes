import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LC_ICON = "https://media.base44.com/images/public/69d9b8416964fe31ae3f9932/f199871d3_generated_image.png";
const FN_URL = "https://legacy-circle-ae3f9932.base44.app/functions";

const CHARACTERS = [
  { name: "Justice", emoji: "⚖️", color: "#f59e0b", desc: "Fights for what's right" },
  { name: "Lebron", emoji: "🏀", color: "#3b82f6", desc: "Leader & team player" },
  { name: "Zara", emoji: "🌟", color: "#ec4899", desc: "Creative & expressive" },
  { name: "Eli", emoji: "🔬", color: "#10b981", desc: "Curious problem solver" },
];

const AGE_GROUPS = [
  { label: "2–4", value: "2-4", emoji: "🌱" },
  { label: "5–7", value: "5-7", emoji: "🌿" },
  { label: "8–10", value: "8-10", emoji: "🌳" },
  { label: "11–14", value: "11-14", emoji: "🚀" },
];

export default function LCOnboarding() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [character, setCharacter] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [childEmail, setChildEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const s = { fontFamily: "sans-serif" };

  async function finish() {
    if (!name || !ageGroup || !character) { setError("Please complete all fields."); return; }
    setLoading(true);
    const email = childEmail || `${name.toLowerCase().replace(/\s+/g, ".")}@learner.legacycircle`;

    // Send parent verification if under 13
    const ageNum = parseInt(ageGroup.split("-")[1]);
    if (ageNum <= 13 && parentEmail) {
      try {
        await fetch(`${FN_URL}/sendParentVerification`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ childName: name, childEmail: email, parentEmail, appName: "The Legacy Circle" }),
        });
      } catch (e) { /* non-fatal */ }
    }

    localStorage.setItem("lc_email", email);
    localStorage.setItem("lc_name", name);
    localStorage.setItem("lc_age_group", ageGroup);
    localStorage.setItem("lc_character", character);
    localStorage.setItem("lc_parent_email", parentEmail);
    setLoading(false);
    navigate("/LCHome");
  }

  const card = {
    background: "#16162a", borderRadius: 20, padding: "32px 28px",
    maxWidth: 480, width: "100%", margin: "0 auto",
    boxShadow: "0 8px 40px #0008",
  };

  return (
    <div style={{ ...s, minHeight: "100vh", background: "radial-gradient(ellipse at 50% 20%, #1a0a2e, #0a0a1a)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={card}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>📚</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>The Legacy Circle</div>
          <div style={{ fontSize: 13, color: "#a78bfa", marginTop: 4 }}>
            {step === 1 && "Who's learning today?"}
            {step === 2 && "Pick your age group"}
            {step === 3 && "Choose your character"}
            {step === 4 && "Parent/Guardian info"}
          </div>
        </div>

        {/* Step indicator */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 28 }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{
              width: i <= step ? 24 : 8, height: 8, borderRadius: 4,
              background: i <= step ? "#a855f7" : "#2d2d4e",
              transition: "all 0.3s",
            }} />
          ))}
        </div>

        {/* Step 1 — Name */}
        {step === 1 && (
          <div>
            <label style={{ color: "#a78bfa", fontSize: 13, fontWeight: 600 }}>YOUR NAME</label>
            <input
              value={name} onChange={e => setName(e.target.value)}
              placeholder="Enter your name..."
              style={{ width: "100%", background: "#0d0d1a", border: "1px solid #2d2d4e", borderRadius: 12, padding: "14px 16px", color: "#fff", fontSize: 16, marginTop: 8, boxSizing: "border-box" }}
            />
            <label style={{ color: "#a78bfa", fontSize: 13, fontWeight: 600, display: "block", marginTop: 20 }}>YOUR EMAIL (optional)</label>
            <input
              value={childEmail} onChange={e => setChildEmail(e.target.value)}
              placeholder="learner@email.com"
              style={{ width: "100%", background: "#0d0d1a", border: "1px solid #2d2d4e", borderRadius: 12, padding: "14px 16px", color: "#fff", fontSize: 16, marginTop: 8, boxSizing: "border-box" }}
            />
          </div>
        )}

        {/* Step 2 — Age Group */}
        {step === 2 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {AGE_GROUPS.map(ag => (
              <button key={ag.value} onClick={() => setAgeGroup(ag.value)} style={{
                background: ageGroup === ag.value ? "#2d1b69" : "#0d0d1a",
                border: `2px solid ${ageGroup === ag.value ? "#a855f7" : "#2d2d4e"}`,
                borderRadius: 16, padding: "20px 12px", cursor: "pointer", textAlign: "center",
                color: "#fff", transition: "all 0.2s",
              }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{ag.emoji}</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>Ages {ag.label}</div>
              </button>
            ))}
          </div>
        )}

        {/* Step 3 — Character */}
        {step === 3 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {CHARACTERS.map(c => (
              <button key={c.name} onClick={() => setCharacter(c.name)} style={{
                background: character === c.name ? "#1a0a2e" : "#0d0d1a",
                border: `2px solid ${character === c.name ? c.color : "#2d2d4e"}`,
                borderRadius: 16, padding: "20px 12px", cursor: "pointer", textAlign: "center",
                color: "#fff", transition: "all 0.2s",
                boxShadow: character === c.name ? `0 0 20px ${c.color}40` : "none",
              }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>{c.emoji}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: character === c.name ? c.color : "#fff" }}>{c.name}</div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>{c.desc}</div>
              </button>
            ))}
          </div>
        )}

        {/* Step 4 — Parent email */}
        {step === 4 && (
          <div>
            <div style={{ background: "#1a0a2e", borderRadius: 12, padding: "14px 16px", marginBottom: 20, border: "1px solid #7c3aed40" }}>
              <div style={{ color: "#a78bfa", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>🔒 COPPA COMPLIANCE</div>
              <div style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.5 }}>
                If your learner is under 13, a parent or guardian must approve their account. We'll send a quick verification email.
              </div>
            </div>
            <label style={{ color: "#a78bfa", fontSize: 13, fontWeight: 600 }}>PARENT/GUARDIAN EMAIL</label>
            <input
              value={parentEmail} onChange={e => setParentEmail(e.target.value)}
              placeholder="parent@email.com"
              style={{ width: "100%", background: "#0d0d1a", border: "1px solid #2d2d4e", borderRadius: 12, padding: "14px 16px", color: "#fff", fontSize: 16, marginTop: 8, boxSizing: "border-box" }}
            />
            <div style={{ color: "#475569", fontSize: 11, marginTop: 8 }}>
              Optional for ages 14+. Required for ages 2–13 per US COPPA law.
            </div>
          </div>
        )}

        {error && <div style={{ color: "#f87171", fontSize: 13, marginTop: 12, textAlign: "center" }}>{error}</div>}

        {/* Navigation */}
        <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
          {step > 1 && (
            <button onClick={() => setStep(s => s - 1)} style={{
              flex: 1, background: "#1e1e32", border: "1px solid #2d2d4e", borderRadius: 12,
              padding: "14px", color: "#94a3b8", fontSize: 15, fontWeight: 600, cursor: "pointer",
            }}>← Back</button>
          )}
          <button
            onClick={() => {
              setError("");
              if (step === 1 && !name.trim()) { setError("Please enter your name."); return; }
              if (step === 2 && !ageGroup) { setError("Please pick an age group."); return; }
              if (step === 3 && !character) { setError("Please choose a character."); return; }
              if (step < 4) { setStep(s => s + 1); } else { finish(); }
            }}
            disabled={loading}
            style={{
              flex: 2, background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              border: "none", borderRadius: 12, padding: "14px", color: "#fff",
              fontSize: 15, fontWeight: 700, cursor: "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Setting up..." : step < 4 ? "Next →" : "Start Learning! 🚀"}
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: 16, fontSize: 11, color: "#334155" }}>
          By continuing you agree to our{" "}
          <a href="/LCPrivacyPolicy" style={{ color: "#7c3aed" }}>Privacy Policy</a> &{" "}
          <a href="/LCTermsOfService" style={{ color: "#7c3aed" }}>Terms of Service</a>
        </div>
      </div>
    </div>
  );
}
