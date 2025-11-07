import { CodeBlock } from "@/components/code-block";
import { Section } from "@/components/section";
import { InfoBox } from "@/components/info-box";
import { Clock, Sun, Moon } from "lucide-react";

export const metadata = {
  title: "12h/24h Format - Timepicker-UI",
  description: "Support for both 12-hour and 24-hour clock formats",
};

export default function ClockFormatPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          12h/24h Clock Format
        </h1>
        <p className="text-lg text-muted-foreground">
          Support for both 12-hour and 24-hour clock formats with automatic
          AM/PM handling
        </p>
      </div>

      <Section icon={Sun} title="12-Hour Format (Default)">
        <p className="text-muted-foreground mb-4">
          The default clock format with AM/PM indicators:
        </p>
        <CodeBlock
          code={`const picker = new TimepickerUI(input, {
  clockType: '12h'
});
picker.create();`}
          language="typescript"
        />
        <div className="mt-6 rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold mb-3 text-foreground">Features:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Hours range from 1 to 12</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>AM/PM toggle buttons</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Returns time in format: "10:30 AM"</span>
            </li>
          </ul>
        </div>
      </Section>

      <Section icon={Moon} title="24-Hour Format">
        <p className="text-muted-foreground mb-4">
          Military time format without AM/PM:
        </p>
        <CodeBlock
          code={`const picker = new TimepickerUI(input, {
  clockType: '24h'
});
picker.create();`}
          language="typescript"
        />
        <div className="mt-6 rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold mb-3 text-foreground">Features:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Hours range from 0 to 23</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>No AM/PM indicators</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Returns time in format: "14:30"</span>
            </li>
          </ul>
        </div>
      </Section>

      <Section icon={Clock} title="Dynamic Switching">
        <p className="text-muted-foreground mb-4">
          Change clock format dynamically using the update method:
        </p>
        <CodeBlock
          code={`// Start with 12h format
const picker = new TimepickerUI(input, {
  clockType: '12h'
});
picker.create();

// Switch to 24h format
picker.update({
  options: { clockType: '24h' },
  create: true
});`}
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
  degreesHours: 30,
  degreesMinutes: 180
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
  type: '',
  time: '14:30',
  degreesHours: 30,
  degreesMinutes: 180
}`}
              language="typescript"
            />
          </div>
        </div>
      </section>

      <InfoBox title="Tip" variant="blue">
        The clock format affects both the visual display and the returned time
        format. Choose based on your application's locale and user expectations.
      </InfoBox>
    </div>
  );
}
