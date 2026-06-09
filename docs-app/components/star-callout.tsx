import { Star, GitPullRequest } from "lucide-react";

import { StarMeter } from "./star-meter";

const REPO = "pglejzer/timepicker-ui";
const REPO_URL = `https://github.com/${REPO}`;

/**
 * Fetches the live star count server-side via ISR (one request per hour per
 * deploy - well under the 60/hr unauthenticated GitHub limit). Returns null on
 * any failure so the caller can degrade gracefully without a layout shift.
 */
async function getStarCount(): Promise<number | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}`, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { stargazers_count?: number };
    const count = data?.stargazers_count;
    return typeof count === "number" ? count : null;
  } catch {
    return null;
  }
}

/** Next round milestone above the current count. */
function nextMilestone(count: number): number {
  const step = count < 1000 ? 100 : 500;
  return Math.floor(count / step) * step + step;
}

export async function StarCallout() {
  const count = await getStarCount();
  const milestone = count !== null ? nextMilestone(count) : 0;

  return (
    <section
      aria-labelledby="star-callout-heading"
      className="relative overflow-hidden border-b border-border bg-muted/20"
    >
      <div className="blueprint pointer-events-none absolute inset-0 -z-10 opacity-40" />
      <div className="container mx-auto px-4 py-16 sm:py-20 md:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Copy */}
          <div>
            <p className="eyebrow reveal">Open source · MIT</p>
            <h2
              id="star-callout-heading"
              className="display reveal mt-3 text-3xl font-semibold sm:text-4xl"
              style={{ animationDelay: "60ms" }}
            >
              If it saved you an afternoon
            </h2>
            <p
              className="reveal mt-4 max-w-md text-muted-foreground"
              style={{ animationDelay: "120ms" }}
            >
              Built and maintained by one person, with zero runtime
              dependencies, no funding, and no telemetry. A star is the quiet
              signal that says it&apos;s worth the next release.
            </p>

            <div
              className="reveal mt-8 flex flex-wrap items-center gap-x-5 gap-y-3"
              style={{ animationDelay: "180ms" }}
            >
              <a
                href={REPO_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="Star timepicker-ui on GitHub"
                className="star-cta group inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Star on GitHub
                <span className="star-cta-icon-wrap relative ml-2 inline-flex h-4 w-4 items-center justify-center">
                  <Star className="star-cta-icon h-4 w-4" aria-hidden="true" />
                  <span
                    className="star-burst pointer-events-none"
                    aria-hidden="true"
                  >
                    <span className="star-spark" />
                    <span className="star-spark" />
                    <span className="star-spark" />
                    <span className="star-spark" />
                  </span>
                </span>
              </a>
              <a
                href={`${REPO_URL}/issues`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                <GitPullRequest className="h-3.5 w-3.5" aria-hidden="true" />
                open an issue
              </a>
            </div>
          </div>

          {/* Instrument-panel gauge */}
          <div className="reveal" style={{ animationDelay: "200ms" }}>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="eyebrow">GitHub stars</span>
                <Star className="h-4 w-4 text-primary" aria-hidden="true" />
              </div>

              {count !== null ? (
                <StarMeter count={count} milestone={milestone} />
              ) : (
                <p className="mt-4 max-w-xs text-sm text-muted-foreground">
                  Every star helps the project reach more people who need a
                  precise time input.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

