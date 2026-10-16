---
paths:
  - "CHANGELOG.md"
  - "README.md"
  - "app/README.md"
  - "docs-app/**"
---

# Writing rules (user-facing text)

Applies to the READMEs, `CHANGELOG.md` and the docs site's pages, changelog and what's-new.

- **Write like a maintainer.** Plain, specific English: the user-visible effect first, short
  sentences, option / class / event names in backticks.
- **Never:** hype or filler (seamless, robust, powerful, leverage, enhance, elevate, streamline,
  comprehensive, "we're excited", "under the hood"), em-dash chains, semicolons joining two
  clauses (use a full stop, ", and", ", but" or a colon), rule-of-three padding,
  emoji, internal ids (S35, #12, task names), repo file paths, internal decision history, or
  dates and numbers nobody verified.
- **Also never (signs of AI writing):** additionally, delve, crucial, pivotal, testament,
  underscore, showcase, vibrant, intricate, meticulous, foster, enduring, effortless, unlock,
  empower, cutting-edge, world-class, beautiful, stunning, supercharge, "out of the box";
  "not only / not just ... but", "it's not X, it's Y", "serves as / stands as / boasts",
  a trailing "..., ensuring X" clause, the same sentence template repeated across paragraphs,
  "In today's ...", "Whether you're ...". Code inside examples is exempt.
- **Facts come from the code.** Check an option, event or class in `app/src` before naming it.
- **Changelog entries** (`CHANGELOG.md` and its docs-app mirror): 1-2 short sentences, about 25
  words at most - what changed and, only if needed, what to do. No key-by-key lists or
  backstory; details belong on the docs pages.
- **Release date:** the user sets it. Without one the release is `## [x.y.z] - Unreleased`;
  never put today's date in on your own.
