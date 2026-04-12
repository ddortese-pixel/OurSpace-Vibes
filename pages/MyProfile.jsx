import { useState, useEffect } from "react";
import { Profile, Post, WallPost, Friend } from "../api/entities";
import { useNavigate } from "react-router-dom";

function injectGA(id) {
  if (document.getElementById(`ga-${id}`)) return;
  const s1 = document.createElement("script"); s1.id = `ga-${id}`; s1.async = true;
  s1.src = `https://www.googletagmanager.com/gtag/js?id=${id}`; document.head.appendChild(s1);
  const s2 = document.createElement("script");
  s2.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","${id}");`;
  document.head.appendChild(s2);
}

function getMyEmail() { return localStorage.getItem("os2_email") || null; }
function getMyName()  { return localStorage.getItem("os2_name")  || "Guest"; }
function isLoggedIn() { return !!localStorage.getItem("os2_email"); }

const NAV = [
  { icon: "🏠", label: "Feed",     path: "/Home" },
  { icon: "🔍", label: "Discover", path: "/Discover" },
  { icon: "✉️", label: "Messages", path: "/Messages" },
  { icon: "🔔", label: "Alerts",   path: "/Notifications" },
  { icon: "👤", label: "Profile",  path: "/MyProfile" },
];

const GRADIENTS = {
  "purple-pink": "linear-gradient(135deg,#c084fc,#ec4899)",
  "orange-red":  "linear-gradient(135deg,#f97316,#ef4444)",
  "green-teal":  "linear-gradient(135deg,#22c55e,#14b8a6)",
  "blue-cyan":   "linear-gradient(135deg,#3b82f6,#22d3ee)",
  "teal-blue":   "linear-gradient(135deg,#14b8a6,#3b82f6)",
  "default":     "linear-gradient(135deg,#c084fc,#22d3ee)",
};

const MOOD_OPTIONS = ["😊 Happy","😎 Chill","🔥 Hyped","💭 Thoughtful","😴 Tired","✨ Glowing","💜 Loved","🎵 Vibing","😂 Laughing","🌙 Night Mode"];
const INTEREST_OPTIONS = ["🎨 Art","🎵 Music","🎮 Gaming","📚 Books","💻 Tech","🌿 Nature","✍️ Writing","🎭 Comedy","🧘 Wellness","🛹 Sports","🎬 Film","🍕 Food","✈️ Travel","🌸 Fashion","🏋️ Fitness","🎤 Rap","🎸 Rock","📸 Photography"];

