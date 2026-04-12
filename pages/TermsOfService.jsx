import { useNavigate } from "react-router-dom";

export default function TermsOfService() {
  const navigate = useNavigate();
  const EFFECTIVE = "April 12, 2026";
  const COMPANY = "OurSpace 2.0";
  const LEGAL_EMAIL = "ddortese@gmail.com";
  const DMCA_EMAIL = "ddortese@gmail.com";
  const SAFETY_EMAIL = "ddortese@gmail.com";

  const sections = [
    ["1. Acceptance of Terms", `By accessing or using ${COMPANY} ("the Service"), you agree to be bound by these Terms of Service ("Terms") and our Privacy Policy. If you do not agree, do not use the Service. These Terms constitute a legally binding agreement between you and ${COMPANY}.`],
    ["2. Eligibility & Age Requirements", `You must be at least 13 years of age to use ${COMPANY}.

• Under 13: You may not use this Service. If you are under 13, please visit The Legacy Circle, our platform designed for younger audiences.
• Ages 13–17: You may use the Service only with verifiable consent from a parent or legal guardian. A verification email is sent to the parent/guardian email provided during registration. The parent or guardian must confirm consent before the account is activated.
• 18 and older: You may use the Service independently.

By using the Service, you confirm that you meet these requirements. We reserve the right to terminate accounts where age requirements have been misrepresented.`],
    ["3. Account Registration & Security", `You agree to:
• Provide accurate, current, and complete registration information.
• Maintain the confidentiality of your login credentials.
• Be responsible for all activity that occurs under your account.
• Notify us immediately of any unauthorized access at ${LEGAL_EMAIL}.
• Not create accounts for others without their consent.
• Not create more than one account per person.`],
    ["4. Acceptable Use Policy", `You agree NOT to:
• Post content that is illegal, harmful, threatening, abusive, harassing, stalking, defamatory, or obscene.
• Post content that promotes or glorifies violence, self-harm, eating disorders, or suicide.
• Post hate speech targeting individuals or groups based on race, ethnicity, religion, gender, sexual orientation, disability, or national origin.
• Impersonate any person, entity, or organization.
• Post sexually explicit content involving minors (CSAM). Such content will be reported to the NCMEC and relevant law enforcement immediately.
• Distribute spam, phishing, or unauthorized commercial solicitations.
• Upload malware, viruses, or malicious code.
• Harvest, scrape, or collect other users' data without consent.
• Use automated bots, scrapers, or scripts without express written permission.
• Attempt to gain unauthorized access to our systems.
• Violate any applicable local, state, national, or international laws.`],
    ["5. Content Ownership & License", `You retain full ownership of content you create and post on the Service.

By posting content, you grant ${COMPANY} a non-exclusive, royalty-free, sublicensable, worldwide license to display, reproduce, distribute, and adapt your content solely for the purpose of operating and improving the Service. This license ends when you delete your content or account, except where your content has been shared by others.

You represent and warrant that:
• You own or have the necessary rights to the content you post.
• Your content does not violate any third-party rights.
• You have obtained all necessary consents for any identifiable individuals depicted in your content.`],
    ["6. AI-Generated Content Policy", `OurSpace 2.0 has a strict AI transparency requirement:
• Content generated in whole or in part by AI tools MUST be labeled as AI-generated.
• Intentionally misrepresenting AI content as human-created is a violation of these Terms.
• The Human-Only Filter relies on honest self-reporting and community flagging.
• Violations may result in account suspension or permanent ban.`],
    ["7. DMCA & Intellectual Property", `We respect intellectual property rights and comply with the Digital Millennium Copyright Act (DMCA).

To file a DMCA takedown notice, email ${DMCA_EMAIL} with:
1. Your contact information (name, address, phone, email).
2. Identification of the copyrighted work you claim is infringed.
3. URL or specific identification of the allegedly infringing material.
4. A statement that you have a good-faith belief the use is not authorized.
5. A statement that the information is accurate and, under penalty of perjury, that you are the copyright owner or authorized to act on their behalf.
6. Your physical or electronic signature.

We will respond to valid DMCA notices promptly. Counter-notices may be submitted per 17 U.S.C. § 512(g).`],
    ["8. Content Moderation", `We reserve the right to remove content and suspend or terminate accounts that violate these Terms, with or without notice. We employ:
• Automated detection systems for prohibited content.
• User-initiated content reports reviewed by our moderation team within 24 hours.
• Appeals process: email ${SAFETY_EMAIL} with "Appeal" in the subject line.

We are not obligated to pre-screen content but may do so at our discretion.`],
    ["9. Child Safety (CSAM Zero Tolerance)", `${COMPANY} has a zero-tolerance policy for Child Sexual Abuse Material (CSAM). Any account found to be distributing, sharing, or generating CSAM will be:
• Immediately and permanently banned.
• Reported to the National Center for Missing & Exploited Children (NCMEC) CyberTipline.
• Reported to applicable law enforcement agencies.

If you encounter suspected CSAM, report it immediately at ${SAFETY_EMAIL}.`],
    ["10. Privacy", `Our Privacy Policy governs how we collect, use, and share your information and is incorporated into these Terms by reference. By using the Service, you consent to our data practices as described in the Privacy Policy.`],
    ["11. Private Messaging", `Private messages on OurSpace 2.0 are visible only to the sender and recipient. Message content is stored securely and is not used for advertising or profiling. Using the messaging system to conduct illegal activity is a violation of these Terms and may be reported to law enforcement.`],
    ["12. Account Deletion & Data Erasure", `When you delete your account via Settings → Delete Account:
• All of your profile data is permanently deleted.
• All of your posts, comments, stories, and wall posts are permanently deleted.
• All of your private messages are permanently deleted.
• All of your friend connections and notifications are permanently deleted.
• Deletion is irreversible. We cannot recover deleted accounts or content.
This satisfies your right to erasure under GDPR and CCPA.`],
    ["13. Do Not Sell My Personal Information", `OurSpace 2.0 does not sell, rent, or trade your personal information to third parties for monetary or other valuable consideration. This applies to all users including California residents under CCPA.`],
    ["14. Third-Party Links & Services", `The Service may contain links to third-party websites or services. We do not control, endorse, or assume responsibility for any third-party content, privacy practices, or services. Your interactions with third parties are governed by their terms and policies.`],
    ["15. Disclaimers", `THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. We do not warrant that the Service will be uninterrupted, error-free, or secure. We are not responsible for user-generated content posted by third parties.`],
    ["16. Limitation of Liability", `TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, ${COMPANY.toUpperCase()} SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES. OUR TOTAL LIABILITY SHALL NOT EXCEED $100 OR THE AMOUNT YOU PAID US IN THE PAST 12 MONTHS, WHICHEVER IS GREATER.`],
    ["17. Indemnification", `You agree to indemnify, defend, and hold harmless ${COMPANY}, its officers, directors, employees, and agents from any claims, liabilities, damages, losses, or expenses arising out of or in connection with: your use of the Service, your content, or your violation of these Terms.`],
    ["18. Governing Law & Dispute Resolution", `These Terms are governed by the laws of the State of Indiana, United States, without regard to conflict of law provisions. Any disputes shall first be attempted to be resolved through good-faith negotiation. If unresolved, disputes shall be submitted to binding arbitration in Indiana under the AAA Commercial Arbitration Rules.`],
    ["19. Changes to Terms", `We may update these Terms at any time. We will notify users of material changes via in-app notification and email at least 30 days before they take effect. Continued use after changes constitutes acceptance.`],
    ["20. Termination", `We may suspend or terminate your account at any time for violations of these Terms. You may delete your account at any time via Settings. Upon termination, your license to use the Service ends immediately.`],
    ["21. Entire Agreement", `These Terms, together with our Privacy Policy and Content Policy, constitute the entire agreement between you and ${COMPANY} regarding the Service.`],
    ["22. Contact", `Legal questions, DMCA notices, and safety reports:\n${LEGAL_EMAIL}\n\nWe respond to all inquiries within 5 business days.`],
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d1a", color: "#f0f0f0", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg,#0f0f2e,#1a0533)", padding: "48px 24px 36px", textAlign: "center", borderBottom: "1px solid #1e1e3a" }}>
        <button onClick={() => navigate(-1)} style={{ display: "block", margin: "0 0 24px", background: "none", border: "none", color: "#94a3b8", fontSize: 14, cursor: "pointer" }}>← Back</button>
        <div style={{ fontSize: 52, marginBottom: 16 }}>📋</div>
        <h1 style={{ fontSize: 30, fontWeight: 900, margin: "0 0 8px", background: "linear-gradient(90deg,#c084fc,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Terms of Service
        </h1>
        <p style={{ color: "#64748b", fontSize: 13, margin: "0 0 20px" }}>Effective: {EFFECTIVE} · {COMPANY}</p>
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 8 }}>
          {["⚖️ Legally Binding","🚫 Zero Tolerance CSAM","🤖 AI Transparency Required","🔒 DMCA Compliant","🚫 No Data Selling"].map(t => (
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
          <p style={{ color: "#64748b", fontSize: 13, margin: "0 0 8px" }}>Legal questions?</p>
          <a href={`mailto:${LEGAL_EMAIL}`} style={{ color: "#c084fc", fontWeight: 700, fontSize: 15, textDecoration: "none" }}>{LEGAL_EMAIL}</a>
          <p style={{ color: "#475569", fontSize: 12, marginTop: 16, marginBottom: 0 }}>
            © {new Date().getFullYear()} {COMPANY}. All rights reserved.{" "}
            <span style={{ color: "#c084fc", cursor: "pointer" }} onClick={() => navigate("/PrivacyPolicy")}>Privacy Policy</span>
            {" · "}
            <span style={{ color: "#22d3ee", cursor: "pointer" }} onClick={() => navigate("/ContentPolicy")}>Content Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}
