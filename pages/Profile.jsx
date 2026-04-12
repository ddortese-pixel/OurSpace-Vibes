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
function getMyName() { return localStorage.getItem("os2_name") || "Guest"; }
function isLoggedIn() { return !!localStorage.getItem("os2_email"); }
function getConvoId(a, b) { return [a, b].sort().join("__"); }

const NAV = [
  { icon: "🏠", label: "Home", path: "/Home" },
  { icon: "🔍", label: "Discover", path: "/Discover" },
  { icon: "✉️", label: "Messages", path: "/Messages" },
  { icon: "🔔", label: "Alerts", path: "/Notifications" },
  { icon: "👤", label: "Me", path: "/MyProfile" },
];

const THEMES = {
  "purple-pink":  { bg: "#0d0520", accent: "#c084fc", grad: "linear-gradient(135deg,#c084fc,#ec4899)", border: "#c084fc40", glitter: "#c084fc" },
  "blue-cyan":    { bg: "#020c1b", accent: "#22d3ee", grad: "linear-gradient(135deg,#3b82f6,#22d3ee)", border: "#22d3ee40", glitter: "#22d3ee" },
  "orange-red":   { bg: "#1a0600", accent: "#f97316", grad: "linear-gradient(135deg,#f97316,#ef4444)", border: "#f9731640", glitter: "#f97316" },
  "green-teal":   { bg: "#001a0a", accent: "#4ade80", grad: "linear-gradient(135deg,#22c55e,#14b8a6)", border: "#4ade8040", glitter: "#4ade80" },
  "hot-pink":     { bg: "#1a0010", accent: "#f472b6", grad: "linear-gradient(135deg,#f472b6,#c026d3)", border: "#f472b640", glitter: "#f472b6" },
  "gold-black":   { bg: "#0d0900", accent: "#f59e0b", grad: "linear-gradient(135deg,#f59e0b,#d97706)", border: "#f59e0b40", glitter: "#f59e0b" },
};

