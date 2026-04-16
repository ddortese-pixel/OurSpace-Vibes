// OurSpace 2.0 — Push Token Manager
// Handles registration, auto-recovery, and the Digital Mirror "Repair Connection" flow

const VAPID_PUBLIC_KEY = process.env.REACT_APP_VAPID_PUBLIC_KEY; // injected at build time from AWS Secrets Manager

// Convert VAPID base64 key to Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

// ── Register or recover push token ──────────────────────────────────────────
export async function registerPushToken(userEmail) {
  try {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.warn("[Push] Not supported in this browser.");
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("[Push] Permission denied.");
      return null;
    }

    const reg = await navigator.serviceWorker.ready;

    // ── Auto-Recovery: permission granted but no stored token ────────────────
    const storedToken = localStorage.getItem("os2_push_token");
    if (!storedToken) {
      console.log("[Push] No stored token — force re-subscribing...");
      // Unsubscribe any stale subscription first
      const existing = await reg.pushManager.getSubscription();
      if (existing) await existing.unsubscribe();
    }

    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    const token = JSON.stringify(subscription);
    localStorage.setItem("os2_push_token", token);

    // Send to backend
    await fetch("https://api.ourspace.com/push/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail, subscription }),
    });

    console.log("[Push] Token registered successfully.");
    return subscription;
  } catch (err) {
    console.error("[Push] Registration failed:", err);
    return null;
  }
}

// ── Digital Mirror: Repair Connection ───────────────────────────────────────
// Call this from the UI's "Repair Connection" button
export async function repairPushConnection(userEmail) {
  try {
    console.log("[Push] Repair initiated...");

    // 1. Unregister all service workers
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const reg of registrations) {
      await reg.unregister();
      console.log("[Push] Unregistered SW:", reg.scope);
    }

    // 2. Clear push token from storage
    localStorage.removeItem("os2_push_token");

    // 3. Re-register service worker
    const reg = await navigator.serviceWorker.register("/service-worker.js");
    await navigator.serviceWorker.ready;

    // 4. Re-request permission and subscribe fresh
    const result = await registerPushToken(userEmail);

    if (result) {
      console.log("[Push] Repair complete — new token registered.");
      return { success: true, message: "Push notifications repaired successfully!" };
    } else {
      return { success: false, message: "Repair failed. Please enable notifications in your browser settings." };
    }
  } catch (err) {
    console.error("[Push] Repair failed:", err);
    return { success: false, message: err.message };
  }
}

// ── Purge stale tokens (30-day cleanup) ─────────────────────────────────────
// Called server-side via DynamoDB TTL — this is the client-side trigger
export async function purgeStaleToken() {
  const stored = localStorage.getItem("os2_push_token");
  const storedAt = localStorage.getItem("os2_push_token_date");
  if (!storedAt) return;
  const ageDays = (Date.now() - parseInt(storedAt)) / (1000 * 60 * 60 * 24);
  if (ageDays > 30) {
    console.log("[Push] Token is stale (>30 days) — purging.");
    localStorage.removeItem("os2_push_token");
    localStorage.removeItem("os2_push_token_date");
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) await sub.unsubscribe();
  }
}
