import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GA_ID = "G-HEWR0ZB5G8";
const LC_ICON = "https://media.base44.com/images/public/69d9b8416964fe31ae3f9932/f199871d3_generated_image.png";

function injectGA(id) {
  if (document.getElementById(`ga-${id}`)) return;
  const s1 = document.createElement("script"); s1.id = `ga-${id}`; s1.async = true;
  s1.src = `https://www.googletagmanager.com/gtag/js?id=${id}`; document.head.appendChild(s1);
  const s2 = document.createElement("script");
  s2.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","${id}");`;
  document.head.appendChild(s2);
}

const CHARACTERS = [
  { name: "Justice", emoji: "⚖️", color: "#f59e0b", bg: "#1a120a", story: "The Playground Dispute", desc: "Justice helps two friends solve a big disagreement fairly.", xp: 50 },
  { name: "Lebron", emoji: "🏀", color: "#3b82f6", bg: "#0a1020", story: "The Big Game Decision", desc: "Lebron must choose between winning and being a good teammate.", xp: 60 },
  { name: "Zara", emoji: "🌟", color: "#ec4899", bg: "#1a0a14", story: "The Art Room Mystery", desc: "Zara discovers her creativity can solve more than just art problems.", xp: 55 },
  { name: "Eli", emoji: "🔬", color: "#10b981", bg: "#0a1a12", story: "The Science Fair Secret", desc: "Eli uncovers something surprising while building his experiment.", xp: 65 },
];

const DAILY_CHALLENGES = [
  { emoji: "📖", title: "Read a story", desc: "Complete any episode today", xp: 20 },
  { emoji: "🧩", title: "Pass a quiz", desc: "Score 80% or higher", xp: 30 },
  { emoji: "💌", title: "Send a Glow", desc: "Encourage a fellow learner", xp: 10 },
  { emoji: "🔥", title: "Keep your streak", desc: "Log in 3 days in a row", xp: 25 },
];

export default function LCHome() {
  const navigate = useNavigate();
  const name = localStorage.getItem("lc_name") || "Learner";
  const character = localStorage.getItem("lc_character") || "Justice";
  const xp = parseInt(localStorage.getItem("lc_xp") || "0");
  const streak = parseInt(localStorage.getItem("lc_streak") || "1");
  const level = Math.floor(xp / 100) + 1;
  const xpProgress = xp % 100;

  const charData = CHARACTERS.find(c => c.name === character) || CHARACTERS[0];

  useEffect(() => {
    injectGA(GA_ID);
    let link = document.querySelector("link[rel~='icon']");
    if (!link) { link = document.createElement("link"); link.rel = "icon"; document.head.appendChild(link); }
    link.href = LC_ICON;
    document.title = "The Legacy Circle";
    if (!localStorage.getItem("lc_email")) navigate("/LCOnboarding");
  }, []);

  const s = { fontFamily: "sans-serif" };

  return (
    <div style={{ ...s, minHeight: "100vh", background: "#0a0a1a", color: "#fff" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1a0a2e, #16162a)", padding: "20px 20px 16px", borderBottom: "1px solid #2d2d4e" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 13, color: "#a78bfa" }}>Welcome back,</div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{name} {charData.emoji}</div>
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 18 }}>🔥</div>
              <div style={{ fontSize: 11, color: "#f59e0b", fontWeight: 700 }}>{streak}d</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 18 }}>⭐</div>
              <div style={{ fontSize: 11, color: "#a78bfa", fontWeight: 700 }}>{xp} XP</div>
            </div>
            <div onClick={() => navigate("/LCProfile")} style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #a855f7)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 18 }}>
              {charData.emoji}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "20px 16px" }}>
        {/* Level bar */}
        <div style={{ background: "#16162a", borderRadius: 16, padding: "16px 20px", marginBottom: 20, border: "1px solid #2d2d4e" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: "#a78bfa", fontWeight: 600 }}>Level {level}</span>
            <span style={{ fontSize: 13, color: "#64748b" }}>{xpProgress}/100 XP to next level</span>
          </div>
          <div style={{ background: "#0d0d1a", borderRadius: 99, height: 8, overflow: "hidden" }}>
            <div style={{ width: `${xpProgress}%`, height: "100%", background: "linear-gradient(90deg, #7c3aed, #a855f7, #ec4899)", borderRadius: 99, transition: "width 0.6s" }} />
          </div>
        </div>

        {/* Featured story — your character */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, color: "#64748b", fontWeight: 600, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>Your Story</div>
          <div onClick={() => navigate("/LCStories")} style={{
            background: `linear-gradient(135deg, ${charData.bg}, #16162a)`,
            border: `1px solid ${charData.color}40`,
            borderRadius: 20, padding: "24px 20px", cursor: "pointer",
            boxShadow: `0 4px 24px ${charData.color}20`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ fontSize: 44 }}>{charData.emoji}</div>
              <div>
                <div style={{ fontSize: 12, color: charData.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{charData.name}</div>
                <div style={{ fontSize: 18, fontWeight: 800 }}>{charData.story}</div>
              </div>
            </div>
            <div style={{ color: "#94a3b8", fontSize: 14, marginBottom: 16 }}>{charData.desc}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ background: `${charData.color}20`, border: `1px solid ${charData.color}40`, borderRadius: 20, padding: "6px 14px", fontSize: 12, color: charData.color, fontWeight: 600 }}>
                +{charData.xp} XP
              </div>
              <div style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", borderRadius: 12, padding: "10px 20px", fontSize: 14, fontWeight: 700, color: "#fff" }}>
                Start Episode →
              </div>
            </div>
          </div>
        </div>

        {/* All characters */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, color: "#64748b", fontWeight: 600, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>All Characters</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {CHARACTERS.filter(c => c.name !== character).map(c => (
              <div key={c.name} onClick={() => navigate("/LCStories")} style={{
                background: "#16162a", border: `1px solid ${c.color}30`,
                borderRadius: 16, padding: "16px 14px", cursor: "pointer",
              }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{c.emoji}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: c.color }}>{c.name}</div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>{c.story}</div>
                <div style={{ fontSize: 11, color: "#a78bfa", marginTop: 8 }}>+{c.xp} XP</div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily challenges */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, color: "#64748b", fontWeight: 600, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>Daily Challenges</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {DAILY_CHALLENGES.map((ch, i) => (
              <div key={i} style={{ background: "#16162a", border: "1px solid #2d2d4e", borderRadius: 14, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ fontSize: 24 }}>{ch.emoji}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{ch.title}</div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>{ch.desc}</div>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "#a78bfa", fontWeight: 700, whiteSpace: "nowrap" }}>+{ch.xp} XP</div>
              </div>
            ))}
          </div>
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
            <div style={{ fontSize: 10, color: window.location.pathname === n.path ? "#a855f7" : "#475569", marginTop: 4, fontWeight: 600 }}>{n.label}</div>
          </div>
        ))}
      </div>
      <div style={{ height: 80 }} />
    </div>
  );
}
