import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LC_ICON = "https://media.base44.com/images/public/69d9b8416964fe31ae3f9932/f199871d3_generated_image.png";
const LC_SPLASH = "https://media.base44.com/images/public/69d9b8416964fe31ae3f9932/adc11af19_copilot_image_1775430901724.jpg";

function injectGA(id) {
  if (document.getElementById(`ga-${id}`)) return;
  const s1 = document.createElement("script"); s1.id = `ga-${id}`; s1.async = true;
  s1.src = `https://www.googletagmanager.com/gtag/js?id=${id}`; document.head.appendChild(s1);
  const s2 = document.createElement("script");
  s2.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","${id}");`;
  document.head.appendChild(s2);
}

export default function SplashScreen() {
  const [phase, setPhase] = useState("show"); // show → fadeOut → done
  const navigate = useNavigate();

  useEffect(() => {
    injectGA("G-HEWR0ZB5G8");
    // Set meta for Legacy Circle
    let link = document.querySelector("link[rel~='icon']");
    if (!link) { link = document.createElement("link"); link.rel = "icon"; document.head.appendChild(link); }
    link.href = LC_ICON;
    document.title = "The Legacy Circle";

    const t1 = setTimeout(() => setPhase("fadeOut"), 3000);
    const t2 = setTimeout(() => navigate("/LaunchTracker"), 3800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999, overflow: "hidden",
      background: "#0a0a0a",
      opacity: phase === "fadeOut" ? 0 : 1,
      transition: "opacity 0.8s ease-in-out",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    }}>
      {/* Background image */}
      <img src={LC_SPLASH} alt="The Legacy Circle"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
        onError={e => e.target.style.display = "none"}
      />

      {/* Top overlay */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "30%", background: "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)" }} />

      {/* App icon — top center */}
      <div style={{ position: "absolute", top: 52, zIndex: 10, textAlign: "center" }}>
        <img src={LC_ICON} alt="Legacy Circle Icon"
          style={{ width: 96, height: 96, borderRadius: 22, boxShadow: "0 8px 40px rgba(245,158,11,0.55)", border: "2px solid rgba(253,230,138,0.4)" }}
          onError={e => e.target.style.display = "none"}
        />
      </div>

      {/* Bottom gradient */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "45%", background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)" }} />

      {/* Bottom content */}
      <div style={{ position: "absolute", bottom: 52, textAlign: "center", zIndex: 10, padding: "0 24px" }}>
        <h1 style={{
          fontSize: 34, fontWeight: 900, margin: "0 0 6px",
          background: "linear-gradient(90deg,#f59e0b,#fde68a,#f59e0b)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          fontFamily: "'Georgia', serif", letterSpacing: 2,
        }}>THE LEGACY CIRCLE</h1>
        <p style={{ color: "#fde68a", fontSize: 12, margin: "0 0 24px", letterSpacing: 3, textTransform: "uppercase", opacity: 0.85 }}>
          Courage · Curiosity · Creativity · Unity
        </p>
        {/* Loading dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: "50%", background: "#f59e0b",
              animation: `lcPulse 1.2s ease-in-out ${i * 0.2}s infinite`,
            }} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes lcPulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
