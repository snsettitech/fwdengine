/**
 * Lighthouse run against the performance budget.
 *
 * Budget (from the brief):
 *   performance >= 90 desktop, >= 80 mobile
 *   LCP < 2.5s
 *   accessibility, best-practices and SEO are also asserted, because a
 *   regression in those is a regression.
 *
 * Point CHROME_PATH at a Chromium build if the launcher cannot find one.
 * Usage: node scripts/lighthouse.mjs [baseUrl] [routes...]
 */

import fs from "node:fs";
import path from "node:path";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";

const BASE = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const ROUTES =
  process.argv.length > 3
    ? process.argv.slice(3)
    : ["/", "/platform", "/global-delivery", "/insights/human-gate-is-the-product", "/contact"];

const BUDGETS = {
  desktop: { performance: 90, accessibility: 95, "best-practices": 95, seo: 95 },
  mobile: { performance: 80, accessibility: 95, "best-practices": 95, seo: 95 },
};

const LCP_BUDGET_MS = 2500;

const FORM_FACTORS = {
  desktop: {
    formFactor: "desktop",
    screenEmulation: { mobile: false, width: 1440, height: 900, deviceScaleFactor: 1, disabled: false },
    throttling: { rttMs: 40, throughputKbps: 10 * 1024, cpuSlowdownMultiplier: 1, requestLatencyMs: 0, downloadThroughputKbps: 0, uploadThroughputKbps: 0 },
  },
  mobile: {
    formFactor: "mobile",
    screenEmulation: { mobile: true, width: 390, height: 844, deviceScaleFactor: 2.625, disabled: false },
    throttling: { rttMs: 150, throughputKbps: 1638.4, cpuSlowdownMultiplier: 4, requestLatencyMs: 562.5, downloadThroughputKbps: 1474.56, uploadThroughputKbps: 675 },
  },
};

const chrome = await chromeLauncher.launch({
  chromeFlags: ["--headless=new", "--disable-gpu", "--no-sandbox"],
  chromePath: process.env.CHROME_PATH,
});

const reportDir = path.join(process.cwd(), ".lighthouse");
fs.mkdirSync(reportDir, { recursive: true });

const rows = [];
let failed = false;

try {
  for (const [name, emulation] of Object.entries(FORM_FACTORS)) {
    for (const route of ROUTES) {
      const result = await lighthouse(
        `${BASE}${route}`,
        { port: chrome.port, output: "html", logLevel: "error" },
        {
          extends: "lighthouse:default",
          settings: { ...emulation, onlyCategories: Object.keys(BUDGETS[name]) },
        },
      );

      if (!result) throw new Error(`Lighthouse returned nothing for ${route}`);

      const { lhr, report } = result;
      const slug = route === "/" ? "home" : route.replace(/\//g, "-").replace(/^-/, "");
      fs.writeFileSync(path.join(reportDir, `${name}-${slug}.html`), report);

      const scores = Object.fromEntries(
        Object.keys(BUDGETS[name]).map((category) => [
          category,
          Math.round((lhr.categories[category]?.score ?? 0) * 100),
        ]),
      );

      const lcpMs = lhr.audits["largest-contentful-paint"]?.numericValue ?? 0;
      const cls = lhr.audits["cumulative-layout-shift"]?.numericValue ?? 0;
      const tbtMs = lhr.audits["total-blocking-time"]?.numericValue ?? 0;

      const breaches = [];
      for (const [category, minimum] of Object.entries(BUDGETS[name])) {
        if (scores[category] < minimum) {
          breaches.push(`${category} ${scores[category]} < ${minimum}`);
        }
      }
      if (lcpMs > LCP_BUDGET_MS) {
        breaches.push(`LCP ${Math.round(lcpMs)}ms > ${LCP_BUDGET_MS}ms`);
      }

      if (breaches.length) failed = true;

      rows.push({
        form: name,
        route,
        ...scores,
        lcp: `${(lcpMs / 1000).toFixed(2)}s`,
        tbt: `${Math.round(tbtMs)}ms`,
        cls: cls.toFixed(3),
        verdict: breaches.length ? `FAIL — ${breaches.join("; ")}` : "pass",
      });
    }
  }
} finally {
  // chrome-launcher removes its temp profile on kill, and on Windows that
  // rmSync throws EPERM while a child process still holds a handle. Swallow
  // it: a leftover temp directory must not discard the results we just
  // spent two minutes collecting.
  try {
    await chrome.kill();
  } catch (error) {
    if (error?.code !== "EPERM" && error?.code !== "EBUSY") throw error;
  }
}

const pad = (value, width) => String(value).padEnd(width);
const header = ["form", "route", "perf", "a11y", "bp", "seo", "lcp", "tbt", "cls", "verdict"];
const widths = [8, 38, 6, 6, 5, 5, 8, 8, 7, 40];

console.log(header.map((cell, index) => pad(cell, widths[index])).join(""));
console.log("-".repeat(widths.reduce((sum, width) => sum + width, 0)));
for (const row of rows) {
  console.log(
    [
      row.form,
      row.route,
      row.performance,
      row.accessibility,
      row["best-practices"],
      row.seo,
      row.lcp,
      row.tbt,
      row.cls,
      row.verdict,
    ]
      .map((cell, index) => pad(cell, widths[index]))
      .join(""),
  );
}

console.log(`\nReports: ${reportDir}`);
process.exit(failed ? 1 : 0);
