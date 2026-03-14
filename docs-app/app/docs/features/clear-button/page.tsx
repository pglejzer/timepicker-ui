import { CodeBlock } from "@/components/code-block";
import { Section } from "@/components/section";
import { InfoBox } from "@/components/info-box";
import { Trash2, Settings, Bell, Code2 } from "lucide-react";

export const metadata = {
  title: "Clear Button - Timepicker-UI",
  description: "Reset time selection with a dedicated clear button",
};

export default function ClearButtonPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Clear Button
        </h1>
        <p className="text-lg text-muted-foreground">
          Reset time selection with a dedicated button in the picker footer
        </p>
      </div>

      <InfoBox
        title="Available since v4.2.0"
        variant="emerald"
        className="mb-8"
      >
        The clear button is <strong>enabled by default</strong> via{" "}
        <code>ui.clearButton: true</code>. It resets the clock hands to 12:00,
        disables the confirm button, and optionally empties the input value.
      </InfoBox>

      <Section icon={Trash2} title="Basic Usage">
        <p className="text-muted-foreground mb-4">
          The clear button appears automatically. No extra configuration needed:
        </p>
        <CodeBlock
          code={`const picker = new TimepickerUI(input);
picker.create();
// Clear button is visible by default`}
          language="typescript"
        />
      </Section>

      <Section icon={Settings} title="Disable Clear Button">
        <p className="text-muted-foreground mb-4">
          Set <code className="text-primary">ui.clearButton: false</code> to
          hide it:
        </p>
        <CodeBlock
          code={`new TimepickerUI(input, {
  ui: { clearButton: false }
}).create();`}
          language="typescript"
        />
      </Section>

      <Section icon={Settings} title="Clear Behavior Options">
        <p className="text-muted-foreground mb-4">
          Use <code className="text-primary">clearBehavior</code> to control
          what happens when the user clicks Clear:
        </p>
        <CodeBlock
          code={`new TimepickerUI(input, {
  clearBehavior: {
    clearInput: false  // Keep the input value after clearing
  }
}).create();`}
          language="typescript"
        />
        <div className="mt-4 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  Option
                </th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  Type
                </th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  Default
                </th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-3">
                  <code className="text-primary bg-primary/10 px-2 py-1 rounded text-xs font-mono">
                    clearInput
                  </code>
                </td>
                <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                  boolean
                </td>
                <td className="px-4 py-3">
                  <code className="text-xs">true</code>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  Whether clearing also empties the input field value
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section icon={Code2} title="Custom Label">
        <p className="text-muted-foreground mb-4">
          Customize the button text with{" "}
          <code className="text-primary">labels.clear</code>:
        </p>
        <CodeBlock
          code={`new TimepickerUI(input, {
  labels: { clear: 'Reset' }
}).create();`}
          language="typescript"
        />
      </Section>

      <Section icon={Bell} title="Clear Event">
        <p className="text-muted-foreground mb-4">
          Listen for the clear event via EventEmitter or callback:
        </p>
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">EventEmitter</h3>
            <CodeBlock
              code={`picker.on('clear', (data) => {
  console.log('Cleared! Previous value:', data.previousValue);
});`}
              language="typescript"
            />
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Callback option
            </h3>
            <CodeBlock
              code={`new TimepickerUI(input, {
  callbacks: {
    onClear: (data) => {
      console.log('Cleared! Previous value:', data.previousValue);
    }
  }
}).create();`}
              language="typescript"
            />
          </div>
        </div>
      </Section>

      <Section icon={Settings} title="Behavior Details">
        <ul className="space-y-2 text-muted-foreground ml-4 list-disc list-inside">
          <li>Clock hands reset to the 12:00 (neutral) position</li>
          <li>
            Confirm (OK) button becomes disabled until a new time is selected
          </li>
          <li>Clear button auto-disables when no time is selected</li>
          <li>
            Screen reader announces &quot;Time selection cleared&quot; for
            accessibility
          </li>
        </ul>
      </Section>

      <Section icon={Code2} title="TypeScript Types">
        <CodeBlock
          code={`import type {
  ClearEventData,
  ClearBehaviorOptions
} from 'timepicker-ui';

// ClearEventData: { previousValue: string }
// ClearBehaviorOptions: { clearInput: boolean }`}
          language="typescript"
        />
      </Section>
    </div>
  );
}
