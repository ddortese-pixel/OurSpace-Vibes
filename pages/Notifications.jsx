import { useState, useEffect } from "react";
import { Notification } from "../api/entities";
import { useNavigate } from "react-router-dom";

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

const TYPE_ICONS = {
  like: "💜", comment: "💬", friend_request: "👥",
  mention: "📣", wall_post: "📌", follow: "➕",
};
const TYPE_LABELS = {
  like: "liked your post", comment: "commented on your post",
  friend_request: "sent you a friend request", mention: "mentioned you",
  wall_post: "posted on your wall", follow: "started following you",
};

function isLoggedIn() { return !!localStorage.getItem("os2_email"); }

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

export default function Notifications() {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();

  useEffect(() => {
    injectGA("G-1N8GD2WM6L");
    if (loggedIn) loadNotifs();
    else setLoading(false);
  }, []);

  const loadNotifs = async () => {
    setLoading(true);
    try {
      const data = await Notification.list("-created_date").catch(() => []);
      setNotifs(data || []);
      await Promise.all((data || []).filter(n => !n.is_read).map(n =>
        Notification.update(n.id, { is_read: true }).catch(() => {})
      ));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, is_read: true })));

  const handleClick = (n) => {
    if (n.type === "friend_request" || n.type === "wall_post" || n.type === "follow") {
      navigate(`/Profile?email=${n.from_email}`);
    } else if (n.reference_id) {
      navigate(`/Home`);
    }
  };

  if (!loggedIn) return (
    <div style={{ minHeight: "100vh", background: "#0d0d1a", color: "#f0f0f0", fontFamily: "'Segoe UI', sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 32, textAlign: "center", paddingBottom: 80 }}>
      <div style={{ fontSize: 64 }}>🔔</div>
      <div style={{ fontSize: 22, fontWeight: 800 }}>Stay in the Loop</div>
      <div style={{ color: "#64748b", fontSize: 15, maxWidth: 280, lineHeight: 1.6 }}>Sign in to see likes, comments, friend requests, and more.</div>
      <button onClick={() => navigate("/Onboarding")} style={{ padding: "12px 32px", background: "linear-gradient(135deg,#c084fc,#22d3ee)", border: "none", borderRadius: 24, color: "#000", fontWeight: 800, fontSize: 15, cursor: "pointer" }}>Get Started</button>
      <button onClick={() => navigate("/Home")} style={{ background: "none", border: "1px solid #2a2a45", borderRadius: 24, color: "#94a3b8", padding: "10px 24px", cursor: "pointer", fontSize: 14 }}>← Back to Feed</button>
      <BottomNav navigate={navigate} />
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d1a", color: "#f0f0f0", fontFamily: "'Segoe UI', system-ui, sans-serif", paddingBottom: 80 }}>
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "#0b0b1eee", backdropFilter: "blur(16px)", borderBottom: "1px solid #1e1e3a", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontWeight: 900, fontSize: 20, background: "linear-gradient(90deg,#c084fc,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>🔔 Notifications</span>
        {notifs.some(n => !n.is_read) && (
          <button onClick={markAllRead} style={{ background: "transparent", border: "1px solid #2a2a45", borderRadius: 20, color: "#94a3b8", fontSize: 12, padding: "5px 14px", cursor: "pointer" }}>
            Mark all read
          </button>
        )}
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "8px 16px" }}>
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 16 }}>
            {[1, 2, 3, 4].map(i => <div key={i} style={{ height: 72, background: "#13132b", borderRadius: 14, opacity: 0.4 }} />)}
          </div>
        )}

        {!loading && notifs.length === 0 && (
          <div style={{ textAlign: "center", padding: "64px 24px", color: "#475569" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🔔</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: "#94a3b8" }}>All caught up!</div>
            <div style={{ fontSize: 14, lineHeight: 1.6 }}>No notifications yet. Start connecting with people — like posts, send messages, make friends! 🤝</div>
            <button onClick={() => navigate("/Discover")} style={{ marginTop: 20, padding: "10px 24px", background: "linear-gradient(135deg,#c084fc,#22d3ee)", border: "none", borderRadius: 20, color: "#000", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>Browse People</button>
          </div>
        )}

        {notifs.map(n => (
          <div key={n.id} onClick={() => handleClick(n)}
            style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 12px", borderRadius: 14, marginBottom: 4, background: !n.is_read ? "#13132b" : "transparent", border: `1px solid ${!n.is_read ? "#1e1e3a" : "transparent"}`, cursor: "pointer", transition: "background 0.15s" }}>
            {/* Avatar */}
            <div style={{ width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(135deg,#c084fc,#22d3ee)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0, overflow: "hidden", position: "relative" }}>
              {n.from_avatar
                ? <img src={n.from_avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} />
                : (n.from_name?.[0]?.toUpperCase() || "?")}
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.5 }}>
                <span style={{ fontWeight: 700, color: "#c084fc" }}>{n.from_name || "Someone"}</span>
                {" "}{n.message?.replace(n.from_name || "", "").trim() || TYPE_LABELS[n.type] || n.type}
              </div>
              <div style={{ color: "#475569", fontSize: 12, marginTop: 3 }}>
                {n.created_date ? new Date(n.created_date).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : ""}
              </div>
            </div>

            {/* Right side */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <span style={{ fontSize: 22 }}>{TYPE_ICONS[n.type] || "🔔"}</span>
              {!n.is_read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#c084fc" }} />}
            </div>
          </div>
        ))}
      </div>

      <BottomNav navigate={navigate} />
    </div>
  );
}