function BottomNav({ navigate }) {
  const path = window.location.pathname;
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#0b0b1ef5", backdropFilter: "blur(16px)", borderTop: "1px solid #1e1e3a", display: "flex", justifyContent: "space-around", padding: "10px 0 12px", zIndex: 100 }}>
      {NAV.map(item => {
        const active = path === item.path;
        return (
          <button key={item.path} onClick={() => navigate(item.path)}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <span style={{ fontSize: 22, opacity: active ? 1 : 0.5 }}>{item.icon}</span>
            <span style={{ fontSize: 10, color: active ? "#c084fc" : "#475569", fontWeight: active ? 700 : 400 }}>{item.label}</span>
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
  const myEmail = getMyEmail();
  const loggedIn = isLoggedIn();
  const isOwnProfile = myEmail && email === myEmail;

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [wall, setWall] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendStatus, setFriendStatus] = useState(null);
  const [tab, setTab] = useState("wall");
  const [wallDraft, setWallDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [sendingFriend, setSendingFriend] = useState(false);

  useEffect(() => {
    injectGA("G-1N8GD2WM6L");
    if (!email) { navigate("/MyProfile"); return; }
    if (isOwnProfile) { navigate("/MyProfile"); return; }
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
      setPosts((myPosts || []).sort((a,b) => new Date(b.created_date) - new Date(a.created_date)));
      setWall((myWall || []).sort((a,b) => new Date(b.created_date) - new Date(a.created_date)));

      if (prof?.id && email !== myEmail) {
        Profile.update(prof.id, { profile_views: (prof.profile_views || 0) + 1 }).catch(() => {});
      }

      const myFriends = (allFriends || []).filter(f => f.status === "accepted" && (f.requester_email === email || f.receiver_email === email));
      setFriends(myFriends);

      if (loggedIn && myEmail) {
        const rel = allFriends.find(f =>
          (f.requester_email === myEmail && f.receiver_email === email) ||
          (f.receiver_email === myEmail && f.requester_email === email)
        );
        setFriendStatus(rel || null);
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const sendFriendRequest = async () => {
    if (!loggedIn) { navigate("/OurSpaceOnboarding"); return; }
    setSendingFriend(true);
    try {
      const f = await Friend.create({ requester_email: myEmail, receiver_email: email, status: "pending", requester_name: getMyName(), receiver_name: profile?.display_name || email });
      setFriendStatus(f);
      await Notification.create({ user_email: email, from_email: myEmail, from_name: getMyName(), type: "friend_request", message: `${getMyName()} sent you a friend request`, is_read: false }).catch(() => {});
    } catch (e) { console.error(e); }
    setSendingFriend(false);
  };

  const postOnWall = async () => {
    if (!wallDraft.trim()) return;
    if (!loggedIn) { navigate("/OurSpaceOnboarding"); return; }
    setPosting(true);
    try {
      const w = await WallPost.create({ profile_email: email, author_email: myEmail, author_name: getMyName(), content: wallDraft.trim() });
      setWall(prev => [w, ...prev]);
      setWallDraft("");
      await Notification.create({ user_email: email, from_email: myEmail, from_name: getMyName(), type: "wall_post", message: `${getMyName()} left a message on your wall`, is_read: false }).catch(() => {});
    } catch (e) { console.error(e); }
    setPosting(false);
  };

  const theme = THEMES[profile?.theme_color || "purple-pink"];
  const top8 = friends.slice(0, 8);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0d0d1a", display: "flex", alignItems: "center", justifyContent: "center", color: "#c084fc", fontFamily: "'Segoe UI', sans-serif" }}>
      Loading space...
    </div>
  );

  if (!profile) return (
    <div style={{ minHeight: "100vh", background: "#0d0d1a", color: "#f0f0f0", fontFamily: "'Segoe UI', sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 32, paddingBottom: 80 }}>
      <div style={{ fontSize: 60 }}>🌌</div>
      <div style={{ fontSize: 20, fontWeight: 700 }}>Space not found</div>
      <div style={{ color: "#64748b", fontSize: 14, textAlign: "center", maxWidth: 280, lineHeight: 1.6 }}>This person hasn't claimed their space yet.</div>
      <button onClick={() => navigate("/Discover")} style={{ padding: "10px 24px", background: "linear-gradient(135deg,#c084fc,#22d3ee)", border: "none", borderRadius: 24, color: "#000", fontWeight: 700, cursor: "pointer" }}>Browse People</button>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, color: "#f0f0f0", fontFamily: "'Segoe UI', system-ui, sans-serif", paddingBottom: 80 }}>

      <style>{`
        @keyframes sparkle { 0%,100%{opacity:0;transform:scale(0)} 50%{opacity:1;transform:scale(1)} }
        @keyframes marquee { 0%{transform:translateX(100%)} 100%{transform:translateX(-100%)} }
        @keyframes pulse-glow { 0%,100%{box-shadow:0 0 10px ${theme.glitter}60} 50%{box-shadow:0 0 30px ${theme.glitter}aa} }
        .glitter-border { animation: pulse-glow 2.5s ease-in-out infinite; }
        .sparkle-dot { position:absolute; border-radius:50%; animation: sparkle 1.5s ease-in-out infinite; }
      `}</style>

      {/* Cover Banner */}
      <div style={{ position: "relative", height: 140, background: theme.grad, overflow: "hidden" }}>
        {profile.cover_photo && <img src={profile.cover_photo} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} />}
        {[...Array(14)].map((_, i) => (
          <div key={i} className="sparkle-dot" style={{ width: i % 3 === 0 ? 6 : 4, height: i % 3 === 0 ? 6 : 4, background: "#fff", top: `${10 + (i * 37) % 80}%`, left: `${(i * 71) % 100}%`, animationDelay: `${(i * 0.23).toFixed(2)}s`, animationDuration: `${1.2 + (i * 0.15) % 1.2}s` }} />
        ))}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.7))" }} />
        <button onClick={() => navigate(-1)} style={{ position: "absolute", top: 14, left: 14, background: "#00000066", border: "none", borderRadius: 20, color: "#fff", padding: "6px 14px", cursor: "pointer", fontSize: 13, backdropFilter: "blur(8px)" }}>← Back</button>
        {profile.headline && (
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "#00000080", padding: "4px 0", overflow: "hidden", height: 24 }}>
            <div style={{ animation: "marquee 18s linear infinite", whiteSpace: "nowrap", color: theme.accent, fontSize: 12, fontWeight: 700 }}>
              ✨&nbsp;&nbsp;{profile.headline}&nbsp;&nbsp;✨&nbsp;&nbsp;{profile.headline}&nbsp;&nbsp;✨
            </div>
          </div>
        )}
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 12px" }}>

        {/* Avatar + Name + Actions */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: -50, marginBottom: 16, position: "relative", zIndex: 10 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-end" }}>
            <div className="glitter-border" style={{ width: 96, height: 96, borderRadius: 16, border: `3px solid ${theme.accent}`, background: theme.grad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38, fontWeight: 700, flexShrink: 0, overflow: "hidden" }}>
              {profile.avatar_url
                ? <img src={profile.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} />
                : (profile.avatar_emoji || profile.display_name?.[0] || "?")}
            </div>
            <div style={{ paddingBottom: 8 }}>
              <h1 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 900, color: "#fff", textShadow: `0 0 20px ${theme.accent}80` }}>{profile.display_name}</h1>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {profile.is_online && <span style={{ background: "#0f2a1e", border: "1px solid #4ade8040", color: "#4ade80", fontSize: 11, padding: "2px 10px", borderRadius: 20 }}>● Online Now</span>}
                {profile.mood && <span style={{ background: `${theme.accent}20`, border: `1px solid ${theme.border}`, color: theme.accent, fontSize: 12, padding: "2px 10px", borderRadius: 20 }}>{profile.mood}</span>}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, paddingBottom: 8 }}>
            {loggedIn && (
              <button onClick={() => navigate("/Messages")} style={{ padding: "8px 14px", background: "#13132b", border: `1px solid ${theme.border}`, borderRadius: 20, color: theme.accent, fontSize: 13, cursor: "pointer", fontWeight: 600 }}>✉️ Message</button>
            )}
            {!friendStatus && (
              <button onClick={sendFriendRequest} disabled={sendingFriend}
                style={{ padding: "8px 18px", background: theme.grad, border: "none", borderRadius: 20, color: "#000", fontWeight: 700, fontSize: 13, cursor: "pointer", opacity: sendingFriend ? 0.7 : 1 }}>
                {loggedIn ? (sendingFriend ? "Sending..." : "➕ Add Friend") : "Join to Connect"}
              </button>
            )}
            {friendStatus?.status === "pending" && <span style={{ padding: "8px 14px", background: "#1e1e3a", borderRadius: 20, color: "#94a3b8", fontSize: 13 }}>⏳ Pending</span>}
            {friendStatus?.status === "accepted" && <span style={{ padding: "8px 14px", background: "#0f2a1e", border: "1px solid #4ade8040", borderRadius: 20, color: "#4ade80", fontSize: 13, fontWeight: 600 }}>✅ Friends</span>}
          </div>
        </div>

        {/* 2-Column Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 16, alignItems: "start" }}>

          {/* LEFT SIDEBAR */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* About */}
            <div style={{ background: "#13132b", borderRadius: 16, border: `1px solid ${theme.border}`, overflow: "hidden" }}>
              <div style={{ background: theme.grad, padding: "8px 14px", fontWeight: 700, fontSize: 13, color: "#000" }}>👤 About {profile.display_name?.split(" ")[0]}</div>
              <div style={{ padding: "12px 14px" }}>
                {profile.about_me
                  ? <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{profile.about_me}</p>
                  : <p style={{ color: "#475569", fontSize: 13, margin: 0, fontStyle: "italic" }}>No bio yet...</p>}
              </div>
            </div>

            {/* Details */}
            <div style={{ background: "#13132b", borderRadius: 16, border: `1px solid ${theme.border}`, overflow: "hidden" }}>
              <div style={{ background: theme.grad, padding: "8px 14px", fontWeight: 700, fontSize: 13, color: "#000" }}>ℹ️ Details</div>
              <div style={{ padding: "10px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
                {[["Mood", profile.mood || "🌀 Vibing"],["Posts", posts.length],["Friends", friends.length],["Profile Views", `${profile.profile_views || 0} 👁`]].map(([k,v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ color: "#475569" }}>{k}</span>
                    <span style={{ fontWeight: 700, color: k === "Mood" ? theme.accent : "#f0f0f0" }}>{v}</span>
                  </div>
                ))}
                {profile.song_playing && (
                  <div style={{ marginTop: 4, padding: "10px 12px", background: `${theme.accent}15`, borderRadius: 10, border: `1px solid ${theme.border}` }}>
                    <div style={{ fontSize: 11, color: "#64748b", marginBottom: 3 }}>NOW PLAYING</div>
                    <div style={{ color: theme.accent, fontSize: 13, fontWeight: 700 }}>🎵 {profile.song_playing}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Interests */}
            {Array.isArray(profile.interests) && profile.interests.length > 0 && (
              <div style={{ background: "#13132b", borderRadius: 16, border: `1px solid ${theme.border}`, overflow: "hidden" }}>
                <div style={{ background: theme.grad, padding: "8px 14px", fontWeight: 700, fontSize: 13, color: "#000" }}>✨ Interests</div>
                <div style={{ padding: "10px 12px", display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {profile.interests.map((int, i) => (
                    <span key={i} style={{ background: `${theme.accent}15`, color: theme.accent, fontSize: 12, padding: "4px 10px", borderRadius: 20, border: `1px solid ${theme.border}` }}>{int}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Top 8 */}
            <div style={{ background: "#13132b", borderRadius: 16, border: `1px solid ${theme.border}`, overflow: "hidden" }}>
              <div style={{ background: theme.grad, padding: "8px 14px", fontWeight: 700, fontSize: 13, color: "#000" }}>👥 {profile.display_name?.split(" ")[0]}'s Friends ({friends.length})</div>
              <div style={{ padding: "10px 12px" }}>
                {top8.length === 0
                  ? <div style={{ color: "#475569", fontSize: 12, textAlign: "center", padding: "10px 0" }}>No friends yet</div>
                  : <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                      {top8.map((f, i) => {
                        const fEmail = f.requester_email === email ? f.receiver_email : f.requester_email;
                        const fName = f.requester_email === email ? f.receiver_name : f.requester_name;
                        const fAvatar = f.requester_email === email ? f.receiver_avatar : f.requester_avatar;
                        return (
                          <div key={i} onClick={() => navigate(`/Profile?email=${fEmail}`)} style={{ cursor: "pointer", textAlign: "center" }}>
                            <div style={{ width: 46, height: 46, borderRadius: 10, background: theme.grad, margin: "0 auto 4px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 17, overflow: "hidden", border: `2px solid ${theme.border}` }}>
                              {fAvatar ? <img src={fAvatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} /> : (fName?.[0] || "?")}
                            </div>
                            <div style={{ fontSize: 10, color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{fName?.split(" ")[0] || "Friend"}</div>
                          </div>
                        );
                      })}
                    </div>
                }
              </div>
            </div>

          </div>

          {/* RIGHT MAIN */}
          <div>
            <div style={{ display: "flex", borderBottom: `2px solid ${theme.border}`, marginBottom: 14 }}>
              {[["wall","📌 Guestbook Wall"],["posts","📝 Posts"],["photos","📸 Photos"]].map(([id, label]) => (
                <button key={id} onClick={() => setTab(id)}
                  style={{ padding: "10px 20px", background: "transparent", border: "none", borderBottom: `3px solid ${tab === id ? theme.accent : "transparent"}`, color: tab === id ? theme.accent : "#475569", fontWeight: tab === id ? 700 : 400, cursor: "pointer", fontSize: 14 }}>
                  {label}
                </button>
              ))}
            </div>

            {/* GUESTBOOK WALL */}
            {tab === "wall" && (
              <div>
                {loggedIn && (
                  <div style={{ background: "#13132b", borderRadius: 16, padding: 16, marginBottom: 14, border: `1px solid ${theme.border}` }}>
                    <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 8 }}>Leave {profile.display_name?.split(" ")[0]} a message ✍️</div>
                    <textarea value={wallDraft} onChange={e => setWallDraft(e.target.value)} placeholder={`Write on ${profile.display_name?.split(" ")[0]}'s wall...`}
                      rows={3} style={{ width: "100%", background: "#0d0d1a", border: `1px solid ${theme.border}`, borderRadius: 10, color: "#f0f0f0", fontSize: 14, padding: "10px 12px", outline: "none", resize: "none", boxSizing: "border-box", marginBottom: 10 }} />
                    <button onClick={postOnWall} disabled={!wallDraft.trim() || posting}
                      style={{ padding: "9px 20px", background: wallDraft.trim() ? theme.grad : "#1e1e3a", border: "none", borderRadius: 20, color: wallDraft.trim() ? "#000" : "#475569", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                      {posting ? "Posting..." : "📌 Post to Wall"}
                    </button>
                  </div>
                )}
                {!loggedIn && (
                  <div style={{ background: "#13132b", borderRadius: 16, padding: 16, marginBottom: 14, border: `1px solid ${theme.border}`, textAlign: "center" }}>
                    <div style={{ fontSize: 13, color: "#64748b", marginBottom: 10 }}>Sign in to leave a message on {profile.display_name?.split(" ")[0]}'s wall</div>
                    <button onClick={() => navigate("/OurSpaceOnboarding")} style={{ padding: "9px 24px", background: theme.grad, border: "none", borderRadius: 20, color: "#000", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Join OurSpace →</button>
                  </div>
                )}
                {wall.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 20px", color: "#475569" }}>
                    <div style={{ fontSize: 40, marginBottom: 10 }}>📌</div>
                    <div style={{ fontWeight: 700, color: "#64748b" }}>Wall is empty</div>
                    <div style={{ fontSize: 13, marginTop: 6 }}>Be the first to leave a message!</div>
                  </div>
                ) : wall.map(w => (
                  <div key={w.id} style={{ background: "#13132b", borderRadius: 16, padding: 16, marginBottom: 10, border: `1px solid ${theme.border}` }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <div style={{ width: 38, height: 38, borderRadius: "50%", background: theme.grad, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 15, flexShrink: 0 }}>
                        {w.author_name?.[0] || "?"}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: theme.accent, cursor: "pointer" }} onClick={() => navigate(`/Profile?email=${w.author_email}`)}>{w.author_name}</div>
                        <div style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6, marginTop: 4 }}>{w.content}</div>
                        <div style={{ color: "#475569", fontSize: 11, marginTop: 6 }}>{w.created_date ? new Date(w.created_date).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : ""}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* POSTS */}
            {tab === "posts" && (
              posts.length === 0
                ? <div style={{ textAlign: "center", padding: "40px 20px", color: "#475569" }}>
                    <div style={{ fontSize: 40, marginBottom: 10 }}>📝</div>
                    <div style={{ fontWeight: 700, color: "#64748b" }}>No posts yet</div>
                  </div>
                : posts.map(p => (
                  <div key={p.id} style={{ background: "#13132b", borderRadius: 16, padding: 16, marginBottom: 10, border: `1px solid ${theme.border}` }}>
                    {p.title && <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{p.title}</div>}
                    {p.content && <div style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6, marginBottom: p.image_url ? 10 : 0 }}>{p.content}</div>}
                    {p.image_url && <img src={p.image_url} alt="" style={{ width: "100%", borderRadius: 10, maxHeight: 280, objectFit: "cover" }} onError={e => e.target.style.display = "none"} />}
                    <div style={{ marginTop: 10, display: "flex", gap: 14, color: "#475569", fontSize: 13 }}>
                      <span>💜 {p.likes_count || 0}</span><span>💬 {p.comments_count || 0}</span>
                      <span style={{ marginLeft: "auto", fontSize: 11 }}>{p.created_date ? new Date(p.created_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}</span>
                    </div>
                  </div>
                ))
            )}

            {/* PHOTOS */}
            {tab === "photos" && (
              posts.filter(p => p.image_url).length === 0
                ? <div style={{ textAlign: "center", padding: "40px 20px", color: "#475569" }}>
                    <div style={{ fontSize: 40, marginBottom: 10 }}>📸</div>
                    <div style={{ fontWeight: 700, color: "#64748b" }}>No photos yet</div>
                  </div>
                : <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
                    {posts.filter(p => p.image_url).map(p => (
                      <div key={p.id} style={{ aspectRatio: "1", borderRadius: 10, overflow: "hidden", border: `1px solid ${theme.border}` }}>
                        <img src={p.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.parentElement.style.display = "none"} />
                      </div>
                    ))}
                  </div>
            )}
          </div>
        </div>
      </div>

      <BottomNav navigate={navigate} />
    </div>
  );
}
