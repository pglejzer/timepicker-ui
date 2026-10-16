"use client";

import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { TimepickerExample } from "@/components/examples/timepicker-example";

export default function RangePluginPage() {
  return (
    <div>
      <PageHeader
        title="Range Plugin"
        description={
          <>
            Select time ranges with &quot;from&quot; and &quot;to&quot; segments.
            Automatic validation blocks invalid time selections.
          </>
        }
      />

      <Section title="Basic Range">
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
      </Section>

      <Section title="Custom Labels">
        <TimepickerExample
          code={`import { TimepickerUI, PluginRegistry } from 'timepicker-ui';
import { RangePlugin } from 'timepicker-ui/plugins/range';

PluginRegistry.register(RangePlugin);

const picker = new TimepickerUI(input, {
  range: {
    enabled: true
  },
  labels: {
    rangeFrom: 'Start',
    rangeTo: 'End'
  }
});
picker.create();`}
          options={{
            range: {
              enabled: true,
            },
            labels: {
              rangeFrom: "Start",
              rangeTo: "End",
            },
          }}
          plugins={["range"]}
          inputPlaceholder="Select start and end time"
        />
      </Section>

      <Section title="With Duration Constraints">
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
      </Section>

      <Section title="24h Format Range">
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
      </Section>
    </div>
  );
}
