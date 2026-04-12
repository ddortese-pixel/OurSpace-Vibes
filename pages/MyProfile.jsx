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

const GRADIENTS = {
  "purple-pink": "linear-gradient(135deg,#c084fc,#ec4899)",
  "orange-red": "linear-gradient(135deg,#f97316,#ef4444)",
  "green-teal": "linear-gradient(135deg,#22c55e,#14b8a6)",
  "blue-cyan": "linear-gradient(135deg,#3b82f6,#22d3ee)",
  "teal-blue": "linear-gradient(135deg,#14b8a6,#3b82f6)",
  "default": "linear-gradient(135deg,#c084fc,#22d3ee)",
};

function Avatar({ name, url, size = 44 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: "linear-gradient(135deg,#c084fc,#22d3ee)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", fontSize: size * 0.38, flexShrink: 0, overflow: "hidden" }}>
      {url ? <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} /> : (name?.[0]?.toUpperCase() || "?")}
    </div>
  );
}

export default function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [wall, setWall] = useState([]);
  const [friends, setFriends] = useState([]);
  const [tab, setTab] = useState("posts");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
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
      setForm(me || { user_email: myEmail, display_name: getMyName() });
      setPosts(myPosts || []);
      setWall(myWall || []);
      const myFriends = (allFriends || []).filter(f => f.status === "accepted" && (f.requester_email === myEmail || f.receiver_email === myEmail));
      setFriends(myFriends);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const data = { ...form, user_email: myEmail };
      if (profile?.id) {
        const updated = await Profile.update(profile.id, data);
        setProfile(updated);
      } else {
        const created = await Profile.create(data);
        setProfile(created);
      }
      if (form.display_name) localStorage.setItem("os2_name", form.display_name);
      setEditing(false);
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const logout = () => {
    localStorage.removeItem("os2_email");
    localStorage.removeItem("os2_name");
    localStorage.removeItem("os2_vibe");
    navigate("/Onboarding");
  };

  const bg = GRADIENTS[profile?.background_gradient] || GRADIENTS.default;

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0d0d1a", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", fontFamily: "'Segoe UI', sans-serif", fontSize: 18 }}>Loading...</div>
  );

  if (!loggedIn) return (
    <div style={{ minHeight: "100vh", background: "#0d0d1a", color: "#f0f0f0", fontFamily: "'Segoe UI', sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: 32, textAlign: "center" }}>
      <div style={{ fontSize: 72 }}>👤</div>
      <div style={{ fontWeight: 900, fontSize: 26 }}>Your Space is Waiting</div>
      <div style={{ color: "#64748b", fontSize: 15, maxWidth: 300, lineHeight: 1.6 }}>Join OurSpace 2.0 to create your customizable profile, post, and connect with people.</div>
      <button onClick={() => navigate("/Onboarding")} style={{ padding: "14px 40px", background: "linear-gradient(135deg,#c084fc,#22d3ee)", border: "none", borderRadius: 14, color: "#000", fontWeight: 800, fontSize: 17, cursor: "pointer" }}>Get Started Free</button>
      <button onClick={() => navigate("/Home")} style={{ background: "none", border: "1px solid #2a2a45", borderRadius: 14, color: "#64748b", padding: "10px 24px", cursor: "pointer", fontSize: 14 }}>← Back to Feed</button>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d1a", color: "#f0f0f0", fontFamily: "'Segoe UI', system-ui, sans-serif", paddingBottom: 90 }}>

      {/* Cover Photo */}
      <div style={{ height: 180, background: bg, position: "relative" }}>
        {profile?.cover_photo && <img src={profile.cover_photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, #0d0d1a)" }} />
        <button onClick={() => navigate("/Home")} style={{ position: "absolute", top: 14, left: 14, background: "#00000066", border: "none", borderRadius: 20, color: "#fff", padding: "6px 14px", cursor: "pointer", fontSize: 13, backdropFilter: "blur(8px)" }}>← Back</button>
        {!editing && (
          <button onClick={() => setEditing(true)} style={{ position: "absolute", top: 14, right: 14, background: "#00000066", border: "1px solid #ffffff30", borderRadius: 20, color: "#fff", padding: "6px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600, backdropFilter: "blur(8px)" }}>✏️ Edit Profile</button>
        )}
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 16px" }}>

        {/* Avatar + Name row */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginTop: -44, marginBottom: 20, justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-end" }}>
            <div style={{ width: 90, height: 90, borderRadius: "50%", background: "linear-gradient(135deg,#c084fc,#22d3ee)", border: "4px solid #0d0d1a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, fontWeight: 700, flexShrink: 0, overflow: "hidden", boxShadow: "0 4px 20px #c084fc40" }}>
              {profile?.avatar_url ? <img src={profile.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} /> : (profile?.display_name?.[0] || getMyName()?.[0] || "👤")}
            </div>
            <div style={{ paddingBottom: 4 }}>
              <div style={{ fontWeight: 900, fontSize: 22 }}>{profile?.display_name || getMyName()}</div>
              <div style={{ color: "#64748b", fontSize: 13 }}>{profile?.headline || myEmail}</div>
            </div>
          </div>
          <button onClick={logout} style={{ paddingBottom: 4, background: "none", border: "1px solid #2a2a45", borderRadius: 20, color: "#64748b", padding: "6px 14px", fontSize: 12, cursor: "pointer" }}>Log out</button>
        </div>

        {/* Status chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
          {profile?.is_online && <span style={{ background: "#0f2a1e", border: "1px solid #4ade8040", color: "#4ade80", fontSize: 12, padding: "4px 12px", borderRadius: 20 }}>● Online</span>}
          {profile?.mood && <span style={{ background: "#1e1a2e", border: "1px solid #c084fc30", color: "#c084fc", fontSize: 12, padding: "4px 12px", borderRadius: 20 }}>😶 {profile.mood}</span>}
          {profile?.song_playing && <span style={{ background: "#0d1a2a", border: "1px solid #22d3ee30", color: "#22d3ee", fontSize: 12, padding: "4px 12px", borderRadius: 20 }}>🎵 {profile.song_playing}</span>}
        </div>

        {/* Bio */}
        {profile?.about_me && <div style={{ color: "#94a3b8", fontSize: 15, lineHeight: 1.65, marginBottom: 14 }}>{profile.about_me}</div>}

        {/* Interests */}
        {Array.isArray(profile?.interests) && profile.interests.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
            {profile.interests.map((interest, i) => (
              <span key={i} style={{ background: "#1e1a2e", border: "1px solid #c084fc20", color: "#c084fc", fontSize: 12, padding: "4px 12px", borderRadius: 20 }}>{interest}</span>
            ))}
          </div>
        )}

        {/* Stats row */}
        <div style={{ display: "flex", gap: 24, marginBottom: 20, padding: "14px 0", borderTop: "1px solid #1e1e3a", borderBottom: "1px solid #1e1e3a" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontWeight: 900, fontSize: 20, color: "#f0f0f0" }}>{posts.length}</div>
            <div style={{ color: "#64748b", fontSize: 12 }}>Posts</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontWeight: 900, fontSize: 20, color: "#f0f0f0" }}>{friends.length}</div>
            <div style={{ color: "#64748b", fontSize: 12 }}>Friends</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontWeight: 900, fontSize: 20, color: "#f0f0f0" }}>{profile?.profile_views || 0}</div>
            <div style={{ color: "#64748b", fontSize: 12 }}>Views</div>
          </div>
        </div>

        {/* No profile prompt */}
        {!profile && !editing && (
          <div style={{ background: "#13132b", border: "1px dashed #2a2a45", borderRadius: 20, padding: 24, marginBottom: 20, textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🌐</div>
            <div style={{ color: "#94a3b8", fontSize: 15, marginBottom: 14 }}>Complete your profile to show up in Discover and connect with people.</div>
            <button onClick={() => setEditing(true)} style={{ padding: "10px 28px", background: "linear-gradient(135deg,#c084fc,#22d3ee)", border: "none", borderRadius: 12, color: "#000", fontWeight: 700, cursor: "pointer" }}>Set Up My Profile</button>
          </div>
        )}

        {/* Edit Form */}
        {editing && (
          <div style={{ background: "#13132b", border: "1px solid #1e1e3a", borderRadius: 20, padding: 20, marginBottom: 20 }}>
            <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 18, background: "linear-gradient(90deg,#c084fc,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Edit Your Profile</div>

            {[
              ["display_name", "Display Name", "text"],
              ["headline", "Headline / Tagline", "text"],
              ["about_me", "About Me", "textarea"],
              ["mood", "Current Mood", "text"],
              ["song_playing", "Song Playing 🎵", "text"],
              ["avatar_url", "Avatar Image URL", "text"],
              ["cover_photo", "Cover Photo URL", "text"],
            ].map(([field, label, type]) => (
              <div key={field} style={{ marginBottom: 14 }}>
                <label style={{ color: "#64748b", fontSize: 13, display: "block", marginBottom: 5 }}>{label}</label>
                {type === "textarea"
                  ? <textarea value={form[field] || ""} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                    style={{ width: "100%", background: "#0d0d1a", border: "1px solid #1e1e3a", borderRadius: 12, color: "#f0f0f0", fontSize: 14, padding: "10px 14px", boxSizing: "border-box", minHeight: 90, resize: "vertical", fontFamily: "inherit", outline: "none" }} />
                  : <input type="text" value={form[field] || ""} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                    style={{ width: "100%", background: "#0d0d1a", border: "1px solid #1e1e3a", borderRadius: 12, color: "#f0f0f0", fontSize: 14, padding: "10px 14px", boxSizing: "border-box", outline: "none" }} />
                }
              </div>
            ))}

            {/* Theme picker */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ color: "#64748b", fontSize: 13, display: "block", marginBottom: 8 }}>Profile Theme</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {Object.entries({ "purple-pink": "💜 Purple", "orange-red": "🔥 Sunset", "green-teal": "💚 Forest", "blue-cyan": "💙 Ocean", "teal-blue": "🌊 Teal" }).map(([val, label]) => (
                  <button key={val} onClick={() => setForm(f => ({ ...f, background_gradient: val }))}
                    style={{ padding: "6px 14px", background: form.background_gradient === val ? "#2a1a3e" : "#0d0d1a", border: `1px solid ${form.background_gradient === val ? "#c084fc" : "#1e1e3a"}`, borderRadius: 20, color: form.background_gradient === val ? "#c084fc" : "#64748b", fontSize: 13, cursor: "pointer", fontWeight: form.background_gradient === val ? 700 : 400 }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={saveProfile} disabled={saving}
                style={{ flex: 1, padding: "12px", background: "linear-gradient(135deg,#c084fc,#22d3ee)", border: "none", borderRadius: 12, color: "#000", fontWeight: 800, fontSize: 15, cursor: "pointer" }}>
                {saving ? "Saving..." : "Save Profile"}
              </button>
              <button onClick={() => setEditing(false)}
                style={{ flex: 1, padding: "12px", background: "#1e1e3a", border: "none", borderRadius: 12, color: "#94a3b8", fontWeight: 600, fontSize: 15, cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: 2, borderBottom: "1px solid #1e1e3a", marginBottom: 16 }}>
          {["posts", "wall", "friends"].map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: "10px 20px", background: "transparent", border: "none", borderBottom: `2px solid ${tab === t ? "#c084fc" : "transparent"}`, color: tab === t ? "#c084fc" : "#475569", fontWeight: 600, cursor: "pointer", fontSize: 14, textTransform: "capitalize" }}>
              {t === "posts" ? `📝 Posts (${posts.length})` : t === "wall" ? "📌 Wall" : `👥 Friends (${friends.length})`}
            </button>
          ))}
        </div>

        {/* Posts */}
        {tab === "posts" && (
          posts.length === 0
            ? <div style={{ textAlign: "center", padding: 40, color: "#475569" }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>📝</div>
              <div>No posts yet. Share something with the world!</div>
            </div>
            : posts.map(p => (
              <div key={p.id} style={{ background: "#13132b", border: "1px solid #1e1e3a", borderRadius: 16, padding: 16, marginBottom: 12 }}>
                {p.content && <div style={{ fontSize: 15, color: "#cbd5e1", lineHeight: 1.6 }}>{p.content}</div>}
                {p.image_url && <img src={p.image_url} alt="" style={{ width: "100%", borderRadius: 10, marginTop: 10, maxHeight: 300, objectFit: "cover" }} onError={e => e.target.style.display = "none"} />}
                <div style={{ marginTop: 10, color: "#475569", fontSize: 12, display: "flex", gap: 12 }}>
                  <span>💜 {p.likes_count || 0}</span>
                  <span>💬 {p.comments_count || 0}</span>
                  <span style={{ marginLeft: "auto" }}>{p.created_date ? new Date(p.created_date).toLocaleDateString() : ""}</span>
                </div>
              </div>
            ))
        )}

        {/* Wall */}
        {tab === "wall" && (
          <div>
            {wall.length === 0
              ? <div style={{ textAlign: "center", padding: 40, color: "#475569" }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>📌</div>
                <div>No wall posts yet. Share your profile to get messages!</div>
              </div>
              : wall.map(w => (
                <div key={w.id} style={{ background: "#13132b", border: "1px solid #1e1e3a", borderRadius: 16, padding: 16, marginBottom: 12 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#c084fc", marginBottom: 6 }}>{w.author_name}</div>
                  <div style={{ color: "#cbd5e1", fontSize: 14, lineHeight: 1.5 }}>{w.content}</div>
                  <div style={{ color: "#475569", fontSize: 11, marginTop: 8 }}>{w.created_date ? new Date(w.created_date).toLocaleDateString() : ""}</div>
                </div>
              ))
            }
          </div>
        )}

        {/* Friends */}
        {tab === "friends" && (
          friends.length === 0
            ? <div style={{ textAlign: "center", padding: 40, color: "#475569" }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>👥</div>
              <div>No friends yet. Browse Discover to connect!</div>
              <button onClick={() => navigate("/Discover")} style={{ marginTop: 14, padding: "10px 24px", background: "linear-gradient(135deg,#c084fc,#22d3ee)", border: "none", borderRadius: 20, color: "#000", fontWeight: 700, cursor: "pointer" }}>Browse People</button>
            </div>
            : <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {friends.map(f => {
                const other = f.requester_email === myEmail ? f.receiver_name : f.requester_name;
                const otherEmail = f.requester_email === myEmail ? f.receiver_email : f.requester_email;
                return (
                  <div key={f.id} onClick={() => navigate(`/Profile?email=${otherEmail}`)}
                    style={{ background: "#13132b", border: "1px solid #1e1e3a", borderRadius: 16, padding: 14, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, textAlign: "center" }}>
                    <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,#c084fc,#22d3ee)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: "#fff" }}>
                      {other?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{other}</div>
                  </div>
                );
              })}
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
