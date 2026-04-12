import { useState, useEffect, useRef } from "react";
import { Message, Profile, Notification } from "../api/entities";
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
function getMyName()  { return localStorage.getItem("os2_name")  || "Guest"; }
function isLoggedIn() { return !!localStorage.getItem("os2_email"); }
function getConvoId(a,b) { return [a,b].sort().join("__"); }

const NAV = [
  { icon:"🏠", label:"Feed",     path:"/Home" },
  { icon:"🔍", label:"Discover", path:"/Discover" },
  { icon:"✉️", label:"Messages", path:"/Messages" },
  { icon:"🔔", label:"Alerts",   path:"/Notifications" },
  { icon:"👤", label:"Profile",  path:"/MyProfile" },
];

export default function Messages() {
  const [profiles,     setProfiles]     = useState([]);
  const [messages,     setMessages]     = useState([]);
  const [activeConvo,  setActiveConvo]  = useState(null);
  const [draft,        setDraft]        = useState("");
  const [sending,      setSending]      = useState(false);
  const [loading,      setLoading]      = useState(true);
  const [loggedIn]   = useState(isLoggedIn());
  const [myEmail]    = useState(getMyEmail());
  const bottomRef    = useRef(null);
  const navigate     = useNavigate();

  useEffect(() => {
    injectGA("G-1N8GD2WM6L");
    if (loggedIn) loadAll();
    else setLoading(false);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [messages, activeConvo]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [msgs, profs] = await Promise.all([
        Message.filter({ sender_email: myEmail }).catch(()=>[]),
        Profile.list().catch(()=>[]),
      ]);
      // Also get messages received
      const received = await Message.filter({ receiver_email: myEmail }).catch(()=>[]);
      const allMsgs = [...msgs, ...received].filter((m,i,arr)=>arr.findIndex(x=>x.id===m.id)===i);
      allMsgs.sort((a,b)=>new Date(a.created_date)-new Date(b.created_date));
      setMessages(allMsgs);
      setProfiles(profs);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  // Build conversation list
  const convos = {};
  messages.forEach(m => {
    const other = m.sender_email===myEmail ? m.receiver_email : m.sender_email;
    if (!convos[other]) convos[other] = { email:other, latest:m, unread:0 };
    else if (new Date(m.created_date) > new Date(convos[other].latest.created_date)) convos[other].latest = m;
    if (!m.is_read && m.receiver_email===myEmail) convos[other].unread++;
  });
  profiles.forEach(p => {
    if (p.user_email!==myEmail && !convos[p.user_email])
      convos[p.user_email] = { email:p.user_email, latest:null, unread:0 };
  });
  const convoList = Object.values(convos).sort((a,b)=>{
    const at = a.latest?.created_date ? new Date(a.latest.created_date) : 0;
    const bt = b.latest?.created_date ? new Date(b.latest.created_date) : 0;
    return bt - at;
  });

  const getProfile = (email) => profiles.find(p=>p.user_email===email);

  const convoMessages = activeConvo
    ? messages.filter(m=>getConvoId(m.sender_email,m.receiver_email)===getConvoId(myEmail,activeConvo))
        .sort((a,b)=>new Date(a.created_date)-new Date(b.created_date))
    : [];

  const openConvo = async (email) => {
    setActiveConvo(email);
    // Mark received messages as read
    const unread = messages.filter(m=>m.receiver_email===myEmail&&m.sender_email===email&&!m.is_read);
    await Promise.all(unread.map(m=>Message.update(m.id,{is_read:true}).catch(()=>{}))).catch(()=>{});
    setMessages(prev=>prev.map(m=>m.sender_email===email&&m.receiver_email===myEmail?{...m,is_read:true}:m));
  };

  const sendMessage = async () => {
    if (!draft.trim()||!activeConvo) return;
    setSending(true);
    try {
      const msg = await Message.create({
        sender_email: myEmail,
        receiver_email: activeConvo,
        sender_name: getMyName(),
        content: draft.trim(),
        is_read: false,
        conversation_id: getConvoId(myEmail,activeConvo),
      });
      setMessages(prev=>[...prev,msg]);
      setDraft("");
      await Notification.create({
        user_email: activeConvo,
        from_email: myEmail,
        from_name: getMyName(),
        type: "message",
        message: `${getMyName()} sent you a message`,
        is_read: false,
      }).catch(()=>{});
    } catch(e) { console.error(e); }
    setSending(false);
  };

  const activeProfile = activeConvo ? getProfile(activeConvo) : null;

  if (!loggedIn) return (
    <div style={{ minHeight:"100vh",background:"#0d0d1a",color:"#f0f0f0",fontFamily:"'Segoe UI',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:20,padding:32,textAlign:"center",paddingBottom:80 }}>
      <div style={{ fontSize:64 }}>🔒</div>
      <div style={{ fontWeight:900,fontSize:24 }}>Messages are Private</div>
      <div style={{ color:"#64748b",fontSize:14,maxWidth:280,lineHeight:1.6 }}>Sign in to send and receive private messages.</div>
      <button onClick={()=>navigate("/OurSpaceOnboarding")} style={{ padding:"12px 32px",background:"linear-gradient(135deg,#c084fc,#22d3ee)",border:"none",borderRadius:20,color:"#000",fontWeight:700,fontSize:15,cursor:"pointer" }}>Join OurSpace →</button>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh",background:"#0d0d1a",color:"#f0f0f0",fontFamily:"'Segoe UI',sans-serif",display:"flex",flexDirection:"column",paddingBottom:60 }}>

      {/* CONVO LIST */}
      {!activeConvo && (
        <>
          <div style={{ position:"sticky",top:0,zIndex:100,background:"#0d0d1aee",backdropFilter:"blur(12px)",borderBottom:"1px solid #2a2a45",padding:"14px 16px" }}>
            <div style={{ fontWeight:900,fontSize:20,background:"linear-gradient(90deg,#c084fc,#22d3ee)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>✉️ Messages</div>
            <div style={{ fontSize:12,color:"#64748b",marginTop:2 }}>🔒 Private messages</div>
          </div>
          <div style={{ maxWidth:600,margin:"0 auto",width:"100%",padding:"12px 16px" }}>
            {loading && <div style={{ textAlign:"center",padding:32,color:"#64748b" }}>⏳ Loading messages...</div>}
            {!loading && convoList.length===0 && (
              <div style={{ textAlign:"center",padding:40,color:"#64748b" }}>
                <div style={{ fontSize:48,marginBottom:12 }}>✉️</div>
                <div style={{ fontWeight:700,marginBottom:6 }}>No messages yet</div>
                <div style={{ fontSize:13 }}>Visit someone's profile and send a message!</div>
                <button onClick={()=>navigate("/Discover")} style={{ marginTop:14,padding:"9px 22px",background:"linear-gradient(135deg,#c084fc,#22d3ee)",border:"none",borderRadius:20,color:"#000",fontWeight:700,cursor:"pointer",fontSize:13 }}>Browse People →</button>
              </div>
            )}
            {!loading && convoList.map(c => {
              const prof = getProfile(c.email);
              return (
                <div key={c.email} onClick={() => openConvo(c.email)}
                  style={{ background:"#16162a",border:"1px solid #2a2a45",borderRadius:14,padding:14,marginBottom:10,cursor:"pointer",display:"flex",gap:12,alignItems:"center" }}>
                  <div style={{ width:48,height:48,borderRadius:"50%",background:"linear-gradient(135deg,#c084fc,#22d3ee)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,fontWeight:700,flexShrink:0,overflow:"hidden",position:"relative" }}>
                    {prof?.avatar_url?<img src={prof.avatar_url} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} onError={e=>e.target.style.display="none"} />:(prof?.display_name?.[0]||c.email[0].toUpperCase())}
                    {prof?.is_online&&<div style={{ position:"absolute",bottom:1,right:1,width:10,height:10,borderRadius:"50%",background:"#4ade80",border:"2px solid #0d0d1a" }}/>}
                  </div>
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ fontWeight:700,fontSize:14 }}>{prof?.display_name||c.email}</div>
                    {c.latest && <div style={{ color:"#64748b",fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{c.latest.sender_email===myEmail?"You: ":""}{c.latest.content}</div>}
                  </div>
                  <div style={{ display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0 }}>
                    {c.latest && <div style={{ fontSize:11,color:"#475569" }}>{new Date(c.latest.created_date).toLocaleDateString("en-US",{month:"short",day:"numeric"})}</div>}
                    {c.unread>0 && <div style={{ background:"#c084fc",color:"#000",borderRadius:"50%",width:20,height:20,fontSize:11,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700 }}>{c.unread}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* CONVERSATION VIEW */}
      {activeConvo && (
        <div style={{ display:"flex",flexDirection:"column",height:"100vh" }}>
          <div style={{ position:"sticky",top:0,zIndex:100,background:"#0d0d1aee",backdropFilter:"blur(12px)",borderBottom:"1px solid #2a2a45",padding:"12px 16px",display:"flex",alignItems:"center",gap:12 }}>
            <button onClick={()=>setActiveConvo(null)} style={{ background:"none",border:"none",color:"#94a3b8",fontSize:20,cursor:"pointer",padding:"4px 8px 4px 0" }}>←</button>
            <div style={{ width:38,height:38,borderRadius:"50%",background:"linear-gradient(135deg,#c084fc,#22d3ee)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,flexShrink:0,overflow:"hidden" }}>
              {activeProfile?.avatar_url?<img src={activeProfile.avatar_url} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} onError={e=>e.target.style.display="none"} />:(activeProfile?.display_name?.[0]||activeConvo[0].toUpperCase())}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700,fontSize:15 }}>{activeProfile?.display_name||activeConvo}</div>
              <div style={{ fontSize:11,color:"#64748b" }}>🔒 Private · {activeProfile?.is_online?"Online":"Offline"}</div>
            </div>
          </div>
          <div style={{ flex:1,overflowY:"auto",padding:"16px",paddingBottom:80 }}>
            {convoMessages.length===0 && (
              <div style={{ textAlign:"center",padding:32,color:"#64748b" }}>
                <div style={{ fontSize:32,marginBottom:8 }}>🔒</div>
                <div style={{ fontSize:13 }}>Your messages are private and visible only to you and this person.</div>
              </div>
            )}
            {convoMessages.map(m => {
              const isMine = m.sender_email===myEmail;
              return (
                <div key={m.id} style={{ display:"flex",justifyContent:isMine?"flex-end":"flex-start",marginBottom:8 }}>
                  <div style={{ maxWidth:"72%",background:isMine?"linear-gradient(135deg,#c084fc,#7c3aed)":"#16162a",borderRadius:isMine?"16px 16px 4px 16px":"16px 16px 16px 4px",padding:"10px 14px",color:isMine?"#fff":"#f0f0f0",fontSize:14,lineHeight:1.5,border:isMine?"none":"1px solid #2a2a45" }}>
                    <div>{m.content}</div>
                    <div style={{ fontSize:10,color:isMine?"#ffffff80":"#475569",marginTop:4,textAlign:"right" }}>
                      {m.created_date?new Date(m.created_date).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"}):""}
                      {isMine&&(m.is_read?" · ✓✓":" · ✓")}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
          {/* Input */}
          <div style={{ position:"fixed",bottom:0,left:0,right:0,background:"#0d0d1a",borderTop:"1px solid #2a2a45",padding:"12px 16px",display:"flex",gap:10,alignItems:"center" }}>
            <input value={draft} onChange={e=>setDraft(e.target.value)}
              onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); sendMessage(); }}}
              placeholder="Send a message... (Enter to send)"
              style={{ flex:1,background:"#16162a",border:"1px solid #2a2a45",borderRadius:24,color:"#f0f0f0",fontSize:14,padding:"11px 16px",outline:"none" }} />
            <button onClick={sendMessage} disabled={!draft.trim()||sending}
              style={{ width:44,height:44,borderRadius:"50%",background:draft.trim()?"linear-gradient(135deg,#c084fc,#22d3ee)":"#2a2a45",border:"none",color:draft.trim()?"#000":"#64748b",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
              {sending?"⏳":"➤"}
            </button>
          </div>
        </div>
      )}

      {/* Bottom Nav (only shown in list view) */}
      {!activeConvo && (
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
      )}
    </div>
  );
}
