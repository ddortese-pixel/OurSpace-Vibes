import { useState, useEffect } from "react";
import { Profile } from "../api/entities";
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
function getMyName() { return localStorage.getItem("os2_name") || ""; }
function isLoggedIn() { return !!localStorage.getItem("os2_email"); }

const NAV = [
  { icon: "🏠", label: "Home", path: "/Home" },
  { icon: "🔍", label: "Discover", path: "/Discover" },
  { icon: "✉️", label: "Messages", path: "/Messages" },
  { icon: "🔔", label: "Alerts", path: "/Notifications" },
  { icon: "👤", label: "Me", path: "/MyProfile" },
];

const Toggle = ({ value, onChange }) => (
  <div onClick={() => onChange(!value)} style={{ width: 44, height: 24, background: value ? "#c084fc" : "#2a2a45", borderRadius: 12, position: "relative", cursor: "pointer", transition: "background 0.2s", flexShrink: 0 }}>
    <div style={{ width: 20, height: 20, background: "#fff", borderRadius: "50%", position: "absolute", top: 2, left: value ? 22 : 2, transition: "left 0.2s" }} />
  </div>
);

const Row = ({ label, sub, value, onChange }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid #1e1e3a" }}>
    <div>
      <div style={{ fontSize: 15, fontWeight: 600 }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{sub}</div>}
    </div>
    <Toggle value={value} onChange={onChange} />
  </div>
);

const Section = ({ title, children }) => (
  <div style={{ background: "#13132b", borderRadius: 16, padding: "0 16px", marginBottom: 16, border: "1px solid #1e1e3a" }}>
    <div style={{ padding: "12px 0", borderBottom: "1px solid #1e1e3a", fontWeight: 700, fontSize: 11, color: "#c084fc", letterSpacing: 1.5, textTransform: "uppercase" }}>{title}</div>
    {children}
  </div>
);

