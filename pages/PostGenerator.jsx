import { useState } from "react";

const posts = [
  {
    platform: "TikTok",
    icon: "🎵",
    color: "#ff0050",
    bg: "#1a0010",
    clip: "15-sec clip",
    caption: `They said screen time was bad. We said — not anymore. 🛡️ Meet The Legacy Circle — FREE AI storytelling app for kids ages 2-14. Link in bio!`,
    hashtags: `#TheLegacyCircle #KidsApp #EdTech #FreeApp #KidsLearning #AIForKids #HomeschoolTikTok #MomTok #KnowledgeShield #ScreenTimeThatMatters`,
    tip: "Post between 6–9 PM for max reach. Use trending audio in TikTok editor."
  },
  {
    platform: "Facebook",
    icon: "📘",
    color: "#1877f2",
    bg: "#0a1628",
    clip: "30-sec clip",
    caption: `🛡️ Introducing The Legacy Circle — the FREE AI-powered storytelling app built for the next generation of heroes.\n\nMeet Justice, Lebron, Zara & Eli — four kids on a mission to learn, grow, and change the world. Your child could be next.\n\n✅ FREE to use\n✅ Ages 2–14\n✅ No ads. No subscriptions.\n\nTry it now 👉 https://untitled-app-79841768.base44.app\nTag a parent who needs this! 👇`,
    hashtags: `#TheLegacyCircle #KidsLearning #FreeApp #AIForKids #EdTech`,
    tip: "Post in parenting & homeschool groups for maximum organic reach."
  },
  {
    platform: "YouTube Shorts",
    icon: "▶️",
    color: "#ff0000",
    bg: "#1a0000",
    clip: "30-sec clip",
    caption: `The Legacy Circle | FREE AI App for Kids Ages 2-14 🛡️\n\nAn AI-powered storytelling app that makes kids WANT to learn. Meet the characters, explore the stories, and join the Legacy.\n\n🔗 Try it FREE: https://untitled-app-79841768.base44.app`,
    hashtags: `#Shorts #KidsApp #TheLegacyCircle #EdTech #AILearning`,
    tip: "Upload as a YouTube Short — vertical video gets auto-promoted in Shorts feed."
  },
  {
    platform: "Instagram",
    icon: "📸",
    color: "#e1306c",
    bg: "#1a0010",
    clip: "Promo image or 15-sec Reel",
    caption: `A new generation of heroes is rising. 🛡️✨\n\nThe Legacy Circle is FREE, built for kids ages 2–14, and powered by AI. Stories that teach. Characters they'll love. A legacy worth building.\n\nLink in bio 👆`,
    hashtags: `#TheLegacyCircle #KidsOfInstagram #MomLife #HomeschoolMom #KidsLearning #FreeApp #AIForKids #EdTech #KnowledgeShield #NewGenerationOfHeroes`,
    tip: "Use the Hero Poster promo image as your cover. Post to Reels AND Feed for double exposure."
  },
  {
    platform: "Homeschool Groups",
    icon: "🏠",
    color: "#f59e0b",
    bg: "#1a1000",
    clip: "Promo image",
    caption: `Homeschool mamas — I built something for YOU. 🛡️ The Legacy Circle is a FREE AI-powered storytelling app for kids ages 2–14. Stories that actually teach. No ads, no subscriptions, no fluff. Would love your honest feedback! 👉 https://untitled-app-79841768.base44.app`,
    hashtags: `#Homeschool #HomeschoolMom #KidsLearning #FreeApp`,
    tip: "Post in: Homeschool Parents Network, Homeschooling 101, Christian Homeschool Moms"
  },
  {
    platform: "Christian Homeschool",
    icon: "✝️",
    color: "#a78bfa",
    bg: "#0f0a1a",
    clip: "Promo image",
    caption: `Built with purpose, launched with prayer. 🙏 The Legacy Circle is a FREE educational storytelling app for kids ages 2–14 — rooted in values, powered by AI. Would love this community's feedback! 👉 https://untitled-app-79841768.base44.app`,
    hashtags: `#ChristianHomeschool #FaithAndLearning #KidsApp #TheLegacyCircle`,
    tip: "Post in: Christian Homeschool Moms, Faith-based parenting groups"
  },
  {
    platform: "Teachers & EdTech",
    icon: "🎓",
    color: "#34d399",
    bg: "#001a0f",
    clip: "Classroom promo image",
    caption: `Fellow educators — this one's worth sharing with your parents. 🏫 The Legacy Circle is a FREE AI storytelling app for kids ages 2–14 that actually reinforces learning. No login required. Just click and explore 👉 https://untitled-app-79841768.base44.app`,
    hashtags: `#Teachers #EdTech #KidsLearning #FreeApp #TheLegacyCircle #ClassroomTools`,
    tip: "Post in: Educational Apps for Kids, EdTech & Education Technology, Teachers Pay Teachers"
  },
  {
    platform: "Children's Book Groups",
    icon: "📖",
    color: "#60a5fa",
    bg: "#000d1a",
    clip: "Book cover image",
    caption: `Building something at the intersection of storytelling + EdTech. 📚 The Legacy Circle is a FREE AI-powered app bringing stories to life for kids ages 2–14. Would love feedback from fellow storytellers! 👉 https://untitled-app-79841768.base44.app`,
    hashtags: `#ChildrensBooks #SelfPublishing #KDP #KidsStorytime #TheLegacyCircle #EdTech`,
    tip: "Post in: Children's Book Authors & Illustrators, Self Publishing School Community, KDP Support Group"
  }
];

