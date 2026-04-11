import { useState, useEffect } from "react";
import { Profile, Post, WallPost, Friend } from "../api/entities";
import { useNavigate } from "react-router-dom";

const NAV = [
  { icon: "🏠", path: "/Home" },
  { icon: "🔍", path: "/Discover" },
  { icon: "✉️", path: "/Messages" },
  { icon: "🔔", path: "/Notifications" },
  { icon: "👤", path: "/MyProfile" },
];

export default function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [wall, setWall] = useState([]);
  const [tab, setTab] = useState("posts");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const profiles = await Profile.list();
      const me = profiles[0] || null;
      setProfile(me);
      setForm(me || {});
      const [myPosts, myWall] = await Promise.all([
        Post.filter({ author_email: me?.user_email }),
        WallPost.filter({ profile_email: me?.user_email }),
      ]);
      setPosts(myPosts);
      setWall(myWall);
    } catch(e){ console.error(e); }
    setLoading(false);
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      if (profile?.id) {
        const updated = await Profile.update(profile.id, form);
        setProfile(updated);
      } else {
        const created = await Profile.create({ ...form, user_email: "me@ourspace.app" });
        setProfile(created);
      }
      setEditing(false);
    } catch(e){ console.error(e); }
    setSaving(false);
  };

  const GRADIENTS = {
    "purple-pink": "linear-gradient(135deg,#c084fc,#ec4899)",
    "orange-red": "linear-gradient(135deg,#f97316,#ef4444)",
    "green-teal": "linear-gradient(135deg,#22c55e,#14b8a6)",
    "blue-cyan": "linear-gradient(135deg,#3b82f6,#22d3ee)",
    "teal-blue": "linear-gradient(135deg,#14b8a6,#3b82f6)",
    "default": "linear-gradient(135deg,#c084fc,#22d3ee)",
  };

  const bg = GRADIENTS[profile?.background_gradient] || GRADIENTS.default;

  if (loading) return <div style={{ minHeight:"100vh",background:"#0d0d1a",color:"#64748b",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Segoe UI',sans-serif" }}>Loading profile...</div>;

  return (
    <div style={{ minHeight:"100vh",background:"#0d0d1a",color:"#f0f0f0",fontFamily:"'Segoe UI',sans-serif",paddingBottom:80 }}>
      {/* Cover */}
      <div style={{ height:160,background:bg,position:"relative" }}>
        {profile?.cover_photo && <img src={profile.cover_photo} alt="" style={{ width:"100%",height:"100%",objectFit:"cover",position:"absolute",inset:0 }} />}
        <button onClick={()=>navigate("/Home")} style={{ position:"absolute",top:12,left:12,background:"#00000066",border:"none",borderRadius:20,color:"#fff",padding:"6px 12px",cursor:"pointer",fontSize:13 }}>← Back</button>
        {!editing && <button onClick={()=>setEditing(true)} style={{ position:"absolute",top:12,right:12,background:"#00000066",border:"none",borderRadius:20,color:"#fff",padding:"6px 14px",cursor:"pointer",fontSize:13,fontWeight:600 }}>✏️ Edit</button>}
      </div>

      {/* Avatar + info */}
      <div style={{ maxWidth:600,margin:"0 auto",padding:"0 16px" }}>
        <div style={{ display:"flex",alignItems:"flex-end",gap:16,marginTop:-36,marginBottom:16 }}>
          <div style={{ width:80,height:80,borderRadius:"50%",background:"linear-gradient(135deg,#c084fc,#22d3ee)",border:"3px solid #0d0d1a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,fontWeight:700,flexShrink:0,overflow:"hidden" }}>
            {profile?.avatar_url ? <img src={profile.avatar_url} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} /> : (profile?.display_name?.[0] || "👤")}
          </div>
          <div style={{ flex:1,paddingBottom:4 }}>
            <div style={{ fontWeight:900,fontSize:20 }}>{profile?.display_name || "Your Name"}</div>
            <div style={{ color:"#94a3b8",fontSize:13 }}>{profile?.headline || "Add a headline"}</div>
          </div>
        </div>

        {profile?.mood && <div style={{ background:"#16162a",border:"1px solid #2a2a45",borderRadius:20,padding:"6px 14px",display:"inline-block",fontSize:13,color:"#c084fc",marginBottom:12 }}>😶 {profile.mood}</div>}
        {profile?.song_playing && <div style={{ background:"#16162a",border:"1px solid #2a2a45",borderRadius:20,padding:"6px 14px",display:"inline-block",fontSize:13,color:"#22d3ee",marginBottom:12,marginLeft:8 }}>🎵 {profile.song_playing}</div>}
        {profile?.about_me && <div style={{ color:"#94a3b8",fontSize:14,lineHeight:1.6,marginBottom:12 }}>{profile.about_me}</div>}

        {Array.isArray(profile?.interests) && profile.interests.length>0 && (
          <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginBottom:16 }}>
            {profile.interests.map((i,idx)=><span key={idx} style={{ background:"#1e1a2e",border:"1px solid #c084fc30",color:"#c084fc",fontSize:12,padding:"3px 10px",borderRadius:20 }}>{i}</span>)}
          </div>
        )}

        <div style={{ display:"flex",gap:20,marginBottom:20,color:"#94a3b8",fontSize:13 }}>
          <span><strong style={{ color:"#f0f0f0" }}>{posts.length}</strong> posts</span>
          <span><strong style={{ color:"#f0f0f0" }}>{profile?.profile_views||0}</strong> views</span>
        </div>

        {/* Edit form */}
        {editing && (
          <div style={{ background:"#16162a",border:"1px solid #2a2a45",borderRadius:16,padding:20,marginBottom:20 }}>
            <div style={{ fontWeight:700,fontSize:16,marginBottom:16 }}>Edit Profile</div>
            {[
              ["display_name","Display Name","text"],
              ["headline","Headline","text"],
              ["about_me","About Me","textarea"],
              ["mood","Current Mood","text"],
              ["song_playing","Song Playing","text"],
              ["avatar_url","Avatar URL","text"],
            ].map(([field,label,type])=>(
              <div key={field} style={{ marginBottom:14 }}>
                <label style={{ color:"#94a3b8",fontSize:13,display:"block",marginBottom:4 }}>{label}</label>
                {type==="textarea"
                  ? <textarea value={form[field]||""} onChange={e=>setForm(f=>({...f,[field]:e.target.value}))} style={{ width:"100%",background:"#0d0d1a",border:"1px solid #2a2a45",borderRadius:8,color:"#f0f0f0",fontSize:14,padding:"10px 12px",boxSizing:"border-box",minHeight:80,resize:"vertical",fontFamily:"inherit",outline:"none" }} />
                  : <input type="text" value={form[field]||""} onChange={e=>setForm(f=>({...f,[field]:e.target.value}))} style={{ width:"100%",background:"#0d0d1a",border:"1px solid #2a2a45",borderRadius:8,color:"#f0f0f0",fontSize:14,padding:"10px 12px",boxSizing:"border-box",outline:"none" }} />
                }
              </div>
            ))}
            <div style={{ marginBottom:14 }}>
              <label style={{ color:"#94a3b8",fontSize:13,display:"block",marginBottom:4 }}>Theme</label>
              <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
                {Object.entries({
                  "purple-pink":"💜 Purple","orange-red":"🔥 Orange","green-teal":"💚 Green","blue-cyan":"💙 Blue","teal-blue":"🌊 Teal"
                }).map(([val,label])=>(
                  <button key={val} onClick={()=>setForm(f=>({...f,background_gradient:val}))} style={{ padding:"6px 12px",background:form.background_gradient===val?"#2a1a3e":"#0d0d1a",border:`1px solid ${form.background_gradient===val?"#c084fc":"#2a2a45"}`,borderRadius:20,color:form.background_gradient===val?"#c084fc":"#94a3b8",fontSize:12,cursor:"pointer" }}>{label}</button>
                ))}
              </div>
            </div>
            <div style={{ display:"flex",gap:10 }}>
              <button onClick={saveProfile} disabled={saving} style={{ flex:1,padding:"10px",background:"linear-gradient(135deg,#c084fc,#22d3ee)",border:"none",borderRadius:10,color:"#000",fontWeight:700,cursor:"pointer" }}>{saving?"Saving...":"Save"}</button>
              <button onClick={()=>setEditing(false)} style={{ flex:1,padding:"10px",background:"#2a2a45",border:"none",borderRadius:10,color:"#f0f0f0",fontWeight:700,cursor:"pointer" }}>Cancel</button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display:"flex",gap:2,borderBottom:"1px solid #2a2a45",marginBottom:16 }}>
          {["posts","wall"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{ padding:"10px 20px",background:"transparent",border:"none",borderBottom:`2px solid ${tab===t?"#c084fc":"transparent"}`,color:tab===t?"#c084fc":"#64748b",fontWeight:600,cursor:"pointer",fontSize:14,textTransform:"capitalize" }}>{t==="posts"?"📝 Posts":"📌 Wall"}</button>
          ))}
        </div>

        {tab==="posts" && (
          posts.length===0
            ? <div style={{ textAlign:"center",padding:32,color:"#64748b" }}>No posts yet.</div>
            : posts.map(p=>(
              <div key={p.id} style={{ background:"#16162a",border:"1px solid #2a2a45",borderRadius:12,padding:16,marginBottom:12 }}>
                {p.content && <div style={{ fontSize:14,color:"#cbd5e1",lineHeight:1.6 }}>{p.content}</div>}
                {p.image_url && <img src={p.image_url} alt="" style={{ width:"100%",borderRadius:8,marginTop:8,maxHeight:300,objectFit:"cover" }} onError={e=>e.target.style.display="none"} />}
                <div style={{ marginTop:8,color:"#64748b",fontSize:12 }}>💜 {p.likes_count||0} · 💬 {p.comments_count||0}</div>
              </div>
            ))
        )}

        {tab==="wall" && (
          <div>
            {wall.length===0
              ? <div style={{ textAlign:"center",padding:32,color:"#64748b" }}>No wall posts yet.</div>
              : wall.map(w=>(
                <div key={w.id} style={{ background:"#16162a",border:"1px solid #2a2a45",borderRadius:12,padding:14,marginBottom:10 }}>
                  <div style={{ fontWeight:600,fontSize:13,marginBottom:4 }}>{w.author_name}</div>
                  <div style={{ color:"#94a3b8",fontSize:14 }}>{w.content}</div>
                </div>
              ))
            }
          </div>
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
