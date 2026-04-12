import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OS2_ICON = "https://media.base44.com/images/public/69d9b8416964fe31ae3f9932/7bbdaee82_generated_image.png";

function injectGA(id) {
  if (document.getElementById(`ga-${id}`)) return;
  const s1 = document.createElement("script"); s1.id = `ga-${id}`; s1.async = true;
  s1.src = `https://www.googletagmanager.com/gtag/js?id=${id}`; document.head.appendChild(s1);
  const s2 = document.createElement("script");
  s2.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","${id}");`;
  document.head.appendChild(s2);
}

export default function SplashScreen() {
  const [phase, setPhase] = useState("in"); // in → hold → out
  const navigate = useNavigate();

  useEffect(() => {
    injectGA("G-1N8GD2WM6L");
    let link = document.querySelector("link[rel~='icon']");
    if (!link) { link = document.createElement("link"); link.rel = "icon"; document.head.appendChild(link); }
    link.href = OS2_ICON;
    document.title = "OurSpace 2.0";
    const t1 = setTimeout(() => setPhase("hold"), 400);
    const t2 = setTimeout(() => setPhase("out"), 2800);
    const t3 = setTimeout(() => {
      const hasOnboarded = localStorage.getItem("os2_email");
      navigate(hasOnboarded ? "/Home" : "/OurSpaceOnboarding");
    }, 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "radial-gradient(ellipse at 50% 40%, #2a0a4a 0%, #0d0d1a 60%, #000 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      opacity: phase === "out" ? 0 : 1,
      transform: phase === "in" ? "scale(1.04)" : "scale(1)",
      transition: phase === "out" ? "opacity 0.7s ease-in-out, transform 0.7s" : "opacity 0.4s, transform 0.4s",
    }}>
      {/* Ambient glow */}
      <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, #c084fc30 0%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none" }} />

      {/* Icon */}
      <div style={{
        width: 110, height: 110, borderRadius: 28, overflow: "hidden",
        boxShadow: "0 0 60px #c084fc60, 0 20px 60px #00000080",
        border: "2px solid rgba(192,132,252,0.4)",
        marginBottom: 24,
        transform: phase === "hold" ? "scale(1)" : "scale(0.85)",
        transition: "transform 0.5s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
        <img src={OS2_ICON} alt="OurSpace 2.0" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      {/* Wordmark */}
      <h1 style={{
        fontSize: 36, fontWeight: 900, margin: "0 0 8px", letterSpacing: -0.5,
        background: "linear-gradient(90deg, #c084fc, #ffffff, #22d3ee)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        opacity: phase === "in" ? 0 : 1, transform: phase === "in" ? "translateY(12px)" : "translateY(0)",
        transition: "opacity 0.5s 0.15s, transform 0.5s 0.15s",
      }}>OurSpace 2.0</h1>

      <p style={{
        color: "rgba(148,163,184,0.8)", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 32px",
        opacity: phase === "in" ? 0 : 1, transform: phase === "in" ? "translateY(8px)" : "translateY(0)",
        transition: "opacity 0.5s 0.25s, transform 0.5s 0.25s",
      }}>Your Space. No Algorithms.</p>

      {/* User count badge */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        background: "rgba(192,132,252,0.12)", border: "1px solid rgba(192,132,252,0.25)",
        borderRadius: 24, padding: "8px 18px",
        opacity: phase === "in" ? 0 : 1,
        transition: "opacity 0.5s 0.4s",
      }}>
        <div style={{ display: "flex" }}>
          {["#f59e0b","#22d3ee","#c084fc","#4ade80"].map((c, i) => (
            <div key={i} style={{ width: 20, height: 20, borderRadius: "50%", background: c, marginLeft: i === 0 ? 0 : -6, border: "2px solid #0d0d1a", fontSize: 9, display: "flex", alignItems: "center", justifyContent: "center", color: "#000", fontWeight: 700 }}>
              {["J","M","S","A"][i]}
            </div>
          ))}
        </div>
        <span style={{ color: "#c084fc", fontSize: 13, fontWeight: 700 }}>10,000+ members</span>
      </div>

      {/* Loading bar */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "#1e1e3a", overflow: "hidden" }}>
        <div style={{
          height: "100%", background: "linear-gradient(90deg,#c084fc,#22d3ee)",
          width: phase === "hold" || phase === "out" ? "100%" : "0%",
          transition: "width 2.4s ease-in-out",
          borderRadius: "0 2px 2px 0",
        }} />
      </div>
    </div>
  );
}
