import { useState } from "react";
import { useNavigate } from "react-router-dom";

const REASONS = [
  { value: "inappropriate", label: "Inappropriate Content", emoji: "⚠️" },
  { value: "bullying", label: "Bullying or Harassment", emoji: "🛡️" },
  { value: "spam", label: "Spam or Fake Account", emoji: "🚫" },
  { value: "csam", label: "Child Safety Concern", emoji: "🚨" },
  { value: "other", label: "Other", emoji: "📋" },
];

const CONTENT_TYPES = ["message", "profile", "story_reply", "glow_message"];

const FN_URL = "https://legacy-circle-ae3f9932.base44.app/functions";

export default function LCReportContent() {
  const navigate = useNavigate();
  const [reason, setReason] = useState("");
  const [contentType, setContentType] = useState("message");
  const [reportedUser, setReportedUser] = useState("");
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const reporterEmail = localStorage.getItem("lc_email") || "anonymous";
  const s = { fontFamily: "sans-serif" };

  async function submit() {
    if (!reason || !reportedUser) return;
    setLoading(true);
    try {
      await fetch(`${FN_URL}/lcReportContent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reporter_email: reporterEmail, reported_user_email: reportedUser, content_type: contentType, reason, details }),
      });
    } catch (e) { /* non-fatal */ }
    setSubmitted(true);
    setLoading(false);
  }

  return (
    <div style={{ ...s, minHeight: "100vh", background: "#0a0a1a", color: "#fff" }}>
      <div style={{ background: "#16162a", padding: "20px 20px 16px", borderBottom: "1px solid #2d2d4e" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#a78bfa", fontSize: 20, cursor: "pointer" }}>←</button>
          <div style={{ fontSize: 18, fontWeight: 800 }}>🚩 Report Content</div>
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 16px" }}>
        {submitted ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 64 }}>✅</div>
            <div style={{ fontSize: 20, fontWeight: 800, marginTop: 16 }}>Report Submitted</div>
            <div style={{ color: "#94a3b8", marginTop: 10, lineHeight: 1.6 }}>
              Thank you for keeping The Legacy Circle safe. Our moderation team will review your report within 24 hours.
            </div>
            <div style={{ background: "#1a0a2e", borderRadius: 14, padding: "16px 20px", marginTop: 24, border: "1px solid #7c3aed40", textAlign: "left" }}>
              <div style={{ color: "#a78bfa", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>🔒 CSAM POLICY</div>
              <div style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.5 }}>
                If your report involves child sexual abuse material (CSAM), we immediately report to the National Center for Missing & Exploited Children (NCMEC) CyberTipline and cooperate with law enforcement.
              </div>
            </div>
            <button onClick={() => navigate("/LCHome")} style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", border: "none", borderRadius: 14, padding: "14px 32px", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", marginTop: 24 }}>
              Back to Home
            </button>
          </div>
        ) : (
          <>
            <div style={{ background: "#1a0a0a", borderRadius: 14, padding: "14px 16px", marginBottom: 24, border: "1px solid #7f1d1d40" }}>
              <div style={{ color: "#fca5a5", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>🚨 EMERGENCY</div>
              <div style={{ color: "#94a3b8", fontSize: 13 }}>
                If a child is in immediate danger, call <strong style={{ color: "#fff" }}>911</strong> or the NCMEC Hotline: <strong style={{ color: "#fff" }}>1-800-843-5678</strong>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ color: "#a78bfa", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 10 }}>CONTENT TYPE</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {CONTENT_TYPES.map(ct => (
                  <button key={ct} onClick={() => setContentType(ct)} style={{
                    background: contentType === ct ? "#2d1b69" : "#16162a",
                    border: `1px solid ${contentType === ct ? "#a855f7" : "#2d2d4e"}`,
                    borderRadius: 99, padding: "8px 14px", color: "#fff", fontSize: 13, cursor: "pointer",
                  }}>{ct.replace("_", " ")}</button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ color: "#a78bfa", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 10 }}>REASON *</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {REASONS.map(r => (
                  <button key={r.value} onClick={() => setReason(r.value)} style={{
                    background: reason === r.value ? "#1a0a2e" : "#16162a",
                    border: `1px solid ${reason === r.value ? "#a855f7" : "#2d2d4e"}`,
                    borderRadius: 12, padding: "14px 16px", color: "#fff", fontSize: 14, textAlign: "left", cursor: "pointer",
                    display: "flex", gap: 10, alignItems: "center",
                  }}>
                    <span>{r.emoji}</span> {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ color: "#a78bfa", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>REPORTED USER *</label>
              <input value={reportedUser} onChange={e => setReportedUser(e.target.value)} placeholder="Username or email of the person you're reporting" style={{ width: "100%", background: "#0d0d1a", border: "1px solid #2d2d4e", borderRadius: 12, padding: "14px 16px", color: "#fff", fontSize: 14, boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ color: "#a78bfa", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>ADDITIONAL DETAILS</label>
              <textarea value={details} onChange={e => setDetails(e.target.value)} rows={4} placeholder="Describe what happened..." style={{ width: "100%", background: "#0d0d1a", border: "1px solid #2d2d4e", borderRadius: 12, padding: "14px 16px", color: "#fff", fontSize: 14, boxSizing: "border-box", resize: "none" }} />
            </div>

            <button onClick={submit} disabled={!reason || !reportedUser || loading} style={{
              width: "100%", background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              border: "none", borderRadius: 14, padding: "16px", color: "#fff",
              fontSize: 15, fontWeight: 700, cursor: "pointer", opacity: (!reason || !reportedUser) ? 0.5 : 1,
            }}>
              {loading ? "Submitting..." : "Submit Report"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
