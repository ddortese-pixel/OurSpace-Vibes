import { useState, useEffect, useRef } from "react";
import { Post, Story, Notification, Profile } from "../api/entities";
import { useNavigate } from "react-router-dom";

const FEED_URL = "https://legacy-circle-ae3f9932.base44.app/functions/getPublicFeed";

function injectGA(id) {
  if (document.getElementById(`ga-${id}`)) return;
  const s1 = document.createElement("script"); s1.id = `ga-${id}`; s1.async = true;
  s1.src = `https://www.googletagmanager.com/gtag/js?id=${id}`; document.head.appendChild(s1);
  const s2 = document.createElement("script");
  s2.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","${id}");`;
  document.head.appendChild(s2);
}

const OS2_ICON = "https://media.base44.com/images/public/69d9b8416964fe31ae3f9932/7bbdaee82_generated_image.png";

function getMyEmail() { return localStorage.getItem("os2_email") || null; }
function getMyName()  { return localStorage.getItem("os2_name")  || "Guest"; }
function isLoggedIn() { return !!localStorage.getItem("os2_email"); }

const PAGE_SIZE = 20;

const NAV = [
  { icon:"🏠", label:"Feed",     path:"/Home" },
  { icon:"🔍", label:"Discover", path:"/Discover" },
  { icon:"✉️", label:"Messages", path:"/Messages" },
  { icon:"🔔", label:"Alerts",   path:"/Notifications" },
  { icon:"👤", label:"Profile",  path:"/MyProfile" },
];

async function fetchPublicPosts(limit, skip) {
  try {
    const res = await fetch(FEED_URL, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({limit,skip}) });
    const data = await res.json();
    return data.posts || [];
  } catch { return []; }
}

