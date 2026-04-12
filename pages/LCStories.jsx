import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const STORIES = [
  {
    id: "justice-1", character: "Justice", emoji: "⚖️", color: "#f59e0b",
    title: "The Playground Dispute", episode: 1,
    desc: "Two friends argue about the rules of a game. Justice must help them find a fair solution without taking sides.",
    ageGroup: ["5-7", "8-10", "11-14"], xp: 50, duration: "8 min",
    scenes: [
      { text: "Marcus and Layla are arguing loudly on the playground. Marcus says he tagged Layla but she disagrees.", choice: ["Ask them both to share their side", "Pick a side and move on"] },
      { text: "After hearing both sides, Justice realizes both kids have a point. What should happen next?", choice: ["Make a new rule together", "Call a teacher to decide"] },
      { text: "They agree on a new rule. The game continues and everyone is happy!", choice: ["End the story", "Play again"] },
    ],
  },
  {
    id: "lebron-1", character: "Lebron", emoji: "🏀", color: "#3b82f6",
    title: "The Big Game Decision", episode: 1,
    desc: "Lebron's team is losing. He can take a risky shot alone — or pass to a teammate who's been struggling.",
    ageGroup: ["8-10", "11-14"], xp: 60, duration: "10 min",
    scenes: [
      { text: "10 seconds left. Lebron has the ball. He could shoot — or pass to Jordan who hasn't scored all game.", choice: ["Take the shot", "Pass to Jordan"] },
      { text: "Lebron passes. Jordan catches it and hesitates. The crowd goes quiet.", choice: ["Shout encouragement", "Rush in for the rebound"] },
      { text: "Jordan shoots and scores! The team wins — and Jordan can't stop smiling.", choice: ["Celebrate together", "Reflect quietly"] },
    ],
  },
  {
    id: "zara-1", character: "Zara", emoji: "🌟", color: "#ec4899",
    title: "The Art Room Mystery", episode: 1,
    desc: "Someone has been taking art supplies from the classroom. Zara must figure out who — and why.",
    ageGroup: ["5-7", "8-10"], xp: 55, duration: "9 min",
    scenes: [
      { text: "Zara notices paintbrushes going missing every day. Her classmates are upset.", choice: ["Investigate quietly", "Tell the teacher right away"] },
      { text: "Zara finds the brushes in a closet next to a hidden drawing — beautiful, but unsigned.", choice: ["Find the artist", "Leave it alone"] },
      { text: "The artist is shy Tim who draws at recess alone. Zara invites him to join art club.", choice: ["End the story", "Explore Tim's art"] },
    ],
  },
  {
    id: "eli-1", character: "Eli", emoji: "🔬", color: "#10b981",
    title: "The Science Fair Secret", episode: 1,
    desc: "Eli discovers that the winning science fair project last year may have been copied. What should he do?",
    ageGroup: ["8-10", "11-14"], xp: 65, duration: "11 min",
    scenes: [
      { text: "Eli finds an old science magazine with an experiment that matches last year's winning project exactly.", choice: ["Report it to the teacher", "Ask the winner directly"] },
      { text: "The winner admits they copied it — they were scared of failing. Eli understands the pressure.", choice: ["Tell the teacher together", "Keep the secret"] },
      { text: "They come clean. The winner does their own project and learns more than ever before.", choice: ["End the story", "See the new project"] },
    ],
  },
];

