import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DISCOVER_URL = "https://legacy-circle-ae3f9932.base44.app/functions/getPublicDiscover";
const GA_ID = "G-1N8GD2WM6L";

function injectGA(id) {
  if (document.getElementById(`ga-${id}`)) return;
  const s1 = document.createElement("script"); s1.id = `ga-${id}`; s1.async = true;
  s1.src = `https://www.googletagmanager.com/gtag/js?id=${id}`; document.head.appendChild(s1);
  const s2 = document.createElement("script");
  s2.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","${id}");`;
  document.head.appendChild(s2);
}

const NAV = [
  { icon: "🏠", label: "Home", path: "/Home" },
  { icon: "🔍", label: "Discover", path: "/Discover" },
  { icon: "✉️", label: "Messages", path: "/Messages" },
  { icon: "🔔", label: "Alerts", path: "/Notifications" },
  { icon: "👤", label: "Me", path: "/MyProfile" },
];

const TAGS = ["🎨 Art","🎵 Music","🎮 Gaming","📚 Books","💻 Tech","🌿 Nature","✍️ Writing","🎭 Comedy","🧘 Wellness","🛹 Sports","🎬 Film","🍕 Food"];
const TRENDING = [
  { tag: "#NoAlgorithm", posts: 847, trend: "+23%" },
  { tag: "#HumanFirst", posts: 612, trend: "+18%" },
  { tag: "#E2EE", posts: 441, trend: "+31%" },
  { tag: "#ChronFeed", posts: 388, trend: "+12%" },
  { tag: "#OurSpace", posts: 2104, trend: "+41%" },
];

