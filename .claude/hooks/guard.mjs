#!/usr/bin/env node
// PreToolUse guard for the HARD RULES in CLAUDE.md.
// Reads the hook JSON from stdin and prints a permission decision as JSON.
//   deny = never allowed: publish, deploy, push, package installs, generated files
//   ask  = git writes from the main agent: the user approves each one
// Subagents (agent_id present) may only run read-only shell commands and never a browser.
// Deny rules in .claude/settings.json are the first layer; this guard catches the forms they
// miss (git -C . push, /usr/bin/npm publish, bash -c '...', npm.cmd, cmd /c ...).

import { readFileSync } from "node:fs";
import { relative, resolve, sep } from "node:path";

const READ_ONLY = new Set([
  "ls", "dir", "cat", "type", "head", "tail", "wc", "grep", "egrep", "fgrep", "rg", "find",
  "file", "pwd", "echo", "printf", "sort", "uniq", "cut", "tr", "diff", "cmp", "stat",
  "basename", "dirname", "realpath", "readlink", "sed", "awk", "true", "false", "test", "[",
  "tree", "du", "which", "where", "get-childitem", "gci", "get-content", "gc",
  "select-string", "sls", "get-item", "test-path", "measure-object", "select-object",
  "where-object", "foreach-object", "format-list", "format-table", "write-output",
  "resolve-path", "split-path", "join-path", "get-location", "cd", "set-location",
]);

const WRAPPERS = new Set([
  "timeout", "time", "nice", "nohup", "stdbuf", "command", "builtin", "noglob", "env",
  "xargs", "sudo", "doas", "exec", "watch", "setsid", "ionice", "flock", "call", "start",
  "start-process", "invoke-expression", "iex", "&", ".", "rtk", "npx", "npm-exec", "dotenv",
  "cross-env", "run-s", "run-p",
]);

const SHELLS = new Set(["bash", "sh", "zsh", "dash", "ksh", "fish", "cmd", "powershell", "pwsh", "eval", "wsl"]);

const BROWSER_TOOL = /^mcp__(chrome-devtools|plugin_[^_]+_playwright|playwright)__/;

const DENY = [
  [/^npm (publish|unpublish|deprecate|dist-tag|version|login|logout|adduser|add-user|token|owner|access|star|unstar|team|org|profile|hook)\b/, "npm registry and account commands are the user's job (HARD RULES 1)."],
  [/^npm (install|i|in|ins|inst|insta|instal|isntall|add|ci|clean-install|install-test|it|install-ci-test|uninstall|remove|rm|r|un|unlink|update|up|upgrade|udpate|link|ln|prune|dedupe|ddp|rebuild|rb)\b/, "Installing or removing packages is the user's job (HARD RULES 7). Propose the exact command instead."],
  [/^npm audit fix\b/, "npm audit fix changes packages (HARD RULES 7)."],
  [/^npm (exec|x)\b.*\s(--yes|-y|--package|-p)\b/, "npm exec --yes / -p downloads packages (HARD RULES 7)."],
  [/^npx\b.*\s(--yes|-y|--package|-p)\b/, "npx --yes / -p downloads packages (HARD RULES 7)."],
  [/^(pnpm|yarn|bun) (add|install|i|remove|rm|update|up|upgrade|publish|link|dlx|create|npm)\b/, "Package installs and publishing are the user's job (HARD RULES 1 and 7)."],
  [/^(pnpx|bunx)\b/, "pnpx / bunx download packages (HARD RULES 7)."],
  [/^git push\b/, "git push changes remote state (HARD RULES 1)."],
  [/^git remote (add|remove|rm|rename|set-url|set-head|set-branches|prune|update)\b/, "Changing remotes is the user's job (HARD RULES 1)."],
  [/^git tag\b(?!\s*$|\s+(-l|--list|-n\d*|--contains|--no-contains|--points-at|--merged|--no-merged)\b)/, "Creating or deleting tags is the user's job (HARD RULES 1 and 6)."],
  [/^gh (release (create|delete|delete-asset|edit|upload)|repo (create|delete|edit|rename|archive|unarchive|fork|sync|set-default|deploy-key)|pr (create|merge|close|reopen|edit|comment|review|ready|lock|unlock)|issue (create|close|reopen|edit|comment|delete|transfer|lock|unlock|pin|unpin)|workflow (run|enable|disable)|run (rerun|cancel|delete)|secret|variable|auth|gist (create|edit|delete|clone)|label (create|edit|delete|clone)|cache delete|ssh-key|gpg-key)\b/, "gh write operations change remote state (HARD RULES 1)."],
  [/^gh api\b.*\s(-X|--method)\s*(POST|PUT|PATCH|DELETE)\b/i, "gh api writes change remote state (HARD RULES 1)."],
  [/^gh api\b.*\s(-f|-F|--field|--raw-field|--input)\b/, "gh api with fields sends a write request (HARD RULES 1)."],
  [/^(vercel|netlify|firebase|wrangler|surge|now)\b/, "Deploy tools are the user's job (HARD RULES 1)."],
  [/^(curl|wget|invoke-webrequest|iwr|invoke-restmethod|irm)\b.*(registry\.npmjs\.org|api\.github\.com|api\.vercel\.com)/i, "Raw requests to npm, GitHub or Vercel APIs are the user's job (HARD RULES 1)."],
];

