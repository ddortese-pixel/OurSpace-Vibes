import { useNavigate } from "react-router-dom";

export default function LCTermsOfService() {
  const navigate = useNavigate();
  const s = { fontFamily: "sans-serif", lineHeight: 1.7 };

  return (
    <div style={{ ...s, minHeight: "100vh", background: "#0a0a1a", color: "#e2e8f0", padding: "0 0 60px" }}>
      <div style={{ background: "#16162a", padding: "20px 20px 16px", borderBottom: "1px solid #2d2d4e", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#a78bfa", fontSize: 20, cursor: "pointer" }}>←</button>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>Terms of Service</div>
            <div style={{ fontSize: 12, color: "#64748b" }}>The Legacy Circle · Effective: April 2026</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 20px" }}>
        <div style={{ background: "#1a0a2e", borderRadius: 16, padding: "16px 20px", marginBottom: 28, border: "1px solid #7c3aed40" }}>
          <div style={{ color: "#a78bfa", fontWeight: 700, marginBottom: 6 }}>📚 Welcome to The Legacy Circle</div>
          <div style={{ color: "#94a3b8", fontSize: 14 }}>These Terms of Service govern your use of The Legacy Circle. By using our app, you agree to these terms. Parents and guardians agree on behalf of their children under 13.</div>
        </div>

        {[
          { title: "1. Age Requirements", content: `The Legacy Circle is designed for children ages 2–14.

• Children under 13 must have verifiable parental consent to create an account
• Parents or guardians are responsible for supervising their child's use of the app
• Users 13 and older may create accounts independently
• We reserve the right to terminate accounts that violate age requirements` },
          { title: "2. Acceptable Use", content: `You agree to use The Legacy Circle only for its intended educational purpose. You may not:

• Share personal information (address, phone number, school name) with other users
• Use the app to bully, harass, or harm other learners
• Attempt to access other users' accounts
• Upload or share inappropriate, violent, or sexual content
• Attempt to reverse-engineer or copy our stories or characters` },
          { title: "3. Glow Messages", content: `The Glow Message feature allows learners to send encouraging messages to each other.

• All messages must be positive and encouraging
• No personal contact information may be shared in Glows
• Bullying or inappropriate Glow Messages will result in immediate account suspension
• Parents/guardians of both parties will be notified if a Glow violates these terms` },
          { title: "4. Our Characters", content: `Justice, Lebron, Zara, and Eli are original characters created by The Legacy Circle. All story content, characters, illustrations, and educational materials are protected by copyright.

You may not reproduce, distribute, or create derivative works from our content without written permission.` },
          { title: "5. Account Termination", content: `We may suspend or terminate your account if you violate these Terms of Service.

• Parents may request account deletion at any time
• We will delete all data within 30 days of a deletion request
• Accounts that have been inactive for 12 months may be automatically deleted
• You may not create a new account after termination for cause` },
          { title: "6. Limitation of Liability", content: `The Legacy Circle is provided "as is." We are not liable for:

• Interruptions in service
• Data loss (though we work hard to prevent this)
• Actions of other users
• Content accessed through third-party links

Our total liability to any user shall not exceed $100.` },
          { title: "7. Contact", content: `For questions about these Terms:\n\n📧 ddortese@gmail.com\n🌐 https://legacy-circle.base44.app` },
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
