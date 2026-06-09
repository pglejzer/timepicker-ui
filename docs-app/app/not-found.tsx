import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Boxes, PlayCircle } from "lucide-react";
import { NotFoundClock } from "@/components/not-found-clock";
import { NotFoundSearch } from "@/components/not-found-search";

export const metadata: Metadata = {
  title: "404 - Page not found",
  robots: { index: false, follow: true },
};

const quickLinks = [
  { icon: BookOpen, label: "Docs", note: "Guides & API", href: "/docs" },
  {
    icon: PlayCircle,
    label: "Examples",
    note: "Live demos",
    href: "/examples",
  },
  {
    icon: Boxes,
    label: "Bundle stats",
    note: "Size breakdown",
    href: "/bundle-stats",
  },
];

/**
 * Global 404.
 *
 * This page lives OUTSIDE the `(site)` route group, so it renders directly under
 * the slim root layout - there is no <Header>/<Footer> in the DOM at all. That
 * lets it be a normal in-flow page: a single scrollbar (the body's), no fixed
 * overlay and no nested internal scroll. (The previous version used a
 * `fixed inset-0 z-[60] overflow-y-auto` cover to hide chrome that was still
 * rendered underneath; the route-group split removed the need for that hack.)
 *
 * Concept: "4:04 - time not found". The hero analog clock points its hour and
 * minute hands at 4:04 (404 read as a time), with a sweeping second hand and a
 * "searching" spin on interaction. Decorative; the accessible 404 message lives
 * in the real <h1> below.
 */
export default function NotFound() {
  return (
    <main
      id="main-content"
      className="relative flex min-h-screen w-full flex-col items-center justify-center px-4 py-16 sm:px-6"
    >
      {/* Atmosphere */}
      <div
        className="blueprint pointer-events-none absolute inset-0 opacity-40"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-2xl text-center">
        <p className="eyebrow reveal" style={{ animationDelay: "0ms" }}>
          Error · 404
        </p>

        {/* Hero clock - the signature element */}
        <div
          className="reveal mx-auto mt-8 h-44 w-44 sm:h-56 sm:w-56"
          style={{ animationDelay: "80ms" }}
        >
          <NotFoundClock />
        </div>

        {/* Giant 4:04 readout, tied to the clock */}
        <div className="reveal mt-8" style={{ animationDelay: "160ms" }}>
          <span
            className="nums block font-semibold leading-none text-foreground"
            style={{ fontSize: "clamp(3.5rem, 18vw, 7rem)" }}
          >
            4<span className="text-primary">:</span>04
          </span>
        </div>

        {/* Accessible headline carries the real 404 message */}
        <h1
          className="display reveal mx-auto mt-6 max-w-md text-2xl font-semibold sm:text-3xl"
          style={{ animationDelay: "220ms" }}
        >
          <span className="sr-only">404 - page not found. </span>
          This moment doesn&apos;t exist.
        </h1>

        <p
          className="reveal mx-auto mt-3 max-w-sm text-sm text-muted-foreground sm:text-base"
          style={{ animationDelay: "280ms" }}
        >
          The page you&apos;re after is out of time. The clock kept ticking; the
          URL did not.
        </p>

        <div
          className="tick-row reveal mx-auto mt-10 max-w-xs"
          style={{ animationDelay: "320ms" }}
          aria-hidden="true"
        />

        {/* Primary actions */}
        <div
          className="reveal mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          style={{ animationDelay: "360ms" }}
        >
          <Link
            href="/"
            className="inline-flex h-11 w-full items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto"
          >
            Back to home
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Link>
          <NotFoundSearch />
        </div>

        {/* Quick links so the user isn't stranded without a header */}
        <nav
          aria-label="Quick links"
          className="reveal mx-auto mt-10 grid w-full max-w-md grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3"
          style={{ animationDelay: "420ms" }}
        >
          {quickLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group flex items-center gap-3 bg-card p-4 text-left transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:flex-col sm:items-start"
            >
              <l.icon
                className="h-5 w-5 shrink-0 text-foreground transition-colors group-hover:text-primary"
                aria-hidden="true"
              />
              <div>
                <div className="text-sm font-medium">{l.label}</div>
                <div className="font-mono text-xs text-muted-foreground">
                  {l.note}
                </div>
              </div>
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}

