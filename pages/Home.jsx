import { useState, useEffect } from "react";
import { Post, Profile, Story, Notification } from "../api/entities";
import { useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { icon: "🏠", label: "Feed", path: "/Home" },
  { icon: "🔍", label: "Discover", path: "/Discover" },
  { icon: "✉️", label: "Messages", path: "/Messages" },
  { icon: "🔔", label: "Alerts", path: "/Notifications" },
  { icon: "👤", label: "Profile", path: "/MyProfile" },
];

function PostCard({ post, currentUserEmail, onLike, onNavigate }) {
  const liked = Array.isArray(post.liked_by) && post.liked_by.includes(currentUserEmail);
  return (
    <div style={{ background: "#16162a", borderRadius: 16, marginBottom: 16, border: "1px solid #2a2a45", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px" }}>
        <div onClick={() => onNavigate(`/Profile?email=${post.author_email}`)}
          style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#c084fc,#22d3ee)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", fontSize: 16, cursor: "pointer", flexShrink: 0, overflow: "hidden" }}>
          {post.author_avatar ? <img src={post.author_avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (post.author_name?.[0] || "?")}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14, cursor: "pointer" }} onClick={() => onNavigate(`/Profile?email=${post.author_email}`)}>{post.author_name || "Unknown"}</div>
          <div style={{ color: "#64748b", fontSize: 11 }}>{post.created_date ? new Date(post.created_date).toLocaleDateString("en-US",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}) : ""}</div>
        </div>
        {post.is_ai_generated && <span style={{ background:"#1e1a2e",border:"1px solid #c084fc50",color:"#c084fc",fontSize:10,padding:"2px 8px",borderRadius:20 }}>🤖 AI</span>}
        {!post.is_ai_generated && <span style={{ background:"#1e2a1e",border:"1px solid #4ade8050",color:"#4ade80",fontSize:10,padding:"2px 8px",borderRadius:20 }}>✅ Human</span>}
      </div>
      {post.title && <div style={{ fontWeight:700,fontSize:16,padding:"0 16px 6px" }}>{post.title}</div>}
      {post.content && <div style={{ color:"#cbd5e1",fontSize:14,lineHeight:1.6,padding:"0 16px 12px",whiteSpace:"pre-wrap" }}>{post.content}</div>}
      {post.image_url && <img src={post.image_url} alt="post" style={{ width:"100%",maxHeight:400,objectFit:"cover" }} onError={e=>e.target.style.display="none"} />}
      <div style={{ display:"flex",gap:4,padding:"10px 12px",borderTop:"1px solid #2a2a45" }}>
        <button onClick={()=>onLike(post)} style={{ display:"flex",alignItems:"center",gap:6,padding:"6px 12px",background:liked?"#2a1a3e":"transparent",border:`1px solid ${liked?"#c084fc":"#2a2a45"}`,borderRadius:20,color:liked?"#c084fc":"#94a3b8",fontSize:13,cursor:"pointer" }}>
          {liked?"💜":"🤍"} {post.likes_count||0}
        </button>
        <button style={{ display:"flex",alignItems:"center",gap:6,padding:"6px 12px",background:"transparent",border:"1px solid #2a2a45",borderRadius:20,color:"#94a3b8",fontSize:13,cursor:"pointer" }}>
          💬 {post.comments_count||0}
        </button>
        <button style={{ marginLeft:"auto",padding:"6px 12px",background:"transparent",border:"1px solid #2a2a45",borderRadius:20,color:"#94a3b8",fontSize:13,cursor:"pointer" }}>↗ Share</button>
      </div>
    </div>
  );
}

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [humanOnly, setHumanOnly] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [posting, setPosting] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [postsData, storiesData, notifData] = await Promise.all([
        Post.list("-created_date"),
        Story.list("-created_date"),
        Notification.list(),
      ]);
      setPosts(postsData);
      setStories(storiesData.slice(0,8));
      setUnreadCount(notifData.filter(n=>!n.is_read).length);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const handleLike = async (post) => {
    const email = "me@ourspace.app";
    const alreadyLiked = Array.isArray(post.liked_by) && post.liked_by.includes(email);
    const newLiked = alreadyLiked ? post.liked_by.filter(e=>e!==email) : [...(post.liked_by||[]),email];
    await Post.update(post.id,{liked_by:newLiked,likes_count:newLiked.length});
    setPosts(prev=>prev.map(p=>p.id===post.id?{...p,liked_by:newLiked,likes_count:newLiked.length}:p));
  };

  const handlePost = async () => {
    if(!newPost.trim()) return;
    setPosting(true);
    try {
      const created = await Post.create({ content:newPost.trim(), author_name:"You", author_email:"me@ourspace.app", post_type:"text", likes_count:0, comments_count:0, liked_by:[], is_unfiltered:true, is_ai_generated:false, searchable_text:newPost.trim().toLowerCase() });
      setPosts(prev=>[created,...prev]);
      setNewPost("");
    } catch(e){console.error(e);}
    setPosting(false);
  };

  const filtered = humanOnly ? posts.filter(p=>p.is_unfiltered&&!p.is_ai_generated) : posts;

  return (
    <div style={{ minHeight:"100vh",background:"#0d0d1a",color:"#f0f0f0",fontFamily:"'Segoe UI',sans-serif",paddingBottom:80 }}>
      <div style={{ position:"sticky",top:0,zIndex:100,background:"#0d0d1aee",backdropFilter:"blur(12px)",borderBottom:"1px solid #2a2a45",padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        <span style={{ fontWeight:900,fontSize:20,background:"linear-gradient(90deg,#c084fc,#22d3ee)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>OurSpace 2.0</span>
        <div style={{ display:"flex",gap:10,alignItems:"center" }}>
          <button onClick={()=>setHumanOnly(!humanOnly)} style={{ padding:"5px 12px",background:humanOnly?"#1e2a1e":"#16162a",border:`1px solid ${humanOnly?"#4ade80":"#2a2a45"}`,borderRadius:20,color:humanOnly?"#4ade80":"#94a3b8",fontSize:12,cursor:"pointer",fontWeight:600 }}>
            {humanOnly?"✅ Human Only":"👁 All Posts"}
          </button>
          <button onClick={()=>navigate("/Notifications")} style={{ background:"none",border:"none",cursor:"pointer",fontSize:20,position:"relative",color:"white" }}>
            🔔{unreadCount>0&&<span style={{ position:"absolute",top:-4,right:-4,background:"#c084fc",color:"#fff",borderRadius:"50%",width:16,height:16,fontSize:10,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700 }}>{unreadCount}</span>}
          </button>
        </div>
      </div>

      <div style={{ maxWidth:600,margin:"0 auto",padding:"16px" }}>
        {stories.length>0&&(
          <div style={{ display:"flex",gap:12,overflowX:"auto",paddingBottom:12,marginBottom:16,scrollbarWidth:"none" }}>
            {stories.map(s=>(
              <div key={s.id} style={{ flexShrink:0,textAlign:"center",cursor:"pointer" }}>
                <div style={{ width:56,height:56,borderRadius:"50%",background:"linear-gradient(135deg,#c084fc,#22d3ee)",padding:2,margin:"0 auto 4px" }}>
                  <div style={{ width:"100%",height:"100%",borderRadius:"50%",background:"#16162a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,overflow:"hidden" }}>
                    {s.author_name?.[0]||"?"}
                  </div>
                </div>
                <div style={{ fontSize:10,color:"#94a3b8",maxWidth:56,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{s.author_name?.split(" ")[0]}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ background:"#16162a",border:"1px solid #2a2a45",borderRadius:16,padding:16,marginBottom:20 }}>
          <textarea value={newPost} onChange={e=>setNewPost(e.target.value)} placeholder="What's on your mind? No algorithm here — your post reaches everyone. 🌐"
            style={{ width:"100%",background:"transparent",border:"none",color:"#f0f0f0",fontSize:14,resize:"none",outline:"none",minHeight:72,boxSizing:"border-box",fontFamily:"inherit" }} />
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8 }}>
            <div style={{ display:"flex",gap:8 }}>
              <button style={{ padding:"6px 10px",background:"transparent",border:"1px solid #2a2a45",borderRadius:20,color:"#64748b",fontSize:12,cursor:"pointer" }}>📷 Photo</button>
              <button style={{ padding:"6px 10px",background:"transparent",border:"1px solid #2a2a45",borderRadius:20,color:"#64748b",fontSize:12,cursor:"pointer" }}>🔗 Link</button>
            </div>
            <button onClick={handlePost} disabled={posting||!newPost.trim()} style={{ padding:"8px 20px",background:newPost.trim()?"linear-gradient(135deg,#c084fc,#22d3ee)":"#2a2a45",border:"none",borderRadius:20,color:newPost.trim()?"#000":"#64748b",fontWeight:700,fontSize:14,cursor:newPost.trim()?"pointer":"default" }}>
              {posting?"Posting...":"Post"}
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign:"center",padding:40,color:"#64748b" }}>⏳ Loading the underground feed...</div>
        ) : filtered.length===0 ? (
          <div style={{ textAlign:"center",padding:40,color:"#64748b" }}><div style={{ fontSize:40,marginBottom:12 }}>🌐</div><div>No posts yet. Be the first.</div></div>
        ) : (
          filtered.map(post=><PostCard key={post.id} post={post} currentUserEmail="me@ourspace.app" onLike={handleLike} onNavigate={navigate} />)
        )}
      </div>

      <div style={{ position:"fixed",bottom:0,left:0,right:0,background:"#0d0d1a",borderTop:"1px solid #2a2a45",display:"flex",justifyContent:"space-around",padding:"10px 0",zIndex:100 }}>
        {NAV_ITEMS.map(item=>(
          <button key={item.path} onClick={()=>navigate(item.path)} style={{ background:"none",border:"none",color:window.location.pathname===item.path?"#c084fc":"#64748b",display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",fontSize:20 }}>
            {item.icon}<span style={{ fontSize:10 }}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
