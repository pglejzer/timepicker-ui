import { CodeBlock } from "@/components/code-block";
import { buildMetadata } from "@/lib/metadata";
import { Section } from "@/components/section";
import { Callout } from "@/components/callout";
import { PageHeader } from "@/components/page-header";
import { ApiTable } from "@/components/api-table";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Migration Guide v3 to v4",
  description:
    "Upgrade timepicker-ui from v3.x to v4.0.0 - the new grouped options structure, renamed APIs and breaking changes explained step by step, with code examples.",
  path: "/docs/migration-guide",
});

const optionGroups = [
  { name: "clock", description: "Clock behavior configuration" },
  { name: "ui", description: "UI appearance and behavior" },
  { name: "labels", description: "Text labels customization" },
  { name: "behavior", description: "General behavior settings" },
  { name: "callbacks", description: "Event handler callbacks" },
];

const clockMapping = [
  { v3: "clockType", v4: "clock.type" },
  { v3: "incrementHours", v4: "clock.incrementHours" },
  { v3: "incrementMinutes", v4: "clock.incrementMinutes" },
  { v3: "autoSwitchToMinutes", v4: "clock.autoSwitchToMinutes" },
  { v3: "disabledTime", v4: "clock.disabledTime" },
  { v3: "currentTime: true", v4: "clock.defaultTime: 'now'" },
  {
    v3: "currentTime: { time, updateInput }",
    v4: "clock.defaultTime: { time, updateInput }",
  },
];

const uiMapping = [
  { v3: "theme", v4: "ui.theme" },
  { v3: "animation", v4: "ui.animation" },
  { v3: "backdrop", v4: "ui.backdrop" },
  { v3: "mobile: true", v4: "ui.initialView: 'keyboard'" },
  { v3: "enableSwitchIcon", v4: "ui.viewSwitch" },
  { v3: "editable", v4: "ui.editable" },
  { v3: "enableScrollbar", v4: "ui.allowPageScroll" },
  { v3: "cssClass", v4: "ui.cssClass" },
  { v3: "appendModalSelector", v4: "ui.appendTo" },
  { v3: "iconTemplate", v4: "ui.keyboardIcon" },
  { v3: "iconTemplateMobile", v4: "ui.clockIcon" },
  { v3: "inline", v4: "ui.inline" },
  {
    v3: "inline: { containerId: 'x' }",
    v4: "ui.inline: { container: '#x' }",
  },
];

const labelMapping = [
  { v3: "amLabel", v4: "labels.am" },
  { v3: "pmLabel", v4: "labels.pm" },
  { v3: "okLabel", v4: "labels.ok" },
  { v3: "cancelLabel", v4: "labels.cancel" },
  { v3: "timeLabel", v4: "labels.clockTitle" },
  { v3: "mobileTimeLabel", v4: "labels.keyboardTitle" },
  { v3: "hourMobileLabel", v4: "labels.hour" },
  { v3: "minuteMobileLabel", v4: "labels.minute" },
];

const behaviorMapping = [
  { v3: "focusInputAfterCloseModal", v4: "behavior.returnFocus" },
  { v3: "focusTrap", v4: "behavior.focusTrap" },
  { v3: "delayHandler", v4: "behavior.delayHandler" },
  { v3: "id", v4: "behavior.id" },
];

const callbackMapping = [
  { v3: "onOpen", v4: "callbacks.onOpen" },
  { v3: "onCancel", v4: "callbacks.onCancel" },
  { v3: "onConfirm", v4: "callbacks.onConfirm" },
  { v3: "onUpdate", v4: "callbacks.onUpdate" },
  { v3: "onSelectHour", v4: "callbacks.onSelectHour" },
  { v3: "onSelectMinute", v4: "callbacks.onSelectMinute" },
  {
    v3: "onSelectAM, onSelectPM",
    v4: "callbacks.onSelectPeriod (data.type is 'AM' or 'PM')",
  },
  { v3: "onError", v4: "callbacks.onError" },
];

const benefits = [
  {
    title: "Better Organization",
    description: "Related options are grouped together logically",
  },
  {
    title: "Improved Discoverability",
    description: "Easier to find related settings",
  },
  {
    title: "Autocomplete by Group",
    description: "Suggestions list only the options of the current group",
  },
  {
    title: "Reduced Cognitive Load",
    description: "Smaller, focused option groups",
  },
  {
    title: "Future-Proof",
    description: "Easier to add new options without cluttering",
  },
  { title: "Cleaner API", description: "No more 40+ flat fields to navigate" },
];

