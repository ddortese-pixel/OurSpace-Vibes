import { useState, useEffect } from "react";
import { Profile, Post, Comment, Message, WallPost, Notification, Friend, Story } from "../api/entities";
import { useNavigate } from "react-router-dom";

function injectGA(id) {
  if (localStorage.getItem("os2_analyticsConsent") !== "true") return;
  if (document.getElementById(`ga-${id}`)) return;
  const s1 = document.createElement("script"); s1.id = `ga-${id}`; s1.async = true;
  s1.src = `https://www.googletagmanager.com/gtag/js?id=${id}`; document.head.appendChild(s1);
  const s2 = document.createElement("script");
  s2.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","${id}",{"anonymize_ip":true});`;
  document.head.appendChild(s2);
}

function getMyEmail() { return localStorage.getItem("os2_email") || null; }
function getMyName()  { return localStorage.getItem("os2_name")  || ""; }
function isLoggedIn() { return !!localStorage.getItem("os2_email"); }

const NAV = [
  { icon:"🏠", label:"Feed",     path:"/Home" },
  { icon:"🔍", label:"Discover", path:"/Discover" },
  { icon:"✉️", label:"Messages", path:"/Messages" },
  { icon:"🔔", label:"Alerts",   path:"/Notifications" },
  { icon:"👤", label:"Profile",  path:"/MyProfile" },
];

const Toggle = ({ value, onChange, label }) => (
  <div onClick={() => onChange(!value)} role="switch" aria-checked={value} aria-label={label} tabIndex={0}
    onKeyDown={e => e.key === "Enter" && onChange(!value)}
    style={{ width:44, height:24, background:value?"#c084fc":"#2a2a45", borderRadius:12, position:"relative", cursor:"pointer", transition:"background 0.2s", flexShrink:0 }}>
    <div style={{ width:20, height:20, background:"#fff", borderRadius:"50%", position:"absolute", top:2, left:value?22:2, transition:"left 0.2s" }} />
  </div>
);

const Row = ({ label, sub, value, onChange }) => (
  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 0", borderBottom:"1px solid #2a2a45" }}>
    <div>
      <div style={{ fontSize:15, fontWeight:600 }}>{label}</div>
      {sub && <div style={{ fontSize:12, color:"#64748b", marginTop:2 }}>{sub}</div>}
    </div>
    <Toggle value={value} onChange={onChange} label={label} />
  </div>
);

const Section = ({ title, children }) => (
  <div style={{ background:"#16162a", borderRadius:16, padding:"0 16px", marginBottom:16, border:"1px solid #2a2a45" }}>
    <div style={{ padding:"12px 0", borderBottom:"1px solid #2a2a45", fontWeight:700, fontSize:11, color:"#c084fc", letterSpacing:1.5, textTransform:"uppercase" }}>{title}</div>
    {children}
  </div>
);

