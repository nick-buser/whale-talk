# Postmortem: whale-talk production blank page ("Failed to load module script")

- **Date of incident:** Discovered 2026-05-31; site had been broken since the first deploy on 2026-05-30.
- **Date of writing:** 2026-05-31
- **Status:** Resolved (with a recurrence — see "Recurrence" below)
- **Severity:** High — the entire production site (https://whale-talk.nicholas-buser.workers.dev) rendered a blank page. 100% of visitors affected. The same outage briefly **recurred** when a `git push` triggered a misconfigured auto-build.
- **Authors:** Nick Buser, Claude
- **This is a blameless postmortem.** The goal is to understand the system and our process, not to assign fault. The misdiagnoses below were reasonable given the information available at each step; documenting them is the whole point.

---

## Summary

The production site showed a blank page with this browser console error:

```
Failed to load module script: Expected a JavaScript-or-Wasm module script
but the server responded with a MIME type of "". Strict MIME type checking
is enforced for module scripts per HTML spec.
```

The root cause was not a MIME configuration problem. **The Cloudflare Worker was serving the raw, un-built source tree instead of the Vite production build.** The deployed `index.html` still contained the dev-mode entry point:

```html
<script type="module" src="/src/main.tsx"></script>
```

A static host cannot compile TypeScript/JSX. So the browser requested `/src/main.tsx`, received the raw file with a non-JavaScript (empty) content type, refused to execute it per the HTML module spec, and `#root` never mounted → blank page. The real compiled bundles under `/assets/` returned `404` because the build output (`dist/`) was never produced or uploaded.

The fix: add a `wrangler.jsonc` that serves the **Vite build output** (`./dist`) with SPA fallback, remove a broken `_redirects` file, then `npm run build && npx wrangler deploy`.

---

## Impact

- **User impact:** Blank page for every visitor, for ~1.5 days (first deploy 2026-05-30 → fix 2026-05-31).
- **Scope:** Entire site, all routes. This was a total outage, not a partial/edge-case failure.
- **Data:** None. Static content site, no data loss or security exposure.

---

## Timeline (UTC)

| Time | Event |
|------|-------|
| 2026-05-30 05:49 | Worker `whale-talk` first deployed (Source: "Upload"). It published the **source tree**, not a build. Site blank from this moment. |
| 2026-05-31 ~21:02 | Commit `4302ba7` "Add Cloudflare Pages SPA redirect rule" adds `app/public/_redirects` containing `/* /index.html 200`. A reasonable hypothesis (SPA routing) but the wrong diagnosis — and it never deployed (see below). |
| 2026-05-31 (evening) | Investigation begins. Time lost down a Cloudflare One / `cloudflared` (Zero Trust / Tunnels) rabbit hole — the wrong product entirely. |
| 2026-05-31 ~23:50 | First `wrangler deploy` attempt **uploads all assets but is rejected** at the final step: `Invalid _redirects configuration: Line 1: Infinite loop detected [code: 100324]`. |
| 2026-05-31 23:52 | `_redirects` removed; `wrangler deploy` succeeds. Version `a9620c99`. |
| 2026-05-31 23:5x | Verified live with headless Chromium: app mounts, deep links work, zero console errors. |
| 2026-06-01 ~00:00 | Pushed the fix (`9641d5a`) and postmortem (`9fde6ce`) to `main`. Checked `wrangler deployments list` immediately and saw no new deployment → **prematurely concluded there was no Git auto-deploy.** (Wrong: the build hadn't fired yet.) |
| 2026-06-01 00:20 | A connected **Cloudflare Workers Build** fired on the push (deployment `c7f31c36`) and **re-broke the site** — it republished the source tree (`/src/main.tsx`, `/assets/` 404). The auto-build does **not** run `npm run build`. |
| 2026-06-01 00:2x | Detected the recurrence via `curl` (served HTML showed `/src/main.tsx` again). Rebuilt and manually redeployed (`16b1e3a0`); re-verified healthy with headless Chromium. |

---

## Root cause

**The deploy pipeline published source, not a build.** There was no build step between the repository and Cloudflare. Whatever performed the original 2026-05-30 "Upload" pushed the project directory as-is, so dev-only files (`index.html` referencing `/src/main.tsx`, the entire `src/` tree) became the served site, and the compiled `dist/` that a static host actually needs was never generated.

Everything else flowed from that single fact:
- The "empty MIME type" error → a static host serving a `.tsx` file it doesn't understand.
- The `/assets/ 404` → no build output existed to serve.
- The blank `#root` → the module script never executed, so React never mounted.

### Contributing factors

1. **No `wrangler.jsonc` in the repo.** With no committed config, there was no declared build output directory and no single source of truth for how the site should be served. The deploy's behavior depended entirely on how the one-off upload was invoked.
2. **Misleading error message.** "MIME type" strongly implies a server header/content-type misconfiguration, steering investigation toward headers rather than "wrong files are being served."
3. **A plausible-but-wrong fix masked the real one.** The `_redirects` SPA-routing hypothesis was reasonable (deep-link 404s are a real and common Cloudflare static-site issue) — but it addressed a problem we didn't have, while the homepage itself was broken. It also could never have taken effect (no auto-deploy), so it gave no feedback that it was wrong.
4. **Product confusion (Pages vs Workers vs Zero Trust).** Cloudflare has several overlapping products with similar names. `_redirects` is a Pages convention; the Cloudflare One tutorial we found is for Zero Trust/Tunnels. Neither maps cleanly onto "deploy a static Worker," which cost investigation time.

---

## Why it took a while to detect / diagnose

- **The symptom pointed away from the cause.** We chased MIME headers and SPA redirects before checking *what file was actually being served*.
- **No local reproduction was attempted first.** `npm run build` + serving `dist/` locally would have immediately shown a correct `index.html` referencing `/assets/index-*.js` — visibly different from production's `/src/main.tsx`.
- **The fastest possible signal was never used:** `curl -sS https://…/` shows the served HTML in one line. Production's `<script src="/src/main.tsx">` vs a correct build's `<script src="/assets/index-*.js">` is the entire diagnosis, available in 2 seconds.
- **No deploy config in version control** meant there was nothing to read to understand intended behavior.

---

## What went well

- Once we inspected the **served HTML** (not just the error), root cause was obvious and certain.
- `wrangler` auth via OAuth was quick and gave us full control to deploy and inspect.
- We verified the fix end-to-end with a real headless browser against the live URL (app mounts, 0 console errors) **and** with `curl` confirming `text/javascript` MIME — not just "the deploy command exited 0."
- The broken `_redirects` was caught by Cloudflare's own validation (the infinite-loop error) rather than silently shipping.

---

## Resolution

1. Added **`app/wrangler.jsonc`** declaring the build output as the served directory, with SPA fallback:
   ```jsonc
   {
     "name": "whale-talk",
     "compatibility_date": "2025-05-31",
     "assets": {
       "directory": "./dist",
       "not_found_handling": "single-page-application"
     }
   }
   ```
2. **Deleted `app/public/_redirects`.** SPA routing is now handled by `not_found_handling`, the correct mechanism for Workers Static Assets.
3. Deployed the real build: `npm run build && npx wrangler deploy` (from `app/`). Live version `a9620c99`.
4. Committed both changes to `main` (`9641d5a`) so the repo reflects how the site is actually served.

---

## Key learnings about Cloudflare (for using it more gracefully)

These are the takeaways most likely to save us next time.

### 1. Know which product you're on: Pages vs Workers vs Zero Trust
- **`*.pages.dev` → Cloudflare Pages.** **`*.workers.dev` → Cloudflare Workers.** Our site is `whale-talk.nicholas-buser.workers.dev` → it's a **Worker** (Workers Static Assets), *not* Pages. The product determines the config file, the deploy command, and which conventions apply.
- **Cloudflare One / Zero Trust / `cloudflared`** is a *completely different product* (private network tunnels and access control). The `cloudflared` CLI and the "tutorials/cli" guide with `https://example.com` placeholders have **nothing to do with deploying a website.** The placeholder domain in those guides is "an app you're putting an access policy in front of." If you're deploying a site, you want **`wrangler`**, not `cloudflared`.

### 2. `wrangler` is the deploy tool; commit a `wrangler.jsonc`
- `wrangler` (`npx wrangler`) deploys and inspects Workers. `wrangler login` (OAuth, opens a browser) is the simplest auth.
- **Always commit a `wrangler.jsonc`.** Without it, deploy behavior is implicit and depends on how a command happened to be run. With it, the served directory and routing are explicit, reviewable, and reproducible.
- Useful inspection commands: `wrangler whoami`, `wrangler deployments list --name <worker>`, `wrangler pages project list` (returns empty here → confirms not Pages).

### 3. Static sites must deploy the BUILD OUTPUT, not the source
- For any Vite/bundler project, the deploy must run the build and serve `dist/` (`assets.directory: "./dist"`). Serving the repo root serves dev files like `index.html → /src/main.tsx`, which a static host cannot compile → the exact MIME error we hit.
- The dev entry (`/src/main.tsx`) only works under `vite dev`, which transforms modules on the fly. Production has no such transform.

### 4. SPA routing on Workers: use `not_found_handling`, not `_redirects`
- For client-side routing (so `/birds/intro` serves the app instead of 404ing), set `"not_found_handling": "single-page-application"` in `wrangler.jsonc`. This is the first-class mechanism for Workers Static Assets.
- **`_redirects` / `_headers` are Pages conventions.** Workers Static Assets *does* parse a `_redirects` file if present — but our `/* /index.html 200` rule was rejected as an **infinite loop (`code: 100324`)** because it rewrites every path (including `/index.html`) back to `/index.html`. Don't hand-roll SPA fallback with `_redirects` on a Worker; use `not_found_handling`. (If you ever do need `_redirects`, real asset paths are matched before the catch-all, and the catch-all must not rewrite to a path it also matches.)

### 5. Diagnose static-host issues by inspecting what's served, not the error text
- `curl -sS https://site/` → look at the `<script>` tag. `/assets/index-*.js` = a real build. `/src/main.tsx` = source was deployed.
- `curl -sI https://site/assets/<bundle>.js` → confirm `content-type: text/javascript`. An empty/`text/html`/`text/jsx` type for a `.js`/module is the smoking gun.
- A broken **homepage** (not just deep links) rules out SPA-routing causes — routing problems only affect sub-paths.

### 6. There IS a connected Git auto-build — and it was misconfigured (the recurrence)
- A **Cloudflare Workers Build** is connected to the GitHub repo. Pushing to `main` **does** trigger a deploy — but after a **~20-minute lag**, which fooled us into briefly concluding (and writing in v1 of this doc) that no auto-deploy existed. **Lesson: don't conclude "no auto-deploy" from one immediate check; builds are asynchronous and can lag.**
- The connected build was **misconfigured: it does not run `npm run build`.** It republished the source tree, re-introducing the original outage (`/src/main.tsx`, `/assets/` 404). So for a window, *pushing the fix actually re-broke production.*
- Why the original `_redirects` commit (2026-05-31) appeared to "do nothing": it likely *was* auto-deployed, but since the deploy serves un-built source, no config change to a Worker build could have helped — the site was broken regardless.
- **Correct Workers Build settings** (Dashboard → Workers & Pages → `whale-talk` → Settings → Build):
  - **Root directory:** `app`
  - **Build command:** `npm install && npm run build`
  - **Deploy command:** `npx wrangler deploy` (this honors `app/wrangler.jsonc` → serves `./dist`)
- **The mental model that prevents this whole class of bug:** the pipeline must *build, then deploy the build*. A deploy step alone (no build) will serve whatever is in the repo — which for a Vite app is un-compiled source.
- Manual deploy remains available as the escape hatch, from `app/`:
  ```bash
  npm run build && npx wrangler deploy
  ```

---

## Action items

| # | Action | Type | Owner | Status |
|---|--------|------|-------|--------|
| 1 | Commit `wrangler.jsonc` serving `./dist` with SPA fallback | Fix | — | ✅ Done (`9641d5a`) |
| 2 | Remove broken `public/_redirects` | Fix | — | ✅ Done (`9641d5a`) |
| 3 | Fix the connected Workers Build: Root dir `app`, Build command `npm install && npm run build`, Deploy command `npx wrangler deploy` | Prevent | Nick | ⬜ Open (in progress) |
| 4 | Add a one-line deploy section to the repo README (`npm run build && npx wrangler deploy` from `app/`) | Prevent | — | ⬜ Open |
| 5 | Add a post-deploy smoke check: `curl` the site and assert the served HTML references `/assets/` (not `/src/main.tsx`) and the JS asset returns `text/javascript`. Run after every auto-build. | Detect | Nick | ⬜ Open |
| 6 | After any `git push`, re-verify production after the auto-build completes (allow for build lag) before assuming it's healthy | Detect | Nick | ⬜ Open |

---

## Lessons in one line

When a static site shows a MIME/module error, **look at what the server is actually serving before touching headers or redirects** — and make sure you're deploying the *build*, not the *source*.
