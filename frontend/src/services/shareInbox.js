const DB_NAME = "cyberrakshak-share-inbox";
const DB_VERSION = 1;
const STORE_NAME = "items";
const MAX_AGE_MS = 10 * 60 * 1000;

const openDb = () => new Promise((resolve, reject) => {
  if (!window.indexedDB) return reject(new Error("Share inbox is unavailable in this browser."));
  const request = window.indexedDB.open(DB_NAME, DB_VERSION);
  request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME, { keyPath: "id" });
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error || new Error("Could not open share inbox."));
});

export const consumeLatestSharedText = async () => {
  const db = await openDb();
  try {
    const items = await new Promise((resolve, reject) => {
      const request = db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error || new Error("Could not read share inbox."));
    });
    const now = Date.now();
    const valid = items.filter((item) => now - Number(item.createdAt || 0) <= MAX_AGE_MS).sort((a, b) => b.createdAt - a.createdAt);
    const stale = items.filter((item) => !valid.includes(item));
    const store = db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME);
    for (const item of stale) store.delete(item.id);
    const latest = valid[0];
    if (!latest) return null;
    store.delete(latest.id);
    return {
      title: String(latest.title || "").slice(0, 300),
      text: String(latest.text || "").slice(0, 6000),
      url: String(latest.url || "").slice(0, 1000),
      createdAt: Number(latest.createdAt || now),
    };
  } finally {
    db.close();
  }
};
