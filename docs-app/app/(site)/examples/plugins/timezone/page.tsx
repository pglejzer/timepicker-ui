"use client";

import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { CodeBlock } from "@/components/code-block";
import { TimepickerExample } from "@/components/examples/timepicker-example";

export default function TimezonePluginPage() {
  return (
    <div>
      <PageHeader
        title="Timezone Plugin"
        description="Add a timezone selector dropdown to the timepicker. Display-only feature - does not convert times automatically."
      />

      <p>
        The selector is a select-only combobox. Focus it with Tab, open it with
        Enter, Space or the arrow keys, and type letters to jump to the next
        timezone that starts with them.
      </p>

      <Section title="Basic Timezone Selector">
        <TimepickerExample
          code={`import { TimepickerUI, PluginRegistry } from 'timepicker-ui';
import { TimezonePlugin } from 'timepicker-ui/plugins/timezone';

PluginRegistry.register(TimezonePlugin);

const picker = new TimepickerUI(input, {
  timezone: {
    enabled: true
  }
});
picker.create();`}
          options={{
            timezone: {
              enabled: true,
            },
          }}
          plugins={["timezone"]}
          inputPlaceholder="Select time with timezone"
        />
      </Section>

      <Section title="With Default Timezone">
        <TimepickerExample
          code={`import { TimepickerUI, PluginRegistry } from 'timepicker-ui';
import { TimezonePlugin } from 'timepicker-ui/plugins/timezone';

PluginRegistry.register(TimezonePlugin);

const picker = new TimepickerUI(input, {
  timezone: {
    enabled: true,
    default: 'Europe/London'
  }
});
picker.create();`}
          options={{
            timezone: {
              enabled: true,
              default: "Europe/London",
            },
          }}
          plugins={["timezone"]}
          inputPlaceholder="London timezone"
        />
      </Section>

      <Section title="Custom Timezone List">
        <TimepickerExample
          code={`import { TimepickerUI, PluginRegistry } from 'timepicker-ui';
import { TimezonePlugin } from 'timepicker-ui/plugins/timezone';

PluginRegistry.register(TimezonePlugin);

const picker = new TimepickerUI(input, {
  timezone: {
    enabled: true,
    default: 'America/New_York',
    list: [
      'America/New_York',
      'America/Los_Angeles',
      'Europe/London',
      'Europe/Paris',
      'Asia/Tokyo'
    ]
  }
});
picker.create();`}
          options={{
            timezone: {
              enabled: true,
              default: "America/New_York",
              list: [
                "America/New_York",
                "America/Los_Angeles",
                "Europe/London",
                "Europe/Paris",
                "Asia/Tokyo",
              ],
            },
          }}
          plugins={["timezone"]}
          inputPlaceholder="Limited timezones"
        />
      </Section>

      <Section title="Custom Label">
        <TimepickerExample
          code={`import { TimepickerUI, PluginRegistry } from 'timepicker-ui';
import { TimezonePlugin } from 'timepicker-ui/plugins/timezone';

PluginRegistry.register(TimezonePlugin);

const picker = new TimepickerUI(input, {
  timezone: {
    enabled: true
  },
  labels: {
    timezone: 'Time Zone'
  }
});
picker.create();`}
          options={{
            timezone: {
              enabled: true,
            },
            labels: {
              timezone: "Time Zone",
            },
          }}
          plugins={["timezone"]}
          inputPlaceholder="Custom label"
        />
      </Section>

      <Section title="Extend the Built-in List">
        <p>
          The plugin entry exports <code>DEFAULT_TIMEZONES</code>, the list
          the selector shows by default, and <code>getTimezoneList()</code>,
          which returns <code>&#123; id, label, offset &#125;</code> for each ID
          the browser knows. Spread the default list to add a zone. New in
          4.7.0.
        </p>
        <CodeBlock
          language="typescript"
          code={`import { TimepickerUI, PluginRegistry } from 'timepicker-ui';
import {
  TimezonePlugin,
  getTimezoneList,
  DEFAULT_TIMEZONES
} from 'timepicker-ui/plugins/timezone';

PluginRegistry.register(TimezonePlugin);

const list = [...DEFAULT_TIMEZONES, 'Europe/Warsaw'];
const zones = getTimezoneList(list);

const picker = new TimepickerUI(input, {
  timezone: {
    enabled: true,
    default: 'Europe/Warsaw',
    list
  }
});
picker.create();`}
        />
      </Section>

      <Section title="Default Not in the List">
        <p>
          A <code>timezone.default</code> that is not in the list falls back
          to the browser timezone, or the first entry, and emits an{" "}
          <code>error</code> event once. New in 4.7.0.
        </p>
        <CodeBlock
          language="typescript"
          code={`const picker = new TimepickerUI(input, {
  timezone: { enabled: true, default: 'Europe/Warsaw' }
});
picker.create();

picker.on('error', (data) => {
  console.warn(data.error);
  // timezone.default "Europe/Warsaw" is not in the timezone list, using "Europe/Paris"
});`}
        />
      </Section>
    </div>
  );
}
