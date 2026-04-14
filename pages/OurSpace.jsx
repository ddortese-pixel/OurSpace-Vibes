import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OS2_ICON = "https://media.base44.com/images/public/69d9b8416964fe31ae3f9932/7bbdaee82_generated_image.png";

export default function OurSpace() {
  const navigate = useNavigate();

  useEffect(() => {
    // Set favicon + title
    let link = document.querySelector("link[rel~='icon']");
    if (!link) { link = document.createElement("link"); link.rel = "icon"; document.head.appendChild(link); }
    link.href = OS2_ICON;
    document.title = "OurSpace 2.0";

    // If already logged in, go straight to feed
    try {
      const email = localStorage.getItem("os2_email");
      if (email) { navigate("/Home"); return; }
    } catch(e) {}
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0d0d1a",
      color: "#f0f0f0",
      fontFamily: "'Segoe UI', sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "32px 24px",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Background glow orbs */}
      <div style={{ position:"absolute", top:-100, left:-100, width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,#c084fc22,transparent 70%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:-100, right:-100, width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,#22d3ee22,transparent 70%)", pointerEvents:"none" }} />

      {/* Logo */}
      <div style={{
        width: 90, height: 90, borderRadius: "50%",
        background: "linear-gradient(135deg,#c084fc,#22d3ee)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 40, marginBottom: 20, boxShadow: "0 0 40px #c084fc44",
      }}>
        🌌
      </div>

      {/* Brand */}
      <div style={{
        fontSize: 36, fontWeight: 900, marginBottom: 8,
        background: "linear-gradient(90deg,#c084fc,#22d3ee)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        letterSpacing: -1,
      }}>
        OurSpace 2.0
      </div>

      <div style={{ color: "#64748b", fontSize: 16, marginBottom: 10, maxWidth: 300, lineHeight: 1.6 }}>
        Your space. Your vibe. Your people.
      </div>

      <div style={{
        display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center",
        marginBottom: 36, color: "#475569", fontSize: 13,
      }}>
        <span>📝 Posts & Stories</span>
        <span>👥 Friend Connect</span>
        <span>✉️ Messaging</span>
        <span>🔍 Discover</span>
      </div>

      {/* CTA buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 320 }}>
        <button onClick={() => navigate("/OurSpaceOnboarding")}
          style={{
            padding: "16px 32px",
            background: "linear-gradient(135deg,#c084fc,#22d3ee)",
            border: "none", borderRadius: 16,
            color: "#000", fontWeight: 900, fontSize: 18,
            cursor: "pointer", boxShadow: "0 4px 20px #c084fc44",
          }}>
          Join Free →
        </button>
        <button onClick={() => navigate("/Home")}
          style={{
            padding: "14px 32px",
            background: "transparent",
            border: "1px solid #2a2a45", borderRadius: 16,
            color: "#94a3b8", fontWeight: 600, fontSize: 15,
            cursor: "pointer",
          }}>
          Browse as Guest
        </button>
      </div>

      {/* Legal links */}
      <div style={{ marginTop: 40, display: "flex", gap: 20, fontSize: 12, color: "#334155" }}>
        <span onClick={() => navigate("/OurSpacePrivacyPolicy")} style={{ cursor:"pointer" }}>Privacy Policy</span>
        <span onClick={() => navigate("/TermsOfService")} style={{ cursor:"pointer" }}>Terms</span>
        <span onClick={() => navigate("/ContentPolicy")} style={{ cursor:"pointer" }}>Content Policy</span>
      </div>

      {/* Separator — Legacy Circle link */}
      <div style={{ marginTop: 32, padding: "16px 24px", background: "#16162a", borderRadius: 14, border: "1px solid #2a2a45", maxWidth: 320, width: "100%" }}>
        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>Looking for the kids app?</div>
        <button onClick={() => navigate("/LCSplashScreen")}
          style={{
            width: "100%", padding: "10px",
            background: "linear-gradient(135deg,#ffc400,#ff6b00)",
            border: "none", borderRadius: 12,
            color: "#000", fontWeight: 800, fontSize: 14, cursor: "pointer",
          }}>
          🌟 The Legacy Circle
        </button>
      </div>
    </div>
  );
}
