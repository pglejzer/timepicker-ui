import { CodeBlock } from "@/components/code-block";
import { Section } from "@/components/section";
import { InfoBox } from "@/components/info-box";
import {
  AlertTriangle,
  Code2,
  Sparkles,
  CheckCircle2,
  Package,
  Zap,
  FileText,
  Settings,
} from "lucide-react";

export const metadata = {
  title: "Legacy Migration Guide v2 to v3 - Timepicker-UI",
  description:
    "Complete guide for upgrading from Timepicker-UI v2.x to v3.x (Legacy)",
};

export default function LegacyMigrationPage() {
  return (
    <div>
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-500/20 bg-slate-500/5 px-4 py-2 text-sm text-slate-600 dark:text-slate-400 mb-4">
          <span className="font-medium">Legacy Documentation</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Legacy Migration Guide v2 to v3
        </h1>
        <p className="text-lg text-muted-foreground">
          Historical guide for upgrading from v2.x to v3.x
        </p>
      </div>

      <InfoBox title="Legacy Documentation" variant="blue" className="mb-8">
        <p className="mb-3">
          This guide is for legacy users migrating from version 2.x to 3.x.
        </p>
        <p className="text-sm">
          If you're using v3.x and want to upgrade to v4.x, please see the{" "}
          <a href="/docs/migration-guide" className="text-primary underline">
            Migration Guide v3 to v4
          </a>
          .
        </p>
      </InfoBox>

      <Section icon={AlertTriangle} title="Breaking Changes">
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-3">
              1. CSS Must Be Imported Manually
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              In v3, CSS is no longer automatically included. You must import it
              manually.
            </p>
            <div className="space-y-4">
              <div>
                <p className="text-sm mb-2">v2</p>
                <CodeBlock
                  language="javascript"
                  code={`// CSS was automatically included
import { TimepickerUI } from 'timepicker-ui';`}
                />
              </div>
              <div>
                <p className="text-sm mb-2">v3</p>
                <CodeBlock
                  language="javascript"
                  code={`// You must import CSS manually
import { TimepickerUI } from 'timepicker-ui';
import 'timepicker-ui/main.css';`}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">
              2. Event Names Changed
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              All event names have been prefixed with <code>timepicker:</code>{" "}
              for better namespacing and to avoid conflicts.
            </p>
            <div className="space-y-4">
              <div>
                <p className="text-sm mb-2">v2</p>
                <CodeBlock
                  language="javascript"
                  code={`input.addEventListener('show', (e) => {
  console.log('Opened');
});

input.addEventListener('accept', (e) => {
  console.log('Confirmed:', e.detail);
});

input.addEventListener('cancel', (e) => {
  console.log('Cancelled');
});`}
                />
              </div>
              <div>
                <p className="text-sm mb-2">v3</p>
                <CodeBlock
                  language="javascript"
                  code={`input.addEventListener('timepicker:open', (e) => {
  console.log('Opened');
});

input.addEventListener('timepicker:confirm', (e) => {
  console.log('Confirmed:', e.detail);
});

input.addEventListener('timepicker:cancel', (e) => {
  console.log('Cancelled');
});`}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">
              3. Recommended: Use Callbacks Instead of Events
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              v3 introduces a new callback-based API which is cleaner and more
              modern than DOM events.
            </p>
            <div className="space-y-4">
              <div>
                <p className="text-sm mb-2">v2 (DOM Events)</p>
                <CodeBlock
                  language="javascript"
                  code={`input.addEventListener('accept', (e) => {
  console.log('Time:', e.detail);
});

input.addEventListener('cancel', () => {
  console.log('Cancelled');
});`}
                />
              </div>
              <div>
                <p className="text-sm mb-2">v3 (Callbacks - Recommended)</p>
                <CodeBlock
                  language="javascript"
                  code={`const picker = new TimepickerUI(input, {
  onConfirm: (data) => {
    console.log('Time:', data);
  },
  onCancel: (data) => {
    console.log('Cancelled');
  },
  onOpen: () => {
    console.log('Opened');
  },
});`}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">
              4. destroy() Behavior Changed
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              In v2, <code>destroy()</code> removed the input element from the
              DOM. In v3, it only destroys the timepicker instance and keeps the
              input element intact.
            </p>
            <div className="space-y-4">
              <div>
                <p className="text-sm mb-2">v2</p>
                <CodeBlock
                  language="javascript"
                  code={`// Removed input from DOM
picker.destroy(); // Input is gone!`}
                />
              </div>
              <div>
                <p className="text-sm mb-2">v3</p>
                <CodeBlock
                  language="javascript"
                  code={`// Only destroys picker, keeps input
picker.destroy(); // Input remains in DOM`}
                />
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section icon={FileText} title="Event Name Mapping">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 font-semibold">v2 Event</th>
                <th className="text-left py-2 px-4 font-semibold">v3 Event</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4">show</td>
                <td className="py-2 px-4 text-primary">timepicker:open</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4">accept</td>
                <td className="py-2 px-4 text-primary">timepicker:confirm</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4">cancel</td>
                <td className="py-2 px-4 text-primary">timepicker:cancel</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4">update</td>
                <td className="py-2 px-4 text-primary">timepicker:update</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section icon={Sparkles} title="New in v3">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-semibold mb-2">Inline Mode</h3>
            <p className="text-sm text-muted-foreground">
              Display timepicker directly in a container without modal
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-semibold mb-2">Instance Management</h3>
            <p className="text-sm text-muted-foreground">
              <code>getById()</code> and <code>destroyAll()</code> methods
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-semibold mb-2">Direct Callbacks</h3>
            <p className="text-sm text-muted-foreground">
              Pass callbacks directly in options
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-semibold mb-2">5 New Themes</h3>
            <p className="text-sm text-muted-foreground">
              Extended theme options for better customization
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-semibold mb-2">getValue() / setValue()</h3>
            <p className="text-sm text-muted-foreground">
              Programmatically get and set time values
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-semibold mb-2">Better TypeScript</h3>
            <p className="text-sm text-muted-foreground">
              Improved type definitions and IntelliSense
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-semibold mb-2">EventEmitter API</h3>
            <p className="text-sm text-muted-foreground">
              Modern event handling with <code>on()</code>, <code>off()</code>,{" "}
              <code>once()</code>
            </p>
          </div>
        </div>
      </Section>

      <Section icon={Zap} title="EventEmitter API (v3.x)">
        <p className="mb-6">
          Starting in v3.x, we recommend using the new EventEmitter API instead
          of DOM events. This will become the standard in future versions.
        </p>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Old Way (Deprecated)</h3>
            <CodeBlock
              language="javascript"
              code={`// DOM events - will be removed in v4
input.addEventListener('timepicker:confirm', (e) => {
  console.log(e.detail);
});

input.addEventListener('timepicker:cancel', (e) => {
  console.log('Cancelled');
});`}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">
              New Way (Recommended)
            </h3>
            <CodeBlock
              language="javascript"
              code={`// EventEmitter API - recommended
picker.on('confirm', (data) => {
  console.log(data);
});

picker.on('cancel', (data) => {
  console.log('Cancelled');
});

// One-time listener
picker.once('open', () => {
  console.log('First open only');
});

// Remove listener
const handler = (data) => console.log(data);
picker.on('confirm', handler);
picker.off('confirm', handler);`}
            />
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Benefits</h3>
          <ul className="space-y-2 text-sm text-muted-foreground ml-6 list-disc">
            <li>Cleaner API without prefixes</li>
            <li>Better TypeScript support</li>
            <li>No DOM pollution</li>
            <li>Memory-efficient (automatic cleanup on destroy)</li>
            <li>
              Supports <code>once()</code> for one-time listeners
            </li>
          </ul>
        </div>
      </Section>

      <Section icon={Settings} title="Instance Management">
        <p className="mb-6">
          v3 introduces new static methods for managing multiple timepicker
          instances.
        </p>
        <CodeBlock
          language="javascript"
          code={`// Create instances with IDs
const picker1 = new TimepickerUI('#input1', { id: 'picker1' });
const picker2 = new TimepickerUI('#input2', { id: 'picker2' });

// Get instance by ID
const instance = TimepickerUI.getById('picker1');

// Destroy all instances at once
TimepickerUI.destroyAll();`}
        />
      </Section>

      <Section icon={Code2} title="getValue() and setValue()">
        <p className="mb-6">
          New methods for programmatically getting and setting time values.
        </p>
        <CodeBlock
          language="javascript"
          code={`const picker = new TimepickerUI('#input');

// Get current value
const currentTime = picker.getValue();
console.log(currentTime); // "14:30"

// Set new value
picker.setValue('09:15');

// Set value with custom format
picker.setValue('3:45 PM');`}
        />
      </Section>

      <Section icon={Package} title="Inline Mode">
        <p className="mb-6">
          Display the timepicker directly in a container without using a modal.
        </p>
        <CodeBlock
          language="javascript"
          code={`const picker = new TimepickerUI('#input', {
  inline: {
    enabled: true,
    containerId: 'timepicker-container',
    showButtons: false,
    autoUpdate: true,
  },
});`}
        />
        <CodeBlock
          language="html"
          code={`<input type="text" id="input" />
<div id="timepicker-container"></div>`}
        />
      </Section>

      <Section icon={Code2} title="Complete Migration Example">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">v2 Code</h3>
            <CodeBlock
              language="javascript"
              code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#myInput');

// v2 initialization
const picker = new TimepickerUI(input, {
  clockType: '12h',
  theme: 'basic',
});

// v2 events
input.addEventListener('show', () => {
  console.log('Opened');
});

input.addEventListener('accept', (e) => {
  console.log('Time selected:', e.detail);
});

input.addEventListener('cancel', () => {
  console.log('Cancelled');
});`}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">v3 Code (Migrated)</h3>
            <CodeBlock
              language="javascript"
              code={`import { TimepickerUI } from 'timepicker-ui';
import 'timepicker-ui/main.css'; // Required in v3

const input = document.querySelector('#myInput');

// v3 initialization with callbacks
const picker = new TimepickerUI(input, {
  clockType: '12h',
  theme: 'basic',
  // Modern callback-based API
  onOpen: () => {
    console.log('Opened');
  },
  onConfirm: (data) => {
    console.log('Time selected:', data);
  },
  onCancel: () => {
    console.log('Cancelled');
  },
});

// Or use EventEmitter API (recommended)
picker.on('confirm', (data) => {
  console.log('Confirmed:', data);
});

picker.once('open', () => {
  console.log('First open only');
});`}
            />
          </div>
        </div>
      </Section>

      <Section icon={CheckCircle2} title="Migration Checklist">
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card">
            <div className="flex-shrink-0 mt-0.5">
              <div className="h-5 w-5 rounded border-2 border-border"></div>
            </div>
            <div>
              <div className="font-medium">Add CSS import</div>
              <div className="text-muted-foreground">
                Import <code>timepicker-ui/main.css</code> in your code
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card">
            <div className="flex-shrink-0 mt-0.5">
              <div className="h-5 w-5 rounded border-2 border-border"></div>
            </div>
            <div>
              <div className="font-medium">Update event names</div>
              <div className="text-muted-foreground">
                Add <code>timepicker:</code> prefix to all event names
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card">
            <div className="flex-shrink-0 mt-0.5">
              <div className="h-5 w-5 rounded border-2 border-border"></div>
            </div>
            <div>
              <div className="font-medium">Consider using callbacks</div>
              <div className="text-muted-foreground">
                Replace DOM events with <code>onConfirm</code>,{" "}
                <code>onCancel</code>, etc.
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card">
            <div className="flex-shrink-0 mt-0.5">
              <div className="h-5 w-5 rounded border-2 border-border"></div>
            </div>
            <div>
              <div className="font-medium">Check destroy() usage</div>
              <div className="text-muted-foreground">
                Verify that input element persistence is correct for your use
                case
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card">
            <div className="flex-shrink-0 mt-0.5">
              <div className="h-5 w-5 rounded border-2 border-border"></div>
            </div>
            <div>
              <div className="font-medium">Test thoroughly</div>
              <div className="text-muted-foreground">
                Test all timepicker functionality in your application
              </div>
            </div>
          </div>
        </div>
      </Section>

      <div className="mt-12 rounded-lg border border-blue-500/20 bg-blue-500/5 p-6">
        <h2 className="text-lg font-semibold mb-2 text-blue-600 dark:text-blue-400">
          Next Steps
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          After migrating to v3, consider upgrading to v4 for the latest
          features and improvements.
        </p>
        <a
          href="/docs/migration-guide"
          className="text-primary hover:underline text-sm font-medium"
        >
          View Migration Guide v3 to v4
        </a>
      </div>
    </div>
  );
}
