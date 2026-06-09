import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "timepicker-ui/index.css";
import { CommandMenu } from "@/components/command-menu";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

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
      className={`${geistSans.variable} ${geistMono.variable}`}
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
      <body className="font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
        >
          Skip to content
        </a>
        {children}
        {/* Global, route-independent: CommandMenu listens for ⌘K and the
            `open-command-menu` window event, so it works on real pages and on
            the chrome-less 404. Analytics tracks every route, 404 included. */}
        <CommandMenu />
        <Analytics />
      </body>
    </html>
  );
}

