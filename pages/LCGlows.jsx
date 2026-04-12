import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GLOW_EMOJIS = ["💛", "💜", "❤️", "💚", "🌟", "🎉", "🔥", "🤝", "🙌", "✨"];
const GLOW_PROMPTS = [
  "You're doing amazing!",
  "Your story choices were so thoughtful!",
  "Keep going — you're a Legacy Leader!",
  "I love your curiosity!",
  "You inspire me to keep learning!",
  "Your kindness makes this community better!",
];

export default function LCGlows() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("send");
  const [toName, setToName] = useState("");
  const [message, setMessage] = useState("");
  const [emoji, setEmoji] = useState("💛");
  const [sent, setSent] = useState(false);
  const [glows, setGlows] = useState([]);
  const fromName = localStorage.getItem("lc_name") || "Learner";
  const s = { fontFamily: "sans-serif" };

  useEffect(() => {
    // Load sent glows from localStorage
    const saved = JSON.parse(localStorage.getItem("lc_glows_sent") || "[]");
    setGlows(saved);
  }, []);

  function sendGlow() {
    if (!toName || !message) return;
    const glow = { toName, message, emoji, fromName, time: new Date().toISOString() };
    const updated = [glow, ...glows];
    setGlows(updated);
    localStorage.setItem("lc_glows_sent", JSON.stringify(updated.slice(0, 20)));
    const xp = parseInt(localStorage.getItem("lc_xp") || "0") + 10;
    localStorage.setItem("lc_xp", xp);
    setSent(true);
    setTimeout(() => { setSent(false); setToName(""); setMessage(""); setEmoji("💛"); }, 2500);
  }

  return (
    <div style={{ ...s, minHeight: "100vh", background: "#0a0a1a", color: "#fff" }}>
      <div style={{ background: "#16162a", padding: "20px 20px 0", borderBottom: "1px solid #2d2d4e" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 20, fontWeight: 800 }}>💌 Glow Messages</div>
            <button onClick={() => navigate("/LCHome")} style={{ background: "none", border: "none", color: "#a78bfa", fontSize: 13, cursor: "pointer" }}>← Home</button>
          </div>
          <div style={{ display: "flex", gap: 0 }}>
            {["send", "history"].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex: 1, background: "none", border: "none", borderBottom: `2px solid ${tab === t ? "#a855f7" : "transparent"}`,
                color: tab === t ? "#a855f7" : "#475569", fontSize: 14, fontWeight: 600, padding: "10px 0", cursor: "pointer",
              }}>{t === "send" ? "Send a Glow" : "My Glows"}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "20px 16px" }}>
        {tab === "send" && (
          <div>
            <div style={{ background: "#16162a", borderRadius: 16, padding: "20px", marginBottom: 20, border: "1px solid #7c3aed30" }}>
              <div style={{ fontSize: 13, color: "#a78bfa", fontWeight: 600, marginBottom: 4 }}>✨ WHAT IS A GLOW?</div>
              <div style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.5 }}>
                A Glow is a kind, encouraging message you send to a fellow learner. Every Glow you send earns you +10 XP and makes someone's day brighter!
              </div>
            </div>

            {sent ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: 64 }}>🌟</div>
                <div style={{ fontSize: 20, fontWeight: 800, marginTop: 12 }}>Glow Sent!</div>
                <div style={{ color: "#a78bfa", marginTop: 8 }}>+10 XP earned</div>
              </div>
            ) : (
              <div>
                <label style={{ color: "#a78bfa", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>SEND TO</label>
                <input
                  value={toName} onChange={e => setToName(e.target.value)}
                  placeholder="Learner's name..."
                  style={{ width: "100%", background: "#0d0d1a", border: "1px solid #2d2d4e", borderRadius: 12, padding: "14px 16px", color: "#fff", fontSize: 15, boxSizing: "border-box", marginBottom: 16 }}
                />

                <label style={{ color: "#a78bfa", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>PICK AN EMOJI</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                  {GLOW_EMOJIS.map(e => (
                    <button key={e} onClick={() => setEmoji(e)} style={{
                      fontSize: 24, background: emoji === e ? "#2d1b69" : "#16162a",
                      border: `2px solid ${emoji === e ? "#a855f7" : "#2d2d4e"}`,
                      borderRadius: 10, padding: 8, cursor: "pointer",
                    }}>{e}</button>
                  ))}
                </div>

                <label style={{ color: "#a78bfa", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>YOUR MESSAGE</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                  {GLOW_PROMPTS.map(p => (
                    <button key={p} onClick={() => setMessage(p)} style={{
                      background: "#16162a", border: "1px solid #2d2d4e", borderRadius: 99,
                      padding: "6px 14px", color: "#94a3b8", fontSize: 12, cursor: "pointer",
                    }}>{p}</button>
                  ))}
                </div>
                <textarea
                  value={message} onChange={e => setMessage(e.target.value)}
                  placeholder="Write something kind..."
                  rows={3}
                  style={{ width: "100%", background: "#0d0d1a", border: "1px solid #2d2d4e", borderRadius: 12, padding: "14px 16px", color: "#fff", fontSize: 15, boxSizing: "border-box", resize: "none", marginBottom: 20 }}
                />

                <button onClick={sendGlow} disabled={!toName || !message} style={{
                  width: "100%", background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                  border: "none", borderRadius: 14, padding: "16px", color: "#fff",
                  fontSize: 16, fontWeight: 700, cursor: "pointer", opacity: (!toName || !message) ? 0.5 : 1,
                }}>
                  Send Glow {emoji}
                </button>
              </div>
            )}
          </div>
        )}

        {tab === "history" && (
          <div>
            {glows.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ fontSize: 48 }}>💌</div>
                <div style={{ color: "#475569", marginTop: 12 }}>No glows sent yet. Be the first to brighten someone's day!</div>
              </div>
            ) : glows.map((g, i) => (
              <div key={i} style={{ background: "#16162a", border: "1px solid #7c3aed30", borderRadius: 16, padding: "16px 18px", marginBottom: 10 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontSize: 28 }}>{g.emoji}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>To: {g.toName}</div>
                    <div style={{ fontSize: 11, color: "#475569" }}>{new Date(g.time).toLocaleDateString()}</div>
                  </div>
                </div>
                <div style={{ color: "#94a3b8", fontSize: 14 }}>{g.message}</div>
              </div>
            ))}
          </div>
        )}
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
            <div style={{ fontSize: 10, color: n.path === "/LCGlows" ? "#a855f7" : "#475569", marginTop: 4, fontWeight: 600 }}>{n.label}</div>
          </div>
        ))}
      </div>
      <div style={{ height: 80 }} />
    </div>
  );
}
