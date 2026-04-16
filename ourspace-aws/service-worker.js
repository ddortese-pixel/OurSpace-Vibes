// OurSpace 2.0 — Service Worker
// Auto-incremented on every GitHub Actions deploy via CACHE_NAME injection
const CACHE_NAME = "ourspace-v2.0.1";
const STATIC_ASSETS = ["/", "/index.html", "/manifest.json"];

// ── Install & Cache ──────────────────────────────────────────────────────────
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

// ── Activate & Purge Old Caches ──────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => {
            console.log("[SW] Purging old cache:", k);
            return caches.delete(k);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch — Network First, Cache Fallback ────────────────────────────────────
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((c) => c.put(event.request, clone));
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});

// ── Push Notification Handler ────────────────────────────────────────────────
self.addEventListener("push", (event) => {
  let data = { title: "OurSpace 2.0", body: "You have a new notification.", icon: "/icon-192.png", badge: "/badge-72.png" };
  try { data = { ...data, ...event.data.json() }; } catch (e) {}

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: data.badge,
      data: data,
      vibrate: [200, 100, 200],
      actions: data.actions || [],
    })
  );
});

// ── Notification Click ───────────────────────────────────────────────────────
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "https://our-space-vibes.base44.app";
  event.waitUntil(clients.openWindow(url));
});

// ── Push Subscription Change (auto-recovery) ────────────────────────────────
// Fires when browser invalidates the old subscription (e.g. VAPID key rotation)
self.addEventListener("pushsubscriptionchange", (event) => {
  console.log("[SW] pushsubscriptionchange — re-subscribing...");
  event.waitUntil(
    self.registration.pushManager
      .subscribe({ userVisibleOnly: true, applicationServerKey: self.__VAPID_PUBLIC_KEY__ })
      .then((sub) => {
        // POST new subscription to backend
        return fetch("https://api.ourspace.com/push/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subscription: sub }),
        });
      })
      .catch((err) => console.error("[SW] Re-subscribe failed:", err))
  );
});
