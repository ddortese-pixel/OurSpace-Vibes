export default function ContentPolicy() {
  const rules = [
    {
      emoji: "🚫", title: "Zero Tolerance — Immediate Removal & Ban",
      color: "#ef4444",
      items: [
        "Child sexual abuse material (CSAM) or any content sexualizing minors",
        "Content promoting or facilitating terrorism, mass violence, or genocide",
        "Non-consensual intimate imagery (NCII / revenge porn)",
        "Doxxing — sharing someone's private personal information to cause harm",
        "Human trafficking or exploitation",
        "Sale or distribution of illegal weapons, drugs, or controlled substances"
      ]
    },
    {
      emoji: "⚠️", title: "Prohibited Content — Removal & Possible Suspension",
      color: "#f97316",
      items: [
        "Harassment, bullying, or targeted abuse of any individual or group",
        "Hate speech targeting race, ethnicity, religion, gender, sexual orientation, disability, or national origin",
        "Graphic violence, gore, or content designed to shock or disturb",
        "Spam, scams, phishing, or coordinated inauthentic behavior",
        "Impersonating real people, brands, or organizations",
        "Misinformation that could cause real-world harm",
        "Copyright or trademark infringement",
        "Content that violates any applicable laws or regulations"
      ]
    },
    {
      emoji: "🔞", title: "Age-Restricted Content",
      color: "#a78bfa",
      items: [
        "Sexually suggestive content is restricted to verified adult users",
        "Content depicting alcohol or drug use must not target minors",
        "Mature themes must be appropriately labeled",
        "Users under 18 will not see age-restricted content"
      ]
    },
    {
      emoji: "✅", title: "What's Always Welcome",
      color: "#4ade80",
      items: [
        "Authentic self-expression and creative content",
        "Constructive discussions and healthy debate",
        "Art, music, writing, photography, and other creative works",
        "Community support, encouragement, and positive interactions",
        "Educational content and sharing knowledge",
        "Humor and satire that does not punch down at marginalized groups"
      ]
    }
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0d0d1a 0%, #1a0a2e 50%, #0d1a2e 100%)",
      color: "#e2e8f0",
      fontFamily: "'Segoe UI', sans-serif",
      paddingBottom: "60px"
    }}>
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
        <button onClick={() => window.history.back()} style={{ background: "none", border: "none", color: "#a78bfa", fontSize: "20px", cursor: "pointer", padding: "4px 8px" }}>←</button>
        <div>
          <div style={{ fontWeight: 700, fontSize: "18px", color: "#c084fc" }}>Community Guidelines</div>
          <div style={{ fontSize: "12px", color: "#64748b" }}>OurSpace 2.0 · Content & Safety Policy</div>
        </div>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 24px" }}>

        <div style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: "16px", padding: "20px", marginBottom: "32px" }}>
          <h1 style={{ color: "#c084fc", margin: "0 0 12px", fontSize: "22px" }}>Our Community, Our Rules</h1>
          <p style={{ margin: 0, fontSize: "15px", lineHeight: "1.7", color: "#94a3b8" }}>
            OurSpace 2.0 is built for authentic connection and creative expression. To keep this space safe, welcoming,
            and positive for all 10,000+ members, everyone must follow these community guidelines. Violations are handled
            by our moderation team — appeals can be submitted to <strong style={{ color: "#c084fc" }}>appeals@ourspace2app.com</strong>.
          </p>
        </div>

        {rules.map((rule, idx) => (
          <div key={idx} style={{ marginBottom: "28px", background: "rgba(255,255,255,0.03)", border: `1px solid ${rule.color}30`, borderRadius: "16px", overflow: "hidden" }}>
            <div style={{ background: `${rule.color}15`, borderBottom: `1px solid ${rule.color}30`, padding: "16px 20px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "20px" }}>{rule.emoji}</span>
              <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: rule.color }}>{rule.title}</h2>
            </div>
            <div style={{ padding: "16px 20px" }}>
              {rule.items.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "8px 0", borderBottom: i < rule.items.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                  <span style={{ color: rule.color, marginTop: "2px", flexShrink: 0 }}>•</span>
                  <span style={{ fontSize: "14px", color: "#94a3b8", lineHeight: "1.6" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Enforcement */}
        <div style={{ marginBottom: "28px" }}>
          <h2 style={{ color: "#c084fc", fontSize: "18px", fontWeight: 700, marginBottom: "16px", borderBottom: "1px solid rgba(139,92,246,0.2)", paddingBottom: "8px" }}>Enforcement</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px" }}>
            {[
              { step: "1st violation", action: "Warning issued", color: "#facc15" },
              { step: "2nd violation", action: "Temporary suspension (7 days)", color: "#f97316" },
              { step: "3rd violation", action: "Permanent account ban", color: "#ef4444" },
              { step: "Zero tolerance", action: "Immediate permanent ban", color: "#7f1d1d" }
            ].map((e, i) => (
              <div key={i} style={{ background: `${e.color}10`, border: `1px solid ${e.color}30`, borderRadius: "12px", padding: "14px", textAlign: "center" }}>
                <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "6px" }}>{e.step}</div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: e.color }}>{e.action}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Reporting */}
        <div style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)", borderRadius: "16px", padding: "20px" }}>
          <h2 style={{ color: "#c084fc", margin: "0 0 12px", fontSize: "16px" }}>🚨 How to Report</h2>
          <p style={{ fontSize: "14px", color: "#94a3b8", margin: "0 0 12px", lineHeight: "1.7" }}>
            See something that violates our guidelines? Use the report button (⋯ menu on any post, comment, or profile)
            or contact our team directly:
          </p>
          <div style={{ fontSize: "14px", color: "#94a3b8", lineHeight: "2.2" }}>
            <div>📧 <strong style={{ color: "#c084fc" }}>Safety reports:</strong> safety@ourspace2app.com</div>
            <div>⚖️ <strong style={{ color: "#c084fc" }}>Appeals:</strong> appeals@ourspace2app.com</div>
            <div>🧒 <strong style={{ color: "#c084fc" }}>Child safety (NCMEC):</strong> cybertipline.org</div>
          </div>
        </div>

      </div>
    </div>
  );
}
