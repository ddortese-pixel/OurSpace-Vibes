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
function getMyName() { return localStorage.getItem("os2_name") || "Guest"; }
function isLoggedIn() { return !!localStorage.getItem("os2_email"); }

const PAGE_SIZE = 20;

const NAV = [
  { icon: "🏠", label: "Home", path: "/Home" },
  { icon: "🔍", label: "Discover", path: "/Discover" },
  { icon: "✉️", label: "Messages", path: "/Messages" },
  { icon: "🔔", label: "Alerts", path: "/Notifications" },
  { icon: "👤", label: "Me", path: "/MyProfile" },
];

async function fetchPublicPosts(limit, skip) {
  try {
    const res = await fetch(FEED_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ limit, skip })
    });
    const data = await res.json();
    return data.posts || [];
  } catch { return []; }
}

function Avatar({ name, url, size = 44, gradient = "linear-gradient(135deg,#c084fc,#22d3ee)" }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: gradient, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", fontSize: size * 0.4, flexShrink: 0, overflow: "hidden" }}>
      {url ? <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} /> : (name?.[0]?.toUpperCase() || "?")}
    </div>
  );
}

function StoryCard({ story, onClick }) {
  return (
    <div onClick={onClick} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer", flexShrink: 0 }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#c084fc,#22d3ee)", padding: 2 }}>
        <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#0d0d1a", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          {story.media_url
            ? <img src={story.media_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} />
            : <span style={{ fontSize: 24 }}>{story.sticker_emojis?.[0] || "📖"}</span>}
        </div>
      </div>
      <span style={{ fontSize: 11, color: "#94a3b8", maxWidth: 64, textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{story.author_name?.split(" ")[0] || "Story"}</span>
    </div>
  );
}

