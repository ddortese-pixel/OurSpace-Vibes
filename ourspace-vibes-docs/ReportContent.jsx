import { useState } from "react";

export default function ReportContent() {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("");
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: "spam", label: "Spam or Scam", emoji: "📨", desc: "Unsolicited messages, fake giveaways, phishing" },
    { id: "harassment", label: "Harassment or Bullying", emoji: "😤", desc: "Targeted abuse, threats, intimidation" },
    { id: "hate_speech", label: "Hate Speech", emoji: "🚫", desc: "Content attacking protected characteristics" },
    { id: "violence", label: "Violence or Graphic Content", emoji: "⚠️", desc: "Graphic violence, gore, or disturbing imagery" },
    { id: "sexual", label: "Sexual Content", emoji: "🔞", desc: "Non-consensual imagery or content involving minors" },
    { id: "misinformation", label: "Misinformation", emoji: "❌", desc: "Dangerous false information" },
    { id: "copyright", label: "Copyright Violation", emoji: "©️", desc: "My intellectual property used without permission" },
    { id: "impersonation", label: "Impersonation", emoji: "🎭", desc: "Fake account pretending to be me or someone else" },
    { id: "other", label: "Something Else", emoji: "💬", desc: "Other violation not listed above" },
  ];

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0d0d1a 0%, #1a0a2e 50%, #0d1a2e 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "'Segoe UI', sans-serif"
      }}>
        <div style={{ textAlign: "center", maxWidth: "400px" }}>
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>✅</div>
          <h2 style={{ color: "#4ade80", fontSize: "22px", marginBottom: "12px" }}>Report Submitted</h2>
          <p style={{ color: "#94a3b8", fontSize: "15px", lineHeight: "1.7", marginBottom: "28px" }}>
            Thank you for helping keep OurSpace 2.0 safe. Our moderation team will review your report within 24–48 hours.
            You'll receive a notification when action is taken.
          </p>
          <div style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: "12px", padding: "14px", marginBottom: "24px", fontSize: "13px", color: "#4ade80" }}>
            Report ID: <strong>#{Math.random().toString(36).substr(2, 8).toUpperCase()}</strong>
          </div>
          <button
            onClick={() => window.history.back()}
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", border: "none", color: "white", padding: "12px 28px", borderRadius: "12px", fontSize: "15px", fontWeight: 600, cursor: "pointer" }}
          >
            Back to OurSpace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0d0d1a 0%, #1a0a2e 50%, #0d1a2e 100%)",
      color: "#e2e8f0",
      fontFamily: "'Segoe UI', sans-serif",
      paddingBottom: "60px"
    }}>
      {/* Header */}
      <div style={{
        background: "rgba(139,92,246,0.15)",
        borderBottom: "1px solid rgba(139,92,246,0.3)",
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        position: "sticky",
        top: 0,
        backdropFilter: "blur(12px)",
        zIndex: 100
      }}>
        <button onClick={() => step > 1 ? setStep(step - 1) : window.history.back()} style={{ background: "none", border: "none", color: "#a78bfa", fontSize: "20px", cursor: "pointer", padding: "4px 8px" }}>←</button>
        <div>
          <div style={{ fontWeight: 700, fontSize: "18px", color: "#c084fc" }}>Report Content</div>
          <div style={{ fontSize: "12px", color: "#64748b" }}>Step {step} of 3 · Help us keep OurSpace safe</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: "3px", background: "rgba(139,92,246,0.2)" }}>
        <div style={{ height: "100%", width: `${(step / 3) * 100}%`, background: "linear-gradient(90deg, #7c3aed, #a855f7)", transition: "width 0.3s" }} />
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "28px 24px" }}>

        {/* Step 1: Category */}
        {step === 1 && (
          <div>
            <h2 style={{ color: "#f0f0f0", fontSize: "20px", marginBottom: "8px" }}>What are you reporting?</h2>
            <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px" }}>Select the category that best describes the issue.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setCategory(cat.id); setStep(2); }}
                  style={{
                    background: category === cat.id ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${category === cat.id ? "rgba(139,92,246,0.6)" : "rgba(255,255,255,0.1)"}`,
                    borderRadius: "12px",
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s"
                  }}
                >
                  <span style={{ fontSize: "22px" }}>{cat.emoji}</span>
                  <div>
                    <div style={{ color: "#f0f0f0", fontWeight: 600, fontSize: "14px", marginBottom: "2px" }}>{cat.label}</div>
                    <div style={{ color: "#64748b", fontSize: "12px" }}>{cat.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Reason details */}
        {step === 2 && (
          <div>
            <h2 style={{ color: "#f0f0f0", fontSize: "20px", marginBottom: "8px" }}>Tell us more</h2>
            <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px" }}>
              Selected: <strong style={{ color: "#c084fc" }}>{categories.find(c => c.id === category)?.label}</strong>
            </p>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", color: "#94a3b8", fontSize: "14px", marginBottom: "8px", fontWeight: 600 }}>
                What specifically happened?
              </label>
              <textarea
                value={details}
                onChange={e => setDetails(e.target.value)}
                placeholder="Describe the content or behavior you're reporting... (optional but helpful)"
                style={{
                  width: "100%",
                  minHeight: "120px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(139,92,246,0.3)",
                  borderRadius: "12px",
                  padding: "14px",
                  color: "#f0f0f0",
                  fontSize: "14px",
                  resize: "vertical",
                  outline: "none",
                  boxSizing: "border-box",
                  fontFamily: "inherit"
                }}
              />
            </div>

            <button
              onClick={() => setStep(3)}
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                border: "none",
                color: "white",
                padding: "14px",
                borderRadius: "12px",
                fontSize: "15px",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && (
          <div>
            <h2 style={{ color: "#f0f0f0", fontSize: "20px", marginBottom: "8px" }}>Confirm your report</h2>
            <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px" }}>
              Review your report before submitting. Our team will review it within 24–48 hours.
            </p>

            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", padding: "18px", marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <span style={{ color: "#64748b", fontSize: "13px" }}>Category</span>
                <span style={{ color: "#c084fc", fontSize: "13px", fontWeight: 600 }}>
                  {categories.find(c => c.id === category)?.emoji} {categories.find(c => c.id === category)?.label}
                </span>
              </div>
              {details && (
                <div>
                  <div style={{ color: "#64748b", fontSize: "13px", marginBottom: "6px" }}>Details</div>
                  <div style={{ color: "#94a3b8", fontSize: "13px", lineHeight: "1.6" }}>{details}</div>
                </div>
              )}
            </div>

            <div style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: "12px", padding: "14px", marginBottom: "20px", fontSize: "13px", color: "#4ade80" }}>
              🔒 Your report is confidential. The reported user will not know who submitted it.
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: "100%",
                background: loading ? "rgba(139,92,246,0.5)" : "linear-gradient(135deg, #7c3aed, #a855f7)",
                border: "none",
                color: "white",
                padding: "14px",
                borderRadius: "12px",
                fontSize: "15px",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                marginBottom: "12px"
              }}
            >
              {loading ? "Submitting..." : "Submit Report"}
            </button>

            <button
              onClick={() => window.history.back()}
              style={{ width: "100%", background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "#64748b", padding: "12px", borderRadius: "12px", fontSize: "14px", cursor: "pointer" }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
