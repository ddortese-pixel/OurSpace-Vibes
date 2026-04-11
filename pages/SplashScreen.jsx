import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 3200);
    const hideTimer = setTimeout(() => setVisible(false), 4000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

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
      <div
        style={{
          position: "absolute",
          bottom: 48,
          textAlign: "center",
          zIndex: 10
        }}
      >
        <h1
          style={{
            fontSize: 36,
            fontWeight: 900,
            margin: 0,
            background: "linear-gradient(90deg, #f59e0b, #fde68a, #f59e0b)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontFamily: "'Georgia', serif",
            letterSpacing: 2,
            textShadow: "none"
          }}
        >
          THE LEGACY CIRCLE
        </h1>
        <p
          style={{
            color: "#fde68a",
            fontSize: 13,
            marginTop: 6,
            letterSpacing: 3,
            textTransform: "uppercase",
            opacity: 0.85
          }}
        >
          Courage · Curiosity · Creativity · Unity
        </p>

        {/* Loading dots */}
        <div style={{ marginTop: 24, display: "flex", justifyContent: "center", gap: 8 }}>
          {[0, 1, 2].map(i => (
            <div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#f59e0b",
                animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`
              }}
            />
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
