import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  const [humanFilter, setHumanFilter] = useState(false);
  const [notifLikes, setNotifLikes] = useState(true);
  const [notifComments, setNotifComments] = useState(true);
  const [notifFriends, setNotifFriends] = useState(true);
  const [notifWall, setNotifWall] = useState(true);
  const [privacy, setPrivacy] = useState("public");
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(()=>setSaved(false),2000);
  };

  const Toggle = ({ value, onChange }) => (
    <div onClick={()=>onChange(!value)} style={{ width:44,height:24,background:value?"#c084fc":"#2a2a45",borderRadius:12,position:"relative",cursor:"pointer",transition:"background 0.2s",flexShrink:0 }}>
      <div style={{ width:20,height:20,background:"#fff",borderRadius:"50%",position:"absolute",top:2,left:value?22:2,transition:"left 0.2s" }}/>
    </div>
  );

  const Row = ({ label, sub, value, onChange }) => (
    <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 0",borderBottom:"1px solid #2a2a4520" }}>
      <div>
        <div style={{ fontSize:15,fontWeight:600 }}>{label}</div>
        {sub&&<div style={{ fontSize:12,color:"#64748b",marginTop:2 }}>{sub}</div>}
      </div>
      <Toggle value={value} onChange={onChange} />
    </div>
  );

  return (
    <div style={{ minHeight:"100vh",background:"#0d0d1a",color:"#f0f0f0",fontFamily:"'Segoe UI',sans-serif",paddingBottom:40 }}>
      <div style={{ position:"sticky",top:0,zIndex:100,background:"#0d0d1aee",backdropFilter:"blur(12px)",borderBottom:"1px solid #2a2a45",padding:"14px 16px",display:"flex",alignItems:"center",gap:12 }}>
        <button onClick={()=>navigate(-1)} style={{ background:"none",border:"none",color:"#94a3b8",fontSize:20,cursor:"pointer" }}>←</button>
        <span style={{ fontWeight:900,fontSize:18 }}>⚙️ Settings</span>
      </div>

      <div style={{ maxWidth:600,margin:"0 auto",padding:"16px" }}>
        <div style={{ background:"#16162a",borderRadius:16,padding:"0 16px",marginBottom:20,border:"1px solid #2a2a45" }}>
          <div style={{ padding:"14px 0",borderBottom:"1px solid #2a2a4520",fontWeight:700,fontSize:12,color:"#c084fc",letterSpacing:1,textTransform:"uppercase" }}>Feed</div>
          <Row label="Human-Only Filter" sub="Show only human-verified content in feed" value={humanFilter} onChange={setHumanFilter} />
        </div>

        <div style={{ background:"#16162a",borderRadius:16,padding:"0 16px",marginBottom:20,border:"1px solid #2a2a45" }}>
          <div style={{ padding:"14px 0",borderBottom:"1px solid #2a2a4520",fontWeight:700,fontSize:12,color:"#c084fc",letterSpacing:1,textTransform:"uppercase" }}>Notifications</div>
          <Row label="Likes" value={notifLikes} onChange={setNotifLikes} />
          <Row label="Comments" value={notifComments} onChange={setNotifComments} />
          <Row label="Friend Requests" value={notifFriends} onChange={setNotifFriends} />
          <Row label="Wall Posts" value={notifWall} onChange={setNotifWall} />
        </div>

        <div style={{ background:"#16162a",borderRadius:16,padding:"0 16px",marginBottom:20,border:"1px solid #2a2a45" }}>
          <div style={{ padding:"14px 0",borderBottom:"1px solid #2a2a4520",fontWeight:700,fontSize:12,color:"#c084fc",letterSpacing:1,textTransform:"uppercase" }}>Privacy</div>
          <div style={{ padding:"14px 0",borderBottom:"1px solid #2a2a4520" }}>
            <div style={{ fontWeight:600,marginBottom:8 }}>Profile Visibility</div>
            {["public","friends","private"].map(v=>(
              <button key={v} onClick={()=>setPrivacy(v)} style={{ marginRight:8,padding:"6px 14px",background:privacy===v?"#2a1a3e":"transparent",border:`1px solid ${privacy===v?"#c084fc":"#2a2a45"}`,borderRadius:20,color:privacy===v?"#c084fc":"#94a3b8",fontSize:13,cursor:"pointer",textTransform:"capitalize" }}>{v}</button>
            ))}
          </div>
        </div>

        <div style={{ background:"#16162a",borderRadius:16,padding:"0 16px",marginBottom:20,border:"1px solid #2a2a45" }}>
          <div style={{ padding:"14px 0",borderBottom:"1px solid #2a2a4520",fontWeight:700,fontSize:12,color:"#c084fc",letterSpacing:1,textTransform:"uppercase" }}>Legal</div>
          <div onClick={()=>navigate("/PrivacyPolicy")} style={{ padding:"14px 0",borderBottom:"1px solid #2a2a4520",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
            <span>Privacy Policy</span><span style={{ color:"#64748b" }}>→</span>
          </div>
          <div onClick={()=>navigate("/TermsOfService")} style={{ padding:"14px 0",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
            <span>Terms of Service</span><span style={{ color:"#64748b" }}>→</span>
          </div>
        </div>

        <div style={{ background:"#16162a",borderRadius:16,padding:"0 16px",marginBottom:20,border:"1px solid #2a2a45" }}>
          <div style={{ padding:"14px 0",borderBottom:"1px solid #2a2a4520",fontWeight:700,fontSize:12,color:"#c084fc",letterSpacing:1,textTransform:"uppercase" }}>Account</div>
          <div style={{ padding:"14px 0",cursor:"pointer",color:"#f87171",fontWeight:600" }} onClick={()=>window.confirm("Are you sure you want to delete your account? This cannot be undone.")}>Delete Account</div>
        </div>

        <button onClick={save} style={{ width:"100%",padding:"14px",background:"linear-gradient(135deg,#c084fc,#22d3ee)",border:"none",borderRadius:12,color:"#000",fontWeight:700,fontSize:16,cursor:"pointer" }}>
          {saved?"✅ Saved!":"Save Settings"}
        </button>
      </div>
    </div>
  );
}
