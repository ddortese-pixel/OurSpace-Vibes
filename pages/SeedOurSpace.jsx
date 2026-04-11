import { useState } from "react";
import { Profile, Post, Friend, WallPost, Notification } from "../api/entities";

const PROFILES = [
  { user_email: "maya.johnson@ourspace.app", display_name: "Maya J ✨", headline: "Artist | Dreamer | Creator of weird things", about_me: "I make digital art, write poetry at 2am, and collect vintage sunglasses 🎨", interests: ["digital art", "poetry", "vintage fashion", "lo-fi music"], hobbies: ["painting", "journaling", "thrift shopping"], mood: "vibing 🎵", song_playing: "Good Days — SZA", theme_color: "#9B59B6", background_gradient: "purple-pink", privacy_level: "public", is_online: true, profile_views: 1247 },
  { user_email: "carlos.m@ourspace.app", display_name: "Carlos M 🔥", headline: "Engineer by day, skater by night", about_me: "Building things that matter. Skating spots around the city 🛹", interests: ["skateboarding", "tech", "hip-hop", "basketball"], hobbies: ["skating", "coding side projects", "making beats"], mood: "locked in 💪", song_playing: "HUMBLE. — Kendrick Lamar", theme_color: "#E67E22", background_gradient: "orange-red", privacy_level: "public", is_online: true, profile_views: 893 },
  { user_email: "priya.k@ourspace.app", display_name: "Priya K 🌸", headline: "Bookworm | Tea enthusiast | Future novelist", about_me: "I read 50 books a year and I'm not sorry about it 📚", interests: ["reading", "writing", "tea", "hiking"], hobbies: ["writing fiction", "tea tasting", "nature walks"], mood: "cozy 🍵", song_playing: "Weightless — Marconi Union", theme_color: "#27AE60", background_gradient: "green-teal", privacy_level: "public", is_online: false, profile_views: 562 },
  { user_email: "zach.t@ourspace.app", display_name: "Zach T 🎮", headline: "Gamer | Content creator | Dog dad", about_me: "Streaming games, living life. My golden retriever Max runs this profile 🐕", interests: ["gaming", "streaming", "dogs", "anime"], hobbies: ["streaming", "dog walking", "cooking"], mood: "grinding 🎮", song_playing: "Blinding Lights — The Weeknd", theme_color: "#2980B9", background_gradient: "blue-cyan", privacy_level: "public", is_online: true, profile_views: 2103 },
  { user_email: "aisha.r@ourspace.app", display_name: "Aisha R 🌙", headline: "Musician | Composer | Night owl", about_me: "I produce music at midnight and sleep during the day 🎹", interests: ["music production", "piano", "jazz", "cats"], hobbies: ["composing", "recording", "photography"], mood: "in the zone 🎹", song_playing: "Numb Little Bug — Em Beihold", theme_color: "#1ABC9C", background_gradient: "teal-blue", privacy_level: "public", is_online: false, profile_views: 734 },
];

