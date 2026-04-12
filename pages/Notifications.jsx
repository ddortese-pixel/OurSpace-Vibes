import { useState, useEffect } from "react";
import { Notification } from "../api/entities";
import { useNavigate } from "react-router-dom";

function injectGA(id) {
  if (localStorage.getItem("os2_analyticsConsent") !== "true") return;
  if (document.getElementById(`ga-${id}`)) return;
  const s1 = document.createElement("script"); s1.id = `ga-${id}`; s1.async = true;
  s1.src = `https://www.googletagmanager.com/gtag/js?id=${id}`; document.head.appendChild(s1);
  const s2 = document.createElement("script");
  s2.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","${id}",{"anonymize_ip":true});`;
  document.head.appendChild(s2);
}

function getMyEmail() { return localStorage.getItem("os2_email") || null; }
function isLoggedIn() { return !!localStorage.getItem("os2_email"); }

const NAV = [
  { icon:"🏠", label:"Feed",     path:"/Home" },
  { icon:"🔍", label:"Discover", path:"/Discover" },
  { icon:"✉️", label:"Messages", path:"/Messages" },
  { icon:"🔔", label:"Alerts",   path:"/Notifications" },
  { icon:"👤", label:"Profile",  path:"/MyProfile" },
];

const TYPE_ICON = { like:"💜", comment:"💬", friend_request:"👥", wall_post:"📌", message:"✉️", default:"🔔" };

