import { CodeBlock } from "@/components/code-block";
import { buildMetadata } from "@/lib/metadata";
import { Section } from "@/components/section";
import { Callout } from "@/components/callout";
import { PageHeader } from "@/components/page-header";
import { ApiTable } from "@/components/api-table";

export const metadata = buildMetadata({
  title: "Legacy Migration Guide v2 to v3",
  description:
    "Upgrade timepicker-ui from v2.x to v3.x - the legacy migration guide covering breaking changes, renamed options and updated initialization, with code examples.",
  path: "/docs/legacy-migration",
});

const eventMapping = [
  { v2: "show", v3: "timepicker:open" },
  { v2: "accept", v3: "timepicker:confirm" },
  { v2: "cancel", v3: "timepicker:cancel" },
  { v2: "update", v3: "timepicker:update" },
];

const newInV3 = [
  {
    title: "Inline Mode",
    description: "Display timepicker directly in a container without modal",
  },
  {
    title: "Instance Management",
    description: (
      <>
        <code>getById()</code> and <code>destroyAll()</code> methods
      </>
    ),
  },
  {
    title: "Direct Callbacks",
    description: "Pass callbacks directly in options",
  },
  {
    title: "5 New Themes",
    description: "Extended theme options for better customization",
  },
  {
    title: "getValue() / setValue()",
    description: "Programmatically get and set time values",
  },
  {
    title: "Better TypeScript",
    description: "Improved type definitions and IntelliSense",
  },
  {
    title: "EventEmitter API",
    description: (
      <>
        Modern event handling with <code>on()</code>, <code>off()</code>,{" "}
        <code>once()</code>
      </>
    ),
  },
];

const checklist = [
  {
    title: "Add CSS import",
    description: (
      <>
        Import <code>timepicker-ui/main.css</code> in your code
      </>
    ),
  },
  {
    title: "Update event names",
    description: (
      <>
        Add <code>timepicker:</code> prefix to all event names
      </>
    ),
  },
  {
    title: "Consider using callbacks",
    description: (
      <>
        Replace DOM events with <code>onConfirm</code>,{" "}
        <code>onCancel</code>, etc.
      </>
    ),
  },
  {
    title: "Check destroy() usage",
    description:
      "Verify that input element persistence is correct for your use case",
  },
  {
    title: "Test thoroughly",
    description: "Test all timepicker functionality in your application",
  },
];

export default function LegacyMigrationPage() {
  return (
    <div>
      <PageHeader
        badge="Legacy Documentation"
        title="Legacy Migration Guide v2 to v3"
        description="Historical guide for upgrading from v2.x to v3.x"
      />

      <Callout title="Legacy Documentation">
        <p>
          This guide is for legacy users migrating from version 2.x to 3.x.
        </p>
        <p>
          If you&apos;re using v3.x and want to upgrade to v4.x, please see the{" "}
          <a href="/docs/migration-guide">Migration Guide v3 to v4</a>
          .
        </p>
      </Callout>

      <Section title="Breaking Changes">
        <h3>1. CSS Must Be Imported Manually</h3>
        <p>
          In v3, CSS is no longer automatically included. You must import it
          manually.
        </p>
        <p>v2</p>
        <CodeBlock
          language="javascript"
          code={`// CSS was automatically included
import { TimepickerUI } from 'timepicker-ui';`}
        />
        <p>v3</p>
        <CodeBlock
          language="javascript"
          code={`// You must import CSS manually
import { TimepickerUI } from 'timepicker-ui';
import 'timepicker-ui/main.css';`}
        />

        <h3>2. Event Names Changed</h3>
        <p>
          All event names have been prefixed with <code>timepicker:</code>{" "}
          for better namespacing and to avoid conflicts.
        </p>
        <p>v2</p>
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
        <p>v3</p>
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

        <h3>3. Recommended: Use Callbacks Instead of Events</h3>
        <p>
          v3 introduces a new callback-based API which is cleaner and more
          modern than DOM events.
        </p>
        <p>v2 (DOM Events)</p>
        <CodeBlock
          language="javascript"
          code={`input.addEventListener('accept', (e) => {
  console.log('Time:', e.detail);
});

input.addEventListener('cancel', () => {
  console.log('Cancelled');
});`}
        />
        <p>v3 (Callbacks - Recommended)</p>
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

        <h3>4. destroy() Behavior Changed</h3>
        <p>
          In v2, <code>destroy()</code> removed the input element from the
          DOM. In v3, it only destroys the timepicker instance and keeps the
          input element intact.
        </p>
        <p>v2</p>
        <CodeBlock
          language="javascript"
          code={`// Removed input from DOM
picker.destroy(); // Input is gone!`}
        />
        <p>v3</p>
        <CodeBlock
          language="javascript"
          code={`// Only destroys picker, keeps input
picker.destroy(); // Input remains in DOM`}
        />
      </Section>

      <Section title="Event Name Mapping">
        <ApiTable
          columns={[
            { key: "v2", label: "v2 Event" },
            { key: "v3", label: "v3 Event", mono: true },
          ]}
          rows={eventMapping.map((row) => ({
            id: row.v2,
            v2: <code>{row.v2}</code>,
            v3: <code>{row.v3}</code>,
          }))}
          rowKey="id"
        />
      </Section>

      <Section title="New in v3">
        <dl>
          {newInV3.map((item) => (
            <div key={item.title}>
              <dt>{item.title}</dt>
              <dd>{item.description}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title="EventEmitter API (v3.x)">
        <p>
          Starting in v3.x, we recommend using the new EventEmitter API instead
          of DOM events. This will become the standard in future versions.
        </p>
        <h3>Old Way (Deprecated)</h3>
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
        <h3>New Way (Recommended)</h3>
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

        <h3>Benefits</h3>
        <ul>
          <li>Cleaner API without prefixes</li>
          <li>Better TypeScript support</li>
          <li>No DOM pollution</li>
          <li>Memory-efficient (automatic cleanup on destroy)</li>
          <li>
            Supports <code>once()</code> for one-time listeners
          </li>
        </ul>
      </Section>

      <Section title="Instance Management">
        <p>
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

      <Section title="getValue() and setValue()">
        <p>
          New methods for programmatically getting and setting time values.
        </p>
        <CodeBlock
          language="javascript"
          code={`const picker = new TimepickerUI('#input');

// Get current value
const value = picker.getValue();
console.log(value); // "14:30"

// Set new value
picker.setValue('09:15');

// Set value with custom format
picker.setValue('3:45 PM');`}
        />
      </Section>

      <Section title="Inline Mode">
        <p>
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
        <p>
          In 4.5 this option is{" "}
          <code>{"ui.inline.container: '#timepicker-container'"}</code>, which
          takes a selector or an element. See the{" "}
          <a href="/docs/migration-guide">Migration Guide v3 to v4</a>{" "}
          for the other option names.
        </p>
      </Section>

      <Section title="Complete Migration Example">
        <h3>v2 Code</h3>
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
        <h3>v3 Code (Migrated)</h3>
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
      </Section>

      <Section title="Migration Checklist">
        <dl>
          {checklist.map((item) => (
            <div key={item.title}>
              <dt>{item.title}</dt>
              <dd>{item.description}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title="Next Steps">
        <p>
          After migrating to v3, consider upgrading to v4 for the latest
          features and improvements.
        </p>
        <p>
          <a href="/docs/migration-guide">View Migration Guide v3 to v4</a>
        </p>
      </Section>
    </div>
  );
}
