# 🌐 OurSpace 2.0 — Developer README

> A human-first social platform — chronological feed, no algorithms, no surveillance
> **Indianapolis, Indiana** · Built for authentic connection

---

## 📌 Project Overview

OurSpace 2.0 is a social networking platform inspired by early social media (MySpace era), designed with modern privacy standards. It features a **strictly chronological feed** (no algorithmic profiling), real-time messaging, profile customization, and a **Human-Only Filter** that lets users see only content created by humans (not AI).

**Live App:** https://our-space-vibes.base44.app  
**Platform:** Base44 (React frontend + managed backend)  
**Bundle ID:** `com.ourspace2.app`

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background | `#0d0d1a` (dark navy) |
| Primary Gradient | `#c084fc → #22d3ee` (purple → cyan) |
| Card Background | `#13132b` |
| Border | `#2a2a45` |
| Text Primary | `#f0f0f0` |
| Text Muted | `#94a3b8` |
| Font | Segoe UI, system-ui, sans-serif |

---

## 📱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 (Base44 platform) |
| Routing | React Router v6 |
| Styling | Inline CSS (no external library) |
| Backend | Base44 managed backend (entities, functions) |
| Auth | localStorage-based (`os2_email`, `os2_name`) |
| Analytics | Google Analytics 4 (ID: G-1N8GD2WM6L) — consent-gated |
| Mobile Wrapper | **Capacitor** (target: iOS 16+ / Android 11+) |
| CI/CD | GitHub Actions (`.github/workflows/ci.yml`) |

---

## 📁 Project Structure

```
pages/
  SplashScreen.jsx          # Entry point — routes to onboarding or home
  OurSpaceOnboarding.jsx    # Multi-step onboarding: age gate, consent, setup
  OurSpace.jsx              # Main home feed (chronological)
  Profile.jsx               # User profile (customizable, wall posts)
  MyProfile.jsx             # Logged-in user's own profile
  Messages.jsx              # Direct messaging system
  Notifications.jsx         # Notifications (likes, comments, friends, wall)
  Discover.jsx              # Search users + posts
  Settings.jsx              # Privacy controls, account settings, deletion
  ReportContent.jsx         # Content reporting form
  PrivacyPolicy.jsx         # GDPR/CCPA/COPPA privacy policy
  TermsOfService.jsx        # Full terms of service (DMCA, AI policy, CSAM)
  ContentPolicy.jsx         # Community guidelines + enforcement tiers
  OurSpacePrivacyPolicy.jsx # Alternate standalone privacy page
  Onboarding.jsx            # Guest onboarding entry

entities/
  Profile.json              # User profile data (bio, links, avatar, theme)
  Post.json                 # Posts (text, images, videos, AI-tagged)
  Comment.json              # Post comments (threaded)
  Friend.json               # Friend requests and connections
  Message.json              # Direct messages (sender, receiver, read state)
  WallPost.json             # Wall posts on profiles
  Notification.json         # User notifications
  Story.json                # 24-hour expiring stories
  ReportedContent.json      # Content moderation reports

functions/
  getPublicFeed.ts          # Paginated public post feed (service role)
  getPublicDiscover.ts      # User + post discovery function
  userTracker.ts            # GA4 sync + user count tracking
  systemDiagnostic.ts       # OurSpace health check (paused until May 4)
  weeklyAnalyticsReport.ts  # Shared with LC — weekly traffic report
```

---

## 🔑 Local Storage Keys

| Key | Description |
|-----|-------------|
| `os2_email` | Logged-in user's email address |
| `os2_name` | Logged-in user's display name |
| `os2_avatar` | User's avatar emoji or URL |
| `os2_onboarded` | Whether user completed onboarding |
| `os2_theme` | Selected color theme |
| `os2_analytics_consent` | User's GA4 consent decision |
| `os2_age_verified` | Age verification status |
| `os2_parent_consent` | Parental consent for 13–17 users |

---

## ✨ Key Features

- **Chronological Feed** — no algorithm, no behavioral profiling, posts appear in reverse time order
- **Stories** — 24-hour expiring media posts with polls, music, stickers
- **Profiles** — fully customizable: avatar, cover photo, bio, mood, song, color theme, gradient
- **Wall Posts** — users can post on each other's profiles (MySpace-style)
- **Human-Only Filter** — toggle to show only non-AI-tagged content
- **AI Content Labeling** — posts can be marked `🤖 AI Generated`
- **Messaging** — direct messages between users
- **Content Reporting** — tiered enforcement: warning → suspension → ban + NCMEC
- **Age Gate** — 13+ minimum, parental consent required for 13–17
- **Guest Mode** — view public feed before signing up

---

## 📲 Capacitor Setup (Mobile Developer)

### Prerequisites
- Node.js 18+
- Xcode 15+ (for iOS)
- Android Studio Giraffe+ (for Android)
- Apple Developer Account ($99/yr) — Dixson to provide
- Google Play Developer Account ($25) — Dixson to provide

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/ddortese-pixel/OurSpace-Vibes.git
cd OurSpace-Vibes

# 2. Install dependencies
npm install

# 3. Initialize Capacitor
npm install @capacitor/core @capacitor/cli
npx cap init "OurSpace" "com.ourspace2.app" --web-dir=dist

