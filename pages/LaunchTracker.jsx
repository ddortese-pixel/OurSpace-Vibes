import { useState, useEffect } from "react";
import { ProjectMilestone } from "../api/entities";

const statusColors = {
  "Done": { bg: "#14532d", text: "#4ade80", dot: "#22c55e" },
  "In Progress": { bg: "#1e3a5f", text: "#60a5fa", dot: "#3b82f6" },
  "Not Started": { bg: "#1e1e32", text: "#94a3b8", dot: "#475569" },
  "Blocked": { bg: "#450a0a", text: "#f87171", dot: "#ef4444" }
};

const categoryIcons = {
  "Pre-Launch": "🚀",
  "Developer": "👨‍💻",
  "App Store": "📱",
  "Post-Launch": "🎉"
};

const categories = ["Pre-Launch", "Developer", "App Store", "Post-Launch"];

export default function LaunchTracker() {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    ProjectMilestone.list().then(data => {
      setMilestones(data);
      setLoading(false);
    });
  }, []);

  const updateStatus = async (id, newStatus) => {
    setUpdating(id);
    await ProjectMilestone.update(id, { status: newStatus });
    setMilestones(prev => prev.map(m => m.id === id ? { ...m, status: newStatus } : m));
    setUpdating(null);
  };

  const done = milestones.filter(m => m.status === "Done").length;
  const total = milestones.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f1a", color: "#f0f0f0", fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1a1a3e 0%, #2d1b69 100%)", padding: "40px 24px 32px", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🛡️</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, background: "linear-gradient(90deg, #f59e0b, #fde68a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Launch Tracker
        </h1>
        <p style={{ color: "#94a3b8", marginTop: 4, fontSize: 14 }}>The Legacy Circle · App Store Launch</p>

        {/* Progress bar */}
        <div style={{ maxWidth: 400, margin: "24px auto 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: "#94a3b8" }}>{done} of {total} complete</span>
            <span style={{ fontSize: 13, color: "#f59e0b", fontWeight: 700 }}>{pct}%</span>
          </div>
          <div style={{ background: "#1e1e32", borderRadius: 8, height: 10, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, #f59e0b, #fde68a)", borderRadius: 8, transition: "width 0.5s ease" }} />
          </div>
        </div>
      </div>

      {/* Milestones by category */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 16px" }}>
        {loading ? (
          <div style={{ textAlign: "center", color: "#94a3b8", padding: 48 }}>Loading...</div>
        ) : (
          categories.map(cat => {
            const items = milestones.filter(m => m.category === cat);
            if (!items.length) return null;
            return (
              <div key={cat} style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f59e0b", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                  {categoryIcons[cat]} {cat}
                </h2>
                {items.map(m => {
                  const s = statusColors[m.status] || statusColors["Not Started"];
                  return (
                    <div key={m.id} style={{ background: "#1e1e32", borderRadius: 12, border: "1px solid #2d2d50", padding: "16px 20px", marginBottom: 10, display: "flex", alignItems: "flex-start", gap: 16 }}>
                      {/* Status dot */}
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.dot, marginTop: 5, flexShrink: 0 }} />

                      {/* Content */}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                          <span style={{ fontWeight: 600, fontSize: 15, color: m.status === "Done" ? "#4ade80" : "#f0f0f0" }}>{m.title}</span>
                          <span style={{ background: s.bg, color: s.text, borderRadius: 20, padding: "2px 12px", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
                            {m.status}
                          </span>
                        </div>
                        {m.notes && <p style={{ color: "#94a3b8", fontSize: 13, margin: "6px 0 0" }}>{m.notes}</p>}
                        {m.due_date && <p style={{ color: "#475569", fontSize: 12, margin: "4px 0 0" }}>📅 {m.due_date}</p>}

                        {/* Status updater */}
                        <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {["Not Started", "In Progress", "Done", "Blocked"].map(s => (
                            <button
                              key={s}
                              onClick={() => updateStatus(m.id, s)}
                              disabled={updating === m.id || m.status === s}
                              style={{
                                background: m.status === s ? statusColors[s].bg : "transparent",
                                color: m.status === s ? statusColors[s].text : "#475569",
                                border: `1px solid ${m.status === s ? statusColors[s].dot : "#2d2d50"}`,
                                borderRadius: 20,
                                padding: "2px 10px",
                                fontSize: 11,
                                cursor: m.status === s ? "default" : "pointer",
                                fontWeight: m.status === s ? 700 : 400
                              }}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
