import { useState } from "react";

const apps = [
  {
    name: "The Legacy Circle",
    emoji: "🛡️",
    color: "#a78bfa",
    gradient: "linear-gradient(135deg, #1a1a3e, #2d1b69)",
    score: 7,
    status: "Nearly Ready",
    statusColor: "#f59e0b",
    checklist: [
      { done: true, item: "Privacy Policy (COPPA Compliant)" },
      { done: true, item: "Terms of Service" },
      { done: true, item: "Content Moderation Policy" },
      { done: true, item: "Age Verification & Parental Consent Flow" },
      { done: true, item: "App Icon (1024x1024)" },
      { done: true, item: "Splash Screen" },
      { done: true, item: "App Store Screenshots (5)" },
      { done: true, item: "Google Play Feature Graphic" },
      { done: true, item: "Marketplace Item Images" },
      { done: true, item: "Seasonal Events Active" },
      { done: true, item: "GitHub Repository" },
      { done: false, item: "Capacitor Native Build (iOS + Android)" },
      { done: false, item: "Push Notifications (Firebase/APNs)" },
      { done: false, item: "Beta Test with Real Users" },
      { done: false, item: "Apple Developer Account ($99/yr)" },
      { done: false, item: "Google Play Developer Account ($25 one-time)" },
    ],
    assets: [
      { label: "App Icon", url: "https://media.base44.com/images/public/69d9b8416964fe31ae3f9932/7bbdaee82_generated_image.png" },
      { label: "Splash Screen", url: "https://media.base44.com/images/public/69d9b8416964fe31ae3f9932/446d12381_generated_image.png" },
      { label: "Character Guides Screenshot", url: "https://media.base44.com/images/public/69d9b8416964fe31ae3f9932/142e00b54_generated_image.png" },
    ]
  },
  {
    name: "OurSpace 2.0",
    emoji: "🌐",
    color: "#22d3ee",
    gradient: "linear-gradient(135deg, #1a0533, #0d1b4a)",
    score: 6,
    status: "In Progress",
    statusColor: "#f97316",
    checklist: [
      { done: true, item: "Privacy Policy" },
      { done: true, item: "Terms of Service" },
      { done: true, item: "Content Moderation Policy" },
      { done: true, item: "App Icon (1024x1024)" },
      { done: true, item: "Splash Screen" },
      { done: true, item: "App Store Screenshots (4)" },
      { done: true, item: "Google Play Feature Graphic" },
      { done: true, item: "GitHub Repository" },
      { done: true, item: "ReportedContent Moderation Entity" },
      { done: false, item: "Seed Demo Profiles & Posts" },
      { done: false, item: "Age Verification Gate (12+)" },
      { done: false, item: "Onboarding Flow" },
      { done: false, item: "Capacitor Native Build (iOS + Android)" },
      { done: false, item: "Push Notifications (Firebase/APNs)" },
      { done: false, item: "Human Verification Backend Logic" },
      { done: false, item: "Apple Developer Account ($99/yr)" },
      { done: false, item: "Google Play Developer Account ($25 one-time)" },
    ],
    assets: [
      { label: "App Icon", url: "https://media.base44.com/images/public/69d9b8416964fe31ae3f9932/7bbdaee82_generated_image.png" },
      { label: "Splash Screen", url: "https://media.base44.com/images/public/69d9b8416964fe31ae3f9932/446d12381_generated_image.png" },
      { label: "Profile Screenshot", url: "https://media.base44.com/images/public/69d9b8416964fe31ae3f9932/f4ad48ef8_generated_image.png" },
      { label: "Feed Screenshot", url: "https://media.base44.com/images/public/69d9b8416964fe31ae3f9932/47fdb6e27_generated_image.png" },
      { label: "Messaging Screenshot", url: "https://media.base44.com/images/public/69d9b8416964fe31ae3f9932/e269fc788_generated_image.png" },
      { label: "Reels Screenshot", url: "https://media.base44.com/images/public/69d9b8416964fe31ae3f9932/7c6a58282_generated_image.png" },
      { label: "Google Play Banner", url: "https://media.base44.com/images/public/69d9b8416964fe31ae3f9932/d437d1242_generated_image.png" },
    ]
  }
];

