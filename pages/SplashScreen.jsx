import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LC_ICON = "https://media.base44.com/images/public/69d9b8416964fe31ae3f9932/f199871d3_generated_image.png";

function injectGA(measurementId) {
  if (document.getElementById(`ga-${measurementId}`)) return;
  const script1 = document.createElement("script");
  script1.id = `ga-${measurementId}`;
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);
  const script2 = document.createElement("script");
  script2.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","${measurementId}");`;
  document.head.appendChild(script2);
}

function injectAppMeta(iconUrl, appName) {
  // Favicon
  let link = document.querySelector("link[rel~='icon']");
  if (!link) { link = document.createElement("link"); link.rel = "icon"; document.head.appendChild(link); }
  link.href = iconUrl;
  // Apple touch icon
  let apple = document.querySelector("link[rel='apple-touch-icon']");
  if (!apple) { apple = document.createElement("link"); apple.rel = "apple-touch-icon"; document.head.appendChild(apple); }
  apple.href = iconUrl;
  // Title
  document.title = appName;
  // OG meta
  let ogImg = document.querySelector("meta[property='og:image']");
  if (!ogImg) { ogImg = document.createElement("meta"); ogImg.setAttribute("property","og:image"); document.head.appendChild(ogImg); }
  ogImg.setAttribute("content", iconUrl);
  let ogTitle = document.querySelector("meta[property='og:title']");
  if (!ogTitle) { ogTitle = document.createElement("meta"); ogTitle.setAttribute("property","og:title"); document.head.appendChild(ogTitle); }
  ogTitle.setAttribute("content", appName);
}

export default function SplashScreen() {
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    injectGA("G-HEWR0ZB5G8");
    injectAppMeta(LC_ICON, "The Legacy Circle");
    const fadeTimer = setTimeout(() => setFadeOut(true), 3200);
    const navTimer = setTimeout(() => navigate("/Home"), 4000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(navTimer);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0a",
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.8s ease-in-out",
        overflow: "hidden"
      }}
    >
      {/* Full background image */}
      <img
        src="https://media.base44.com/images/public/69d9b8416964fe31ae3f9932/adc11af19_copilot_image_1775430901724.jpg"
        alt="The Legacy Circle"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center top"
        }}
      />

      {/* App Icon top-center */}
      <div style={{ position:"absolute", top:48, zIndex:10, textAlign:"center" }}>
        <img src={LC_ICON} alt="Legacy Circle Icon"
          style={{ width:100, height:100, borderRadius:22, boxShadow:"0 8px 32px rgba(245,158,11,0.5)", border:"2px solid rgba(253,230,138,0.4)" }} />
      </div>

      {/* Overlay gradient at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "40%",
          background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)"
        }}
      />

      {/* App name at bottom */}
      <div style={{ position: "absolute", bottom: 48, textAlign: "center", zIndex: 10 }}>
        <h1
          style={{
            fontSize: 36,
            fontWeight: 900,
            margin: 0,
            background: "linear-gradient(90deg, #f59e0b, #fde68a, #f59e0b)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontFamily: "'Georgia', serif",
            letterSpacing: 2
          }}
        >
          THE LEGACY CIRCLE
        </h1>
        <p style={{ color: "#fde68a", fontSize: 13, marginTop: 6, letterSpacing: 3, textTransform: "uppercase", opacity: 0.85 }}>
          Courage · Curiosity · Creativity · Unity
        </p>
        <div style={{ marginTop: 24, display: "flex", justifyContent: "center", gap: 8 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: "50%", background: "#f59e0b",
              animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`
            }} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