function BottomNav({ navigate }) {
  const path = window.location.pathname;
  return (
    <div style={{ position:"fixed",bottom:0,left:0,right:0,background:"#0d0d1aee",backdropFilter:"blur(12px)",borderTop:"1px solid #2a2a45",display:"flex",justifyContent:"space-around",padding:"10px 0 12px",zIndex:100 }}>
      {NAV.map(item => {
        const active = path === item.path;
        return (
          <button key={item.path} onClick={() => navigate(item.path)}
            style={{ background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"4px 12px" }}>
            <span style={{ fontSize:22,opacity:active?1:0.5 }}>{item.icon}</span>
            <span style={{ fontSize:10,color:active?"#c084fc":"#475569",fontWeight:active?700:400 }}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function MyProfile() {
  const [profile,  setProfile]  = useState(null);
  const [posts,    setPosts]    = useState([]);
  const [wall,     setWall]     = useState([]);
  const [friends,  setFriends]  = useState([]);
  const [tab,      setTab]      = useState("posts");
  const [editing,  setEditing]  = useState(false);
  const [form,     setForm]     = useState({});
  const [saving,   setSaving]   = useState(false);
  const [loading,  setLoading]  = useState(true);
  const [wallDraft,setWallDraft]= useState("");
  const [postingW, setPostingW] = useState(false);
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  const myEmail  = getMyEmail();

  useEffect(() => {
    injectGA("G-1N8GD2WM6L");
    if (loggedIn) loadProfile();
    else setLoading(false);
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const [profiles, myPosts, myWall, allFriends] = await Promise.all([
        Profile.filter({ user_email: myEmail }),
        Post.filter({ author_email: myEmail }),
        WallPost.filter({ profile_email: myEmail }),
        Friend.list().catch(() => []),
      ]);
      const me = profiles[0] || null;
      setProfile(me);
      setForm(me || { user_email: myEmail, display_name: getMyName() });
      setPosts((myPosts || []).sort((a,b) => new Date(b.created_date) - new Date(a.created_date)));
      setWall((myWall  || []).sort((a,b) => new Date(b.created_date) - new Date(a.created_date)));
      setFriends((allFriends||[]).filter(f => f.status==="accepted" && (f.requester_email===myEmail||f.receiver_email===myEmail)));
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const data = { ...form, user_email: myEmail };
      if (profile?.id) { await Profile.update(profile.id, data); setProfile({...profile,...data}); }
      else              { const c = await Profile.create(data); setProfile(c); }
      if (form.display_name) localStorage.setItem("os2_name", form.display_name);
      setEditing(false);
    } catch(e) { console.error(e); }
    setSaving(false);
  };

  const postOnWall = async () => {
    if (!wallDraft.trim()) return;
    setPostingW(true);
    try {
      const w = await WallPost.create({ profile_email:myEmail, author_email:myEmail, author_name:getMyName(), content:wallDraft.trim() });
      setWall(prev => [w,...prev]);
      setWallDraft("");
    } catch(e) { console.error(e); }
    setPostingW(false);
  };

  const logout = () => { localStorage.clear(); navigate("/OurSpaceOnboarding"); };

  const bg = GRADIENTS[profile?.background_gradient] || GRADIENTS.default;
  const top8 = friends.slice(0,8);

  if (loading) return (
    <div style={{ minHeight:"100vh",background:"#0d0d1a",color:"#64748b",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Segoe UI',sans-serif" }}>
      Loading profile...
    </div>
  );

  if (!loggedIn) return (
    <div style={{ minHeight:"100vh",background:"#0d0d1a",color:"#f0f0f0",fontFamily:"'Segoe UI',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:20,padding:32,textAlign:"center" }}>
      <div style={{ fontSize:72 }}>👤</div>
      <div style={{ fontWeight:900,fontSize:26 }}>Your Space is Waiting</div>
      <div style={{ color:"#64748b",fontSize:15,maxWidth:300,lineHeight:1.6 }}>Join OurSpace 2.0 to create your profile, post, and connect with people.</div>
      <button onClick={() => navigate("/OurSpaceOnboarding")} style={{ padding:"14px 40px",background:"linear-gradient(135deg,#c084fc,#22d3ee)",border:"none",borderRadius:14,color:"#000",fontWeight:800,fontSize:17,cursor:"pointer" }}>Get Started Free</button>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh",background:"#0d0d1a",color:"#f0f0f0",fontFamily:"'Segoe UI',sans-serif",paddingBottom:90 }}>

      {/* Cover */}
      <div style={{ height:160,background:bg,position:"relative" }}>
        {profile?.cover_photo && <img src={profile.cover_photo} alt="" style={{ width:"100%",height:"100%",objectFit:"cover",position:"absolute",inset:0 }} />}
        <div style={{ position:"absolute",inset:0,background:"linear-gradient(to bottom,transparent 50%,rgba(13,13,26,0.9))" }} />
        <button onClick={() => navigate("/Home")} style={{ position:"absolute",top:12,left:12,background:"#00000066",border:"none",borderRadius:20,color:"#fff",padding:"6px 12px",cursor:"pointer",fontSize:13,backdropFilter:"blur(8px)" }}>← Back</button>
        {!editing && <button onClick={() => setEditing(true)} style={{ position:"absolute",top:12,right:12,background:"#00000066",border:"1px solid #ffffff30",borderRadius:20,color:"#fff",padding:"6px 14px",cursor:"pointer",fontSize:13,fontWeight:600,backdropFilter:"blur(8px)" }}>✏️ Edit</button>}
      </div>

      <div style={{ maxWidth:600,margin:"0 auto",padding:"0 16px" }}>

        {/* Avatar + Name */}
        <div style={{ display:"flex",alignItems:"flex-end",gap:16,marginTop:-36,marginBottom:16,justifyContent:"space-between" }}>
          <div style={{ display:"flex",gap:16,alignItems:"flex-end" }}>
            <div style={{ width:80,height:80,borderRadius:"50%",background:"linear-gradient(135deg,#c084fc,#22d3ee)",border:"3px solid #0d0d1a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,fontWeight:700,flexShrink:0,overflow:"hidden" }}>
              {profile?.avatar_url
                ? <img src={profile.avatar_url} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} onError={e=>e.target.style.display="none"} />
                : (profile?.display_name?.[0] || getMyName()?.[0] || "👤")}
            </div>
            <div style={{ paddingBottom:4 }}>
              <div style={{ fontWeight:900,fontSize:22 }}>{profile?.display_name || getMyName()}</div>
              <div style={{ color:"#94a3b8",fontSize:13 }}>{profile?.headline || ""}</div>
            </div>
          </div>
          <button onClick={logout} style={{ background:"none",border:"1px solid #2a2a45",borderRadius:20,color:"#64748b",padding:"6px 14px",fontSize:12,cursor:"pointer",marginBottom:4 }}>Sign Out</button>
        </div>

        {/* Status chips */}
        <div style={{ display:"flex",flexWrap:"wrap",gap:8,marginBottom:12 }}>
          {profile?.is_online && <span style={{ background:"#0f2a1e",border:"1px solid #4ade8040",color:"#4ade80",fontSize:12,padding:"3px 12px",borderRadius:20 }}>● Online</span>}
          {profile?.mood      && <span style={{ background:"#16162a",border:"1px solid #c084fc30",color:"#c084fc",fontSize:12,padding:"3px 12px",borderRadius:20 }}>{profile.mood}</span>}
          {profile?.song_playing && <span style={{ background:"#16162a",border:"1px solid #22d3ee30",color:"#22d3ee",fontSize:12,padding:"3px 12px",borderRadius:20 }}>🎵 {profile.song_playing}</span>}
        </div>

        {profile?.about_me && <div style={{ color:"#94a3b8",fontSize:14,lineHeight:1.6,marginBottom:12 }}>{profile.about_me}</div>}

        {Array.isArray(profile?.interests) && profile.interests.length > 0 && (
          <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginBottom:14 }}>
            {profile.interests.map((i,idx) => <span key={idx} style={{ background:"#1e1a2e",border:"1px solid #c084fc30",color:"#c084fc",fontSize:12,padding:"3px 10px",borderRadius:20 }}>{i}</span>)}
          </div>
        )}

        {/* Stats */}
        <div style={{ display:"flex",gap:24,marginBottom:20,color:"#94a3b8",fontSize:13,padding:"12px 0",borderTop:"1px solid #2a2a45",borderBottom:"1px solid #2a2a45" }}>
          <span><strong style={{ color:"#f0f0f0",fontSize:18 }}>{posts.length}</strong><br/>Posts</span>
          <span><strong style={{ color:"#f0f0f0",fontSize:18 }}>{friends.length}</strong><br/>Friends</span>
          <span><strong style={{ color:"#f0f0f0",fontSize:18 }}>{profile?.profile_views||0}</strong><br/>Views 👁</span>
        </div>

        {/* ── EDIT FORM ── */}
        {editing && (
          <div style={{ background:"#16162a",border:"1px solid #2a2a45",borderRadius:16,padding:20,marginBottom:20 }}>
            <div style={{ fontWeight:700,fontSize:16,marginBottom:16 }}>Edit Profile</div>
            {[["display_name","Display Name","text"],["headline","Headline","text"],["about_me","About Me","textarea"],["avatar_url","Avatar URL","text"],["cover_photo","Cover Photo URL","text"],["song_playing","Song Playing 🎵","text"]].map(([field,label,type]) => (
              <div key={field} style={{ marginBottom:14 }}>
                <label style={{ color:"#94a3b8",fontSize:13,display:"block",marginBottom:4 }}>{label}</label>
                {type==="textarea"
                  ? <textarea value={form[field]||""} onChange={e=>setForm(f=>({...f,[field]:e.target.value}))} rows={3}
                      style={{ width:"100%",background:"#0d0d1a",border:"1px solid #2a2a45",borderRadius:8,color:"#f0f0f0",fontSize:14,padding:"10px 12px",boxSizing:"border-box",resize:"vertical",fontFamily:"inherit",outline:"none" }} />
                  : <input type="text" value={form[field]||""} onChange={e=>setForm(f=>({...f,[field]:e.target.value}))}
                      style={{ width:"100%",background:"#0d0d1a",border:"1px solid #2a2a45",borderRadius:8,color:"#f0f0f0",fontSize:14,padding:"10px 12px",boxSizing:"border-box",outline:"none" }} />
                }
              </div>
            ))}

            {/* Mood */}
            <div style={{ marginBottom:14 }}>
              <label style={{ color:"#94a3b8",fontSize:13,display:"block",marginBottom:6 }}>Current Mood</label>
              <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
                {MOOD_OPTIONS.map(m => (
                  <button key={m} onClick={() => setForm(f=>({...f,mood:f.mood===m?"":m}))}
                    style={{ padding:"5px 12px",background:form.mood===m?"#2a1a3e":"#0d0d1a",border:`1px solid ${form.mood===m?"#c084fc":"#2a2a45"}`,borderRadius:20,color:form.mood===m?"#c084fc":"#64748b",fontSize:12,cursor:"pointer" }}>
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div style={{ marginBottom:14 }}>
              <label style={{ color:"#94a3b8",fontSize:13,display:"block",marginBottom:6 }}>Interests (up to 8)</label>
              <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
                {INTEREST_OPTIONS.map(int => {
                  const selected = Array.isArray(form.interests) && form.interests.includes(int);
                  return (
                    <button key={int} onClick={() => setForm(f => {
                      const curr = Array.isArray(f.interests) ? f.interests : [];
                      return {...f, interests: selected ? curr.filter(i=>i!==int) : curr.length<8 ? [...curr,int] : curr};
                    })}
                      style={{ padding:"5px 12px",background:selected?"#2a1a3e":"#0d0d1a",border:`1px solid ${selected?"#c084fc":"#2a2a45"}`,borderRadius:20,color:selected?"#c084fc":"#64748b",fontSize:12,cursor:"pointer" }}>
                      {int}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Theme */}
            <div style={{ marginBottom:16 }}>
              <label style={{ color:"#94a3b8",fontSize:13,display:"block",marginBottom:6 }}>Cover Theme</label>
              <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
                {Object.entries({"purple-pink":"💜 Purple","orange-red":"🔥 Sunset","green-teal":"💚 Forest","blue-cyan":"💙 Ocean","teal-blue":"🌊 Teal"}).map(([val,label]) => (
                  <button key={val} onClick={() => setForm(f=>({...f,background_gradient:val}))}
                    style={{ padding:"6px 14px",background:form.background_gradient===val?"#2a1a3e":"#0d0d1a",border:`1px solid ${form.background_gradient===val?"#c084fc":"#2a2a45"}`,borderRadius:20,color:form.background_gradient===val?"#c084fc":"#94a3b8",fontSize:12,cursor:"pointer" }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display:"flex",gap:10 }}>
              <button onClick={saveProfile} disabled={saving}
                style={{ flex:1,padding:"12px",background:"linear-gradient(135deg,#c084fc,#22d3ee)",border:"none",borderRadius:10,color:"#000",fontWeight:700,fontSize:15,cursor:"pointer",opacity:saving?0.7:1 }}>
                {saving?"Saving...":"Save Profile"}
              </button>
              <button onClick={() => setEditing(false)}
                style={{ flex:1,padding:"12px",background:"#2a2a45",border:"none",borderRadius:10,color:"#f0f0f0",fontWeight:700,fontSize:15,cursor:"pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ── TOP 8 ── */}
        {top8.length > 0 && (
          <div style={{ background:"#16162a",border:"1px solid #2a2a45",borderRadius:16,padding:16,marginBottom:16 }}>
            <div style={{ fontWeight:700,fontSize:14,marginBottom:12,color:"#94a3b8" }}>👥 Top Friends</div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10 }}>
              {top8.map((f,i) => {
                const fEmail  = f.requester_email===myEmail ? f.receiver_email  : f.requester_email;
                const fName   = f.requester_email===myEmail ? f.receiver_name   : f.requester_name;
                const fAvatar = f.requester_email===myEmail ? f.receiver_avatar : f.requester_avatar;
                return (
                  <div key={i} onClick={() => navigate(`/Profile?email=${fEmail}`)} style={{ cursor:"pointer",textAlign:"center" }}>
                    <div style={{ width:52,height:52,borderRadius:12,background:"linear-gradient(135deg,#c084fc,#22d3ee)",margin:"0 auto 4px",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:20,overflow:"hidden",border:"2px solid #2a2a45" }}>
                      {fAvatar ? <img src={fAvatar} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} onError={e=>e.target.style.display="none"} /> : (fName?.[0]||"?")}
                    </div>
                    <div style={{ fontSize:11,color:"#94a3b8",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{fName?.split(" ")[0]||"Friend"}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TABS ── */}
        <div style={{ display:"flex",gap:2,borderBottom:"1px solid #2a2a45",marginBottom:16 }}>
          {[["posts","📝 Posts"],["wall","📌 Wall"],["photos","📸 Photos"]].map(([id,label]) => (
            <button key={id} onClick={() => setTab(id)}
              style={{ padding:"10px 20px",background:"transparent",border:"none",borderBottom:`2px solid ${tab===id?"#c084fc":"transparent"}`,color:tab===id?"#c084fc":"#64748b",fontWeight:600,cursor:"pointer",fontSize:14 }}>
              {label}
            </button>
          ))}
        </div>

        {/* POSTS */}
        {tab==="posts" && (
          posts.length===0
            ? <div style={{ textAlign:"center",padding:"32px 0",color:"#64748b" }}>
                <div style={{ fontSize:40,marginBottom:8 }}>📝</div>
                <div>No posts yet.</div>
                <button onClick={() => navigate("/Home")} style={{ marginTop:12,padding:"8px 20px",background:"linear-gradient(135deg,#c084fc,#22d3ee)",border:"none",borderRadius:20,color:"#000",fontWeight:700,cursor:"pointer",fontSize:13 }}>Go Post →</button>
              </div>
            : posts.map(p => (
              <div key={p.id} style={{ background:"#16162a",border:"1px solid #2a2a45",borderRadius:12,padding:16,marginBottom:12 }}>
                {p.title   && <div style={{ fontWeight:700,fontSize:16,marginBottom:6 }}>{p.title}</div>}
                {p.content && <div style={{ fontSize:14,color:"#cbd5e1",lineHeight:1.6,marginBottom:p.image_url?10:0,whiteSpace:"pre-wrap" }}>{p.content}</div>}
                {p.image_url && <img src={p.image_url} alt="" style={{ width:"100%",borderRadius:8,maxHeight:300,objectFit:"cover" }} onError={e=>e.target.style.display="none"} />}
                <div style={{ marginTop:8,color:"#64748b",fontSize:12,display:"flex",gap:12 }}>
                  <span>💜 {p.likes_count||0}</span><span>💬 {p.comments_count||0}</span>
                  <span style={{ marginLeft:"auto" }}>{p.created_date ? new Date(p.created_date).toLocaleDateString("en-US",{month:"short",day:"numeric"}) : ""}</span>
                </div>
              </div>
            ))
        )}

        {/* WALL */}
        {tab==="wall" && (
          <div>
            <div style={{ background:"#16162a",border:"1px solid #2a2a45",borderRadius:12,padding:14,marginBottom:14 }}>
              <textarea value={wallDraft} onChange={e=>setWallDraft(e.target.value)} placeholder="Leave yourself a note..." rows={3}
                style={{ width:"100%",background:"#0d0d1a",border:"1px solid #2a2a45",borderRadius:8,color:"#f0f0f0",fontSize:14,padding:"10px 12px",outline:"none",resize:"none",boxSizing:"border-box",marginBottom:10,fontFamily:"inherit" }} />
              <button onClick={postOnWall} disabled={!wallDraft.trim()||postingW}
                style={{ padding:"8px 18px",background:wallDraft.trim()?"linear-gradient(135deg,#c084fc,#22d3ee)":"#2a2a45",border:"none",borderRadius:20,color:wallDraft.trim()?"#000":"#64748b",fontWeight:700,fontSize:13,cursor:"pointer" }}>
                {postingW?"Posting...":"📌 Post"}
              </button>
            </div>
            {wall.length===0
              ? <div style={{ textAlign:"center",padding:"32px 0",color:"#64748b" }}>No wall posts yet.</div>
              : wall.map(w => (
                <div key={w.id} style={{ background:"#16162a",border:"1px solid #2a2a45",borderRadius:12,padding:14,marginBottom:10 }}>
                  <div style={{ display:"flex",gap:10,alignItems:"flex-start" }}>
                    <div style={{ width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,#c084fc,#22d3ee)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:14,flexShrink:0 }}>{w.author_name?.[0]||"?"}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700,fontSize:13,color:"#c084fc",marginBottom:4 }}>{w.author_name}</div>
                      <div style={{ color:"#94a3b8",fontSize:14,lineHeight:1.6 }}>{w.content}</div>
                      <div style={{ color:"#475569",fontSize:11,marginTop:4 }}>{w.created_date ? new Date(w.created_date).toLocaleDateString("en-US",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}) : ""}</div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* PHOTOS */}
        {tab==="photos" && (
          posts.filter(p=>p.image_url).length===0
            ? <div style={{ textAlign:"center",padding:"32px 0",color:"#64748b" }}>
                <div style={{ fontSize:40,marginBottom:8 }}>📸</div>
                <div>No photos yet — post something with an image!</div>
              </div>
            : <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6 }}>
                {posts.filter(p=>p.image_url).map(p => (
                  <div key={p.id} style={{ aspectRatio:"1",borderRadius:8,overflow:"hidden",border:"1px solid #2a2a45" }}>
                    <img src={p.image_url} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} onError={e=>e.target.parentElement.style.display="none"} />
                  </div>
                ))}
              </div>
        )}

      </div>
      <BottomNav navigate={navigate} />
    </div>
  );
}
