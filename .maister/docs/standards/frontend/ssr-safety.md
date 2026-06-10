# SSR Safety

### No Top-Level DOM Access
Code must be SSR-safe: no bare `window`/`document` access at module top level. SSR detection is centralized in `app/src/utils/node.ts` (`isNode = () => typeof window === 'undefined'`, `isDocument = () => typeof document !== 'undefined'`). DOM-touching code guards with `isNode()` / `isDocument()` (or `=== false` checks); `requestAnimationFrame` is feature-detected before use. Pure `engine/` math must never import the DOM. Verified: isNode/isDocument used 36× across 16 files. Sources: code, docs.
