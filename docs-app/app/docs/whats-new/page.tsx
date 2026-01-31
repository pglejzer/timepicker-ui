import { CodeBlock } from "@/components/code-block";
import { Section } from "@/components/section";
import { InfoBox } from "@/components/info-box";
import {
  Sparkles,
  Layers,
  Code2,
  Zap,
  Package,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "What's New - Timepicker-UI",
  description: "Latest updates and improvements to Timepicker-UI",
};

export default function WhatsNewPage() {
  return (
    <div>
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-2 text-sm text-emerald-600 dark:text-emerald-400 mb-4">
          <Sparkles className="h-4 w-4" />
          <span className="font-medium">Latest Release</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          What&apos;s New
        </h1>
        <p className="text-lg text-muted-foreground">
          Stay up to date with the latest features and improvements
        </p>
      </div>

      <InfoBox
        title="Version 4.1.0 Released!"
        variant="emerald"
        className="mb-8"
      >
        <p className="mb-3">
          <strong>January 31, 2026</strong> - New features and UX improvements
        </p>
        <p className="text-sm">What&apos;s new:</p>
        <ul className="mt-2 space-y-1 text-sm ml-4">
          <li>
            <strong>Range Plugin</strong> - New! Select time ranges with
            start/end pickers, duration calculation, and validation
          </li>
          <li>
            <strong>Timezone Plugin</strong> - New! Timezone selector with
            searchable dropdown and UTC offset display
          </li>
          <li>
            <strong>Plugin architecture</strong> - Tree-shakeable plugins for
            smaller core bundle size
          </li>
          <li>
            <strong>Smooth hour snapping</strong> - Fluid hour dragging with
            animation (new default)
          </li>
        </ul>
        <Link
          href="/docs/changelog"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-3"
        >
          View full changelog
        </Link>
      </InfoBox>

      <Section icon={Layers} title="What's New in v4.0.0">
        <p className="text-muted-foreground mb-4">
          Version 4.0.0 brought major improvements in architecture, TypeScript
          support, and developer experience.
        </p>
      </Section>

      <Section icon={Layers} title="Grouped Options Architecture">
        <p className="text-muted-foreground mb-4">
          Options are now organized into logical groups for better clarity and
          maintainability.
        </p>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3 text-foreground">
              Old API (v3.x)
            </h3>
            <CodeBlock
              code={`const picker = new TimepickerUI(input, {
  clockType: '12h',
  theme: 'dark',
  mobile: true,
  animation: true,
  incrementMinutes: 5,
  okLabel: 'Confirm',
  cancelLabel: 'Close'
});`}
              language="typescript"
            />
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-foreground">
              New API (v4.0.0)
            </h3>
            <CodeBlock
              code={`const picker = new TimepickerUI(input, {
  clock: {
    type: '12h',
    incrementMinutes: 5
  },
  ui: {
    theme: 'dark',
    mobile: true,
    animation: true
  },
  labels: {
    ok: 'Confirm',
    cancel: 'Close'
  }
});`}
              language="typescript"
            />
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-border bg-card p-6">
          <h4 className="font-semibold mb-3 text-foreground">
            Five Main Groups
          </h4>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              <span>
                <strong>clock:</strong> Time format, increments, disabled times,
                auto-switch behavior
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              <span>
                <strong>ui:</strong> Theme, animations, mobile mode, backdrop,
                icons
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              <span>
                <strong>labels:</strong> All text labels (OK, Cancel, AM/PM,
                etc.)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              <span>
                <strong>behavior:</strong> Focus trap, delays, input focus after
                close
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              <span>
                <strong>callbacks:</strong> All event handlers in one place
              </span>
            </li>
          </ul>
        </div>
      </Section>

      <Section icon={Code2} title="Enhanced TypeScript Support">
        <p className="text-muted-foreground mb-4">
          Complete type safety with strict interfaces and better IntelliSense.
        </p>
        <div className="rounded-lg border border-border bg-card p-6">
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              <span>Fully typed options with detailed documentation</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              <span>Typed event payloads for all callbacks</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              <span>Better autocomplete in modern IDEs</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              <span>Strict mode compatible (no any, no unknown)</span>
            </li>
          </ul>
        </div>
      </Section>

      <Section icon={Zap} title="New Features">
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Keyboard Navigation
            </h3>
            <p className="text-muted-foreground mb-3">
              Use Arrow Up/Down keys to increment/decrement hour and minute
              values with live clockface updates.
            </p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Works in both 12h and 24h modes</li>
              <li>• Proper wrap-around (59→00, 12→01)</li>
              <li>• Smooth clock hand animations</li>
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Improved Accessibility
            </h3>
            <p className="text-muted-foreground mb-3">
              Dynamic tabindex management ensures hidden elements are not
              focusable.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Glassmorphic Theme
            </h3>
            <p className="text-muted-foreground">
              New theme with backdrop-filter blur effect for modern glass UI.
            </p>
          </div>
        </div>
      </Section>

      <Section icon={Package} title="Architecture Improvements">
        <div className="rounded-lg border border-border bg-card p-6">
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              <span>
                <strong>Composition over Inheritance:</strong> No class
                hierarchies, only explicit composition
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              <span>
                <strong>Manager Pattern:</strong> Independent, testable managers
                for each concern
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              <span>
                <strong>SSR Safety:</strong> Full compatibility with Next.js,
                Nuxt, Remix, and other SSR frameworks
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              <span>
                <strong>Pure State Container:</strong> Centralized state with no
                side effects
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              <span>
                <strong>Event-Driven:</strong> Clean event system for all
                interactions
              </span>
            </li>
          </ul>
        </div>
      </Section>

      <InfoBox title="Breaking Changes" variant="emerald" className="mb-8">
        <div className="flex items-start gap-3">
          <div>
            <p className="text-sm mb-3">
              v4.0.0 introduces breaking changes in the options structure. See
              the migration guide below.
            </p>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Old:</strong>{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded">
                  clockType: &apos;12h&apos;
                </code>
              </div>
              <div>
                <strong>New:</strong>{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded">
                  clock: &#123; type: &apos;12h&apos; &#125;
                </code>
              </div>
            </div>
          </div>
        </div>
      </InfoBox>

      <section className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6 text-foreground flex items-center gap-2">
          <Code2 className="h-6 w-6" />
          Migration Guide
        </h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Option Mapping
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4">v3.x</th>
                    <th className="text-left py-2 px-4">v4.0.0</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border">
                    <td className="py-2 pr-4">
                      <code>clockType</code>
                    </td>
                    <td className="py-2 px-4">
                      <code>clock.type</code>
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 pr-4">
                      <code>theme</code>
                    </td>
                    <td className="py-2 px-4">
                      <code>ui.theme</code>
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 pr-4">
                      <code>mobile</code>
                    </td>
                    <td className="py-2 px-4">
                      <code>ui.mobile</code>
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 pr-4">
                      <code>animation</code>
                    </td>
                    <td className="py-2 px-4">
                      <code>ui.animation</code>
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 pr-4">
                      <code>okLabel</code>
                    </td>
                    <td className="py-2 px-4">
                      <code>labels.ok</code>
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 pr-4">
                      <code>cancelLabel</code>
                    </td>
                    <td className="py-2 px-4">
                      <code>labels.cancel</code>
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 pr-4">
                      <code>incrementMinutes</code>
                    </td>
                    <td className="py-2 px-4">
                      <code>clock.incrementMinutes</code>
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 pr-4">
                      <code>focusTrap</code>
                    </td>
                    <td className="py-2 px-4">
                      <code>behavior.focusTrap</code>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Complete Migration Example
            </h3>
            <CodeBlock
              code={`// v3.x
const picker = new TimepickerUI(input, {
  clockType: '24h',
  theme: 'dark',
  mobile: true,
  animation: true,
  incrementMinutes: 15,
  okLabel: 'Confirm',
  cancelLabel: 'Close',
  focusTrap: true
});

// v4.0.0
const picker = new TimepickerUI(input, {
  clock: {
    type: '24h',
    incrementMinutes: 15
  },
  ui: {
    theme: 'dark',
    mobile: true,
    animation: true
  },
  labels: {
    ok: 'Confirm',
    cancel: 'Close'
  },
  behavior: {
    focusTrap: true
  }
});`}
              language="typescript"
            />
          </div>
        </div>
      </section>

      <div className="rounded-lg border border-primary/20 bg-primary/5 p-6">
        <h3 className="font-semibold mb-2 text-foreground flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Ready to upgrade?
        </h3>
        <p className="text-muted-foreground mb-4">
          Check out the full documentation to explore all new features and
          options.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/docs/installation"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Installation Guide
          </Link>
          <Link
            href="/docs/api/options"
            className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            API Reference
          </Link>
          <Link
            href="/docs/changelog"
            className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            Full Changelog
          </Link>
        </div>
      </div>
    </div>
  );
}
