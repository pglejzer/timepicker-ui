---
name: verify
description: Browser-check what a change could have broken in timepicker-ui (library demo and docs-app, before/after). Use at the end of a task that changed library behavior or styles (app/src) or docs-app pages, or when the user asks to check that nothing broke. Not for demo examples in app/docs, copy/typo/comment edits or one-line fixes (HARD RULES §5 in CLAUDE.md). Main agent only, never delegated to a subagent.
---

# /verify — before/after browser verification

Runs entirely in the **main agent** (HARD RULES in `CLAUDE.md`: subagents never run servers,
browsers or checks). Report only: never fixes code, never runs git writes, never publishes.

Files in this folder: `impact-map.md` (path → tags → routes), `servers.md` (exact commands),
`scenarios.md` (steps per tag), `helpers.js` (served on `127.0.0.1:8199`, injected as `window.__tp`).

## Arguments
- `lib` / `docs` — force a target (default: auto from the diff).
- `--base <ref>` — compare against `<ref>` (default `HEAD`; e.g. `HEAD~1` when the change is committed).
- `--no-docs` — skip the docs target.
- `--no-baseline` — after phase only (expectations + screenshots, no comparison); a SHOT is the
  screenshot only, no fingerprint.
- `--files <paths>` — select tags from these files instead of the diff. Use it when the working
  tree holds unrelated uncommitted work (a release in progress); pair with `--no-baseline` when
  the base predates that work.
- `--full` — run every scenario of every selected tag, every viewport and every mapped docs route.
  Use it before a release or when the user asks; without it the run uses the quick profile (Step 2.5).
- `--mcp chrome-devtools|playwright` — force the MCP.
- `--tags <@a,@b>` — add these tags to whatever the diff selects; with an empty diff the run still
  has a baseline (before = after → a determinism check).
- `--clean` — servers.md §6, then stop.

## Step 1 — Preflight
servers.md §0, then §4 (run id). Any failure → stop with the exact fix for the user.

## Step 2 — Tags, targets, routes
1. Changed files: the `--files` list when given, else (Bash) `git diff --name-only <base>` and
   `git ls-files --others --exclude-standard`.
2. impact-map.md §1 / §3 → tags (union) + `@smoke`; unmatched → UNCOVERED (read its diff, pick
   tags yourself, propose a map row in the report).
3. Targets and docs routes: impact-map.md §2 and §4; apply `lib` / `docs` / `--no-docs`.
4. Add `--tags`. Scenarios to run = every `lib/*` scenario under the heading of each selected
   tag in scenarios.md; style-rule tags also add `lib/variants-<tag>`; `@theme:<X>` runs
   `lib/theme-<X>`; plus one `docs/<route>` scenario per selected route. Read only what runs:
   Grep `^## ` in scenarios.md for line numbers, then Read the common headers and each selected
   section with offset/limit, not the whole file.
5. **Quick profile** (default; `--full` skips this step):
   - lib: desktop only - drop scenarios and SHOTs with `vp: m` or `vp: l` unless a changed file is
     `MobileViewHandler.ts` or under `app/src/styles/`, or the task is about mobile;
   - `lib/themes` and `lib/seconds-themes`: only `basic`, `dark` and the themes the task changed;
   - docs: impact-map §3 routes as mapped; from §2 only the first route of each tag; desktop only
     unless a docs-app page or component changed.
6. Tell the user in 2-4 lines: base, targets, profile (quick: what `--full` would add), tags (with the
   triggering file), routes, uncovered. Don't wait.

## Step 3 — Servers
servers.md §1a (helpers server, always first), then §1 (lib) and/or §2 (docs — includes
`NEXT_TURBOPACK_EXPERIMENTAL_USE_SYSTEM_TLS_CERTS=1` for `next/font/google` behind the proxy);
skip before servers with `--no-baseline`. Every server in the background, keep task ids; §3 for
each. A failing server → log tail into the report, drop that target (a failing before server →
that target runs without baseline).

## Step 4 — Browser
1. **MCP** (unless `--mcp`): `mcp__chrome-devtools__list_pages`; on any error → Playwright MCP
   `browser_tabs` (`action: list`); both fail → SUMMARY.md "No browser MCP available" with both
   errors and NO verdict, go to Step 6. Before and after MUST use the same MCP; if it dies mid-run,
   delete `.verify/shots` and `.verify/fp`, switch, redo Step 4.
