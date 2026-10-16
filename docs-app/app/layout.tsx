import type { Metadata, Viewport } from "next";
import { fontMono, fontText } from "./fonts";
import "./styles/tokens.css";
import "./styles/base.css";
import "timepicker-ui/index.css";
import { CommandMenu } from "@/components/command-menu";
import { ConsoleBanner } from "@/components/console-banner";
import { Analytics } from "@vercel/analytics/next";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111111" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://timepicker-ui.vercel.app"),
  title: {
    default: "timepicker-ui - zero-dependency time picker for the web",
    template: "%s - timepicker-ui",
  },
  description:
    "Zero-dependency, framework-agnostic, SSR-safe time picker. Analog clock, scroll wheel and compact-wheel modes, 12 themes, TypeScript types and plugins.",
  keywords: [
    "timepicker",
    "time picker",
    "time picker library",
    "time picker component",
    "time input",
    "react time picker",
    "vue time picker",
    "angular time picker",
    "svelte time picker",
    "javascript time picker",
    "typescript time picker",
    "zero dependency time picker",
    "ssr time picker",
    "accessible time picker",
    "analog clock picker",
    "wheel time picker",
    "time range picker",
    "timezone picker",
  ],
  authors: [{ name: "Piotr Glejzer" }],
  creator: "Piotr Glejzer",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "timepicker-ui - zero-dependency time picker for the web",
    description:
      "Zero-dependency, framework-agnostic, SSR-safe time picker. Analog clock, scroll wheel and compact-wheel modes, 12 themes and full TypeScript types.",
    url: "/",
    siteName: "timepicker-ui",
    type: "website",
    locale: "en_US",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "timepicker-ui - zero-dependency time picker for the web",
    description:
      "Zero-dependency, framework-agnostic, SSR-safe time picker. Analog clock, scroll wheel and compact-wheel modes, 12 themes and full TypeScript types.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fontText.variable} ${fontMono.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        {children}
        {/* Global, route-independent: CommandMenu listens for ⌘K and the
            `open-command-menu` window event, so it works on real pages and on
            the chrome-less 404. ConsoleBanner prints the console logo once per
            page load. Analytics tracks every route, 404 included. */}
        <CommandMenu />
        <ConsoleBanner />
        <Analytics />
      </body>
    </html>
  );
}

