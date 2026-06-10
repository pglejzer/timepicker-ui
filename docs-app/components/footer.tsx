import Link from "next/link";
import { Github, Package, ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/logo";
import { FooterClock } from "@/components/footer-clock";

const VERSION = "v4.4.0";

const columns = [
  {
    title: "Documentation",
    links: [
      { label: "Installation", href: "/docs/installation" },
      { label: "Quick Start", href: "/docs/quick-start" },
      { label: "Configuration", href: "/docs/configuration" },
      { label: "API Reference", href: "/docs/api/methods" },
    ],
  },
  {
    title: "Features",
    links: [
      { label: "Themes", href: "/docs/features/themes" },
      { label: "Mobile Support", href: "/docs/features/mobile" },
      { label: "Accessibility", href: "/docs/advanced/accessibility" },
      { label: "Localization", href: "/docs/advanced/localization" },
    ],
  },
  {
    title: "Resources",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/pglejzer/timepicker-ui",
        external: true,
      },
      {
        label: "npm",
        href: "https://www.npmjs.com/package/timepicker-ui",
        external: true,
      },
      {
        label: "Issues",
        href: "https://github.com/pglejzer/timepicker-ui/issues",
        external: true,
      },
      { label: "Bundle Analysis", href: "/bundle-stats" },
    ],
  },
];

const social = [
  {
    label: "GitHub",
    href: "https://github.com/pglejzer/timepicker-ui",
    icon: Github,
  },
  {
    label: "npm",
    href: "https://www.npmjs.com/package/timepicker-ui",
    icon: Package,
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-border bg-muted/20">
      {/* Atmospheric decorative grid, consistent with hero/CTA. */}
      <div className="bp-grid pointer-events-none absolute inset-0 -z-10 opacity-30" />

      <div className="container mx-auto px-4 md:px-6">
        {/* Top plate: brand + live instrument readout */}
        <div className="grid gap-10 border-b border-border py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-4">
            <span className="flex items-center gap-2 font-mono text-sm font-semibold tracking-tight">
              <Logo className="h-5 w-5" />
              timepicker<span className="text-muted-foreground">-ui</span>
            </span>
            <p className="max-w-xs text-sm text-muted-foreground">
              Zero-dependency time picker for the web. Analog clock, scroll
              wheel and compact-wheel modes.
            </p>
            <div className="flex items-center gap-2 pt-1">
              {social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${s.label} (opens in new tab)`}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <s.icon className="h-[18px] w-[18px]" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Live clock readout - the on-brand dynamic element */}
          <div className="lg:justify-self-end">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm sm:max-w-xs">
              <div className="flex items-center justify-between">
                <span className="eyebrow">Your local time</span>
                <Logo className="h-4 w-4 text-primary" />
              </div>
              <div className="tick-row my-4" />
              <FooterClock />
            </div>
          </div>
        </div>

        {/* Link columns grouped by intent */}
        <nav
          aria-label="Footer"
          className="grid grid-cols-2 gap-8 border-b border-border py-12 md:grid-cols-3"
        >
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="eyebrow mb-4">{col.title}</h3>
              <ul className="space-y-1 text-sm">
                {col.links.map((link) => {
                  const external = "external" in link && link.external;
                  const content = (
                    <span className="footer-link group/link inline-flex min-h-[40px] items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground">
                      <span className="footer-link-tick" aria-hidden="true" />
                      <span className="footer-link-label">{link.label}</span>
                      {external && (
                        <ArrowUpRight
                          className="footer-link-arrow h-3.5 w-3.5 opacity-0 transition-all group-hover/link:translate-x-0.5 group-hover/link:opacity-100"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                  );

                  return (
                    <li key={link.label}>
                      {external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${link.label} (opens in new tab)`}
                          className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        >
                          {content}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        >
                          {content}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Oversized wordmark - the engraved baseplate */}
        <div className="relative overflow-hidden py-10">
          <span
            aria-hidden="true"
            className="footer-wordmark display block select-none whitespace-nowrap font-semibold leading-none"
          >
            timepicker<span className="text-muted-foreground/40">-ui</span>
          </span>
        </div>

        {/* Minimal utility bottom-bar */}
        <div className="flex flex-col items-start justify-between gap-3 border-t border-border py-6 font-mono text-xs text-muted-foreground sm:flex-row sm:items-center">
          <span>
            © {currentYear} ·{" "}
            <a
              href="https://github.com/pglejzer"
              className="transition-colors hover:text-foreground"
            >
              Piotr Glejzer
            </a>
          </span>
          <div className="flex items-center gap-5">
            <a
              href="https://github.com/pglejzer/timepicker-ui/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="MIT license (opens in new tab)"
              className="transition-colors hover:text-foreground"
            >
              MIT
            </a>
            <a
              href="https://github.com/pglejzer/timepicker-ui/releases"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Release notes ${VERSION} (opens in new tab)`}
              className="transition-colors hover:text-foreground"
            >
              {VERSION}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

