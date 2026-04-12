import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function injectGA(measurementId) {
  if (document.getElementById(`ga-${measurementId}`)) return;
  const s1 = document.createElement("script"); s1.id = `ga-${measurementId}`; s1.async = true;
  s1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`; document.head.appendChild(s1);
  const s2 = document.createElement("script");
  s2.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","${measurementId}");`;
  document.head.appendChild(s2);
}

const DISCOVER_URL = "https://legacy-circle-ae3f9932.base44.app/functions/getPublicDiscover";

const NAV = [
  { icon: "🏠", label: "Home", path: "/Home" },
  { icon: "🔍", label: "Discover", path: "/Discover" },
  { icon: "✉️", label: "Messages", path: "/Messages" },
  { icon: "🔔", label: "Alerts", path: "/Notifications" },
  { icon: "👤", label: "Me", path: "/MyProfile" },
];

const INTEREST_TAGS = ["🎨 Art", "🎵 Music", "🎮 Gaming", "📚 Books", "🛹 Sports", "💻 Tech", "🌿 Nature", "✍️ Writing", "🎭 Comedy", "🧘 Wellness"];

export default function Discover() {
  const [query, setQuery] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [posts, setPosts] = useState([]);
  const [tab, setTab] = useState("people");
  const [loading, setLoading] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    injectGA("G-1N8GD2WM6L");
    loadAll("");
  }, []);

  const loadAll = async (q = "") => {
    setLoading(true);
    try {
      const res = await fetch(DISCOVER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();
      setProfiles(data.profiles || []);
      setPosts(data.posts || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => {
    const t = setTimeout(() => loadAll(query), 350);
    return () => clearTimeout(t);
  }, [query]);

  const handleTagClick = (tag) => {
    const clean = tag.replace(/^[\S]+ /, "").toLowerCase();
    if (selectedTag === tag) { setSelectedTag(null); setQuery(""); }
    else { setSelectedTag(tag); setQuery(clean); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d1a", color: "#f0f0f0", fontFamily: "'Segoe UI', system-ui, sans-serif", paddingBottom: 80 }}>

      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "#0b0b1eee", backdropFilter: "blur(16px)", borderBottom: "1px solid #1e1e3a", padding: "14px 16px" }}>
        <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 12, background: "linear-gradient(90deg,#c084fc,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>🔍 Discover</div>
        <input value={query} onChange={e => { setQuery(e.target.value); setSelectedTag(null); }}
          placeholder="Search people, posts, interests..."
          style={{ width: "100%", background: "#13132b", border: "1px solid #1e1e3a", borderRadius: 28, color: "#f0f0f0", fontSize: 15, padding: "11px 18px", boxSizing: "border-box", outline: "none" }} />
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "14px 16px" }}>

        {/* Interest tags */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12, marginBottom: 4 }}>
          {INTEREST_TAGS.map(tag => (
            <button key={tag} onClick={() => handleTagClick(tag)}
              style={{ padding: "6px 14px", background: selectedTag === tag ? "#2a1a3e" : "#13132b", border: `1px solid ${selectedTag === tag ? "#c084fc" : "#1e1e3a"}`, borderRadius: 20, color: selectedTag === tag ? "#c084fc" : "#64748b", fontSize: 13, cursor: "pointer", whiteSpace: "nowrap", fontWeight: selectedTag === tag ? 700 : 400, flexShrink: 0 }}>
              {tag}
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 2, borderBottom: "1px solid #1e1e3a", marginBottom: 16 }}>
          {["people", "posts"].map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: "10px 22px", background: "transparent", border: "none", borderBottom: `2px solid ${tab === t ? "#c084fc" : "transparent"}`, color: tab === t ? "#c084fc" : "#475569", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>
              {t === "people" ? `👥 People (${profiles.length})` : `📝 Posts (${posts.length})`}
            </button>
          ))}
        </div>

        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ background: "#13132b", borderRadius: 16, height: 80, border: "1px solid #1e1e3a", opacity: 0.4 }} />
            ))}
          </div>
        )}

        {/* People tab */}
        {!loading && tab === "people" && (
          profiles.length === 0
            ? <div style={{ textAlign: "center", padding: 48, color: "#475569" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🌌</div>
              <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>No one found</div>
              <div style={{ fontSize: 14 }}>Be the first to join and show up here! 🚀</div>
            </div>
            : profiles.map(p => (
              <div key={p.id} onClick={() => navigate(`/Profile?email=${p.user_email}`)}
                style={{ background: "#13132b", border: "1px solid #1e1e3a", borderRadius: 18, padding: 16, marginBottom: 12, cursor: "pointer", display: "flex", gap: 14, alignItems: "center", transition: "border-color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#c084fc40"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#1e1e3a"}>
                <div style={{ width: 58, height: 58, borderRadius: "50%", background: "linear-gradient(135deg,#c084fc,#22d3ee)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, flexShrink: 0, overflow: "hidden", position: "relative" }}>
                  {p.avatar_url ? <img src={p.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} /> : (p.display_name?.[0] || "?")}
                  {p.is_online && <div style={{ position: "absolute", bottom: 2, right: 2, width: 12, height: 12, borderRadius: "50%", background: "#4ade80", border: "2px solid #13132b" }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 2 }}>{p.display_name}</div>
                  <div style={{ color: "#64748b", fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 6 }}>{p.headline}</div>
                  {Array.isArray(p.interests) && p.interests.length > 0 && (
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {p.interests.slice(0, 3).map((interest, idx) => (
                        <span key={idx} style={{ background: "#1e1a2e", color: "#c084fc", fontSize: 11, padding: "2px 8px", borderRadius: 20 }}>{interest}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 12, color: "#475569", textAlign: "right", flexShrink: 0 }}>
                  <div>👁 {p.profile_views || 0}</div>
                  {p.mood && <div style={{ color: "#c084fc", marginTop: 4 }}>{p.mood}</div>}
                </div>
              </div>
            ))
        )}

        {/* Posts tab */}
        {!loading && tab === "posts" && (
          posts.length === 0
            ? <div style={{ textAlign: "center", padding: 48, color: "#475569" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
              <div style={{ fontSize: 17, fontWeight: 700 }}>No posts found</div>
            </div>
            : posts.map(p => (
              <div key={p.id} style={{ background: "#13132b", border: "1px solid #1e1e3a", borderRadius: 18, padding: 16, marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#c084fc,#22d3ee)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                    {p.author_name?.[0] || "?"}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{p.author_name}</div>
                    <div style={{ color: "#475569", fontSize: 12 }}>{p.created_date ? new Date(p.created_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}</div>
                  </div>
                  {!p.is_ai_generated && <span style={{ marginLeft: "auto", background: "#0f2a1e", color: "#4ade80", fontSize: 11, padding: "2px 8px", borderRadius: 20, border: "1px solid #4ade8040" }}>✅ Human</span>}
                </div>
                {p.content && <div style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.6, marginBottom: p.image_url ? 10 : 0 }}>{p.content.slice(0, 220)}{p.content.length > 220 ? "..." : ""}</div>}
                {p.image_url && <img src={p.image_url} alt="" style={{ width: "100%", borderRadius: 12, maxHeight: 220, objectFit: "cover" }} onError={e => e.target.style.display = "none"} />}
                <div style={{ marginTop: 10, color: "#475569", fontSize: 13, display: "flex", gap: 14 }}>
                  <span>💜 {p.likes_count || 0}</span>
                  <span>💬 {p.comments_count || 0}</span>
                </div>
              </div>
            ))
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