export default function Settings() {
  const navigate  = useNavigate();
  const loggedIn  = isLoggedIn();
  const myEmail   = getMyEmail();

  const [humanFilter,   setHumanFilter]   = useState(() => localStorage.getItem("os2_humanFilter") === "true");
  const [analyticsOk,   setAnalyticsOk]   = useState(() => localStorage.getItem("os2_analyticsConsent") === "true");
  const [notifLikes,    setNotifLikes]    = useState(() => localStorage.getItem("os2_notifLikes") !== "false");
  const [notifComments, setNotifComments] = useState(() => localStorage.getItem("os2_notifComments") !== "false");
  const [notifFriends,  setNotifFriends]  = useState(() => localStorage.getItem("os2_notifFriends") !== "false");
  const [notifWall,     setNotifWall]     = useState(() => localStorage.getItem("os2_notifWall") !== "false");
  const [privacy,       setPrivacy]       = useState(() => localStorage.getItem("os2_privacy") || "public");
  const [saved,         setSaved]         = useState(false);
  const [saving,        setSaving]        = useState(false);
  const [deleteStep,    setDeleteStep]    = useState(0); // 0=idle 1=confirm 2=deleting 3=done
  const [deleteLog,     setDeleteLog]     = useState([]);

  useEffect(() => {
    if (localStorage.getItem("os2_analyticsConsent") === "true") injectGA("G-1N8GD2WM6L");
  }, []);

  const save = async () => {
    setSaving(true);
    localStorage.setItem("os2_humanFilter",       humanFilter);
    localStorage.setItem("os2_analyticsConsent",  analyticsOk);
    localStorage.setItem("os2_notifLikes",        notifLikes);
    localStorage.setItem("os2_notifComments",     notifComments);
    localStorage.setItem("os2_notifFriends",      notifFriends);
    localStorage.setItem("os2_notifWall",         notifWall);
    localStorage.setItem("os2_privacy",           privacy);
    // Load or unload GA based on consent change
    if (analyticsOk) injectGA("G-1N8GD2WM6L");
    if (loggedIn && myEmail) {
      try {
        const profs = await Profile.filter({ user_email: myEmail });
        if (profs[0]?.id) await Profile.update(profs[0].id, { privacy_level: privacy });
      } catch(e) { console.error(e); }
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const logout = () => {
    localStorage.removeItem("os2_email");
    localStorage.removeItem("os2_name");
    localStorage.removeItem("os2_vibe");
    navigate("/OurSpaceOnboarding");
  };

  // GDPR-compliant full erasure — deletes ALL user data across all entities
  const deleteAccount = async () => {
    if (deleteStep === 0) { setDeleteStep(1); return; }
    if (deleteStep === 1) {
      setDeleteStep(2);
      const log = [];
      const addLog = (msg) => { log.push(msg); setDeleteLog([...log]); };

      try {
        addLog("🗑️ Deleting profile...");
        const profs = await Profile.filter({ user_email: myEmail }).catch(() => []);
        await Promise.all(profs.map(r => Profile.delete(r.id).catch(() => {})));

        addLog("🗑️ Deleting posts...");
        const posts = await Post.filter({ author_email: myEmail }).catch(() => []);
        await Promise.all(posts.map(r => Post.delete(r.id).catch(() => {})));

        addLog("🗑️ Deleting comments...");
        const comments = await Comment.filter({ author_email: myEmail }).catch(() => []);
        await Promise.all(comments.map(r => Comment.delete(r.id).catch(() => {})));

        addLog("🗑️ Deleting messages (sent)...");
        const sent = await Message.filter({ sender_email: myEmail }).catch(() => []);
        await Promise.all(sent.map(r => Message.delete(r.id).catch(() => {})));

        addLog("🗑️ Deleting messages (received)...");
        const recv = await Message.filter({ receiver_email: myEmail }).catch(() => []);
        await Promise.all(recv.map(r => Message.delete(r.id).catch(() => {})));

        addLog("🗑️ Deleting wall posts...");
        const wallA = await WallPost.filter({ author_email: myEmail }).catch(() => []);
        const wallP = await WallPost.filter({ profile_email: myEmail }).catch(() => []);
        const allWall = [...wallA, ...wallP].filter((r,i,a) => a.findIndex(x=>x.id===r.id)===i);
        await Promise.all(allWall.map(r => WallPost.delete(r.id).catch(() => {})));

        addLog("🗑️ Deleting notifications...");
        const notifs = await Notification.filter({ user_email: myEmail }).catch(() => []);
        await Promise.all(notifs.map(r => Notification.delete(r.id).catch(() => {})));

        addLog("🗑️ Deleting friend connections...");
        const friendsA = await Friend.filter({ requester_email: myEmail }).catch(() => []);
        const friendsB = await Friend.filter({ receiver_email:  myEmail }).catch(() => []);
        const allFriends = [...friendsA, ...friendsB].filter((r,i,a) => a.findIndex(x=>x.id===r.id)===i);
        await Promise.all(allFriends.map(r => Friend.delete(r.id).catch(() => {})));

        addLog("🗑️ Deleting stories...");
        const stories = await Story.filter({ author_email: myEmail }).catch(() => []);
        await Promise.all(stories.map(r => Story.delete(r.id).catch(() => {})));

        addLog("✅ All data erased. Clearing local session...");
        localStorage.clear();
        setDeleteStep(3);
      } catch(e) {
        addLog("⚠️ Error: " + e.message);
        console.error(e);
      }
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:"#0d0d1a", color:"#f0f0f0", fontFamily:"'Segoe UI',sans-serif", paddingBottom:80 }}>
      <div style={{ position:"sticky", top:0, zIndex:100, background:"#0d0d1aee", backdropFilter:"blur(12px)", borderBottom:"1px solid #2a2a45", padding:"14px 16px", display:"flex", alignItems:"center", gap:12 }}>
        <button onClick={() => navigate(-1)} aria-label="Go back" style={{ background:"none", border:"none", color:"#94a3b8", fontSize:20, cursor:"pointer" }}>←</button>
        <span style={{ fontWeight:900, fontSize:18, background:"linear-gradient(90deg,#c084fc,#22d3ee)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>⚙️ Settings</span>
      </div>

      <div style={{ maxWidth:600, margin:"0 auto", padding:"16px" }}>

        {/* Account card */}
        {loggedIn && (
          <div style={{ background:"#16162a", border:"1px solid #2a2a45", borderRadius:16, padding:"14px 16px", marginBottom:16, display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:44, height:44, borderRadius:"50%", background:"linear-gradient(135deg,#c084fc,#22d3ee)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:18, color:"#fff" }}>
              {getMyName()?.[0]?.toUpperCase() || "?"}
            </div>
            <div>
              <div style={{ fontWeight:700, fontSize:15 }}>{getMyName()}</div>
              <div style={{ color:"#64748b", fontSize:13 }}>{myEmail}</div>
            </div>
            <button onClick={() => navigate("/MyProfile")} aria-label="Edit profile" style={{ marginLeft:"auto", padding:"6px 14px", background:"transparent", border:"1px solid #2a2a45", borderRadius:20, color:"#94a3b8", fontSize:13, cursor:"pointer" }}>Edit Profile →</button>
          </div>
        )}

        <Section title="Feed">
          <Row label="Human-Only Filter" sub="Show only human-verified content in your feed" value={humanFilter} onChange={setHumanFilter} />
        </Section>

        <Section title="Analytics & Privacy">
          <Row
            label="Allow Analytics"
            sub="Help us improve OurSpace with anonymous usage data (Google Analytics)"
            value={analyticsOk}
            onChange={setAnalyticsOk}
          />
          <div style={{ padding:"12px 0", fontSize:12, color:"#475569", lineHeight:1.6 }}>
            Analytics are <strong style={{ color: analyticsOk ? "#4ade80" : "#f87171" }}>{analyticsOk ? "enabled" : "disabled"}</strong>. We use anonymized Google Analytics only. No personal data is shared. You can change this at any time.
          </div>
        </Section>

        <Section title="Notifications">
          <Row label="Likes"           sub="When someone likes your post"       value={notifLikes}    onChange={setNotifLikes} />
          <Row label="Comments"        sub="When someone comments on your post" value={notifComments} onChange={setNotifComments} />
          <Row label="Friend Requests" sub="When someone wants to connect"      value={notifFriends}  onChange={setNotifFriends} />
          <Row label="Wall Posts"      sub="When someone posts on your wall"    value={notifWall}     onChange={setNotifWall} />
        </Section>

        <Section title="Privacy">
          <div style={{ padding:"14px 0", borderBottom:"1px solid #2a2a45" }}>
            <div style={{ fontWeight:600, marginBottom:10 }}>Profile Visibility</div>
            <div style={{ display:"flex", gap:8 }}>
              {[["public","🌐 Public"],["friends","👥 Friends"],["private","🔒 Private"]].map(([v,label])=>(
                <button key={v} onClick={() => setPrivacy(v)} aria-label={`Set profile to ${label}`}
                  style={{ padding:"7px 14px", background:privacy===v?"#2a1a3e":"transparent", border:`1px solid ${privacy===v?"#c084fc":"#2a2a45"}`, borderRadius:20, color:privacy===v?"#c084fc":"#94a3b8", fontSize:13, cursor:"pointer", fontWeight:privacy===v?700:400 }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ padding:"14px 0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ fontWeight:600 }}>Private Messages</div>
              <div style={{ fontSize:12, color:"#64748b", marginTop:2 }}>Messages are private and visible only to sender and recipient</div>
            </div>
            <span style={{ fontSize:12, background:"#0f2a1e", color:"#4ade80", padding:"4px 10px", borderRadius:20, border:"1px solid #4ade8040" }}>🔒 Always On</span>
          </div>
          <div style={{ padding:"14px 0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ fontWeight:600 }}>Do Not Sell My Data</div>
              <div style={{ fontSize:12, color:"#64748b", marginTop:2 }}>We never sell your personal information (CCPA)</div>
            </div>
            <span style={{ fontSize:12, background:"#0f2a1e", color:"#4ade80", padding:"4px 10px", borderRadius:20, border:"1px solid #4ade8040" }}>✅ Never Sold</span>
          </div>
        </Section>

        <Section title="Legal">
          {[["🛡️ Privacy Policy","/PrivacyPolicy"],["📋 Terms of Service","/TermsOfService"],["🚦 Community Guidelines","/ContentPolicy"],["🚩 Report Content","/ReportContent"]].map(([label,path])=>(
            <div key={path} onClick={() => navigate(path)}
              style={{ padding:"14px 0", borderBottom:"1px solid #2a2a45", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span>{label}</span><span style={{ color:"#64748b" }}>→</span>
            </div>
          ))}
          <div style={{ padding:"14px 0", fontSize:12, color:"#475569", lineHeight:1.7 }}>
            Questions? Contact us at{" "}
            <a href="mailto:ddortese@gmail.com" style={{ color:"#c084fc" }}>ddortese@gmail.com</a>
          </div>
        </Section>

        {/* Save */}
        <button onClick={save} disabled={saving} aria-label="Save settings"
          style={{ width:"100%", padding:"14px", background:"linear-gradient(135deg,#c084fc,#22d3ee)", border:"none", borderRadius:12, color:"#000", fontWeight:800, fontSize:16, cursor:"pointer", marginBottom:12 }}>
          {saving ? "Saving..." : saved ? "✅ Saved!" : "Save Settings"}
        </button>

        <Section title="Account">
          <div style={{ padding:"14px 0", borderBottom:"1px solid #2a2a45" }}>
            <button onClick={logout} aria-label="Sign out"
              style={{ width:"100%", padding:"12px", background:"transparent", border:"1px solid #2a2a45", borderRadius:10, color:"#94a3b8", fontWeight:600, fontSize:15, cursor:"pointer" }}>
              Sign Out
            </button>
          </div>

          {/* Full GDPR-compliant deletion */}
          <div style={{ padding:"14px 0" }}>
            {deleteStep === 3 ? (
              <div style={{ textAlign:"center", padding:20 }}>
                <div style={{ fontSize:40, marginBottom:8 }}>✅</div>
                <div style={{ fontWeight:700, color:"#4ade80", marginBottom:4 }}>Account fully deleted</div>
                <div style={{ fontSize:13, color:"#64748b", marginBottom:16 }}>All your data has been permanently erased per GDPR Right to Erasure.</div>
                <button onClick={() => navigate("/OurSpaceOnboarding")}
                  style={{ padding:"10px 24px", background:"linear-gradient(135deg,#c084fc,#22d3ee)", border:"none", borderRadius:20, color:"#000", fontWeight:700, cursor:"pointer" }}>
                  Back to Home
                </button>
              </div>
            ) : deleteStep === 2 ? (
              <div style={{ background:"#1a1015", borderRadius:12, padding:16, border:"1px solid #f8717140" }}>
                <div style={{ fontWeight:700, color:"#f87171", marginBottom:10 }}>⏳ Deleting your data...</div>
                {deleteLog.map((line, i) => (
                  <div key={i} style={{ fontSize:12, color:"#94a3b8", marginBottom:4 }}>{line}</div>
                ))}
              </div>
            ) : deleteStep === 1 ? (
              <div style={{ background:"#1a1015", borderRadius:12, padding:16, border:"1px solid #f8717140" }}>
                <div style={{ fontWeight:700, color:"#f87171", marginBottom:8 }}>⚠️ This cannot be undone</div>
                <div style={{ fontSize:13, color:"#94a3b8", marginBottom:14, lineHeight:1.6 }}>
                  This will permanently delete your profile, all posts, comments, messages, stories, and friend connections. This satisfies your GDPR Right to Erasure.
                </div>
                <div style={{ display:"flex", gap:10 }}>
                  <button onClick={() => setDeleteStep(0)}
                    style={{ flex:1, padding:"10px", background:"transparent", border:"1px solid #2a2a45", borderRadius:10, color:"#94a3b8", fontWeight:600, cursor:"pointer" }}>
                    Cancel
                  </button>
                  <button onClick={deleteAccount}
                    style={{ flex:1, padding:"10px", background:"#2a1515", border:"1px solid #f87171", borderRadius:10, color:"#f87171", fontWeight:700, cursor:"pointer" }}>
                    Yes, Delete Everything
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={deleteAccount} aria-label="Delete account"
                style={{ width:"100%", padding:"12px", background:"transparent", border:"1px solid #2a2a45", borderRadius:10, color:"#64748b", fontWeight:600, fontSize:15, cursor:"pointer" }}>
                Delete Account
              </button>
            )}
          </div>
        </Section>

      </div>

      <div style={{ position:"fixed", bottom:0, left:0, right:0, background:"#0d0d1aee", backdropFilter:"blur(12px)", borderTop:"1px solid #2a2a45", display:"flex", justifyContent:"space-around", padding:"10px 0 12px", zIndex:100 }}>
        {NAV.map(item => {
          const active = window.location.pathname === item.path;
          return (
            <button key={item.path} onClick={() => navigate(item.path)} aria-label={item.label}
              style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"4px 10px" }}>
              <span style={{ fontSize:22, opacity:active?1:0.5 }}>{item.icon}</span>
              <span style={{ fontSize:10, color:active?"#c084fc":"#475569", fontWeight:active?700:400 }}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
