import { useState, useEffect } from "react";
import { Profile, Post, WallPost, Friend, Notification } from "../api/entities";
import { useNavigate } from "react-router-dom";

const MY_EMAIL = "me@ourspace.app";

export default function ProfilePage() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const email = params.get("email");

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [wall, setWall] = useState([]);
  const [friendStatus, setFriendStatus] = useState(null);
  const [tab, setTab] = useState("posts");
  const [wallDraft, setWallDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  useEffect(() => { if(email) loadAll(); }, [email]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [profs, myPosts, myWall, friends] = await Promise.all([
        Profile.filter({ user_email: email }),
        Post.filter({ author_email: email }),
        WallPost.filter({ profile_email: email }),
        Friend.list(),
      ]);
      setProfile(profs[0]||null);
      setPosts(myPosts);
      setWall(myWall);
      const rel = friends.find(f=>(f.requester_email===MY_EMAIL&&f.receiver_email===email)||(f.receiver_email===MY_EMAIL&&f.requester_email===email));
      setFriendStatus(rel||null);
    } catch(e){ console.error(e); }
    setLoading(false);
  };

  const sendFriendRequest = async () => {
    try {
      const f = await Friend.create({ requester_email:MY_EMAIL, receiver_email:email, status:"pending", requester_name:"You", receiver_name:profile?.display_name||email });
      setFriendStatus(f);
      await Notification.create({ user_email:email, from_email:MY_EMAIL, from_name:"You", type:"friend_request", message:"You sent a friend request", is_read:false });
    } catch(e){ console.error(e); }
  };

  const postOnWall = async () => {
    if(!wallDraft.trim()) return;
    setPosting(true);
    try {
      const w = await WallPost.create({ profile_email:email, author_email:MY_EMAIL, author_name:"You", content:wallDraft.trim() });
      setWall(prev=>[w,...prev]);
      setWallDraft("");
      await Notification.create({ user_email:email, from_email:MY_EMAIL, from_name:"You", type:"wall_post", message:"You left a message on their wall", is_read:false });
    } catch(e){ console.error(e); }
    setPosting(false);
  };

  const GRADIENTS = {
    "purple-pink":"linear-gradient(135deg,#c084fc,#ec4899)","orange-red":"linear-gradient(135deg,#f97316,#ef4444)",
    "green-teal":"linear-gradient(135deg,#22c55e,#14b8a6)","blue-cyan":"linear-gradient(135deg,#3b82f6,#22d3ee)",
    "teal-blue":"linear-gradient(135deg,#14b8a6,#3b82f6)","default":"linear-gradient(135deg,#c084fc,#22d3ee)",
  };
  const bg = GRADIENTS[profile?.background_gradient]||GRADIENTS.default;

  if(!email) return <div style={{ minHeight:"100vh",background:"#0d0d1a",color:"#f0f0f0",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Segoe UI',sans-serif" }}>No user specified.</div>;
  if(loading) return <div style={{ minHeight:"100vh",background:"#0d0d1a",color:"#64748b",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Segoe UI',sans-serif" }}>Loading...</div>;

  return (
    <div style={{ minHeight:"100vh",background:"#0d0d1a",color:"#f0f0f0",fontFamily:"'Segoe UI',sans-serif",paddingBottom:40 }}>
      <div style={{ height:160,background:bg,position:"relative" }}>
        {profile?.cover_photo&&<img src={profile.cover_photo} alt="" style={{ width:"100%",height:"100%",objectFit:"cover",position:"absolute",inset:0 }} />}
        <button onClick={()=>navigate("/Home")} style={{ position:"absolute",top:12,left:12,background:"#00000066",border:"none",borderRadius:20,color:"#fff",padding:"6px 12px",cursor:"pointer",fontSize:13 }}>← Back</button>
      </div>

      <div style={{ maxWidth:600,margin:"0 auto",padding:"0 16px" }}>
        <div style={{ display:"flex",alignItems:"flex-end",gap:16,marginTop:-36,marginBottom:16,justifyContent:"space-between" }}>
          <div style={{ display:"flex",gap:16,alignItems:"flex-end" }}>
            <div style={{ width:80,height:80,borderRadius:"50%",background:"linear-gradient(135deg,#c084fc,#22d3ee)",border:"3px solid #0d0d1a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,fontWeight:700,flexShrink:0,overflow:"hidden" }}>
              {profile?.avatar_url?<img src={profile.avatar_url} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} />:(profile?.display_name?.[0]||"?")}
            </div>
            <div style={{ paddingBottom:4 }}>
              <div style={{ fontWeight:900,fontSize:20 }}>{profile?.display_name||email}</div>
              <div style={{ color:"#94a3b8",fontSize:13 }}>{profile?.headline}</div>
            </div>
          </div>
          <div style={{ paddingBottom:4 }}>
            {!friendStatus&&<button onClick={sendFriendRequest} style={{ padding:"8px 16px",background:"linear-gradient(135deg,#c084fc,#22d3ee)",border:"none",borderRadius:20,color:"#000",fontWeight:700,fontSize:13,cursor:"pointer" }}>+ Connect</button>}
            {friendStatus?.status==="pending"&&<span style={{ padding:"8px 16px",background:"#2a2a45",borderRadius:20,color:"#94a3b8",fontSize:13 }}>Pending</span>}
            {friendStatus?.status==="accepted"&&<span style={{ padding:"8px 16px",background:"#1e2a1e",border:"1px solid #4ade8050",borderRadius:20,color:"#4ade80",fontSize:13 }}>✅ Friends</span>}
          </div>
        </div>

        {profile?.mood&&<div style={{ background:"#16162a",border:"1px solid #2a2a45",borderRadius:20,padding:"6px 14px",display:"inline-block",fontSize:13,color:"#c084fc",marginBottom:8 }}>😶 {profile.mood}</div>}
        {profile?.song_playing&&<div style={{ background:"#16162a",border:"1px solid #2a2a45",borderRadius:20,padding:"6px 14px",display:"inline-block",fontSize:13,color:"#22d3ee",marginBottom:8,marginLeft:8 }}>🎵 {profile.song_playing}</div>}
        {profile?.about_me&&<div style={{ color:"#94a3b8",fontSize:14,lineHeight:1.6,margin:"10px 0" }}>{profile.about_me}</div>}
        {Array.isArray(profile?.interests)&&profile.interests.length>0&&(
          <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginBottom:14 }}>
            {profile.interests.map((i,idx)=><span key={idx} style={{ background:"#1e1a2e",border:"1px solid #c084fc30",color:"#c084fc",fontSize:12,padding:"3px 10px",borderRadius:20 }}>{i}</span>)}
          </div>
        )}
        <div style={{ display:"flex",gap:20,marginBottom:20,color:"#94a3b8",fontSize:13 }}>
          <span><strong style={{ color:"#f0f0f0" }}>{posts.length}</strong> posts</span>
          <span><strong style={{ color:"#f0f0f0" }}>{profile?.profile_views||0}</strong> views</span>
        </div>

        <div style={{ display:"flex",gap:2,borderBottom:"1px solid #2a2a45",marginBottom:16 }}>
          {["posts","wall"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{ padding:"10px 20px",background:"transparent",border:"none",borderBottom:`2px solid ${tab===t?"#c084fc":"transparent"}`,color:tab===t?"#c084fc":"#64748b",fontWeight:600,cursor:"pointer",fontSize:14 }}>
              {t==="posts"?"📝 Posts":"📌 Wall"}
            </button>
          ))}
        </div>

        {tab==="posts"&&(
          posts.length===0
            ? <div style={{ textAlign:"center",padding:32,color:"#64748b" }}>No posts yet.</div>
            : posts.map(p=>(
              <div key={p.id} style={{ background:"#16162a",border:"1px solid #2a2a45",borderRadius:12,padding:16,marginBottom:12 }}>
                {p.content&&<div style={{ fontSize:14,color:"#cbd5e1",lineHeight:1.6 }}>{p.content}</div>}
                {p.image_url&&<img src={p.image_url} alt="" style={{ width:"100%",borderRadius:8,marginTop:8,maxHeight:300,objectFit:"cover" }} onError={e=>e.target.style.display="none"} />}
                <div style={{ marginTop:8,color:"#64748b",fontSize:12 }}>💜 {p.likes_count||0} · 💬 {p.comments_count||0}</div>
              </div>
            ))
        )}

        {tab==="wall"&&(
          <div>
            <div style={{ background:"#16162a",border:"1px solid #2a2a45",borderRadius:12,padding:14,marginBottom:14 }}>
              <textarea value={wallDraft} onChange={e=>setWallDraft(e.target.value)} placeholder={`Leave a message on ${profile?.display_name||"their"}'s wall...`}
                style={{ width:"100%",background:"transparent",border:"none",color:"#f0f0f0",fontSize:14,resize:"none",outline:"none",minHeight:64,boxSizing:"border-box",fontFamily:"inherit" }} />
              <div style={{ display:"flex",justifyContent:"flex-end" }}>
                <button onClick={postOnWall} disabled={posting||!wallDraft.trim()} style={{ padding:"6px 16px",background:wallDraft.trim()?"linear-gradient(135deg,#c084fc,#22d3ee)":"#2a2a45",border:"none",borderRadius:20,color:wallDraft.trim()?"#000":"#64748b",fontWeight:700,fontSize:13,cursor:wallDraft.trim()?"pointer":"default" }}>
                  {posting?"Posting...":"Post to Wall"}
                </button>
              </div>
            </div>
            {wall.length===0
              ? <div style={{ textAlign:"center",padding:24,color:"#64748b" }}>No wall posts yet.</div>
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
    </div>
  );
}
