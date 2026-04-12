import { useNavigate } from "react-router-dom";

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  const EFFECTIVE = "April 12, 2026";
  const COMPANY = "OurSpace 2.0";
  const PRIVACY_EMAIL = "privacy@ourspace.app";
  const LEGAL_EMAIL = "legal@ourspace.app";

  const sections = [
    ["1. Information We Collect", `We collect:
• Account data: email address, display name, date of birth (age verification only), and profile content you choose to share.
• User-generated content: posts, comments, stories, wall posts, and reactions.
• Communications: encrypted message metadata (sender, receiver, timestamp). We cannot read E2EE message content.
• Usage data: pages visited, features used, interaction timestamps, and session duration.
• Device & technical data: IP address, browser/app version, operating system, and device type.
• Parental consent data (for users under 18): parent/guardian email address.

We do NOT collect: Social Security Numbers, payment card data, precise location, biometric data, or any data from children under 13.`],
    ["2. How We Use Your Information", `We use your data to:
• Create and manage your account.
• Operate and improve the Service.
• Display your content to other users per your privacy settings.
• Send notifications you have opted into.
• Enforce our Community Guidelines and detect abuse.
• Comply with legal obligations.
• Respond to support and data rights requests.

We do NOT: sell your data, use it for targeted advertising, use it to train AI models, or share it with data brokers.`],
    ["3. Chronological Feed — No Algorithmic Profiling", `OurSpace 2.0 does not build behavioral profiles for feed manipulation. Your feed is strictly chronological. We do not analyze your content consumption to influence what you see next, and we do not sell behavioral data to advertisers.`],
    ["4. Data Sharing", `We may share data with:
• Service providers (hosting, analytics, security) under strict confidentiality agreements.
• Law enforcement when required by valid legal process. We will notify you unless prohibited by law.
• Safety organizations in cases of imminent harm to a person.

We will NEVER sell or rent your personal data to third parties.`],
    ["5. End-to-End Encrypted Messaging (The Shield)", `Messages you send via The Shield use End-to-End Encryption (E2EE):
• Messages are encrypted on your device before transmission.
• We store only the encrypted ciphertext — we cannot read the content.
• Only the intended recipient can decrypt messages.
• Metadata (sender, receiver, timestamp) is stored for delivery purposes only.
• You are responsible for the security of your own device and credentials.`],
    ["6. Children's Privacy (COPPA Compliance)", `OurSpace 2.0 is not directed to children under 13. We do not knowingly collect personal information from children under 13.

Users aged 13–17 require verifiable parental or guardian consent to create an account. We collect the parent/guardian's email address solely for consent purposes.

If you believe a child under 13 has registered, contact ${PRIVACY_EMAIL} immediately. We will promptly verify and delete the account and all associated data.`],
    ["7. GDPR Rights (EU/EEA Users)", `If you are located in the EU or EEA, you have the following rights under GDPR:
• Right to Access — request a copy of your personal data.
• Right to Rectification — correct inaccurate data.
• Right to Erasure ("Right to be Forgotten") — request deletion of your data.
• Right to Restriction — limit how we use your data.
• Right to Data Portability — receive your data in a structured format.
• Right to Object — object to processing based on legitimate interest.
• Right to Lodge a Complaint — with your national supervisory authority.

Submit GDPR requests to: ${PRIVACY_EMAIL}. We respond within 30 days.`],
    ["8. CCPA Rights (California Residents)", `California residents have the following rights under the CCPA:
• Right to Know — what personal information we collect and why.
• Right to Delete — request deletion of your personal information.
• Right to Opt-Out of Sale — we do not sell personal information.
• Right to Non-Discrimination — we will not discriminate against you for exercising these rights.

To submit a CCPA request: ${PRIVACY_EMAIL}.`],
    ["9. Data Retention", `We retain your data for as long as your account is active. After account deletion:
• Profile and content data is permanently deleted within 30 days.
• E2EE message content is deleted immediately upon account closure.
• Log data is retained for up to 90 days for security purposes.
• We may retain data longer if required by applicable law.`],
    ["10. Security", `We protect your data using:
• TLS 1.3 encryption for all data in transit.
• AES-256 encryption for sensitive data at rest.
• E2EE for private messages.
• Regular security audits and vulnerability testing.
• Access controls limiting employee access to user data.

No system is 100% secure. Report security vulnerabilities to: security@ourspace.app.`],
    ["11. Cookies & Local Storage", `We use essential browser storage (cookies and localStorage) for:
• Authentication and session management.
• Your preferences (theme, filter settings, notification settings).

We do NOT use advertising cookies, third-party tracking cookies, or any cross-site tracking.`],
    ["12. Third-Party Services", `We use Google Analytics (anonymized) to understand aggregate usage patterns. No personally identifiable data is shared with Google Analytics. You can opt out via browser settings or the Google Analytics Opt-out Browser Add-on.`],
    ["13. International Data Transfers", `Your data may be processed in the United States. If you are in the EU/EEA, transfers are made under Standard Contractual Clauses as approved by the European Commission.`],
    ["14. Changes to This Policy", `We will notify users of material changes via in-app notification and email at least 30 days before they take effect. The "Effective" date at the top of this page reflects the most recent update. Continued use of the Service after changes constitutes acceptance.`],
    ["15. Contact & Data Requests", `Privacy Officer: ${PRIVACY_EMAIL}\nLegal inquiries: ${LEGAL_EMAIL}\n\nWe respond to all privacy requests within 30 days.`],
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d1a", color: "#f0f0f0", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg,#0f0f2e,#1a0533)", padding: "48px 24px 36px", textAlign: "center", borderBottom: "1px solid #1e1e3a" }}>
        <button onClick={() => navigate(-1)} style={{ display: "block", margin: "0 0 24px", background: "none", border: "none", color: "#94a3b8", fontSize: 14, cursor: "pointer", textAlign: "left", width: "auto" }}>← Back</button>
        <div style={{ fontSize: 52, marginBottom: 16 }}>🛡️</div>
        <h1 style={{ fontSize: 30, fontWeight: 900, margin: "0 0 8px", background: "linear-gradient(90deg,#c084fc,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Privacy Policy
        </h1>
        <p style={{ color: "#64748b", fontSize: 13, margin: "0 0 20px" }}>Effective: {EFFECTIVE} · {COMPANY}</p>
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 8 }}>
          {["✅ GDPR Compliant","✅ CCPA Compliant","✅ COPPA Compliant","🔒 No Data Selling","📵 No Ad Tracking"].map(t => (
            <span key={t} style={{ background: "#1e1e3a", border: "1px solid #2a2a45", borderRadius: 20, padding: "5px 12px", fontSize: 12, color: "#94a3b8" }}>{t}</span>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 16px 60px" }}>
        {sections.map(([title, body]) => (
          <div key={title} style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#22d3ee", marginBottom: 10, borderBottom: "1px solid #1e1e3a", paddingBottom: 8 }}>{title}</h2>
            <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.8, margin: 0, whiteSpace: "pre-line" }}>{body}</p>
          </div>
        ))}

        <div style={{ marginTop: 40, padding: "20px 24px", background: "#13132b", borderRadius: 16, border: "1px solid #2a2a45", textAlign: "center" }}>
          <p style={{ color: "#64748b", fontSize: 13, margin: "0 0 8px" }}>Questions about your privacy?</p>
          <a href={`mailto:${PRIVACY_EMAIL}`} style={{ color: "#c084fc", fontWeight: 700, fontSize: 15, textDecoration: "none" }}>{PRIVACY_EMAIL}</a>
          <p style={{ color: "#475569", fontSize: 12, marginTop: 16, marginBottom: 0 }}>
            © {new Date().getFullYear()} {COMPANY}. All rights reserved.{" "}
            <span style={{ color: "#c084fc", cursor: "pointer" }} onClick={() => navigate("/TermsOfService")}>Terms of Service</span>
            {" · "}
            <span style={{ color: "#22d3ee", cursor: "pointer" }} onClick={() => navigate("/OurSpacePrivacyPolicy")}>Content Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}
