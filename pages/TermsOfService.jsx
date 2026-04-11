import { useNavigate } from "react-router-dom";

export default function TermsOfService() {
  const navigate = useNavigate();
  const EFFECTIVE = "April 11, 2026";
  const COMPANY = "OurSpace 2.0";
  const CONTACT = "legal@ourspace.app";

  return (
    <div style={{ minHeight:"100vh",background:"#0d0d1a",color:"#f0f0f0",fontFamily:"'Segoe UI',sans-serif",padding:"24px 20px",maxWidth:700,margin:"0 auto" }}>
      <button onClick={()=>navigate(-1)} style={{ background:"transparent",border:"none",color:"#94a3b8",fontSize:14,cursor:"pointer",marginBottom:20 }}>← Back</button>
      <h1 style={{ fontWeight:900,fontSize:26,marginBottom:4,background:"linear-gradient(90deg,#c084fc,#22d3ee)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>Terms of Service</h1>
      <p style={{ color:"#64748b",fontSize:13,marginBottom:28 }}>Effective: {EFFECTIVE} · {COMPANY}</p>

      {[
        ["1. Acceptance of Terms", `By accessing or using ${COMPANY}, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, do not use the Service. These terms constitute a legally binding agreement between you and ${COMPANY}.`],
        ["2. Eligibility", `You must be at least 13 years of age to use ${COMPANY}. Users between 13 and 17 require verified parental or guardian consent. By using the Service, you represent that you meet these requirements. We reserve the right to terminate accounts of users who misrepresent their age.`],
        ["3. User Accounts", `You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You must provide accurate, current, and complete information. Notify us immediately of any unauthorized access at ${CONTACT}.`],
        ["4. Acceptable Use", `You agree not to: post content that is illegal, harmful, threatening, abusive, harassing, defamatory, obscene, or violates others' rights; impersonate any person or entity; distribute spam or unauthorized advertising; upload malware or malicious code; harvest or collect user data without consent; violate any applicable laws or regulations.`],
        ["5. Content Ownership & License", `You retain ownership of content you post. By posting, you grant ${COMPANY} a non-exclusive, royalty-free, worldwide license to display, reproduce, and distribute your content solely for operating the Service. You represent that you own or have rights to the content you post. We do not claim ownership of your content.`],
        ["6. Copyright & DMCA", `We respect intellectual property rights. If you believe content infringes your copyright, send a DMCA notice to ${CONTACT} including: your contact information, identification of the copyrighted work, identification of the infringing material, a statement of good faith belief, and your signature. We will respond promptly to valid notices.`],
        ["7. Human-Only Filter & AI Labeling", `If you use AI tools to generate content, you must accurately label it as AI-generated. Misrepresenting AI content as human-created is a violation of these Terms and may result in account suspension. The Human-Only Filter relies on honest self-reporting and community reporting.`],
        ["8. Privacy", `Our Privacy Policy governs how we collect, use, and share your information. By using the Service, you consent to our privacy practices. We are committed to COPPA compliance for users under 13, GDPR compliance for EU residents, and CCPA compliance for California residents.`],
        ["9. End-to-End Encryption", `Messages marked as encrypted use end-to-end encryption. We cannot access the content of these messages. You are responsible for safeguarding your encryption keys and device security.`],
        ["10. Termination", `We reserve the right to suspend or terminate your account for violations of these Terms, without prior notice. You may delete your account at any time. Upon termination, your data will be handled per our Privacy Policy.`],
        ["11. Disclaimers", `The Service is provided "as is" without warranties of any kind. We do not guarantee uninterrupted, error-free service. We are not responsible for user-generated content. Use the Service at your own risk.`],
        ["12. Limitation of Liability", `To the maximum extent permitted by law, ${COMPANY} shall not be liable for indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.`],
        ["13. Governing Law", `These Terms are governed by the laws of the State of Delaware, United States, without regard to conflict of law provisions. Any disputes shall be resolved in the courts of Delaware.`],
        ["14. Changes to Terms", `We may update these Terms at any time. We will notify users of material changes via in-app notification or email. Continued use after changes constitutes acceptance of the new Terms.`],
        ["15. Contact", `For questions about these Terms, contact us at ${CONTACT}.`],
      ].map(([title, body]) => (
        <div key={title} style={{ marginBottom:24 }}>
          <h2 style={{ fontSize:15,fontWeight:700,color:"#c084fc",marginBottom:8 }}>{title}</h2>
          <p style={{ color:"#94a3b8",fontSize:14,lineHeight:1.7,margin:0 }}>{body}</p>
        </div>
      ))}

      <div style={{ marginTop:32,padding:16,background:"#16162a",borderRadius:12,border:"1px solid #2a2a45",fontSize:13,color:"#64748b",textAlign:"center" }}>
        © {new Date().getFullYear()} {COMPANY}. All rights reserved. · <span style={{ color:"#c084fc",cursor:"pointer" }} onClick={()=>navigate("/PrivacyPolicy")}>Privacy Policy</span>
      </div>
    </div>
  );
}