export default function Settings() {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  const myEmail = getMyEmail();

  const [humanFilter, setHumanFilter] = useState(() => localStorage.getItem("os2_humanFilter") === "true");
  const [notifLikes, setNotifLikes] = useState(() => localStorage.getItem("os2_notifLikes") !== "false");
  const [notifComments, setNotifComments] = useState(() => localStorage.getItem("os2_notifComments") !== "false");
  const [notifFriends, setNotifFriends] = useState(() => localStorage.getItem("os2_notifFriends") !== "false");
  const [notifWall, setNotifWall] = useState(() => localStorage.getItem("os2_notifWall") !== "false");
  const [privacy, setPrivacy] = useState(() => localStorage.getItem("os2_privacy") || "public");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => { injectGA("G-1N8GD2WM6L"); }, []);

  const save = async () => {
    setSaving(true);
    // Persist to localStorage
    localStorage.setItem("os2_humanFilter", humanFilter);
    localStorage.setItem("os2_notifLikes", notifLikes);
    localStorage.setItem("os2_notifComments", notifComments);
    localStorage.setItem("os2_notifFriends", notifFriends);
    localStorage.setItem("os2_notifWall", notifWall);
    localStorage.setItem("os2_privacy", privacy);

    // Also update Profile entity if logged in
    if (loggedIn && myEmail) {
      try {
        const profiles = await Profile.filter({ user_email: myEmail });
        const data = { privacy_level: privacy };
        if (profiles[0]?.id) {
          await Profile.update(profiles[0].id, data);
        }
      } catch (e) { console.error(e); }
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const deleteAccount = async () => {
    if (!deleteConfirm) { setDeleteConfirm(true); return; }
    // Clear everything
    if (loggedIn && myEmail) {
      try {
        const profiles = await Profile.filter({ user_email: myEmail });
        if (profiles[0]?.id) await Profile.delete(profiles[0].id);
      } catch (e) { console.error(e); }
    }
    localStorage.clear();
    navigate("/Onboarding");
  };

  const logout = () => {
    localStorage.removeItem("os2_email");
    localStorage.removeItem("os2_name");
    localStorage.removeItem("os2_vibe");
    navigate("/Onboarding");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d1a", color: "#f0f0f0", fontFamily: "'Segoe UI', system-ui, sans-serif", paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "#0b0b1eee", backdropFilter: "blur(16px)", borderBottom: "1px solid #1e1e3a", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: 20, cursor: "pointer" }}>←</button>
        <span style={{ fontWeight: 900, fontSize: 18, background: "linear-gradient(90deg,#c084fc,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>⚙️ Settings</span>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "16px" }}>

        {/* Account info */}
        {loggedIn && (
          <div style={{ background: "#13132b", borderRadius: 16, padding: "14px 16px", marginBottom: 16, border: "1px solid #1e1e3a", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#c084fc,#22d3ee)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18, color: "#fff" }}>
              {getMyName()?.[0]?.toUpperCase() || "?"}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{getMyName()}</div>
              <div style={{ color: "#64748b", fontSize: 13 }}>{myEmail}</div>
            </div>
            <button onClick={() => navigate("/MyProfile")} style={{ marginLeft: "auto", padding: "6px 14px", background: "transparent", border: "1px solid #2a2a45", borderRadius: 20, color: "#94a3b8", fontSize: 13, cursor: "pointer" }}>Edit Profile →</button>
          </div>
        )}

        <Section title="Feed">
          <Row label="Human-Only Filter" sub="Show only human-verified content in your feed" value={humanFilter} onChange={setHumanFilter} />
        </Section>

        <Section title="Notifications">
          <Row label="Likes" sub="When someone likes your post" value={notifLikes} onChange={setNotifLikes} />
          <Row label="Comments" sub="When someone comments on your post" value={notifComments} onChange={setNotifComments} />
          <Row label="Friend Requests" sub="When someone wants to connect" value={notifFriends} onChange={setNotifFriends} />
          <Row label="Wall Posts" sub="When someone posts on your wall" value={notifWall} onChange={setNotifWall} />
        </Section>

        <Section title="Privacy">
          <div style={{ padding: "14px 0", borderBottom: "1px solid #1e1e3a" }}>
            <div style={{ fontWeight: 600, marginBottom: 10 }}>Profile Visibility</div>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { v: "public", label: "🌐 Public" },
                { v: "friends", label: "👥 Friends" },
                { v: "private", label: "🔒 Private" },
              ].map(({ v, label }) => (
                <button key={v} onClick={() => setPrivacy(v)}
                  style={{ padding: "7px 14px", background: privacy === v ? "#2a1a3e" : "transparent", border: `1px solid ${privacy === v ? "#c084fc" : "#2a2a45"}`, borderRadius: 20, color: privacy === v ? "#c084fc" : "#94a3b8", fontSize: 13, cursor: "pointer", fontWeight: privacy === v ? 700 : 400 }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ padding: "14px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 600 }}>End-to-End Encrypted DMs</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>Your messages cannot be read by anyone else</div>
            </div>
            <span style={{ fontSize: 12, background: "#0f2a1e", color: "#4ade80", padding: "4px 10px", borderRadius: 20, border: "1px solid #4ade8040" }}>🔒 Always On</span>
          </div>
        </Section>

        <Section title="Legal">
          <div onClick={() => navigate("/PrivacyPolicy")} style={{ padding: "14px 0", borderBottom: "1px solid #1e1e3a", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Privacy Policy</span><span style={{ color: "#64748b" }}>→</span>
          </div>
          <div onClick={() => navigate("/TermsOfService")} style={{ padding: "14px 0", borderBottom: "1px solid #1e1e3a", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Terms of Service</span><span style={{ color: "#64748b" }}>→</span>
          </div>
          <div onClick={() => navigate("/ContentPolicy")} style={{ padding: "14px 0", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Community Guidelines & Content Policy</span><span style={{ color: "#64748b" }}>→</span>
          </div>
        </Section>

        <Section title="Account">
          <div style={{ padding: "14px 0", borderBottom: "1px solid #1e1e3a" }}>
            <button onClick={logout} style={{ background: "none", border: "none", color: "#f97316", fontWeight: 600, fontSize: 15, cursor: "pointer", padding: 0 }}>Sign Out</button>
          </div>
          <div style={{ padding: "14px 0" }}>
            <button onClick={deleteAccount}
              style={{ background: "none", border: "none", color: deleteConfirm ? "#ef4444" : "#64748b", fontWeight: deleteConfirm ? 700 : 400, fontSize: 14, cursor: "pointer", padding: 0 }}>
              {deleteConfirm ? "⚠️ Tap again to confirm — this cannot be undone" : "Delete Account"}
            </button>
          </div>
        </Section>

        <button onClick={save} disabled={saving}
          style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg,#c084fc,#22d3ee)", border: "none", borderRadius: 14, color: "#000", fontWeight: 800, fontSize: 16, cursor: "pointer", marginBottom: 8, opacity: saving ? 0.7 : 1 }}>
          {saved ? "✅ Saved!" : saving ? "Saving..." : "Save Settings"}
        </button>

        <div style={{ textAlign: "center", color: "#2a2a45", fontSize: 11, marginTop: 8 }}>
          OurSpace 2.0 · v2.0.0 · Built with ❤️ on Base44
        </div>
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
