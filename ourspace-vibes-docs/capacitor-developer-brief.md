# OurSpace 2.0 — Capacitor Developer Brief
## Native App Wrap for iOS & Android App Store Submission

---

## Project Summary

**App:** OurSpace 2.0 — social networking platform
**Live URL:** https://our-space-vibes.base44.app
**GitHub Repo:** https://github.com/ddortese-pixel/OurSpace-Vibes (set up during this project)
**Users:** 10,000+ active users on web
**Goal:** Wrap the existing web app into native iOS and Android builds and submit to both app stores

---

## What You're Wrapping

This is a **Base44-hosted React web application** with:
- Full authentication (Google OAuth + email/password via Base44)
- Real-time social features (feed, messaging, profiles, stories, notifications)
- End-to-end encrypted messaging
- REST API backend (Base44 managed)
- Responsive mobile-first design

The app is **already fully functional and mobile-optimized** — this job is purely the native wrapper + submission.

---

## Deliverables Required

### Phase 1 — Capacitor Setup (3–5 days)
- [ ] Initialize Capacitor in the GitHub repo (`npx cap init`)
- [ ] Configure `capacitor.config.ts` with correct app ID: `com.ourspace2.app`
- [ ] Add iOS platform (`npx cap add ios`)
- [ ] Add Android platform (`npx cap add android`)
- [ ] Test both builds render the web app correctly in simulator/emulator
- [ ] Handle splash screen and app icon integration (assets provided)

### Phase 2 — Native Plugins (2–3 days)
- [ ] `@capacitor/push-notifications` — push notification support
- [ ] `@capacitor/status-bar` — style the status bar (dark theme)
- [ ] `@capacitor/splash-screen` — configure splash screen timing
- [ ] `@capacitor/app` — handle back button on Android
- [ ] `@capacitor/haptics` — haptic feedback on interactions
- [ ] Deep link handling for profile/post sharing URLs

### Phase 3 — iOS Submission (2–3 days)
- [ ] Configure `Info.plist` with required permission descriptions
- [ ] Set up App Store Connect entry with metadata (provided)
- [ ] Configure signing certificates and provisioning profiles
- [ ] Build release IPA
- [ ] Submit via Xcode / Transporter
- [ ] Monitor and respond to App Review feedback

### Phase 4 — Android Submission (2–3 days)
- [ ] Configure `AndroidManifest.xml` with correct permissions
- [ ] Set up Google Play Console entry with metadata (provided)
- [ ] Configure signing keystore
- [ ] Build release AAB (Android App Bundle)
- [ ] Submit to Google Play internal testing track first
- [ ] Promote to production after review

---

## Assets Provided by Client

- ✅ App icon 1024×1024 PNG (iOS + Android)
- ✅ Splash screen image
- ✅ App Store screenshots (5 screens)
- ✅ Full app store listing copy (English)
- ✅ Privacy Policy URL: https://our-space-vibes.base44.app/PrivacyPolicy
- ✅ Terms of Service URL: https://our-space-vibes.base44.app/TermsOfService
- ✅ Content Policy URL: https://our-space-vibes.base44.app/ContentPolicy

---

## What Developer Needs to Provide / Set Up

- Apple Developer Account credentials (client will provide access)
- Google Play Developer Account credentials (client will provide access)
- Xcode (Mac required for iOS builds)
- Android Studio
- Node.js 18+

---

## Technical Notes

- **Framework:** React (Base44 platform)
- **Auth:** Base44 native auth — Google OAuth + email/password
- **API:** All API calls go to `https://our-space-vibes.base44.app/functions/*`
- **WebView:** Standard Capacitor WebView is sufficient — no special configuration needed
- **CORS:** Base44 handles CORS automatically
- **Deep links:** Format is `ourspace2://` for iOS, intent filters for Android
- **Orientation:** Portrait only (lock to portrait in both platforms)
- **Min OS:** iOS 15+, Android 8.0+ (API 26+)

---

## Budget & Timeline

- **Budget:** $200–$500
- **Timeline:** 2–3 weeks from start to both stores live
- **Preferred background:** Experience with Capacitor + app store submissions
- **Communication:** Daily updates via [your preferred platform]

---

## App Store IDs to Create

### iOS (App Store Connect)
- Bundle ID: `com.ourspace2.app`
- App Name: `OurSpace 2.0`
- SKU: `OURSPACE2-001`

### Android (Google Play Console)
- Package Name: `com.ourspace2.app`
- App Name: `OurSpace 2.0`

---

## Contact

- **Project Owner:** Dixson
- **Email:** ddortese@gmail.com
- **GitHub:** ddortese-pixel

---

*This brief was prepared April 2026. All assets and metadata are ready for handoff.*
