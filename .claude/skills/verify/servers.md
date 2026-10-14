# /verify — server recipes

Main agent only. Paths are relative to the repo root (`ROOT=$(git rev-parse --show-toplevel)` in
Bash). The **Tool** column says which shell runs a command. Start every server with
`run_in_background: true` and keep its task id for §5. Logs go to `.verify/logs/`.
`<base>` = base ref (default `HEAD`); `<RUN_ID>` comes from §4. Everything here is local —
never publish, deploy or push, and never install or remove packages (`npm install` / `ci` /
`uninstall` / `update` are the user's job; ask and wait when `node_modules` is missing).

Ports: 8105 lib before, 8106 lib after, 3105 docs before, 3106 docs after, 8199 helpers.

## §0 Preflight (always, in this order)

| Check | Tool | Command | Pass | On failure |
|---|---|---|---|---|
| Node ≥ 22 | Bash | `node -p "process.versions.node.split('.')[0]"` | `>= 22` | stop: "Switch to Node 22+ (e.g. `nvm use 22.20.0`)." |
| app deps | Bash | `test -f app/node_modules/.bin/webpack && echo ok` | `ok` | stop: ask the user to run `npm install --legacy-peer-deps` in `app/` (agents never install packages). |
| docs deps (docs target only) | Bash | `test -d docs-app/node_modules/next && echo ok` | `ok` | drop the docs target; ask the user to run `npm install` in `docs-app/`. |
| base ref | Bash | `git rev-parse --verify "<base>^{commit}"` | a sha | stop: "Unknown --base `<base>`." |
| ports free | PowerShell | `@(Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue \| Where-Object { $_.LocalPort -in 8105,8106,3105,3106,8199 } \| Select-Object LocalPort,OwningProcess)` | empty | stop, show ports + PIDs (likely a leftover `/verify`); offer §5 step 2, re-run preflight after the user agrees |
| unlink junction | PowerShell | `if (Test-Path .verify\work\before\app\node_modules) { cmd /c rmdir .verify\work\before\app\node_modules }` | — | — |
| reset run dirs | Bash | `rm -rf .verify/work .verify/shots .verify/fp .verify/SUMMARY.md && mkdir -p .verify/work/before .verify/logs .verify/shots .verify/fp` | — | — |

Unlink the junction (`cmd /c rmdir`) BEFORE any recursive delete under `.verify/work`. Never
`Remove-Item -Recurse` or `rm -rf` while it is linked — that deletes `app/node_modules`.

## §1 Library servers (target `lib`)

1. Extract the base (Bash):
   ```bash
   git archive --format=tar "<base>" app docs-app package.json | tar -x -C .verify/work/before
   ```
2. Link dependencies (PowerShell):
   ```powershell
   New-Item -ItemType Junction -Path .verify\work\before\app\node_modules -Target (Resolve-Path app\node_modules) | Out-Null
   ```
3. Before server (Bash, background) — skip with `--no-baseline`:
   ```bash
   ROOT=$(git rev-parse --show-toplevel); cd "$ROOT/.verify/work/before/app" && npx webpack serve --port 8105 --no-open --output-path "$ROOT/.verify/work/out-before" > "$ROOT/.verify/logs/lib-before.log" 2>&1
   ```
4. After server (Bash, background):
   ```bash
   ROOT=$(git rev-parse --show-toplevel); cd "$ROOT/app" && npx webpack serve --port 8106 --no-open --output-path "$ROOT/.verify/work/out-after" > "$ROOT/.verify/logs/lib-after.log" 2>&1
   ```
5. §3 for `http://localhost:8105/` (if started) and `http://localhost:8106/`. First compile ~45 s.

## §1a Helpers server (always, before any browser work)

Serves `helpers.js` so pages load it with a tiny loader instead of pasting the file into every
navigation. Bash, background:

```bash
node -e "require('http').createServer((q,s)=>{s.setHeader('Access-Control-Allow-Origin','*');s.setHeader('Cache-Control','no-store');s.setHeader('Content-Type','text/javascript; charset=utf-8');s.end(require('fs').readFileSync('.claude/skills/verify/helpers.js'))}).listen(8199,'127.0.0.1')" > .verify/logs/helpers-server.log 2>&1
```

Then §3 for `http://127.0.0.1:8199/`.

## §2 Docs sandboxes (target `docs`)

`<phase>` = `before` | `after`. Sandboxes `.verify/docs-sandbox-before/` and
`.verify/docs-sandbox-after/` are kept between runs. Nothing is installed (packages are the user's
job): each sandbox gets a copy of the user-installed `docs-app/node_modules`, and only
`timepicker-ui` inside that copy is replaced by the local build. The real `docs-app/` and its
`node_modules` are never modified. Two sandboxes because two `next dev` servers cannot share one folder.

1. **Build the library** (Bash). After:
   ```bash
   cd app && npx tsup > ../.verify/logs/build-after.log 2>&1 && npx rollup -c >> ../.verify/logs/build-after.log 2>&1
   ```
   Before — only if `git diff --name-only <base> -- app/src app/package.json app/tsup.config.ts app/rollup.config.js package.json`
   prints something (otherwise the after build serves both phases); needs §1 steps 1-2 first:
   ```bash
   cd .verify/work/before/app && npx tsup > ../../../logs/build-before.log 2>&1 && npx rollup -c >> ../../../logs/build-before.log 2>&1
   ```
   A failing after build is a finding: report it, skip the docs target.
2. **Pack and unpack** (Bash). After:
   ```bash
   mkdir -p .verify/work/pack-after && npm pack --ignore-scripts --pack-destination .verify/work/pack-after > .verify/logs/pack-after.log 2>&1 && tar -xzf .verify/work/pack-after/timepicker-ui-*.tgz -C .verify/work/pack-after
   ```
   Before (only when built in step 1):
   ```bash
   mkdir -p .verify/work/pack-before && (cd .verify/work/before && npm pack --ignore-scripts --pack-destination ../pack-before > ../../logs/pack-before.log 2>&1) && tar -xzf .verify/work/pack-before/timepicker-ui-*.tgz -C .verify/work/pack-before
   ```
   The package contents land in `.verify/work/pack-<phase>/package/`. `<pack>` below = `pack-before`
   for the before phase when it was built, otherwise `pack-after`.
3. **Copy sources** (PowerShell). After from the working tree, before from the extracted base:
   ```powershell
   robocopy docs-app .verify\docs-sandbox-after /MIR /XD node_modules .next /XF package-lock.json /NFL /NDL /NJH /NJS /NP | Out-Null; if ($LASTEXITCODE -ge 8) { throw "robocopy failed: $LASTEXITCODE" }; exit 0
   ```
   ```powershell
   robocopy .verify\work\before\docs-app .verify\docs-sandbox-before /MIR /XD node_modules .next /XF package-lock.json /NFL /NDL /NJH /NJS /NP | Out-Null; if ($LASTEXITCODE -ge 8) { throw "robocopy failed: $LASTEXITCODE" }; exit 0
   ```
4. **Copy the user-installed dependencies** (PowerShell, per phase). The first run copies
   everything once; later runs copy only differences (and restore the original `timepicker-ui`,
   which step 5 replaces again):
   ```powershell
   robocopy docs-app\node_modules .verify\docs-sandbox-<phase>\node_modules /MIR /MT:16 /NFL /NDL /NJH /NJS /NP | Out-Null; if ($LASTEXITCODE -ge 8) { throw "robocopy failed: $LASTEXITCODE" }; exit 0
   ```
5. **Swap in the local library** (PowerShell, per phase). The nested copy under
   `timepicker-ui-react` (it pins `timepicker-ui: 4.3.0`) is removed so the React wrapper resolves
   the local build too:
   ```powershell
   $nm = ".verify\docs-sandbox-<phase>\node_modules"; robocopy ".verify\work\<pack>\package" "$nm\timepicker-ui" /MIR /NFL /NDL /NJH /NJS /NP | Out-Null; if ($LASTEXITCODE -ge 8) { throw "robocopy failed: $LASTEXITCODE" }; $nested = "$nm\timepicker-ui-react\node_modules\timepicker-ui"; if (Test-Path $nested) { Remove-Item -Recurse -Force $nested }; exit 0
   ```
6. **Hide the Next dev indicator in the copy** (Bash, per phase):
   ```bash
   node -e "const f=process.argv[1],fs=require('fs');let s=fs.readFileSync(f,'utf8');if(!s.includes('devIndicators')){const n=s.replace(/(const nextConfig[^=]*=\s*\{)/,'\$1\n  devIndicators: false,');if(n===s)console.error('WARN: devIndicators not patched');fs.writeFileSync(f,n)}" .verify/docs-sandbox-<phase>/next.config.ts
   ```
7. **Check the local library is in place** (Bash, per phase) — must print `same: true, nested: false`:
   ```bash
   node -e "const c=require('crypto'),fs=require('fs');const h=(f)=>c.createHash('sha1').update(fs.readFileSync(f)).digest('hex');const [sb,pk]=process.argv.slice(1);const same=h(sb+'/node_modules/timepicker-ui/dist/index.js')===h(pk+'/package/dist/index.js');const nested=fs.existsSync(sb+'/node_modules/timepicker-ui-react/node_modules/timepicker-ui');console.log({same,nested});if(!same||nested){console.error('LOCAL LIBRARY NOT IN PLACE');process.exit(1)}" .verify/docs-sandbox-<phase> .verify/work/<pack>
   ```
   Failure → drop the docs target, report. Then clear the Next cache: `rm -rf .verify/docs-sandbox-<phase>/.next`.
8. **Servers** (Bash, background). `NEXT_TURBOPACK_EXPERIMENTAL_USE_SYSTEM_TLS_CERTS=1` makes
   `next/font/google` trust the Windows certificate store — without it the Geist font download
   fails with a TLS error behind the corporate proxy and every page answers 500:
   ```bash
   ROOT=$(git rev-parse --show-toplevel); cd "$ROOT/.verify/docs-sandbox-before" && NEXT_TURBOPACK_EXPERIMENTAL_USE_SYSTEM_TLS_CERTS=1 npx next dev -p 3105 > "$ROOT/.verify/logs/docs-before.log" 2>&1
   ```
   ```bash
   ROOT=$(git rev-parse --show-toplevel); cd "$ROOT/.verify/docs-sandbox-after" && NEXT_TURBOPACK_EXPERIMENTAL_USE_SYSTEM_TLS_CERTS=1 npx next dev -p 3106 > "$ROOT/.verify/logs/docs-after.log" 2>&1
   ```
   Then §3 for `http://localhost:3105/` and `http://localhost:3106/` (the first request compiles
   `/`, ~20-30 s). A log full of "TLS-related" errors means the variable did not apply.

## §3 Readiness

Bash, tool `timeout` 200000 per URL:

```bash
node -e "const u=process.argv[1],ms=+process.argv[2],t=Date.now();(async function p(){try{const r=await fetch(u);if(r.ok){console.log('up',u,r.status);process.exit(0)}}catch{}if(Date.now()-t>ms){console.error('timeout',u);process.exit(1)}setTimeout(p,1000)})()" <url> 180000
```

Only a 2xx answer counts: `next dev` answers 404 / 500 while the route tree is still compiling.
`timeout` → `tail -n 40 .verify/logs/<log>` into the report, stop that server (§5), drop its
target (a failed before server → that target continues with no baseline).

## §4 Run id

Bash: `date +%Y%m%d-%H%M%S` → `<RUN_ID>` (SUMMARY.md header).

## §5 Stop (always — also after any failure)

1. Stop every background task you started (TaskStop with each task id; load it via ToolSearch
   `select:TaskStop` if needed). On Windows this stops only the shell wrapper — the node server
   keeps listening, so step 2 is mandatory, never optional.
2. Kill anything still listening on the test ports (PowerShell):
   ```powershell
   Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue | Where-Object { $_.LocalPort -in 8105,8106,3105,3106,8199 } | ForEach-Object { taskkill /T /F /PID $_.OwningProcess | Out-Null }; exit 0
   ```
3. Confirm — must print `0` (PowerShell):
   ```powershell
   @(Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue | Where-Object { $_.LocalPort -in 8105,8106,3105,3106,8199 }).Count
   ```

## §6 Clean (`/verify --clean`)

1. §5.
2. PowerShell: `if (Test-Path .verify\work\before\app\node_modules) { cmd /c rmdir .verify\work\before\app\node_modules }`
3. Bash: `test -f app/node_modules/.bin/webpack && rm -rf .verify && echo cleaned`
   (if `app/node_modules` is already missing, stop and tell the user instead of deleting).
