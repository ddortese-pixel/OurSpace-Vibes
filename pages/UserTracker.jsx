import { useState, useEffect } from "react";
import { UserTracker } from "@/api/entities";
import { createPagesBrowserClient } from "@base44/sdk";

const client = createPagesBrowserClient();

const PLATFORMS = ["The Legacy Circle", "OurSpace 2.0"];

const PLATFORM_COLORS = {
  "The Legacy Circle": { bg: "from-yellow-900/40 to-yellow-800/20", accent: "#ffc400", badge: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30" },
  "OurSpace 2.0": { bg: "from-purple-900/40 to-cyan-900/20", accent: "#c084fc", badge: "bg-purple-500/20 text-purple-300 border border-purple-500/30" },
};

function StatCard({ label, value, sub, color }) {
  return (
    <div className="bg-white/5 rounded-xl p-4 flex flex-col gap-1 border border-white/10">
      <span className="text-xs text-white/50 uppercase tracking-widest">{label}</span>
      <span className="text-3xl font-bold" style={{ color }}>{value?.toLocaleString() ?? "—"}</span>
      {sub && <span className="text-xs text-white/40">{sub}</span>}
    </div>
  );
}

export default function UserTrackerPage() {
  const [records, setRecords] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("The Legacy Circle");

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    try {
      const data = await UserTracker.list({ limit: 500, sort: "-date" });
      setRecords(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  async function syncNow() {
    setSyncing(true);
    setSyncMsg("Syncing from GA4...");
    try {
      const res = await client.functions.userTracker({});
      if (res.success) {
        setSyncMsg(`✅ Synced! ${res.results?.map(r => `${r.platform}: ${r.new_users} new users today`).join(" | ")}`);
        await loadData();
      } else {
        setSyncMsg(`⚠️ ${res.error || "Sync failed"}`);
      }
    } catch (e) {
      setSyncMsg(`⚠️ ${e.message}`);
    }
    setSyncing(false);
  }

  const platformRecords = records.filter(r => r.platform === activeTab);
  const latest = platformRecords[0];
  const yesterday = platformRecords[1];

  // Totals for summary cards
  const lcRecords = records.filter(r => r.platform === "The Legacy Circle");
  const osRecords = records.filter(r => r.platform === "OurSpace 2.0");
  const lcLatest = lcRecords[0];
  const osLatest = osRecords[0];

  // Trend: today vs yesterday
  const newUsersTrend = latest && yesterday
    ? latest.new_users - yesterday.new_users
    : null;

  const color = PLATFORM_COLORS[activeTab]?.accent || "#fff";

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white p-4 md:p-8 font-sans">
      {/* Header */}
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">📊 User Tracker</h1>
            <p className="text-white/40 text-sm mt-1">Live traffic — Legacy Circle & OurSpace 2.0</p>
          </div>
          <button
            onClick={syncNow}
            disabled={syncing}
            className="px-5 py-2 rounded-xl font-semibold text-sm transition-all"
            style={{ background: syncing ? "#333" : "linear-gradient(135deg, #ffc400, #c084fc)", color: "#000" }}
          >
            {syncing ? "Syncing..." : "🔄 Sync Now"}
          </button>
        </div>

        {syncMsg && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white/70">
            {syncMsg}
          </div>
        )}

        {/* Summary Cards — both platforms */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[
            { name: "The Legacy Circle", latest: lcLatest, color: "#ffc400", emoji: "📚" },
            { name: "OurSpace 2.0", latest: osLatest, color: "#c084fc", emoji: "🌐" },
          ].map(({ name, latest: l, color: c, emoji }) => (
            <div
              key={name}
              onClick={() => setActiveTab(name)}
              className={`rounded-2xl p-5 cursor-pointer border transition-all bg-gradient-to-br ${PLATFORM_COLORS[name].bg} ${activeTab === name ? "border-white/30 scale-[1.02]" : "border-white/10"}`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{emoji}</span>
                <span className="font-semibold text-sm text-white/80">{name}</span>
              </div>
              <div className="text-3xl font-bold" style={{ color: c }}>
                {l?.total_users?.toLocaleString() ?? "—"}
              </div>
              <div className="text-xs text-white/40 mt-1">Total Users</div>
              <div className="mt-2 text-sm" style={{ color: c }}>
                +{l?.new_users ?? 0} today
              </div>
            </div>
          ))}
        </div>

        {/* Tab Detail View */}
        <div className="mb-4 flex gap-2">
          {PLATFORMS.map(p => (
            <button
              key={p}
              onClick={() => setActiveTab(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === p ? "text-black" : "bg-white/5 text-white/50"}`}
              style={activeTab === p ? { background: PLATFORM_COLORS[p].accent } : {}}
            >
              {p}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-white/30 py-20">Loading...</div>
        ) : (
          <>
            {/* Today's Stats */}
            {latest && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard label="New Users Today" value={latest.new_users} color={color}
                  sub={newUsersTrend !== null ? `${newUsersTrend >= 0 ? "+" : ""}${newUsersTrend} vs yesterday` : null} />
                <StatCard label="Total Users" value={latest.total_users} color={color} sub="All time" />
                <StatCard label="Sessions Today" value={latest.sessions} color={color} />
                <StatCard label="Page Views Today" value={latest.page_views} color={color} />
              </div>
            )}

            {/* History Table */}
            <div className="rounded-2xl border border-white/10 overflow-hidden">
              <div className="px-5 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
                <span className="text-sm font-semibold text-white/70">Daily History</span>
                <span className="text-xs text-white/30">{platformRecords.length} records</span>
              </div>
              {platformRecords.length === 0 ? (
                <div className="text-center text-white/30 py-12 text-sm">
                  No data yet — click "Sync Now" to pull from GA4
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-white/30 text-xs uppercase border-b border-white/10">
                        <th className="text-left px-5 py-3">Date</th>
                        <th className="text-right px-5 py-3">New Users</th>
                        <th className="text-right px-5 py-3">Total Users</th>
                        <th className="text-right px-5 py-3">Sessions</th>
                        <th className="text-right px-5 py-3">Page Views</th>
                        <th className="text-left px-5 py-3">Source</th>
                      </tr>
                    </thead>
                    <tbody>
                      {platformRecords.map((r, i) => (
                        <tr key={r.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i === 0 ? "bg-white/5" : ""}`}>
                          <td className="px-5 py-3 font-mono text-white/60">{r.date}</td>
                          <td className="px-5 py-3 text-right font-bold" style={{ color }}>{r.new_users?.toLocaleString()}</td>
                          <td className="px-5 py-3 text-right text-white/70">{r.total_users?.toLocaleString()}</td>
                          <td className="px-5 py-3 text-right text-white/50">{r.sessions?.toLocaleString()}</td>
                          <td className="px-5 py-3 text-right text-white/50">{r.page_views?.toLocaleString()}</td>
                          <td className="px-5 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs ${PLATFORM_COLORS[activeTab].badge}`}>
                              {r.source || "Direct"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Grant Readiness Bar */}
            <div className="mt-6 rounded-2xl border border-white/10 p-5 bg-white/5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-white/70">📈 Grant Readiness — User Milestones</span>
                <span className="text-xs text-white/30">Based on total users across both platforms</span>
              </div>
              {[
                { label: "First 100 Users", target: 100, emoji: "🌱" },
                { label: "500 Users — Grant Conversations", target: 500, emoji: "📋" },
                { label: "1,000 Users — Seed Funding Eligible", target: 1000, emoji: "💰" },
                { label: "5,000 Users — Series A Ready", target: 5000, emoji: "🚀" },
              ].map(({ label, target, emoji }) => {
                const total = (lcLatest?.total_users || 0) + (osLatest?.total_users || 0);
                const pct = Math.min(100, Math.round((total / target) * 100));
                return (
                  <div key={target} className="mb-3">
                    <div className="flex items-center justify-between text-xs text-white/50 mb-1">
                      <span>{emoji} {label}</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: "linear-gradient(90deg, #ffc400, #c084fc)" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
