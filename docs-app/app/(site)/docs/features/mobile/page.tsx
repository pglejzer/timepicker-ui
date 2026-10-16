import { CodeBlock } from "@/components/code-block";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
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
      />

      <Section title="Mobile-First Design">
        <p>
          The picker works with touch as well as mouse and keyboard, and its
          layout changes on narrow and landscape screens:
        </p>
        <ul>
          <li>
            The clock face is 256px. On landscape screens up to 480px tall
            the time fields and the clock face sit side by side.
          </li>
          <li>Each number on the clock face is a 32 by 32px tap target</li>
          <li>Drag gestures for quick time selection</li>
          <li>
            The backdrop covers the whole viewport, but the picker card
            does not: it is 328px wide, 315px on portrait screens 330px
            wide or less, and 584 by 360px for the clock view in
            landscape.
          </li>
          <li>
            The picker&apos;s own time fields use large text, so iOS Safari
            does not zoom in when they get focus. Your own input needs 16px
            text or more. See Touch-Friendly Input below.
          </li>
        </ul>
      </Section>

      <Section title="Touch Gestures">
        <p>
          On a touch screen, the clock view responds to:
        </p>
        <dl>
          <div>
            <dt>Tap</dt>
            <dd>
              Tap any number on the clock face to select that time instantly
            </dd>
          </div>
          <div>
            <dt>Drag</dt>
            <dd>
              Drag the clock hand around to smoothly select the desired time
            </dd>
          </div>
          <div>
            <dt>Switch</dt>
            <dd>
              Tap the hour/minute display to switch between hour and minute
              selection
            </dd>
          </div>
          <div>
            <dt>AM/PM</dt>
            <dd>
              In 12-hour mode, tap AM or PM buttons to toggle time of day
            </dd>
          </div>
        </dl>
      </Section>

      <Section title="Mobile Configuration">
        <p>
          The default options work on touch screens. These settings change the
          view the picker opens in and how the input behaves:
        </p>
        <h3>Basic Mobile Setup</h3>
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
        <p>
          <code>ui.initialView</code>{" "}
          is{" "}
          <code>&apos;clock&apos;</code>{" "}
          by default. With{" "}
          <code>&apos;keyboard&apos;</code>
          , the picker opens with hour and minute fields to type into and
          the clock face hidden. The view does not depend on screen size.
          To let people switch between that view and the clock, also set{" "}
          <code>ui.viewSwitch: true</code>
          .
        </p>

        <h3>Touch-Friendly Input</h3>
        <CodeBlock
          code={`<input
  type="text"
  id="timepicker"
  style="font-size: 16px; min-height: 44px;"
/>`}
          language="html"
        />
        <p>
          The picker opens when the input is tapped or clicked, or when
          Enter or Space is pressed while it has focus. Keep the
          input&apos;s{" "}
          <code>font-size</code>{" "}
          at 16px or more: iOS Safari zooms the page in when a focused
          input has smaller text.{" "}
          <code>min-height: 44px</code>{" "}
          makes the input easy to tap.
        </p>
        <p>
          Don&apos;t stop that zoom with{" "}
          <code>maximum-scale=1</code>{" "}
          or{" "}
          <code>user-scalable=no</code>{" "}
          in the viewport meta tag. Some browsers then block pinch zoom
          too, and people who need larger text can no longer zoom in.
        </p>
      </Section>

      <Section title="Responsive Styling">
        <p>
          The picker card is <code>.tp-ui-wrapper</code>, inside the
          full-viewport <code>.tp-ui-modal</code>. The library already adjusts
          it for small screens:
        </p>
        <h3>Built-in Breakpoints</h3>
        <ul>
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
            <Link href="/docs/advanced/styling">
              Custom Styling
            </Link>
            .
          </li>
        </ul>

        <h3>Full Width on Phones</h3>
        <CodeBlock
          code={`@media (max-width: 640px) {
  .tp-ui-wrapper {
    width: 100% !important;
    border-radius: 0 !important;
  }
}`}
          language="css"
        />
        <p>
          <code>!important</code> beats the library&apos;s more specific
          width rules at the breakpoints above.
        </p>
      </Section>

      <Section title="React Native / Ionic">
        <p>
          While primarily designed for web, you can use Timepicker-UI in hybrid
          apps:
        </p>
        <h3>React Native WebView</h3>
        <CodeBlock
          code={`import { WebView } from 'react-native-webview';

<WebView
  source={{ uri: 'https://your-app.com/timepicker' }}
  style={{ flex: 1 }}
  scrollEnabled={false}
/>`}
          language="typescript"
        />

        <h3>Ionic Angular</h3>
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
        <p>
          No mobile-specific options are needed in Ionic. To open the picker
          in the keyboard input view instead of the clock, pass{" "}
          <code>{"ui: { initialView: 'keyboard', viewSwitch: true }"}</code>
          .{" "}
          <code>viewSwitch</code>{" "}
          adds the button that switches to the clock and back. See Basic
          Mobile Setup above.
        </p>
      </Section>

      <dl>
        <div>
          <dt>Input Validation</dt>
          <dd>
            When the picker opens on an input that holds a time it can&apos;t
            read, it shows an error message after the input. The Validation
            page shows how to check typed values and add your own rules.
          </dd>
          <dd>
            <Link href="/docs/features/validation">
              Learn about input validation
            </Link>
          </dd>
        </div>
      </dl>
    </div>
  );
}
