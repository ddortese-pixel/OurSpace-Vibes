import { useState, useEffect } from "react";
import { Profile, Post, WallPost, Friend, Notification } from "../api/entities";
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

export default function ProfilePage() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const email = params.get("email");
  const myEmail  = getMyEmail();
  const loggedIn = isLoggedIn();
  const isOwnProfile = myEmail && email === myEmail;

  const [profile,      setProfile]      = useState(null);
  const [posts,        setPosts]        = useState([]);
  const [wall,         setWall]         = useState([]);
  const [friends,      setFriends]      = useState([]);
  const [friendStatus, setFriendStatus] = useState(null);
  const [tab,          setTab]          = useState("posts");
  const [wallDraft,    setWallDraft]    = useState("");
  const [loading,      setLoading]      = useState(true);
  const [posting,      setPosting]      = useState(false);
  const [sendingFriend,setSendingFriend]= useState(false);

  useEffect(() => {
    injectGA("G-1N8GD2WM6L");
    if (!email)        { navigate("/MyProfile"); return; }
    if (isOwnProfile)  { navigate("/MyProfile"); return; }
    loadAll();
  }, [email]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [profs, myPosts, myWall, allFriends] = await Promise.all([
        Profile.filter({ user_email: email }),
        Post.filter({ author_email: email }),
        WallPost.filter({ profile_email: email }),
        Friend.list().catch(() => []),
      ]);
      const prof = profs[0] || null;
      setProfile(prof);
      setPosts((myPosts||[]).sort((a,b)=>new Date(b.created_date)-new Date(a.created_date)));
      setWall((myWall||[]).sort((a,b)=>new Date(b.created_date)-new Date(a.created_date)));
      setFriends((allFriends||[]).filter(f=>f.status==="accepted"&&(f.requester_email===email||f.receiver_email===email)));
      if (prof?.id && email !== myEmail) {
        Profile.update(prof.id,{ profile_views:(prof.profile_views||0)+1 }).catch(()=>{});
      }
      if (loggedIn && myEmail) {
        const rel = allFriends.find(f=>(f.requester_email===myEmail&&f.receiver_email===email)||(f.receiver_email===myEmail&&f.requester_email===email));
        setFriendStatus(rel||null);
      }
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const sendFriendRequest = async () => {
    if (!loggedIn) { navigate("/OurSpaceOnboarding"); return; }
    setSendingFriend(true);
    try {
      const f = await Friend.create({ requester_email:myEmail, receiver_email:email, status:"pending", requester_name:getMyName(), receiver_name:profile?.display_name||email });
      setFriendStatus(f);
      await Notification.create({ user_email:email, from_email:myEmail, from_name:getMyName(), type:"friend_request", message:`${getMyName()} sent you a friend request`, is_read:false }).catch(()=>{});
    } catch(e) { console.error(e); }
    setSendingFriend(false);
  };

  const postOnWall = async () => {
    if (!wallDraft.trim()) return;
    if (!loggedIn) { navigate("/OurSpaceOnboarding"); return; }
    setPosting(true);
    try {
      const w = await WallPost.create({ profile_email:email, author_email:myEmail, author_name:getMyName(), content:wallDraft.trim() });
      setWall(prev=>[w,...prev]);
      setWallDraft("");
      await Notification.create({ user_email:email, from_email:myEmail, from_name:getMyName(), type:"wall_post", message:`${getMyName()} left a message on your wall`, is_read:false }).catch(()=>{});
    } catch(e) { console.error(e); }
    setPosting(false);
  };

  const bg = GRADIENTS[profile?.background_gradient] || GRADIENTS.default;
  const top8 = friends.slice(0,8);

  if (loading) return (
    <div style={{ minHeight:"100vh",background:"#0d0d1a",color:"#64748b",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Segoe UI',sans-serif" }}>
      Loading profile...
    </div>
  );

  if (!profile) return (
    <div style={{ minHeight:"100vh",background:"#0d0d1a",color:"#f0f0f0",fontFamily:"'Segoe UI',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,padding:32,paddingBottom:80 }}>
      <div style={{ fontSize:60 }}>🌌</div>
      <div style={{ fontSize:20,fontWeight:700 }}>Profile not found</div>
      <div style={{ color:"#64748b",fontSize:14,textAlign:"center",maxWidth:280,lineHeight:1.6 }}>This person hasn't set up their profile yet.</div>
      <button onClick={() => navigate("/Discover")} style={{ padding:"10px 24px",background:"linear-gradient(135deg,#c084fc,#22d3ee)",border:"none",borderRadius:24,color:"#000",fontWeight:700,cursor:"pointer" }}>Browse People</button>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh",background:"#0d0d1a",color:"#f0f0f0",fontFamily:"'Segoe UI',sans-serif",paddingBottom:80 }}>

      {/* Cover */}
      <div style={{ height:160,background:bg,position:"relative" }}>
        {profile.cover_photo && <img src={profile.cover_photo} alt="" style={{ width:"100%",height:"100%",objectFit:"cover",position:"absolute",inset:0 }} onError={e=>e.target.style.display="none"} />}
        <div style={{ position:"absolute",inset:0,background:"linear-gradient(to bottom,transparent 50%,rgba(13,13,26,0.9))" }} />
        <button onClick={() => navigate(-1)} style={{ position:"absolute",top:12,left:12,background:"#00000066",border:"none",borderRadius:20,color:"#fff",padding:"6px 12px",cursor:"pointer",fontSize:13,backdropFilter:"blur(8px)" }}>← Back</button>
      </div>

      <div style={{ maxWidth:600,margin:"0 auto",padding:"0 16px" }}>

        {/* Avatar + Actions */}
        <div style={{ display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginTop:-36,marginBottom:16 }}>
          <div style={{ display:"flex",gap:14,alignItems:"flex-end" }}>
            <div style={{ width:80,height:80,borderRadius:"50%",background:"linear-gradient(135deg,#c084fc,#22d3ee)",border:"3px solid #0d0d1a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,fontWeight:700,flexShrink:0,overflow:"hidden" }}>
              {profile.avatar_url
                ? <img src={profile.avatar_url} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} onError={e=>e.target.style.display="none"} />
                : (profile.display_name?.[0]?.toUpperCase()||"?")}
            </div>
            <div style={{ paddingBottom:4 }}>
              <div style={{ fontWeight:900,fontSize:22 }}>{profile.display_name}</div>
              {profile.headline && <div style={{ color:"#94a3b8",fontSize:13,marginTop:2 }}>{profile.headline}</div>}
            </div>
          </div>
          <div style={{ display:"flex",gap:8,paddingBottom:4 }}>
            {loggedIn && (
              <button onClick={() => navigate("/Messages")} style={{ padding:"7px 14px",background:"#16162a",border:"1px solid #2a2a45",borderRadius:20,color:"#94a3b8",fontSize:13,cursor:"pointer" }}>✉️ Message</button>
            )}
            {!friendStatus && (
              <button onClick={sendFriendRequest} disabled={sendingFriend}
                style={{ padding:"7px 16px",background:"linear-gradient(135deg,#c084fc,#22d3ee)",border:"none",borderRadius:20,color:"#000",fontWeight:700,fontSize:13,cursor:"pointer",opacity:sendingFriend?0.7:1 }}>
                {loggedIn?(sendingFriend?"Sending...":"➕ Add Friend"):"Join to Connect"}
              </button>
            )}
            {friendStatus?.status==="pending"  && <span style={{ padding:"7px 14px",background:"#16162a",borderRadius:20,color:"#94a3b8",fontSize:13 }}>⏳ Pending</span>}
            {friendStatus?.status==="accepted" && <span style={{ padding:"7px 14px",background:"#0f2a1e",border:"1px solid #4ade8040",borderRadius:20,color:"#4ade80",fontSize:13,fontWeight:600 }}>✅ Friends</span>}
          </div>
        </div>

        {/* Status chips */}
        <div style={{ display:"flex",flexWrap:"wrap",gap:8,marginBottom:12 }}>
          {profile.is_online    && <span style={{ background:"#0f2a1e",border:"1px solid #4ade8040",color:"#4ade80",fontSize:12,padding:"3px 12px",borderRadius:20 }}>● Online</span>}
          {profile.mood         && <span style={{ background:"#16162a",border:"1px solid #c084fc30",color:"#c084fc",fontSize:12,padding:"3px 12px",borderRadius:20 }}>{profile.mood}</span>}
          {profile.song_playing && <span style={{ background:"#16162a",border:"1px solid #22d3ee30",color:"#22d3ee",fontSize:12,padding:"3px 12px",borderRadius:20 }}>🎵 {profile.song_playing}</span>}
        </div>

        {profile.about_me && <div style={{ color:"#94a3b8",fontSize:14,lineHeight:1.6,marginBottom:12 }}>{profile.about_me}</div>}

        {Array.isArray(profile.interests) && profile.interests.length>0 && (
          <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginBottom:14 }}>
            {profile.interests.map((i,idx)=><span key={idx} style={{ background:"#1e1a2e",border:"1px solid #c084fc30",color:"#c084fc",fontSize:12,padding:"3px 10px",borderRadius:20 }}>{i}</span>)}
          </div>
        )}

        {/* Stats */}
        <div style={{ display:"flex",gap:24,marginBottom:20,color:"#94a3b8",fontSize:13,padding:"12px 0",borderTop:"1px solid #2a2a45",borderBottom:"1px solid #2a2a45" }}>
          <span><strong style={{ color:"#f0f0f0",fontSize:18 }}>{posts.length}</strong><br/>Posts</span>
          <span><strong style={{ color:"#f0f0f0",fontSize:18 }}>{friends.length}</strong><br/>Friends</span>
          <span><strong style={{ color:"#f0f0f0",fontSize:18 }}>{profile.profile_views||0}</strong><br/>Views 👁</span>
        </div>

        {/* Top 8 */}
        {top8.length>0 && (
          <div style={{ background:"#16162a",border:"1px solid #2a2a45",borderRadius:16,padding:16,marginBottom:16 }}>
            <div style={{ fontWeight:700,fontSize:14,marginBottom:12,color:"#94a3b8" }}>👥 {profile.display_name?.split(" ")[0]}'s Friends</div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10 }}>
              {top8.map((f,i)=>{
                const fEmail  = f.requester_email===email?f.receiver_email:f.requester_email;
                const fName   = f.requester_email===email?f.receiver_name:f.requester_name;
                const fAvatar = f.requester_email===email?f.receiver_avatar:f.requester_avatar;
                return (
                  <div key={i} onClick={()=>navigate(`/Profile?email=${fEmail}`)} style={{ cursor:"pointer",textAlign:"center" }}>
                    <div style={{ width:52,height:52,borderRadius:12,background:"linear-gradient(135deg,#c084fc,#22d3ee)",margin:"0 auto 4px",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:20,overflow:"hidden",border:"2px solid #2a2a45" }}>
                      {fAvatar?<img src={fAvatar} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} onError={e=>e.target.style.display="none"} />:(fName?.[0]||"?")}
                    </div>
                    <div style={{ fontSize:11,color:"#94a3b8",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{fName?.split(" ")[0]||"Friend"}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display:"flex",gap:2,borderBottom:"1px solid #2a2a45",marginBottom:16 }}>
          {[["posts","📝 Posts"],["wall","📌 Wall"],["photos","📸 Photos"]].map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)}
              style={{ padding:"10px 20px",background:"transparent",border:"none",borderBottom:`2px solid ${tab===id?"#c084fc":"transparent"}`,color:tab===id?"#c084fc":"#64748b",fontWeight:600,cursor:"pointer",fontSize:14 }}>
              {label}
            </button>
          ))}
        </div>

        {/* POSTS */}
        {tab==="posts" && (
          posts.length===0
            ? <div style={{ textAlign:"center",padding:"32px 0",color:"#64748b" }}><div style={{ fontSize:40,marginBottom:8 }}>📝</div><div>No posts yet.</div></div>
            : posts.map(p=>(
              <div key={p.id} style={{ background:"#16162a",border:"1px solid #2a2a45",borderRadius:12,padding:16,marginBottom:12 }}>
                {p.title   && <div style={{ fontWeight:700,fontSize:16,marginBottom:6 }}>{p.title}</div>}
                {p.content && <div style={{ fontSize:14,color:"#cbd5e1",lineHeight:1.6,whiteSpace:"pre-wrap",marginBottom:p.image_url?10:0 }}>{p.content}</div>}
                {p.image_url && <img src={p.image_url} alt="" style={{ width:"100%",borderRadius:8,maxHeight:300,objectFit:"cover" }} onError={e=>e.target.style.display="none"} />}
                <div style={{ marginTop:8,color:"#64748b",fontSize:12,display:"flex",gap:12 }}>
                  <span>💜 {p.likes_count||0}</span><span>💬 {p.comments_count||0}</span>
                  <span style={{ marginLeft:"auto" }}>{p.created_date?new Date(p.created_date).toLocaleDateString("en-US",{month:"short",day:"numeric"}):""}</span>
                </div>
              </div>
            ))
        )}

        {/* WALL */}
        {tab==="wall" && (
          <div>
            {loggedIn ? (
              <div style={{ background:"#16162a",border:"1px solid #2a2a45",borderRadius:12,padding:14,marginBottom:14 }}>
                <textarea value={wallDraft} onChange={e=>setWallDraft(e.target.value)}
                  placeholder={`Write on ${profile.display_name?.split(" ")[0]}'s wall...`} rows={3}
                  style={{ width:"100%",background:"#0d0d1a",border:"1px solid #2a2a45",borderRadius:8,color:"#f0f0f0",fontSize:14,padding:"10px 12px",outline:"none",resize:"none",boxSizing:"border-box",marginBottom:10,fontFamily:"inherit" }} />
                <button onClick={postOnWall} disabled={!wallDraft.trim()||posting}
                  style={{ padding:"8px 18px",background:wallDraft.trim()?"linear-gradient(135deg,#c084fc,#22d3ee)":"#2a2a45",border:"none",borderRadius:20,color:wallDraft.trim()?"#000":"#64748b",fontWeight:700,fontSize:13,cursor:"pointer" }}>
                  {posting?"Posting...":"📌 Post"}
                </button>
              </div>
            ) : (
              <div style={{ background:"#16162a",border:"1px solid #2a2a45",borderRadius:12,padding:16,marginBottom:14,textAlign:"center" }}>
                <div style={{ color:"#64748b",fontSize:13,marginBottom:10 }}>Sign in to leave a message</div>
                <button onClick={()=>navigate("/OurSpaceOnboarding")} style={{ padding:"8px 22px",background:"linear-gradient(135deg,#c084fc,#22d3ee)",border:"none",borderRadius:20,color:"#000",fontWeight:700,fontSize:13,cursor:"pointer" }}>Join OurSpace →</button>
              </div>
            )}
            {wall.length===0
              ? <div style={{ textAlign:"center",padding:"32px 0",color:"#64748b" }}>No wall posts yet.</div>
              : wall.map(w=>(
                <div key={w.id} style={{ background:"#16162a",border:"1px solid #2a2a45",borderRadius:12,padding:14,marginBottom:10 }}>
                  <div style={{ display:"flex",gap:10,alignItems:"flex-start" }}>
                    <div onClick={()=>navigate(`/Profile?email=${w.author_email}`)}
                      style={{ width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,#c084fc,#22d3ee)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:14,flexShrink:0,cursor:"pointer" }}>
                      {w.author_name?.[0]||"?"}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700,fontSize:13,color:"#c084fc",marginBottom:4,cursor:"pointer" }} onClick={()=>navigate(`/Profile?email=${w.author_email}`)}>{w.author_name}</div>
                      <div style={{ color:"#94a3b8",fontSize:14,lineHeight:1.6 }}>{w.content}</div>
                      <div style={{ color:"#475569",fontSize:11,marginTop:4 }}>{w.created_date?new Date(w.created_date).toLocaleDateString("en-US",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}):""}</div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* PHOTOS */}
        {tab==="photos" && (
          posts.filter(p=>p.image_url).length===0
            ? <div style={{ textAlign:"center",padding:"32px 0",color:"#64748b" }}><div style={{ fontSize:40,marginBottom:8 }}>📸</div><div>No photos yet.</div></div>
            : <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6 }}>
                {posts.filter(p=>p.image_url).map(p=>(
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
