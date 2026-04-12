import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LC_ICON = "https://media.base44.com/images/public/69d9b8416964fe31ae3f9932/f199871d3_generated_image.png";
const GA_ID = "G-HEWR0ZB5G8";

function injectGA(id) {
  if (document.getElementById(`ga-${id}`)) return;
  const s1 = document.createElement("script"); s1.id = `ga-${id}`; s1.async = true;
  s1.src = `https://www.googletagmanager.com/gtag/js?id=${id}`; document.head.appendChild(s1);
  const s2 = document.createElement("script");
  s2.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","${id}");`;
  document.head.appendChild(s2);
}

const CHARACTERS = [
  { name: "Justice", emoji: "⚖️", color: "#f59e0b" },
  { name: "Lebron", emoji: "🏀", color: "#3b82f6" },
  { name: "Zara", emoji: "🌟", color: "#ec4899" },
  { name: "Eli", emoji: "🔬", color: "#10b981" },
];

export default function LCSplashScreen() {
  const [phase, setPhase] = useState("in");
  const [charIdx, setCharIdx] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    injectGA(GA_ID);
    let link = document.querySelector("link[rel~='icon']");
    if (!link) { link = document.createElement("link"); link.rel = "icon"; document.head.appendChild(link); }
    link.href = LC_ICON;
    document.title = "The Legacy Circle";

    const t1 = setTimeout(() => setPhase("hold"), 400);
    const t2 = setTimeout(() => setPhase("out"), 3200);
    const t3 = setTimeout(() => {
      const hasOnboarded = localStorage.getItem("lc_email");
      navigate(hasOnboarded ? "/LCHome" : "/LCOnboarding");
    }, 4000);

    // Cycle characters
    const charTimer = setInterval(() => setCharIdx(i => (i + 1) % CHARACTERS.length), 700);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearInterval(charTimer); };
  }, []);

  const char = CHARACTERS[charIdx];

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "radial-gradient(ellipse at 50% 35%, #1a0a2e 0%, #0a0a1a 60%, #000 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      opacity: phase === "out" ? 0 : 1,
      transform: phase === "in" ? "scale(1.05)" : "scale(1)",
      transition: phase === "out" ? "opacity 0.7s ease, transform 0.7s ease" : "opacity 0.5s ease, transform 0.5s ease",
    }}>
      {/* Stars */}
      {[...Array(20)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          width: Math.random() * 3 + 1 + "px", height: Math.random() * 3 + 1 + "px",
          borderRadius: "50%", background: "#fff",
          top: Math.random() * 100 + "%", left: Math.random() * 100 + "%",
          opacity: Math.random() * 0.6 + 0.2,
        }} />
      ))}

      {/* App Icon */}
      <div style={{
        width: 120, height: 120, borderRadius: 28,
        background: "linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 56, marginBottom: 20,
        boxShadow: "0 0 40px #a855f760",
      }}>
        📚
      </div>

      <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", marginBottom: 6, fontFamily: "sans-serif" }}>
        The Legacy Circle
      </div>
      <div style={{ fontSize: 14, color: "#a78bfa", marginBottom: 32, fontFamily: "sans-serif" }}>
        Learn · Grow · Lead
      </div>

      {/* Character cycling */}
      <div style={{
        display: "flex", gap: 16, alignItems: "center",
        transition: "all 0.3s ease",
      }}>
        {CHARACTERS.map((c, i) => (
          <div key={c.name} style={{
            fontSize: i === charIdx ? 32 : 20,
            opacity: i === charIdx ? 1 : 0.35,
            transition: "all 0.3s ease",
            filter: i === charIdx ? `drop-shadow(0 0 8px ${c.color})` : "none",
          }}>
            {c.emoji}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 10, fontSize: 13, color: char.color, fontFamily: "sans-serif", fontWeight: 600, transition: "color 0.3s" }}>
        {char.name}
      </div>

      {/* Loading dots */}
      <div style={{ position: "absolute", bottom: 60, display: "flex", gap: 8 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "#a855f7", opacity: 0.6,
            animation: `pulse 1.2s ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.2)} }`}</style>
    </div>
  );
}
