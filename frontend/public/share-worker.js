const DB_NAME = "cyberrakshak-share-inbox";
const DB_VERSION = 1;
const STORE_NAME = "items";

const openDb = () => new Promise((resolve, reject) => {
  const request = indexedDB.open(DB_NAME, DB_VERSION);
  request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME, { keyPath: "id" });
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});

const putShare = async (item) => {
  const db = await openDb();
  await new Promise((resolve, reject) => {
    const request = db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).put(item);
    request.onsuccess = resolve;
    request.onerror = () => reject(request.error);
  });
  db.close();
};

self.addEventListener("install", (event) => event.waitUntil(self.skipWaiting()));
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "POST" || url.pathname !== "/share") return;

  event.respondWith((async () => {
    try {
      const form = await event.request.formData();
      const title = String(form.get("title") || "").slice(0, 300);
      const text = String(form.get("text") || "").slice(0, 6000);
      const sharedUrl = String(form.get("url") || "").slice(0, 1000);
      if (!text && !sharedUrl && !title) return Response.redirect("/check", 303);

      await putShare({
        id: crypto.randomUUID(),
        title,
        text,
        url: sharedUrl,
        createdAt: Date.now(),
      });
      return Response.redirect("/check?share=1", 303);
    } catch {
      return Response.redirect("/check", 303);
    }
  })());
});
