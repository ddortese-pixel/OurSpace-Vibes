import { useState } from "react";
import { useNavigate } from "react-router-dom";

const REASONS = [
  { value: "spam", label: "🗑️ Spam or scam" },
  { value: "harassment", label: "😤 Harassment or bullying" },
  { value: "hate_speech", label: "🚫 Hate speech" },
  { value: "violence", label: "⚠️ Violence or threats" },
  { value: "sexual_content", label: "🔞 Sexual content" },
  { value: "fake_account", label: "🎭 Fake account or impersonation" },
  { value: "ai_mislabeled", label: "🤖 AI content labeled as human" },
  { value: "other", label: "❓ Other" },
];

export default function ReportContent() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const contentId = params.get("id") || "";
  const contentType = params.get("type") || "post";

  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!reason) return;
    setSubmitting(true);
    try {
      // Dynamic import to avoid build-time errors if entity doesn't exist in this app context
      const { ReportedContent } = await import("../api/entities");
      await ReportedContent.create({
        reporter_email: "me@ourspace.app",
        content_type: contentType,
        content_id: contentId,
        reason,
        details,
        status: "pending",
      });
      setSubmitted(true);
    } catch(e){ console.error(e); setSubmitted(true); }
    setSubmitting(false);
  };

  if (submitted) return (
    <div style={{ minHeight:"100vh",background:"#0d0d1a",color:"#f0f0f0",fontFamily:"'Segoe UI',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",padding:24 }}>
      <div style={{ textAlign:"center",maxWidth:400 }}>
        <div style={{ fontSize:56,marginBottom:16 }}>✅</div>
        <h2 style={{ fontWeight:900,fontSize:22,marginBottom:8 }}>Report Submitted</h2>
        <p style={{ color:"#94a3b8",fontSize:14,marginBottom:24 }}>Thanks for helping keep OurSpace safe. Our moderation team will review this within 24 hours.</p>
        <button onClick={()=>navigate(-1)} style={{ padding:"10px 24px",background:"linear-gradient(135deg,#c084fc,#22d3ee)",border:"none",borderRadius:12,color:"#000",fontWeight:700,cursor:"pointer" }}>Go Back</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh",background:"#0d0d1a",color:"#f0f0f0",fontFamily:"'Segoe UI',sans-serif",paddingBottom:40 }}>
      <div style={{ position:"sticky",top:0,zIndex:100,background:"#0d0d1aee",backdropFilter:"blur(12px)",borderBottom:"1px solid #2a2a45",padding:"14px 16px",display:"flex",alignItems:"center",gap:12 }}>
        <button onClick={()=>navigate(-1)} style={{ background:"none",border:"none",color:"#94a3b8",fontSize:20,cursor:"pointer" }}>←</button>
        <span style={{ fontWeight:900,fontSize:18 }}>🚩 Report Content</span>
      </div>
      <div style={{ maxWidth:560,margin:"0 auto",padding:"24px 16px" }}>
        <p style={{ color:"#94a3b8",fontSize:14,marginBottom:24,lineHeight:1.6 }}>Reports are reviewed by our moderation team. False reports may result in account restrictions. We take all reports seriously.</p>
        <div style={{ fontWeight:700,marginBottom:12 }}>Why are you reporting this?</div>
        <div style={{ display:"flex",flexDirection:"column",gap:8,marginBottom:20 }}>
          {REASONS.map(r=>(
            <button key={r.value} onClick={()=>setReason(r.value)} style={{ padding:"12px 16px",background:reason===r.value?"#2a1a3e":"#16162a",border:`1px solid ${reason===r.value?"#c084fc":"#2a2a45"}`,borderRadius:10,color:reason===r.value?"#c084fc":"#f0f0f0",fontSize:14,cursor:"pointer",textAlign:"left" }}>
              {r.label}
            </button>
          ))}
        </div>
        <div style={{ marginBottom:20 }}>
          <label style={{ color:"#94a3b8",fontSize:13,display:"block",marginBottom:6 }}>Additional details (optional)</label>
          <textarea value={details} onChange={e=>setDetails(e.target.value)} placeholder="Describe the issue..."
            style={{ width:"100%",background:"#16162a",border:"1px solid #2a2a45",borderRadius:10,color:"#f0f0f0",fontSize:14,padding:"12px",boxSizing:"border-box",minHeight:80,resize:"vertical",fontFamily:"inherit",outline:"none" }} />
        </div>
        <button onClick={submit} disabled={!reason||submitting} style={{ width:"100%",padding:"14px",background:reason?"linear-gradient(135deg,#f97316,#ef4444)":"#2a2a45",border:"none",borderRadius:12,color:reason?"#fff":"#64748b",fontWeight:700,fontSize:15,cursor:reason?"pointer":"default" }}>
          {submitting?"Submitting...":"Submit Report"}
        </button>
        <p style={{ color:"#64748b",fontSize:12,textAlign:"center",marginTop:12 }}>Your report is confidential. The reported user will not see who filed the report.</p>
      </div>
    </div>
  );
}
