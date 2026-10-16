import { CodeBlock } from "@/components/code-block";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { Callout } from "@/components/callout";
import { ApiTable } from "@/components/api-table";
import { JsonLdBreadcrumb } from "@/components/json-ld";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Seconds",
  description:
    "Add seconds to timepicker-ui with clock.showSeconds: HH:MM:SS values, a seconds face on the analog clock, a seconds wheel column and second-level disabled times.",
  path: "/docs/features/seconds",
});

type OptionRow = {
  name: string;
  type: string;
  default: string;
  description: string;
};

const secondsOptions: OptionRow[] = [
  {
    name: "clock.showSeconds",
    type: "boolean",
    default: "false",
    description:
      "Adds the seconds field, the seconds clock face and the seconds wheel column. Values become HH:MM:SS.",
  },
  {
    name: "clock.incrementSeconds",
    type: "1 | 5 | 10 | 15 | 20 | 30",
    default: "1",
    description:
      "Step for the seconds face, the seconds wheel column and the keyboard.",
  },
  {
    name: "clock.autoSwitchToSeconds",
    type: "boolean",
    default: "true",
    description:
      "After a minute is picked on the clock face, the face switches to seconds.",
  },
  {
    name: "clock.disabledTime.seconds",
    type: "Array<string | number>",
    default: "undefined",
    description: "Seconds (0 to 59) disabled in every minute.",
  },
  {
    name: "labels.second",
    type: "string",
    default: '"Second"',
    description:
      "Caption under the seconds field in the keyboard view, the field's accessible name, the name of the seconds wheel column and of the clock face while it shows seconds, and the prefix announced with the selected seconds.",
  },
  {
    name: "callbacks.onSelectSecond",
    type: "(data: SelectSecondEventData) => void",
    default: "undefined",
    description: "Runs on the select:second event with { seconds }.",
  },
];

function OptionsTable({ options }: { options: OptionRow[] }) {
  return (
    <ApiTable
      columns={[
        { key: "name", label: "Option" },
        { key: "type", label: "Type", mono: true },
        { key: "default", label: "Default", mono: true },
        { key: "description", label: "Description" },
      ]}
      rows={options.map((option) => ({
        id: option.name,
        name: <code>{option.name}</code>,
        type: option.type,
        default: <code>{option.default}</code>,
        description: option.description,
      }))}
      rowKey="id"
    />
  );
}