export default function LCStories() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [activeStory, setActiveStory] = useState(null);
  const [scene, setScene] = useState(0);
  const [choices, setChoices] = useState([]);
  const [finished, setFinished] = useState(false);
  const ageGroup = localStorage.getItem("lc_age_group") || "8-10";
  const s = { fontFamily: "sans-serif" };

  const filtered = filter === "All" ? STORIES : STORIES.filter(st => st.character === filter);

  function startStory(story) { setActiveStory(story); setScene(0); setChoices([]); setFinished(false); }

  function makeChoice(choice) {
    const newChoices = [...choices, choice];
    setChoices(newChoices);
    if (scene + 1 >= activeStory.scenes.length) {
      setFinished(true);
      const xp = parseInt(localStorage.getItem("lc_xp") || "0") + activeStory.xp;
      localStorage.setItem("lc_xp", xp);
    } else {
      setScene(s => s + 1);
    }
  }

  if (activeStory) {
    const sc = activeStory.scenes[scene];
    return (
      <div style={{ ...s, minHeight: "100vh", background: "#0a0a1a", color: "#fff", display: "flex", flexDirection: "column" }}>
        {/* Story header */}
        <div style={{ background: `linear-gradient(135deg, #1a0a2e, #16162a)`, padding: "20px 20px 16px", borderBottom: "1px solid #2d2d4e" }}>
          <div style={{ maxWidth: 600, margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setActiveStory(null)} style={{ background: "none", border: "none", color: "#a78bfa", fontSize: 20, cursor: "pointer" }}>←</button>
            <div style={{ fontSize: 24 }}>{activeStory.emoji}</div>
            <div>
              <div style={{ fontSize: 12, color: activeStory.color, fontWeight: 700 }}>{activeStory.character}</div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>{activeStory.title}</div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 16px", flex: 1, width: "100%", boxSizing: "border-box" }}>
          {/* Progress */}
          <div style={{ background: "#16162a", borderRadius: 99, height: 6, marginBottom: 24, overflow: "hidden" }}>
            <div style={{ width: `${((scene) / activeStory.scenes.length) * 100}%`, height: "100%", background: `linear-gradient(90deg, #7c3aed, ${activeStory.color})`, transition: "width 0.4s" }} />
          </div>

          {finished ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
              <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Story Complete!</div>
              <div style={{ color: "#a78bfa", fontSize: 16, marginBottom: 24 }}>+{activeStory.xp} XP earned</div>
              <div style={{ background: "#16162a", borderRadius: 16, padding: "20px", marginBottom: 24, textAlign: "left" }}>
                <div style={{ fontSize: 13, color: "#64748b", marginBottom: 12, fontWeight: 600 }}>YOUR CHOICES</div>
                {choices.map((c, i) => (
                  <div key={i} style={{ fontSize: 13, color: "#94a3b8", marginBottom: 6 }}>Scene {i + 1}: <span style={{ color: activeStory.color }}>{c}</span></div>
                ))}
              </div>
              <button onClick={() => setActiveStory(null)} style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", border: "none", borderRadius: 14, padding: "14px 32px", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                More Stories →
              </button>
            </div>
          ) : (
            <>
              {/* Character bubble */}
              <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
                <div style={{ fontSize: 36, flexShrink: 0 }}>{activeStory.emoji}</div>
                <div style={{ background: "#16162a", border: `1px solid ${activeStory.color}40`, borderRadius: "0 16px 16px 16px", padding: "16px 18px", flex: 1 }}>
                  <div style={{ color: "#e2e8f0", fontSize: 15, lineHeight: 1.6 }}>{sc.text}</div>
                </div>
              </div>

              <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>What would you do?</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {sc.choice.map((ch, i) => (
                  <button key={i} onClick={() => makeChoice(ch)} style={{
                    background: "#16162a", border: `1px solid ${activeStory.color}40`,
                    borderRadius: 14, padding: "16px 20px", color: "#fff",
                    fontSize: 14, textAlign: "left", cursor: "pointer", lineHeight: 1.4,
                    transition: "all 0.2s",
                  }}>
                    {["A", "B"][i]}. {ch}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...s, minHeight: "100vh", background: "#0a0a1a", color: "#fff" }}>
      <div style={{ background: "#16162a", padding: "20px 20px 16px", borderBottom: "1px solid #2d2d4e" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 800 }}>📖 Stories</div>
          <button onClick={() => navigate("/LCHome")} style={{ background: "none", border: "none", color: "#a78bfa", fontSize: 13, cursor: "pointer" }}>← Home</button>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "20px 16px" }}>
        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto", paddingBottom: 4 }}>
          {["All", "Justice", "Lebron", "Zara", "Eli"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              background: filter === f ? "#7c3aed" : "#16162a",
              border: `1px solid ${filter === f ? "#a855f7" : "#2d2d4e"}`,
              borderRadius: 99, padding: "8px 16px", color: "#fff",
              fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
            }}>{f === "All" ? "All Stories" : f}</button>
          ))}
        </div>

        {filtered.map(story => (
          <div key={story.id} onClick={() => startStory(story)} style={{
            background: "#16162a", border: `1px solid ${story.color}30`,
            borderRadius: 18, padding: "20px", marginBottom: 12, cursor: "pointer",
            transition: "border-color 0.2s",
          }}>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ fontSize: 36, flexShrink: 0 }}>{story.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: story.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{story.character} · Episode {story.episode}</div>
                <div style={{ fontSize: 17, fontWeight: 800, marginTop: 2 }}>{story.title}</div>
                <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 6, lineHeight: 1.4 }}>{story.desc}</div>
                <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                  <span style={{ fontSize: 12, color: "#64748b" }}>⏱ {story.duration}</span>
                  <span style={{ fontSize: 12, color: "#a78bfa", fontWeight: 600 }}>+{story.xp} XP</span>
                  <span style={{ fontSize: 12, color: "#64748b" }}>Ages {story.ageGroup.join(", ")}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom nav */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#16162a", borderTop: "1px solid #2d2d4e", display: "flex", padding: "12px 0 20px" }}>
        {[
          { icon: "🏠", label: "Home", path: "/LCHome" },
          { icon: "📖", label: "Stories", path: "/LCStories" },
          { icon: "🏆", label: "Progress", path: "/LCProgress" },
          { icon: "💌", label: "Glows", path: "/LCGlows" },
          { icon: "👤", label: "Profile", path: "/LCProfile" },
        ].map(n => (
          <div key={n.label} onClick={() => navigate(n.path)} style={{ flex: 1, textAlign: "center", cursor: "pointer" }}>
            <div style={{ fontSize: 22 }}>{n.icon}</div>
            <div style={{ fontSize: 10, color: n.path === "/LCStories" ? "#a855f7" : "#475569", marginTop: 4, fontWeight: 600 }}>{n.label}</div>
          </div>
        ))}
      </div>
      <div style={{ height: 80 }} />
    </div>
  );
}
