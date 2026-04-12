import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CHARACTERS = [
  { name: "Justice", emoji: "⚖️", color: "#f59e0b" },
  { name: "Lebron", emoji: "🏀", color: "#3b82f6" },
  { name: "Zara", emoji: "🌟", color: "#ec4899" },
  { name: "Eli", emoji: "🔬", color: "#10b981" },
];

export default function LCProfile() {
  const navigate = useNavigate();
  const name = localStorage.getItem("lc_name") || "Learner";
  const character = localStorage.getItem("lc_character") || "Justice";
  const ageGroup = localStorage.getItem("lc_age_group") || "8-10";
  const parentEmail = localStorage.getItem("lc_parent_email") || "";
  const xp = parseInt(localStorage.getItem("lc_xp") || "0");
  const streak = parseInt(localStorage.getItem("lc_streak") || "1");
  const level = Math.floor(xp / 100) + 1;
  const charData = CHARACTERS.find(c => c.name === character) || CHARACTERS[0];
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(name);
  const s = { fontFamily: "sans-serif" };

  function saveProfile() {
    localStorage.setItem("lc_name", newName);
    setEditing(false);
    window.location.reload();
  }

  function logout() {
    ["lc_email", "lc_name", "lc_age_group", "lc_character", "lc_parent_email"].forEach(k => localStorage.removeItem(k));
    navigate("/LCSplashScreen");
  }

  return (
    <div style={{ ...s, minHeight: "100vh", background: "#0a0a1a", color: "#fff" }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, #1a0a2e, #16162a)`, padding: "24px 20px 20px", borderBottom: "1px solid #2d2d4e" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 800 }}>👤 My Profile</div>
          <button onClick={() => navigate("/LCHome")} style={{ background: "none", border: "none", color: "#a78bfa", fontSize: 13, cursor: "pointer" }}>← Home</button>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 16px" }}>
        {/* Avatar card */}
        <div style={{ textAlign: "center", background: "#16162a", borderRadius: 20, padding: "32px 20px", marginBottom: 20, border: `1px solid ${charData.color}30`, boxShadow: `0 4px 24px ${charData.color}15` }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: `linear-gradient(135deg, ${charData.color}40, ${charData.color}20)`, border: `3px solid ${charData.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, margin: "0 auto 16px" }}>
            {charData.emoji}
          </div>
          {editing ? (
            <div style={{ marginBottom: 12 }}>
              <input value={newName} onChange={e => setNewName(e.target.value)} style={{ background: "#0d0d1a", border: "1px solid #2d2d4e", borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 18, fontWeight: 700, textAlign: "center", width: "80%" }} />
              <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 10 }}>
                <button onClick={saveProfile} style={{ background: "#7c3aed", border: "none", borderRadius: 10, padding: "8px 20px", color: "#fff", fontWeight: 600, cursor: "pointer" }}>Save</button>
                <button onClick={() => setEditing(false)} style={{ background: "#1e1e32", border: "1px solid #2d2d4e", borderRadius: 10, padding: "8px 20px", color: "#94a3b8", cursor: "pointer" }}>Cancel</button>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>{name}</div>
          )}
          <div style={{ color: charData.color, fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{character}'s Companion</div>
          <div style={{ color: "#64748b", fontSize: 12 }}>Ages {ageGroup}</div>
          {!editing && (
            <button onClick={() => setEditing(true)} style={{ background: "#1e1e32", border: "1px solid #2d2d4e", borderRadius: 10, padding: "8px 18px", color: "#94a3b8", fontSize: 13, cursor: "pointer", marginTop: 12 }}>Edit Name</button>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
          {[
            { label: "Level", value: level, emoji: "🎯" },
            { label: "XP", value: xp, emoji: "⭐" },
            { label: "Streak", value: `${streak}d`, emoji: "🔥" },
          ].map(stat => (
            <div key={stat.label} style={{ background: "#16162a", borderRadius: 14, padding: "14px 10px", textAlign: "center", border: "1px solid #2d2d4e" }}>
              <div style={{ fontSize: 20 }}>{stat.emoji}</div>
              <div style={{ fontSize: 18, fontWeight: 800, marginTop: 4 }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Account info */}
        <div style={{ background: "#16162a", borderRadius: 16, padding: "20px", marginBottom: 16, border: "1px solid #2d2d4e" }}>
          <div style={{ fontSize: 13, color: "#64748b", fontWeight: 600, marginBottom: 14, textTransform: "uppercase", letterSpacing: 1 }}>Account</div>
          {[
            { label: "Favorite Character", value: `${charData.emoji} ${character}` },
            { label: "Age Group", value: `Ages ${ageGroup}` },
            { label: "Parent/Guardian", value: parentEmail || "Not provided" },
          ].map(row => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", paddingBottom: 12, marginBottom: 12, borderBottom: "1px solid #1e1e32" }}>
              <span style={{ color: "#64748b", fontSize: 14 }}>{row.label}</span>
              <span style={{ color: "#e2e8f0", fontSize: 14, fontWeight: 600 }}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* Links */}
        <div style={{ background: "#16162a", borderRadius: 16, overflow: "hidden", border: "1px solid #2d2d4e", marginBottom: 16 }}>
          {[
            { label: "📜 Privacy Policy", path: "/LCPrivacyPolicy" },
            { label: "📋 Terms of Service", path: "/LCTermsOfService" },
            { label: "🚩 Report Content", path: "/LCReportContent" },
            { label: "🏆 Launch Tracker", path: "/LaunchTracker" },
          ].map((item, i, arr) => (
            <div key={item.label} onClick={() => navigate(item.path)} style={{
              padding: "16px 20px", cursor: "pointer", color: "#e2e8f0", fontSize: 14,
              borderBottom: i < arr.length - 1 ? "1px solid #1e1e32" : "none",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              {item.label} <span style={{ color: "#475569" }}>→</span>
            </div>
          ))}
        </div>

        {/* Logout */}
        <button onClick={logout} style={{ width: "100%", background: "#1e0a0a", border: "1px solid #450a0a", borderRadius: 14, padding: "14px", color: "#f87171", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          Sign Out
        </button>
      </div>

      {/* Bottom nav */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#16162a", borderTop: "1px solid #2d2d4e", display: "flex", padding: "12px 0 20px" }}>
        {[
          { icon: "🏠", label: "Home", path: "/LCHome" },
          { icon: "📖", label: "Stories", path: "/LCStories" },
          { icon: "🏆", label: "Progress", path: "/LCProgress" },
          { icon: "💌", label: "Glows", path: "/LCGlows" },
          { icon: "👤", label: "Profile", path: "/LCProfile" },
        ].map(n => (
          <div key={n.label} onClick={() => navigate(n.path)} style={{ flex: 1, textAlign: "center", cursor: "pointer" }}>
            <div style={{ fontSize: 22 }}>{n.icon}</div>
            <div style={{ fontSize: 10, color: n.path === "/LCProfile" ? "#a855f7" : "#475569", marginTop: 4, fontWeight: 600 }}>{n.label}</div>
          </div>
        ))}
      </div>
      <div style={{ height: 80 }} />
    </div>
  );
}
