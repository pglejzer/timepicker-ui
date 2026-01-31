"use client";

import { TimepickerExample } from "@/components/examples/timepicker-example";

export default function TimezonePluginPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-3 text-foreground">
          Timezone Plugin
        </h1>
        <p className="text-muted-foreground">
          Add a timezone selector dropdown to the timepicker. Display-only
          feature - does not convert times automatically.
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4 text-foreground">
            Basic Timezone Selector
          </h2>
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
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-foreground">
            With Default Timezone
          </h2>
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
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-foreground">
            Whitelisted Timezones
          </h2>
          <TimepickerExample
            code={`import { TimepickerUI, PluginRegistry } from 'timepicker-ui';
import { TimezonePlugin } from 'timepicker-ui/plugins/timezone';

PluginRegistry.register(TimezonePlugin);

const picker = new TimepickerUI(input, {
  timezone: {
    enabled: true,
    default: 'America/New_York',
    whitelist: [
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
                whitelist: [
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
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-foreground">
            Custom Label
          </h2>
          <TimepickerExample
            code={`import { TimepickerUI, PluginRegistry } from 'timepicker-ui';
import { TimezonePlugin } from 'timepicker-ui/plugins/timezone';

PluginRegistry.register(TimezonePlugin);

const picker = new TimepickerUI(input, {
  timezone: {
    enabled: true,
    label: 'Time Zone'
  }
});
picker.create();`}
            options={{
              timezone: {
                enabled: true,
                label: "Time Zone",
              },
            }}
            plugins={["timezone"]}
            inputPlaceholder="Custom label"
          />
        </section>
      </div>
    </div>
  );
}
