export default function TermsOfService() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0d0d1a 0%, #1a0a2e 50%, #0d1a2e 100%)",
      color: "#e2e8f0",
      fontFamily: "'Segoe UI', sans-serif",
      padding: "0 0 60px 0"
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
          <div style={{ fontWeight: 700, fontSize: "18px", color: "#c084fc" }}>Terms of Service</div>
          <div style={{ fontSize: "12px", color: "#64748b" }}>OurSpace 2.0 · Last updated: April 2026</div>
        </div>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 24px" }}>

        <div style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: "16px", padding: "20px", marginBottom: "32px" }}>
          <p style={{ margin: 0, fontSize: "15px", lineHeight: "1.7", color: "#94a3b8" }}>
            Welcome to OurSpace 2.0. By creating an account or using our Service, you agree to be bound by these Terms of Service.
            Please read them carefully. If you do not agree, do not use OurSpace 2.0.
          </p>
        </div>

        {[
          {
            num: "1", title: "Acceptance of Terms",
            paras: ["By accessing or using OurSpace 2.0 (the 'Service'), you agree to these Terms of Service ('Terms') and our Privacy Policy. These Terms form a binding legal agreement between you and OurSpace 2.0. If you are using the Service on behalf of an organization, you represent that you have authority to bind that organization to these Terms."]
          },
          {
            num: "2", title: "Eligibility",
            paras: ["You must be at least 13 years old to use OurSpace 2.0. By creating an account, you confirm that you are at least 13 years of age. If you are under 18, you represent that your parent or legal guardian has reviewed and agrees to these Terms on your behalf. We reserve the right to terminate accounts that we believe are operated by users under 13."]
          },
          {
            num: "3", title: "Your Account",
            paras: [
              "You are responsible for maintaining the security of your account credentials and for all activities that occur under your account.",
              "You agree to provide accurate, complete, and current information when creating your account.",
              "You may not share your login credentials, transfer your account to another person, or create accounts using automated means.",
              "Notify us immediately at support@ourspace2app.com if you suspect unauthorized access to your account."
            ]
          },
          {
            num: "4", title: "User Content",
            subs: [
              { sub: "4.1 Your Content", text: "You retain ownership of content you post ('User Content'). By posting content, you grant OurSpace 2.0 a non-exclusive, worldwide, royalty-free license to use, display, reproduce, and distribute your content solely to provide and improve the Service." },
              { sub: "4.2 Content Standards", text: "You agree not to post content that: is illegal, harmful, threatening, abusive, harassing, defamatory, or obscene; infringes on any third party's intellectual property or privacy rights; contains malware, spam, or unauthorized advertising; impersonates any person or entity; constitutes hate speech targeting protected characteristics; exploits or harms minors in any way; or violates any applicable law or regulation." },
              { sub: "4.3 Content Moderation", text: "We reserve the right to remove any content that violates these Terms or our Community Guidelines, without prior notice. We are not obligated to monitor all content but may do so at our discretion." }
            ]
          },
          {
            num: "5", title: "Community Guidelines",
            paras: [
              "Be respectful. Harassment, bullying, and hate speech are not tolerated.",
              "Be authentic. Do not impersonate others or create fake accounts.",
              "Be safe. Do not share personal information about others without their consent.",
              "Be legal. Do not share content that violates copyright, privacy, or any laws.",
              "Violations may result in content removal, account suspension, or permanent termination."
            ]
          },
          {
            num: "6", title: "Intellectual Property",
            paras: ["OurSpace 2.0 and its original content, features, and functionality are owned by OurSpace 2.0 and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. You may not copy, modify, distribute, sell, or lease any part of our Service or included software, nor may you reverse engineer or attempt to extract the source code of that software."]
          },
          {
            num: "7", title: "Privacy",
            paras: ["Your use of the Service is governed by our Privacy Policy, which is incorporated into these Terms by reference. By using the Service, you consent to our collection and use of your information as described in the Privacy Policy."]
          },
          {
            num: "8", title: "Prohibited Uses",
            paras: ["You agree not to: use the Service for any unlawful purpose; attempt to gain unauthorized access to any portion of the Service or any systems connected to the Service; interfere with or disrupt the integrity or performance of the Service; use automated tools (bots, scrapers) to access the Service without our written permission; use the Service to send unsolicited communications (spam); collect or harvest user information without consent; or circumvent any content-filtering techniques or security measures."]
          },
          {
            num: "9", title: "Disclaimers",
            paras: ["THE SERVICE IS PROVIDED 'AS IS' AND 'AS AVAILABLE' WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS."]
          },
          {
            num: "10", title: "Limitation of Liability",
            paras: ["TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, OURSPACE 2.0 SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF OR INABILITY TO USE THE SERVICE. OUR TOTAL LIABILITY TO YOU FOR ANY CLAIMS ARISING FROM THESE TERMS OR THE SERVICE SHALL NOT EXCEED $100 USD."]
          },
          {
            num: "11", title: "Termination",
            paras: ["We reserve the right to suspend or terminate your account and access to the Service, with or without cause and with or without notice, for conduct that we believe violates these Terms, is harmful to other users, or is harmful to our business interests. Upon termination, your right to use the Service ceases immediately."]
          },
          {
            num: "12", title: "Governing Law",
            paras: ["These Terms shall be governed by and construed in accordance with the laws of the United States and the State of Delaware, without regard to its conflict of law provisions. Any dispute arising from these Terms shall be resolved through binding arbitration in accordance with the American Arbitration Association rules, except that either party may seek injunctive relief in a court of competent jurisdiction."]
          },
          {
            num: "13", title: "Changes to Terms",
            paras: ["We may modify these Terms at any time. We will provide notice of material changes by posting the updated Terms in the app and updating the 'Last updated' date. Your continued use of the Service after the effective date of any changes constitutes your acceptance of the new Terms."]
          },
          {
            num: "14", title: "Contact",
            contact: true,
            paras: ["If you have questions about these Terms, please contact us:"]
          }
        ].map(section => (
          <div key={section.num} style={{ marginBottom: "32px" }}>
            <h2 style={{ color: "#c084fc", fontSize: "18px", fontWeight: 700, marginBottom: "16px", borderBottom: "1px solid rgba(139,92,246,0.2)", paddingBottom: "8px" }}>
              {section.num}. {section.title}
            </h2>
            {section.subs ? section.subs.map((item, i) => (
              <div key={i} style={{ marginBottom: "14px" }}>
                <div style={{ color: "#a78bfa", fontWeight: 600, marginBottom: "6px", fontSize: "14px" }}>{item.sub}</div>
                <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.8", color: "#94a3b8" }}>{item.text}</p>
              </div>
            )) : section.paras.map((para, i) => (
              <p key={i} style={{ margin: "0 0 10px 0", fontSize: "14px", lineHeight: "1.8", color: "#94a3b8" }}>{para}</p>
            ))}
            {section.contact && (
              <div style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)", borderRadius: "12px", padding: "16px", marginTop: "12px" }}>
                <div style={{ fontSize: "14px", color: "#94a3b8", lineHeight: "2" }}>
                  <div>📧 <strong style={{ color: "#c084fc" }}>Email:</strong> legal@ourspace2app.com</div>
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