const faq = [
  {
    question: "Will my v3.x code break?",
    answer:
      "Yes. v4.0.0 is a major breaking change. You MUST update all code to use grouped options.",
  },
  {
    question: "Is there a migration layer?",
    answer:
      "No. There is NO backward compatibility. All old flat structure code will break.",
  },
  {
    question: "Can I mix flat and grouped structures?",
    answer: "No. Only grouped structure is supported in v4.0.0.",
  },
  {
    question: "How long will migration take?",
    answer:
      "Depending on your codebase size, it should take 15-60 minutes using find-and-replace.",
  },
];

interface MappingRow {
  v3: string;
  v4: string;
}

function MappingTable({ rows }: { rows: MappingRow[] }) {
  return (
    <ApiTable
      columns={[
        { key: "v3", label: "v3.x (Flat)" },
        { key: "v4", label: "v4.5 (Grouped)", mono: true },
      ]}
      rows={rows.map((row) => ({
        id: row.v3,
        v3: <code>{row.v3}</code>,
        v4: <code>{row.v4}</code>,
      }))}
      rowKey="id"
    />
  );
}

export default function MigrationGuidePage() {
  return (
    <div>
      <PageHeader
        badge="Breaking Changes"
        title="Migration Guide v3 to v4"
        description="Complete guide for upgrading from v3.x to v4.0.0"
      />

      <Callout title="Important Notice" tone="warning">
        <p>
          Version 4.0.0 introduces <strong>breaking changes</strong> in the
          options structure. There is <strong>NO backward compatibility</strong>{" "}
          - all v3.x code will break and must be updated.
        </p>
        <p>
          Migration typically takes 15-60 minutes depending on your codebase
          size.
        </p>
      </Callout>

      <Callout title="Migrating from v2.x?">
        <p>
          If you&apos;re still using version 2.x, please see the{" "}
          <Link href="/docs/legacy-migration">
            Legacy Migration Guide v2 to v3
          </Link>{" "}
          first, then follow this guide to upgrade to v4.
        </p>
      </Callout>

      <Callout title="Option names from 4.5.0">
        <p>
          The v4 side of this guide uses the option names from 4.5.0. Some
          options had other names in 4.0 to 4.4. Those names still work until
          5.0 and are listed in{" "}
          <Link href="/docs/api/options#renamed">Renamed in 4.5.0</Link>
          .
        </p>
      </Callout>

      <Section title="What Changed?">
        <p>
          The previous <strong>flat structure</strong> with 40+ fields has been
          reorganized into <strong>5 logical groups</strong> to improve code
          clarity, maintainability, and developer experience:
        </p>
        <dl>
          {optionGroups.map((group) => (
            <div key={group.name}>
              <dt>
                <code>{group.name}</code>
              </dt>
              <dd>{group.description}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title="Before & After">
        <h3>Old API (v3.x) - Flat Structure</h3>
        <CodeBlock
          language="typescript"
          code={`const timepicker = new TimepickerUI('#input', {
  clockType: '12h',
  amLabel: 'AM',
  pmLabel: 'PM',
  okLabel: 'OK',
  cancelLabel: 'Cancel',
  timeLabel: 'Select time',
  animation: true,
  backdrop: true,
  theme: 'basic',
  incrementHours: 1,
  incrementMinutes: 5,
  focusTrap: true,
  delayHandler: 300,
  mobile: false,
  editable: false,
  onOpen: (event) => console.log('opened', event),
  onConfirm: (event) => console.log('confirmed', event),
});`}
        />

        <h3>New API (v4) - Grouped Structure</h3>
        <CodeBlock
          language="typescript"
          code={`const timepicker = new TimepickerUI('#input', {
  clock: {
    type: '12h',
    incrementHours: 1,
    incrementMinutes: 5,
  },
  ui: {
    animation: true,
    backdrop: true,
    theme: 'basic',
    initialView: 'clock',
    editable: false,
  },
  labels: {
    am: 'AM',
    pm: 'PM',
    ok: 'OK',
    cancel: 'Cancel',
    clockTitle: 'Select time',
  },
  behavior: {
    focusTrap: true,
    delayHandler: 300,
  },
  callbacks: {
    onOpen: (event) => console.log('opened', event),
    onConfirm: (event) => console.log('confirmed', event),
  },
});`}
        />
      </Section>

      <Section title="Complete Field Mapping">
        <h3>Clock Options</h3>
        <MappingTable rows={clockMapping} />

        <h3>UI Options</h3>
        <MappingTable rows={uiMapping} />

        <h3>Label Options</h3>
        <MappingTable rows={labelMapping} />

        <h3>Behavior Options</h3>
        <MappingTable rows={behaviorMapping} />

        <h3>Callback Options</h3>
        <MappingTable rows={callbackMapping} />
      </Section>

      <Section title="Accessing & Updating Options">
        <h3>Accessing Options in Code</h3>
        <p>v3.x</p>
        <CodeBlock
          language="typescript"
          code={`const options = timepicker.options;
console.log(options.clockType); // '12h'
console.log(options.amLabel); // 'AM'`}
        />
        <p>v4.0.0</p>
        <CodeBlock
          language="typescript"
          code={`const options = timepicker.options;
console.log(options.clock.type); // '12h'
console.log(options.labels.am); // 'AM'`}
        />

        <h3>Updating Options</h3>
        <p>v3.x - NO LONGER WORKS</p>
        <CodeBlock
          language="typescript"
          code={`timepicker.update({
  options: {
    clockType: '24h',
    animation: false,
  },
});`}
        />
        <p>v4.5 - REQUIRED</p>
        <CodeBlock
          language="typescript"
          code={`timepicker.setOptions({
  clock: { type: '24h' },
  ui: { animation: false },
});`}
        />
        <p>
          Before 4.5.0, pass the same groups to{" "}
          <code>{"timepicker.update({ options })"}</code>. It still works
          until 5.0.
        </p>
      </Section>

      <Section title="TypeScript Support">
        <p>
          Version 4.0.0 provides improved TypeScript types for the new grouped
          structure:
        </p>
        <CodeBlock
          language="typescript"
          code={`import type {
  TimepickerOptions,   // Main grouped options type
  ClockOptions,        // Clock group
  UIOptions,           // UI group
  LabelsOptions,       // Labels group
  BehaviorOptions,     // Behavior group
  CallbacksOptions,    // Callbacks group
} from 'timepicker-ui';

const options: TimepickerOptions = {
  clock: {
    type: '12h',
    incrementMinutes: 5,
  },
  ui: {
    theme: 'basic',
    animation: true,
  },
  labels: {
    ok: 'Confirm',
    cancel: 'Close',
  },
};

const timepicker = new TimepickerUI('#input', options);`}
        />
        <Callout title="Note: OptionTypes Is Deprecated">
          <p>
            <code>OptionTypes</code> is still exported, but it describes the
            old flat v3 options and is deprecated in favour of{" "}
            <code>TimepickerOptions</code>. It is removed in 5.0.
          </p>
        </Callout>
      </Section>

      <Section title="Benefits of the New Structure">
        <dl>
          {benefits.map((benefit) => (
            <div key={benefit.title}>
              <dt>{benefit.title}</dt>
              <dd>{benefit.description}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title="Common Migration Examples">
        <h3>Basic Setup</h3>
        <CodeBlock
          language="typescript"
          code={`// v4.0.0
const timepicker = new TimepickerUI('#input', {
  clock: { type: '12h' },
});`}
        />

        <h3>Advanced Setup</h3>
        <CodeBlock
          language="typescript"
          code={`// v4.5
const timepicker = new TimepickerUI('#input', {
  clock: {
    type: '24h',
    incrementMinutes: 15,
    disabledTime: {
      ranges: ['00:00 - 06:00', '22:00 - 23:59'],
    },
  },
  ui: {
    theme: 'm3-green',
    animation: true,
    backdrop: true,
    initialView: 'clock',
    editable: true,
  },
  labels: {
    clockTitle: 'Pick a time',
    ok: 'Confirm',
    cancel: 'Dismiss',
  },
  behavior: {
    focusTrap: true,
    delayHandler: 300,
    returnFocus: true,
  },
  callbacks: {
    onOpen: () => console.log('Opened'),
    onConfirm: (data) => console.log('Time selected:', data),
    onCancel: () => console.log('Cancelled'),
  },
});`}
        />

        <h3>Inline Mode</h3>
        <CodeBlock
          language="typescript"
          code={`// v4.5
const timepicker = new TimepickerUI('#input', {
  ui: {
    inline: {
      enabled: true,
      container: '#timepicker-container',
      showButtons: false,
      autoUpdate: true,
    },
  },
  behavior: {
    focusTrap: false, // Automatically set if not specified
  },
});`}
        />
      </Section>

      <Section title="FAQ">
        <dl>
          {faq.map((item) => (
            <div key={item.question}>
              <dt>{item.question}</dt>
              <dd>{item.answer}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title="Need Help?">
        <p>
          If you encounter issues during migration:
        </p>
        <ul>
          <li>
            <Link href="/docs/configuration">
              Check the Configuration Guide
            </Link>
          </li>
          <li>
            <Link href="/docs/api/options">
              Review the Options API Reference
            </Link>
          </li>
          <li>
            <a
              href="https://github.com/pglejzer/timepicker-ui/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open an issue on GitHub
            </a>
          </li>
        </ul>
      </Section>
    </div>
  );
}
