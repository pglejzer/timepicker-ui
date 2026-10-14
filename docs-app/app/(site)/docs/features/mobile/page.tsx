import { CodeBlock } from "@/components/code-block";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { LinkCard } from "@/components/link-card";
import { Smartphone, Hand, Maximize, Check } from "lucide-react";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Mobile Support",
  description:
    "Mobile support in timepicker-ui - a touch-optimized, native-style time picker view for phones and tablets. Zero-dependency, framework-agnostic and SSR-safe.",
  path: "/docs/features/mobile",
});

export default function MobilePage() {
  return (
    <div>
      <PageHeader
        title="Mobile Support"
        description="Touch input, small-screen and landscape layouts, and hybrid apps"
        eyebrow="Feature"
      />

      <Section icon={Smartphone} title="Mobile-First Design">
        <p className="text-muted-foreground mb-4">
          The picker works with touch as well as mouse and keyboard, and its
          layout changes on narrow and landscape screens:
        </p>
        <div className="rounded-lg border border-border bg-card p-6">
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                The clock face is 256px. On landscape screens up to 480px tall
                the time fields and the clock face sit side by side.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>Each number on the clock face is a 32 by 32px tap target</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>Drag gestures for quick time selection</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                The backdrop covers the whole viewport, but the picker card
                does not: it is 328px wide, 315px on portrait screens 330px
                wide or less, and 584 by 360px for the clock view in
                landscape.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                The picker&apos;s own time fields use large text, so iOS Safari
                does not zoom in when they get focus. Your own input needs 16px
                text or more. See Touch-Friendly Input below.
              </span>
            </li>
          </ul>
        </div>
      </Section>

      <Section icon={Hand} title="Touch Gestures">
        <p className="text-muted-foreground mb-4">
          On a touch screen, the clock view responds to:
        </p>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-2 text-foreground">Tap</h3>
            <p className="text-sm text-muted-foreground">
              Tap any number on the clock face to select that time instantly
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-2 text-foreground">Drag</h3>
            <p className="text-sm text-muted-foreground">
              Drag the clock hand around to smoothly select the desired time
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-2 text-foreground">Switch</h3>
            <p className="text-sm text-muted-foreground">
              Tap the hour/minute display to switch between hour and minute
              selection
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-2 text-foreground">AM/PM</h3>
            <p className="text-sm text-muted-foreground">
              In 12-hour mode, tap AM or PM buttons to toggle time of day
            </p>
          </div>
        </div>
      </Section>

      <Section icon={Maximize} title="Mobile Configuration">
        <p className="text-muted-foreground mb-4">
          The default options work on touch screens. These settings change the
          view the picker opens in and how the input behaves:
        </p>
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Basic Mobile Setup
            </h3>
            <CodeBlock
              code={`const picker = new TimepickerUI(input, {
  ui: {
    initialView: 'keyboard', // Open in the keyboard input view
    animation: true          // Smooth animations
  }
});

picker.create();`}
              language="typescript"
            />
            <p className="text-sm text-muted-foreground mt-3">
              <code className="text-primary bg-primary/10 px-1 rounded">
                ui.initialView
              </code>{" "}
              is{" "}
              <code className="text-primary bg-primary/10 px-1 rounded">
                &apos;clock&apos;
              </code>{" "}
              by default. With{" "}
              <code className="text-primary bg-primary/10 px-1 rounded">
                &apos;keyboard&apos;
              </code>
              , the picker opens with hour and minute fields to type into and
              the clock face hidden. The view does not depend on screen size.
              To let people switch between that view and the clock, also set{" "}
              <code className="text-primary bg-primary/10 px-1 rounded">
                ui.viewSwitch: true
              </code>
              .
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Touch-Friendly Input
            </h3>
            <CodeBlock
              code={`<input
  type="text"
  id="timepicker"
  style="font-size: 16px; min-height: 44px;"
/>`}
              language="html"
            />
            <p className="text-sm text-muted-foreground mt-3">
              The picker opens when the input is tapped or clicked, or when
              Enter or Space is pressed while it has focus. Keep the
              input&apos;s{" "}
              <code className="text-primary bg-primary/10 px-1 rounded">
                font-size
              </code>{" "}
              at 16px or more: iOS Safari zooms the page in when a focused
              input has smaller text.{" "}
              <code className="text-primary bg-primary/10 px-1 rounded">
                min-height: 44px
              </code>{" "}
              makes the input easy to tap.
            </p>
            <p className="text-sm text-muted-foreground mt-3">
              Don&apos;t stop that zoom with{" "}
              <code className="text-primary bg-primary/10 px-1 rounded">
                maximum-scale=1
              </code>{" "}
              or{" "}
              <code className="text-primary bg-primary/10 px-1 rounded">
                user-scalable=no
              </code>{" "}
              in the viewport meta tag. Some browsers then block pinch zoom
              too, and people who need larger text can no longer zoom in.
            </p>
          </div>
        </div>
      </Section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6 text-foreground">
          Responsive Styling
        </h2>
        <p className="text-muted-foreground mb-4">
          The picker card is <code>.tp-ui-wrapper</code>, inside the
          full-viewport <code>.tp-ui-modal</code>. The library already adjusts
          it for small screens:
        </p>
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Built-in Breakpoints
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                The card is 328px wide and centered in the viewport. On portrait
                screens 330px wide or less it is 315px wide.
              </li>
              <li>
                On landscape screens up to 480px tall the open clock view switches
                to a horizontal layout, 584 by 360px.
              </li>
              <li>
                The keyboard input view in landscape takes its size
                from <code>--tp-mobile-landscape-width</code> and{" "}
                <code>--tp-mobile-landscape-height</code>. See{" "}
                <Link
                  href="/docs/advanced/styling"
                  className="text-primary underline"
                >
                  Custom Styling
                </Link>
                .
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Full Width on Phones
            </h3>
            <CodeBlock
              code={`@media (max-width: 640px) {
  .tp-ui-wrapper {
    width: 100% !important;
    border-radius: 0 !important;
  }
}`}
              language="css"
            />
            <p className="text-sm text-muted-foreground mt-3">
              <code>!important</code> beats the library&apos;s more specific
              width rules at the breakpoints above.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6 text-foreground">
          React Native / Ionic
        </h2>
        <p className="text-muted-foreground mb-4">
          While primarily designed for web, you can use Timepicker-UI in hybrid
          apps:
        </p>
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              React Native WebView
            </h3>
            <CodeBlock
              code={`import { WebView } from 'react-native-webview';

<WebView
  source={{ uri: 'https://your-app.com/timepicker' }}
  style={{ flex: 1 }}
  scrollEnabled={false}
/>`}
              language="typescript"
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Ionic Angular
            </h3>
            <CodeBlock
              code={`import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { TimepickerUI } from 'timepicker-ui';

@Component({
  selector: 'app-time-picker',
  template: \`<input type="text" #timepicker />\`
})
export class TimePickerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('timepicker') input!: ElementRef<HTMLInputElement>;
  private picker?: TimepickerUI;

  ngAfterViewInit() {
    this.picker = new TimepickerUI(this.input.nativeElement);
    this.picker.create();
  }

  ngOnDestroy() {
    this.picker?.destroy();
  }
}`}
              language="typescript"
            />
            <p className="text-sm text-muted-foreground mt-3">
              No mobile-specific options are needed in Ionic. To open the picker
              in the keyboard input view instead of the clock, pass{" "}
              <code className="text-primary bg-primary/10 px-1 rounded">
                {"ui: { initialView: 'keyboard', viewSwitch: true }"}
              </code>
              .{" "}
              <code className="text-primary bg-primary/10 px-1 rounded">
                viewSwitch
              </code>{" "}
              adds the button that switches to the clock and back. See Basic
              Mobile Setup above.
            </p>
          </div>
        </div>
      </section>

      <LinkCard
        icon={Smartphone}
        title="Input Validation"
        description="When the picker opens on an input that holds a time it can't read, it shows an error message after the input. The Validation page shows how to check typed values and add your own rules."
        linkText="Learn about input validation"
        linkHref="/docs/features/validation"
        variant="green"
      />
    </div>
  );
}
