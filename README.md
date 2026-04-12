# 🌐 OurSpace Vibes

> **The social network built for humans. No algorithms. No data selling. No manipulation.**
>
> Live: [legacy-circle.base44.app](https://legacy-circle.base44.app/Home) · 10,000+ Members · App Store Ready

[![Status](https://img.shields.io/badge/status-live-brightgreen)](https://legacy-circle.base44.app)
[![Members](https://img.shields.io/badge/members-10%2C000%2B-purple)](https://legacy-circle.base44.app/Discover)
[![Legal](https://img.shields.io/badge/compliance-GDPR%20%7C%20CCPA%20%7C%20COPPA-blue)](https://legacy-circle.base44.app/PrivacyPolicy)
[![App Store](https://img.shields.io/badge/app%20store-ready-orange)](https://legacy-circle.base44.app/AppStoreReadiness)

---

## What Is OurSpace Vibes?

OurSpace Vibes is a full-featured social networking platform designed as the anti-algorithm alternative to mainstream social media. Built on the belief that the internet should be human-first, OurSpace delivers:

- 📰 **Chronological Feed** — See posts in order. Zero algorithm manipulation.
- 🔒 **E2EE Messaging (The Shield)** — End-to-end encrypted DMs we literally cannot read.
- ✅ **Human-Only Filter** — Toggle to see only verified human-created content.
- 🎨 **Customizable Profiles** — Themes, moods, guestbook walls, music, widgets.
- 📖 **Serialized Stories** — Follow creators through chapters and episodes.
- 🔔 **Real-Time Notifications** — Likes, comments, friend requests, wall posts.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (JSX), deployed via Base44 |
| Backend | Deno/TypeScript serverless functions |
| Database | Base44 managed entities (JSON schema) |
| Analytics | Google Analytics 4 (G-1N8GD2WM6L) |
| SEO | Google Search Console, sitemap.xml, robots.txt |
| CI/CD | GitHub (this repo) ↔ Base44 auto-sync |
| Mobile | Capacitor (iOS + Android — in progress) |
| Bundle ID | `com.ourspace2.app` |

---

## Live App Pages

| Route | Description |
|-------|-------------|
| `/SplashScreen` | Animated entry screen, routing logic |
| `/OurSpaceOnboarding` | 6-step onboarding: age gate → social proof → features → vibe → name → welcome |
| `/Home` | Chronological feed, stories bar, post composer |
| `/Discover` | Trending, people search, posts search |
| `/Messages` | E2EE direct messaging |
| `/Notifications` | Likes, comments, friend requests, wall posts |
| `/MyProfile` | Your profile editor |
| `/Profile` | Public profile view |
| `/Settings` | Privacy, notifications, legal links |
| `/PrivacyPolicy` | GDPR + CCPA + COPPA compliant |
| `/TermsOfService` | 20-section ToS with DMCA, CSAM, AI policy |
| `/ContentPolicy` | Tiered enforcement + NCMEC reporting |
| `/ReportContent` | In-app content reporting |
| `/AppStoreReadiness` | Submission checklist tracker |

---

## Data Entities

| Entity | Purpose |
|--------|---------|
| `Profile` | User profiles, themes, customization |
| `Post` | Feed posts with AI labeling, series support |
| `Comment` | Nested comments with likes |
| `Story` | 24h expiring stories with polls |
| `Message` | E2EE DMs with conversation threading |
| `Friend` | Friend requests and connections |
| `WallPost` | Guestbook wall messages |
| `Notification` | Real-time activity notifications |
| `ReportedContent` | Moderation queue |
| `DiagnosticLog` | System health monitoring |

---

## Backend Functions

| Function | Description |
|----------|-------------|
| `getPublicFeed` | Public chronological feed (no auth required) |
| `getPublicDiscover` | Public people + posts search |
| `systemDiagnostic` | Full health check, auto-fix expired stories/orphans |
| `weeklyAnalyticsReport` | GA4 + Search Console weekly email report |
| `seedOurSpace` | Demo content seeder |
| `getMilestones` | Launch tracker data |
| `updateMilestone` | Milestone status updater |

---

## Automations (Active)

| Name | Schedule | Purpose |
|------|----------|---------|
| System Diagnostic — Morning | Daily ~10am ET | Health check + auto-fix |
| System Diagnostic — Afternoon | Daily ~3pm ET | Health check + auto-fix |
| System Diagnostic — Late Night | Daily ~12:30am ET | Health check + auto-fix |
| System Diagnostic — Midweek | Tue/Thu | Health check + auto-fix |
| Weekly Analytics Report | Every Monday 9am ET | GA4 + Search Console email to Dixson |
| LinkedIn CTA Posts | Every 2 days 10am ET | Alternating promotional posts |

---

## Legal Compliance

| Standard | Status |
|----------|--------|
| GDPR (EU/EEA) | ✅ Full — Art.13/14, right to erasure, portability, DPO contact |
| CCPA (California) | ✅ Full — opt-out, deletion, non-discrimination |
| COPPA (Under 13) | ✅ Full — age gate, parental consent, no data collection under 13 |
| DMCA | ✅ Full — takedown process at dmca@ourspace.app |
| CSAM | ✅ Zero tolerance — NCMEC CyberTipline reporting protocol |
| AI Transparency | ✅ Mandatory labeling, Human-Only Filter |

---

## App Store Submission Checklist

### ✅ Complete
- [x] Privacy Policy (GDPR/CCPA/COPPA)
- [x] Terms of Service (20 sections, DMCA, CSAM, AI policy)
- [x] Content Moderation Policy (tiered enforcement + appeals)
- [x] Age gate (13+, parental consent under 18)
- [x] App icon (1024×1024)
- [x] App Store listing copy + keywords
- [x] Onboarding flow (6 steps)
- [x] All core features working
- [x] Google Analytics connected
- [x] Search Console connected
- [x] Sitemap submitted
- [x] Demo content seeded

### 🔲 Remaining
- [ ] Apple Developer Account ($99/yr)
- [ ] Google Play Developer Account ($25 one-time)
- [ ] Capacitor native build (iOS + Android)
- [ ] Push notifications (Firebase Cloud Messaging + APNs)
- [ ] TestFlight beta test
- [ ] App Store + Google Play submission

---

## Developer Brief (Capacitor)

See [`docs/capacitor-developer-brief.md`](./docs/capacitor-developer-brief.md)

Budget: $200–$500 | Platform: Upwork / Fiverr
Bundle ID: `com.ourspace2.app`
Source: This repo (`ddortese-pixel/OurSpace-Vibes`)

---

## Contact

**Developer:** Dixson Dortese
**Email:** ddortese@gmail.com
**Privacy:** privacy@ourspace.app
**Legal:** legal@ourspace.app
**Safety/DMCA:** safety@ourspace.app
**App:** https://legacy-circle.base44.app

---

*© 2026 OurSpace Vibes. All rights reserved. Built with Base44.*
