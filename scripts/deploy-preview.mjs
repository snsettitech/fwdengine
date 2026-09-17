/**
 * Build and publish the static preview to GitHub Pages.
 *
 *   node scripts/deploy-preview.mjs
 *
 * Environment (all optional, defaults shown):
 *   GH_REPO=snsettitech/fwdengine
 *   BASE_PATH=/fwdengine        the sub-directory Pages serves the site from
 *   PAGES_BRANCH=gh-pages
 *
 * The preview is built with NEXT_PUBLIC_PREVIEW=1, which sets noindex and
 * makes robots.txt disallow everything — a github.io copy must never compete
 * with fwdengine.com for the company's own name.
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const REPO = process.env.GH_REPO ?? "snsettitech/fwdengine";
const BASE_PATH = process.env.BASE_PATH ?? "/fwdengine";
const BRANCH = process.env.PAGES_BRANCH ?? "gh-pages";
/**
 * With a custom `distDir`, Next 16 writes the static export into that
 * directory rather than `out/`. The preview build sets
 * `distDir: ".next-preview"` so it does not clobber `.next`, so look there
 * first and fall back to the default.
 */
const PREVIEW_DIST = path.join(process.cwd(), ".next-preview");
const DEFAULT_OUT = path.join(process.cwd(), "out");

const resolveOutDir = () => {
  for (const dir of [PREVIEW_DIST, DEFAULT_OUT]) {
    if (fs.existsSync(path.join(dir, "index.html"))) return dir;
  }
  return null;
};

/**
 * `npm` is a .cmd shim on Windows and needs a shell; `git` is a real
 * executable and must NOT get one, or the shell mangles arguments containing
 * `=` and `@` (the `-c user.email=...` pair in particular).
 */
const runShell = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, { stdio: "inherit", shell: true, ...opts });

const run = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, { stdio: "inherit", ...opts });

/**
 * Next's App Router asks for RSC payloads with the segment separator flattened
 * to a dot (`/platform/__next.platform.__PAGE__.txt`), but the static export
 * writes them as a nested directory (`/platform/__next.platform/__PAGE__.txt`).
 * A real Next server resolves both; a static host serves only what is on disk,
 * so every prefetch 404s and each navigation degrades to a full page load.
 *
 * Writing the flattened alias next to the nested file fixes prefetching
 * without touching the router.
 */
function aliasRscPayloads(dir) {
  let written = 0;

  const walk = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (entry.name.startsWith("__next.")) {
          for (const child of fs.readdirSync(full, { withFileTypes: true })) {
            if (!child.isFile()) continue;
            const alias = path.join(current, `${entry.name}.${child.name}`);
            if (!fs.existsSync(alias)) {
              fs.copyFileSync(path.join(full, child.name), alias);
              written += 1;
            }
          }
        }
        walk(full);
      }
    }
  };

  walk(dir);
  return written;
}

console.log(`> building static preview for ${REPO} at ${BASE_PATH}`);
fs.rmSync(PREVIEW_DIST, { recursive: true, force: true });
fs.rmSync(DEFAULT_OUT, { recursive: true, force: true });

runShell("npm", ["run", "build"], {
  env: {
    ...process.env,
    STATIC_PREVIEW: "1",
    BASE_PATH,
    NEXT_PUBLIC_PREVIEW: "1",
    NEXT_PUBLIC_SITE_URL: `https://${REPO.split("/")[0]}.github.io${BASE_PATH}`,
  },
});

const OUT = resolveOutDir();
if (!OUT) {
  throw new Error(
    "build produced no static export (looked for index.html in .next-preview/ and out/)",
  );
}
console.log(`> export directory: ${path.relative(process.cwd(), OUT)}`);

const aliased = aliasRscPayloads(OUT);
console.log(`> aliased ${aliased} RSC payload files for static hosting`);

// Without this, Pages runs Jekyll and drops every directory beginning with an
// underscore — which is all of _next/.
fs.writeFileSync(path.join(OUT, ".nojekyll"), "");

const staging = fs.mkdtempSync(path.join(os.tmpdir(), "fwd-pages-"));
fs.cpSync(OUT, staging, { recursive: true });

const git = (...args) => run("git", args, { cwd: staging });
git("init", "-q", "-b", BRANCH);
git("add", "-A");
git(
  "-c", "user.email=deploy@fwdengine.com",
  "-c", "user.name=FwdEngine Deploy",
  "commit", "-q", "-m", `deploy: static preview ${new Date().toISOString()}`,
);
git("remote", "add", "origin", `https://github.com/${REPO}.git`);
git("push", "-q", "--force", "origin", BRANCH);

fs.rmSync(staging, { recursive: true, force: true });

console.log(`\n> published https://${REPO.split("/")[0]}.github.io${BASE_PATH}/`);
console.log("> Pages usually serves the new build within a minute.");