# 4. Add platforms
npm install @capacitor/ios @capacitor/android
npx cap add ios
npx cap add android

# 5. Sync to native (uses live hosted app)
npx cap sync

# 6. Open in Xcode / Android Studio
npx cap open ios
npx cap open android
```

### capacitor.config.ts (use this config)
```ts
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ourspace2.app',
  appName: 'OurSpace',
  webDir: 'dist',
  server: {
    url: 'https://our-space-vibes.base44.app',
    cleartext: false
  },
  ios: {
    contentInset: 'automatic'
  },
  android: {
    allowMixedContent: false
  }
};

export default config;
```

> **Note:** Use the `server.url` approach — the native shell loads the live hosted web app. This avoids needing a build pipeline and keeps the app automatically up to date.

---

## 🍎 App Store Requirements

### Apple App Store
- **Age Rating:** 12+ (social networking, user-generated content)
- **Required Entitlements:** Push Notifications (future), Camera (for stories)
- **Privacy Label (required fields):**
  - Contact Info: Email address — optional, linked to account
  - User Content: Photos/videos, posts, messages
  - Identifiers: User ID
  - Usage Data: Product interaction
  - Data Not Sold to Third Parties ✅
  - Data Not Used for Tracking ✅
- **App Privacy URL:** https://our-space-vibes.base44.app/PrivacyPolicy
- **Support URL:** mailto:ddortese@gmail.com
- **Review Notes for Apple:** "This is a social networking platform for users 13+. Age verification and parental consent are implemented for users 13–17. Content moderation includes CSAM detection and NCMEC reporting. The app uses a strictly chronological feed with no behavioral advertising."

### Google Play Store
- **Target Audience:** Teens (13+) and Adults
- **Content Rating:** Teen
- **Data Safety Form:**
  - Data collected: Email (required), display name (required), user content (photos, posts, messages)
  - Data shared: None
  - Security practices: Data encrypted in transit and at rest, user can request deletion
- **Privacy Policy URL:** https://our-space-vibes.base44.app/PrivacyPolicy

---

## ⚖️ Legal & Compliance

| Law / Standard | Status |
|----------------|--------|
| COPPA (15 U.S.C. §§ 6501–6506) | ✅ No users under 13; parental consent for 13–17 |
| CCPA (California) | ✅ No data sale, deletion rights disclosed, opt-out available |
| GDPR (EU/EEA) | ✅ Consent banner, right to erasure, SCCs for data transfers |
| DMCA (17 U.S.C. § 512) | ✅ Takedown procedure documented in Terms of Service |
| Section 230 (47 U.S.C. § 230) | ✅ Platform not liable for user-generated content |
| KOSA (Kids Online Safety Act) | ✅ Aligned — default high privacy for minors, no profiling |
| CSAM Zero Tolerance | ✅ NCMEC CyberTipline reporting, immediate account ban |
| ADA / WCAG 2.1 AA | 🔄 Target compliance — developer should test with VoiceOver/TalkBack |

---

## 🔐 Security Notes

- All API calls use HTTPS (TLS 1.3)
- Sensitive data at rest encrypted AES-256 (Base44 platform)
- No advertising SDKs or third-party trackers
- Analytics only with user consent
- Message content stored server-side, not end-to-end encrypted (disclosed in Privacy Policy)
- Users can delete ALL data (posts, messages, profile) from Settings

---

## 📧 Key Contacts

| Role | Contact |
|------|---------|
| Founder / Product Owner | Dixson Dortese · ddortese@gmail.com · 317-969-9085 |
| Platform | Base44 (base44.com) |
| Analytics | GA4 — G-1N8GD2WM6L |
| Safety/DMCA/Appeals | ddortese@gmail.com |

---

## 🚀 App Store Assets

All app store assets are ready:
- ✅ App Icon: 1024×1024 PNG
- ✅ Splash Screen / Landing Page
- ✅ iPhone Screenshots (4 variants: feed, profile, messaging, banner)
- ✅ Google Play Feature Graphic (1024×500)
- ✅ App Store listing copy, keywords, description

---

## 🔄 CI/CD

GitHub Actions runs on every push to `main`:
- Checks out code
- Runs `npm install`
- Runs `npm test --if-present`
- Validates build

See `.github/workflows/ci.yml`

---

## ⚠️ Known Issues / Developer Notes

1. **Authentication** — App uses `localStorage` for identity (`os2_email`, `os2_name`). This is intentional for a frictionless guest-first experience. For native builds, consider supplementing with Capacitor Preferences plugin for more persistent storage.

2. **Push Notifications** — Not yet implemented. Future feature — use Firebase Cloud Messaging (FCM) + `@capacitor/push-notifications`.

3. **Story Expiry** — Stories expire after 24 hours client-side based on `expires_at`. An automated cleanup function should be added to the backend.

4. **Image Uploads** — Profile photos use URL-based references. For native, add `@capacitor/camera` for real camera/gallery access.

---

## 💰 Budget & Timeline

- Developer budget: $200–$500 for Capacitor wrapping + app store submission
- Target: iOS + Android builds, TestFlight beta + Google Play Open Testing
- Timeline: ASAP — contact Dixson at ddortese@gmail.com or 317-969-9085

---

*Last updated: April 2026*
