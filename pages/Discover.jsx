import { useState, useEffect } from "react";
import { Profile, Post } from "../api/entities";
import { useNavigate } from "react-router-dom";

const DISCOVER_URL = "https://legacy-circle-ae3f9932.base44.app/functions/getPublicDiscover";

function injectGA(id) {
  if (document.getElementById(`ga-${id}`)) return;
  const s1 = document.createElement("script"); s1.id = `ga-${id}`; s1.async = true;
  s1.src = `https://www.googletagmanager.com/gtag/js?id=${id}`; document.head.appendChild(s1);
  const s2 = document.createElement("script");
  s2.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","${id}");`;
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

export default function Discover() {
  const [query,    setQuery]    = useState("");
  const [profiles, setProfiles] = useState([]);
  const [posts,    setPosts]    = useState([]);
  const [tab,      setTab]      = useState("people");
  const [loading,  setLoading]  = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    injectGA("G-1N8GD2WM6L");
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      // Try public endpoint first, fall back to entity access
      let profs = [], postsData = [];
      try {
        const res = await fetch(DISCOVER_URL, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({}) });
        const data = await res.json();
        profs     = data.profiles || [];
        postsData = data.posts    || [];
      } catch {
        [profs, postsData] = await Promise.all([Profile.list(), Post.list("-created_date")]);
      }
      setProfiles(profs);
      setPosts(postsData);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const q = query.toLowerCase();
  const filteredProfiles = profiles.filter(p =>
    !query ||
    p.display_name?.toLowerCase().includes(q) ||
    p.headline?.toLowerCase().includes(q) ||
    (Array.isArray(p.interests) && p.interests.some(i=>i.toLowerCase().includes(q)))
  );

  const filteredPosts = posts.filter(p =>
    !query ||
    p.content?.toLowerCase().includes(q) ||
    p.title?.toLowerCase().includes(q) ||
    p.searchable_text?.toLowerCase().includes(q) ||
    p.author_name?.toLowerCase().includes(q)
  );

  return (
    <div style={{ minHeight:"100vh",background:"#0d0d1a",color:"#f0f0f0",fontFamily:"'Segoe UI',sans-serif",paddingBottom:80 }}>

      {/* Header + Search */}
      <div style={{ position:"sticky",top:0,zIndex:100,background:"#0d0d1aee",backdropFilter:"blur(12px)",borderBottom:"1px solid #2a2a45",padding:"12px 16px" }}>
        <div style={{ fontWeight:900,fontSize:18,marginBottom:10,background:"linear-gradient(90deg,#c084fc,#22d3ee)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>🔍 Discover</div>
        <input value={query} onChange={e=>setQuery(e.target.value)}
          placeholder="Search people, posts, interests..."
          style={{ width:"100%",background:"#16162a",border:"1px solid #2a2a45",borderRadius:24,color:"#f0f0f0",fontSize:14,padding:"10px 16px",boxSizing:"border-box",outline:"none" }} />
      </div>

      <div style={{ maxWidth:600,margin:"0 auto",padding:"16px" }}>
        <div style={{ display:"flex",gap:2,borderBottom:"1px solid #2a2a45",marginBottom:16 }}>
          {[["people","👥 People"],["posts","📝 Posts"]].map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)}
              style={{ padding:"8px 20px",background:"transparent",border:"none",borderBottom:`2px solid ${tab===id?"#c084fc":"transparent"}`,color:tab===id?"#c084fc":"#64748b",fontWeight:600,cursor:"pointer",fontSize:14 }}>
              {label}
            </button>
          ))}
        </div>

        {loading && <div style={{ textAlign:"center",padding:32,color:"#64748b" }}>⏳ Loading...</div>}

        {!loading && tab==="people" && (
          filteredProfiles.length===0
            ? <div style={{ textAlign:"center",padding:32,color:"#64748b" }}>
                <div style={{ fontSize:40,marginBottom:10 }}>👥</div>
                <div>No people found{query?` for "${query}"`:""}</div>
              </div>
            : filteredProfiles.map(p => (
              <div key={p.id} onClick={() => navigate(`/Profile?email=${p.user_email}`)}
                style={{ background:"#16162a",border:"1px solid #2a2a45",borderRadius:14,padding:16,marginBottom:12,cursor:"pointer",display:"flex",gap:14,alignItems:"center" }}>
                <div style={{ width:52,height:52,borderRadius:"50%",background:"linear-gradient(135deg,#c084fc,#22d3ee)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:700,flexShrink:0,overflow:"hidden" }}>
                  {p.avatar_url ? <img src={p.avatar_url} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} onError={e=>e.target.style.display="none"} /> : (p.display_name?.[0]||"?")}
                </div>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ fontWeight:700,fontSize:15 }}>{p.display_name}</div>
                  {p.headline && <div style={{ color:"#94a3b8",fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{p.headline}</div>}
                  {Array.isArray(p.interests) && p.interests.length > 0 && (
                    <div style={{ display:"flex",gap:4,flexWrap:"wrap",marginTop:4 }}>
                      {p.interests.slice(0,3).map((i,idx)=><span key={idx} style={{ background:"#1e1a2e",color:"#c084fc",fontSize:11,padding:"2px 8px",borderRadius:20 }}>{i}</span>)}
                    </div>
                  )}
                </div>
                <div style={{ display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0 }}>
                  {p.is_online && <div style={{ width:10,height:10,borderRadius:"50%",background:"#4ade80" }} />}
                  {p.mood && <div style={{ fontSize:11,color:"#64748b" }}>{p.mood.split(" ")[0]}</div>}
                </div>
              </div>
            ))
        )}

        {!loading && tab==="posts" && (
          filteredPosts.length===0
            ? <div style={{ textAlign:"center",padding:32,color:"#64748b" }}>
                <div style={{ fontSize:40,marginBottom:10 }}>📝</div>
                <div>No posts found{query?` for "${query}"`:""}</div>
              </div>
            : filteredPosts.map(p => (
              <div key={p.id} style={{ background:"#16162a",border:"1px solid #2a2a45",borderRadius:14,padding:16,marginBottom:12 }}>
                <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:8,cursor:"pointer" }} onClick={()=>navigate(`/Profile?email=${p.author_email}`)}>
                  <div style={{ width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#c084fc,#22d3ee)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,overflow:"hidden",flexShrink:0 }}>
                    {p.author_avatar?<img src={p.author_avatar} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} onError={e=>e.target.style.display="none"} />:(p.author_name?.[0]||"?")}
                  </div>
                  <span style={{ fontWeight:600,fontSize:13,color:"#94a3b8" }}>{p.author_name}</span>
                  {p.is_ai_generated
                    ? <span style={{ marginLeft:"auto",background:"#1e1a2e",border:"1px solid #c084fc40",color:"#c084fc",fontSize:10,padding:"1px 7px",borderRadius:20 }}>🤖 AI</span>
                    : <span style={{ marginLeft:"auto",background:"#1e2a1e",border:"1px solid #4ade8040",color:"#4ade80",fontSize:10,padding:"1px 7px",borderRadius:20 }}>✅ Human</span>
                  }
                </div>
                {p.title   && <div style={{ fontWeight:700,fontSize:15,marginBottom:4 }}>{p.title}</div>}
                {p.content && <div style={{ fontSize:14,color:"#cbd5e1",lineHeight:1.6,marginBottom:p.image_url?8:0 }}>{p.content.slice(0,200)}{p.content.length>200?"…":""}</div>}
                {p.image_url && <img src={p.image_url} alt="" style={{ width:"100%",borderRadius:8,maxHeight:200,objectFit:"cover" }} onError={e=>e.target.style.display="none"} />}
                <div style={{ marginTop:8,color:"#64748b",fontSize:12,display:"flex",gap:12 }}>
                  <span>💜 {p.likes_count||0}</span>
                  <span>💬 {p.comments_count||0}</span>
                  <span style={{ marginLeft:"auto" }}>{p.created_date?new Date(p.created_date).toLocaleDateString("en-US",{month:"short",day:"numeric"}):""}</span>
                </div>
              </div>
            ))
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{ position:"fixed",bottom:0,left:0,right:0,background:"#0d0d1aee",backdropFilter:"blur(12px)",borderTop:"1px solid #2a2a45",display:"flex",justifyContent:"space-around",padding:"10px 0 12px",zIndex:100 }}>
        {NAV.map(item => {
          const active = window.location.pathname === item.path;
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