2. **Pages** — chrome-devtools: `new_page` per target+phase (`lib-before`, `lib-after`,
   `docs-before`, `docs-after`), note each `pageId`; on each `emulate` `viewport: "1280x800x1"`,
   `colorScheme: "light"`. Playwright MCP (one page): run phases one after another;
   `browser_resize` 1280×800, `browser_emulate_media` `colorScheme: "light"`.
   chrome-devtools can restart its browser between calls ("No page found", page ids change) →
   `list_pages`, `new_page` + `emulate` again, and redo the current scenario from its navigation.
3. **Run** every selected scenario (below): all before-phase runs first, then after. Before a
   phase starts, `select_page` its page with `bringToFront: true` — a background tab throttles
   `requestAnimationFrame` (used by `settle()`) and keyboard focus.
4. **Close** what you opened (`close_page`, keep one blank page / `browser_close`).

### Running a scenario
Header: `page` (lib → 8105/8106, docs → 3105/3106), `vp` (d = `1280x800x1`, m = `390x844x1,mobile,touch`),
`path`, ready call, optional hide/ignore. `M` = `body > .tp-ui-modal.show`.

1. Set the viewport if `vp` differs from the page's current one (`emulate` / `browser_resize` 390×844).
2. Navigate to server + `path` (never paste `helpers.js` itself — the loader fetches it from 8199):
   - chrome-devtools: `navigate_page` `type: "url"`, `url`, `initScript` =
     `(()=>{try{const x=new XMLHttpRequest();x.open('GET','http://127.0.0.1:8199/helpers.js',false);x.send();(0,eval)(x.responseText);}catch(e){window.__tpLoadError=String(e);}})()`
   - playwright: `browser_navigate`, then `browser_evaluate`
     `async () => { const r = await fetch('http://127.0.0.1:8199/helpers.js'); (0, eval)(await r.text()); return !!window.__tp; }`.
   - `window.__tp` missing → read `window.__tpLoadError`; check §1a is listening; redo the navigation.
3. Run the ready call, then the hide call if any.
4. Steps in order:
   - `DO <call>` → `evaluate_script` / `browser_evaluate` with `async () => await window.__tp.<call>`.
     Both phases; compare `→ EXPECT` only in after. Consecutive DO/CHECK steps without a KEY or
     SHOT between them may go in one evaluate call.
   - `CHECK <call> → EXPECT …` → after phase only.
   - `KEY <key>` → `press_key` / `browser_press_key`. Both phases.
   - `SHOT <name> root=<sel> ignore=<sel>` → both phases: `DO settle()`; screenshot (viewport) to
     `.verify/shots/<phase>/<target>/<scenario-id-with-/-replaced-by-_>-<name>-<vp>.png`
     (`take_screenshot` `filePath` / `browser_take_screenshot` `filename`, `scale: "css"`);
     fingerprint (skipped with `--no-baseline`) `() => window.__tp.fingerprint('<root>', '<ignore>')` to the same path under
     `.verify/fp/…` with `.json` (`evaluate_script` `filePath` / `browser_evaluate` `filename`).
     The screenshot and the fingerprint may share one message; the next step that changes the
     page goes in a later message. A screenshot moved to the background (> 120 s) → wait for its
     completion notice, Read the PNG to confirm it shows the SHOT's state, else redo the scenario.
5. End: `CHECK errors()` in both phases (record both; "new" = in after, not in before). Playwright:
   also `browser_console_messages` (errors). A `favicon.ico` 404 is known noise — ignore it.
6. A step failing in **before** → note it, continue. In **after** → record the failed
   expectation; skip the rest of that scenario except its SHOT steps.
7. After-phase failure with a baseline → rerun that scenario on the before page WITH its
   CHECK/EXPECT lines: fails there too = `broken-on-base`, passes = `regression`.
8. A scenario marked "Known library issue" in scenarios.md that fails → `broken-on-base (known)`
   even without a baseline; it becomes a `regression` only if before passes and after fails.