export default function Notifications() {
  const [notifs,   setNotifs]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [loggedIn] = useState(isLoggedIn());
  const navigate   = useNavigate();
  const myEmail    = getMyEmail();

  useEffect(() => {
    injectGA("G-1N8GD2WM6L");
    if (loggedIn) loadNotifs();
    else setLoading(false);
  }, []);

  const loadNotifs = async () => {
    setLoading(true);
    try {
      const data = await Notification.filter({ user_email: myEmail });
      setNotifs((data||[]).sort((a,b)=>new Date(b.created_date)-new Date(a.created_date)));
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const markRead = async (n) => {
    if (n.is_read) return;
    await Notification.update(n.id,{is_read:true}).catch(()=>{});
    setNotifs(prev=>prev.map(x=>x.id===n.id?{...x,is_read:true}:x));
  };

  const markAllRead = async () => {
    const unread = notifs.filter(n=>!n.is_read);
    await Promise.all(unread.map(n=>Notification.update(n.id,{is_read:true}).catch(()=>{}))).catch(()=>{});
    setNotifs(prev=>prev.map(n=>({...n,is_read:true})));
  };

  const handleClick = (n) => {
    markRead(n);
    if (n.type==="friend_request"||n.type==="wall_post") navigate(`/Profile?email=${n.from_email}`);
    else if (n.type==="message") navigate("/Messages");
    else if (n.reference_id) navigate(`/Profile?email=${n.from_email}`);
  };

  if (!loggedIn) return (
    <div style={{ minHeight:"100vh",background:"#0d0d1a",color:"#f0f0f0",fontFamily:"'Segoe UI',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:20,padding:32,textAlign:"center",paddingBottom:80 }}>
      <div style={{ fontSize:64 }}>🔔</div>
      <div style={{ fontWeight:900,fontSize:22 }}>No Notifications</div>
      <div style={{ color:"#64748b",fontSize:14,maxWidth:280,lineHeight:1.6 }}>Sign in to see likes, comments, friend requests, and messages.</div>
      <button onClick={()=>navigate("/OurSpaceOnboarding")} style={{ padding:"12px 32px",background:"linear-gradient(135deg,#c084fc,#22d3ee)",border:"none",borderRadius:20,color:"#000",fontWeight:700,fontSize:15,cursor:"pointer" }}>Join OurSpace →</button>
    </div>
  );

  const unreadCount = notifs.filter(n=>!n.is_read).length;

  return (
    <div style={{ minHeight:"100vh",background:"#0d0d1a",color:"#f0f0f0",fontFamily:"'Segoe UI',sans-serif",paddingBottom:80 }}>
      <div style={{ position:"sticky",top:0,zIndex:100,background:"#0d0d1aee",backdropFilter:"blur(12px)",borderBottom:"1px solid #2a2a45",padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        <div>
          <div style={{ fontWeight:900,fontSize:20,background:"linear-gradient(90deg,#c084fc,#22d3ee)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>🔔 Alerts</div>
          {unreadCount>0&&<div style={{ fontSize:12,color:"#64748b",marginTop:1 }}>{unreadCount} unread</div>}
        </div>
        {unreadCount>0&&(
          <button onClick={markAllRead} style={{ padding:"6px 14px",background:"transparent",border:"1px solid #2a2a45",borderRadius:20,color:"#c084fc",fontSize:12,cursor:"pointer",fontWeight:600 }}>Mark all read</button>
        )}
      </div>

      <div style={{ maxWidth:600,margin:"0 auto",padding:"12px 16px" }}>
        {loading && <div style={{ textAlign:"center",padding:40,color:"#64748b" }}>⏳ Loading...</div>}
        {!loading && notifs.length===0 && (
          <div style={{ textAlign:"center",padding:48,color:"#64748b" }}>
            <div style={{ fontSize:48,marginBottom:12 }}>🔔</div>
            <div style={{ fontWeight:700,fontSize:16,marginBottom:6 }}>You're all caught up!</div>
            <div style={{ fontSize:13 }}>Likes, comments, and messages will show up here.</div>
          </div>
        )}
        {!loading && notifs.map(n => (
          <div key={n.id} onClick={() => handleClick(n)}
            style={{ background:n.is_read?"#16162a":"#1a1a35",border:`1px solid ${n.is_read?"#2a2a45":"#c084fc30"}`,borderRadius:14,padding:14,marginBottom:10,cursor:"pointer",display:"flex",gap:12,alignItems:"flex-start",transition:"all 0.15s" }}>
            <div style={{ width:44,height:44,borderRadius:"50%",background:"linear-gradient(135deg,#c084fc,#22d3ee)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:16,flexShrink:0,overflow:"hidden" }}>
              {n.from_avatar?<img src={n.from_avatar} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} onError={e=>e.target.style.display="none"} />:(n.from_name?.[0]||"?")}
            </div>
            <div style={{ flex:1,minWidth:0 }}>
              <div style={{ fontSize:14,lineHeight:1.5,color:"#f0f0f0" }}>
                <span style={{ fontWeight:700,color:"#c084fc" }}>{n.from_name}</span>{" "}
                <span style={{ color:"#cbd5e1" }}>{n.message?.replace(n.from_name,"").trim()||"interacted with you"}</span>
              </div>
              <div style={{ fontSize:11,color:"#475569",marginTop:4 }}>
                {TYPE_ICON[n.type]||TYPE_ICON.default} · {n.created_date?new Date(n.created_date).toLocaleDateString("en-US",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}):""}
              </div>
            </div>
            {!n.is_read && <div style={{ width:10,height:10,borderRadius:"50%",background:"#c084fc",flexShrink:0,marginTop:5 }} />}
          </div>
        ))}
      </div>

      <div style={{ position:"fixed",bottom:0,left:0,right:0,background:"#0d0d1aee",backdropFilter:"blur(12px)",borderTop:"1px solid #2a2a45",display:"flex",justifyContent:"space-around",padding:"10px 0 12px",zIndex:100 }}>
        {NAV.map(item => {
          const active = window.location.pathname===item.path;
          return (
            <button key={item.path} onClick={()=>navigate(item.path)}
              style={{ background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"4px 10px" }}>
              <span style={{ fontSize:22,opacity:active?1:0.5 }}>{item.icon}</span>
              <span style={{ fontSize:10,color:active?"#c084fc":"#475569",fontWeight:active?700:400 }}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