export default function SecondsPage() {
  return (
    <div>
      <JsonLdBreadcrumb pathname="/docs/features/seconds" />
      <PageHeader
        title="Seconds"
        description={
          <>
            Let users pick hours, minutes and seconds. Turn it on with{" "}
            <code>clock.showSeconds</code>. Added in 4.5.0.
          </>
        }
      />

      <Section
        title="How do I show seconds?"
        description={
          <>
            Set <code>clock.showSeconds</code> to <code>true</code>.
          </>
        }
      >
        <CodeBlock
          code={`const picker = new TimepickerUI(input, {
  clock: {
    showSeconds: true
  }
});
picker.create();`}
          language="typescript"
        />
        <h3>What changes:</h3>
        <ul>
          <li>The header gets a seconds field.</li>
          <li>The analog clock gets a seconds face.</li>
          <li>
            The <code>wheel</code> and <code>compact-wheel</code> modes get
            a seconds column.
          </li>
          <li>
            The input value, <code>getValue()</code> and the event payloads
            include seconds.
          </li>
        </ul>
        <p>
          <code>showSeconds</code> is off by default. When it is off, there is
          no seconds field, face or column, and the values,{" "}
          <code>getValue()</code> and the event payloads have no seconds.
        </p>
      </Section>

      <Section title="Which options control seconds?">
        <OptionsTable options={secondsOptions} />
        <CodeBlock
          code={`const picker = new TimepickerUI(input, {
  clock: {
    type: '24h',
    showSeconds: true,
    incrementSeconds: 5,
    autoSwitchToSeconds: true
  }
});
picker.create();`}
          language="typescript"
        />
      </Section>

      <Section title="What does the value look like?">
        <h3>24-hour</h3>
        <p>
          <code>HH:MM:SS</code>, for example <code>14:30:15</code>.
        </p>
        <CodeBlock
          code={`// clock: { type: '24h', showSeconds: true }
const value = picker.getValue();

// Output:
{
  hour: '14',
  minutes: '30',
  seconds: '15',
  type: undefined,
  time: '14:30:15',
  // degreesHours and degreesMinutes are still returned but deprecated
}`}
          language="typescript"
        />

        <h3>12-hour</h3>
        <p>
          <code>HH:MM:SS AM</code> or <code>HH:MM:SS PM</code>, for example{" "}
          <code>02:30:15 PM</code>. The hour is zero-padded. The period is
          always <code>AM</code> or <code>PM</code>, even if you translate{" "}
          <code>labels.am</code> and <code>labels.pm</code>.
        </p>
        <CodeBlock
          code={`// clock: { type: '12h', showSeconds: true }
const value = picker.getValue();

// Output:
{
  hour: '02',
  minutes: '30',
  seconds: '15',
  type: 'PM',
  time: '02:30:15 PM',
  // degreesHours and degreesMinutes are still returned but deprecated
}`}
          language="typescript"
        />

        <h3>Setting a value</h3>
        <p>
          <code>setValue()</code> accepts seconds. A value without seconds,
          typed or set, is read as <code>:00</code>. If{" "}
          <code>showSeconds</code> is off, seconds in the string are
          dropped. <code>clock.defaultTime: &apos;now&apos;</code> fills in
          the current seconds too.
        </p>
        <CodeBlock
          code={`// clock: { type: '24h', showSeconds: true }
picker.setValue('14:30:15');
picker.setValue('14:30');        // becomes 14:30:00

// clock: { type: '12h', showSeconds: true }
picker.setValue('2:30:15 PM');   // the input shows 02:30:15 PM`}
          language="typescript"
        />
      </Section>

      <Section title="How do seconds work in each mode?">
        <dl>
          <div>
            <dt>Clock</dt>
            <dd>
              The face goes hours, then minutes, then seconds. With{" "}
              <code>autoSwitchToSeconds</code> on (the default), picking a
              minute opens the seconds face. Click the seconds field in the
              header to open it at any time.
            </dd>
          </div>
          <div>
            <dt>Wheel</dt>
            <dd>
              Three columns: hours, minutes and seconds. In 12h, AM and PM stay
              in the header.
            </dd>
          </div>
          <div>
            <dt>Compact wheel</dt>
            <dd>
              Columns <code>HH : MM : SS</code>, plus <code>AM/PM</code> in
              12h. Keyboard navigation and <code>wheel.hideDisabled</code> cover
              the seconds column.
            </dd>
          </div>
          <div>
            <dt>Keyboard view</dt>
            <dd>
              Three editable fields, each with a caption. The seconds caption
              comes from <code>labels.second</code>.
            </dd>
          </div>
        </dl>
        <p>
          Every built-in theme styles the seconds field, face and column. The
          wheel modes need the wheel plugin:
        </p>
        <CodeBlock
          code={`import { TimepickerUI, PluginRegistry } from 'timepicker-ui';
import { WheelPlugin } from 'timepicker-ui/plugins/wheel';

PluginRegistry.register(WheelPlugin);

const picker = new TimepickerUI(input, {
  ui: { mode: 'compact-wheel' },
  clock: { type: '24h', showSeconds: true, incrementSeconds: 5 },
  wheel: { placement: 'auto' }
});
picker.create();`}
          language="typescript"
        />
      </Section>

      <Section title="How do I disable seconds?">
        <p>
          List the seconds to block in <code>clock.disabledTime.seconds</code>.
          They are blocked in every minute. The list is used only with{" "}
          <code>showSeconds</code>.
        </p>
        <CodeBlock
          code={`const picker = new TimepickerUI(input, {
  clock: {
    showSeconds: true,
    disabledTime: {
      seconds: [55, 56, 57, 58, 59]
    }
  }
});
picker.create();`}
          language="typescript"
        />

        <h3>Ranges with seconds</h3>
        <p>
          The edges of <code>clock.disabledTime.ranges</code> can carry
          seconds. This example blocks 10:00:30 AM up to and including
          10:05:59 AM:
        </p>
        <CodeBlock
          code={`const picker = new TimepickerUI(input, {
  clock: {
    type: '12h',
    showSeconds: true,
    disabledTime: {
      ranges: '10:00:30 AM - 10:05 AM'
    }
  }
});
picker.create();

// 24h, several ranges:
// ranges: ['12:00:00 - 12:00:30', '18:30 - 18:45:15']`}
          language="typescript"
        />
        <h3>How edges are read</h3>
        <ul>
          <li>Both edges are inclusive.</li>
          <li>
            An edge without seconds covers its whole minute. A start of{" "}
            <code>10:00</code> means <code>10:00:00</code>. An end of{" "}
            <code>12:30</code> means <code>12:30:59</code>. So a range
            written for 4.4.0 disables exactly the same minutes.
          </li>
          <li>An edge with seconds is exact.</li>
          <li>
            12h edges need <code>AM</code> or <code>PM</code>. 24h edges
            must not have them.
          </li>
          <li>
            Ranges must not overlap. Because an edge without seconds
            covers its whole minute, <code>&apos;10:00 - 10:05&apos;</code>{" "}
            and <code>&apos;10:05 - 10:10&apos;</code> overlap. Start the
            second one at <code>10:06</code>.
          </li>
          <li>
            Overnight ranges (start later than end) are not supported.
            Split them in two, for example{" "}
            <code>[&apos;22:00 - 23:59&apos;, &apos;00:00 - 06:00&apos;]</code>.
          </li>
          <li>
            When <code>ranges</code> is set, the <code>hours</code>,{" "}
            <code>minutes</code> and <code>seconds</code> lists are
            ignored.
          </li>
          <li>
            With seconds on, a minute is disabled only when all of its
            seconds fall inside a range, and an hour only when all of
            its minutes do. In the example above, minute 10:00 stays
            selectable because 10:00:00 to 10:00:29 are free.
          </li>
        </ul>

        <h3>Invalid ranges</h3>
        <p>
          A malformed or overlapping range is rejected and reported through
          the <code>error</code> event and <code>callbacks.onError</code>. On{" "}
          <code>create()</code>, the picker then does not open. On{" "}
          <code>setOptions()</code>, the previous options stay in place.
        </p>
        <CodeBlock
          code={`const picker = new TimepickerUI(input, {
  clock: {
    type: '24h',
    showSeconds: true,
    disabledTime: {
      ranges: '10:00 AM - 11:00 AM'   // AM/PM on a 24h clock: rejected
    }
  },
  callbacks: {
    onError: (data) => console.error(data.error)
  }
});
picker.create();`}
          language="typescript"
        />
      </Section>

      <Section title="How do seconds work with the range plugin?">
        <ul>
          <li>
            <code>range:confirm</code> and <code>range:validation</code>{" "}
            carry <code>durationSeconds</code>, the exact length in seconds.
          </li>
          <li>
            <code>duration</code> stays in whole minutes, rounded down.
          </li>
          <li>
            <code>range.minDuration</code> and <code>range.maxDuration</code>{" "}
            are still in minutes, but they are compared to the exact length.
            With <code>minDuration: 1</code>, a 59-second range is invalid
            and a 60-second range is valid.
          </li>
          <li>
            Empty From and To tabs show <code>--:--:--</code>.
          </li>
        </ul>
        <CodeBlock
          code={`import { TimepickerUI, PluginRegistry } from 'timepicker-ui';
import { RangePlugin } from 'timepicker-ui/plugins/range';

PluginRegistry.register(RangePlugin);

const picker = new TimepickerUI(input, {
  clock: { type: '24h', showSeconds: true },
  range: { enabled: true, minDuration: 1 },
  callbacks: {
    onRangeConfirm: (data) => {
      console.log(data.from, data.to);    // '14:00:00' '14:01:30'
      console.log(data.duration);         // 1
      console.log(data.durationSeconds);  // 90
    }
  }
});
picker.create();`}
          language="typescript"
        />
      </Section>

      <Section title="Which events carry seconds?">
        <ul>
          <li>
            <code>select:second</code> (and <code>onSelectSecond</code>) with{" "}
            <code>{"{ seconds }"}</code>. It fires when the seconds field or
            face is selected, and when the seconds wheel column stops on a
            value.
          </li>
          <li>
            <code>open</code>, <code>confirm</code> and <code>update</code>{" "}
            add a <code>seconds</code> field.
          </li>
          <li>
            <code>error</code> adds <code>inputSecond</code> when the
            input&apos;s seconds are invalid.
          </li>
        </ul>
        <p>
          These fields appear only when <code>showSeconds</code> is on.
        </p>
        <CodeBlock
          code={`picker.on('select:second', (data) => {
  console.log('Seconds:', data.seconds);
});

picker.on('confirm', (data) => {
  console.log(data.hour, data.minutes, data.seconds, data.type);
});`}
          language="typescript"
        />
      </Section>

      <Section title="How do I translate the seconds labels?">
        <p>
          One label covers seconds: <code>labels.second</code> is the caption
          in the keyboard view, the accessible name of the seconds field and
          wheel column, and the prefix of the announced value. A Polish
          example:
        </p>
        <CodeBlock
          code={`const picker = new TimepickerUI(input, {
  clock: { type: '24h', showSeconds: true },
  labels: {
    clockTitle: 'Wybierz godzinę',
    keyboardTitle: 'Wpisz godzinę',
    cancel: 'Anuluj',
    hour: 'Godzina',
    minute: 'Minuta',
    second: 'Sekunda'
  }
});
picker.create();`}
          language="typescript"
        />
      </Section>

      <Callout title="Version">
        Seconds need timepicker-ui 4.5.0 or later.
      </Callout>

      <dl>
        <div>
          <dt>Try it</dt>
          <dd>
            Live pickers with seconds in clock, wheel, compact-wheel and range
            modes.
          </dd>
          <dd>
            <Link href="/examples/features/seconds">
              Open the seconds examples
            </Link>
          </dd>
        </div>
      </dl>
    </div>
  );
}
