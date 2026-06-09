# timepicker-ui — Documentation Site

The official documentation and live-demo website for [`timepicker-ui`](https://www.npmjs.com/package/timepicker-ui) — a zero-dependency, framework-agnostic, SSR-safe time picker for the web. It is built with **Next.js 16 (App Router)** and **React 19**, and deployed on **Vercel** at **https://timepicker-ui.vercel.app**.

> This is a **separate project** from the library itself. The library source lives in [`../app`](../app) (see the [library README](../README.md)); this folder (`docs-app/`) only consumes `timepicker-ui` as a published dependency to render docs, API references, and interactive examples.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

- **Node.js** — no `engines` field is declared in `package.json`, so the version is inferred. Next.js 16 requires **Node.js 20.9+**; use an active LTS release (Node 20 or 22).
- **npm** — the repository ships a `package-lock.json`, so npm is the supported package manager for this site.

## Getting Started

From the `docs-app/` directory:

```bash
# install dependencies
npm install

# start the dev server
npm run dev
```

Then open **http://localhost:3000** in your browser. The dev server uses the standard Next.js port (it is not overridden in `package.json`).

> Run all commands from `docs-app/`. This site has its own toolchain and dependencies, independent of the library build in `../app`.

## Scripts

All scripts are defined in [`package.json`](./package.json):

| Script          | Command      | Description                                          |
| --------------- | ------------ | ---------------------------------------------------- |
| `npm run dev`   | `next dev`   | Start the local development server on port 3000.     |
| `npm run build` | `next build` | Create an optimized production build.                |
| `npm run start` | `next start` | Serve the production build locally (run after build).|
| `npm run lint`  | `eslint`     | Lint the project with ESLint (flat config).          |

## Project Structure

```
docs-app/
├── app/                          # Next.js App Router
│   ├── (site)/                   # Route group for the documentation site
│   │   ├── docs/                 # Guides: installation, quick-start, configuration,
│   │   │                         #   api/, features/, advanced/, changelog, roadmap, …
│   │   ├── examples/             # Live demos: basic/, themes/, features/,
│   │   │                         #   advanced/, plugins/
│   │   ├── react/                # React wrapper docs + examples (timepicker-ui-react)
│   │   ├── bundle-stats/         # Bundle-size analysis page
│   │   ├── layout.tsx
│   │   └── page.tsx              # Landing page
│   ├── layout.tsx                # Root layout, metadata, fonts, analytics
│   ├── globals.css               # Global styles (Tailwind entry)
│   ├── manifest.ts               # Web app manifest
│   ├── robots.ts                 # robots.txt
│   ├── sitemap.ts                # Sitemap (driven by lib/seo-routes.ts)
│   ├── opengraph-image.tsx       # Dynamic OG image
│   ├── icon.svg / favicon.ico / apple-icon.png
│   └── not-found.tsx             # 404 page
├── components/                   # UI: header, footer, sidebars, code-block,
│   │                             #   command-menu, examples/, bundleStats/, …
├── lib/                          # docs-nav.ts, seo-routes.ts, use-dark-mode.ts
├── public/                       # Static assets (svgs, bundle-data.json)
├── next.config.ts                # Next config (React Compiler enabled)
├── postcss.config.mjs            # PostCSS (Tailwind CSS v4)
├── eslint.config.mjs             # ESLint flat config (eslint-config-next)
├── tsconfig.json                 # TypeScript config (@/* path alias → ./)
└── vercel.json                   # Vercel build configuration
```

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router) with the [React Compiler](https://react.dev/learn/react-compiler) enabled (`reactCompiler: true`).
- **UI library:** [React 19](https://react.dev) + React DOM 19.
- **Language:** [TypeScript 5](https://www.typescriptlang.org) (strict mode), with the `@/*` import alias mapped to the project root.
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com) via `@tailwindcss/postcss`. Fonts: Geist Sans & Geist Mono (`next/font/google`).
- **UI primitives:** [Radix UI](https://www.radix-ui.com) (`react-tabs`, `react-scroll-area`), [`lucide-react`](https://lucide.dev) icons, [`clsx`](https://github.com/lukeed/clsx).
- **Code & charts:** [`prism-react-renderer`](https://github.com/FormidableLabs/prism-react-renderer) for syntax highlighting, [`recharts`](https://recharts.org) for bundle-size charts.
- **The library on display:** [`timepicker-ui`](https://www.npmjs.com/package/timepicker-ui) and its React wrapper [`timepicker-ui-react`](https://www.npmjs.com/package/timepicker-ui-react), consumed as dependencies and rendered in live demos.
- **Analytics:** [`@vercel/analytics`](https://vercel.com/docs/analytics) and [`@vercel/speed-insights`](https://vercel.com/docs/speed-insights).

> Demos initialize the picker on the client (in an effect / client component), because the library guards DOM access for SSR safety.

## Deployment

The site is deployed on [Vercel](https://vercel.com) and serves the canonical domain **https://timepicker-ui.vercel.app** (configured via `metadataBase` and `lib/seo-routes.ts`).

Vercel build settings are defined in [`vercel.json`](./vercel.json):

- **Framework:** `nextjs`
- **Install command:** `npm install`
- **Build command:** `npm run build`
- **Output directory:** `.next`

When connected to the repository, Vercel builds and deploys automatically on push (production from the default branch, preview deployments for other branches and pull requests).

## Contributing

Contributions to the docs site are welcome.

- Report issues or request changes at https://github.com/pglejzer/timepicker-ui/issues.
- Open a pull request for fixes and improvements.
- Make sure `npm run lint` passes before submitting.
- Keep line endings **CRLF** (the repository enforces `* eol=crlf` via `.gitattributes`).
- This site only consumes `timepicker-ui` — it does **not** change the library. If a demo surfaces a real library bug or API gap, please open an issue rather than patching `../app`.

## License

[MIT](../LICENSE) © Piotr Glejzer
