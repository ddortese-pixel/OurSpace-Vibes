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
function getMyName() { return localStorage.getItem("os2_name") || "Guest"; }
function isLoggedIn() { return !!localStorage.getItem("os2_email"); }

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

const MOOD_OPTIONS = ["😊 Happy","😎 Chill","🔥 Hyped","💭 Thoughtful","😴 Tired","✨ Glowing","💜 Loved","🎵 Vibing","😂 Laughing","🌙 Night Mode"];
const INTEREST_OPTIONS = ["🎨 Art","🎵 Music","🎮 Gaming","📚 Books","💻 Tech","🌿 Nature","✍️ Writing","🎭 Comedy","🧘 Wellness","🛹 Sports","🎬 Film","🍕 Food","✈️ Travel","🌸 Fashion","🏋️ Fitness","🎤 Rap","🎸 Rock","📸 Photography"];

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

export default function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [wall, setWall] = useState([]);
  const [friends, setFriends] = useState([]);
  const [tab, setTab] = useState("wall");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [wallDraft, setWallDraft] = useState("");
  const [postingWall, setPostingWall] = useState(false);
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  const myEmail = getMyEmail();

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
      setForm(me || { user_email: myEmail, display_name: getMyName(), theme_color: "purple-pink" });
      setPosts((myPosts || []).sort((a,b) => new Date(b.created_date) - new Date(a.created_date)));
      setWall((myWall || []).sort((a,b) => new Date(b.created_date) - new Date(a.created_date)));
      const myFriends = (allFriends || []).filter(f => f.status === "accepted" && (f.requester_email === myEmail || f.receiver_email === myEmail));
      setFriends(myFriends);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const data = { ...form, user_email: myEmail };
      if (profile?.id) { await Profile.update(profile.id, data); setProfile({ ...profile, ...data }); }
      else { const c = await Profile.create(data); setProfile(c); }
      if (form.display_name) localStorage.setItem("os2_name", form.display_name);
      setEditing(false);
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const postOnWall = async () => {
    if (!wallDraft.trim()) return;
    setPostingWall(true);
    try {
      const w = await WallPost.create({ profile_email: myEmail, author_email: myEmail, author_name: getMyName(), content: wallDraft.trim() });
      setWall(prev => [w, ...prev]);
      setWallDraft("");
    } catch (e) { console.error(e); }
    setPostingWall(false);
  };

  const logout = () => { localStorage.clear(); navigate("/OurSpaceOnboarding"); };

  const theme = THEMES[profile?.theme_color || form?.theme_color || "purple-pink"];
  const top8 = friends.slice(0, 8);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0d0d1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#c084fc", fontSize: 16 }}>Loading your space...</div>
    </div>
  );

  if (!loggedIn) return (
    <div style={{ minHeight: "100vh", background: "#0d0d1a", color: "#f0f0f0", fontFamily: "'Segoe UI', sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: 32, textAlign: "center" }}>
      <div style={{ fontSize: 72 }}>🌐</div>
      <div style={{ fontWeight: 900, fontSize: 28 }}>Your Space is Waiting</div>
      <div style={{ color: "#64748b", fontSize: 15, maxWidth: 300, lineHeight: 1.7 }}>Join OurSpace Vibes to build your digital home, connect with friends, and express yourself.</div>
      <button onClick={() => navigate("/OurSpaceOnboarding")} style={{ padding: "14px 40px", background: "linear-gradient(135deg,#c084fc,#22d3ee)", border: "none", borderRadius: 14, color: "#000", fontWeight: 900, fontSize: 17, cursor: "pointer" }}>Claim Your Space →</button>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, color: "#f0f0f0", fontFamily: "'Segoe UI', system-ui, sans-serif", paddingBottom: 90 }}>

      {/* ===== GLITTER CSS ===== */}
      <style>{`
        @keyframes sparkle { 0%,100%{opacity:0;transform:scale(0)} 50%{opacity:1;transform:scale(1)} }
        @keyframes marquee { 0%{transform:translateX(100%)} 100%{transform:translateX(-100%)} }
        @keyframes pulse-glow { 0%,100%{box-shadow:0 0 10px ${theme.glitter}60} 50%{box-shadow:0 0 30px ${theme.glitter}aa, 0 0 60px ${theme.glitter}40} }
        .glitter-border { animation: pulse-glow 2.5s ease-in-out infinite; }
        .sparkle-dot { position:absolute; border-radius:50%; animation: sparkle 1.5s ease-in-out infinite; }
      `}</style>

      {/* ===== COVER BANNER ===== */}
      <div style={{ position: "relative", height: 140, background: theme.grad, overflow: "hidden" }}>
        {profile?.cover_photo && <img src={profile.cover_photo} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />}
        {/* Sparkle dots overlay */}
        {[...Array(14)].map((_, i) => (
          <div key={i} className="sparkle-dot" style={{
            width: Math.random() > 0.5 ? 4 : 6, height: Math.random() > 0.5 ? 4 : 6,
            background: "#ffffff",
            top: `${10 + (i * 37) % 80}%`, left: `${(i * 71) % 100}%`,
            animationDelay: `${(i * 0.23).toFixed(2)}s`,
            animationDuration: `${1.2 + (i * 0.15) % 1.2}s`,
          }} />
        ))}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.7))" }} />
        <button onClick={() => navigate("/Home")} style={{ position: "absolute", top: 14, left: 14, background: "#00000066", border: "none", borderRadius: 20, color: "#fff", padding: "6px 14px", cursor: "pointer", fontSize: 13, backdropFilter: "blur(8px)" }}>← Home</button>
        {!editing && (
          <button onClick={() => setEditing(true)} style={{ position: "absolute", top: 14, right: 14, background: "#00000066", border: `1px solid ${theme.accent}80`, borderRadius: 20, color: theme.accent, padding: "6px 16px", cursor: "pointer", fontSize: 13, fontWeight: 700, backdropFilter: "blur(8px)" }}>✏️ Customize</button>
        )}
        {/* Marquee text if set */}
        {profile?.headline && (
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "#00000080", padding: "4px 0", overflow: "hidden", height: 24 }}>
            <div style={{ animation: "marquee 18s linear infinite", whiteSpace: "nowrap", color: theme.accent, fontSize: 12, fontWeight: 700 }}>
              ✨&nbsp;&nbsp;{profile.headline}&nbsp;&nbsp;✨&nbsp;&nbsp;{profile.headline}&nbsp;&nbsp;✨
            </div>
          </div>
        )}
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 12px" }}>

        {/* ===== AVATAR + NAME ROW ===== */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginTop: -50, marginBottom: 16, position: "relative", zIndex: 10 }}>
          <div className="glitter-border" style={{ width: 100, height: 100, borderRadius: 16, border: `3px solid ${theme.accent}`, background: theme.grad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, fontWeight: 700, flexShrink: 0, overflow: "hidden" }}>
            {profile?.avatar_url
              ? <img src={profile.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} />
              : (profile?.avatar_emoji || profile?.display_name?.[0] || "👤")}
          </div>
          <div style={{ flex: 1, paddingBottom: 8 }}>
            <h1 style={{ margin: "0 0 4px", fontSize: 26, fontWeight: 900, color: "#fff", textShadow: `0 0 20px ${theme.accent}80` }}>
              {profile?.display_name || getMyName()}
            </h1>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
              {profile?.is_online && <span style={{ background: "#0f2a1e", border: "1px solid #4ade8040", color: "#4ade80", fontSize: 11, padding: "2px 10px", borderRadius: 20 }}>● Online</span>}
              {profile?.mood && <span style={{ background: `${theme.accent}20`, border: `1px solid ${theme.border}`, color: theme.accent, fontSize: 12, padding: "2px 10px", borderRadius: 20 }}>{profile.mood}</span>}
              {profile?.song_playing && <span style={{ background: "#0d1a2a", border: "1px solid #22d3ee30", color: "#22d3ee", fontSize: 12, padding: "2px 10px", borderRadius: 20 }}>🎵 {profile.song_playing}</span>}
            </div>
          </div>
          <button onClick={logout} style={{ paddingBottom: 8, background: "none", border: "1px solid #2a2a45", borderRadius: 20, color: "#64748b", padding: "6px 14px", fontSize: 12, cursor: "pointer", marginBottom: 8 }}>Sign Out</button>
        </div>

        {/* ===== EDIT FORM ===== */}
        {editing && (
          <div style={{ background: "#13132b", borderRadius: 20, padding: 20, marginBottom: 20, border: `1px solid ${theme.border}` }}>
            <div style={{ fontWeight: 900, fontSize: 16, color: theme.accent, marginBottom: 16 }}>✏️ Customize Your Space</div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              {[["Display Name","display_name","text","Your name or username"],["Headline / Status","headline","text","Shown in your banner marquee"],["Avatar URL","avatar_url","url","Paste an image URL"],["Cover Photo URL","cover_photo","url","Banner background image"],["Song Playing 🎵","song_playing","text","What are you listening to?"],["About Me","about_me","textarea","Tell the world who you are"]].map(([label, key, type, ph]) => (
                <div key={key} style={{ gridColumn: key === "about_me" ? "1 / -1" : undefined }}>
                  <label style={{ color: "#94a3b8", fontSize: 12, display: "block", marginBottom: 5 }}>{label}</label>
                  {type === "textarea"
                    ? <textarea value={form[key] || ""} onChange={e => setForm(p => ({...p, [key]: e.target.value}))} placeholder={ph} rows={3}
                        style={{ width: "100%", background: "#0d0d1a", border: `1px solid ${theme.border}`, borderRadius: 10, color: "#f0f0f0", fontSize: 14, padding: "10px 12px", outline: "none", resize: "vertical", boxSizing: "border-box" }} />
                    : <input type="text" value={form[key] || ""} onChange={e => setForm(p => ({...p, [key]: e.target.value}))} placeholder={ph}
                        style={{ width: "100%", background: "#0d0d1a", border: `1px solid ${theme.border}`, borderRadius: 10, color: "#f0f0f0", fontSize: 14, padding: "10px 12px", outline: "none", boxSizing: "border-box" }} />
                  }
                </div>
              ))}
            </div>

            {/* Avatar emoji picker */}
            <label style={{ color: "#94a3b8", fontSize: 12, display: "block", marginBottom: 8 }}>Avatar Emoji (if no image URL)</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
              {["😎","🔥","👑","✨","💀","🐉","🌙","💜","🦋","⚡","🎸","🎮","🌸","🦊","🐺","🌊"].map(em => (
                <button key={em} onClick={() => setForm(p => ({...p, avatar_emoji: em}))}
                  style={{ fontSize: 22, background: form.avatar_emoji === em ? `${theme.accent}30` : "transparent", border: `2px solid ${form.avatar_emoji === em ? theme.accent : "transparent"}`, borderRadius: 10, padding: 4, cursor: "pointer" }}>{em}</button>
              ))}
            </div>

            {/* Theme selector */}
            <label style={{ color: "#94a3b8", fontSize: 12, display: "block", marginBottom: 10 }}>Profile Theme</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
              {Object.entries(THEMES).map(([id, t]) => (
                <button key={id} onClick={() => setForm(p => ({...p, theme_color: id}))}
                  style={{ width: 44, height: 44, borderRadius: 12, background: t.grad, border: `3px solid ${form.theme_color === id ? "#fff" : "transparent"}`, cursor: "pointer", boxShadow: form.theme_color === id ? `0 0 16px ${t.glitter}80` : "none", transition: "all 0.2s" }} />
              ))}
            </div>

            {/* Mood selector */}
            <label style={{ color: "#94a3b8", fontSize: 12, display: "block", marginBottom: 8 }}>Current Mood</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
              {MOOD_OPTIONS.map(m => (
                <button key={m} onClick={() => setForm(p => ({...p, mood: p.mood === m ? "" : m}))}
                  style={{ padding: "5px 12px", background: form.mood === m ? `${theme.accent}25` : "#0d0d1a", border: `1px solid ${form.mood === m ? theme.accent : "#2a2a45"}`, borderRadius: 20, color: form.mood === m ? theme.accent : "#64748b", fontSize: 12, cursor: "pointer" }}>
                  {m}
                </button>
              ))}
            </div>

            {/* Interests */}
            <label style={{ color: "#94a3b8", fontSize: 12, display: "block", marginBottom: 8 }}>Interests (pick up to 8)</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
              {INTEREST_OPTIONS.map(int => {
                const selected = Array.isArray(form.interests) && form.interests.includes(int);
                return (
                  <button key={int} onClick={() => setForm(p => {
                    const curr = Array.isArray(p.interests) ? p.interests : [];
                    return { ...p, interests: selected ? curr.filter(i => i !== int) : curr.length < 8 ? [...curr, int] : curr };
                  })}
                    style={{ padding: "5px 12px", background: selected ? `${theme.accent}25` : "#0d0d1a", border: `1px solid ${selected ? theme.accent : "#2a2a45"}`, borderRadius: 20, color: selected ? theme.accent : "#64748b", fontSize: 12, cursor: "pointer" }}>
                    {int}
                  </button>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={saveProfile} disabled={saving}
                style={{ flex: 1, padding: "13px", background: theme.grad, border: "none", borderRadius: 12, color: "#000", fontWeight: 900, fontSize: 15, cursor: "pointer", opacity: saving ? 0.7 : 1 }}>
                {saving ? "Saving..." : "💾 Save My Space"}
              </button>
              <button onClick={() => setEditing(false)} style={{ padding: "13px 20px", background: "transparent", border: "1px solid #2a2a45", borderRadius: 12, color: "#94a3b8", cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        )}

        {/* ===== 2-COLUMN MYSPACE LAYOUT ===== */}
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 16, alignItems: "start" }}>

          {/* ===== LEFT SIDEBAR ===== */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* About Me */}
            <div style={{ background: "#13132b", borderRadius: 16, border: `1px solid ${theme.border}`, overflow: "hidden" }}>
              <div style={{ background: theme.grad, padding: "8px 14px", fontWeight: 700, fontSize: 13, color: "#000" }}>👤 About {profile?.display_name?.split(" ")[0] || "Me"}</div>
              <div style={{ padding: "12px 14px" }}>
                {profile?.about_me
                  ? <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{profile.about_me}</p>
                  : <p style={{ color: "#475569", fontSize: 13, margin: 0, fontStyle: "italic" }}>No bio yet... click Customize to add one ✨</p>}
              </div>
            </div>

            {/* Details box */}
            <div style={{ background: "#13132b", borderRadius: 16, border: `1px solid ${theme.border}`, overflow: "hidden" }}>
              <div style={{ background: theme.grad, padding: "8px 14px", fontWeight: 700, fontSize: 13, color: "#000" }}>ℹ️ Details</div>
              <div style={{ padding: "10px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "#475569" }}>Status</span>
                  <span style={{ color: theme.accent }}>{profile?.mood || "🌀 Vibing"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "#475569" }}>Posts</span>
                  <span style={{ fontWeight: 700 }}>{posts.length}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "#475569" }}>Friends</span>
                  <span style={{ fontWeight: 700 }}>{friends.length}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "#475569" }}>Profile Views</span>
                  <span style={{ fontWeight: 700 }}>{profile?.profile_views || 0} 👁</span>
                </div>
                {profile?.song_playing && (
                  <div style={{ marginTop: 4, padding: "10px 12px", background: `${theme.accent}15`, borderRadius: 10, border: `1px solid ${theme.border}` }}>
                    <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>NOW PLAYING</div>
                    <div style={{ color: theme.accent, fontSize: 13, fontWeight: 700 }}>🎵 {profile.song_playing}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Interests */}
            {Array.isArray(profile?.interests) && profile.interests.length > 0 && (
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
              <div style={{ background: theme.grad, padding: "8px 14px", fontWeight: 700, fontSize: 13, color: "#000" }}>👥 Top {Math.min(top8.length, 8) || "8"} Friends</div>
              <div style={{ padding: "10px 12px" }}>
                {top8.length === 0 ? (
                  <div style={{ color: "#475569", fontSize: 13, textAlign: "center", padding: "12px 0", fontStyle: "italic" }}>No friends yet — go to Discover! 🌐</div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                    {top8.map((f, i) => {
                      const friendEmail = f.requester_email === myEmail ? f.receiver_email : f.requester_email;
                      const friendName = f.requester_email === myEmail ? f.receiver_name : f.requester_name;
                      const friendAvatar = f.requester_email === myEmail ? f.receiver_avatar : f.requester_avatar;
                      return (
                        <div key={i} onClick={() => navigate(`/Profile?email=${friendEmail}`)} style={{ cursor: "pointer", textAlign: "center" }}>
                          <div style={{ width: 48, height: 48, borderRadius: 10, background: theme.grad, margin: "0 auto 4px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18, overflow: "hidden", border: `2px solid ${theme.border}` }}>
                            {friendAvatar ? <img src={friendAvatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} /> : (friendName?.[0] || "?")}
                          </div>
                          <div style={{ fontSize: 10, color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{friendName?.split(" ")[0] || "Friend"}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* ===== RIGHT MAIN CONTENT ===== */}
          <div>
            {/* Tabs */}
            <div style={{ display: "flex", borderBottom: `2px solid ${theme.border}`, marginBottom: 14 }}>
              {[["wall","📌 Guestbook Wall"],["posts","📝 Posts"],["photos","📸 Photos"]].map(([id, label]) => (
                <button key={id} onClick={() => setTab(id)}
                  style={{ padding: "10px 20px", background: "transparent", border: "none", borderBottom: `3px solid ${tab === id ? theme.accent : "transparent"}`, color: tab === id ? theme.accent : "#475569", fontWeight: tab === id ? 700 : 400, cursor: "pointer", fontSize: 14 }}>
                  {label}
                </button>
              ))}
            </div>

            {/* WALL TAB */}
            {tab === "wall" && (
              <div>
                {/* Post on your own wall */}
                <div style={{ background: "#13132b", borderRadius: 16, padding: 16, marginBottom: 14, border: `1px solid ${theme.border}` }}>
                  <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 8 }}>Leave yourself a note ✍️</div>
                  <textarea value={wallDraft} onChange={e => setWallDraft(e.target.value)} placeholder="What's on your mind?"
                    rows={3} style={{ width: "100%", background: "#0d0d1a", border: `1px solid ${theme.border}`, borderRadius: 10, color: "#f0f0f0", fontSize: 14, padding: "10px 12px", outline: "none", resize: "none", boxSizing: "border-box", marginBottom: 10 }} />
                  <button onClick={postOnWall} disabled={!wallDraft.trim() || postingWall}
                    style={{ padding: "9px 20px", background: wallDraft.trim() ? theme.grad : "#1e1e3a", border: "none", borderRadius: 20, color: wallDraft.trim() ? "#000" : "#475569", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                    {postingWall ? "Posting..." : "📌 Post to Wall"}
                  </button>
                </div>
                {wall.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 20px", color: "#475569" }}>
                    <div style={{ fontSize: 40, marginBottom: 10 }}>📌</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#64748b" }}>Your wall is empty</div>
                    <div style={{ fontSize: 13, marginTop: 6 }}>Share your profile link and let friends leave messages!</div>
                  </div>
                ) : wall.map(w => (
                  <div key={w.id} style={{ background: "#13132b", borderRadius: 16, padding: 16, marginBottom: 10, border: `1px solid ${theme.border}` }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <div style={{ width: 38, height: 38, borderRadius: "50%", background: theme.grad, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 15, flexShrink: 0 }}>
                        {w.author_name?.[0] || "?"}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: theme.accent }}>{w.author_name}</div>
                        <div style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.6, marginTop: 4 }}>{w.content}</div>
                        <div style={{ color: "#475569", fontSize: 11, marginTop: 6 }}>{w.created_date ? new Date(w.created_date).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : ""}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* POSTS TAB */}
            {tab === "posts" && (
              posts.length === 0
                ? <div style={{ textAlign: "center", padding: "40px 20px", color: "#475569" }}>
                    <div style={{ fontSize: 40, marginBottom: 10 }}>📝</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#64748b" }}>No posts yet</div>
                    <button onClick={() => navigate("/Home")} style={{ marginTop: 12, padding: "9px 20px", background: theme.grad, border: "none", borderRadius: 20, color: "#000", fontWeight: 700, cursor: "pointer" }}>Go Post Something →</button>
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

            {/* PHOTOS TAB */}
            {tab === "photos" && (
              <div>
                {posts.filter(p => p.image_url).length === 0
                  ? <div style={{ textAlign: "center", padding: "40px 20px", color: "#475569" }}>
                      <div style={{ fontSize: 40, marginBottom: 10 }}>📸</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#64748b" }}>No photos yet</div>
                      <div style={{ fontSize: 13, marginTop: 4 }}>Post something with an image to fill your photo grid!</div>
                    </div>
                  : <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
                      {posts.filter(p => p.image_url).map(p => (
                        <div key={p.id} style={{ aspectRatio: "1", borderRadius: 10, overflow: "hidden", border: `1px solid ${theme.border}` }}>
                          <img src={p.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.parentElement.style.display = "none"} />
                        </div>
                      ))}
                    </div>
                }
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNav navigate={navigate} />
    </div>
  );
}
