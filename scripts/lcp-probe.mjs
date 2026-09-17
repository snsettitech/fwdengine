/**
 * Reports the actual LCP entry — element, timing and cause — under the same
 * throttling Lighthouse applies to its mobile run.
 *
 * Lighthouse tells you LCP is slow. This tells you which element it picked
 * and what else was happening at that moment.
 *
 * Usage: node scripts/lcp-probe.mjs [baseUrl] [routes...]
 */

import { chromium } from "playwright";

const BASE = (process.argv[2] ?? "http://localhost:3100").replace(/\/$/, "");
const ROUTES = process.argv.length > 3 ? process.argv.slice(3) : ["/", "/contact"];

const browser = await chromium.launch();

for (const route of ROUTES) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2.625,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  const client = await context.newCDPSession(page);

  // Lighthouse's mobile profile: slow 4G plus a 4x CPU handicap.
  await client.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 150,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
  });
  await client.send("Emulation.setCPUThrottlingRate", { rate: 4 });

  await page.addInitScript(() => {
    window.__lcp = [];
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        window.__lcp.push({
          startTime: entry.startTime,
          size: entry.size,
          renderTime: entry.renderTime,
          loadTime: entry.loadTime,
          url: entry.url || null,
          tag: entry.element?.tagName ?? null,
          cls: entry.element?.className?.toString().slice(0, 90) ?? null,
          text: entry.element?.textContent?.trim().slice(0, 70) ?? null,
        });
      }
    }).observe({ type: "largest-contentful-paint", buffered: true });

    window.__paint = [];
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        window.__paint.push({ name: entry.name, startTime: entry.startTime });
      }
    }).observe({ type: "paint", buffered: true });
  });

  await page.goto(`${BASE}${route}`, { waitUntil: "load", timeout: 90_000 });
  // Give late candidates a chance to register, then settle LCP by interacting.
  await page.waitForTimeout(4000);

  const data = await page.evaluate(() => ({
    lcp: window.__lcp,
    paint: window.__paint,
    fonts: performance
      .getEntriesByType("resource")
      .filter((entry) => entry.initiatorType === "css" || /\.woff2?$/.test(entry.name))
      .map((entry) => ({
        name: entry.name.split("/").pop(),
        start: Math.round(entry.startTime),
        end: Math.round(entry.responseEnd),
      })),
  }));

  console.log(`\n===== ${route} =====`);
  for (const entry of data.paint) {
    console.log(`  ${entry.name}: ${Math.round(entry.startTime)}ms`);
  }
  console.log("  LCP candidates (last one wins):");
  for (const entry of data.lcp) {
    console.log(
      `    ${Math.round(entry.startTime)}ms  size=${entry.size}  <${entry.tag}>  ${entry.url ?? ""}`,
    );
    console.log(`        class: ${entry.cls}`);
    console.log(`        text:  ${entry.text}`);
  }
  console.log("  Fonts:");
  for (const font of data.fonts) {
    console.log(`    ${font.name}  ${font.start}ms -> ${font.end}ms`);
  }

  await context.close();
}

await browser.close();
