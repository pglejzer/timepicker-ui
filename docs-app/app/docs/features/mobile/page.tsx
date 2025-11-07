import { CodeBlock } from "@/components/code-block";
import { Section } from "@/components/section";
import { LinkCard } from "@/components/link-card";
import { Smartphone, Hand, Maximize } from "lucide-react";

export const metadata = {
  title: "Mobile Support - Timepicker-UI",
  description: "Touch-optimized timepicker for mobile devices",
};

export default function MobilePage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Mobile Support
        </h1>
        <p className="text-lg text-muted-foreground">
          Fully responsive with touch gestures and mobile-first design
        </p>
      </div>

      <Section icon={Smartphone} title="Mobile-First Design">
        <p className="text-muted-foreground mb-4">
          Timepicker-UI is designed with mobile devices in mind from the ground
          up. It automatically adapts to different screen sizes and provides an
          optimal touch experience on smartphones and tablets.
        </p>
        <div className="rounded-lg border border-border bg-card p-6">
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Responsive clock face that scales to fit screen</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Touch-optimized controls with proper hit targets</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Drag gestures for quick time selection</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Full-screen modal on small devices</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Prevents zoom on input focus</span>
            </li>
          </ul>
        </div>
      </Section>

      <Section icon={Hand} title="Touch Gestures">
        <p className="text-muted-foreground mb-4">
          The timepicker supports intuitive touch interactions:
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
          The timepicker works great out of the box on mobile, but you can
          optimize it further:
        </p>
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Basic Mobile Setup
            </h3>
            <CodeBlock
              code={`const picker = new TimepickerUI(input, {
  mobile: true,           // Enable mobile optimizations
  animation: true,        // Smooth animations
  backdrop: true          // Full backdrop on small screens
});

picker.create();`}
              language="typescript"
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Prevent Input Zoom
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Add this meta tag to prevent unwanted zoom on input focus:
            </p>
            <CodeBlock
              code={`<meta 
  name="viewport" 
  content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
/>`}
              language="html"
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Touch-Friendly Input
            </h3>
            <CodeBlock
              code={`<input 
  type="time"
  id="timepicker"
  inputmode="none"
  readonly
  style="font-size: 16px; min-height: 44px;"
/>`}
              language="html"
            />
            <p className="text-sm text-muted-foreground mt-3">
              Use{" "}
              <code className="text-primary bg-primary/10 px-1 rounded">
                inputmode="none"
              </code>{" "}
              to prevent native keyboard on mobile and{" "}
              <code className="text-primary bg-primary/10 px-1 rounded">
                readonly
              </code>{" "}
              to prevent typing.
            </p>
          </div>
        </div>
      </Section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6 text-foreground">
          Responsive Styling
        </h2>
        <p className="text-muted-foreground mb-4">
          Customize the appearance for different screen sizes:
        </p>
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Adaptive Clock Size
            </h3>
            <CodeBlock
              code={`/* Mobile - smaller clock */
@media (max-width: 640px) {
  .timepicker-ui-clock-face {
    width: 260px !important;
    height: 260px !important;
  }
}

/* Tablet and desktop - larger clock */
@media (min-width: 641px) {
  .timepicker-ui-clock-face {
    width: 320px !important;
    height: 320px !important;
  }
}`}
              language="css"
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Full Screen on Mobile
            </h3>
            <CodeBlock
              code={`@media (max-width: 640px) {
  .timepicker-ui-wrapper {
    width: 100% !important;
    max-width: 100% !important;
    border-radius: 0 !important;
  }
  
  .timepicker-ui-modal {
    padding: 20px !important;
  }
}`}
              language="css"
            />
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6 text-foreground">
          Progressive Web Apps
        </h2>
        <p className="text-muted-foreground mb-4">
          For PWA installations, ensure the timepicker adapts to display modes:
        </p>
        <CodeBlock
          code={`/* Standalone PWA mode */
@media (display-mode: standalone) {
  .timepicker-ui-wrapper {
    /* Add safe area insets for notched devices */
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
  }
}

/* Handle landscape orientation */
@media (orientation: landscape) and (max-height: 500px) {
  .timepicker-ui-clock-face {
    width: 220px !important;
    height: 220px !important;
  }
}`}
          language="css"
        />
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
  allowsInlineMediaPlayback={true}
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
              code={`import { Component, OnInit } from '@angular/core';
import TimepickerUI from 'timepicker-ui';

@Component({
  selector: 'app-time-picker',
  template: \`<input type="time" #timepicker />\`
})
export class TimePickerComponent implements OnInit {
  @ViewChild('timepicker') input!: ElementRef;

  ngOnInit() {
    const picker = new TimepickerUI(this.input.nativeElement, {
      mobile: true,
      theme: 'basic'
    });
    picker.create();
  }
}`}
              language="typescript"
            />
          </div>
        </div>
      </section>

      <LinkCard
        icon={Smartphone}
        title="Testing on Real Devices"
        description="Always test touch interactions on actual mobile devices, not just browser emulators. Touch behavior can differ significantly between devices and browsers. Pay special attention to drag gestures and tap targets on smaller screens."
        linkText="Learn about input validation"
        linkHref="/docs/features/validation"
        variant="green"
      />
    </div>
  );
}
