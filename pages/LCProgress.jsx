import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BADGES = [
  { id: "first_story", emoji: "📖", name: "First Chapter", desc: "Completed your first story", xpNeeded: 50 },
  { id: "streak_3", emoji: "🔥", name: "On Fire", desc: "3-day learning streak", xpNeeded: 0 },
  { id: "quiz_ace", emoji: "🧠", name: "Quiz Ace", desc: "Passed a quiz with 100%", xpNeeded: 0 },
  { id: "all_chars", emoji: "🌟", name: "Circle Complete", desc: "Tried all 4 characters", xpNeeded: 200 },
  { id: "glow_sender", emoji: "💌", name: "Glow Giver", desc: "Sent 3 Glow Messages", xpNeeded: 0 },
  { id: "level_5", emoji: "🚀", name: "Level 5 Legend", desc: "Reached Level 5", xpNeeded: 500 },
  { id: "100xp", emoji: "⭐", name: "Century Star", desc: "Earned 100 XP", xpNeeded: 100 },
  { id: "leader", emoji: "👑", name: "Legacy Leader", desc: "Reached Level 10", xpNeeded: 1000 },
];

export default function LCProgress() {
  const navigate = useNavigate();
  const name = localStorage.getItem("lc_name") || "Learner";
  const xp = parseInt(localStorage.getItem("lc_xp") || "0");
  const streak = parseInt(localStorage.getItem("lc_streak") || "1");
  const level = Math.floor(xp / 100) + 1;
  const xpProgress = xp % 100;

  const unlockedBadges = BADGES.filter(b => xp >= b.xpNeeded || b.xpNeeded === 0 && xp > 0 && b.id === "first_story");
  const earnedBadges = BADGES.filter(b => xp >= b.xpNeeded);

  const s = { fontFamily: "sans-serif" };

  return (
    <div style={{ ...s, minHeight: "100vh", background: "#0a0a1a", color: "#fff" }}>
      <div style={{ background: "#16162a", padding: "20px 20px 16px", borderBottom: "1px solid #2d2d4e" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 800 }}>🏆 Progress</div>
          <button onClick={() => navigate("/LCHome")} style={{ background: "none", border: "none", color: "#a78bfa", fontSize: 13, cursor: "pointer" }}>← Home</button>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "20px 16px" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
          {[
            { label: "Level", value: level, emoji: "🎯", color: "#a855f7" },
            { label: "Total XP", value: xp, emoji: "⭐", color: "#f59e0b" },
            { label: "Day Streak", value: streak, emoji: "🔥", color: "#ef4444" },
          ].map(stat => (
            <div key={stat.label} style={{ background: "#16162a", borderRadius: 16, padding: "16px 12px", textAlign: "center", border: "1px solid #2d2d4e" }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{stat.emoji}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* XP Bar */}
        <div style={{ background: "#16162a", borderRadius: 16, padding: "20px", marginBottom: 24, border: "1px solid #2d2d4e" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontWeight: 700 }}>Level {level}</span>
            <span style={{ color: "#64748b", fontSize: 13 }}>{xpProgress}/100 XP</span>
          </div>
          <div style={{ background: "#0d0d1a", borderRadius: 99, height: 12, overflow: "hidden" }}>
            <div style={{ width: `${xpProgress}%`, height: "100%", background: "linear-gradient(90deg, #7c3aed, #a855f7, #ec4899)", borderRadius: 99 }} />
          </div>
          <div style={{ color: "#64748b", fontSize: 12, marginTop: 8 }}>
            {100 - xpProgress} XP until Level {level + 1}
          </div>
        </div>

        {/* Badges */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, color: "#64748b", fontWeight: 600, marginBottom: 14, textTransform: "uppercase", letterSpacing: 1 }}>
            Badges — {earnedBadges.length}/{BADGES.length} earned
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {BADGES.map(badge => {
              const earned = xp >= badge.xpNeeded;
              return (
                <div key={badge.id} style={{
                  background: earned ? "#16162a" : "#0d0d1a",
                  border: `1px solid ${earned ? "#7c3aed40" : "#1e1e32"}`,
                  borderRadius: 14, padding: "14px", opacity: earned ? 1 : 0.45,
                }}>
                  <div style={{ fontSize: 28, marginBottom: 6, filter: earned ? "none" : "grayscale(100%)" }}>{badge.emoji}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: earned ? "#fff" : "#475569" }}>{badge.name}</div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>{badge.desc}</div>
                  {!earned && badge.xpNeeded > 0 && (
                    <div style={{ fontSize: 11, color: "#7c3aed", marginTop: 6 }}>Unlock at {badge.xpNeeded} XP</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tips */}
        <div style={{ background: "#16162a", borderRadius: 16, padding: "20px", border: "1px solid #2d2d4e", marginBottom: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>💡 How to earn XP faster</div>
          {[
            "Complete story episodes (+50-65 XP each)",
            "Pass mastery quizzes (+30 XP)",
            "Send Glow Messages to friends (+10 XP)",
            "Log in every day to build your streak",
            "Try all 4 characters for bonus rewards",
          ].map((tip, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
              <div style={{ color: "#a855f7", fontSize: 14, flexShrink: 0 }}>→</div>
              <div style={{ color: "#94a3b8", fontSize: 13 }}>{tip}</div>
            </div>
          ))}
        </div>
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
            <div style={{ fontSize: 10, color: n.path === "/LCProgress" ? "#a855f7" : "#475569", marginTop: 4, fontWeight: 600 }}>{n.label}</div>
          </div>
        ))}
      </div>
      <div style={{ height: 80 }} />
    </div>
  );
}
