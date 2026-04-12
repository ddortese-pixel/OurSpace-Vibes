import { useNavigate } from "react-router-dom";

export default function LCPrivacyPolicy() {
  const navigate = useNavigate();
  const s = { fontFamily: "sans-serif", lineHeight: 1.7 };

  return (
    <div style={{ ...s, minHeight: "100vh", background: "#0a0a1a", color: "#e2e8f0", padding: "0 0 60px" }}>
      <div style={{ background: "#16162a", padding: "20px 20px 16px", borderBottom: "1px solid #2d2d4e", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#a78bfa", fontSize: 20, cursor: "pointer" }}>←</button>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>Privacy Policy</div>
            <div style={{ fontSize: 12, color: "#64748b" }}>The Legacy Circle · Effective: April 2026</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 20px" }}>
        <div style={{ background: "#1a0a2e", borderRadius: 16, padding: "16px 20px", marginBottom: 28, border: "1px solid #7c3aed40" }}>
          <div style={{ color: "#a78bfa", fontWeight: 700, marginBottom: 6 }}>🔒 Children's Privacy First</div>
          <div style={{ color: "#94a3b8", fontSize: 14 }}>The Legacy Circle is designed for children ages 2–14. We take children's privacy extremely seriously and comply with COPPA (Children's Online Privacy Protection Act), GDPR, and CCPA.</div>
        </div>

        {[
          {
            title: "1. Information We Collect",
            content: `We collect only the minimum information necessary to operate The Legacy Circle:

• Learner name (display name only — real name not required)
• Age group (not exact birthdate)
• Parent or guardian email address (required for learners under 13)
• Learning progress (stories completed, XP earned, quiz scores)
• Device type and browser (for app performance only)

We do NOT collect: full legal names, home addresses, phone numbers, photos of children, or location data.`
          },
          {
            title: "2. COPPA Compliance — Children Under 13",
            content: `For children under 13, we require verifiable parental consent before collecting any personal information.

• A parent or guardian email is required at registration
• We send a verification email to the parent with an approval link
• The account is restricted until the parent approves
• Parents can review, modify, or delete their child's data at any time by emailing ddortese@gmail.com
• We never share or sell children's personal data to any third party`
          },
          {
            title: "3. How We Use Information",
            content: `We use collected information only to:

• Personalize the learning experience (character selection, story progress)
• Track educational achievement (XP, badges, streak)
• Send parental consent verification emails
• Diagnose technical issues and improve the app
• Comply with legal obligations

We do NOT use children's data for advertising, profiling, or marketing purposes.`
          },
          {
            title: "4. Data Storage & Security",
            content: `• All data is stored on secure, encrypted servers in the United States
• We use industry-standard TLS encryption for all data in transit
• Access to learner data is strictly limited to authorized personnel
• We regularly audit our security practices
• Data is retained only as long as the account is active, then deleted upon request`
          },
          {
            title: "5. Parental Rights",
            content: `Parents and guardians have the right to:

• Review any personal information collected about their child
• Request correction of inaccurate information
• Request deletion of their child's account and all associated data
• Withdraw consent at any time
• Refuse further data collection while allowing continued use of non-personal features

To exercise these rights, contact us at: ddortese@gmail.com`
          },
          {
            title: "6. Glow Messages & Community Features",
            content: `The Legacy Circle includes a "Glow Message" feature where learners can send encouraging messages to each other.

• All Glow Messages are moderated
• We do not allow children to share personal contact information in Glows
• Messages containing inappropriate content are removed and the sender is reported to a parent/guardian
• CSAM (Child Sexual Abuse Material) is immediately reported to NCMEC and law enforcement`
          },
          {
            title: "7. Third-Party Services",
            content: `We use a limited number of third-party services:

• Google Analytics (G-HEWR0ZB5G8) — anonymized traffic data only; no personal child data is shared
• Base44 Platform — our hosting and backend provider; compliant with US data laws
• Gmail API — used only for sending parent verification emails

We do not use advertising networks, social media trackers, or any third-party analytics that collect personal data from children.`
          },
          {
            title: "8. Contact Us",
            content: `If you have questions about this Privacy Policy or wish to exercise your parental rights:

📧 Email: ddortese@gmail.com
🌐 Website: https://legacy-circle.base44.app

We will respond to all privacy requests within 5 business days.`
          },
        ].map((section, i) => (
          <div key={i} style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#a855f7", marginBottom: 10 }}>{section.title}</div>
            <div style={{ color: "#94a3b8", fontSize: 14, whiteSpace: "pre-line" }}>{section.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
