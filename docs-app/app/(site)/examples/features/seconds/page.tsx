import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";
import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { InfoBox } from "@/components/info-box";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { Timer, Layers, Ban, ArrowLeftRight, Smartphone } from "lucide-react";

export const metadata = buildMetadata({
  title: "Seconds Example",
  description:
    "Seconds example - pick HH:MM:SS in timepicker-ui with clock.showSeconds on the analog clock, scroll wheel, compact wheel and range picker, with copy-paste code.",
  path: "/examples/features/seconds",
});

export default function SecondsExamplePage() {
  return (
    <div>
      <JsonLdBreadcrumb pathname="/examples/features/seconds" />
      <PageHeader
        title="Seconds"
        description={
          <>
            Pick hours, minutes and seconds with{" "}
            <code>clock.showSeconds</code>. Full reference on the{" "}
            <Link href="/docs/features/seconds" className="text-primary underline">
              Seconds docs page
            </Link>
            .
          </>
        }
        eyebrow="Example · Features"
      />

      <InfoBox title="Version" variant="blue" className="mb-8">
        Seconds need timepicker-ui 4.5.0 or later.
      </InfoBox>

      <Section icon={Timer} title="Clock with Seconds (12h)">
        <p className="text-muted-foreground mb-4">
          Pick an hour, then a minute. The face then switches to seconds. The
          value looks like <code>02:30:15 PM</code>.
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  clock: { showSeconds: true }
});
picker.create();`}
          options={{
            clock: { showSeconds: true },
          }}
        />
      </Section>

      <Section icon={Timer} title="24h with a 5-Second Step">
        <p className="text-muted-foreground mb-4">
          <code>incrementSeconds</code> sets the step on the seconds face and
          the keyboard. The value looks like <code>14:30:15</code>.
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  clock: {
    type: '24h',
    showSeconds: true,
    incrementSeconds: 5
  }
});
picker.create();`}
          options={{
            clock: { type: "24h", showSeconds: true, incrementSeconds: 5 },
          }}
        />
      </Section>

      <Section icon={Timer} title="No Auto-Switch to Seconds">
        <p className="text-muted-foreground mb-4">
          With <code>autoSwitchToSeconds: false</code>, the face stays on
          minutes. Click the seconds field in the header to set seconds.
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  clock: {
    showSeconds: true,
    autoSwitchToSeconds: false
  }
});
picker.create();`}
          options={{
            clock: { showSeconds: true, autoSwitchToSeconds: false },
          }}
        />
      </Section>

      <Section icon={Layers} title="Wheel with Seconds">
        <p className="text-muted-foreground mb-4">
          Three columns: hours, minutes and seconds.
        </p>
        <TimepickerExample
          code={`import { TimepickerUI, PluginRegistry } from 'timepicker-ui';
import { WheelPlugin } from 'timepicker-ui/plugins/wheel';

PluginRegistry.register(WheelPlugin);

const picker = new TimepickerUI(input, {
  ui: { mode: 'wheel' },
  clock: { showSeconds: true }
});
picker.create();`}
          options={{
            ui: { mode: "wheel" },
            clock: { showSeconds: true },
          }}
          plugins={["wheel"]}
        />
      </Section>

      <Section icon={Layers} title="Compact Wheel Popover with Seconds">
        <p className="text-muted-foreground mb-4">
          Columns <code>HH : MM : SS</code> in a popover. With{" "}
          <code>placement: &apos;auto&apos;</code> it opens below the input
          when there is room, otherwise above.
        </p>
        <TimepickerExample
          code={`import { TimepickerUI, PluginRegistry } from 'timepicker-ui';
import { WheelPlugin } from 'timepicker-ui/plugins/wheel';

PluginRegistry.register(WheelPlugin);

const picker = new TimepickerUI(input, {
  ui: { mode: 'compact-wheel' },
  clock: { type: '24h', showSeconds: true, incrementSeconds: 5 },
  wheel: { placement: 'auto' }
});
picker.create();`}
          options={{
            ui: { mode: "compact-wheel" },
            clock: { type: "24h", showSeconds: true, incrementSeconds: 5 },
            wheel: { placement: "auto" },
          }}
          plugins={["wheel"]}
          inputPlaceholder="Click to open popover"
        />
      </Section>

      <Section icon={Ban} title="Disabled Seconds">
        <p className="text-muted-foreground mb-4">
          <code>disabledTime.seconds</code> blocks the same seconds in every
          minute. Here :55 to :59 cannot be picked.
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  clock: {
    showSeconds: true,
    disabledTime: {
      seconds: [55, 56, 57, 58, 59]
    }
  }
});
picker.create();`}
          options={{
            clock: {
              showSeconds: true,
              disabledTime: { seconds: [55, 56, 57, 58, 59] },
            },
          }}
        />
      </Section>

      <Section icon={Ban} title="Disabled Range with Seconds">
        <p className="text-muted-foreground mb-4">
          Blocks 10:00:30 AM up to and including 10:05:59 AM. Minute 10:00
          stays selectable for seconds :00 to :29.
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  clock: {
    type: '12h',
    showSeconds: true,
    disabledTime: {
      ranges: '10:00:30 AM - 10:05 AM'
    }
  }
});
picker.create();`}
          options={{
            clock: {
              type: "12h",
              showSeconds: true,
              disabledTime: { ranges: "10:00:30 AM - 10:05 AM" },
            },
          }}
        />
      </Section>

      <Section icon={ArrowLeftRight} title="Range with Seconds">
        <p className="text-muted-foreground mb-4">
          <code>range:confirm</code> carries <code>durationSeconds</code>.{" "}
          <code>minDuration</code> stays in minutes but is compared to the
          second, so this range must be at least 60 seconds long.
        </p>
        <TimepickerExample
          code={`import { TimepickerUI, PluginRegistry } from 'timepicker-ui';
import { RangePlugin } from 'timepicker-ui/plugins/range';

PluginRegistry.register(RangePlugin);

const picker = new TimepickerUI(input, {
  clock: { type: '24h', showSeconds: true },
  range: { enabled: true, minDuration: 1 },
  callbacks: {
    onRangeConfirm: (data) => {
      console.log(data.from, data.to, data.durationSeconds);
    }
  }
});
picker.create();`}
          options={{
            clock: { type: "24h", showSeconds: true },
            range: { enabled: true, minDuration: 1 },
          }}
          plugins={["range"]}
          inputPlaceholder="Select time range"
        />
      </Section>

      <Section icon={Smartphone} title="Keyboard View">
        <p className="text-muted-foreground mb-4">
          Three editable fields, each with a caption. The captions here are in
          Polish. The seconds caption comes from <code>labels.second</code>.
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: { initialView: 'keyboard' },
  clock: { type: '24h', showSeconds: true },
  labels: {
    keyboardTitle: 'Wpisz godzinę',
    hour: 'Godzina',
    minute: 'Minuta',
    second: 'Sekunda',
    cancel: 'Anuluj'
  }
});
picker.create();`}
          options={{
            ui: { initialView: "keyboard" },
            clock: { type: "24h", showSeconds: true },
            labels: {
              keyboardTitle: "Wpisz godzinę",
              hour: "Godzina",
              minute: "Minuta",
              second: "Sekunda",
              cancel: "Anuluj",
            },
          }}
        />
      </Section>
    </div>
  );
}
