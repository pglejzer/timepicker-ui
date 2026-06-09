---
name: release
description: Cut a new timepicker-ui release. Use when the user wants to bump the version, prepare a release, write/update the changelog, or sync version + changelog across README, CHANGELOG.md and the docs-app (changelog/what's-new/version strings). Drives the build-release subagent in an audit → approve → apply flow, then runs a sanity build. Does NOT git-commit/tag or npm-publish — proposes those for the user to run.
---

# Release

Prepare a complete, consistent `timepicker-ui` release in one flow. This skill is a thin
orchestrator: the real work is done by the **`build-release`** subagent. The skill exists to
decide the version with you and to hold the **approval gate** the subagent can't run itself.

The version source of truth is the **root `package.json`** (`timepicker-ui`) — the ONLY `version`
field a release ever changes. `app/package.json` (build workspace) and `docs-app/package.json`
(docs site) are each a *separate application's own version*; a release NEVER touches their
`version` field. What a release does in `docs-app/` is update the **content that references the
library version** — the changelog page, what's-new, and `npm i timepicker-ui@x.y.z` install
snippets — not the docs site's own app version.

**The changelog is about the library, not the docs site.** `CHANGELOG.md` and the docs-app
changelog page record changes to the published `timepicker-ui` package only. Changes to
`docs-app/` itself (SEO, page content, demo fixes, favicons, docs-site bugs) are NEVER logged
and never bump the version — the docs site is a separate app the library does not track. The
docs-app changelog page just *presents* the library changelog. If a release touched only
`docs-app/`, there is no library release to cut — say so instead of inventing entries.

## Arguments (optional)
- A version or bump type: `/release patch`, `/release minor`, `/release major`, or an explicit
  number `/release 4.4.0`. If omitted, the skill proposes a bump from the changes since the last
  release and asks you to confirm.
- `--apply-all` skips the per-area approval prompt and applies the whole audited plan (still
  reports + sanity-builds at the end). Use only for an explicitly unattended run.

## Workflow

### Phase 1 — Decide the version (gate)
1. Read the current version from root `package.json`. Skim what changed since the last release
   (read-only `git log` / `git diff` against the last release tag/commit, plus the working tree)
   to judge magnitude. The branch name (e.g. `feature/4.4.0`) is a strong hint at intent.
2. Propose a SemVer bump with a one-line rationale:
   - `patch` — bug fixes / internal only, no public API change
   - `minor` — new backwards-compatible options/plugins/themes/methods
   - `major` — breaking change to public API, option groups, `getValue()` shape, exports, or the
     `tp-ui-` CSS class contract (requires migration notes)
3. **Use AskUserQuestion** to confirm the exact new version before anything else. If the user
   passed a version/bump as an argument, still confirm it. The number is a promise to consumers.

### Phase 2 — Audit (read-only)
Dispatch the `build-release` subagent (Task tool, `subagent_type: build-release`) in **audit mode**
with the confirmed new version. Ask it to return a file-level plan, making NO edits:
1. Every place that must be bumped (root `package.json`; README version-pinned Socket badge +
   any Features/Options/Themes/Plugins/API/Upgrading sections affected by this release).
2. The **historical** version references it will deliberately leave untouched (prior CHANGELOG
   entries, docs-app `<Section>` blocks, "Removed in v4.0.0", migration guides) — listed so you
   can see nothing historical gets rewritten.
3. A drafted **CHANGELOG.md** entry (`## [x.y.z] - YYYY-MM-DD`, grouped Added/Changed/Fixed/…,
   user-facing copy) derived from the actual diff/commits — not invented.
4. The matching docs-app updates: a new `<Section>` for `app/(site)/docs/changelog/page.tsx`, the
   what's-new highlights, and any install/banner version strings.

### Phase 3 — Present & approve (gate)
Relay the plan concisely: proposed version, the drafted changelog, the bump list, and the
"leave historical" list. **Use AskUserQuestion** to approve as-is, edit the changelog copy, or
narrow scope (e.g. skip docs-app this round). Capture the approved version + final changelog
text. Do not skip this gate unless `--apply-all` was passed.

### Phase 4 — Apply
Dispatch `build-release` again in **apply mode** with the approved version and final changelog.
It edits root `package.json`, README (badge + affected sections), `CHANGELOG.md`, and the
docs-app changelog/what's-new/version strings — bumping only current-version references and
leaving historical ones intact. It matches docs-app's own conventions (not the library's CRLF
rules) for docs-app files.

### Phase 5 — Sanity build & report
- Run a build to confirm nothing broke: `cd app && npm run build:prod` (or `build:tsup` +
  `build:rollup`). Report pass/fail with the real output — never claim green without running it.
  If the user prefers to run it themselves, offer rather than assume.
- Summarize: new version, every file changed (grouped: package.json / README / CHANGELOG /
  docs-app), and confirmation that `exports` / `sideEffects` / entry points / zero-dependency /
  tree-shaking are intact.
- **Propose the release commands for the user to run** — git is theirs:
  a commit message, the tag (`vX.Y.Z`), and the publish step (`npm publish`). Do NOT run
  `git add/commit/tag/push` or `npm publish` yourself.

## Guardrails
- One source of truth for the version (root `package.json`). NEVER touch the `version` field of
  `app/package.json` or `docs-app/package.json` — those are separate apps, not the library. In
  `docs-app/` a release only edits content that *references* the library version (changelog /
  what's-new / install snippets), never the docs site's own `version`.
- Never rewrite historical version references or past changelog entries.
- Keep `.claude/` and library files CRLF; docs-app files keep docs-app's own style.
- This skill prepares a release; it does not execute git or npm publish.