function Avatar({ name, url, size=40 }) {
  return (
    <div style={{ width:size,height:size,borderRadius:"50%",background:"linear-gradient(135deg,#c084fc,#22d3ee)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,color:"#fff",fontSize:size*0.4,flexShrink:0,overflow:"hidden" }}>
      {url ? <img src={url} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} onError={e=>e.target.style.display="none"} /> : (name?.[0]?.toUpperCase()||"?")}
    </div>
  );
}

function PostCard({ post, currentUserEmail, onLike, onNavigate, onComment }) {
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState("");
  const liked = Array.isArray(post.liked_by) && currentUserEmail && post.liked_by.includes(currentUserEmail);

  return (
    <div style={{ background:"#16162a",borderRadius:16,marginBottom:16,border:"1px solid #2a2a45",overflow:"hidden" }}>
      {/* Header */}
      <div style={{ display:"flex",alignItems:"center",gap:12,padding:"14px 16px" }}>
        <div onClick={() => onNavigate(`/Profile?email=${post.author_email}`)} style={{ cursor:"pointer" }}>
          <Avatar name={post.author_name} url={post.author_avatar} size={40} />
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:700,fontSize:14,cursor:"pointer" }} onClick={() => onNavigate(`/Profile?email=${post.author_email}`)}>{post.author_name||"Unknown"}</div>
          <div style={{ color:"#64748b",fontSize:11 }}>{post.created_date ? new Date(post.created_date).toLocaleDateString("en-US",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}) : ""}</div>
        </div>
        {post.is_ai_generated
          ? <span style={{ background:"#1e1a2e",border:"1px solid #c084fc50",color:"#c084fc",fontSize:10,padding:"2px 8px",borderRadius:20 }}>🤖 AI</span>
          : <span style={{ background:"#1e2a1e",border:"1px solid #4ade8050",color:"#4ade80",fontSize:10,padding:"2px 8px",borderRadius:20 }}>✅ Human</span>
        }
      </div>
      {/* Content */}
      {post.title   && <div style={{ fontWeight:700,fontSize:16,padding:"0 16px 6px" }}>{post.title}</div>}
      {post.content && <div style={{ color:"#cbd5e1",fontSize:14,lineHeight:1.6,padding:"0 16px 12px",whiteSpace:"pre-wrap" }}>{post.content}</div>}
      {post.image_url && <img src={post.image_url} alt="" style={{ width:"100%",maxHeight:400,objectFit:"cover",display:"block" }} onError={e=>e.target.parentElement.style.display="none"} />}
      {/* Actions */}
      <div style={{ display:"flex",gap:4,padding:"10px 12px",borderTop:"1px solid #2a2a45" }}>
        <button onClick={() => onLike(post)}
          style={{ display:"flex",alignItems:"center",gap:6,padding:"6px 12px",background:liked?"#2a1a3e":"transparent",border:`1px solid ${liked?"#c084fc":"#2a2a45"}`,borderRadius:20,color:liked?"#c084fc":"#94a3b8",fontSize:13,cursor:"pointer" }}>
          {liked?"💜":"🤍"} {post.likes_count||0}
        </button>
        <button onClick={() => setShowComment(!showComment)}
          style={{ display:"flex",alignItems:"center",gap:6,padding:"6px 12px",background:"transparent",border:"1px solid #2a2a45",borderRadius:20,color:"#94a3b8",fontSize:13,cursor:"pointer" }}>
          💬 {post.comments_count||0}
        </button>
        <button style={{ marginLeft:"auto",padding:"6px 12px",background:"transparent",border:"1px solid #2a2a45",borderRadius:20,color:"#94a3b8",fontSize:13,cursor:"pointer" }}>↗ Share</button>
      </div>
      {/* Comment box */}
      {showComment && (
        <div style={{ padding:"8px 14px 14px",borderTop:"1px solid #2a2a45",display:"flex",gap:10,alignItems:"center" }}>
          <Avatar name={getMyName()} size={30} />
          <input value={comment} onChange={e=>setComment(e.target.value)}
            onKeyDown={e=>{ if(e.key==="Enter"&&comment.trim()){ onComment(post,comment); setComment(""); setShowComment(false); }}}
            placeholder="Add a comment… (Enter to post)"
            style={{ flex:1,background:"#0d0d1a",border:"1px solid #2a2a45",borderRadius:20,color:"#f0f0f0",fontSize:13,padding:"7px 14px",outline:"none" }} />
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [posts,       setPosts]       = useState([]);
  const [stories,     setStories]     = useState([]);
  const [myProfile,   setMyProfile]   = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore,     setHasMore]     = useState(true);
  const [page,        setPage]        = useState(0);
  const [humanOnly,   setHumanOnly]   = useState(false);
  const [newPost,     setNewPost]     = useState("");
  const [newPostImg,  setNewPostImg]  = useState("");
  const [showImgBox,  setShowImgBox]  = useState(false);
  const [posting,     setPosting]     = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeStory, setActiveStory] = useState(null);
  const [loggedIn]  = useState(isLoggedIn());
  const navigate = useNavigate();
  const bottomRef = useRef(null);

  useEffect(() => {
    injectGA("G-1N8GD2WM6L");
    // favicon + title
    let link = document.querySelector("link[rel~='icon']");
    if (!link) { link = document.createElement("link"); link.rel="icon"; document.head.appendChild(link); }
    link.href = OS2_ICON;
    document.title = "OurSpace 2.0";
    loadInitial();
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    if (!bottomRef.current) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loadingMore) loadMore();
    }, { threshold: 0.1 });
    obs.observe(bottomRef.current);
    return () => obs.disconnect();
  }, [hasMore, loadingMore, page]);

  const loadInitial = async () => {
    setLoading(true);
    try {
      const [publicPosts, storyData] = await Promise.all([
        fetchPublicPosts(PAGE_SIZE, 0),
        Story.list("-created_date").catch(() => []),
      ]);
      setPosts(publicPosts);
      setHasMore(publicPosts.length === PAGE_SIZE);
      setPage(1);
      // Filter active stories (not expired)
      const now = new Date();
      setStories(storyData.filter(s => !s.expires_at || new Date(s.expires_at) > now).slice(0,12));
      // Unread notifications (logged in only)
      if (loggedIn) {
        const notifs = await Notification.filter({ user_email: getMyEmail() }).catch(() => []);
        setUnreadCount(notifs.filter(n=>!n.is_read).length);
        const profs = await Profile.filter({ user_email: getMyEmail() }).catch(() => []);
        setMyProfile(profs[0] || null);
      }
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const more = await fetchPublicPosts(PAGE_SIZE, page * PAGE_SIZE);
      setPosts(prev => [...prev, ...more]);
      setHasMore(more.length === PAGE_SIZE);
      setPage(p => p+1);
    } catch(e) { console.error(e); }
    setLoadingMore(false);
  };

  const handleLike = async (post) => {
    if (!loggedIn) { navigate("/OurSpaceOnboarding"); return; }
    const email = getMyEmail();
    const alreadyLiked = Array.isArray(post.liked_by) && post.liked_by.includes(email);
    const newLiked = alreadyLiked ? post.liked_by.filter(e=>e!==email) : [...(post.liked_by||[]),email];
    await Post.update(post.id,{liked_by:newLiked,likes_count:newLiked.length});
    setPosts(prev=>prev.map(p=>p.id===post.id?{...p,liked_by:newLiked,likes_count:newLiked.length}:p));
  };

  const handleComment = async (post, text) => {
    if (!loggedIn) { navigate("/OurSpaceOnboarding"); return; }
    await Post.update(post.id,{comments_count:(post.comments_count||0)+1});
    setPosts(prev=>prev.map(p=>p.id===post.id?{...p,comments_count:(p.comments_count||0)+1}:p));
  };

  const handlePost = async () => {
    if (!newPost.trim()) return;
    if (!loggedIn) { navigate("/OurSpaceOnboarding"); return; }
    setPosting(true);
    try {
      const created = await Post.create({
        content: newPost.trim(),
        image_url: newPostImg.trim()||undefined,
        author_name: getMyName(),
        author_email: getMyEmail(),
        author_avatar: myProfile?.avatar_url||"",
        post_type: "text",
        likes_count: 0,
        comments_count: 0,
        liked_by: [],
        is_unfiltered: true,
        is_ai_generated: false,
        searchable_text: newPost.trim().toLowerCase(),
      });
      setPosts(prev=>[created,...prev]);
      setNewPost("");
      setNewPostImg("");
      setShowImgBox(false);
    } catch(e) { console.error(e); }
    setPosting(false);
  };

  const filtered = humanOnly ? posts.filter(p=>!p.is_ai_generated) : posts;

  return (
    <div style={{ minHeight:"100vh",background:"#0d0d1a",color:"#f0f0f0",fontFamily:"'Segoe UI',sans-serif",paddingBottom:80 }}>

      {/* ── TOP BAR ── */}
      <div style={{ position:"sticky",top:0,zIndex:100,background:"#0d0d1aee",backdropFilter:"blur(12px)",borderBottom:"1px solid #2a2a45",padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          <img src={OS2_ICON} alt="" style={{ width:30,height:30,borderRadius:8 }} onError={e=>e.target.style.display="none"} />
          <span style={{ fontWeight:900,fontSize:20,background:"linear-gradient(90deg,#c084fc,#22d3ee)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>OurSpace 2.0</span>
        </div>
        <div style={{ display:"flex",gap:8,alignItems:"center" }}>
          <button onClick={() => setHumanOnly(!humanOnly)}
            style={{ padding:"5px 12px",background:humanOnly?"#1e2a1e":"#16162a",border:`1px solid ${humanOnly?"#4ade80":"#2a2a45"}`,borderRadius:20,color:humanOnly?"#4ade80":"#94a3b8",fontSize:12,cursor:"pointer",fontWeight:600 }}>
            {humanOnly?"✅ Human Only":"👁 All Posts"}
          </button>
          <button onClick={() => navigate("/Notifications")} style={{ background:"none",border:"none",cursor:"pointer",fontSize:20,position:"relative",color:"white",padding:"4px" }}>
            🔔{unreadCount>0&&<span style={{ position:"absolute",top:0,right:0,background:"#c084fc",color:"#fff",borderRadius:"50%",width:16,height:16,fontSize:10,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700 }}>{unreadCount}</span>}
          </button>
          {loggedIn
            ? <div onClick={()=>navigate("/MyProfile")} style={{ cursor:"pointer" }}><Avatar name={getMyName()} url={myProfile?.avatar_url} size={32} /></div>
            : <button onClick={()=>navigate("/OurSpaceOnboarding")} style={{ padding:"7px 16px",background:"linear-gradient(135deg,#c084fc,#22d3ee)",border:"none",borderRadius:20,color:"#000",fontWeight:700,fontSize:13,cursor:"pointer" }}>Join</button>
          }
        </div>
      </div>

      <div style={{ maxWidth:600,margin:"0 auto",padding:"16px" }}>

        {/* ── STORIES ── */}
        {stories.length > 0 && (
          <div style={{ display:"flex",gap:14,overflowX:"auto",paddingBottom:12,marginBottom:16,scrollbarWidth:"none" }}>
            {loggedIn && (
              <div style={{ flexShrink:0,textAlign:"center",cursor:"pointer" }} onClick={() => navigate("/MyProfile")}>
                <div style={{ width:56,height:56,borderRadius:"50%",background:"#16162a",border:"2px dashed #2a2a45",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,margin:"0 auto 4px" }}>+</div>
                <div style={{ fontSize:10,color:"#64748b" }}>Your Story</div>
              </div>
            )}
            {stories.map(s => (
              <div key={s.id} onClick={() => setActiveStory(s)} style={{ flexShrink:0,textAlign:"center",cursor:"pointer" }}>
                <div style={{ width:56,height:56,borderRadius:"50%",background:"linear-gradient(135deg,#c084fc,#22d3ee)",padding:2,margin:"0 auto 4px" }}>
                  <div style={{ width:"100%",height:"100%",borderRadius:"50%",background:"#16162a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,overflow:"hidden" }}>
                    {s.media_url ? <img src={s.media_url} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} onError={e=>e.target.style.display="none"} /> : (s.sticker_emojis?.[0]||s.author_name?.[0]||"📖")}
                  </div>
                </div>
                <div style={{ fontSize:10,color:"#94a3b8",maxWidth:56,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{s.author_name?.split(" ")[0]}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── POST COMPOSER ── */}
        {loggedIn ? (
          <div style={{ background:"#16162a",border:"1px solid #2a2a45",borderRadius:16,padding:16,marginBottom:20 }}>
            <div style={{ display:"flex",gap:12,alignItems:"flex-start",marginBottom:10 }}>
              <Avatar name={getMyName()} url={myProfile?.avatar_url} size={36} />
              <textarea value={newPost} onChange={e=>setNewPost(e.target.value)}
                placeholder="What's on your mind? No algorithm here — your post reaches everyone. 🌐"
                style={{ flex:1,background:"transparent",border:"none",color:"#f0f0f0",fontSize:14,resize:"none",outline:"none",minHeight:56,fontFamily:"inherit",lineHeight:1.5 }} />
            </div>
            {showImgBox && (
              <input value={newPostImg} onChange={e=>setNewPostImg(e.target.value)} placeholder="Paste an image URL..."
                style={{ width:"100%",background:"#0d0d1a",border:"1px solid #2a2a45",borderRadius:8,color:"#f0f0f0",fontSize:13,padding:"8px 12px",boxSizing:"border-box",outline:"none",marginBottom:10 }} />
            )}
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
              <div style={{ display:"flex",gap:8 }}>
                <button onClick={()=>setShowImgBox(!showImgBox)} style={{ padding:"6px 10px",background:"transparent",border:"1px solid #2a2a45",borderRadius:20,color:"#64748b",fontSize:12,cursor:"pointer" }}>📷 Photo</button>
              </div>
              <button onClick={handlePost} disabled={posting||!newPost.trim()}
                style={{ padding:"8px 20px",background:newPost.trim()?"linear-gradient(135deg,#c084fc,#22d3ee)":"#2a2a45",border:"none",borderRadius:20,color:newPost.trim()?"#000":"#64748b",fontWeight:700,fontSize:14,cursor:newPost.trim()?"pointer":"default" }}>
                {posting?"Posting...":"Post"}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ background:"#16162a",border:"1px solid #2a2a45",borderRadius:16,padding:20,marginBottom:20,textAlign:"center" }}>
            <div style={{ fontSize:32,marginBottom:8 }}>🌐</div>
            <div style={{ fontWeight:700,fontSize:16,marginBottom:4 }}>Join 10,000+ members on OurSpace 2.0</div>
            <div style={{ color:"#64748b",fontSize:13,marginBottom:14 }}>No algorithm. Just real people, real posts.</div>
            <button onClick={()=>navigate("/OurSpaceOnboarding")} style={{ padding:"10px 28px",background:"linear-gradient(135deg,#c084fc,#22d3ee)",border:"none",borderRadius:20,color:"#000",fontWeight:700,fontSize:14,cursor:"pointer" }}>Get Started Free →</button>
          </div>
        )}

        {/* ── FEED ── */}
        {loading ? (
          <div style={{ textAlign:"center",padding:40,color:"#64748b" }}>⏳ Loading the underground feed...</div>
        ) : filtered.length===0 ? (
          <div style={{ textAlign:"center",padding:40,color:"#64748b" }}>
            <div style={{ fontSize:40,marginBottom:12 }}>🌐</div>
            <div>No posts yet. Be the first.</div>
          </div>
        ) : (
          <>
            {filtered.map(post => (
              <PostCard key={post.id} post={post} currentUserEmail={getMyEmail()} onLike={handleLike} onNavigate={navigate} onComment={handleComment} />
            ))}
            <div ref={bottomRef} style={{ textAlign:"center",padding:"16px 0",color:"#64748b",fontSize:13 }}>
              {loadingMore ? "⏳ Loading more..." : hasMore ? "" : "You've reached the end 🌐"}
            </div>
          </>
        )}
      </div>

      {/* ── STORY VIEWER ── */}
      {activeStory && (
        <div onClick={()=>setActiveStory(null)} style={{ position:"fixed",inset:0,background:"#000000cc",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center" }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:"#16162a",borderRadius:20,maxWidth:380,width:"90%",overflow:"hidden",border:"1px solid #2a2a45",position:"relative" }}>
            <div style={{ display:"flex",alignItems:"center",gap:10,padding:"14px 16px",borderBottom:"1px solid #2a2a45" }}>
              <Avatar name={activeStory.author_name} url={activeStory.author_avatar} size={36} />
              <div>
                <div style={{ fontWeight:700,fontSize:14 }}>{activeStory.author_name}</div>
                <div style={{ fontSize:11,color:"#64748b" }}>Story</div>
              </div>
              <button onClick={()=>setActiveStory(null)} style={{ marginLeft:"auto",background:"none",border:"none",color:"#94a3b8",fontSize:20,cursor:"pointer" }}>✕</button>
            </div>
            {activeStory.media_url && (
              <img src={activeStory.media_url} alt="" style={{ width:"100%",maxHeight:400,objectFit:"cover",display:"block" }} onError={e=>e.target.style.display="none"} />
            )}
            {activeStory.caption && <div style={{ padding:"12px 16px",color:"#cbd5e1",fontSize:14,lineHeight:1.6 }}>{activeStory.caption}</div>}
            {activeStory.music_title && <div style={{ padding:"0 16px 14px",color:"#22d3ee",fontSize:13 }}>🎵 {activeStory.music_title}</div>}
          </div>
        </div>
      )}

      {/* ── BOTTOM NAV ── */}
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
