import { useState, useEffect } from "react";
import { DiagnosticLog } from "../api/entities";
import { useNavigate } from "react-router-dom";

const STATUS_CONFIG = {
  pass:           { color: "#4ade80", bg: "#0f2a1e", border: "#4ade8030", icon: "✅" },
  warning:        { color: "#facc15", bg: "#1a1a0f", border: "#facc1530", icon: "⚠️" },
  error:          { color: "#ef4444", bg: "#2a1515", border: "#ef444430", icon: "❌" },
  fixed:          { color: "#facc15", bg: "#1a1a0f", border: "#facc1530", icon: "🔧" },
  admin_required: { color: "#c084fc", bg: "#1e1a2e", border: "#c084fc30", icon: "👋" },
};

const SEVERITY_COLOR = { low: "#475569", medium: "#f97316", high: "#ef4444", critical: "#ff0040" };

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pass;
  return (
    <span style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color, fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 700, whiteSpace: "nowrap" }}>
      {cfg.icon} {status?.replace("_", " ")}
    </span>
  );
}

export default function DiagnosticDashboard() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRun, setSelectedRun] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterApp, setFilterApp] = useState("all");
  const navigate = useNavigate();

  useEffect(() => { loadLogs(); }, []);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await DiagnosticLog.list("-created_date");
      setLogs(data || []);
      // Auto-select most recent run
      if (data?.length > 0) setSelectedRun(data[0].run_id);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  // Group logs by run_id
  const runs = {};
  for (const log of logs) {
    if (!runs[log.run_id]) runs[log.run_id] = [];
    runs[log.run_id].push(log);
  }

  const runIds = Object.keys(runs).sort((a, b) => {
    const aTime = parseInt(a.split("_")[1] || "0");
    const bTime = parseInt(b.split("_")[1] || "0");
    return bTime - aTime;
  });

  const selectedLogs = selectedRun ? (runs[selectedRun] || []) : [];
  const filteredLogs = selectedLogs.filter(l => {
    if (filterStatus !== "all" && l.status !== filterStatus) return false;
    if (filterApp !== "all" && l.app !== filterApp) return false;
    return true;
  });

  const allApps = [...new Set(logs.map(l => l.app).filter(Boolean))];

  const getRunSummary = (runLogs) => ({
    total: runLogs.length,
    pass: runLogs.filter(l => l.status === "pass").length,
    error: runLogs.filter(l => l.status === "error").length,
    fixed: runLogs.filter(l => l.status === "fixed").length,
    warning: runLogs.filter(l => l.status === "warning").length,
    admin: runLogs.filter(l => l.status === "admin_required").length,
    critical: runLogs.filter(l => l.severity === "critical").length,
  });

  const getRunTimestamp = (runId) => {
    const ts = parseInt(runId?.split("_")[1] || "0");
    if (!ts) return "Unknown";
    return new Date(ts).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const getRunHealth = (summary) => {
    if (summary.critical > 0 || summary.error > 0) return { color: "#ef4444", label: "Issues" };
    if (summary.admin > 0) return { color: "#c084fc", label: "Action Needed" };
    if (summary.warning > 0) return { color: "#facc15", label: "Warning" };
    return { color: "#4ade80", label: "Healthy" };
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d1a", color: "#f0f0f0", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{ background: "#0b0b1e", borderBottom: "1px solid #1e1e3a", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 22, background: "linear-gradient(90deg,#c084fc,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>🔬 System Diagnostics</div>
          <div style={{ color: "#475569", fontSize: 13, marginTop: 2 }}>OurSpace 2.0 + The Legacy Circle</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={loadLogs} style={{ padding: "8px 16px", background: "#13132b", border: "1px solid #1e1e3a", borderRadius: 10, color: "#94a3b8", fontSize: 13, cursor: "pointer" }}>↻ Refresh</button>
          <button onClick={() => navigate("/Home")} style={{ padding: "8px 16px", background: "#13132b", border: "1px solid #1e1e3a", borderRadius: 10, color: "#94a3b8", fontSize: 13, cursor: "pointer" }}>← Back</button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px", display: "grid", gridTemplateColumns: "280px 1fr", gap: 20, alignItems: "start" }}>

        {/* Run History Sidebar */}
        <div>
          <div style={{ fontWeight: 700, fontSize: 13, color: "#64748b", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Run History</div>
          {loading ? (
            <div style={{ color: "#475569", fontSize: 14, padding: "20px 0" }}>Loading...</div>
          ) : runIds.length === 0 ? (
            <div style={{ background: "#13132b", borderRadius: 14, padding: 20, color: "#475569", fontSize: 14, textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🌑</div>
              No diagnostic runs yet.<br />First run fires automatically.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {runIds.map(runId => {
                const runLogs = runs[runId];
                const summary = getRunSummary(runLogs);
                const health = getRunHealth(summary);
                const isSelected = selectedRun === runId;
                return (
                  <div key={runId} onClick={() => setSelectedRun(runId)}
                    style={{ background: isSelected ? "#1e1a2e" : "#13132b", border: `1px solid ${isSelected ? "#c084fc40" : "#1e1e3a"}`, borderRadius: 12, padding: "12px 14px", cursor: "pointer" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: isSelected ? "#c084fc" : "#f0f0f0" }}>{getRunTimestamp(runId)}</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: health.color }}>● {health.label}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11, color: "#4ade80" }}>✅ {summary.pass}</span>
                      {summary.fixed > 0 && <span style={{ fontSize: 11, color: "#facc15" }}>🔧 {summary.fixed}</span>}
                      {summary.warning > 0 && <span style={{ fontSize: 11, color: "#f97316" }}>⚠️ {summary.warning}</span>}
                      {summary.error > 0 && <span style={{ fontSize: 11, color: "#ef4444" }}>❌ {summary.error}</span>}
                      {summary.admin > 0 && <span style={{ fontSize: 11, color: "#c084fc" }}>👋 {summary.admin}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Main Panel */}
        <div>
          {selectedRun && runs[selectedRun] && (() => {
            const summary = getRunSummary(runs[selectedRun]);
            const health = getRunHealth(summary);
            return (
              <>
                {/* Summary Cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: 10, marginBottom: 20 }}>
                  {[
                    { label: "Passed", value: summary.pass, color: "#4ade80", bg: "#0f2a1e" },
                    { label: "Fixed", value: summary.fixed, color: "#facc15", bg: "#1a1a0f" },
                    { label: "Warnings", value: summary.warning, color: "#f97316", bg: "#1a1200" },
                    { label: "Errors", value: summary.error, color: "#ef4444", bg: "#2a1515" },
                    { label: "Need Me", value: summary.admin, color: "#c084fc", bg: "#1e1a2e" },
                  ].map(s => (
                    <div key={s.label} onClick={() => setFilterStatus(s.label === "Need Me" ? "admin_required" : s.label.toLowerCase())}
                      style={{ background: s.bg, border: `1px solid ${s.color}20`, borderRadius: 12, padding: "14px 12px", textAlign: "center", cursor: "pointer" }}>
                      <div style={{ fontSize: 26, fontWeight: 900, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Overall health banner */}
                {(summary.error > 0 || summary.admin > 0 || summary.critical > 0) && (
                  <div style={{ background: summary.critical > 0 ? "#2a0a0a" : summary.error > 0 ? "#2a1515" : "#1e1a2e", border: `1px solid ${health.color}30`, borderRadius: 14, padding: "14px 18px", marginBottom: 18, display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 24 }}>{summary.critical > 0 ? "🚨" : summary.admin > 0 ? "👋" : "❌"}</span>
                    <div>
                      <div style={{ fontWeight: 700, color: health.color }}>{summary.admin > 0 ? "Your attention is needed" : "Issues detected"}</div>
                      <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>An alert was sent to ddortese@gmail.com</div>
                    </div>
                  </div>
                )}
                {summary.error === 0 && summary.admin === 0 && summary.critical === 0 && (
                  <div style={{ background: "#0f2a1e", border: "1px solid #4ade8030", borderRadius: 14, padding: "14px 18px", marginBottom: 18, display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 24 }}>🟢</span>
                    <div>
                      <div style={{ fontWeight: 700, color: "#4ade80" }}>All Systems Healthy</div>
                      <div style={{ fontSize: 13, color: "#64748b" }}>Both apps are running clean. {summary.fixed > 0 ? `${summary.fixed} issue(s) were auto-fixed.` : ""}</div>
                    </div>
                  </div>
                )}

                {/* Filters */}
                <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                  <button onClick={() => setFilterStatus("all")} style={{ padding: "5px 14px", background: filterStatus === "all" ? "#2a1a3e" : "#13132b", border: `1px solid ${filterStatus === "all" ? "#c084fc" : "#1e1e3a"}`, borderRadius: 20, color: filterStatus === "all" ? "#c084fc" : "#64748b", fontSize: 12, cursor: "pointer" }}>All</button>
                  {["pass", "error", "warning", "fixed", "admin_required"].map(s => (
                    <button key={s} onClick={() => setFilterStatus(s)} style={{ padding: "5px 14px", background: filterStatus === s ? "#2a1a3e" : "#13132b", border: `1px solid ${filterStatus === s ? "#c084fc" : "#1e1e3a"}`, borderRadius: 20, color: filterStatus === s ? "#c084fc" : "#64748b", fontSize: 12, cursor: "pointer" }}>
                      {STATUS_CONFIG[s]?.icon} {s.replace("_", " ")}
                    </button>
                  ))}
                  <select value={filterApp} onChange={e => setFilterApp(e.target.value)} style={{ padding: "5px 12px", background: "#13132b", border: "1px solid #1e1e3a", borderRadius: 20, color: "#64748b", fontSize: 12, cursor: "pointer", outline: "none" }}>
                    <option value="all">All Apps</option>
                    {allApps.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>

                {/* Results list */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {filteredLogs.map((log, i) => {
                    const cfg = STATUS_CONFIG[log.status] || STATUS_CONFIG.pass;
                    return (
                      <div key={log.id || i} style={{ background: "#13132b", border: `1px solid ${cfg.border}`, borderLeft: `3px solid ${cfg.color}`, borderRadius: 12, padding: "12px 14px" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, justifyContent: "space-between" }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{log.check_name}</div>
                            <div style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.5 }}>{log.details}</div>
                            {log.fix_description && (
                              <div style={{ marginTop: 6, fontSize: 12, color: "#facc15" }}>🔧 {log.fix_description}</div>
                            )}
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                            <StatusBadge status={log.status} />
                            <span style={{ fontSize: 10, color: "#2a2a45", background: "#0d0d1a", padding: "2px 8px", borderRadius: 20 }}>{log.app}</span>
                            {log.severity && log.severity !== "low" && (
                              <span style={{ fontSize: 10, color: SEVERITY_COLOR[log.severity], fontWeight: 700 }}>{log.severity?.toUpperCase()}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {filteredLogs.length === 0 && (
                    <div style={{ textAlign: "center", padding: 32, color: "#475569", fontSize: 14 }}>No results match this filter</div>
                  )}
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
