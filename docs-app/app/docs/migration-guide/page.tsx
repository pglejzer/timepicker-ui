import { CodeBlock } from "@/components/code-block";
import { Section } from "@/components/section";
import { InfoBox } from "@/components/info-box";
import {
  AlertTriangle,
  Code2,
  CheckCircle2,
  Layers,
  ArrowRight,
  Package,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Migration Guide v3 to v4 - Timepicker-UI",
  description: "Complete guide for upgrading from Timepicker-UI v3.x to v4.0.0",
};

export default function MigrationGuidePage() {
  return (
    <div>
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-2 text-sm text-amber-600 dark:text-amber-400 mb-4">
          <AlertTriangle className="h-4 w-4" />
          <span className="font-medium">Breaking Changes</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Migration Guide v3 to v4
        </h1>
        <p className="text-lg text-muted-foreground">
          Complete guide for upgrading from v3.x to v4.0.0
        </p>
      </div>

      <InfoBox title="Important Notice" variant="orange" className="mb-8">
        <p className="mb-3">
          Version 4.0.0 introduces <strong>breaking changes</strong> in the
          options structure. There is <strong>NO backward compatibility</strong>{" "}
          - all v3.x code will break and must be updated.
        </p>
        <p className="text-sm">
          Migration typically takes 15-60 minutes depending on your codebase
          size.
        </p>
      </InfoBox>

      <InfoBox title="Migrating from v2.x?" variant="blue" className="mb-8">
        <p className="text-sm">
          If you're still using version 2.x, please see the{" "}
          <Link
            href="/docs/legacy-migration"
            className="text-primary underline font-medium"
          >
            Legacy Migration Guide v2 to v3
          </Link>{" "}
          first, then follow this guide to upgrade to v4.
        </p>
      </InfoBox>

      <Section icon={Layers} title="What Changed?">
        <p className="mb-6">
          The previous <strong>flat structure</strong> with 40+ fields has been
          reorganized into <strong>5 logical groups</strong> to improve code
          clarity, maintainability, and developer experience:
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-semibold text-primary mb-2">clock</h3>
            <p className="text-sm text-muted-foreground">
              Clock behavior configuration
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-semibold text-primary mb-2">ui</h3>
            <p className="text-sm text-muted-foreground">
              UI appearance and behavior
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-semibold text-primary mb-2">labels</h3>
            <p className="text-sm text-muted-foreground">
              Text labels customization
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-semibold text-primary mb-2">behavior</h3>
            <p className="text-sm text-muted-foreground">
              General behavior settings
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-semibold text-primary mb-2">callbacks</h3>
            <p className="text-sm text-muted-foreground">
              Event handler callbacks
            </p>
          </div>
        </div>
      </Section>

      <Section icon={Code2} title="Before & After">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              Old API (v3.x) - Flat Structure
            </h3>
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
          </div>

          <div className="flex items-center justify-center py-4">
            <ArrowRight className="h-6 w-6 text-primary" />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              New API (v4.0.0) - Grouped Structure
            </h3>
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
    mobile: false,
    editable: false,
  },
  labels: {
    am: 'AM',
    pm: 'PM',
    ok: 'OK',
    cancel: 'Cancel',
    time: 'Select time',
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
          </div>
        </div>
      </Section>

      <Section icon={Package} title="Complete Field Mapping">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">
              Clock Options
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-semibold">
                      v3.x (Flat)
                    </th>
                    <th className="text-left py-2 px-4 font-semibold">
                      v4.0.0 (Grouped)
                    </th>
                  </tr>
                </thead>
                <tbody className="font-mono text-xs">
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4">clockType</td>
                    <td className="py-2 px-4 text-primary">clock.type</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4">incrementHours</td>
                    <td className="py-2 px-4 text-primary">
                      clock.incrementHours
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4">incrementMinutes</td>
                    <td className="py-2 px-4 text-primary">
                      clock.incrementMinutes
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4">autoSwitchToMinutes</td>
                    <td className="py-2 px-4 text-primary">
                      clock.autoSwitchToMinutes
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4">disabledTime</td>
                    <td className="py-2 px-4 text-primary">
                      clock.disabledTime
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4">currentTime</td>
                    <td className="py-2 px-4 text-primary">
                      clock.currentTime
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">
              UI Options
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-semibold">
                      v3.x (Flat)
                    </th>
                    <th className="text-left py-2 px-4 font-semibold">
                      v4.0.0 (Grouped)
                    </th>
                  </tr>
                </thead>
                <tbody className="font-mono text-xs">
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4">theme</td>
                    <td className="py-2 px-4 text-primary">ui.theme</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4">animation</td>
                    <td className="py-2 px-4 text-primary">ui.animation</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4">backdrop</td>
                    <td className="py-2 px-4 text-primary">ui.backdrop</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4">mobile</td>
                    <td className="py-2 px-4 text-primary">ui.mobile</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4">enableSwitchIcon</td>
                    <td className="py-2 px-4 text-primary">
                      ui.enableSwitchIcon
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4">editable</td>
                    <td className="py-2 px-4 text-primary">ui.editable</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4">enableScrollbar</td>
                    <td className="py-2 px-4 text-primary">
                      ui.enableScrollbar
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4">cssClass</td>
                    <td className="py-2 px-4 text-primary">ui.cssClass</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4">appendModalSelector</td>
                    <td className="py-2 px-4 text-primary">
                      ui.appendModalSelector
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4">iconTemplate</td>
                    <td className="py-2 px-4 text-primary">ui.iconTemplate</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4">iconTemplateMobile</td>
                    <td className="py-2 px-4 text-primary">
                      ui.iconTemplateMobile
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4">inline</td>
                    <td className="py-2 px-4 text-primary">ui.inline</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">
              Label Options
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-semibold">
                      v3.x (Flat)
                    </th>
                    <th className="text-left py-2 px-4 font-semibold">
                      v4.0.0 (Grouped)
                    </th>
                  </tr>
                </thead>
                <tbody className="font-mono text-xs">
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4">amLabel</td>
                    <td className="py-2 px-4 text-primary">labels.am</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4">pmLabel</td>
                    <td className="py-2 px-4 text-primary">labels.pm</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4">okLabel</td>
                    <td className="py-2 px-4 text-primary">labels.ok</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4">cancelLabel</td>
                    <td className="py-2 px-4 text-primary">labels.cancel</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4">timeLabel</td>
                    <td className="py-2 px-4 text-primary">labels.time</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4">mobileTimeLabel</td>
                    <td className="py-2 px-4 text-primary">
                      labels.mobileTime
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4">hourMobileLabel</td>
                    <td className="py-2 px-4 text-primary">
                      labels.mobileHour
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4">minuteMobileLabel</td>
                    <td className="py-2 px-4 text-primary">
                      labels.mobileMinute
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">
              Behavior Options
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-semibold">
                      v3.x (Flat)
                    </th>
                    <th className="text-left py-2 px-4 font-semibold">
                      v4.0.0 (Grouped)
                    </th>
                  </tr>
                </thead>
                <tbody className="font-mono text-xs">
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4">focusInputAfterCloseModal</td>
                    <td className="py-2 px-4 text-primary">
                      behavior.focusInputAfterClose
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4">focusTrap</td>
                    <td className="py-2 px-4 text-primary">
                      behavior.focusTrap
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4">delayHandler</td>
                    <td className="py-2 px-4 text-primary">
                      behavior.delayHandler
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4">id</td>
                    <td className="py-2 px-4 text-primary">behavior.id</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">
              Callback Options
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-semibold">
                      v3.x (Flat)
                    </th>
                    <th className="text-left py-2 px-4 font-semibold">
                      v4.0.0 (Grouped)
                    </th>
                  </tr>
                </thead>
                <tbody className="font-mono text-xs">
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4">onOpen</td>
                    <td className="py-2 px-4 text-primary">callbacks.onOpen</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4">onCancel</td>
                    <td className="py-2 px-4 text-primary">
                      callbacks.onCancel
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4">onConfirm</td>
                    <td className="py-2 px-4 text-primary">
                      callbacks.onConfirm
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4">onUpdate</td>
                    <td className="py-2 px-4 text-primary">
                      callbacks.onUpdate
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4">onSelectHour</td>
                    <td className="py-2 px-4 text-primary">
                      callbacks.onSelectHour
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4">onSelectMinute</td>
                    <td className="py-2 px-4 text-primary">
                      callbacks.onSelectMinute
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4">onSelectAM</td>
                    <td className="py-2 px-4 text-primary">
                      callbacks.onSelectAM
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4">onSelectPM</td>
                    <td className="py-2 px-4 text-primary">
                      callbacks.onSelectPM
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4">onError</td>
                    <td className="py-2 px-4 text-primary">
                      callbacks.onError
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Section>

      <Section icon={Code2} title="Accessing & Updating Options">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Accessing Options in Code
            </h3>
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground mb-2">v3.x</p>
                <CodeBlock
                  language="typescript"
                  code={`const options = timepicker.options;
console.log(options.clockType); // '12h'
console.log(options.amLabel); // 'AM'`}
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">v4.0.0</p>
                <CodeBlock
                  language="typescript"
                  code={`const options = timepicker.options;
console.log(options.clock.type); // '12h'
console.log(options.labels.am); // 'AM'`}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Updating Options</h3>
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <p className="text-sm text-red-600 dark:text-red-400 mb-2">
                  ❌ v3.x - NO LONGER WORKS
                </p>
                <CodeBlock
                  language="typescript"
                  code={`timepicker.update({
  options: {
    clockType: '24h',
    animation: false,
  },
});`}
                />
              </div>
              <div>
                <p className="text-sm text-green-600 dark:text-green-400 mb-2">
                  ✅ v4.0.0 - REQUIRED
                </p>
                <CodeBlock
                  language="typescript"
                  code={`timepicker.update({
  options: {
    clock: { type: '24h' },
    ui: { animation: false },
  },
});`}
                />
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section icon={CheckCircle2} title="TypeScript Support">
        <p className="mb-4">
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
        <InfoBox
          title="Note: OptionTypes Removed"
          variant="blue"
          className="mt-4"
        >
          <p>
            <code>OptionTypes</code> has been removed. Use{" "}
            <code>TimepickerOptions</code> instead.
          </p>
        </InfoBox>
      </Section>

      <Section icon={Package} title="Benefits of the New Structure">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-semibold mb-2">Better Organization</h3>
            <p className="text-sm text-muted-foreground">
              Related options are grouped together logically
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-semibold mb-2">Improved Discoverability</h3>
            <p className="text-sm text-muted-foreground">
              Easier to find related settings
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-semibold mb-2">Enhanced IntelliSense</h3>
            <p className="text-sm text-muted-foreground">
              Better autocomplete by category
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-semibold mb-2">Reduced Cognitive Load</h3>
            <p className="text-sm text-muted-foreground">
              Smaller, focused option groups
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-semibold mb-2">Future-Proof</h3>
            <p className="text-sm text-muted-foreground">
              Easier to add new options without cluttering
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-semibold mb-2">Cleaner API</h3>
            <p className="text-sm text-muted-foreground">
              No more 40+ flat fields to navigate
            </p>
          </div>
        </div>
      </Section>

      <Section icon={Code2} title="Common Migration Examples">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Basic Setup</h3>
            <CodeBlock
              language="typescript"
              code={`// v4.0.0
const timepicker = new TimepickerUI('#input', {
  clock: { type: '12h' },
});`}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Advanced Setup</h3>
            <CodeBlock
              language="typescript"
              code={`// v4.0.0
const timepicker = new TimepickerUI('#input', {
  clock: {
    type: '24h',
    incrementMinutes: 15,
    disabledTime: {
      hours: [0, 1, 2, 23],
      interval: ['00:00 - 06:00', '22:00 - 23:59'],
    },
  },
  ui: {
    theme: 'm3-green',
    animation: true,
    backdrop: true,
    mobile: false,
    editable: true,
  },
  labels: {
    time: 'Pick a time',
    ok: 'Confirm',
    cancel: 'Dismiss',
  },
  behavior: {
    focusTrap: true,
    delayHandler: 300,
    focusInputAfterClose: true,
  },
  callbacks: {
    onOpen: () => console.log('Opened'),
    onConfirm: (data) => console.log('Time selected:', data),
    onCancel: () => console.log('Cancelled'),
  },
});`}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Inline Mode</h3>
            <CodeBlock
              language="typescript"
              code={`// v4.0.0
const timepicker = new TimepickerUI('#input', {
  ui: {
    inline: {
      enabled: true,
      containerId: 'timepicker-container',
      showButtons: false,
      autoUpdate: true,
    },
  },
  behavior: {
    focusTrap: false, // Automatically set if not specified
  },
});`}
            />
          </div>
        </div>
      </Section>

      <Section icon={AlertTriangle} title="FAQ">
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-semibold mb-2">Will my v3.x code break?</h3>
            <p className="text-sm text-muted-foreground">
              Yes. v4.0.0 is a major breaking change. You MUST update all code
              to use grouped options.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-semibold mb-2">Is there a migration layer?</h3>
            <p className="text-sm text-muted-foreground">
              No. There is NO backward compatibility. All old flat structure
              code will break.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-semibold mb-2">
              Can I mix flat and grouped structures?
            </h3>
            <p className="text-sm text-muted-foreground">
              No. Only grouped structure is supported in v4.0.0.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-semibold mb-2">
              How long will migration take?
            </h3>
            <p className="text-sm text-muted-foreground">
              Depending on your codebase size, it should take 15-60 minutes
              using find-and-replace.
            </p>
          </div>
        </div>
      </Section>

      <div className="mt-12 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-6">
        <h2 className="text-lg font-semibold mb-2 text-emerald-600 dark:text-emerald-400">
          Need Help?
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          If you encounter issues during migration:
        </p>
        <ul className="space-y-2 text-sm">
          <li>
            <Link
              href="/docs/configuration"
              className="text-primary hover:underline"
            >
              Check the Configuration Guide
            </Link>
          </li>
          <li>
            <Link
              href="/docs/api/options"
              className="text-primary hover:underline"
            >
              Review the Options API Reference
            </Link>
          </li>
          <li>
            <a
              href="https://github.com/openapi-ts/timepicker-ui/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Open an issue on GitHub
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
