import { useState } from "react";
import { useNavigate } from "react-router-dom";

const apps = [
  {
    name: "The Legacy Circle",
    emoji: "🛡️",
    color: "#f59e0b",
    gradient: "linear-gradient(135deg,#1a1a3e,#2d1b69)",
    checklist: [
      { done: true,  item: "Privacy Policy (COPPA Compliant)" },
      { done: true,  item: "Terms of Service" },
      { done: true,  item: "Content Moderation Policy" },
      { done: true,  item: "App Icon (1024×1024)" },
      { done: true,  item: "Splash Screen" },
      { done: true,  item: "App Store Listing Copy" },
      { done: true,  item: "App Store Screenshots" },
      { done: true,  item: "Google Play Feature Graphic" },
      { done: true,  item: "Launch Tracker (milestone management)" },
      { done: true,  item: "GitHub Repository (ddortese-pixel/Legacy-Circle)" },
      { done: true,  item: "Google Analytics (G-HEWR0ZB5G8)" },
      { done: true,  item: "Automated System Diagnostics" },
      { done: false, item: "Capacitor Native Build (iOS + Android)" },
      { done: false, item: "Push Notifications (Firebase / APNs)" },
      { done: false, item: "Beta Test with Real Users (TestFlight / Play Console)" },
      { done: false, item: "Apple Developer Account ($99/yr)" },
      { done: false, item: "Google Play Developer Account ($25 one-time)" },
      { done: false, item: "App Store submission & review" },
    ],
    assets: [
      { label: "App Icon", url: "https://media.base44.com/images/public/69d9b8416964fe31ae3f9932/f199871d3_generated_image.png" },
      { label: "Splash Screen", url: "https://media.base44.com/images/public/69d9b8416964fe31ae3f9932/adc11af19_copilot_image_1775430901724.jpg" },
      { label: "App Store Screenshot 1", url: "https://media.base44.com/images/public/69d9b8416964fe31ae3f9932/142e00b54_generated_image.png" },
      { label: "App Store Screenshot 2", url: "https://media.base44.com/images/public/69d9b8416964fe31ae3f9932/446d12381_generated_image.png" },
    ],
    nextSteps: [
      "Hire Capacitor developer ($200–$500) on Upwork or Fiverr",
      "Create Apple Developer & Google Play accounts",
      "Build native iOS/Android apps using Capacitor",
      "Run TestFlight beta with 10–20 users",
      "Submit to App Store and Google Play for review",
    ],
  },
  {
    name: "OurSpace 2.0",
    emoji: "🌐",
    color: "#22d3ee",
    gradient: "linear-gradient(135deg,#0d0d1a,#1a0533)",
    checklist: [
      { done: true,  item: "Privacy Policy (GDPR / CCPA / COPPA Compliant)" },
      { done: true,  item: "Terms of Service" },
      { done: true,  item: "Content Moderation Policy" },
      { done: true,  item: "Age Verification Gate (13+, parental consent for under 18)" },
      { done: true,  item: "Onboarding Flow (multi-step, theme picker)" },
      { done: true,  item: "App Icon (1024×1024)" },
      { done: true,  item: "Splash / Landing Page" },
      { done: true,  item: "App Store Screenshots" },
      { done: true,  item: "Google Play Feature Graphic" },
      { done: true,  item: "Home Feed (chronological, infinite scroll)" },
      { done: true,  item: "Stories (create, view, expiry cleanup)" },
      { done: true,  item: "Discover (people + posts search)" },
      { done: true,  item: "Messaging (E2EE DMs)" },
      { done: true,  item: "Profiles (customizable, wall, friends)" },
      { done: true,  item: "Notifications (likes, comments, friends, wall)" },
      { done: true,  item: "Settings (persistent, privacy, notifications)" },
      { done: true,  item: "Content Reporting & Moderation Queue" },
      { done: true,  item: "Human-Only Filter toggle" },
      { done: true,  item: "Demo Content (seed posts, profiles, stories)" },
      { done: true,  item: "GitHub Repository (ddortese-pixel/Legacy-Circle)" },
      { done: true,  item: "Google Analytics (G-1N8GD2WM6L)" },
      { done: true,  item: "Automated System Diagnostics (4x/day)" },
      { done: false, item: "Capacitor Native Build (iOS + Android)" },
      { done: false, item: "Push Notifications (Firebase / APNs)" },
      { done: false, item: "Beta Test with Real Users" },
      { done: false, item: "Apple Developer Account ($99/yr)" },
      { done: false, item: "Google Play Developer Account ($25 one-time)" },
      { done: false, item: "App Store submission & review" },
    ],
    assets: [
      { label: "App Icon", url: "https://media.base44.com/images/public/69d9b8416964fe31ae3f9932/7bbdaee82_generated_image.png" },
      { label: "Feed Screenshot", url: "https://media.base44.com/images/public/69d9b8416964fe31ae3f9932/47fdb6e27_generated_image.png" },
      { label: "Profile Screenshot", url: "https://media.base44.com/images/public/69d9b8416964fe31ae3f9932/f4ad48ef8_generated_image.png" },
      { label: "Messaging Screenshot", url: "https://media.base44.com/images/public/69d9b8416964fe31ae3f9932/e269fc788_generated_image.png" },
      { label: "Google Play Banner", url: "https://media.base44.com/images/public/69d9b8416964fe31ae3f9932/d437d1242_generated_image.png" },
    ],
    nextSteps: [
      "Hire Capacitor developer ($200–$500) on Upwork or Fiverr",
      "Create Apple Developer & Google Play accounts",
      "Build native iOS/Android apps using Capacitor",
      "Enable push notifications via Firebase Cloud Messaging",
      "Run beta with real users, fix feedback",
      "Submit to App Store and Google Play for review",
    ],
  },
];

