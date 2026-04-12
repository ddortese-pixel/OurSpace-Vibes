# OurSpace Vibes — GitHub Setup Guide

## Step 1: Connect GitHub to Your Base44 App

1. Open your app at **app.base44.com**
2. Click on the **OurSpace Vibes** app to open the editor
3. In the left sidebar, look for the **GitHub icon** (looks like an octocat/cat)
4. Click **"Connect to GitHub"**
5. Authorize Base44 if prompted (a GitHub OAuth popup will appear)
6. Choose **"Create new repository"**
7. Enter repository name: `OurSpace-Vibes`
8. Set visibility: **Public** (required for free GitHub) or **Private** (GitHub Pro)
9. Click **Create & Sync**

✅ Base44 will immediately push all your current pages and code to the new repo.

---

## Step 2: Enable Auto-Sync (Set it and forget it)

After connecting:
- Every time you click **"Publish"** in the Base44 editor, it automatically commits to GitHub
- Commits are tagged with a timestamp and description
- You can see your full history at: `github.com/ddortese-pixel/OurSpace-Vibes`

---

## Step 3: Clone Locally (Optional — for the Capacitor developer)

```bash
git clone https://github.com/ddortese-pixel/OurSpace-Vibes.git
cd OurSpace-Vibes
npm install
npm run dev
```

---

## Step 4: Pages to Add Before App Store Submission

Add these 3 pages to your app editor (code is in this folder):

| Page File | Route | Purpose |
|-----------|-------|---------|
| `PrivacyPolicy.jsx` | `/PrivacyPolicy` | Required by Apple & Google |
| `TermsOfService.jsx` | `/TermsOfService` | Required by Apple & Google |
| `ContentPolicy.jsx` | `/ContentPolicy` | Required for social apps |
| `ReportContent.jsx` | `/ReportContent` | Required for social apps (Apple 4.3) |

### How to add a page:
1. In the Base44 editor, click **"+ New Page"**
2. Name it exactly as listed above
3. Paste the JSX code from the corresponding file in this folder
4. Click **Save** then **Publish**

---

## Step 5: Settings Page Links

In your **Settings** page, add links to:
- `/PrivacyPolicy`
- `/TermsOfService`  
- `/ContentPolicy`
- `/ReportContent`

These must be accessible from within the app for App Store approval.

---

## Repository Structure After Setup

```
OurSpace-Vibes/
├── pages/
│   ├── Home.jsx
│   ├── Profile.jsx
│   ├── Messages.jsx
│   ├── Discover.jsx
│   ├── Notifications.jsx
│   ├── Settings.jsx
│   ├── PrivacyPolicy.jsx       ← ADD THIS
│   ├── TermsOfService.jsx      ← ADD THIS
│   ├── ContentPolicy.jsx       ← ADD THIS
│   └── ReportContent.jsx       ← ADD THIS
├── entities/
│   └── [all your entity schemas]
└── functions/
    └── [backend functions]
```