const POSTS = [
  { author_email: "maya.johnson@ourspace.app", author_name: "Maya J ✨", content: "Just finished this piece after 3 weeks. Sometimes you have to sit with something a long time before it's ready 🎨 No filter, no edits — just the work.", image_url: "https://media.base44.com/images/public/69d9b8416964fe31ae3f9932/d6e071a12_generated_image.png", post_type: "image", likes_count: 247, comments_count: 31, is_ai_generated: false, is_unfiltered: true, searchable_text: "digital art painting finished piece" },
  { author_email: "carlos.m@ourspace.app", author_name: "Carlos M 🔥", content: "The algorithm never showed you this spot. That's exactly why we built OurSpace. Chronological feeds are not a feature — they're a right 🛹", image_url: "https://media.base44.com/images/public/69d9b8416964fe31ae3f9932/ef7c4b2af_generated_image.png", post_type: "image", likes_count: 189, comments_count: 22, is_ai_generated: false, is_unfiltered: true, searchable_text: "skateboarding sunset city spot" },
  { author_email: "priya.k@ourspace.app", author_name: "Priya K 🌸", content: "Chapter 12 of my novel finally clicked. Three years of writing, and this scene wrote itself in 20 minutes. That's why you keep going 📚☕", image_url: "https://media.base44.com/images/public/69d9b8416964fe31ae3f9932/8312a8cab_generated_image.png", post_type: "image", likes_count: 312, comments_count: 45, is_ai_generated: false, is_unfiltered: true, searchable_text: "reading books writing novel tea cozy" },
  { author_email: "zach.t@ourspace.app", author_name: "Zach T 🎮", content: "Max has decided my streaming setup is his bed now. Co-streaming Elden Ring with a golden retriever. Rating: 10/10 🐕🎮", post_type: "text", likes_count: 428, comments_count: 67, is_ai_generated: false, is_unfiltered: true, searchable_text: "gaming streaming dog golden retriever elden ring" },
  { author_email: "aisha.r@ourspace.app", author_name: "Aisha R 🌙", content: "New beat dropped at 2am like always. Posting here first because the algorithm would bury this anywhere else 🎹✨", post_type: "text", likes_count: 156, comments_count: 19, is_ai_generated: false, is_unfiltered: true, searchable_text: "music beat production jazz piano" },
  { author_email: "carlos.m@ourspace.app", author_name: "Carlos M 🔥", content: "My last post on Instagram got 12 likes. Same post here: 189 people actually SAW it. Chronological feeds are not a feature — they're a right 🙌", post_type: "text", likes_count: 534, comments_count: 88, is_ai_generated: false, is_unfiltered: true, searchable_text: "ourspace chronological feed algorithm" },
  { author_email: "priya.k@ourspace.app", author_name: "Priya K 🌸", content: "Turned on the Human-Only Filter yesterday and my feed felt like 2012 again. Real people posting real things. Revolutionary.", post_type: "text", likes_count: 267, comments_count: 52, is_ai_generated: false, is_unfiltered: true, searchable_text: "human only filter social media real people" },
];

const FRIENDS = [
  { requester_email: "maya.johnson@ourspace.app", receiver_email: "carlos.m@ourspace.app", status: "accepted", requester_name: "Maya J ✨", receiver_name: "Carlos M 🔥" },
  { requester_email: "maya.johnson@ourspace.app", receiver_email: "priya.k@ourspace.app", status: "accepted", requester_name: "Maya J ✨", receiver_name: "Priya K 🌸" },
  { requester_email: "carlos.m@ourspace.app", receiver_email: "zach.t@ourspace.app", status: "accepted", requester_name: "Carlos M 🔥", receiver_name: "Zach T 🎮" },
  { requester_email: "priya.k@ourspace.app", receiver_email: "aisha.r@ourspace.app", status: "accepted", requester_name: "Priya K 🌸", receiver_name: "Aisha R 🌙" },
  { requester_email: "aisha.r@ourspace.app", receiver_email: "maya.johnson@ourspace.app", status: "accepted", requester_name: "Aisha R 🌙", receiver_name: "Maya J ✨" },
];

const WALL_POSTS = [
  { profile_email: "maya.johnson@ourspace.app", author_email: "carlos.m@ourspace.app", author_name: "Carlos M 🔥", content: "Your new piece is 🔥🔥🔥 how long did that take?" },
  { profile_email: "carlos.m@ourspace.app", author_email: "maya.johnson@ourspace.app", author_name: "Maya J ✨", content: "That skate clip was INSANE. Drop a Reel asap!" },
  { profile_email: "priya.k@ourspace.app", author_email: "aisha.r@ourspace.app", author_name: "Aisha R 🌙", content: "Can't wait to read your novel!! What genre is it?" },
  { profile_email: "aisha.r@ourspace.app", author_email: "priya.k@ourspace.app", author_name: "Priya K 🌸", content: "That 2am beat goes HARD. Put me on the listening list 🙏" },
];

