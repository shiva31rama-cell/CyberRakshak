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
  assert.equal(await page.locator(".nav-menu").evaluate((element) => getComputedStyle(element).visibility), "visible");
  await page.keyboard.press("Tab");
  assert.equal(
    await page.evaluate(() => document.activeElement?.matches(".nav-menu .nav-link")),
    true,
    "Tab from the menu toggle should reach the first menu action"
  );
  await page.keyboard.press("Escape");
  assert.equal(await menuButton.evaluate((element) => element === document.activeElement), true);
  assert.equal(await page.locator(".nav-menu").evaluate((element) => getComputedStyle(element).visibility), "hidden");

  await page.setViewportSize({ width: 1440, height: 900 });
  const chatInput = page.getByRole("textbox", { name: "Chat message" });
  await page.getByRole("button", { name: /Ask CyberRakshak/ }).click();
  await chatInput.waitFor({ state: "visible" });
  await page.waitForFunction(() => document.activeElement?.getAttribute("aria-label") === "Chat message");
  assert.equal(await chatInput.evaluate((element) => element === document.activeElement), true, "Home Ask should open and focus the assistant");

  await page.getByRole("button", { name: "Close CyberRakshak AI" }).click();
  await page.locator(".nav-menu .nav-link").filter({ hasText: "Ask" }).click();
  await chatInput.waitFor({ state: "visible" });
  await page.waitForFunction(() => document.activeElement?.getAttribute("aria-label") === "Chat message");
  assert.equal(await chatInput.evaluate((element) => element === document.activeElement), true, "Navigation Ask should open and focus the assistant");

  await page.getByRole("button", { name: "Close CyberRakshak AI" }).click();
  const footerAssistant = page.getByRole("button", { name: "Open the safety assistant" });
  await footerAssistant.click();
  await chatInput.waitFor({ state: "visible" });
  await page.waitForFunction(() => document.activeElement?.getAttribute("aria-label") === "Chat message");
  assert.equal(await chatInput.evaluate((element) => element === document.activeElement), true, "Footer Ask should open and focus the assistant");
  await page.getByRole("button", { name: "Close CyberRakshak AI" }).click();

  let deleteRequestCount = 0;
  await page.route("**/scam-report/case/**", async (route) => {
    const method = route.request().method();
    if (method === "DELETE") {
      deleteRequestCount += 1;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: "Report deleted from active CyberRakshak records",
        }),
      });
      return;
    }
    if (method === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          report: {
            caseNumber: "CASE-" + "A".repeat(32),
            status: "under-investigation",
            reportedAt: "2026-01-01T12:00:00.000Z",
          },
        }),
      });
      return;
    }
    await route.continue();
  });
  await page.goto(new URL("/report-scam", baseUrl).href, { waitUntil: "domcontentloaded" });
  await page.getByLabel("CyberRakshak case number").fill("CASE-" + "A".repeat(32));
  await page.getByRole("button", { name: "Check status" }).click();
  await page.getByText("under investigation").waitFor();
  assert.equal(await page.locator(".case-lookup-status").isVisible(), true, "The safe report status should be shown");

  const deleteDialogPromise = page.waitForEvent("dialog");
  const deleteClickPromise = page.getByRole("button", { name: "Delete my report" }).click();
  const deleteDialog = await deleteDialogPromise;
  assert.match(deleteDialog.message(), /delete this report/i, "Deletion should require an explicit confirmation");
  await deleteDialog.accept();
  await deleteClickPromise;
  await page.getByText("The report was deleted from active CyberRakshak records.", { exact: true }).waitFor();
  assert.equal(deleteRequestCount, 1, "The case reference should issue exactly one DELETE request");
  assert.equal(await page.locator(".case-lookup-status").count(), 0, "Deleted report status should be cleared");
  assert.equal(await page.getByLabel("CyberRakshak case number").inputValue(), "", "The private case reference should be cleared");

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
  console.log("PASS: Chromium checked responsive layouts, keyboard focus/menu behavior, shared Ask actions, report lookup/deletion, offline deep-link loading, and network-only API behavior.");
} finally {
  await browser.close();
}
