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

  const skipLink = page.locator(".skip-link");
  await skipLink.focus();
  assert.equal(await skipLink.isVisible(), true, "The skip link should become visible on keyboard focus");
  await page.keyboard.press("Enter");
  assert.equal(
    await page.locator("#main-content").evaluate((element) => document.activeElement === element),
    true,
    "The skip link should move focus to the main content"
  );

  await page.setViewportSize({ width: 390, height: 844 });
  const menuButton = page.getByRole("button", { name: "Open menu" });
  await menuButton.click();
  await page.waitForFunction(() => document.activeElement?.textContent?.trim() === "Home");
  assert.equal(await page.locator(".nav-menu").evaluate((element) => getComputedStyle(element).visibility), "visible");
  await page.keyboard.press("Escape");
  assert.equal(await menuButton.evaluate((element) => element === document.activeElement), true);
  assert.equal(await page.locator(".nav-menu").evaluate((element) => getComputedStyle(element).visibility), "hidden");

  await page.setViewportSize({ width: 1440, height: 900 });
  const chatInput = page.getByRole("textbox", { name: "Chat message" });
  await page.getByRole("button", { name: /Ask CyberRakshak/ }).click();
  await chatInput.waitFor({ state: "visible" });
  assert.equal(await chatInput.evaluate((element) => element === document.activeElement), true, "Home Ask should open and focus the assistant");

  await page.getByRole("button", { name: "Close CyberRakshak AI" }).click();
  await page.locator(".nav-menu .nav-link").filter({ hasText: "Ask" }).click();
  await chatInput.waitFor({ state: "visible" });
  assert.equal(await chatInput.evaluate((element) => element === document.activeElement), true, "Navigation Ask should open and focus the assistant");

  await page.getByRole("button", { name: "Close CyberRakshak AI" }).click();
  const footerAssistant = page.getByRole("button", { name: "Open the safety assistant" });
  await footerAssistant.click();
  await chatInput.waitFor({ state: "visible" });
  assert.equal(await chatInput.evaluate((element) => element === document.activeElement), true, "Footer Ask should open and focus the assistant");
  await page.getByRole("button", { name: "Close CyberRakshak AI" }).click();

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
  console.log("PASS: Chromium checked responsive layouts, keyboard focus/menu behavior, all shared Ask actions, offline deep-link loading, and network-only API behavior.");
} finally {
  await browser.close();
}
