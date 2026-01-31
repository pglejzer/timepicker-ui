"use client";

import { TimepickerExample } from "@/components/examples/timepicker-example";

export default function RangePluginPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-3 text-foreground">
          Range Plugin
        </h1>
        <p className="text-muted-foreground">
          Select time ranges with &quot;from&quot; and &quot;to&quot; segments.
          Automatic validation blocks invalid time selections.
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4 text-foreground">
            Basic Range
          </h2>
          <TimepickerExample
            code={`import { TimepickerUI, PluginRegistry } from 'timepicker-ui';
import { RangePlugin } from 'timepicker-ui/plugins/range';

PluginRegistry.register(RangePlugin);

const picker = new TimepickerUI(input, {
  range: {
    enabled: true
  }
});
picker.create();`}
            options={{
              range: {
                enabled: true,
              },
            }}
            plugins={["range"]}
            inputPlaceholder="Select time range"
          />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-foreground">
            Custom Labels
          </h2>
          <TimepickerExample
            code={`import { TimepickerUI, PluginRegistry } from 'timepicker-ui';
import { RangePlugin } from 'timepicker-ui/plugins/range';

PluginRegistry.register(RangePlugin);

const picker = new TimepickerUI(input, {
  range: {
    enabled: true,
    fromLabel: 'Start',
    toLabel: 'End'
  }
});
picker.create();`}
            options={{
              range: {
                enabled: true,
                fromLabel: "Start",
                toLabel: "End",
              },
            }}
            plugins={["range"]}
            inputPlaceholder="Select start and end time"
          />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-foreground">
            With Duration Constraints
          </h2>
          <TimepickerExample
            code={`import { TimepickerUI, PluginRegistry } from 'timepicker-ui';
import { RangePlugin } from 'timepicker-ui/plugins/range';

PluginRegistry.register(RangePlugin);

const picker = new TimepickerUI(input, {
  range: {
    enabled: true,
    minDuration: 30,  // min 30 minutes
    maxDuration: 240  // max 4 hours
  }
});
picker.create();`}
            options={{
              range: {
                enabled: true,
                minDuration: 30,
                maxDuration: 240,
              },
            }}
            plugins={["range"]}
            inputPlaceholder="30min - 4h range"
          />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-foreground">
            24h Format Range
          </h2>
          <TimepickerExample
            code={`import { TimepickerUI, PluginRegistry } from 'timepicker-ui';
import { RangePlugin } from 'timepicker-ui/plugins/range';

PluginRegistry.register(RangePlugin);

const picker = new TimepickerUI(input, {
  clock: {
    type: '24h'
  },
  range: {
    enabled: true
  }
});
picker.create();`}
            options={{
              clock: {
                type: "24h",
              },
              range: {
                enabled: true,
              },
            }}
            plugins={["range"]}
            inputPlaceholder="24h range selection"
          />
        </section>
      </div>
    </div>
  );
}
