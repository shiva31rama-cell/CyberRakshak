/* global self, caches, clients, fetch, URL, Response */
const SHELL_CACHE = "cyberrakshak-shell-v1";
const ASSET_CACHE = "cyberrakshak-assets-v1";
const CACHE_PREFIX = "cyberrakshak-";
const MAX_ASSET_ENTRIES = 80;
const SHELL_PATHS = ["/", "/index.html", "/manifest.webmanifest"];

async function cacheResponse(cache, requestOrUrl, response) {
  if (response && response.ok && response.type !== "opaque") {
    try {
      await cache.put(requestOrUrl, response.clone());
    } catch {
      // Storage limits or browser cache policy must not block the online response.
    }
  }
}

async function trimAssetCache(cache) {
  const keys = await cache.keys();
  if (keys.length <= MAX_ASSET_ENTRIES) return;
  await Promise.all(keys.slice(0, keys.length - MAX_ASSET_ENTRIES).map((key) => cache.delete(key)));
}

async function precacheShellAndAssets() {
  const shellCache = await caches.open(SHELL_CACHE);
  let appHtml = "";

  for (const path of SHELL_PATHS) {
    try {
      const response = await fetch(path, { cache: "reload" });
      if (response.ok) {
        await cacheResponse(shellCache, path, response);
        if (!appHtml && (response.headers.get("content-type") || "").includes("text/html")) {
          appHtml = await response.clone().text();
        }
      }
    } catch {
      // A first install requires connectivity for meaningful offline caching.
    }
  }

  if (!appHtml) return;
  const assets = new Set();
  const referencePattern = /(?:src|href)=["']([^"']+)["']/gi;
  for (const match of appHtml.matchAll(referencePattern)) {
    try {
      const assetUrl = new URL(match[1], self.location.origin);
      if (assetUrl.origin !== self.location.origin) continue;
      if (!/\.(?:m?js|css|woff2?|svg|png|webp|jpe?g|ico)$/i.test(assetUrl.pathname)) continue;
      assets.add(assetUrl.href);
    } catch {
      // Ignore malformed or non-URL references in the generated HTML.
    }
  }

  const assetCache = await caches.open(ASSET_CACHE);
  await Promise.all([...assets].map(async (assetUrl) => {
    try {
      const response = await fetch(assetUrl, { cache: "reload" });
      await cacheResponse(assetCache, assetUrl, response);
    } catch {
      // Missing optional assets must not prevent the service worker from installing.
    }
  }));
  await trimAssetCache(assetCache);
}

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    await precacheShellAndAssets();
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const current = new Set([SHELL_CACHE, ASSET_CACHE]);
    const names = await caches.keys();
    await Promise.all(names
      .filter((name) => name.startsWith(CACHE_PREFIX) && !current.has(name))
      .map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  // Never cache API calls or user-submitted content / dynamic service responses.
  if (url.pathname === "/api" || url.pathname.startsWith("/api/")) return;

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok && (response.headers.get("content-type") || "").includes("text/html")) {
          const cache = await caches.open(SHELL_CACHE);
          await cacheResponse(cache, "/index.html", response);
          if (url.pathname === "/") await cacheResponse(cache, "/", response);
        }
        return response;
      } catch {
        return (await caches.match(request)) ||
          (await caches.match("/index.html")) ||
          (await caches.match("/")) ||
          new Response(
            "CyberRakshak is offline and the application shell has not been cached yet. Reconnect once and reload the app.",
            { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } }
          );
      }
    })());
    return;
  }

  const isStaticAsset =
    ["script", "style", "image", "font", "worker", "manifest"].includes(request.destination) ||
    /\.(?:m?js|css|woff2?|svg|png|webp|jpe?g|ico)$/i.test(url.pathname);
  if (!isStaticAsset) return;

  event.respondWith((async () => {
    const cache = await caches.open(ASSET_CACHE);
    const cached = await cache.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response.ok && response.type === "basic") {
        await cacheResponse(cache, request, response);
        await trimAssetCache(cache);
      }
      return response;
    } catch {
      return new Response("This static asset is not available offline.", {
        status: 504,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }
  })());
});
