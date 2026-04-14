import { useState, useEffect, Component } from "react";
import { Profile, Post, WallPost, Friend } from "../api/entities";
import { useNavigate } from "react-router-dom";

// ── React Error Boundary (catches render-time crashes) ─────────
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { console.error("MyProfile crash:", error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight:"100vh",background:"#0d0d1a",color:"#f0f0f0",fontFamily:"'Segoe UI',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:20,padding:32,textAlign:"center" }}>
          <div style={{ fontSize:60 }}>⚠️</div>
          <div style={{ fontWeight:700,fontSize:20 }}>Something went wrong</div>
          <div style={{ color:"#64748b",fontSize:14,maxWidth:300,lineHeight:1.6 }}>We hit an unexpected error loading your profile.</div>
          <button onClick={() => { this.setState({ hasError:false, error:null }); window.location.reload(); }}
            style={{ padding:"12px 32px",background:"linear-gradient(135deg,#c084fc,#22d3ee)",border:"none",borderRadius:20,color:"#000",fontWeight:700,fontSize:15,cursor:"pointer" }}>
            Reload Page
          </button>
          <button onClick={() => window.location.href = "/Home"}
            style={{ padding:"10px 24px",background:"transparent",border:"1px solid #2a2a45",borderRadius:20,color:"#64748b",fontSize:14,cursor:"pointer" }}>
            ← Back to Feed
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ── Helpers ────────────────────────────────────────────────────
function injectGA(id) {
  try {
    if (localStorage.getItem("os2_analyticsConsent") !== "true") return;
    if (document.getElementById(`ga-${id}`)) return;
    const s1 = document.createElement("script"); s1.id = `ga-${id}`; s1.async = true;
    s1.src = `https://www.googletagmanager.com/gtag/js?id=${id}`; document.head.appendChild(s1);
    const s2 = document.createElement("script");
    s2.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","${id}",{"anonymize_ip":true});`;
    document.head.appendChild(s2);
  } catch(e) {}
}
function safeLS(key)       { try { return localStorage.getItem(key); } catch(e) { return null; } }
function getMyEmail()      { return safeLS("os2_email") || null; }
function getMyName()       { return safeLS("os2_name") || "Guest"; }
function isLoggedIn()      { return !!safeLS("os2_email"); }

const NAV = [
  { icon:"🏠", label:"Feed",     path:"/Home" },
  { icon:"🔍", label:"Discover", path:"/Discover" },
  { icon:"✉️", label:"Messages", path:"/Messages" },
  { icon:"🔔", label:"Alerts",   path:"/Notifications" },
  { icon:"👤", label:"Profile",  path:"/MyProfile" },
];

const GRADIENTS = {
  "purple-pink":"linear-gradient(135deg,#c084fc,#ec4899)",
  "orange-red":"linear-gradient(135deg,#f97316,#ef4444)",
  "green-teal":"linear-gradient(135deg,#22c55e,#14b8a6)",
  "blue-cyan":"linear-gradient(135deg,#3b82f6,#22d3ee)",
  "teal-blue":"linear-gradient(135deg,#14b8a6,#3b82f6)",
  "default":"linear-gradient(135deg,#c084fc,#22d3ee)",
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

// ── Inner component (wrapped by boundary) ─────────────────────
function MyProfileInner() {
  const [profile,   setProfile]   = useState(null);
  const [posts,     setPosts]     = useState([]);
  const [wall,      setWall]      = useState([]);
  const [friends,   setFriends]   = useState([]);
  const [tab,       setTab]       = useState("posts");
  const [editing,   setEditing]   = useState(false);
  const [form,      setForm]      = useState({});
  const [saving,    setSaving]    = useState(false);
  const [loading,   setLoading]   = useState(true);
  const [loadErr,   setLoadErr]   = useState(null);
  const [wallDraft, setWallDraft] = useState("");
  const [postingW,  setPostingW]  = useState(false);
  const navigate   = useNavigate();
  const loggedIn   = isLoggedIn();
  const myEmail    = getMyEmail();

  useEffect(() => {
    injectGA("G-1N8GD2WM6L");
    if (loggedIn) loadProfile();
    else setLoading(false);
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    setLoadErr(null);
    let me = null, myPosts = [], myWall = [], myFriends = [];

    try {
      const r = await Profile.filter({ user_email: myEmail });
      me = Array.isArray(r) && r.length > 0 ? r[0] : null;
    } catch(e) { console.error("profile:", e); }

    try {
      const r = await Post.filter({ author_email: myEmail });
      myPosts = Array.isArray(r) ? r.sort((a,b)=>new Date(b.created_date||0)-new Date(a.created_date||0)) : [];
    } catch(e) { console.error("posts:", e); }

    try {
      const r = await WallPost.filter({ profile_email: myEmail });
      myWall = Array.isArray(r) ? r.sort((a,b)=>new Date(b.created_date||0)-new Date(a.created_date||0)) : [];
    } catch(e) { console.error("wall:", e); }

    try {
      const r = await Friend.list();
      myFriends = Array.isArray(r)
        ? r.filter(f => f && f.status==="accepted" && (f.requester_email===myEmail||f.receiver_email===myEmail))
        : [];
    } catch(e) { console.error("friends:", e); }

    setProfile(me);
    setForm(me ? { ...me } : { user_email: myEmail, display_name: getMyName() });
    setPosts(myPosts);
    setWall(myWall);
    setFriends(myFriends);
    setLoading(false);
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const data = { ...form, user_email: myEmail };
      if (profile?.id) { await Profile.update(profile.id, data); setProfile({...profile,...data}); }
      else              { const c = await Profile.create(data); setProfile(c); }
      try { if (form.display_name) localStorage.setItem("os2_name", form.display_name); } catch(e) {}
      setEditing(false);
    } catch(e) { console.error(e); }
    setSaving(false);
  };

  const postOnWall = async () => {
    if (!wallDraft.trim()) return;
    setPostingW(true);
    try {
      const w = await WallPost.create({ profile_email:myEmail, author_email:myEmail, author_name:getMyName(), content:wallDraft.trim() });
      setWall(prev=>[w,...prev]);
      setWallDraft("");
    } catch(e) { console.error(e); }
    setPostingW(false);
  };

  const logout = () => {
    try { localStorage.clear(); } catch(e) {}
    navigate("/OurSpace");
  };

  const bg   = GRADIENTS[profile?.background_gradient] || GRADIENTS.default;
  const top8 = (friends||[]).slice(0,8);

  if (loading) return (
    <div style={{ minHeight:"100vh",background:"#0d0d1a",color:"#64748b",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Segoe UI',sans-serif",flexDirection:"column",gap:12 }}>
      <div style={{ fontSize:32 }}>⏳</div><div>Loading your profile...</div>
    </div>
  );

  if (loadErr) return (
    <div style={{ minHeight:"100vh",background:"#0d0d1a",color:"#f0f0f0",fontFamily:"'Segoe UI',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:20,padding:32,textAlign:"center" }}>
      <div style={{ fontSize:60 }}>⚠️</div>
      <div style={{ fontWeight:700,fontSize:20 }}>Couldn't load profile</div>
      <div style={{ color:"#64748b",fontSize:14,maxWidth:300 }}>{loadErr}</div>
      <button onClick={loadProfile} style={{ padding:"12px 32px",background:"linear-gradient(135deg,#c084fc,#22d3ee)",border:"none",borderRadius:20,color:"#000",fontWeight:700,fontSize:15,cursor:"pointer" }}>Try Again</button>
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
        {profile?.cover_photo && <img src={profile.cover_photo} alt="" style={{ width:"100%",height:"100%",objectFit:"cover",position:"absolute",inset:0 }} onError={e=>e.target.style.display="none"} />}
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
          <button onClick={logout} style={{ background:"none",border:"1px solid #2a2a45",borderRadius:20,color:"#64748b",padding:"6px 14px",fontSize:12,cursor:"pointer",marginBottom:4,flexShrink:0 }}>Sign Out</button>
        </div>

        {/* Status chips */}
        <div style={{ display:"flex",flexWrap:"wrap",gap:8,marginBottom:12 }}>
          {profile?.is_online    && <span style={{ background:"#0f2a1e",border:"1px solid #4ade8040",color:"#4ade80",fontSize:12,padding:"3px 12px",borderRadius:20 }}>● Online</span>}
          {profile?.mood         && <span style={{ background:"#16162a",border:"1px solid #c084fc30",color:"#c084fc",fontSize:12,padding:"3px 12px",borderRadius:20 }}>{profile.mood}</span>}
          {profile?.song_playing && <span style={{ background:"#16162a",border:"1px solid #22d3ee30",color:"#22d3ee",fontSize:12,padding:"3px 12px",borderRadius:20 }}>🎵 {profile.song_playing}</span>}
        </div>

        {profile?.about_me && <div style={{ color:"#94a3b8",fontSize:14,lineHeight:1.6,marginBottom:12 }}>{profile.about_me}</div>}

        {Array.isArray(profile?.interests) && profile.interests.length > 0 && (
          <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginBottom:14 }}>
            {profile.interests.map((i,idx) => <span key={idx} style={{ background:"#1a1a35",border:"1px solid #2a2a45",color:"#94a3b8",fontSize:12,padding:"3px 10px",borderRadius:20 }}>{i}</span>)}
          </div>
        )}

        {/* Top friends strip */}
        {top8.length > 0 && (
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:11,color:"#64748b",marginBottom:8,textTransform:"uppercase",letterSpacing:1,fontWeight:700 }}>Friends · {friends.length}</div>
            <div style={{ display:"flex",gap:10,overflowX:"auto",paddingBottom:4 }}>
              {top8.map(f => {
                const other  = f.requester_email===myEmail ? f.receiver_email||""  : f.requester_email||"";
                const name   = f.requester_email===myEmail ? f.receiver_name||""   : f.requester_name||"";
                const avatar = f.requester_email===myEmail ? f.receiver_avatar||"" : f.requester_avatar||"";
                return (
                  <div key={f.id} onClick={() => navigate(`/Profile?email=${other}`)} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"pointer",flexShrink:0 }}>
                    <div style={{ width:44,height:44,borderRadius:"50%",background:"linear-gradient(135deg,#c084fc,#22d3ee)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,fontWeight:700,overflow:"hidden" }}>
                      {avatar ? <img src={avatar} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} onError={e=>e.target.style.display="none"} /> : (name?.[0]||"?")}
                    </div>
                    <span style={{ fontSize:10,color:"#94a3b8",maxWidth:44,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{(name||"User").split(" ")[0]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Edit form */}
        {editing && (
          <div style={{ background:"#16162a",borderRadius:16,padding:18,marginBottom:18,border:"1px solid #2a2a45" }}>
            <div style={{ fontWeight:700,fontSize:15,marginBottom:14,color:"#c084fc" }}>✏️ Edit Profile</div>
            {[
              { label:"Display Name",    key:"display_name",  placeholder:"Your name" },
              { label:"Headline",        key:"headline",      placeholder:"What you're about..." },
              { label:"About Me",        key:"about_me",      placeholder:"Tell your story...", area:true },
              { label:"Avatar URL",      key:"avatar_url",    placeholder:"https://..." },
              { label:"Cover Photo URL", key:"cover_photo",   placeholder:"https://..." },
              { label:"Now Playing 🎵",  key:"song_playing",  placeholder:"Song — Artist" },
            ].map(({label,key,placeholder,area}) => (
              <div key={key} style={{ marginBottom:12 }}>
                <label style={{ fontSize:12,color:"#64748b",display:"block",marginBottom:4 }}>{label}</label>
                {area
                  ? <textarea value={form[key]||""} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))} placeholder={placeholder} rows={3}
                      style={{ width:"100%",background:"#0d0d1a",border:"1px solid #2a2a45",borderRadius:10,color:"#f0f0f0",fontSize:13,padding:"10px 12px",resize:"vertical",boxSizing:"border-box",outline:"none" }} />
                  : <input value={form[key]||""} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))} placeholder={placeholder}
                      style={{ width:"100%",background:"#0d0d1a",border:"1px solid #2a2a45",borderRadius:10,color:"#f0f0f0",fontSize:13,padding:"10px 12px",boxSizing:"border-box",outline:"none" }} />
                }
              </div>
            ))}
            <div style={{ marginBottom:12 }}>
              <label style={{ fontSize:12,color:"#64748b",display:"block",marginBottom:6 }}>Mood</label>
              <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
                {MOOD_OPTIONS.map(m => (
                  <button key={m} onClick={() => setForm(f=>({...f,mood:f.mood===m?"":m}))}
                    style={{ padding:"4px 12px",borderRadius:20,border:`1px solid ${form.mood===m?"#c084fc":"#2a2a45"}`,background:form.mood===m?"#2a1a3e":"transparent",color:form.mood===m?"#c084fc":"#94a3b8",fontSize:12,cursor:"pointer" }}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom:12 }}>
              <label style={{ fontSize:12,color:"#64748b",display:"block",marginBottom:6 }}>Interests</label>
              <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
                {INTEREST_OPTIONS.map(i => {
                  const sel = Array.isArray(form.interests) && form.interests.includes(i);
                  return (
                    <button key={i} onClick={() => setForm(f => {
                      const cur = Array.isArray(f.interests) ? f.interests : [];
                      return {...f, interests: sel ? cur.filter(x=>x!==i) : [...cur,i]};
                    })} style={{ padding:"4px 12px",borderRadius:20,border:`1px solid ${sel?"#c084fc":"#2a2a45"}`,background:sel?"#2a1a3e":"transparent",color:sel?"#c084fc":"#94a3b8",fontSize:12,cursor:"pointer" }}>
                      {i}
                    </button>
                  );
                })}
              </div>
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:12,color:"#64748b",display:"block",marginBottom:6 }}>Profile Theme</label>
              <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
                {Object.entries(GRADIENTS).filter(([k])=>k!=="default").map(([key,grad]) => (
                  <button key={key} onClick={() => setForm(f=>({...f,background_gradient:key}))}
                    style={{ width:36,height:36,borderRadius:"50%",background:grad,border:`3px solid ${form.background_gradient===key?"#c084fc":"transparent"}`,cursor:"pointer" }} />
                ))}
              </div>
            </div>
            <div style={{ display:"flex",gap:10 }}>
              <button onClick={saveProfile} disabled={saving}
                style={{ flex:1,padding:"11px",background:"linear-gradient(135deg,#c084fc,#22d3ee)",border:"none",borderRadius:12,color:"#000",fontWeight:800,fontSize:14,cursor:saving?"not-allowed":"pointer" }}>
                {saving?"Saving…":"Save Profile ✓"}
              </button>
              <button onClick={() => setEditing(false)} style={{ padding:"11px 18px",background:"transparent",border:"1px solid #2a2a45",borderRadius:12,color:"#64748b",fontSize:14,cursor:"pointer" }}>Cancel</button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display:"flex",borderBottom:"1px solid #2a2a45",marginBottom:16 }}>
          {[["posts","📝 Posts"],["wall","📌 Wall"],["friends","👥 Friends"]].map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)}
              style={{ padding:"10px 18px",background:"transparent",border:"none",borderBottom:`2px solid ${tab===id?"#c084fc":"transparent"}`,color:tab===id?"#c084fc":"#64748b",fontWeight:600,cursor:"pointer",fontSize:14 }}>
              {label}
            </button>
          ))}
        </div>

        {tab==="posts" && (
          posts.length===0
            ? <div style={{ textAlign:"center",padding:32,color:"#64748b" }}><div style={{ fontSize:40,marginBottom:10 }}>📝</div><div>No posts yet. Share something on the Feed!</div></div>
            : posts.map(p => (
              <div key={p.id} style={{ background:"#16162a",borderRadius:14,padding:16,marginBottom:12,border:"1px solid #2a2a45" }}>
                {p.title   && <div style={{ fontWeight:700,fontSize:15,marginBottom:4 }}>{p.title}</div>}
                {p.content && <div style={{ color:"#cbd5e1",fontSize:14,lineHeight:1.6 }}>{p.content}</div>}
                {p.image_url && <img src={p.image_url} alt="" style={{ width:"100%",borderRadius:10,marginTop:8,maxHeight:300,objectFit:"cover" }} onError={e=>e.target.style.display="none"} />}
                <div style={{ marginTop:8,display:"flex",gap:16,color:"#64748b",fontSize:12 }}>
                  <span>💜 {p.likes_count||0}</span><span>💬 {p.comments_count||0}</span>
                  <span style={{ marginLeft:"auto" }}>{p.created_date?new Date(p.created_date).toLocaleDateString("en-US",{month:"short",day:"numeric"}):""}</span>
                </div>
              </div>
            ))
        )}

        {tab==="wall" && (
          <div>
            <div style={{ display:"flex",gap:10,marginBottom:14,alignItems:"center" }}>
              <input value={wallDraft} onChange={e=>setWallDraft(e.target.value)} onKeyDown={e=>e.key==="Enter"&&postOnWall()} placeholder="Leave a note on your wall..."
                style={{ flex:1,background:"#16162a",border:"1px solid #2a2a45",borderRadius:24,color:"#f0f0f0",fontSize:13,padding:"10px 16px",outline:"none" }} />
              <button onClick={postOnWall} disabled={postingW||!wallDraft.trim()} style={{ padding:"10px 16px",background:"linear-gradient(135deg,#c084fc,#22d3ee)",border:"none",borderRadius:20,color:"#000",fontWeight:700,fontSize:13,cursor:"pointer" }}>Post</button>
            </div>
            {wall.length===0
              ? <div style={{ textAlign:"center",padding:32,color:"#64748b" }}>No wall posts yet.</div>
              : wall.map(w => (
                <div key={w.id} style={{ background:"#16162a",borderRadius:14,padding:14,marginBottom:10,border:"1px solid #2a2a45" }}>
                  <div style={{ fontWeight:700,fontSize:13,marginBottom:4 }}>{w.author_name||"Unknown"}</div>
                  <div style={{ color:"#cbd5e1",fontSize:14,lineHeight:1.6 }}>{w.content}</div>
                  <div style={{ marginTop:6,fontSize:11,color:"#475569" }}>{w.created_date?new Date(w.created_date).toLocaleDateString():""}</div>
                </div>
              ))
            }
          </div>
        )}

        {tab==="friends" && (
          friends.length===0
            ? <div style={{ textAlign:"center",padding:40,color:"#64748b" }}>
                <div style={{ fontSize:48,marginBottom:12 }}>👥</div>
                <div style={{ fontWeight:700,fontSize:16,marginBottom:8 }}>No friends yet</div>
                <div style={{ fontSize:13,marginBottom:20 }}>Go discover people and send friend requests!</div>
                <button onClick={() => navigate("/Discover")} style={{ padding:"10px 24px",background:"linear-gradient(135deg,#c084fc,#22d3ee)",border:"none",borderRadius:24,color:"#000",fontWeight:700,cursor:"pointer",fontSize:13 }}>Find People →</button>
              </div>
            : friends.map(f => {
                const other  = f.requester_email===myEmail ? f.receiver_email||""  : f.requester_email||"";
                const name   = f.requester_email===myEmail ? f.receiver_name||""   : f.requester_name||"";
                const avatar = f.requester_email===myEmail ? f.receiver_avatar||"" : f.requester_avatar||"";
                return (
                  <div key={f.id} onClick={() => navigate(`/Profile?email=${other}`)}
                    style={{ background:"#16162a",borderRadius:14,padding:14,marginBottom:10,border:"1px solid #2a2a45",cursor:"pointer",display:"flex",gap:12,alignItems:"center" }}>
                    <div style={{ width:44,height:44,borderRadius:"50%",background:"linear-gradient(135deg,#c084fc,#22d3ee)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,fontWeight:700,overflow:"hidden",flexShrink:0 }}>
                      {avatar ? <img src={avatar} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} onError={e=>e.target.style.display="none"} /> : (name?.[0]||"?")}
                    </div>
                    <div style={{ fontWeight:700,fontSize:14 }}>{name||other}</div>
                    <span style={{ marginLeft:"auto",color:"#64748b",fontSize:16 }}>›</span>
                  </div>
                );
              })
        )}
      </div>

      <BottomNav navigate={navigate} />
    </div>
  );
}

// ── Export wrapped in error boundary ──────────────────────────
export default function MyProfile() {
  return <ErrorBoundary><MyProfileInner /></ErrorBoundary>;
}