## Step 5 — Compare and classify
1. Normalize all fingerprints (Bash):
   ```bash
   find .verify/fp -name '*.json' -print0 | xargs -0 -r node -e "const fs=require('fs');for(const f of process.argv.slice(1)){const s=fs.readFileSync(f,'utf8');if(s.startsWith('{\"root\"')&&s.trim().split('\n').length>1)continue;let d;try{d=JSON.parse(s)}catch{d=JSON.parse(s.slice(s.indexOf('{'),s.lastIndexOf('}')+1))}if(typeof d==='string')d=JSON.parse(d);fs.writeFileSync(f,[JSON.stringify({root:d.root,viewport:d.viewport,count:d.count,missing:d.missing||false}),...(d.nodes||[]).map(n=>JSON.stringify(n))].join('\n')+'\n')}"
   ```
2. `git diff --no-index --stat -- .verify/fp/before .verify/fp/after 2>/dev/null` → changed files
   (stderr carries LF→CRLF warnings only; exit code 1 just means "differs"). For each:
   `git diff --no-index -U0 -- <before> <after> 2>/dev/null` (which nodes/styles changed), then
   Read both PNGs. Identical fingerprints → don't open the PNGs.
3. Verdicts:
   - **intended** — the difference is in the area the task changed (task context + `git diff --stat <base>`)
     and looks like that change.
   - **regression** — difference outside the intended change; visual break (overlap, clipping,
     misalignment, missing element, unreadable contrast); failed expectation; new error.
   - **broken-on-base** — expectation failing on before too.
   - **unclear** — cannot tell; say why. `/verify` run without task context → visual differences
     are `unclear` with a description, never `intended`.
4. Owners: styles → `styling-themes`; clock → `clock-engine-dev`; wheel/range/timezone/PluginRegistry
   → `plugin-dev`; modal/events/config/validation/core/templates → `core-architect`; ARIA/keyboard
   semantics → `accessibility`; docs pages → `docs-site`.
5. New `broken-on-base` library bugs (not already listed) → append a row to the Confirmed table of
   `docs/superpowers/bugs/2026-10-11-verify-findings.md` (area, what happens vs expected, file:line
   if known, owner, repro). Log only — fixing is a separate task the user starts.
6. Write `.verify/SUMMARY.md`:
   ```markdown
   # /verify — <RUN_ID>
   MCP: <chrome-devtools|playwright> · Base: <ref> · Baseline: <yes|no> · Targets: <lib, docs>
   Tags: <@smoke, @wheel (← app/src/managers/plugins/wheel/WheelDragHandler.ts), …>
   Docs routes: <…>

   ## Verdicts
   | Target | Scenario | Shot / step | VP | Verdict | Evidence | Owner |
   |---|---|---|---|---|---|---|

   ## Expectations (after)
   | Target | Scenario | Step | Expected | Observed | Result |
   |---|---|---|---|---|---|

   ## New errors (after)
   ## Uncovered changes → proposed impact-map rows
   ## Notes (blocked steps, MCP switch, skipped targets, server log tails)
   ```

## Step 6 — Stop servers (always, also after any failure in Steps 3-5)
servers.md §5 (TaskStop for every task id, then the port kill — TaskStop alone leaves node
listening on Windows); the count must be `0`. Then unlink the junction (servers.md §0 "unlink
junction" row) so a later manual delete of `.verify/` cannot reach `app/node_modules`.

## Step 7 — Report
Relay SUMMARY.md briefly: MCP, counts per verdict, each regression (PNG paths + owner),
broken-on-base (known / newly logged), uncovered + proposed rows, new errors. Offer to route
regressions to their owners (they only edit code; you run `/verify` again afterwards). Fix
nothing inside `/verify`.

## Guardrails
- Main agent only — never dispatch a subagent for any part of `/verify`.
- Local only — never `npm publish`, deploy, `git push` or any remote-changing command.
- Never install or remove packages (`npm install` / `ci` / `uninstall` / `update` / `audit fix`),
  not even inside `.verify/` sandboxes — missing `node_modules` → ask the user to run the install and wait.
- Git read-only — never `add` / `commit` / `stash` / `checkout` / `restore` / `reset` / … (HARD RULES §6).
- Never edit `app/`, `docs-app/`, `dist/` by hand; writes go to `.verify/**` and the bug backlog
  (builds also write `dist/`).
- Never touch `docs-app/package.json` or `docs-app/node_modules`.
- Junction safety — servers.md §0 / §6.
- Never a false PASS — every abort ends with an abort report, not a verdict.
- Maintenance — new demo section / option / uncovered file: propose scenario + map rows; add them
  after the user agrees.