export default function AppStoreReadiness() {
  const [activeApp, setActiveApp] = useState(0);
  const [showAssets, setShowAssets] = useState(false);
  const navigate = useNavigate();
  const app = apps[activeApp];
  const done = app.checklist.filter(i => i.done).length;
  const total = app.checklist.length;
  const pct = Math.round((done / total) * 100);

  const getStatus = () => {
    if (pct >= 90) return { label: "Nearly Ready 🚀", color: "#4ade80" };
    if (pct >= 70) return { label: "Good Progress ⚡", color: "#facc15" };
    if (pct >= 50) return { label: "In Progress 🔨", color: "#f97316" };
    return { label: "Getting Started 🌱", color: "#94a3b8" };
  };
  const status = getStatus();

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a14", color: "#f0f0f0", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg,#0f0f1e,#1a1a3e)", padding: "28px 20px 24px", textAlign: "center", borderBottom: "1px solid #1e1e35", position: "relative" }}>
        <button onClick={() => navigate(-1)} style={{ position: "absolute", top: 16, left: 16, background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 20, color: "#94a3b8", padding: "6px 14px", cursor: "pointer", fontSize: 13 }}>← Back</button>
        <div style={{ fontSize: 36, marginBottom: 6 }}>📱</div>
        <h1 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 4px" }}>App Store Readiness</h1>
        <p style={{ color: "#64748b", margin: 0, fontSize: 13 }}>Track both apps' path to the stores</p>
      </div>

      {/* App switcher */}
      <div style={{ display: "flex", gap: 10, padding: "20px 16px 8px", maxWidth: 720, margin: "0 auto" }}>
        {apps.map((a, i) => (
          <button key={i} onClick={() => { setActiveApp(i); setShowAssets(false); }}
            style={{ flex: 1, padding: "13px 10px", borderRadius: 14, border: `2px solid ${activeApp === i ? a.color : "#2a2a45"}`, background: activeApp === i ? `${a.color}18` : "#13132b", color: activeApp === i ? a.color : "#64748b", cursor: "pointer", fontWeight: 700, fontSize: 14 }}>
            {a.emoji} {a.name}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "8px 16px 40px" }}>

        {/* Score card */}
        <div style={{ background: app.gradient, borderRadius: 18, padding: "22px 20px", marginBottom: 18, border: `1px solid ${app.color}20` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>Progress</div>
              <div style={{ fontSize: 48, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{pct}<span style={{ fontSize: 20, opacity: 0.7 }}>%</span></div>
              <div style={{ marginTop: 8, display: "inline-block", background: status.color + "25", color: status.color, borderRadius: 20, padding: "4px 14px", fontSize: 13, fontWeight: 700 }}>{status.label}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>Completed</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: "#fff" }}>{done}/{total}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>checklist items</div>
            </div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 99, height: 10, overflow: "hidden" }}>
            <div style={{ background: app.color, borderRadius: 99, height: 10, width: `${pct}%`, transition: "width 0.6s ease" }} />
          </div>
        </div>

        {/* Checklist */}
        <div style={{ background: "#13132b", borderRadius: 16, border: "1px solid #1e1e3a", overflow: "hidden", marginBottom: 16 }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid #1e1e3a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>📋 Submission Checklist</span>
            <span style={{ color: "#64748b", fontSize: 13 }}>{done} of {total}</span>
          </div>
          {app.checklist.map((item, i) => (
            <div key={i} style={{ padding: "11px 18px", borderBottom: i < app.checklist.length - 1 ? "1px solid #1e1e3a" : "none", display: "flex", alignItems: "center", gap: 12, background: item.done ? "transparent" : "transparent" }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{item.done ? "✅" : "⬜"}</span>
              <span style={{ fontSize: 14, color: item.done ? "#cbd5e1" : "#64748b" }}>{item.item}</span>
            </div>
          ))}
        </div>

        {/* Next Steps */}
        <div style={{ background: "#13132b", borderRadius: 16, border: `1px solid ${app.color}25`, padding: 18, marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: app.color, marginBottom: 12 }}>🚀 Next Steps to Ship</div>
          <ol style={{ margin: 0, paddingLeft: 20 }}>
            {app.nextSteps.map((step, i) => (
              <li key={i} style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.9 }}>{step}</li>
            ))}
          </ol>
        </div>

        {/* Assets */}
        <div style={{ background: "#13132b", borderRadius: 16, border: "1px solid #1e1e3a", overflow: "hidden" }}>
          <button onClick={() => setShowAssets(!showAssets)}
            style={{ width: "100%", padding: "14px 18px", background: "none", border: "none", color: "#f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", fontSize: 15, fontWeight: 700 }}>
            <span>🎨 Visual Assets ({app.assets.length})</span>
            <span style={{ color: app.color, fontSize: 18, transform: showAssets ? "rotate(180deg)" : "none", transition: "transform 0.2s", display: "inline-block" }}>⌄</span>
          </button>
          {showAssets && (
            <div style={{ padding: "0 14px 14px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10 }}>
              {app.assets.map((asset, i) => (
                <a key={i} href={asset.url} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                  <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid #1e1e3a" }}>
                    <img src={asset.url} alt={asset.label} style={{ width: "100%", height: 110, objectFit: "cover", display: "block" }} onError={e => e.target.style.display = "none"} />
                    <div style={{ padding: "6px 10px", fontSize: 11, color: "#64748b", background: "#0d0d1a" }}>{asset.label}</div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: 24, color: "#2a2a45", fontSize: 11 }}>
          Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </div>
      </div>
    </div>
  );
}
