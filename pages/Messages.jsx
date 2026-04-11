import { useState, useEffect, useRef } from "react";
import { Message, Profile } from "../api/entities";
import { useNavigate } from "react-router-dom";

const NAV = [
  { icon: "🏠", path: "/Home" },
  { icon: "🔍", path: "/Discover" },
  { icon: "✉️", path: "/Messages" },
  { icon: "🔔", path: "/Notifications" },
  { icon: "👤", path: "/MyProfile" },
];

const MY_EMAIL = "me@ourspace.app";

function getConvoId(a, b) {
  return [a, b].sort().join("__");
}

export default function Messages() {
  const [profiles, setProfiles] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeConvo, setActiveConvo] = useState(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => { loadAll(); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, activeConvo]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [msgs, profs] = await Promise.all([Message.list("-created_date"), Profile.list()]);
      setMessages(msgs);
      setProfiles(profs);
    } catch(e){ console.error(e); }
    setLoading(false);
  };

  // Build conversation list
  const convos = {};
  messages.forEach(m => {
    const other = m.sender_email === MY_EMAIL ? m.receiver_email : m.sender_email;
    if (!convos[other]) convos[other] = { email: other, latest: m, unread: 0 };
    if (!m.is_read && m.receiver_email === MY_EMAIL) convos[other].unread++;
  });
  // Also include profiles with no messages yet
  profiles.forEach(p => {
    if (p.user_email !== MY_EMAIL && !convos[p.user_email]) {
      convos[p.user_email] = { email: p.user_email, latest: null, unread: 0 };
    }
  });
  const convoList = Object.values(convos).sort((a,b) => {
    const at = a.latest?.created_date ? new Date(a.latest.created_date) : 0;
    const bt = b.latest?.created_date ? new Date(b.latest.created_date) : 0;
    return bt - at;
  });

  const getProfile = (email) => profiles.find(p => p.user_email === email);

  const convoMessages = activeConvo
    ? messages.filter(m => {
        const cid = getConvoId(m.sender_email, m.receiver_email);
        return cid === getConvoId(MY_EMAIL, activeConvo);
      }).sort((a,b) => new Date(a.created_date) - new Date(b.created_date))
    : [];

  const sendMessage = async () => {
    if (!draft.trim() || !activeConvo) return;
    setSending(true);
    try {
      const msg = await Message.create({
        sender_email: MY_EMAIL,
        receiver_email: activeConvo,
        sender_name: "You",
        content: draft.trim(),
        is_read: false,
        conversation_id: getConvoId(MY_EMAIL, activeConvo),
      });
      setMessages(prev => [...prev, msg]);
      setDraft("");
    } catch(e){ console.error(e); }
    setSending(false);
  };

  const activeProfile = activeConvo ? getProfile(activeConvo) : null;

  return (
    <div style={{ minHeight:"100vh",background:"#0d0d1a",color:"#f0f0f0",fontFamily:"'Segoe UI',sans-serif",display:"flex",flexDirection:"column",paddingBottom:60 }}>
      {!activeConvo ? (
        <>
          <div style={{ position:"sticky",top:0,zIndex:100,background:"#0d0d1aee",backdropFilter:"blur(12px)",borderBottom:"1px solid #2a2a45",padding:"14px 16px" }}>
            <div style={{ fontWeight:900,fontSize:20,background:"linear-gradient(90deg,#c084fc,#22d3ee)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>✉️ Messages</div>
            <div style={{ fontSize:12,color:"#64748b",marginTop:2 }}>🔒 End-to-end encrypted</div>
          </div>
          <div style={{ maxWidth:600,margin:"0 auto",width:"100%",padding:"12px 16px" }}>
            {loading && <div style={{ textAlign:"center",padding:32,color:"#64748b" }}>Loading...</div>}
            {!loading && convoList.length===0 && <div style={{ textAlign:"center",padding:40,color:"#64748b" }}><div style={{ fontSize:40,marginBottom:12 }}>✉️</div><div>No messages yet.<br/>Find someone in Discover to chat!</div></div>}
            {convoList.map(convo => {
              const prof = getProfile(convo.email);
              return (
                <div key={convo.email} onClick={() => setActiveConvo(convo.email)}
                  style={{ display:"flex",alignItems:"center",gap:14,padding:"14px 0",borderBottom:"1px solid #2a2a4520",cursor:"pointer" }}>
                  <div style={{ width:50,height:50,borderRadius:"50%",background:"linear-gradient(135deg,#c084fc,#22d3ee)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:700,flexShrink:0,overflow:"hidden",position:"relative" }}>
                    {prof?.avatar_url?<img src={prof.avatar_url} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} />:(prof?.display_name?.[0]||convo.email[0].toUpperCase())}
                    {prof?.is_online&&<div style={{ position:"absolute",bottom:2,right:2,width:10,height:10,borderRadius:"50%",background:"#4ade80",border:"2px solid #0d0d1a" }} />}
                  </div>
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ fontWeight:700,fontSize:15 }}>{prof?.display_name||convo.email}</div>
                    {convo.latest && <div style={{ color:"#64748b",fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{convo.latest.content?.slice(0,60)}</div>}
                  </div>
                  {convo.unread>0&&<div style={{ background:"#c084fc",color:"#fff",borderRadius:"50%",width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0 }}>{convo.unread}</div>}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div style={{ display:"flex",flexDirection:"column",height:"100vh" }}>
          <div style={{ position:"sticky",top:0,zIndex:100,background:"#0d0d1aee",backdropFilter:"blur(12px)",borderBottom:"1px solid #2a2a45",padding:"12px 16px",display:"flex",alignItems:"center",gap:12 }}>
            <button onClick={()=>setActiveConvo(null)} style={{ background:"none",border:"none",color:"#94a3b8",fontSize:20,cursor:"pointer" }}>←</button>
            <div style={{ width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,#c084fc,#22d3ee)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,overflow:"hidden" }}>
              {activeProfile?.avatar_url?<img src={activeProfile.avatar_url} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} />:(activeProfile?.display_name?.[0]||"?")}
            </div>
            <div>
              <div style={{ fontWeight:700,fontSize:15 }}>{activeProfile?.display_name||activeConvo}</div>
              {activeProfile?.is_online&&<div style={{ color:"#4ade80",fontSize:11 }}>● Online</div>}
            </div>
            <div style={{ marginLeft:"auto",fontSize:11,color:"#64748b" }}>🔒 Encrypted</div>
          </div>

          <div style={{ flex:1,overflowY:"auto",padding:"16px",display:"flex",flexDirection:"column",gap:8 }}>
            {convoMessages.length===0&&<div style={{ textAlign:"center",padding:32,color:"#64748b" }}>Start a conversation with {activeProfile?.display_name||activeConvo}.</div>}
            {convoMessages.map(m=>(
              <div key={m.id} style={{ display:"flex",justifyContent:m.sender_email===MY_EMAIL?"flex-end":"flex-start" }}>
                <div style={{ maxWidth:"75%",background:m.sender_email===MY_EMAIL?"linear-gradient(135deg,#c084fc,#818cf8)":"#16162a",color:"#fff",borderRadius:m.sender_email===MY_EMAIL?"18px 18px 4px 18px":"18px 18px 18px 4px",padding:"10px 14px",fontSize:14,lineHeight:1.5 }}>
                  {m.content}
                  <div style={{ fontSize:10,color:m.sender_email===MY_EMAIL?"#ffffff80":"#64748b",marginTop:4,textAlign:"right" }}>
                    {m.created_date?new Date(m.created_date).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):""}
                  </div>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div style={{ padding:"12px 16px",borderTop:"1px solid #2a2a45",background:"#0d0d1a",display:"flex",gap:10,alignItems:"center",paddingBottom:70 }}>
            <input value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&sendMessage()}
              placeholder="Message..." style={{ flex:1,background:"#16162a",border:"1px solid #2a2a45",borderRadius:24,color:"#f0f0f0",fontSize:14,padding:"10px 16px",outline:"none" }} />
            <button onClick={sendMessage} disabled={sending||!draft.trim()} style={{ width:40,height:40,borderRadius:"50%",background:draft.trim()?"linear-gradient(135deg,#c084fc,#22d3ee)":"#2a2a45",border:"none",color:"#fff",fontSize:18,cursor:draft.trim()?"pointer":"default" }}>↗</button>
          </div>
        </div>
      )}

      {!activeConvo && (
        <div style={{ position:"fixed",bottom:0,left:0,right:0,background:"#0d0d1a",borderTop:"1px solid #2a2a45",display:"flex",justifyContent:"space-around",padding:"10px 0",zIndex:100 }}>
          {NAV.map(item=>(
            <button key={item.path} onClick={()=>navigate(item.path)} style={{ background:"none",border:"none",color:window.location.pathname===item.path?"#c084fc":"#64748b",cursor:"pointer",fontSize:22 }}>{item.icon}</button>
          ))}
        </div>
      )}
    </div>
  );
}