function BottomNav({ navigate }) {
  const path = window.location.pathname;
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#0b0b1ef5", backdropFilter: "blur(16px)", borderTop: "1px solid #1e1e3a", display: "flex", justifyContent: "space-around", padding: "10px 0 12px", zIndex: 100 }}>
      {NAV.map(item => {
        const active = path === item.path;
        return (
          <button key={item.path} onClick={() => navigate(item.path)}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "4px 12px" }}>
            <span style={{ fontSize: 22, opacity: active ? 1 : 0.5 }}>{item.icon}</span>
            <span style={{ fontSize: 10, color: active ? "#c084fc" : "#475569", fontWeight: active ? 700 : 400 }}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function Discover() {
  const [query, setQuery] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [posts, setPosts] = useState([]);
  const [tab, setTab] = useState("trending");
  const [loading, setLoading] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    injectGA(GA_ID);
    loadAll("");
  }, []);

  const loadAll = async (q = "") => {
    setLoading(true);
    try {
      const res = await fetch(DISCOVER_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: q }) });
      const data = await res.json();
      setProfiles(data.profiles || []);
      setPosts(data.posts || []);
    } catch { }
    setLoading(false);
  };

  useEffect(() => {
    const t = setTimeout(() => { if (query) loadAll(query); }, 350);
    return () => clearTimeout(t);
  }, [query]);

  const handleTag = (tag) => {
    const clean = tag.replace(/^[\S]+ /, "").toLowerCase();
    if (selectedTag === tag) { setSelectedTag(null); setQuery(""); loadAll(""); }
    else { setSelectedTag(tag); setQuery(clean); setTab("people"); }
  };

  const tabs = [
    { id: "trending", label: "🔥 Trending" },
    { id: "people", label: `👥 People${profiles.length ? ` (${profiles.length})` : ""}` },
    { id: "posts", label: `📝 Posts${posts.length ? ` (${posts.length})` : ""}` },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d1a", color: "#f0f0f0", fontFamily: "'Segoe UI', system-ui, sans-serif", paddingBottom: 80 }}>

      {/* Sticky header */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "#0b0b1eee", backdropFilter: "blur(16px)", borderBottom: "1px solid #1e1e3a", padding: "14px 16px" }}>
        <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 12, background: "linear-gradient(90deg,#c084fc,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          🔍 Discover
        </div>
        <input value={query} onChange={e => { setQuery(e.target.value); setSelectedTag(null); if (query !== e.target.value) setTab("people"); }}
          placeholder="Search people, posts, interests..."
          style={{ width: "100%", background: "#13132b", border: "1px solid #1e1e3a", borderRadius: 28, color: "#f0f0f0", fontSize: 15, padding: "11px 18px", boxSizing: "border-box", outline: "none" }} />
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "14px 16px" }}>

        {/* Interest tags */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12, scrollbarWidth: "none" }}>
          {TAGS.map(tag => (
            <button key={tag} onClick={() => handleTag(tag)}
              style={{ padding: "6px 14px", background: selectedTag === tag ? "#2a1a3e" : "#13132b", border: `1px solid ${selectedTag === tag ? "#c084fc" : "#1e1e3a"}`, borderRadius: 20, color: selectedTag === tag ? "#c084fc" : "#64748b", fontSize: 13, cursor: "pointer", whiteSpace: "nowrap", fontWeight: selectedTag === tag ? 700 : 400, flexShrink: 0 }}>
              {tag}
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 2, borderBottom: "1px solid #1e1e3a", marginBottom: 16 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ padding: "10px 18px", background: "transparent", border: "none", borderBottom: `2px solid ${tab === t.id ? "#c084fc" : "transparent"}`, color: tab === t.id ? "#c084fc" : "#475569", fontWeight: 600, cursor: "pointer", fontSize: 13, whiteSpace: "nowrap" }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* TRENDING tab */}
        {tab === "trending" && !query && (
          <div>
            {/* Platform stats */}
            <div style={{ background: "linear-gradient(135deg,#13132b,#1a0a2e)", borderRadius: 20, padding: "20px", border: "1px solid #2a1a3e", marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#c084fc", marginBottom: 16, textTransform: "uppercase", letterSpacing: 1 }}>📊 Platform Today</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                {[["10,247","Active Members"],["3,841","Posts Today"],["98.3%","Uptime"]].map(([v, l]) => (
                  <div key={l} style={{ textAlign: "center" }}>
                    <div style={{ fontWeight: 900, fontSize: 22, color: "#f0f0f0" }}>{v}</div>
                    <div style={{ color: "#475569", fontSize: 11, marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending hashtags */}
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, color: "#94a3b8" }}>🔥 Trending Now</div>
            {TRENDING.map((t, i) => (
              <div key={t.tag} onClick={() => { setQuery(t.tag.slice(1)); setTab("posts"); }}
                style={{ background: "#13132b", borderRadius: 14, padding: "14px 18px", marginBottom: 8, border: "1px solid #1e1e3a", cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#c084fc40"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#1e1e3a"}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#1e1a2e", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14, color: "#c084fc", flexShrink: 0 }}>#{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{t.tag}</div>
                  <div style={{ color: "#64748b", fontSize: 12 }}>{t.posts.toLocaleString()} posts</div>
                </div>
                <div style={{ background: "#0f2a1e", color: "#4ade80", fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 20 }}>{t.trend}</div>
              </div>
            ))}

            {/* Suggested people from live data */}
            {profiles.length > 0 && (
              <>
                <div style={{ fontWeight: 700, fontSize: 15, margin: "20px 0 12px", color: "#94a3b8" }}>⭐ Featured Members</div>
                {profiles.slice(0, 4).map(p => (
                  <div key={p.id} onClick={() => navigate(`/Profile?email=${p.user_email}`)}
                    style={{ background: "#13132b", border: "1px solid #1e1e3a", borderRadius: 16, padding: "14px 16px", marginBottom: 10, cursor: "pointer", display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg,#c084fc,#22d3ee)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, flexShrink: 0, overflow: "hidden", position: "relative" }}>
                      {p.avatar_url ? <img src={p.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} /> : (p.display_name?.[0] || "?")}
                      {p.is_online && <div style={{ position: "absolute", bottom: 1, right: 1, width: 11, height: 11, borderRadius: "50%", background: "#4ade80", border: "2px solid #13132b" }} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", gap: 6 }}>
                        {p.display_name}
                        {p.profile_views > 50 && <span style={{ fontSize: 12, color: "#22d3ee" }}>✓</span>}
                      </div>
                      <div style={{ color: "#64748b", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.headline || "OurSpace member"}</div>
                    </div>
                    <button style={{ padding: "6px 14px", background: "#1e1a2e", border: "1px solid #c084fc40", borderRadius: 20, color: "#c084fc", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>View →</button>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {loading && tab !== "trending" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[1, 2, 3].map(i => <div key={i} style={{ background: "#13132b", borderRadius: 16, height: 80, opacity: 0.4 }} />)}
          </div>
        )}

        {/* PEOPLE tab */}
        {!loading && tab === "people" && (
          profiles.length === 0
            ? <div style={{ textAlign: "center", padding: "52px 24px", color: "#475569" }}>
                <div style={{ fontSize: 52, marginBottom: 12 }}>🌌</div>
                <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 6, color: "#94a3b8" }}>No one found yet</div>
                <div style={{ fontSize: 14 }}>Be the first to show up here 🚀</div>
              </div>
            : profiles.map(p => (
              <div key={p.id} onClick={() => navigate(`/Profile?email=${p.user_email}`)}
                style={{ background: "#13132b", border: "1px solid #1e1e3a", borderRadius: 18, padding: 16, marginBottom: 12, cursor: "pointer", display: "flex", gap: 14, alignItems: "center" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#c084fc40"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#1e1e3a"}>
                <div style={{ width: 58, height: 58, borderRadius: "50%", background: "linear-gradient(135deg,#c084fc,#22d3ee)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, flexShrink: 0, overflow: "hidden", position: "relative" }}>
                  {p.avatar_url ? <img src={p.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} /> : (p.display_name?.[0] || "?")}
                  {p.is_online && <div style={{ position: "absolute", bottom: 2, right: 2, width: 12, height: 12, borderRadius: "50%", background: "#4ade80", border: "2px solid #13132b" }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 2, display: "flex", alignItems: "center", gap: 6 }}>
                    {p.display_name}
                    {p.profile_views > 50 && <span style={{ fontSize: 13, color: "#22d3ee", fontWeight: 700 }}>✓</span>}
                  </div>
                  <div style={{ color: "#64748b", fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 6 }}>{p.headline || "OurSpace member"}</div>
                  {Array.isArray(p.interests) && p.interests.length > 0 && (
                    <div style={{ display: "flex", gap: 4 }}>
                      {p.interests.slice(0, 3).map((int, idx) => (
                        <span key={idx} style={{ background: "#1e1a2e", color: "#c084fc", fontSize: 11, padding: "2px 8px", borderRadius: 20 }}>{int}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 12, color: "#475569" }}>👁 {p.profile_views || 0}</div>
                  {p.mood && <div style={{ color: "#c084fc", fontSize: 16, marginTop: 4 }}>{p.mood}</div>}
                </div>
              </div>
            ))
        )}

        {/* POSTS tab */}
        {!loading && tab === "posts" && (
          posts.length === 0
            ? <div style={{ textAlign: "center", padding: "52px 24px", color: "#475569" }}>
                <div style={{ fontSize: 52, marginBottom: 12 }}>📭</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: "#94a3b8" }}>No posts found</div>
              </div>
            : posts.map(p => (
              <div key={p.id} style={{ background: "#13132b", border: "1px solid #1e1e3a", borderRadius: 18, padding: 16, marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#c084fc,#22d3ee)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, flexShrink: 0, overflow: "hidden" }}>
                    {p.author_avatar ? <img src={p.author_avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} /> : (p.author_name?.[0] || "?")}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{p.author_name}</div>
                    <div style={{ color: "#475569", fontSize: 12 }}>{p.created_date ? new Date(p.created_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}</div>
                  </div>
                  {!p.is_ai_generated
                    ? <span style={{ background: "#0f2a1e", color: "#4ade80", fontSize: 11, padding: "2px 8px", borderRadius: 20, border: "1px solid #4ade8040" }}>✅ Human</span>
                    : <span style={{ background: "#1e1a2e", color: "#c084fc", fontSize: 11, padding: "2px 8px", borderRadius: 20, border: "1px solid #c084fc40" }}>🤖 AI</span>
                  }
                </div>
                {p.title && <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{p.title}</div>}
                {p.content && <div style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.6, marginBottom: p.image_url ? 10 : 0 }}>{p.content.slice(0, 240)}{p.content.length > 240 ? "…" : ""}</div>}
                {p.image_url && <img src={p.image_url} alt="" style={{ width: "100%", borderRadius: 12, maxHeight: 220, objectFit: "cover", marginTop: 8 }} onError={e => e.target.style.display = "none"} />}
                <div style={{ marginTop: 10, color: "#475569", fontSize: 13, display: "flex", gap: 16 }}>
                  <span>💜 {p.likes_count || 0}</span>
                  <span>💬 {p.comments_count || 0}</span>
                </div>
              </div>
            ))
        )}
      </div>

      <BottomNav navigate={navigate} />
    </div>
  );
}
