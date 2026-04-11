import { useState } from "react";

const sections = [
  {
    title: "Overview",
    content: `The Legacy Circle is committed to protecting the privacy of children and families who use our app. This Privacy Policy explains how we collect, use, and protect information when you use The Legacy Circle mobile and web application.\n\nWe comply with the Children's Online Privacy Protection Act (COPPA), the California Consumer Privacy Act (CCPA), and applicable international privacy laws.`
  },
  {
    title: "Who We Are",
    content: `The Legacy Circle is an AI-powered educational platform designed for children ages 2–14. Parents or legal guardians create and manage accounts on behalf of their children.`
  },
  {
    title: "Information We Collect",
    content: `From Parents / Guardians:\n• Email address (for account creation and notifications)\n• Payment information (processed securely via third-party providers — we never store card details)\n\nFrom Children (with parental consent):\n• Display name and age range\n• Learning progress, XP, badges, and story choices\n• Quiz and mission results\n• In-app messages (Glow Messages — moderated)\n• Device type and general usage data\n\nAutomatically Collected:\n• App usage analytics\n• Device type and operating system\n• Crash reports`
  },
  {
    title: "How We Use Information",
    content: `We use collected data to:\n• Personalize the learning experience for each child\n• Track progress and award achievements\n• Send parent notifications (level-ups, badges, streaks)\n• Improve app features and content\n• Ensure platform safety and prevent misuse\n\nWe never sell personal information. We never use children's data for targeted advertising.`
  },
  {
    title: "AI Interactions",
    content: `The Legacy Circle uses AI to power character conversations and story branching. All AI interactions are:\n• Filtered for age-appropriate content\n• Logged for safety monitoring\n• Never used to build advertising profiles`
  },
  {
    title: "Parental Rights (COPPA)",
    content: `Parents and guardians have the right to:\n• Review their child's personal information\n• Request deletion of their child's data\n• Refuse further data collection\n• Set screen time limits and notification preferences within the app\n\nTo exercise these rights, contact us at: privacy@thelegacycircle.com`
  },
  {
    title: "Data Sharing",
    content: `We do not sell or rent personal data. We may share data with:\n• Service providers who help operate the app (hosting, analytics) — bound by confidentiality agreements\n• Law enforcement if required by law`
  },
  {
    title: "Data Security",
    content: `We use industry-standard encryption and security practices to protect all user data. Access to personal information is restricted to authorized personnel only.`
  },
  {
    title: "Data Retention",
    content: `We retain data for as long as your account is active. Upon account deletion, all personal data is permanently removed within 30 days.`
  },
  {
    title: "Changes to This Policy",
    content: `We may update this policy from time to time. We will notify parents via email of any material changes.`
  },
  {
    title: "Contact Us",
    content: `For privacy questions or requests:\n📧 privacy@thelegacycircle.com\n🌐 thelegacycircle.com/privacy`
  }
];

export default function PrivacyPolicy() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f1a", color: "#f0f0f0", fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1a1a3e 0%, #2d1b69 100%)", padding: "48px 24px 32px", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🔒</div>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, background: "linear-gradient(90deg, #a78bfa, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Privacy Policy
        </h1>
        <p style={{ color: "#94a3b8", marginTop: 8, fontSize: 14 }}>
          The Legacy Circle · Effective April 10, 2026
        </p>
        <div style={{ display: "inline-block", background: "#1e293b", borderRadius: 20, padding: "6px 16px", marginTop: 12, fontSize: 13, color: "#4ade80" }}>
          ✅ COPPA Compliant · Child Safe · No Ads · No Data Selling
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 16px" }}>
        {sections.map((section, i) => (
          <div
            key={i}
            style={{
              marginBottom: 12,
              background: "#1e1e32",
              borderRadius: 12,
              border: "1px solid #2d2d50",
              overflow: "hidden",
              transition: "all 0.2s"
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
              <span style={{ color: "#a78bfa", fontSize: 20, transition: "transform 0.2s", transform: openIndex === i ? "rotate(180deg)" : "rotate(0deg)" }}>
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

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 40, padding: 24, background: "#1e1e32", borderRadius: 12, border: "1px solid #2d2d50" }}>
          <p style={{ color: "#94a3b8", fontSize: 13, margin: 0 }}>
            Questions about your privacy?
          </p>
          <a
            href="mailto:privacy@thelegacycircle.com"
            style={{ color: "#a78bfa", fontSize: 14, fontWeight: 600, textDecoration: "none", display: "block", marginTop: 8 }}
          >
            privacy@thelegacycircle.com
          </a>
          <p style={{ color: "#475569", fontSize: 12, marginTop: 16 }}>
            © 2026 The Legacy Circle. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
