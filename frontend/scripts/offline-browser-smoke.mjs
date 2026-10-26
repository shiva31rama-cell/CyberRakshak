import assert from "node:assert/strict";
import { chromium } from "playwright";

const baseUrl = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4173";
const browser = await chromium.launch({ headless: true });

try {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    serviceWorkers: "allow",
  });
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.getByRole("navigation", { name: "Primary navigation" }).waitFor();
  await page.waitForFunction(async () => {
    const registration = await navigator.serviceWorker.getRegistration("/");
    return Boolean(registration?.active);
  }, null, { timeout: 15000 });

  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller), null, { timeout: 15000 });
  await page.waitForFunction(async () => {
    const names = await caches.keys();
    return names.includes("cyberrakshak-shell-v1") && names.includes("cyberrakshak-assets-v1");
  }, null, { timeout: 15000 });

  for (const viewport of [
    { width: 390, height: 844 },
    { width: 820, height: 1180 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    const layout = await page.evaluate(() => ({
      width: window.innerWidth,
      documentWidth: document.documentElement.scrollWidth,
    }));
    assert.ok(
      layout.documentWidth <= layout.width,
      "Horizontal overflow at viewport width " + viewport.width + ": " + JSON.stringify(layout)
    );
  }

  const apiWasCached = await page.evaluate(async () => {
    const names = await caches.keys();
    const requests = [];
    for (const name of names) {
      const cache = await caches.open(name);
      requests.push(...(await cache.keys()).map((request) => request.url));
    }
    return requests.some((url) => new URL(url).pathname.startsWith("/api/"));
  });
  assert.equal(apiWasCached, false, "The app must not store API responses in Cache Storage");

  await context.setOffline(true);
  const apiResult = await page.evaluate(async () => {
    try {
      await fetch("/api/health", { cache: "no-store" });
      return "resolved";
    } catch {
      return "rejected";
    }
  });
  assert.equal(apiResult, "rejected", "API requests should remain network-only while offline");

  await page.goto(new URL("/url-scanner", baseUrl).href, {
    waitUntil: "domcontentloaded",
    timeout: 15000,
  });
  await page.waitForFunction(() => document.querySelector("#root")?.children.length > 0);
  const shellText = await page.locator("#root").innerText();
  assert.ok(shellText.trim().length > 0, "A cached SPA shell should render for an offline deep link");

  assert.deepEqual(pageErrors, [], "The app raised uncaught browser errors");
  console.log("PASS: Chromium emulation checked 390px, 820px and 1440px layouts, offline deep-link loading, and network-only API behavior.");
} finally {
  await browser.close();
}
