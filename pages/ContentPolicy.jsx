import { useNavigate } from "react-router-dom";

export default function ContentPolicy() {
  const navigate = useNavigate();
  const EFFECTIVE = "April 2026";
  const SAFETY_EMAIL = "ddortese@gmail.com";
  const APPEALS_EMAIL = "ddortese@gmail.com";

  const tiers = [
    {
      level: "ZERO TOLERANCE — Immediate Permanent Ban + Law Enforcement Report",
      color: "#ef4444",
      border: "#ef444440",
      items: [
        "Child Sexual Abuse Material (CSAM) — reported to NCMEC CyberTipline immediately",
        "Content that facilitates or promotes terrorism or mass violence",
        "Doxxing combined with direct threats of violence against a specific person",
        "Non-consensual intimate imagery (revenge porn)",
      ]
    },
    {
      level: "SEVERE — Immediate Suspension, Review, Possible Permanent Ban",
      color: "#f97316",
      border: "#f9731640",
      items: [
        "Coordinated harassment campaigns targeting an individual",
        "Sharing personal information of others without consent (doxxing)",
        "Sexual content involving minors in any form",
        "Impersonating another person with intent to deceive or harm",
        "Threats of physical violence against identifiable individuals",
        "Promoting or facilitating human trafficking or exploitation",
      ]
    },
    {
      level: "HIGH — Content Removal + Warning or Suspension",
      color: "#facc15",
      border: "#facc1540",
      items: [
        "Hate speech targeting protected characteristics (race, religion, gender, sexual orientation, disability, national origin, ethnicity)",
        "Glorification of self-harm, eating disorders, or suicide",
        "Graphic violence presented approvingly or to intimidate",
        "Spam, phishing, or fraudulent schemes",
        "AI content deliberately mislabeled as human-created",
        "Harassment, bullying, or sustained targeting of individuals",
      ]
    },
    {
      level: "MODERATE — Content Removal + Warning",
      color: "#94a3b8",
      border: "#94a3b840",
      items: [
        "Misinformation on topics of public safety presented as fact",
        "Content promoting or selling illegal products or services",
        "Excessive nudity or sexually suggestive content",
        "Unauthorized commercial advertising or multi-level marketing spam",
        "Copyright-infringing content after a valid DMCA notice",
        "Repeated posting of low-quality spam or duplicate content",
      ]
    },
  ];

  const enforcement = [
    { action: "Warning", desc: "First violation of moderate rules. No content impact." },
    { action: "Content Removal", desc: "Violating content is deleted. Account remains active." },
    { action: "Temporary Suspension", desc: "1–30 days. Repeated or severe violations." },
    { action: "Permanent Ban", desc: "Severe or repeat violations. Account deleted." },
    { action: "Law Enforcement Report", desc: "CSAM, terrorism, and imminent threats to life." },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d1a", color: "#f0f0f0", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg,#0f0f2e,#1a0533)", padding: "48px 24px 36px", textAlign: "center", borderBottom: "1px solid #1e1e3a" }}>
        <button onClick={() => navigate(-1)} style={{ display: "block", margin: "0 0 24px", background: "none", border: "none", color: "#94a3b8", fontSize: 14, cursor: "pointer" }}>← Back</button>
        <div style={{ fontSize: 52, marginBottom: 16 }}>🛡️</div>
        <h1 style={{ fontSize: 30, fontWeight: 900, margin: "0 0 8px", background: "linear-gradient(90deg,#c084fc,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Community Guidelines & Content Policy
        </h1>
        <p style={{ color: "#64748b", fontSize: 13, margin: "0 0 20px" }}>Effective: {EFFECTIVE} · OurSpace 2.0</p>
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 8 }}>
          {["🚫 Zero Tolerance CSAM","✅ NCMEC Reporting","⚖️ Tiered Enforcement","🔔 Appeals Process"].map(t => (
            <span key={t} style={{ background: "#1e1e3a", border: "1px solid #2a2a45", borderRadius: 20, padding: "5px 12px", fontSize: 12, color: "#94a3b8" }}>{t}</span>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 16px 60px" }}>

        {/* Intro */}
        <div style={{ background: "#13132b", borderRadius: 16, border: "1px solid #2a2a45", padding: "20px 24px", marginBottom: 32 }}>
          <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.8, margin: 0 }}>
            OurSpace 2.0 is built on the belief that online spaces can be both free and safe. These guidelines apply to all content posted, shared, or transmitted on our platform. Violations are handled according to a tiered enforcement system designed to be proportionate and fair.
          </p>
        </div>

        {/* Violation tiers */}
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: "#f0f0f0" }}>Prohibited Content</h2>
        {tiers.map((tier) => (
          <div key={tier.level} style={{ background: "#13132b", borderRadius: 16, border: `1px solid ${tier.border}`, padding: "20px 24px", marginBottom: 16 }}>
            <div style={{ color: tier.color, fontWeight: 700, fontSize: 13, marginBottom: 14, textTransform: "uppercase", letterSpacing: 0.5 }}>
              ⚠️ {tier.level}
            </div>
            <ul style={{ color: "#94a3b8", fontSize: 14, lineHeight: 2, paddingLeft: 20, margin: 0 }}>
              {tier.items.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
        ))}

        {/* Enforcement */}
        <h2 style={{ fontSize: 18, fontWeight: 700, margin: "36px 0 16px", color: "#f0f0f0" }}>Enforcement Actions</h2>
        <div style={{ background: "#13132b", borderRadius: 16, border: "1px solid #2a2a45", overflow: "hidden", marginBottom: 32 }}>
          {enforcement.map((e, i) => (
            <div key={e.action} style={{ padding: "14px 20px", borderBottom: i < enforcement.length - 1 ? "1px solid #1e1e3a" : "none", display: "flex", alignItems: "flex-start", gap: 16 }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: "#c084fc", minWidth: 160 }}>{e.action}</span>
              <span style={{ color: "#94a3b8", fontSize: 14 }}>{e.desc}</span>
            </div>
          ))}
        </div>

        {/* AI Policy */}
        <div style={{ background: "#1e1a2e", borderRadius: 16, border: "1px solid #c084fc30", padding: "20px 24px", marginBottom: 24 }}>
          <h3 style={{ color: "#c084fc", fontSize: 15, fontWeight: 700, margin: "0 0 12px" }}>🤖 AI Transparency Policy</h3>
          <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.8, margin: 0 }}>
            OurSpace 2.0 requires that all AI-generated or AI-assisted content be clearly labeled using the "🤖 AI" tag. This includes images, text, audio, or video created in whole or in part by generative AI tools. Intentionally mislabeling AI content as human-created content is a violation subject to suspension or permanent ban. Our Human-Only Filter relies on this transparency to function accurately.
          </p>
        </div>

        {/* Child safety */}
        <div style={{ background: "#1a0f00", borderRadius: 16, border: "1px solid #ef444430", padding: "20px 24px", marginBottom: 24 }}>
          <h3 style={{ color: "#ef4444", fontSize: 15, fontWeight: 700, margin: "0 0 12px" }}>🚨 Child Safety (CSAM Zero Tolerance)</h3>
          <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.8, margin: 0 }}>
            Any content that sexually exploits minors is immediately removed, and the account is permanently banned without possibility of appeal. All CSAM is reported to the National Center for Missing & Exploited Children (NCMEC) CyberTipline at CyberTipline.org and to applicable law enforcement. OurSpace 2.0 uses hash-matching and user reporting to detect CSAM proactively. If you encounter this content, report it immediately to <strong>{SAFETY_EMAIL}</strong>.
          </p>
        </div>

        {/* Reporting & Appeals */}
        <div style={{ background: "#13132b", borderRadius: 16, border: "1px solid #2a2a45", padding: "20px 24px", marginBottom: 24 }}>
          <h3 style={{ color: "#22d3ee", fontSize: 15, fontWeight: 700, margin: "0 0 12px" }}>📣 Reporting & Appeals</h3>
          <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.8, margin: "0 0 12px" }}>
            <strong style={{ color: "#f0f0f0" }}>To report content:</strong> Use the 🚩 Report button on any post, profile, or message, or email <a href={`mailto:${SAFETY_EMAIL}`} style={{ color: "#22d3ee" }}>{SAFETY_EMAIL}</a>.
          </p>
          <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.8, margin: "0 0 12px" }}>
            <strong style={{ color: "#f0f0f0" }}>Review timeline:</strong> Reports are reviewed within 24 hours for high-severity content and 72 hours for standard reports.
          </p>
          <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.8, margin: 0 }}>
            <strong style={{ color: "#f0f0f0" }}>To appeal a decision:</strong> Email <a href={`mailto:${APPEALS_EMAIL}`} style={{ color: "#c084fc" }}>{APPEALS_EMAIL}</a> with "Appeal" in the subject line, your account email, the content in question, and your reasoning. We respond to all appeals within 7 business days.
          </p>
        </div>

        {/* Human-only filter */}
        <div style={{ background: "#0f2a1e", borderRadius: 16, border: "1px solid #4ade8030", padding: "20px 24px", marginBottom: 32 }}>
          <h3 style={{ color: "#4ade80", fontSize: 15, fontWeight: 700, margin: "0 0 12px" }}>✅ Human-Only Filter</h3>
          <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.8, margin: 0 }}>
            The Human-Only Filter allows users to view only content verified as human-created. This filter relies on creator self-disclosure and community reporting. Users who falsely label AI-generated content as human may be suspended or permanently banned.
          </p>
        </div>

        {/* DMCA */}
        <div style={{ background: "#13132b", borderRadius: 16, border: "1px solid #2a2a45", padding: "20px 24px", marginBottom: 32 }}>
          <h3 style={{ color: "#f59e0b", fontSize: 15, fontWeight: 700, margin: "0 0 12px" }}>⚖️ DMCA / Copyright</h3>
          <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.8, margin: 0 }}>
            To file a DMCA takedown notice, email <a href={`mailto:${SAFETY_EMAIL}`} style={{ color: "#f59e0b" }}>{SAFETY_EMAIL}</a> with: your contact information, identification of the copyrighted work, URL of the infringing material, good-faith belief statement, and your electronic signature. We respond to valid DMCA notices within 5 business days.
          </p>
        </div>

        <div style={{ textAlign: "center", color: "#475569", fontSize: 12, marginTop: 40 }}>
          <p>© {new Date().getFullYear()} OurSpace 2.0 · All rights reserved</p>
          <p>
            <span style={{ color: "#c084fc", cursor: "pointer" }} onClick={() => navigate("/PrivacyPolicy")}>Privacy Policy</span>
            {" · "}
            <span style={{ color: "#22d3ee", cursor: "pointer" }} onClick={() => navigate("/TermsOfService")}>Terms of Service</span>
          </p>
        </div>
      </div>
    </div>
  );
}
