import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FEATURES = [
  { icon: "📰", title: "The Underground Feed", desc: "Chronological only. Zero algorithm manipulation." },
  { icon: "🎨", title: "Your Digital Mirror", desc: "Fully customizable profile — themes, music, mood." },
  { icon: "🔒", title: "The Shield (E2EE)", desc: "End-to-end encrypted DMs. We can't read them." },
  { icon: "✅", title: "Human-Only Filter", desc: "Toggle to see only verified human-created content." },
  { icon: "📌", title: "The Guestbook Wall", desc: "Let friends leave messages on your profile." },
];

const VIBES = [
  { id: "purple-pink", label: "💜 Dark Purple", bg: "linear-gradient(135deg,#c084fc,#ec4899)" },
  { id: "blue-cyan",   label: "💙 Ocean Blue",  bg: "linear-gradient(135deg,#3b82f6,#22d3ee)" },
  { id: "orange-red",  label: "🔥 Sunset",       bg: "linear-gradient(135deg,#f97316,#ef4444)" },
  { id: "green-teal",  label: "💚 Forest",        bg: "linear-gradient(135deg,#22c55e,#14b8a6)" },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [age, setAge] = useState("");
  const [ageError, setAgeError] = useState("");
  const [needsParent, setNeedsParent] = useState(false);
  const [parentEmail, setParentEmail] = useState("");
  const [parentConsent, setParentConsent] = useState(false);
  const [vibe, setVibe] = useState("purple-pink");
  const navigate = useNavigate();

  const checkAge = () => {
    const n = parseInt(age);
    if (!age || isNaN(n) || n < 1 || n > 120) { setAgeError("Please enter a valid age."); return; }
    if (n < 13) { setAgeError("OurSpace 2.0 is for users 13+. Check out The Legacy Circle for younger users! 🌟"); return; }
    if (n < 18) { setNeedsParent(true); setAgeError(""); return; }
    setAgeError(""); setStep(1);
  };

  const checkParent = () => {
    if (!parentEmail.includes("@")) { setAgeError("Enter a valid parent/guardian email."); return; }
    if (!parentConsent) { setAgeError("Parent/guardian must agree to Terms of Service."); return; }
    setAgeError(""); setStep(1);
  };

  const finish = () => navigate("/Home");

  const S = { minHeight:"100vh",background:"#0d0d1a",color:"#f0f0f0",fontFamily:"'Segoe UI',sans-serif",display:"flex",flexDirection:"column",justifyContent:"center",padding:"32px 24px",maxWidth:480,margin:"0 auto" };
  const Btn = (props) => <button {...props} style={{ width:"100%",padding:"14px",background:"linear-gradient(135deg,#c084fc,#22d3ee)",border:"none",borderRadius:12,color:"#000",fontWeight:800,fontSize:16,cursor:"pointer",marginTop:16,...props.style }}>{props.children}</button>;
  const Input = (props) => <input {...props} style={{ width:"100%",padding:"14px 16px",background:"#16162a",border:"1px solid #2a2a45",borderRadius:12,color:"#f0f0f0",fontSize:16,outline:"none",boxSizing:"border-box",...props.style }} />;

  return (
    <div style={S}>
      {/* Progress */}
      {step>0&&(
        <div style={{ display:"flex",gap:8,justifyContent:"center",marginBottom:32 }}>
          {[1,2,3].map(i=><div key={i} style={{ width:i<=step?24:8,height:8,borderRadius:999,background:i<=step?"#c084fc":"#2a2a45",transition:"all 0.3s" }} />)}
        </div>
      )}

      {/* Step 0: Age */}
      {step===0&&(
        <div>
          <div style={{ textAlign:"center",marginBottom:32 }}>
            <div style={{ fontSize:64,marginBottom:16 }}>🌐</div>
            <h1 style={{ fontSize:28,fontWeight:900,margin:"0 0 8px",background:"linear-gradient(90deg,#c084fc,#22d3ee)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>OurSpace 2.0</h1>
            <p style={{ color:"#64748b",margin:0 }}>Your Space. Your Rules. No Algorithms.</p>
          </div>
          {!needsParent ? (
            <div>
              <label style={{ color:"#94a3b8",fontSize:14,display:"block",marginBottom:8 }}>Enter your age to get started</label>
              <Input type="number" value={age} onChange={e=>{setAge(e.target.value);setAgeError("");}} onKeyDown={e=>e.key==="Enter"&&checkAge()} placeholder="Your age" />
              {ageError&&<div style={{ marginTop:10,padding:12,background:"#2a1515",borderRadius:8,color:"#f87171",fontSize:13 }}>{ageError}</div>}
              <Btn onClick={checkAge}>Continue →</Btn>
              <div style={{ textAlign:"center",marginTop:14,fontSize:12,color:"#64748b" }}>
                By continuing you agree to our <span style={{ color:"#c084fc",cursor:"pointer" }} onClick={()=>navigate("/TermsOfService")}>Terms</span> and <span style={{ color:"#22d3ee",cursor:"pointer" }} onClick={()=>navigate("/PrivacyPolicy")}>Privacy Policy</span>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ padding:14,background:"#1e1a2e",borderRadius:12,border:"1px solid #c084fc30",marginBottom:18,color:"#c084fc",fontSize:14 }}>
                👋 Since you're under 18, we need parent/guardian approval.
              </div>
              <label style={{ color:"#94a3b8",fontSize:13,display:"block",marginBottom:6 }}>Parent/Guardian Email</label>
              <Input type="email" value={parentEmail} onChange={e=>{setParentEmail(e.target.value);setAgeError("");}} placeholder="parent@email.com" style={{ marginBottom:14 }} />
              <label style={{ display:"flex",alignItems:"flex-start",gap:10,cursor:"pointer",color:"#94a3b8",fontSize:13 }}>
                <input type="checkbox" checked={parentConsent} onChange={e=>setParentConsent(e.target.checked)} style={{ marginTop:2,accentColor:"#c084fc" }} />
                I am the parent/guardian and agree to the <span style={{ color:"#c084fc" }}>Terms of Service</span> and <span style={{ color:"#22d3ee" }}>Privacy Policy</span> on behalf of my child.
              </label>
              {ageError&&<div style={{ marginTop:10,padding:12,background:"#2a1515",borderRadius:8,color:"#f87171",fontSize:13 }}>{ageError}</div>}
              <Btn onClick={checkParent}>Approve & Continue →</Btn>
            </div>
          )}
        </div>
      )}

      {/* Step 1: Features */}
      {step===1&&(
        <div>
          <div style={{ textAlign:"center",marginBottom:24 }}>
            <div style={{ fontSize:48,marginBottom:12 }}>⚡</div>
            <h2 style={{ fontSize:22,fontWeight:900,margin:"0 0 6px" }}>What makes us different</h2>
            <p style={{ color:"#64748b",fontSize:14,margin:0 }}>A social network built for humans, not advertisers.</p>
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:10,marginBottom:24 }}>
            {FEATURES.map((f,i)=>(
              <div key={i} style={{ background:"#16162a",borderRadius:12,padding:"12px 16px",border:"1px solid #2a2a45",display:"flex",gap:14,alignItems:"flex-start" }}>
                <span style={{ fontSize:26 }}>{f.icon}</span>
                <div>
                  <div style={{ fontWeight:700,fontSize:14,marginBottom:2 }}>{f.title}</div>
                  <div style={{ color:"#64748b",fontSize:13 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <Btn onClick={()=>setStep(2)}>Pick Your Vibe →</Btn>
        </div>
      )}

      {/* Step 2: Theme */}
      {step===2&&(
        <div>
          <div style={{ textAlign:"center",marginBottom:24 }}>
            <div style={{ fontSize:48,marginBottom:12 }}>🎨</div>
            <h2 style={{ fontSize:22,fontWeight:900,margin:"0 0 6px" }}>Choose your theme</h2>
            <p style={{ color:"#64748b",fontSize:14,margin:0 }}>You can change this anytime in Settings.</p>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:24 }}>
            {VIBES.map(v=>(
              <button key={v.id} onClick={()=>setVibe(v.id)} style={{ padding:"20px 12px",background:vibe===v.id?"#2a1a3e":"#16162a",border:`2px solid ${vibe===v.id?"#c084fc":"#2a2a45"}`,borderRadius:14,cursor:"pointer",color:"#f0f0f0",fontWeight:vibe===v.id?700:500,fontSize:14,position:"relative" }}>
                <div style={{ width:"100%",height:6,borderRadius:3,background:v.bg,marginBottom:8 }}/>
                {v.label}
                {vibe===v.id&&<span style={{ position:"absolute",top:8,right:10,color:"#c084fc",fontSize:14 }}>✓</span>}
              </button>
            ))}
          </div>
          <Btn onClick={finish}>Enter OurSpace 🌐</Btn>
        </div>
      )}
    </div>
  );
}