export default function AppStoreReadiness() {
  const [activeApp, setActiveApp] = useState(0);
  const [showAssets, setShowAssets] = useState(false);
  const app = apps[activeApp];
  const done = app.checklist.filter(i => i.done).length;
  const total = app.checklist.length;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a14", color: "#f0f0f0", fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0f0f1e, #1a1a3e)", padding: "32px 24px", textAlign: "center", borderBottom: "1px solid #1e1e35" }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>📱</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, color: "#f0f0f0" }}>App Store Readiness</h1>
        <p style={{ color: "#64748b", marginTop: 6, fontSize: 14 }}>Track submission progress for both apps</p>
      </div>

      {/* App Switcher */}
      <div style={{ display: "flex", gap: 12, padding: "20px 16px", maxWidth: 720, margin: "0 auto" }}>
        {apps.map((a, i) => (
          <button
            key={i}
            onClick={() => { setActiveApp(i); setShowAssets(false); }}
            style={{
              flex: 1,
              padding: "14px 16px",
              borderRadius: 12,
              border: `2px solid ${activeApp === i ? a.color : "#2a2a45"}`,
              background: activeApp === i ? `${a.color}15` : "#16162a",
              color: activeApp === i ? a.color : "#94a3b8",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 14,
              transition: "all 0.2s"
            }}
          >
            {a.emoji} {a.name}
          </button>
        ))}
      </div>

      {/* Score Card */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 16px 16px" }}>
        <div style={{ background: app.gradient, borderRadius: 16, padding: 24, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>Readiness Score</div>
              <div style={{ fontSize: 52, fontWeight: 900, color: "#fff" }}>{app.score}<span style={{ fontSize: 24 }}>/10</span></div>
              <div style={{ display: "inline-block", background: app.statusColor + "30", color: app.statusColor, borderRadius: 20, padding: "4px 12px", fontSize: 13, fontWeight: 600, marginTop: 6 }}>
                {app.status}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>Completed</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: "#fff" }}>{done}/{total}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>checklist items</div>
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 999, height: 8, marginTop: 16 }}>
            <div style={{ background: app.color, borderRadius: 999, height: 8, width: `${(done/total)*100}%`, transition: "width 0.5s" }} />
          </div>
        </div>

        {/* Checklist */}
        <div style={{ background: "#16162a", borderRadius: 12, border: "1px solid #2a2a45", overflow: "hidden", marginBottom: 16 }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #2a2a45", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>📋 Submission Checklist</span>
            <span style={{ color: "#64748b", fontSize: 13 }}>{done} of {total} done</span>
          </div>
          {app.checklist.map((item, i) => (
            <div key={i} style={{ padding: "12px 20px", borderBottom: i < app.checklist.length - 1 ? "1px solid #1e1e35" : "none", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 18 }}>{item.done ? "✅" : "⬜"}</span>
              <span style={{ fontSize: 14, color: item.done ? "#cbd5e1" : "#64748b", textDecoration: item.done ? "none" : "none" }}>{item.item}</span>
            </div>
          ))}
        </div>

        {/* Visual Assets */}
        <div style={{ background: "#16162a", borderRadius: 12, border: "1px solid #2a2a45", overflow: "hidden", marginBottom: 16 }}>
          <button
            onClick={() => setShowAssets(!showAssets)}
            style={{ width: "100%", padding: "14px 20px", background: "none", border: "none", color: "#f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", fontSize: 15, fontWeight: 700 }}
          >
            <span>🎨 Visual Assets ({app.assets.length})</span>
            <span style={{ color: app.color, fontSize: 20, transform: showAssets ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>⌄</span>
          </button>
          {showAssets && (
            <div style={{ padding: "0 16px 16px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
              {app.assets.map((asset, i) => (
                <a key={i} href={asset.url} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                  <div style={{ borderRadius: 8, overflow: "hidden", border: "1px solid #2a2a45" }}>
                    <img src={asset.url} alt={asset.label} style={{ width: "100%", height: 120, objectFit: "cover", display: "block" }} />
                    <div style={{ padding: "8px 10px", fontSize: 12, color: "#94a3b8", background: "#1e1e35" }}>{asset.label}</div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div style={{ background: "#16162a", borderRadius: 12, border: `1px solid ${app.color}30`, padding: 20 }}>
          <h3 style={{ color: app.color, margin: "0 0 12px", fontSize: 15 }}>🚀 Next Steps to Ship</h3>
          <ol style={{ color: "#cbd5e1", fontSize: 14, lineHeight: 2, paddingLeft: 20, margin: 0 }}>
            {activeApp === 0 ? (
              <>
                <li>Hire Capacitor developer ($200–$500 on Upwork/Fiverr)</li>
                <li>Set up Apple Developer Account ($99/yr at developer.apple.com)</li>
                <li>Set up Google Play Console ($25 at play.google.com/console)</li>
                <li>Run beta test with 5–10 real kids</li>
                <li>Submit for review (Apple: 1–3 days, Google: 1–7 days)</li>
              </>
            ) : (
              <>
                <li>Seed app with demo profiles and posts</li>
                <li>Build age verification gate (12+)</li>
                <li>Hire Capacitor developer ($200–$500)</li>
                <li>Set up Apple Developer Account ($99/yr)</li>
                <li>Set up Google Play Console ($25)</li>
                <li>Submit for review</li>
              </>
            )}
          </ol>
        </div>
      </div>
    </div>
  );
}
