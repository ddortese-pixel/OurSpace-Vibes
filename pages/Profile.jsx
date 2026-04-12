import { useState, useEffect } from "react";
import { Profile, Post, WallPost, Friend, Notification, Message } from "../api/entities";
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

const GRADIENTS = {
  "purple-pink": "linear-gradient(135deg,#c084fc,#ec4899)",
  "orange-red": "linear-gradient(135deg,#f97316,#ef4444)",
  "green-teal": "linear-gradient(135deg,#22c55e,#14b8a6)",
  "blue-cyan": "linear-gradient(135deg,#3b82f6,#22d3ee)",
  "teal-blue": "linear-gradient(135deg,#14b8a6,#3b82f6)",
  "default": "linear-gradient(135deg,#c084fc,#22d3ee)",
};

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
  const [friendStatus, setFriendStatus] = useState(null);
  const [tab, setTab] = useState("posts");
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
      const [profs, myPosts, myWall] = await Promise.all([
        Profile.filter({ user_email: email }),
        Post.filter({ author_email: email }),
        WallPost.filter({ profile_email: email }),
      ]);
      const prof = profs[0] || null;
      setProfile(prof);
      setPosts(myPosts || []);
      setWall(myWall || []);

      // Increment profile views
      if (prof?.id && email !== myEmail) {
        Profile.update(prof.id, { profile_views: (prof.profile_views || 0) + 1 }).catch(() => {});
      }

      if (loggedIn && myEmail) {
        const friends = await Friend.list().catch(() => []);
        const rel = friends.find(f =>
          (f.requester_email === myEmail && f.receiver_email === email) ||
          (f.receiver_email === myEmail && f.requester_email === email)
        );
        setFriendStatus(rel || null);
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const sendFriendRequest = async () => {
    if (!loggedIn) { navigate("/Onboarding"); return; }
    setSendingFriend(true);
    try {
      const f = await Friend.create({
        requester_email: myEmail,
        receiver_email: email,
        status: "pending",
        requester_name: getMyName(),
        receiver_name: profile?.display_name || email,
      });
      setFriendStatus(f);
      await Notification.create({
        user_email: email,
        from_email: myEmail,
        from_name: getMyName(),
        type: "friend_request",
        message: `${getMyName()} sent you a friend request`,
        is_read: false,
      }).catch(() => {});
    } catch (e) { console.error(e); }
    setSendingFriend(false);
  };

  const startMessage = () => {
    if (!loggedIn) { navigate("/Onboarding"); return; }
    navigate("/Messages");
  };

  const postOnWall = async () => {
    if (!wallDraft.trim()) return;
    if (!loggedIn) { navigate("/Onboarding"); return; }
    setPosting(true);
    try {
      const w = await WallPost.create({
        profile_email: email,
        author_email: myEmail,
        author_name: getMyName(),
        content: wallDraft.trim(),
      });
      setWall(prev => [w, ...prev]);
      setWallDraft("");
      await Notification.create({
        user_email: email,
        from_email: myEmail,
        from_name: getMyName(),
        type: "wall_post",
        message: `${getMyName()} left a message on your wall`,
        is_read: false,
      }).catch(() => {});
    } catch (e) { console.error(e); }
    setPosting(false);
  };

  const bg = GRADIENTS[profile?.background_gradient] || GRADIENTS.default;

  if (!email) return null;

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0d0d1a", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif", fontSize: 18 }}>
      Loading profile...
    </div>
  );

  if (!profile) return (
    <div style={{ minHeight: "100vh", background: "#0d0d1a", color: "#f0f0f0", fontFamily: "'Segoe UI', sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 32, paddingBottom: 80 }}>
      <div style={{ fontSize: 60 }}>🌌</div>
      <div style={{ fontSize: 20, fontWeight: 700 }}>Profile not found</div>
      <div style={{ color: "#64748b", fontSize: 14, textAlign: "center", maxWidth: 280, lineHeight: 1.6 }}>This person hasn't set up their profile yet — or the link is invalid.</div>
      <button onClick={() => navigate("/Discover")} style={{ padding: "10px 24px", background: "linear-gradient(135deg,#c084fc,#22d3ee)", border: "none", borderRadius: 24, color: "#000", fontWeight: 700, cursor: "pointer" }}>Browse People</button>
      <button onClick={() => navigate("/Home")} style={{ background: "none", border: "1px solid #2a2a45", borderRadius: 24, color: "#94a3b8", padding: "8px 20px", cursor: "pointer", fontSize: 14 }}>← Back to Feed</button>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d1a", color: "#f0f0f0", fontFamily: "'Segoe UI', system-ui, sans-serif", paddingBottom: 80 }}>

      {/* Cover */}
      <div style={{ height: 170, background: bg, position: "relative" }}>
        {profile.cover_photo && (
          <img src={profile.cover_photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} onError={e => e.target.style.display = "none"} />
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, #0d0d1a)" }} />
        <button onClick={() => navigate(-1)} style={{ position: "absolute", top: 14, left: 14, background: "#00000066", border: "none", borderRadius: 20, color: "#fff", padding: "6px 14px", cursor: "pointer", fontSize: 13, backdropFilter: "blur(8px)" }}>← Back</button>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 16px" }}>

        {/* Avatar + Actions */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: -44, marginBottom: 18 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-end" }}>
            <div style={{ width: 86, height: 86, borderRadius: "50%", background: "linear-gradient(135deg,#c084fc,#22d3ee)", border: "4px solid #0d0d1a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, fontWeight: 700, flexShrink: 0, overflow: "hidden", boxShadow: "0 4px 20px #c084fc40" }}>
              {profile.avatar_url
                ? <img src={profile.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} />
                : (profile.display_name?.[0]?.toUpperCase() || "?")}
            </div>
            <div style={{ paddingBottom: 6 }}>
              <div style={{ fontWeight: 900, fontSize: 21 }}>{profile.display_name}</div>
              {profile.headline && <div style={{ color: "#64748b", fontSize: 13, marginTop: 2 }}>{profile.headline}</div>}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 8, paddingBottom: 4 }}>
            {loggedIn && (
              <button onClick={startMessage} style={{ padding: "8px 14px", background: "#13132b", border: "1px solid #1e1e3a", borderRadius: 20, color: "#94a3b8", fontSize: 13, cursor: "pointer" }}>
                ✉️ Message
              </button>
            )}
            {!friendStatus && (
              <button onClick={sendFriendRequest} disabled={sendingFriend}
                style={{ padding: "8px 16px", background: "linear-gradient(135deg,#c084fc,#22d3ee)", border: "none", borderRadius: 20, color: "#000", fontWeight: 700, fontSize: 13, cursor: "pointer", opacity: sendingFriend ? 0.7 : 1 }}>
                {loggedIn ? (sendingFriend ? "Sending..." : "+ Connect") : "Join to Connect"}
              </button>
            )}
            {friendStatus?.status === "pending" && (
              <span style={{ padding: "8px 14px", background: "#1e1e3a", borderRadius: 20, color: "#94a3b8", fontSize: 13 }}>Pending...</span>
            )}
            {friendStatus?.status === "accepted" && (
              <span style={{ padding: "8px 14px", background: "#0f2a1e", border: "1px solid #4ade8040", borderRadius: 20, color: "#4ade80", fontSize: 13, fontWeight: 600 }}>✅ Friends</span>
            )}
          </div>
        </div>

        {/* Status chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 12 }}>
          {profile.is_online && <span style={{ background: "#0f2a1e", border: "1px solid #4ade8030", color: "#4ade80", fontSize: 12, padding: "4px 12px", borderRadius: 20 }}>● Online Now</span>}
          {profile.mood && <span style={{ background: "#1e1a2e", border: "1px solid #c084fc30", color: "#c084fc", fontSize: 12, padding: "4px 12px", borderRadius: 20 }}>😶 {profile.mood}</span>}
          {profile.song_playing && <span style={{ background: "#0d1a2a", border: "1px solid #22d3ee30", color: "#22d3ee", fontSize: 12, padding: "4px 12px", borderRadius: 20 }}>🎵 {profile.song_playing}</span>}
        </div>

        {/* Bio */}
        {profile.about_me && (
          <div style={{ color: "#94a3b8", fontSize: 15, lineHeight: 1.65, marginBottom: 14 }}>{profile.about_me}</div>
        )}

        {/* Interests */}
        {Array.isArray(profile.interests) && profile.interests.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
            {profile.interests.map((interest, i) => (
              <span key={i} style={{ background: "#1e1a2e", border: "1px solid #c084fc20", color: "#c084fc", fontSize: 12, padding: "3px 10px", borderRadius: 20 }}>{interest}</span>
            ))}
          </div>
        )}

        {/* Social links */}
        {profile.social_links && Object.entries(profile.social_links || {}).filter(([, v]) => v).length > 0 && (
          <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            {Object.entries(profile.social_links || {}).filter(([, v]) => v).map(([platform, url]) => (
              <a key={platform} href={url} target="_blank" rel="noreferrer"
                style={{ padding: "5px 12px", background: "#13132b", border: "1px solid #1e1e3a", borderRadius: 20, color: "#94a3b8", fontSize: 12, textDecoration: "none" }}>
                🔗 {platform}
              </a>
            ))}
          </div>
        )}

        {/* Stats */}
        <div style={{ display: "flex", gap: 28, marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #1e1e3a" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontWeight: 900, fontSize: 20 }}>{posts.length}</div>
            <div style={{ color: "#64748b", fontSize: 12 }}>Posts</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontWeight: 900, fontSize: 20 }}>{profile.profile_views || 0}</div>
            <div style={{ color: "#64748b", fontSize: 12 }}>Views</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 2, borderBottom: "1px solid #1e1e3a", marginBottom: 16 }}>
          {["posts", "wall"].map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: "10px 22px", background: "transparent", border: "none", borderBottom: `2px solid ${tab === t ? "#c084fc" : "transparent"}`, color: tab === t ? "#c084fc" : "#475569", fontWeight: 600, cursor: "pointer", fontSize: 14, textTransform: "capitalize" }}>
              {t === "posts" ? `📝 Posts (${posts.length})` : `📌 Wall (${wall.length})`}
            </button>
          ))}
        </div>

        {/* Posts tab */}
        {tab === "posts" && (
          posts.length === 0
            ? <div style={{ textAlign: "center", padding: "40px 24px", color: "#475569" }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>📝</div>
              <div style={{ fontSize: 15 }}>No posts yet from {profile.display_name?.split(" ")[0] || "this user"}.</div>
            </div>
            : posts.map(p => (
              <div key={p.id} style={{ background: "#13132b", border: "1px solid #1e1e3a", borderRadius: 16, padding: "14px 16px", marginBottom: 12 }}>
                {p.title && <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{p.title}</div>}
                {p.content && <div style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.6, marginBottom: p.image_url ? 10 : 0 }}>{p.content}</div>}
                {p.image_url && <img src={p.image_url} alt="" style={{ width: "100%", borderRadius: 10, maxHeight: 300, objectFit: "cover" }} onError={e => e.target.style.display = "none"} />}
                <div style={{ marginTop: 10, color: "#475569", fontSize: 13, display: "flex", gap: 14 }}>
                  <span>💜 {p.likes_count || 0}</span>
                  <span>💬 {p.comments_count || 0}</span>
                  <span style={{ marginLeft: "auto" }}>{p.created_date ? new Date(p.created_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}</span>
                </div>
              </div>
            ))
        )}

        {/* Wall tab */}
        {tab === "wall" && (
          <div>
            {/* Wall composer */}
            {loggedIn && (
              <div style={{ background: "#13132b", border: "1px solid #1e1e3a", borderRadius: 16, padding: 14, marginBottom: 14 }}>
                <div style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>📌 Leave a message on {profile.display_name?.split(" ")[0]}'s wall</div>
                <textarea value={wallDraft} onChange={e => setWallDraft(e.target.value)}
                  placeholder={`Say something to ${profile.display_name?.split(" ")[0] || "them"}...`}
                  style={{ width: "100%", background: "#0d0d1a", border: "1px solid #1e1e3a", borderRadius: 10, color: "#f0f0f0", fontSize: 14, padding: "10px 12px", boxSizing: "border-box", minHeight: 72, resize: "none", fontFamily: "inherit", outline: "none" }} />
                <button onClick={postOnWall} disabled={posting || !wallDraft.trim()}
                  style={{ marginTop: 8, padding: "8px 20px", background: wallDraft.trim() ? "linear-gradient(135deg,#c084fc,#22d3ee)" : "#2a2a45", border: "none", borderRadius: 20, color: wallDraft.trim() ? "#000" : "#64748b", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                  {posting ? "Posting..." : "Post to Wall"}
                </button>
              </div>
            )}

            {wall.length === 0
              ? <div style={{ textAlign: "center", padding: "40px 24px", color: "#475569" }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>📌</div>
                <div>No wall posts yet. Be the first to leave a message!</div>
              </div>
              : wall.map(w => (
                <div key={w.id} style={{ background: "#13132b", border: "1px solid #1e1e3a", borderRadius: 16, padding: 14, marginBottom: 10 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#c084fc", marginBottom: 5 }}>{w.author_name}</div>
                  <div style={{ color: "#cbd5e1", fontSize: 14, lineHeight: 1.5 }}>{w.content}</div>
                  <div style={{ color: "#475569", fontSize: 11, marginTop: 6 }}>{w.created_date ? new Date(w.created_date).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : ""}</div>
                </div>
              ))
            }
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#0b0b1ef5", backdropFilter: "blur(16px)", borderTop: "1px solid #1e1e3a", display: "flex", justifyContent: "space-around", padding: "10px 0 12px", zIndex: 100 }}>
        {NAV.map(item => {
          const active = window.location.pathname === item.path;
          return (
            <button key={item.path} onClick={() => navigate(item.path)}
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "4px 12px" }}>
              <span style={{ fontSize: 22, opacity: active ? 1 : 0.5 }}>{item.icon}</span>
              <span style={{ fontSize: 10, color: active ? "#c084fc" : "#475569", fontWeight: active ? 700 : 400 }}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