const GIT_WRITE = /^git (add|commit|checkout|switch|merge|rebase|reset|restore|clean|cherry-pick|revert|am|apply|pull|mv|rm|stash(?!\s+(list|show)\b)|worktree(?!\s+list\b)|branch(?!\s*$|\s+(-a|-r|-l|--list|-v|-vv|--show-current|--contains|--no-contains|--merged|--no-merged|--points-at)\b)|update-ref|update-index|commit-tree|replace|notes\s+(add|edit|remove|append|copy|merge|prune)|config(?!\s+(--get|--get-all|--get-regexp|--list|-l)\b)|filter-branch|gc|prune|submodule\s+(add|update|deinit|sync)|lfs)\b/;

function emit(decision, reason) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: decision,
        permissionDecisionReason: `[guard] ${reason}`,
      },
    }),
  );
  process.exit(0);
}

function normalize(raw) {
  let text = ` ${raw} `
    .replace(/\\\r?\n/g, " ")
    .replace(/["'`]/g, " ")
    .replace(/\^(?=\S)/g, "")
    .replace(/\d*>&\d+/g, " ")
    .replace(/\d*>{1,2}\s*(\/dev\/null|nul)\b/gi, " ");
  text = text.replace(/[^\s;&|()=]*[\\/]([A-Za-z][\w-]+)(\.cmd|\.exe|\.ps1|\.bat)?(?=\s)/g, " $1 ");
  text = text.replace(/\b([A-Za-z][\w-]*)\.(cmd|exe|ps1|bat)\b/gi, "$1");
  text = text.replace(/\bgit((?:\s+(?:-C|-c|--git-dir|--work-tree|--namespace|--exec-path|--config-env)(?:=|\s+)\S+|\s+(?:--no-pager|-P|--paginate|-p|--bare|--no-replace-objects|--literal-pathspecs|--no-optional-locks))+)/g, "git");
  text = text.replace(/\bnpm((?:\s+(?:--prefix|-C|--workspace|-w|--registry|--userconfig|--loglevel|--cache)(?:=|\s+)\S+|\s+(?:-g|--global|-ws|--workspaces|--silent|-s|-q|--quiet|--force|-f|--dry-run|--no-audit|--no-fund|--yes|-y))+)/g, "npm");
  text = text.replace(/\bgh\s+(-R|--repo)(?:=|\s+)\S+/g, "gh");
  return text;
}

function segments(text) {
  return text
    .split(/&&|\|\||[;&|\n{}]|\$\(|\(|\)/)
    .map((part) => part.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function unwrapStages(segment) {
  const words = segment.replace(/^([A-Za-z_][A-Za-z0-9_]*=\S*\s+)+/, "").split(" ");
  const stages = [words.join(" ")];
  for (let step = 0; step < 10 && words.length > 0; step += 1) {
    const head = words[0].toLowerCase();
    if (!WRAPPERS.has(head) && !SHELLS.has(head)) break;
    words.shift();
    while (words.length > 0 && (/^[-/]/.test(words[0]) || /^\d+[smhd]?$/.test(words[0]) || /^(bypass|unrestricted|remotesigned|hidden|normal)$/i.test(words[0]) || /^[A-Za-z_][A-Za-z0-9_]*=/.test(words[0]))) {
      words.shift();
    }
    stages.push(words.join(" "));
  }
  return stages.filter(Boolean);
}

function commandsIn(raw) {
  return segments(normalize(raw)).map(unwrapStages).filter((stages) => stages.length > 0);
}

function programOf(command) {
  return (command.split(" ")[0] ?? "").toLowerCase();
}

function checkShell(raw, isSubagent) {
  const staged = commandsIn(raw);
  for (const stages of staged) {
    for (const stage of stages) {
      for (const [pattern, reason] of DENY) {
        if (pattern.test(stage)) emit("deny", reason);
      }
    }
  }
  const commands = staged.map((stages) => stages[stages.length - 1]);
  if (isSubagent) {
    if (/(^|[^>&0-9])>{1,2}\s*(?!&|\/dev\/null|nul\b)\S/i.test(raw.replace(/2>&1/g, ""))) {
      emit("deny", "Subagents edit files with Edit / Write, not with shell redirects (HARD RULES 2).");
    }
    for (const command of commands) {
      const program = programOf(command);
      if (!READ_ONLY.has(program)) {
        emit("deny", `Subagents may only run read-only shell commands (HARD RULES 2); \`${program}\` is not one. Use Read / Grep / Glob, or list the command for the main agent.`);
      }
      if ((program === "sed" && /\s-[a-z]*i/.test(command)) || (program === "find" && /\s-(exec|execdir|ok|okdir|delete|fprint)/.test(command)) || (program === "awk" && /system\s*\(|>\s*\S/.test(command))) {
        emit("deny", `Subagents may only read; \`${program}\` with these flags writes or runs commands (HARD RULES 2).`);
      }
    }
    return;
  }
  for (const command of commands) {
    const write = command.match(GIT_WRITE);
    if (write) {
      emit("ask", `\`git ${write[1]}\` changes the repository. HARD RULES 6: only when the user explicitly asked for this one operation.`);
    }
  }
}

function projectPath(filePath, root) {
  if (!filePath) return "";
  return relative(root, resolve(root, filePath)).split(sep).join("/");
}

const DEPENDENCY_KEYS = ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies", "bundleDependencies", "bundledDependencies", "overrides", "resolutions"];

function applyEdits(original, input) {
  if (typeof input.content === "string") return input.content;
  const edits = Array.isArray(input.edits) ? input.edits : [input];
  let text = original;
  for (const edit of edits) {
    const from = String(edit.old_string ?? "");
    const to = String(edit.new_string ?? "");
    if (from === "") return null;
    text = edit.replace_all ? text.split(from).join(to) : text.replace(from, () => to);
  }
  return text;
}

function changesDependencies(path, absolute, input) {
  if (!/(^|\/)package\.json$/.test(path)) return false;
  let original = "";
  try {
    original = readFileSync(absolute, "utf8");
  } catch {
    original = "";
  }
  const updated = applyEdits(original, input);
  try {
    const before = original ? JSON.parse(original) : {};
    const after = JSON.parse(updated ?? "");
    return DEPENDENCY_KEYS.some((key) => JSON.stringify(before[key] ?? null) !== JSON.stringify(after[key] ?? null));
  } catch {
    return true;
  }
}

function checkFileWrite(input, root, isSubagent) {
  const target = input.file_path ?? input.notebook_path ?? "";
  const path = projectPath(target, root);
  if (/(^|\/)(dist|dist-demo|node_modules)\//.test(path) || /(^|\/)(package-lock\.json|npm-shrinkwrap\.json|yarn\.lock|pnpm-lock\.yaml)$/.test(path)) {
    emit("deny", `\`${path}\` is generated or installed output; never edit it by hand.`);
  }
  if (changesDependencies(path, resolve(root, target), input)) {
    emit("deny", "Dependencies in package.json are the user's job (HARD RULES 7). Propose the change instead.");
  }
  if (/^\.claude\/(settings(\.local)?\.json$|hooks\/)/.test(path)) {
    if (isSubagent) emit("deny", "Subagents never change the guard or Claude settings.");
    emit("ask", "This changes the guard or Claude settings; the user approves it.");
  }
}

function main() {
  let input = {};
  try {
    input = JSON.parse(readFileSync(0, "utf8"));
  } catch {
    emit("deny", "The guard could not read the hook input.");
  }
  const tool = input.tool_name ?? "";
  const args = input.tool_input ?? {};
  const isSubagent = Boolean(input.agent_id);
  const root = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();

  if (tool === "Bash" || tool === "PowerShell" || tool === "Monitor") {
    checkShell(String(args.command ?? ""), isSubagent);
  } else if (["Edit", "Write", "MultiEdit", "NotebookEdit"].includes(tool)) {
    checkFileWrite(args, root, isSubagent);
  } else if (isSubagent && BROWSER_TOOL.test(tool)) {
    emit("deny", "Browsers belong to the main agent (HARD RULES 2 and 5).");
  }
  process.exit(0);
}

main();
