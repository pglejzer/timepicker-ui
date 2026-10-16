import { CodeBlock } from "@/components/code-block";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { Callout } from "@/components/callout";
import { ApiTable } from "@/components/api-table";

export const metadata = buildMetadata({
  title: "Clear Button",
  description:
    "Add a clear button to reset the selected time in timepicker-ui, with optional plugin clear handling. Zero-dependency, framework-agnostic and SSR-safe.",
  path: "/docs/features/clear-button",
});

export default function ClearButtonPage() {
  return (
    <div>
      <PageHeader
        title="Clear Button"
        description="Reset time selection with a dedicated button in the picker footer"
      />

      <Callout title="Available since v4.2.0" tone="tip">
        The clear button is <strong>off by default</strong>. Turn it on with{" "}
        <code>ui.clearButton: true</code>. It resets the clock hands to 12:00,
        disables the confirm button, and optionally empties the input value.
      </Callout>

      <Section title="Basic Usage">
        <p>
          Set <code>ui.clearButton: true</code> to
          show the button:
        </p>
        <CodeBlock
          code={`const picker = new TimepickerUI(input, {
  ui: { clearButton: true }
});
picker.create();`}
          language="typescript"
        />
      </Section>

      <Section title="Disable Clear Button">
        <p>
          <code>ui.clearButton</code> is{" "}
          <code>false</code> by default. Leave it out, or set it to{" "}
          <code>false</code>, to hide the button:
        </p>
        <CodeBlock
          code={`new TimepickerUI(input, {
  ui: { clearButton: false }
}).create();`}
          language="typescript"
        />
      </Section>

      <Section title="Clear Behavior Options">
        <p>
          Pass an object to{" "}
          <code>ui.clearButton</code> to control what
          happens when the user clicks Clear. The object form also shows the
          button. It is new in 4.5.0 and replaces{" "}
          <code>clearBehavior.clearInput</code>, which still works until 5.0:
        </p>
        <CodeBlock
          code={`new TimepickerUI(input, {
  ui: {
    clearButton: { clearInput: false }  // Keep the input value after clearing
  }
}).create();`}
          language="typescript"
        />
        <ApiTable
          columns={[
            { key: "name", label: "Option" },
            { key: "type", label: "Type", mono: true },
            { key: "default", label: "Default", mono: true },
            { key: "description", label: "Description" },
          ]}
          rows={[
            {
              id: "clearInput",
              name: <code>clearInput</code>,
              type: "boolean",
              default: <code>true</code>,
              description:
                "Whether clearing also empties the input field value",
            },
          ]}
          rowKey="id"
        />
      </Section>

      <Section title="Custom Label">
        <p>
          Customize the button text with{" "}
          <code>labels.clear</code>:
        </p>
        <CodeBlock
          code={`new TimepickerUI(input, {
  ui: { clearButton: true },
  labels: { clear: 'Reset' }
}).create();`}
          language="typescript"
        />
      </Section>

      <Section title="Clear Event">
        <p>
          Listen for the clear event via EventEmitter or callback:
        </p>
        <h3>EventEmitter</h3>
        <CodeBlock
          code={`picker.on('clear', (data) => {
  console.log('Cleared! Previous value:', data.previousValue);
});`}
          language="typescript"
        />
        <h3>Callback option</h3>
        <CodeBlock
          code={`new TimepickerUI(input, {
  ui: { clearButton: true },
  callbacks: {
    onClear: (data) => {
      console.log('Cleared! Previous value:', data.previousValue);
    }
  }
}).create();`}
          language="typescript"
        />
      </Section>

      <Section title="Behavior Details">
        <ul>
          <li>Clock hands reset to the 12:00 (neutral) position</li>
          <li>
            Confirm (OK) button becomes disabled until a new time is selected
          </li>
          <li>Clear button auto-disables when no time is selected</li>
          <li>
            Screen reader announces &quot;Time cleared&quot; (
            <code>labels.announceCleared</code>) for accessibility
          </li>
        </ul>
      </Section>

      <Section title="TypeScript Types">
        <CodeBlock
          code={`import type { ClearEventData, UIOptions } from 'timepicker-ui';

// ClearEventData: { previousValue: string | null }
// UIOptions['clearButton']: boolean | { clearInput?: boolean }`}
          language="typescript"
        />
      </Section>
    </div>
  );
}
