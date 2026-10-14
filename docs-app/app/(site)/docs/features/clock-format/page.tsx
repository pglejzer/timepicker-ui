import { CodeBlock } from "@/components/code-block";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { InfoBox } from "@/components/info-box";
import { Clock, Sun, Moon, Globe } from "lucide-react";

export const metadata = buildMetadata({
  title: "12h / 24h Format",
  description:
    "Use 12-hour or 24-hour clock format in timepicker-ui - switch between AM/PM and military time. Zero-dependency, framework-agnostic, SSR-safe and fully typed.",
  path: "/docs/features/clock-format",
});

export default function ClockFormatPage() {
  return (
    <div>
      <PageHeader
        title="12h/24h Clock Format"
        description="Support for both 12-hour and 24-hour clock formats with automatic AM/PM handling"
        eyebrow="Feature"
      />

      <Section
        icon={Sun}
        title="How do I use 12-hour (AM/PM) format?"
        description="12-hour format is the default. It shows hours 1 to 12 with AM and PM buttons, and getValue().time returns a string such as 10:30 AM. Set clock.type to '12h' to be explicit."
      >
        <p className="text-muted-foreground mb-4">
          The default clock format with AM/PM indicators:
        </p>
        <CodeBlock
          code={`const picker = new TimepickerUI(input, {
  clock: {
    type: '12h'
  }
});
picker.create();`}
          language="typescript"
        />
        <div className="mt-6 rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold mb-3 text-foreground">Features:</h3>
          <ul className="list-disc pl-5 marker:text-primary space-y-2 text-sm text-muted-foreground">
            <li>Hours range from 1 to 12</li>
            <li>AM/PM toggle buttons</li>
            <li>Returns time in format: &quot;10:30 AM&quot;</li>
          </ul>
        </div>
      </Section>

      <Section
        icon={Moon}
        title="How do I switch to 24-hour format?"
        description="Pass clock: { type: '24h' } to the constructor. Hours then run 0 to 23 with no AM/PM, and getValue().time returns a string such as 14:30."
      >
        <p className="text-muted-foreground mb-4">
          Military time format without AM/PM:
        </p>
        <CodeBlock
          code={`const picker = new TimepickerUI(input, {
  clock: {
    type: '24h'
  }
});
picker.create();`}
          language="typescript"
        />
        <div className="mt-6 rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold mb-3 text-foreground">Features:</h3>
          <ul className="list-disc pl-5 marker:text-primary space-y-2 text-sm text-muted-foreground">
            <li>Hours range from 0 to 23</li>
            <li>No AM/PM indicators</li>
            <li>Returns time in format: &quot;14:30&quot;</li>
          </ul>
        </div>
      </Section>

      <Section
        icon={Globe}
        title="How do I follow the browser's 12h or 24h setting?"
        description="Set clock.type to 'auto'. The picker picks 12h or 24h from the browser locale when it is created and each time its options are set. New in 4.5.0."
      >
        <CodeBlock
          code={`const picker = new TimepickerUI(input, {
  clock: {
    type: 'auto'
  }
});
picker.create();`}
          language="typescript"
        />
      </Section>

      <Section
        icon={Clock}
        title="Can I change the clock format at runtime?"
        description="Yes. Call picker.setOptions({ clock: { type: '24h' } }) to switch format after the picker is created. A valid time in the input is rewritten in the new format."
      >
        <p className="text-muted-foreground mb-4">
          Change clock format dynamically with <code>setOptions()</code>:
        </p>
        <CodeBlock
          code={`// Start with 12h format
const picker = new TimepickerUI(input, {
  clock: {
    type: '12h'
  }
});
picker.create();

// Switch to 24h format
picker.setOptions({ clock: { type: '24h' } });`}
          language="typescript"
        />
      </Section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6 text-foreground">
          Value Format
        </h2>
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              12-Hour Format Output
            </h3>
            <CodeBlock
              code={`const value = picker.getValue();
console.log(value);

// Output:
{
  hour: '10',
  minutes: '30',
  type: 'AM',
  time: '10:30 AM',
  degreesHours: 300,   // deprecated
  degreesMinutes: 180  // deprecated
}`}
              language="typescript"
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              24-Hour Format Output
            </h3>
            <CodeBlock
              code={`const value = picker.getValue();
console.log(value);

// Output:
{
  hour: '14',
  minutes: '30',
  type: undefined,
  time: '14:30',
  degreesHours: 420,   // deprecated
  degreesMinutes: 180  // deprecated
}`}
              language="typescript"
            />
          </div>
        </div>
      </section>

      <InfoBox title="Tip" variant="blue">
        The clock format affects both the visual display and the returned time
        format. Choose based on your application&apos;s locale and user
        expectations, or use <code>&apos;auto&apos;</code> to follow the
        browser.
      </InfoBox>
    </div>
  );
}
