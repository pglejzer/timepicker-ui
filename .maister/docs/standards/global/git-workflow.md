# Git & Working Agreement

### Git Is the User's Responsibility
Never run `git add` / `commit` / `push` / `branch` / `merge`. Only read-only git (`status`, `log`, `diff`) is allowed. Version bumps, tags, and publishing are the user's job. Source: docs (architecture.md, build-release agent).

### Batch Execution
Do not run build/test/lint after each task. Verify by reading and reasoning, report what changed and why, and let the user run the full suite at the end. A single focused test while iterating (debugging) is fine; the full suite/coverage/lint per task is not. Source: docs.

### Pull Request Process
PRs: discuss with owners first, remove any build/install deps introduced for a build, update README.md for interface/options/methods/API changes, bump version numbers in examples and README, and require sign-off from at least one developer before merge. Source: .github/CONTRIBUTING.md.
