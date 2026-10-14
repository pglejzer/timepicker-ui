# timepicker-ui docs site

Source of [timepicker-ui.vercel.app](https://timepicker-ui.vercel.app): guides, API reference and live demos. Built with Next.js 16 (App Router) and React 19, deployed on Vercel.

This is a separate project from the library, which lives in [`../app`](../app). The site installs `timepicker-ui` and `timepicker-ui-react` from npm like any other app would, so the demos show the published version, not your local changes.

## Running it

You need Node 20.9 or newer (the minimum for Next.js 16) and npm.

```bash
cd docs-app
npm install
npm run dev     # http://localhost:3000
```

Other scripts: `npm run build` for a production build, `npm run start` to serve it, `npm run lint` for ESLint.

## Where things are

```
docs-app/
├── app/
│   ├── (site)/
│   │   ├── docs/             # guides: installation, quick-start, configuration, api/, features/, advanced/, changelog, ...
│   │   ├── examples/         # live demos: basic/, themes/, features/, advanced/, plugins/
│   │   ├── react/            # docs and examples for timepicker-ui-react
│   │   ├── bundle-stats/     # bundle size page
│   │   ├── layout.tsx
│   │   └── page.tsx          # landing page
│   ├── layout.tsx            # root layout, metadata, fonts, analytics
│   ├── globals.css           # Tailwind entry
│   ├── manifest.ts
│   ├── robots.ts
│   ├── sitemap.ts            # built from lib/seo-routes.ts
│   ├── opengraph-image.tsx
│   ├── icon.svg, favicon.ico, apple-icon.png
│   └── not-found.tsx
├── components/               # header, footer, sidebars, code blocks, command menu, examples/, bundleStats/, ...
├── lib/                      # docs-nav.ts, metadata.ts, seo-routes.ts, use-dark-mode.ts
├── public/                   # static files, bundle-data.json
├── next.config.ts            # React Compiler is on
├── postcss.config.mjs        # Tailwind CSS v4
├── eslint.config.mjs         # eslint-config-next
├── tsconfig.json             # @/* maps to ./
└── vercel.json
```

## Stack

Next.js 16 with the React Compiler, React 19, TypeScript and Tailwind CSS v4. Radix UI for tabs and scroll areas, lucide-react for icons, prism-react-renderer for code blocks, recharts for the bundle size charts. Vercel Analytics and Speed Insights are on. Fonts are Geist Sans and Geist Mono.

The picker needs the DOM, so demos create it inside an effect or a client component.

## Deployment

Vercel builds the site with the settings in [`vercel.json`](./vercel.json): `npm install`, `npm run build`, output in `.next`. The canonical URL is set in `metadataBase` in `app/layout.tsx` and in `lib/seo-routes.ts`.

## Contributing

Run `npm run lint` before opening a PR. Line endings are CRLF, `.gitattributes` enforces that.

If a demo turns up a bug in the library itself, please [open an issue](https://github.com/pglejzer/timepicker-ui/issues) rather than working around it here.

## License

[MIT](../LICENSE) © Piotr Glejzer