function PostCard({ post, currentUserEmail, onLike, onNavigate, onComment }) {
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState("");
  const liked = Array.isArray(post.liked_by) && currentUserEmail && post.liked_by.includes(currentUserEmail);

  return (
    <div style={{ background: "#13132b", borderRadius: 20, marginBottom: 16, border: "1px solid #2a2a45", overflow: "hidden", boxShadow: "0 4px 24px #00000040" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px" }}>
        <div onClick={() => onNavigate(`/Profile?email=${post.author_email}`)} style={{ cursor: "pointer" }}>
          <Avatar name={post.author_name} url={post.author_avatar} size={44} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 15, cursor: "pointer" }} onClick={() => onNavigate(`/Profile?email=${post.author_email}`)}>{post.author_name || "Unknown"}</div>
          <div style={{ color: "#475569", fontSize: 12 }}>
            {post.created_date ? new Date(post.created_date).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : ""}
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {post.is_ai_generated
            ? <span style={{ background: "#1e1a2e", border: "1px solid #c084fc40", color: "#c084fc", fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 600 }}>🤖 AI</span>
            : <span style={{ background: "#0f2a1e", border: "1px solid #4ade8040", color: "#4ade80", fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 600 }}>✅ Human</span>
          }
        </div>
      </div>

      {/* Content */}
      {post.title && <div style={{ fontWeight: 700, fontSize: 17, padding: "0 16px 8px", color: "#f0f0f0" }}>{post.title}</div>}
      {post.content && <div style={{ color: "#cbd5e1", fontSize: 15, lineHeight: 1.65, padding: "0 16px 12px", whiteSpace: "pre-wrap" }}>{post.content}</div>}
      {post.image_url && (
        <div style={{ background: "#0d0d1a" }}>
          <img src={post.image_url} alt="post" style={{ width: "100%", maxHeight: 420, objectFit: "cover", display: "block" }} onError={e => e.target.parentElement.style.display = "none"} />
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "10px 12px", borderTop: "1px solid #1e1e3a" }}>
        <button onClick={() => onLike(post)}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: liked ? "#2a1a3e" : "transparent", border: `1px solid ${liked ? "#c084fc" : "#2a2a45"}`, borderRadius: 24, color: liked ? "#c084fc" : "#64748b", fontSize: 14, cursor: "pointer", fontWeight: liked ? 700 : 400, transition: "all 0.15s" }}>
          {liked ? "💜" : "🤍"} {post.likes_count || 0}
        </button>
        <button onClick={() => setShowCommentBox(!showCommentBox)}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "transparent", border: "1px solid #2a2a45", borderRadius: 24, color: "#64748b", fontSize: 14, cursor: "pointer" }}>
          💬 {post.comments_count || 0}
        </button>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "transparent", border: "1px solid #2a2a45", borderRadius: 24, color: "#64748b", fontSize: 14, cursor: "pointer", marginLeft: "auto" }}>
          ↗ Share
        </button>
      </div>

      {/* Inline Comment Box */}
      {showCommentBox && (
        <div style={{ padding: "10px 14px 14px", borderTop: "1px solid #1e1e3a", display: "flex", gap: 10, alignItems: "center" }}>
          <Avatar name={getMyName()} size={32} />
          <input value={comment} onChange={e => setComment(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && comment.trim()) { onComment(post, comment); setComment(""); setShowCommentBox(false); }}}
            placeholder="Write a comment... (Enter to post)"
            style={{ flex: 1, background: "#0d0d1a", border: "1px solid #2a2a45", borderRadius: 20, color: "#f0f0f0", fontSize: 13, padding: "8px 14px", outline: "none" }} />
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [myProfile, setMyProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [humanOnly, setHumanOnly] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [newPostImage, setNewPostImage] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);
  const [posting, setPosting] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeStory, setActiveStory] = useState(null);
  const [loggedIn] = useState(isLoggedIn());
  const navigate = useNavigate();
  const bottomRef = useRef(null);

  useEffect(() => {
    injectGA("G-1N8GD2WM6L");
    // Set favicon & title
    let link = document.querySelector("link[rel~='icon']");
    if (!link) { link = document.createElement("link"); link.rel = "icon"; document.head.appendChild(link); }
    link.href = OS2_ICON;
    document.title = "OurSpace 2.0";
    loadInitial();
  }, []);

  useEffect(() => {
    if (!bottomRef.current) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loadingMore) loadMorePosts();
    }, { threshold: 0.1 });
    obs.observe(bottomRef.current);
    return () => obs.disconnect();
  }, [hasMore, loadingMore, posts]);

  const loadInitial = async () => {
    setLoading(true);
    try {
      const [postsData, storiesData] = await Promise.all([
        fetchPublicPosts(PAGE_SIZE, 0),
        Story.list("-created_date").catch(() => []),
      ]);
      setPosts(postsData || []);
      setHasMore((postsData || []).length === PAGE_SIZE);
      setPage(1);
      setStories((storiesData || []).slice(0, 10));
      if (isLoggedIn()) {
        const [notifData, profileData] = await Promise.all([
          Notification.list().catch(() => []),
          Profile.filter({ user_email: getMyEmail() }).catch(() => []),
        ]);
        setUnreadCount((notifData || []).filter(n => !n.is_read).length);
        setMyProfile(profileData?.[0] || null);
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const loadMorePosts = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const more = await fetchPublicPosts(PAGE_SIZE, page * PAGE_SIZE);
      setPosts(prev => [...prev, ...(more || [])]);
      setHasMore((more || []).length === PAGE_SIZE);
      setPage(p => p + 1);
    } catch (e) { console.error(e); }
    setLoadingMore(false);
  };

  const handleLike = async (post) => {
    if (!loggedIn) { navigate("/Onboarding"); return; }
    const email = getMyEmail();
    const alreadyLiked = Array.isArray(post.liked_by) && post.liked_by.includes(email);
    const newLiked = alreadyLiked ? post.liked_by.filter(e => e !== email) : [...(post.liked_by || []), email];
    await Post.update(post.id, { liked_by: newLiked, likes_count: newLiked.length });
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, liked_by: newLiked, likes_count: newLiked.length } : p));
  };

  const handleComment = async (post, content) => {
    if (!loggedIn) { navigate("/Onboarding"); return; }
    try {
      await Post.update(post.id, { comments_count: (post.comments_count || 0) + 1 });
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, comments_count: (p.comments_count || 0) + 1 } : p));
    } catch (e) { console.error(e); }
  };

  const handlePost = async () => {
    if (!newPost.trim()) return;
    if (!loggedIn) { navigate("/Onboarding"); return; }
    setPosting(true);
    try {
      const created = await Post.create({
        content: newPost.trim(),
        image_url: newPostImage.trim() || null,
        author_name: getMyName(),
        author_email: getMyEmail(),
        author_avatar: myProfile?.avatar_url || null,
        post_type: newPostImage.trim() ? "image" : "text",
        likes_count: 0,
        comments_count: 0,
        liked_by: [],
        is_unfiltered: true,
        is_ai_generated: false,
        searchable_text: newPost.trim().toLowerCase(),
      });
      setPosts(prev => [created, ...prev]);
      setNewPost("");
      setNewPostImage("");
      setShowImageInput(false);
    } catch (e) { console.error(e); }
    setPosting(false);
  };

  const filtered = humanOnly ? posts.filter(p => !p.is_ai_generated) : posts;

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d1a", color: "#f0f0f0", fontFamily: "'Segoe UI', system-ui, sans-serif", paddingBottom: 80 }}>

      {/* Top Bar */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "#0b0b1eee", backdropFilter: "blur(16px)", borderBottom: "1px solid #1e1e3a", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src={OS2_ICON} alt="" style={{ width: 32, height: 32, borderRadius: 8 }} onError={e => e.target.style.display = "none"} />
          <span style={{ fontWeight: 900, fontSize: 20, background: "linear-gradient(90deg,#c084fc,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>OurSpace 2.0</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={() => setHumanOnly(!humanOnly)}
            style={{ padding: "6px 14px", background: humanOnly ? "#0f2a1e" : "#16162a", border: `1px solid ${humanOnly ? "#4ade80" : "#2a2a45"}`, borderRadius: 24, color: humanOnly ? "#4ade80" : "#64748b", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
            {humanOnly ? "✅ Human" : "👁 All"}
          </button>
          <button onClick={() => navigate("/Notifications")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, position: "relative", color: "white", padding: "4px 8px" }}>
            🔔
            {unreadCount > 0 && <span style={{ position: "absolute", top: 0, right: 0, background: "#c084fc", color: "#fff", borderRadius: "50%", width: 16, height: 16, fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{unreadCount}</span>}
          </button>
          {loggedIn
            ? <div onClick={() => navigate("/MyProfile")} style={{ cursor: "pointer" }}><Avatar name={getMyName()} url={myProfile?.avatar_url} size={34} /></div>
            : <button onClick={() => navigate("/Onboarding")} style={{ padding: "8px 18px", background: "linear-gradient(135deg,#c084fc,#22d3ee)", border: "none", borderRadius: 20, color: "#000", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Join</button>
          }
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "16px 16px 0" }}>

        {/* Stories Row */}
        {stories.length > 0 && (
          <div style={{ background: "#13132b", borderRadius: 20, padding: "16px", marginBottom: 16, border: "1px solid #1e1e3a" }}>
            <div style={{ fontSize: 13, color: "#64748b", fontWeight: 600, marginBottom: 12 }}>✨ Stories</div>
            <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 4 }}>
              {/* Add your story */}
              {loggedIn && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer", flexShrink: 0 }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#1e1e3a", border: "2px dashed #2a2a55", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>+</div>
                  <span style={{ fontSize: 11, color: "#64748b" }}>Your Story</span>
                </div>
              )}
              {stories.map(s => <StoryCard key={s.id} story={s} onClick={() => setActiveStory(s)} />)}
            </div>
          </div>
        )}

        {/* Post Composer */}
        <div style={{ background: "#13132b", borderRadius: 20, marginBottom: 16, border: "1px solid #1e1e3a", overflow: "hidden" }}>
          <div style={{ display: "flex", gap: 12, padding: "14px 16px 10px" }}>
            <Avatar name={getMyName()} url={myProfile?.avatar_url} size={42} />
            <textarea
              value={newPost}
              onChange={e => setNewPost(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && e.metaKey) handlePost(); }}
              placeholder={loggedIn ? `What's on your mind, ${getMyName().split(" ")[0]}?` : "👋 Join OurSpace to post..."}
              disabled={!loggedIn}
              style={{ flex: 1, background: "#0d0d1a", border: "1px solid #1e1e3a", borderRadius: 14, color: "#f0f0f0", fontSize: 15, padding: "10px 14px", resize: "none", outline: "none", minHeight: 72, fontFamily: "inherit", lineHeight: 1.5, opacity: loggedIn ? 1 : 0.6 }}
            />
          </div>
          {showImageInput && (
            <div style={{ padding: "0 16px 12px", display: "flex", gap: 10 }}>
              <input value={newPostImage} onChange={e => setNewPostImage(e.target.value)}
                placeholder="Paste image URL..."
                style={{ flex: 1, background: "#0d0d1a", border: "1px solid #1e1e3a", borderRadius: 10, color: "#f0f0f0", fontSize: 13, padding: "8px 12px", outline: "none" }} />
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", padding: "0 16px 14px", gap: 8 }}>
            <button onClick={() => setShowImageInput(!showImageInput)} style={{ padding: "6px 14px", background: "transparent", border: "1px solid #2a2a45", borderRadius: 20, color: "#64748b", fontSize: 13, cursor: "pointer" }}>🖼 Photo</button>
            <button onClick={() => loggedIn ? null : navigate("/Onboarding")} style={{ padding: "6px 14px", background: "transparent", border: "1px solid #2a2a45", borderRadius: 20, color: "#64748b", fontSize: 13, cursor: "pointer" }}>🔗 Link</button>
            <button onClick={loggedIn ? handlePost : () => navigate("/Onboarding")}
              disabled={loggedIn && (posting || !newPost.trim())}
              style={{ marginLeft: "auto", padding: "8px 22px", background: (loggedIn && newPost.trim()) ? "linear-gradient(135deg,#c084fc,#22d3ee)" : "#2a2a45", border: "none", borderRadius: 20, color: (loggedIn && newPost.trim()) ? "#000" : "#64748b", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              {posting ? "Posting..." : loggedIn ? "Post" : "Join to Post"}
            </button>
          </div>
        </div>

        {/* Feed */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ background: "#13132b", borderRadius: 20, height: 180, border: "1px solid #1e1e3a", opacity: 0.5 }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 48, color: "#64748b" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🌌</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Nothing here yet</div>
            <div style={{ fontSize: 14 }}>Be the first to post something 🚀</div>
          </div>
        ) : (
          filtered.map(post => (
            <PostCard
              key={post.id}
              post={post}
              currentUserEmail={getMyEmail()}
              onLike={handleLike}
              onNavigate={navigate}
              onComment={handleComment}
            />
          ))
        )}

        {/* Infinite scroll sentinel */}
        <div ref={bottomRef} style={{ height: 20 }} />
        {loadingMore && <div style={{ textAlign: "center", padding: 16, color: "#64748b", fontSize: 14 }}>Loading more...</div>}
      </div>

      {/* Story Viewer Modal */}
      {activeStory && (
        <div onClick={() => setActiveStory(null)} style={{ position: "fixed", inset: 0, background: "#000000cc", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#13132b", borderRadius: 24, maxWidth: 400, width: "90%", overflow: "hidden", border: "1px solid #2a2a45" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderBottom: "1px solid #1e1e3a" }}>
              <Avatar name={activeStory.author_name} size={38} />
              <div>
                <div style={{ fontWeight: 700 }}>{activeStory.author_name}</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>{activeStory.music_title && `🎵 ${activeStory.music_title}`}</div>
              </div>
              <button onClick={() => setActiveStory(null)} style={{ marginLeft: "auto", background: "none", border: "none", color: "#94a3b8", fontSize: 22, cursor: "pointer" }}>×</button>
            </div>
            {activeStory.media_url && (
              <img src={activeStory.media_url} alt="" style={{ width: "100%", maxHeight: 320, objectFit: "cover" }} onError={e => e.target.style.display = "none"} />
            )}
            <div style={{ padding: "12px 16px" }}>
              {activeStory.text_overlay && <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{activeStory.text_overlay}</div>}
              {activeStory.caption && <div style={{ color: "#94a3b8", fontSize: 14 }}>{activeStory.caption}</div>}
              {activeStory.poll_question && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontWeight: 600, marginBottom: 8 }}>📊 {activeStory.poll_question}</div>
                  {(activeStory.poll_options || []).map((opt, i) => (
                    <button key={i} style={{ display: "block", width: "100%", marginBottom: 6, padding: "8px 14px", background: "#0d0d1a", border: "1px solid #2a2a45", borderRadius: 10, color: "#f0f0f0", fontSize: 14, cursor: "pointer", textAlign: "left" }}>{opt}</button>
                  ))}
                </div>
              )}
              <div style={{ marginTop: 10, color: "#475569", fontSize: 12 }}>👁 {activeStory.views || 0} views</div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#0b0b1ef5", backdropFilter: "blur(16px)", borderTop: "1px solid #1e1e3a", display: "flex", justifyContent: "space-around", padding: "10px 0 12px", zIndex: 100 }}>
        {NAV.map(item => {
          const active = window.location.pathname === item.path;
          return (
            <button key={item.path} onClick={() => navigate(item.path)}
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "4px 12px" }}>
              <span style={{ fontSize: 22, filter: active ? "none" : "grayscale(50%)", opacity: active ? 1 : 0.5 }}>{item.icon}</span>
              <span style={{ fontSize: 10, color: active ? "#c084fc" : "#475569", fontWeight: active ? 700 : 400 }}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
