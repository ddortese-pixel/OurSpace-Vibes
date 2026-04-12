export default function PrivacyPolicy() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0d0d1a 0%, #1a0a2e 50%, #0d1a2e 100%)",
      color: "#e2e8f0",
      fontFamily: "'Segoe UI', sans-serif",
      padding: "0 0 60px 0"
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
        <button
          onClick={() => window.history.back()}
          style={{ background: "none", border: "none", color: "#a78bfa", fontSize: "20px", cursor: "pointer", padding: "4px 8px" }}
        >←</button>
        <div>
          <div style={{ fontWeight: 700, fontSize: "18px", color: "#c084fc" }}>Privacy Policy</div>
          <div style={{ fontSize: "12px", color: "#64748b" }}>OurSpace 2.0 · Last updated: April 2026</div>
        </div>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 24px" }}>

        {/* Intro */}
        <div style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: "16px", padding: "20px", marginBottom: "32px" }}>
          <p style={{ margin: 0, fontSize: "15px", lineHeight: "1.7", color: "#94a3b8" }}>
            OurSpace 2.0 ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect,
            use, share, and protect your personal information when you use our social networking platform available at{" "}
            <strong style={{ color: "#c084fc" }}>our-space-vibes.base44.app</strong> and any associated mobile applications
            (collectively, the "Service").
          </p>
        </div>

        {[
          {
            num: "1",
            title: "Information We Collect",
            content: [
              { sub: "1.1 Information You Provide", text: "Account information (name, email address, password, date of birth), profile content (photos, bio, interests, display name), posts, comments, messages, stories, and other content you create or share, friend requests and connections, reports you submit about content or users, and preferences and settings you configure." },
              { sub: "1.2 Information Collected Automatically", text: "Device identifiers (device type, OS, browser), IP address and approximate location, pages visited, features used, time spent on the Service, referring URLs, crash reports and diagnostic data, and cookies and similar tracking technologies." },
              { sub: "1.3 Information From Third Parties", text: "If you sign in with Google or another third-party service, we receive your name, email address, and profile photo from that service. We do not receive your passwords from third-party services." }
            ]
          },
          {
            num: "2",
            title: "How We Use Your Information",
            content: [
              { text: "We use your information to: provide, maintain, and improve the Service; create and manage your account; enable social features (posts, messaging, friend connections, stories); personalize your experience; send you notifications you have requested; respond to your support requests; enforce our Terms of Service and Community Guidelines; comply with legal obligations; detect, prevent, and address fraud, abuse, and security issues; and conduct analytics to understand how the Service is used." }
            ]
          },
          {
            num: "3",
            title: "How We Share Your Information",
            content: [
              { sub: "3.1 With Other Users", text: "Content you post publicly (posts, profile, stories) is visible to other users according to your privacy settings. Messages are end-to-end encrypted and only visible to participants." },
              { sub: "3.2 Service Providers", text: "We share information with trusted third-party vendors who help us operate the Service (hosting, analytics, email delivery, payment processing). These vendors are contractually bound to protect your data." },
              { sub: "3.3 Legal Requirements", text: "We may disclose your information if required by law, subpoena, or other legal process, or if we believe disclosure is necessary to protect the rights, property, or safety of OurSpace 2.0, our users, or the public." },
              { sub: "3.4 Business Transfers", text: "If OurSpace 2.0 is involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction. We will notify you before your information becomes subject to a different privacy policy." },
              { sub: "3.5 We Do Not Sell Your Data", text: "We do not sell, rent, or trade your personal information to third parties for their marketing purposes." }
            ]
          },
          {
            num: "4",
            title: "Children's Privacy (COPPA)",
            content: [
              { text: "OurSpace 2.0 is intended for users who are 13 years of age or older. We do not knowingly collect personal information from children under 13. Our registration process requires users to confirm they are at least 13 years old. If we learn we have collected personal information from a child under 13 without parental consent, we will delete that information promptly. If you believe we may have information from or about a child under 13, please contact us at privacy@ourspace2app.com." }
            ]
          },
          {
            num: "5",
            title: "Your Privacy Rights",
            content: [
              { sub: "5.1 Access & Portability", text: "You may request a copy of the personal data we hold about you at any time." },
              { sub: "5.2 Correction", text: "You may update or correct your account information at any time through your Settings page." },
              { sub: "5.3 Deletion", text: "You may request deletion of your account and associated data by going to Settings → Account → Delete Account. We will process your request within 30 days." },
              { sub: "5.4 Opt-Out", text: "You may opt out of non-essential communications by adjusting your notification settings or by contacting us." },
              { sub: "5.5 GDPR Rights (EEA/UK Users)", text: "If you are located in the European Economic Area or UK, you have the right to access, rectify, erase, restrict processing, and object to processing of your personal data. You also have the right to lodge a complaint with your local data protection authority." },
              { sub: "5.6 CCPA Rights (California Users)", text: "California residents have the right to know what personal information we collect, the right to delete personal information, the right to opt-out of the sale of personal information (we do not sell personal information), and the right to non-discrimination for exercising these rights." }
            ]
          },
          {
            num: "6",
            title: "Data Security",
            content: [
              { text: "We implement industry-standard security measures including encrypted data transmission (TLS/SSL), encrypted storage of sensitive data, end-to-end encryption for private messages, regular security audits, and access controls limiting who can access your data. No method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security but we take reasonable steps to protect your information." }
            ]
          },
          {
            num: "7",
            title: "Data Retention",
            content: [
              { text: "We retain your personal information for as long as your account is active or as needed to provide you the Service. After account deletion, we typically delete or anonymize your data within 30 days, except where we are required to retain it for legal purposes, fraud prevention, or safety reasons. Aggregated, anonymized data may be retained indefinitely." }
            ]
          },
          {
            num: "8",
            title: "Cookies & Tracking Technologies",
            content: [
              { text: "We use cookies and similar technologies to keep you logged in, remember your preferences, analyze usage patterns, and improve the Service. You can control cookie settings through your browser. Disabling cookies may affect certain features of the Service. We do not use cookies for third-party advertising." }
            ]
          },
          {
            num: "9",
            title: "International Data Transfers",
            content: [
              { text: "OurSpace 2.0 is operated from the United States. If you access the Service from outside the United States, your information will be transferred to and processed in the United States. By using the Service, you consent to this transfer. We implement appropriate safeguards for international transfers in compliance with applicable law." }
            ]
          },
          {
            num: "10",
            title: "Changes to This Policy",
            content: [
              { text: "We may update this Privacy Policy from time to time. We will notify you of significant changes by posting a notice in the app, sending you an email, or both. Your continued use of the Service after changes take effect constitutes your acceptance of the updated policy. We encourage you to review this policy periodically." }
            ]
          },
          {
            num: "11",
            title: "Contact Us",
            content: [
              { text: "If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:" }
            ]
          }
        ].map(section => (
          <div key={section.num} style={{ marginBottom: "32px" }}>
            <h2 style={{ color: "#c084fc", fontSize: "18px", fontWeight: 700, marginBottom: "16px", borderBottom: "1px solid rgba(139,92,246,0.2)", paddingBottom: "8px" }}>
              {section.num}. {section.title}
            </h2>
            {section.content.map((item, i) => (
              <div key={i} style={{ marginBottom: "14px" }}>
                {item.sub && <div style={{ color: "#a78bfa", fontWeight: 600, marginBottom: "6px", fontSize: "14px" }}>{item.sub}</div>}
                <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.8", color: "#94a3b8" }}>{item.text}</p>
              </div>
            ))}
            {section.num === "11" && (
              <div style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)", borderRadius: "12px", padding: "16px", marginTop: "12px" }}>
                <div style={{ fontSize: "14px", color: "#94a3b8", lineHeight: "2" }}>
                  <div>📧 <strong style={{ color: "#c084fc" }}>Email:</strong> privacy@ourspace2app.com</div>
                  <div>🛡️ <strong style={{ color: "#c084fc" }}>Data Requests:</strong> privacy@ourspace2app.com</div>
                  <div>🌐 <strong style={{ color: "#c084fc" }}>Website:</strong> our-space-vibes.base44.app</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
