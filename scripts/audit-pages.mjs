/**
 * Page audit: layout integrity and accessibility basics on every route.
 *
 * Checks that are cheap to run and catch the failures that actually ship:
 *   - horizontal overflow at phone, tablet and desktop widths
 *   - console errors, including hydration mismatches
 *   - one h1 per page, and no heading level skipped
 *   - images without alt text
 *   - interactive controls with no accessible name
 *   - touch targets under 44px on the phone viewport
 *   - body text below 16px, and text colour contrast under 4.5:1
 *
 * Usage: node scripts/audit-pages.mjs [baseUrl]
 */

import { chromium } from "playwright";

const BASE = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");

const ROUTES = [
  "/",
  "/platform",
  "/industries",
  "/industries/banking",
  "/industries/asset-wealth",
  "/industries/insurance",
  "/industries/payments",
  "/fde-model",
  "/global-delivery",
  "/insights",
  "/insights/human-gate-is-the-product",
  "/careers",
  "/contact",
  "/does-not-exist",
];

const VIEWPORTS = [
  { name: "phone", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
];

const THEMES = ["dark", "light"];

/** Runs in the page. Returns structured findings, never throws. */
function collect() {
  const findings = [];

  const srgb = (channel) => {
    const value = channel / 255;
    return value <= 0.03928
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, 2.4);
  };

  const luminance = ([r, g, b]) =>
    0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);

  const parse = (color) => {
    const match = color.match(/rgba?\(([^)]+)\)/);
    if (!match) return null;
    const parts = match[1].split(",").map((part) => Number.parseFloat(part.trim()));
    if (parts.length < 3 || parts.some(Number.isNaN)) return null;
    return { rgb: parts.slice(0, 3), alpha: parts[3] ?? 1 };
  };

  /** Walk up for the first opaque background. */
  const backgroundOf = (element) => {
    let node = element;
    while (node && node !== document.documentElement) {
      const parsed = parse(getComputedStyle(node).backgroundColor);
      if (parsed && parsed.alpha > 0.85) return parsed.rgb;
      node = node.parentElement;
    }
    const root = parse(getComputedStyle(document.body).backgroundColor);
    return root ? root.rgb : [0, 0, 0];
  };

  const contrast = (a, b) => {
    const la = luminance(a);
    const lb = luminance(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  };

  const visible = (element) => {
    const style = getComputedStyle(element);
    if (style.display === "none" || style.visibility === "hidden") return false;
    if (Number.parseFloat(style.opacity) === 0) return false;
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  };

  // --- Horizontal overflow -------------------------------------------------
  const docWidth = document.documentElement.clientWidth;
  if (document.documentElement.scrollWidth > docWidth + 1) {
    const offenders = [];
    for (const element of document.querySelectorAll("body *")) {
      const rect = element.getBoundingClientRect();
      if (rect.width > 0 && rect.right > docWidth + 1 && visible(element)) {
        offenders.push(
          `${element.tagName.toLowerCase()}.${String(element.className).slice(0, 60)} right=${Math.round(rect.right)}`,
        );
      }
      if (offenders.length >= 4) break;
    }
    findings.push({
      kind: "overflow",
      detail: `scrollWidth ${document.documentElement.scrollWidth} > ${docWidth}`,
      offenders,
    });
  }

  // --- Headings ------------------------------------------------------------
  const headings = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].filter(visible);
  const h1s = headings.filter((h) => h.tagName === "H1");
  if (h1s.length !== 1) {
    findings.push({ kind: "headings", detail: `${h1s.length} visible h1 elements` });
  }
  let previous = 0;
  for (const heading of headings) {
    const level = Number.parseInt(heading.tagName.slice(1), 10);
    if (previous && level > previous + 1) {
      findings.push({
        kind: "headings",
        detail: `h${previous} jumps to h${level}: "${heading.textContent.trim().slice(0, 50)}"`,
      });
    }
    previous = level;
  }

  // --- Images --------------------------------------------------------------
  for (const image of document.querySelectorAll("img")) {
    if (!image.hasAttribute("alt")) {
      findings.push({ kind: "img-alt", detail: image.src.slice(0, 80) });
    }
  }

  // --- Accessible names on controls ---------------------------------------
  for (const control of document.querySelectorAll("a,button,input,select,textarea")) {
    if (!visible(control)) continue;
    const name =
      control.getAttribute("aria-label")?.trim() ||
      control.getAttribute("title")?.trim() ||
      (control.labels && control.labels.length > 0
        ? [...control.labels].map((l) => l.textContent.trim()).join(" ")
        : "") ||
      control.textContent?.trim() ||
      "";
    if (!name) {
      findings.push({
        kind: "no-accessible-name",
        detail: `${control.tagName.toLowerCase()}${control.id ? `#${control.id}` : ""}`,
      });
    }
  }

  // --- Touch targets (phone only; caller filters) -------------------------
  const smallTargets = [];
  for (const control of document.querySelectorAll("a,button,input[type=checkbox],select")) {
    if (!visible(control)) continue;
    // Visually-hidden-until-focused controls (the skip link) are 1x1 by
    // design; they expand when focused.
    if (control.classList.contains("sr-only")) continue;
    // A checkbox whose label is itself a large click target is fine: the
    // label is what a thumb actually hits.
    if (control.matches("input[type=checkbox]")) {
      const label = control.labels?.[0];
      if (label && label.getBoundingClientRect().height >= 44) continue;
    }
    const rect = control.getBoundingClientRect();
    // Inline links inside a paragraph are exempt: they flow with the text.
    const inline = getComputedStyle(control).display === "inline";
    if (inline) continue;
    if (rect.height < 44 || rect.width < 24) {
      smallTargets.push(
        `${control.tagName.toLowerCase()} "${(control.textContent ?? "").trim().slice(0, 28)}" ${Math.round(rect.width)}x${Math.round(rect.height)}`,
      );
    }
  }
  if (smallTargets.length) {
    findings.push({ kind: "touch-target", detail: `${smallTargets.length} under 44px high`, offenders: smallTargets.slice(0, 6) });
  }

  // --- Text size and contrast ---------------------------------------------
  const seen = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const text = node.textContent?.trim();
    if (!text || text.length < 8) continue;
    const element = node.parentElement;
    if (!element || !visible(element)) continue;
    if (element.closest("[aria-hidden='true'], .sr-only, svg, noscript")) continue;

    const style = getComputedStyle(element);
    const fontSize = Number.parseFloat(style.fontSize);
    const weight = Number.parseInt(style.fontWeight, 10) || 400;
    const key = `${element.tagName}|${style.color}|${fontSize}|${String(element.className).slice(0, 40)}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const foreground = parse(style.color);
    if (!foreground) continue;
    const ratio = contrast(foreground.rgb, backgroundOf(element));

    // WCAG large text: 18.66px bold, or 24px at any weight.
    const isLarge = fontSize >= 24 || (fontSize >= 18.66 && weight >= 700);
    const required = isLarge ? 3 : 4.5;

    if (ratio < required) {
      findings.push({
        kind: "contrast",
        detail: `${ratio.toFixed(2)}:1 (needs ${required}) ${fontSize}px ${style.color} — "${text.slice(0, 44)}"`,
      });
    }

    // Body copy under 16px is a readability problem, not a WCAG failure.
    // 16px is the floor for body prose. Anything smaller has to declare
    // itself: mono/meta by role, or data-footnote / data-dense in the markup.
    // An unmarked small paragraph is an accident, and that is what we flag.
    const isMeta =
      style.fontFamily.toLowerCase().includes("mono") ||
      element.closest(
        "[class*='type-kicker'], [class*='type-mono'], label, dt, th, [data-footnote], [data-dense]",
      );
    if (fontSize < 16 && !isMeta && text.length > 90) {
      findings.push({
        kind: "small-body-text",
        detail: `${fontSize}px — "${text.slice(0, 44)}"`,
      });
    }
  }

  return findings;
}

const browser = await chromium.launch();
let total = 0;
const report = [];

for (const theme of THEMES) {
  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
    });

    // Seed the stored theme so the page renders the variant under test.
    await context.addInitScript(
      ([key, value]) => window.localStorage.setItem(key, value),
      ["theme", theme],
    );

    const page = await context.newPage();
    const consoleErrors = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text().slice(0, 240));
    });
    page.on("pageerror", (error) => consoleErrors.push(`pageerror: ${error.message}`));

    for (const route of ROUTES) {
      consoleErrors.length = 0;
      const response = await page.goto(`${BASE}${route}`, {
        waitUntil: "networkidle",
        timeout: 45_000,
      });

      const expected = route === "/does-not-exist" ? 404 : 200;
      const status = response?.status() ?? 0;

      // Let reveals settle so contrast is measured on final colours.
      await page.evaluate(async () => {
        document.documentElement.style.scrollBehavior = "auto";
        const step = window.innerHeight * 0.85;
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo({ top: y, behavior: "instant" });
          await new Promise((resolve) => setTimeout(resolve, 90));
        }
        window.scrollTo({ top: 0, behavior: "instant" });
        await new Promise((resolve) => setTimeout(resolve, 250));
      });

      const findings = await page.evaluate(collect);

      const filtered = findings.filter(
        (finding) => finding.kind !== "touch-target" || viewport.name === "phone",
      );

      if (status !== expected) {
        filtered.unshift({ kind: "status", detail: `got ${status}, expected ${expected}` });
      }
      for (const error of consoleErrors) {
        // The missing route is meant to 404, and the browser reports the
        // document's own status as a failed resource load.
        const expected404Noise =
          expected === 404 && error.includes("Failed to load resource");
        if (expected404Noise) continue;
        filtered.unshift({ kind: "console-error", detail: error });
      }

      if (filtered.length) {
        total += filtered.length;
        report.push({ theme, viewport: viewport.name, route, findings: filtered });
      }
    }

    await context.close();
  }
}

await browser.close();

if (report.length === 0) {
  console.log(`PASS — ${ROUTES.length} routes x ${VIEWPORTS.length} viewports x ${THEMES.length} themes, no findings.`);
  process.exit(0);
}

console.log(`FINDINGS: ${total}\n`);
for (const entry of report) {
  console.log(`▸ ${entry.route}  [${entry.theme}/${entry.viewport}]`);
  for (const finding of entry.findings) {
    console.log(`    ${finding.kind}: ${finding.detail ?? ""}`);
    for (const offender of finding.offenders ?? []) {
      console.log(`        ${offender}`);
    }
  }
  console.log("");
}
process.exit(1);