const NOTIFICATIONS = [
  { user_email: "maya.johnson@ourspace.app", from_email: "carlos.m@ourspace.app", from_name: "Carlos M 🔥", type: "like", message: "Carlos M liked your post", is_read: false },
  { user_email: "maya.johnson@ourspace.app", from_email: "priya.k@ourspace.app", from_name: "Priya K 🌸", type: "comment", message: "Priya K commented on your post", is_read: false },
  { user_email: "carlos.m@ourspace.app", from_email: "maya.johnson@ourspace.app", from_name: "Maya J ✨", type: "wall_post", message: "Maya J left a message on your wall", is_read: true },
  { user_email: "aisha.r@ourspace.app", from_email: "priya.k@ourspace.app", from_name: "Priya K 🌸", type: "friend_request", message: "Priya K wants to be your friend", is_read: false },
];

export default function SeedOurSpace() {
  const [status, setStatus] = useState("idle");
  const [log, setLog] = useState([]);
  const [done, setDone] = useState(false);

  const addLog = (msg) => setLog(prev => [...prev, msg]);

  const runSeed = async () => {
    setStatus("running");
    setLog([]);
    try {
      addLog("⏳ Seeding profiles...");
      await Promise.all(PROFILES.map(p => Profile.create(p)));
      addLog(`✅ ${PROFILES.length} profiles created`);

      addLog("⏳ Seeding posts...");
      await Promise.all(POSTS.map(p => Post.create(p)));
      addLog(`✅ ${POSTS.length} posts created`);

      addLog("⏳ Seeding friendships...");
      await Promise.all(FRIENDS.map(f => Friend.create(f)));
      addLog(`✅ ${FRIENDS.length} friendships created`);

      addLog("⏳ Seeding wall posts...");
      await Promise.all(WALL_POSTS.map(w => WallPost.create(w)));
      addLog(`✅ ${WALL_POSTS.length} wall posts created`);

      addLog("⏳ Seeding notifications...");
      await Promise.all(NOTIFICATIONS.map(n => Notification.create(n)));
      addLog(`✅ ${NOTIFICATIONS.length} notifications created`);

      addLog("🎉 All done! OurSpace 2.0 is fully seeded.");
      setStatus("done");
      setDone(true);
    } catch (e) {
      addLog(`❌ Error: ${e.message}`);
      setStatus("error");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d1a", color: "#f0f0f0", fontFamily: "'Segoe UI', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 480, width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>🌐</div>
          <h1 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 8px", background: "linear-gradient(90deg, #c084fc, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Seed Demo Data
          </h1>
          <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>
            Populates OurSpace 2.0 with 5 profiles, 7 posts, friends, wall posts & notifications.
          </p>
        </div>

        {status === "idle" && (
          <button
            onClick={runSeed}
            style={{ width: "100%", padding: "16px", background: "linear-gradient(135deg, #c084fc, #22d3ee)", border: "none", borderRadius: 12, color: "#000", fontWeight: 900, fontSize: 18, cursor: "pointer" }}
          >
            🚀 Seed Everything
          </button>
        )}

        {status === "running" && (
          <div style={{ background: "#16162a", borderRadius: 12, padding: 20, border: "1px solid #2a2a45" }}>
            <div style={{ fontSize: 14, color: "#c084fc", fontWeight: 700, marginBottom: 12 }}>Running...</div>
            {log.map((l, i) => <div key={i} style={{ fontSize: 13, color: "#94a3b8", padding: "4px 0", borderBottom: "1px solid #1e1e35" }}>{l}</div>)}
          </div>
        )}

        {(status === "done" || status === "error") && (
          <div style={{ background: "#16162a", borderRadius: 12, padding: 20, border: `1px solid ${status === "done" ? "#4ade80" : "#f87171"}30` }}>
            {log.map((l, i) => <div key={i} style={{ fontSize: 13, color: l.startsWith("✅") || l.startsWith("🎉") ? "#4ade80" : l.startsWith("❌") ? "#f87171" : "#94a3b8", padding: "4px 0" }}>{l}</div>)}
            {done && (
              <div style={{ marginTop: 16, padding: 12, background: "#0f2e1a", borderRadius: 8, color: "#4ade80", fontSize: 13, textAlign: "center" }}>
                ✅ Delete this page from your app once seeding is complete!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
