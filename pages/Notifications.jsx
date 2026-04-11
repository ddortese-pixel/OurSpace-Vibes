import { useState, useEffect } from "react";
import { Notification } from "../api/entities";
import { useNavigate } from "react-router-dom";

const NAV = [
  { icon: "🏠", path: "/Home" },
  { icon: "🔍", path: "/Discover" },
  { icon: "✉️", path: "/Messages" },
  { icon: "🔔", path: "/Notifications" },
  { icon: "👤", path: "/MyProfile" },
];

const TYPE_ICONS = { like:"💜", comment:"💬", friend_request:"👥", mention:"📣", wall_post:"📌" };

export default function Notifications() {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { loadNotifs(); }, []);

  const loadNotifs = async () => {
    setLoading(true);
    try {
      const data = await Notification.list("-created_date");
      setNotifs(data);
      // Mark all as read
      await Promise.all(data.filter(n=>!n.is_read).map(n=>Notification.update(n.id,{is_read:true})));
    } catch(e){ console.error(e); }
    setLoading(false);
  };

  const unread = notifs.filter(n=>!n.is_read);

  return (
    <div style={{ minHeight:"100vh",background:"#0d0d1a",color:"#f0f0f0",fontFamily:"'Segoe UI',sans-serif",paddingBottom:80 }}>
      <div style={{ position:"sticky",top:0,zIndex:100,background:"#0d0d1aee",backdropFilter:"blur(12px)",borderBottom:"1px solid #2a2a45",padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        <span style={{ fontWeight:900,fontSize:20,background:"linear-gradient(90deg,#c084fc,#22d3ee)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>🔔 Notifications</span>
        {notifs.length>0&&<button onClick={()=>setNotifs(prev=>prev.map(n=>({...n,is_read:true})))} style={{ background:"transparent",border:"1px solid #2a2a45",borderRadius:20,color:"#94a3b8",fontSize:12,padding:"4px 12px",cursor:"pointer" }}>Mark all read</button>}
      </div>

      <div style={{ maxWidth:600,margin:"0 auto",padding:"12px 16px" }}>
        {loading&&<div style={{ textAlign:"center",padding:32,color:"#64748b" }}>Loading...</div>}
        {!loading&&notifs.length===0&&(
          <div style={{ textAlign:"center",padding:48,color:"#64748b" }}>
            <div style={{ fontSize:48,marginBottom:12 }}>🔔</div>
            <div>No notifications yet.</div>
          </div>
        )}
        {notifs.map(n=>(
          <div key={n.id} style={{ display:"flex",alignItems:"center",gap:14,padding:"14px 0",borderBottom:"1px solid #2a2a4520",background:n.is_read?"transparent":"#1e1a2e10" }}>
            <div style={{ width:44,height:44,borderRadius:"50%",background:"linear-gradient(135deg,#c084fc,#22d3ee)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0,overflow:"hidden" }}>
              {n.from_avatar?<img src={n.from_avatar} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} />:(n.from_name?.[0]||"?")}
            </div>
            <div style={{ flex:1,minWidth:0 }}>
              <div style={{ fontSize:14,color:"#cbd5e1" }}>
                <strong>{n.from_name}</strong> {n.message?.replace(n.from_name,"").trim()||n.type}
              </div>
              <div style={{ color:"#64748b",fontSize:12,marginTop:2 }}>{n.created_date?new Date(n.created_date).toLocaleDateString("en-US",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}):""}</div>
            </div>
            <span style={{ fontSize:22,flexShrink:0 }}>{TYPE_ICONS[n.type]||"🔔"}</span>
            {!n.is_read&&<div style={{ width:8,height:8,borderRadius:"50%",background:"#c084fc",flexShrink:0 }}/>}
          </div>
        ))}
      </div>

      <div style={{ position:"fixed",bottom:0,left:0,right:0,background:"#0d0d1a",borderTop:"1px solid #2a2a45",display:"flex",justifyContent:"space-around",padding:"10px 0",zIndex:100 }}>
        {NAV.map(item=>(
          <button key={item.path} onClick={()=>navigate(item.path)} style={{ background:"none",border:"none",color:window.location.pathname===item.path?"#c084fc":"#64748b",cursor:"pointer",fontSize:22 }}>{item.icon}</button>
        ))}
      </div>
    </div>
  );
}
