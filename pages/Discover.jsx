import { useState, useEffect } from "react";
import { Profile, Post } from "../api/entities";
import { useNavigate } from "react-router-dom";

const NAV = [
  { icon: "🏠", path: "/Home" },
  { icon: "🔍", path: "/Discover" },
  { icon: "✉️", path: "/Messages" },
  { icon: "🔔", path: "/Notifications" },
  { icon: "👤", path: "/MyProfile" },
];

export default function Discover() {
  const [query, setQuery] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [posts, setPosts] = useState([]);
  const [tab, setTab] = useState("people");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [p, po] = await Promise.all([Profile.list(), Post.list("-created_date")]);
      setProfiles(p);
      setPosts(po);
    } catch(e){ console.error(e); }
    setLoading(false);
  };

  const filteredProfiles = profiles.filter(p =>
    !query || p.display_name?.toLowerCase().includes(query.toLowerCase()) ||
    p.headline?.toLowerCase().includes(query.toLowerCase()) ||
    (Array.isArray(p.interests) && p.interests.some(i=>i.toLowerCase().includes(query.toLowerCase())))
  );

  const filteredPosts = posts.filter(p =>
    !query || p.content?.toLowerCase().includes(query.toLowerCase()) ||
    p.searchable_text?.toLowerCase().includes(query.toLowerCase()) ||
    p.title?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ minHeight:"100vh",background:"#0d0d1a",color:"#f0f0f0",fontFamily:"'Segoe UI',sans-serif",paddingBottom:80 }}>
      <div style={{ position:"sticky",top:0,zIndex:100,background:"#0d0d1aee",backdropFilter:"blur(12px)",borderBottom:"1px solid #2a2a45",padding:"12px 16px" }}>
        <div style={{ fontWeight:900,fontSize:18,marginBottom:10,background:"linear-gradient(90deg,#c084fc,#22d3ee)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>🔍 Discover</div>
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search people, posts, interests..."
          style={{ width:"100%",background:"#16162a",border:"1px solid #2a2a45",borderRadius:24,color:"#f0f0f0",fontSize:14,padding:"10px 16px",boxSizing:"border-box",outline:"none" }} />
      </div>

      <div style={{ maxWidth:600,margin:"0 auto",padding:"16px" }}>
        <div style={{ display:"flex",gap:2,borderBottom:"1px solid #2a2a45",marginBottom:16 }}>
          {["people","posts"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{ padding:"8px 20px",background:"transparent",border:"none",borderBottom:`2px solid ${tab===t?"#c084fc":"transparent"}`,color:tab===t?"#c084fc":"#64748b",fontWeight:600,cursor:"pointer",fontSize:14,textTransform:"capitalize" }}>
              {t==="people"?"👥 People":"📝 Posts"}
            </button>
          ))}
        </div>

        {loading && <div style={{ textAlign:"center",padding:32,color:"#64748b" }}>Searching...</div>}

        {!loading && tab==="people" && (
          filteredProfiles.length===0
            ? <div style={{ textAlign:"center",padding:32,color:"#64748b" }}>No people found.</div>
            : filteredProfiles.map(p=>(
              <div key={p.id} onClick={()=>navigate(`/Profile?email=${p.user_email}`)} style={{ background:"#16162a",border:"1px solid #2a2a45",borderRadius:14,padding:16,marginBottom:12,cursor:"pointer",display:"flex",gap:14,alignItems:"center" }}>
                <div style={{ width:52,height:52,borderRadius:"50%",background:"linear-gradient(135deg,#c084fc,#22d3ee)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:700,flexShrink:0,overflow:"hidden" }}>
                  {p.avatar_url?<img src={p.avatar_url} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} />:(p.display_name?.[0]||"?")}
                </div>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ fontWeight:700,fontSize:15 }}>{p.display_name}</div>
                  <div style={{ color:"#94a3b8",fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{p.headline}</div>
                  {Array.isArray(p.interests)&&p.interests.length>0&&(
                    <div style={{ display:"flex",gap:4,flexWrap:"wrap",marginTop:4 }}>
                      {p.interests.slice(0,3).map((i,idx)=><span key={idx} style={{ background:"#1e1a2e",color:"#c084fc",fontSize:11,padding:"2px 8px",borderRadius:20 }}>{i}</span>)}
                    </div>
                  )}
                </div>
                {p.is_online&&<div style={{ width:10,height:10,borderRadius:"50%",background:"#4ade80",flexShrink:0 }}/>}
              </div>
            ))
        )}

        {!loading && tab==="posts" && (
          filteredPosts.length===0
            ? <div style={{ textAlign:"center",padding:32,color:"#64748b" }}>No posts found.</div>
            : filteredPosts.map(p=>(
              <div key={p.id} style={{ background:"#16162a",border:"1px solid #2a2a45",borderRadius:14,padding:16,marginBottom:12 }}>
                <div style={{ fontWeight:600,fontSize:13,color:"#94a3b8",marginBottom:6 }}>{p.author_name}</div>
                {p.content&&<div style={{ fontSize:14,color:"#cbd5e1",lineHeight:1.6 }}>{p.content.slice(0,200)}{p.content.length>200?"...":""}</div>}
                {p.image_url&&<img src={p.image_url} alt="" style={{ width:"100%",borderRadius:8,marginTop:8,maxHeight:200,objectFit:"cover" }} onError={e=>e.target.style.display="none"} />}
                <div style={{ marginTop:8,color:"#64748b",fontSize:12 }}>💜 {p.likes_count||0} · 💬 {p.comments_count||0}</div>
              </div>
            ))
        )}
      </div>

      <div style={{ position:"fixed",bottom:0,left:0,right:0,background:"#0d0d1a",borderTop:"1px solid #2a2a45",display:"flex",justifyContent:"space-around",padding:"10px 0",zIndex:100 }}>
        {NAV.map(item=>(
          <button key={item.path} onClick={()=>navigate(item.path)} style={{ background:"none",border:"none",color:window.location.pathname===item.path?"#c084fc":"#64748b",cursor:"pointer",fontSize:22 }}>{item.icon}</button>
        ))}
      </div>
    </div>
  );
}