export default function PostGenerator() {
  const [copied, setCopied] = useState({});
  const [activeTab, setActiveTab] = useState(0);

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(prev => ({ ...prev, [key]: true }));
    setTimeout(() => setCopied(prev => ({ ...prev, [key]: false })), 2000);
  };

  const post = posts[activeTab];

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f1a", color: "#f0f0f0", fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1a1a3e 0%, #2d1b69 100%)", padding: "32px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>📣</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, background: "linear-gradient(90deg, #f59e0b, #fde68a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Post Generator
        </h1>
        <p style={{ color: "#94a3b8", marginTop: 4, fontSize: 14 }}>The Legacy Circle · Social Media Kit</p>
      </div>

      {/* Platform Tabs */}
      <div style={{ overflowX: "auto", display: "flex", gap: 8, padding: "16px 16px 0", maxWidth: 800, margin: "0 auto" }}>
        {posts.map((p, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            style={{
              background: activeTab === i ? p.color : "#1e1e32",
              color: activeTab === i ? "#fff" : "#94a3b8",
              border: `1px solid ${activeTab === i ? p.color : "#2d2d50"}`,
              borderRadius: 20,
              padding: "6px 14px",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
              flexShrink: 0
            }}
          >
            {p.icon} {p.platform}
          </button>
        ))}
      </div>

      {/* Post Card */}
      <div style={{ maxWidth: 800, margin: "16px auto", padding: "0 16px 40px" }}>
        <div style={{ background: "#1e1e32", borderRadius: 16, border: `1px solid ${post.color}40`, overflow: "hidden" }}>
          
          {/* Platform header */}
          <div style={{ background: post.bg, borderBottom: `1px solid ${post.color}30`, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 28 }}>{post.icon}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: post.color }}>{post.platform}</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>Use with: {post.clip}</div>
            </div>
          </div>

          {/* Caption */}
          <div style={{ padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>Caption</span>
              <button
                onClick={() => copyText(post.caption, `cap-${activeTab}`)}
                style={{ background: copied[`cap-${activeTab}`] ? "#14532d" : "#2d2d50", color: copied[`cap-${activeTab}`] ? "#4ade80" : "#94a3b8", border: "none", borderRadius: 8, padding: "4px 12px", fontSize: 12, cursor: "pointer", fontWeight: 600 }}
              >
                {copied[`cap-${activeTab}`] ? "✅ Copied!" : "📋 Copy"}
              </button>
            </div>
            <div style={{ background: "#0f0f1a", borderRadius: 10, padding: "14px 16px", fontSize: 14, lineHeight: 1.7, color: "#e2e8f0", whiteSpace: "pre-wrap" }}>
              {post.caption}
            </div>
          </div>

          {/* Hashtags */}
          <div style={{ padding: "0 20px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>Hashtags</span>
              <button
                onClick={() => copyText(post.hashtags, `hash-${activeTab}`)}
                style={{ background: copied[`hash-${activeTab}`] ? "#14532d" : "#2d2d50", color: copied[`hash-${activeTab}`] ? "#4ade80" : "#94a3b8", border: "none", borderRadius: 8, padding: "4px 12px", fontSize: 12, cursor: "pointer", fontWeight: 600 }}
              >
                {copied[`hash-${activeTab}`] ? "✅ Copied!" : "📋 Copy"}
              </button>
            </div>
            <div style={{ background: "#0f0f1a", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#60a5fa", lineHeight: 1.8 }}>
              {post.hashtags}
            </div>
          </div>

          {/* Copy All */}
          <div style={{ padding: "0 20px 20px" }}>
            <button
              onClick={() => copyText(`${post.caption}\n\n${post.hashtags}`, `all-${activeTab}`)}
              style={{ width: "100%", background: `linear-gradient(135deg, ${post.color}, ${post.color}99)`, color: "#fff", border: "none", borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
            >
              {copied[`all-${activeTab}`] ? "✅ Copied Everything!" : "🚀 Copy Full Post"}
            </button>
          </div>

          {/* Pro tip */}
          <div style={{ margin: "0 20px 20px", background: "#0f0f1a", borderRadius: 10, padding: "12px 16px", borderLeft: `3px solid ${post.color}`, fontSize: 13, color: "#94a3b8" }}>
            💡 <strong style={{ color: "#f59e0b" }}>Pro tip:</strong> {post.tip}
          </div>
        </div>

        {/* Video Assets */}
        <div style={{ marginTop: 24, background: "#1e1e32", borderRadius: 16, border: "1px solid #2d2d50", padding: "20px" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "#f59e0b" }}>🎬 Your Video Assets</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "Full Video (85-sec) — Clean", url: "https://base44.app/api/apps/69d9b8416964fe31ae3f9932/files/mp/public/69d9b8416964fe31ae3f9932/984692d5f_legacy_circle_compressed.mp4" },
              { label: "30-sec Cut — Facebook & YouTube Shorts", url: "https://base44.app/api/apps/69d9b8416964fe31ae3f9932/files/mp/public/69d9b8416964fe31ae3f9932/32d450bc3_legacy_circle_30sec.mp4" },
              { label: "15-sec Cut — TikTok & Instagram Stories", url: "https://base44.app/api/apps/69d9b8416964fe31ae3f9932/files/mp/public/69d9b8416964fe31ae3f9932/6960e7e6a_legacy_circle_15sec.mp4" }
            ].map((v, i) => (
              <a key={i} href={v.url} download target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0f0f1a", borderRadius: 10, padding: "12px 16px", textDecoration: "none", color: "#e2e8f0", fontSize: 13, border: "1px solid #2d2d50" }}>
                <span>📥 {v.label}</span>
                <span style={{ color: "#f59e0b", fontWeight: 700 }}>Download</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
