import { useState } from "react";

const sections = [
  {
    title: "Overview",
    content: `OurSpace 2.0 is committed to protecting your privacy and giving you full control over your data. This Privacy Policy explains how we collect, use, and protect your information.\n\nWe comply with GDPR, CCPA, and applicable international privacy laws.`
  },
  {
    title: "Data We Collect",
    content: `• Email address and display name (upon registration)\n• Profile content you voluntarily share (photos, bio, posts, music links)\n• Usage data (login times, features used, content viewed)\n• Device information (OS, app version, device type)\n• IP address (for security and abuse prevention only)`
  },
  {
    title: "How We Use Your Data",
    content: `• To operate and improve the platform\n• To send notifications about activity on your profile\n• To enforce community guidelines and safety policies\n• To detect spam and coordinated inauthentic behavior\n\nWe NEVER sell your data. We NEVER use your data for targeted advertising.`
  },
  {
    title: "End-to-End Encryption (The Shield)",
    content: `Direct messages on OurSpace 2.0 are protected by End-to-End Encryption (E2EE). This means:\n• We cannot read your private messages\n• Messages are encrypted on your device before sending\n• Only the recipient can decrypt and read them\n\nYou are responsible for the content of your encrypted messages. Illegal use of E2EE messaging violates our Terms of Service.`
  },
  {
    title: "Human-Only Filter",
    content: `The Human-Only Filter helps you see content verified as created by real humans. AI-generated content must be labeled as such by creators. We use a combination of content fingerprinting and user reporting to enforce this policy.`
  },
  {
    title: "Data Sharing",
    content: `We do not sell or rent your personal data. We may share data with:\n• Service providers who help operate the platform (under strict confidentiality agreements)\n• Law enforcement if required by applicable law\n• Safety organizations in cases of imminent harm`
  },
  {
    title: "Your Rights",
    content: `You have the right to:\n• Access your personal data\n• Correct inaccurate data\n• Delete your account and all associated data\n• Export your data in a portable format\n• Opt out of any non-essential data processing\n\nTo exercise these rights: privacy@ourspace.app`
  },
  {
    title: "Data Retention",
    content: `We retain your data for as long as your account is active. Upon account deletion, all personal data is permanently removed within 30 days. Encrypted messages are deleted immediately upon account closure.`
  },
  {
    title: "Children's Privacy",
    content: `OurSpace 2.0 is rated 12+. We do not knowingly collect data from children under 12. If we discover an account belonging to a child under 12, it will be immediately suspended and data deleted.`
  },
  {
    title: "Changes to This Policy",
    content: `We may update this policy at any time. We will notify users of material changes via email and in-app notification. Continued use after changes constitutes acceptance.`
  },
  {
    title: "Contact Us",
    content: `Privacy questions or requests:\n📧 privacy@ourspace.app\n📧 ddortese@gmail.com`
  }
];

export default function OurSpacePrivacyPolicy() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d1a", color: "#f0f0f0", fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1a0533 0%, #0d1b4a 100%)", padding: "48px 24px 32px", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🛡️</div>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, background: "linear-gradient(90deg, #c084fc, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Privacy Policy
        </h1>
        <p style={{ color: "#94a3b8", marginTop: 8, fontSize: 14 }}>
          OurSpace 2.0 · Effective April 11, 2026
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
          <span style={{ background: "#1e293b", borderRadius: 20, padding: "6px 14px", fontSize: 12, color: "#4ade80" }}>✅ No Data Selling</span>
          <span style={{ background: "#1e293b", borderRadius: 20, padding: "6px 14px", fontSize: 12, color: "#22d3ee" }}>🔒 E2EE Messaging</span>
          <span style={{ background: "#1e293b", borderRadius: 20, padding: "6px 14px", fontSize: 12, color: "#c084fc" }}>🚫 No Targeted Ads</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 16px" }}>
        {sections.map((section, i) => (
          <div
            key={i}
            style={{
              marginBottom: 12,
              background: "#16162a",
              borderRadius: 12,
              border: "1px solid #2a2a45",
              overflow: "hidden"
            }}
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              style={{
                width: "100%",
                background: "none",
                border: "none",
                color: "#f0f0f0",
                padding: "16px 20px",
                textAlign: "left",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: 16,
                fontWeight: 600
              }}
            >
              <span>{section.title}</span>
              <span style={{ color: "#c084fc", fontSize: 20, transition: "transform 0.2s", transform: openIndex === i ? "rotate(180deg)" : "rotate(0deg)" }}>
                ⌄
              </span>
            </button>
            {openIndex === i && (
              <div style={{ padding: "0 20px 20px", color: "#cbd5e1", fontSize: 14, lineHeight: 1.8, whiteSpace: "pre-line" }}>
                {section.content}
              </div>
            )}
          </div>
        ))}

        {/* Terms of Service Summary */}
        <div style={{ marginTop: 24, padding: 24, background: "#16162a", borderRadius: 12, border: "1px solid #2a2a45" }}>
          <h3 style={{ color: "#c084fc", margin: "0 0 12px" }}>📋 Terms of Service Highlights</h3>
          <ul style={{ color: "#cbd5e1", fontSize: 14, lineHeight: 2, paddingLeft: 20 }}>
            <li>You must be 12+ to use OurSpace 2.0</li>
            <li>You own your content — we just display it</li>
            <li>AI-generated content must be labeled as such</li>
            <li>No hate speech, harassment, or illegal content</li>
            <li>Violations may result in suspension or ban</li>
            <li>Full ToS: <a href="mailto:legal@ourspace.app" style={{ color: "#22d3ee" }}>legal@ourspace.app</a></li>
          </ul>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 24, padding: 24, background: "#16162a", borderRadius: 12, border: "1px solid #2a2a45" }}>
          <p style={{ color: "#94a3b8", fontSize: 13, margin: 0 }}>Privacy questions?</p>
          <a href="mailto:privacy@ourspace.app" style={{ color: "#c084fc", fontSize: 14, fontWeight: 600, textDecoration: "none", display: "block", marginTop: 8 }}>
            privacy@ourspace.app
          </a>
          <p style={{ color: "#475569", fontSize: 12, marginTop: 16 }}>© 2026 OurSpace 2.0. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
