"use client";

import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { TimepickerExample } from "@/components/examples/timepicker-example";

export default function TimezonePluginPage() {
  return (
    <div>
      <PageHeader
        title="Timezone Plugin"
        description="Add a timezone selector dropdown to the timepicker. Display-only feature - does not convert times automatically."
      />

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
    </div>
  );
}
