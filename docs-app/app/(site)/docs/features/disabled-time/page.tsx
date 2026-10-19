import { CodeBlock } from "@/components/code-block";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Disabled Time",
  description:
    "Disable specific hours, minutes or time ranges in timepicker-ui to restrict selectable times. Zero-dependency, framework-agnostic, accessible and SSR-safe.",
  path: "/docs/features/disabled-time",
});

export default function DisabledTimePage() {
  return (
    <div>
      <PageHeader
        title="Disabled Time"
        description="Restrict time selection by disabling specific hours, minutes, seconds or time ranges"
      />

      <Section
        title="How does disabling times work in timepicker-ui?"
        description="Add a clock.disabledTime config to block specific hours, minutes, seconds or time ranges. Blocked values are dimmed and cannot be picked on the clock face or the wheel. Arrow keys skip them, and OK stays disabled while the shown time is blocked."
      >
        <p>
          The disabled time feature allows you to prevent users from selecting
          certain time values. This is useful for business hours restrictions,
          appointment scheduling, or any scenario where only specific times
          should be selectable.
        </p>
        <ul>
          <li>Disable specific hours (e.g., after business hours)</li>
          <li>
            Disable specific minutes (e.g., only allow :00, :15, :30, :45)
          </li>
          <li>
            Disable specific seconds with{" "}
            <code>clock.disabledTime.seconds</code> when{" "}
            <code>clock.showSeconds</code> is on
          </li>
          <li>
            Set minute steps (e.g., 5, 10, 15 minute increments)
          </li>
          <li>Visual indicators show disabled times</li>
        </ul>
      </Section>

      <Section
        title="How do I disable specific hours?"
        description="Pass an array of hours to clock.disabledTime.hours. With clock: { type: '24h', disabledTime: { hours: [0, 1, 2, 3, 4, 5, 6, 7, 8] } }, only hours 9 to 23 can be selected. In 12-hour mode, the default, the list takes values 1 to 12 and blocks each listed hour in both AM and PM."
      >
        <p>
          Restrict which hours can be selected by providing an array of hour
          values:
        </p>
        <h3>Business Hours (9 AM - 5 PM)</h3>
        <CodeBlock
          code={`const picker = new TimepickerUI(input, {
  clock: {
    type: '24h',
    disabledTime: {
      hours: [0, 1, 2, 3, 4, 5, 6, 7, 8, 18, 19, 20, 21, 22, 23]
    }
  }
});

picker.create();`}
          language="typescript"
        />
        <p>
          Only hours 9 to 17 can be selected. In 12-hour mode{" "}
          <code>hours</code> takes values 1 to 12 and blocks that hour in
          both AM and PM, so use <code>clock.type: &apos;24h&apos;</code>{" "}
          to block by time of day.
        </p>

        <h3>Night Time Only</h3>
        <CodeBlock
          code={`const picker = new TimepickerUI(input, {
  clock: {
    type: '24h',
    disabledTime: {
      hours: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
    }
  }
});

picker.create();`}
          language="typescript"
        />
        <p>
          Only allows selection from 10 PM to 5 AM.
        </p>
      </Section>

      <Section
        title="How do I limit which minutes can be selected?"
        description="List the minutes to block in clock.disabledTime.minutes, or set clock.incrementMinutes to a step like 15 so only 0, 15, 30 and 45 are offered."
      >
        <p>
          Control which minute values are available:
        </p>
        <h3>Quarter Hour Intervals</h3>
        <CodeBlock
          code={`const picker = new TimepickerUI(input, {
  clock: {
    disabledTime: {
      minutes: Array.from({ length: 60 }, (_, i) => i)
        .filter(m => ![0, 15, 30, 45].includes(m))
    }
  }
});

picker.create();`}
          language="typescript"
        />
        <p>
          Only :00, :15, :30, and :45 minutes will be selectable.
        </p>

        <h3>Using Minute Increments</h3>
        <CodeBlock
          code={`const picker = new TimepickerUI(input, {
  clock: {
    incrementMinutes: 15  // Only show minutes in 15-minute steps
  }
});

picker.create();`}
          language="typescript"
        />
        <p>
          <code>clock.incrementMinutes</code>{" "}
          limits selection to 15-minute steps (0, 15, 30, 45).
        </p>

        <h3>5-Minute Intervals</h3>
        <CodeBlock
          code={`const picker = new TimepickerUI(input, {
  clock: {
    incrementMinutes: 5  // Show minutes in 5-minute steps
  }
});

picker.create();`}
          language="typescript"
        />
        <p>
          Minutes: 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55
        </p>
      </Section>

      <Section title="Combined Restrictions">
        <p>
          Combine hour and minute restrictions for precise control:
        </p>
        <h3>Business Hours with Ranges</h3>
        <p>
          When <code>ranges</code> is set, the <code>hours</code>,{" "}
          <code>minutes</code> and <code>seconds</code> lists are ignored,
          so express the whole rule as ranges.
        </p>
        <CodeBlock
          code={`const picker = new TimepickerUI(input, {
  clock: {
    type: '24h',
    disabledTime: {
      ranges: ['00:00 - 08:59', '12:00 - 12:59', '18:00 - 23:59']
    }
  }
});

picker.create();

// Result: 09:00-11:59 and 13:00-17:59 can be selected`}
          language="typescript"
        />
        <p>
          Range edges are inclusive, and an edge without seconds covers its
          whole minute, so <code>&apos;12:00 - 12:59&apos;</code> blocks
          12:00:00 to 12:59:59. Ranges must not overlap.
        </p>

        <h3>Hours and Minutes Together</h3>
        <CodeBlock
          code={`const picker = new TimepickerUI(input, {
  clock: {
    type: '24h',
    disabledTime: {
      hours: [0, 1, 2, 3, 4, 5, 6, 7, 8, 20, 21, 22, 23],
      minutes: Array.from({ length: 60 }, (_, i) => i)
        .filter(m => ![0, 15, 30, 45].includes(m))
    }
  }
});

picker.create();

// Hours 9-19, minutes :00, :15, :30 and :45`}
          language="typescript"
        />
        <p>
          The <code>minutes</code> list applies to every hour. To block
          different minutes in different hours, use{" "}
          <code>ranges</code>.
        </p>
      </Section>

      <Section title="Dynamic Restrictions">
        <p>
          Change disabled times dynamically based on user actions or external
          data:
        </p>
        <CodeBlock
          code={`const input = document.querySelector('#timepicker');
const picker = new TimepickerUI(input, {
  clock: { type: '24h' }
});

// Initial creation with no restrictions
picker.create();

// Update to add restrictions (e.g., after selecting a date)
function updateTimeRestrictions(selectedDate) {
  const isWeekend = [0, 6].includes(selectedDate.getDay());

  const restrictions = isWeekend
    ? { hours: [] }  // No restrictions on weekends
    : { hours: [0, 1, 2, 3, 4, 5, 6, 7, 8, 18, 19, 20, 21, 22, 23] };  // Business hours

  picker.setOptions({
    clock: {
      disabledTime: restrictions
    }
  });
}

// Listen for date changes
dateInput.addEventListener('change', (e) => {
  updateTimeRestrictions(new Date(e.target.value));
});`}
          language="typescript"
        />
      </Section>

      <Section title="Disable with a function">
        <p>
          When the rule does not fit lists or ranges, pass{" "}
          <code>clock.isTimeDisabled</code>. It gets a{" "}
          <code>TimeOfDay</code>, <code>&#123; hour, minutes, seconds &#125;</code>,
          and returns <code>true</code> to disable that time. <code>hour</code>{" "}
          is 0 to 23 in both clock types, and <code>seconds</code> is 0 unless{" "}
          <code>clock.showSeconds</code> is on.
        </p>
        <CodeBlock
          code={`const picker = new TimepickerUI(input, {
  clock: {
    type: '24h',
    isTimeDisabled: ({ hour }) => hour < 9 || hour >= 17
  }
});

picker.create();`}
          language="typescript"
        />
        <ul>
          <li>
            The function is combined with <code>clock.disabledTime</code> as a
            union. A time is disabled when either one disables it.
          </li>
          <li>
            An hour or a minute is disabled when every time inside it is
            disabled.
          </li>
          <li>
            It applies to the clock face, the wheel, arrow-key skipping, typed
            input and the OK button. The compact-wheel mode never blocks OK, a
            known limitation.
          </li>
          <li>
            If the function throws, that time counts as enabled and the error
            is rethrown asynchronously.
          </li>
        </ul>

        <h3>Refresh after the data changes</h3>
        <p>
          Results are cached. When the data behind the function changes, call{" "}
          <code>refreshDisabledTime()</code>. It clears the cache and updates
          the disabled marks and the OK button without a re-render. It does
          not write to the input. Calling it while the picker is closed is
          safe, because the next open uses fresh results.
        </p>
        <CodeBlock
          code={`let lunchBreak = false;

const picker = new TimepickerUI(input, {
  clock: {
    type: '24h',
    isTimeDisabled: ({ hour }) => {
      if (hour < 9 || hour >= 17) return true;
      return lunchBreak && hour === 12;
    }
  }
});

picker.create();

lunchBreak = true;
picker.refreshDisabledTime();`}
          language="typescript"
        />
        <p>
          See the{" "}
          <Link href="/examples/features/disabled-time">live example</Link>.
        </p>
      </Section>

      <Section title="Visual Styling">
        <p>
          Disabled values are dimmed and cannot be clicked. On the clock face
          the library adds <code>tp-ui-tips-disabled</code> to the number. In
          the wheel modes it adds <code>is-disabled</code> to the wheel item.
        </p>
        <h3>Default Disabled Styling</h3>
        <CodeBlock
          code={`/* Clock face numbers */
.tp-ui-tips-disabled {
  color: var(--tp-text-disabled);
  pointer-events: none;
}

/* Wheel and compact-wheel items (wheel plugin) */
.tp-ui-wheel-item.is-disabled {
  opacity: var(--tp-wheel-disabled-opacity); /* 0.38 by default */
  pointer-events: none;
}`}
          language="css"
        />
        <p>
          In forced-colors mode, disabled clock numbers use the system{" "}
          <code>GrayText</code> color.
        </p>

        <h3>Custom Disabled Colors</h3>
        <p>
          Change the tokens instead of overriding the rules. Add a class
          with <code>{"ui: { cssClass: 'my-theme' }"}</code>. The picker
          puts it on <code>.tp-ui-wrapper</code> when it opens.
        </p>
        <CodeBlock
          code={`.tp-ui-wrapper.my-theme {
  --tp-text-disabled: rgba(29, 27, 32, 0.38); /* clock numbers */
  --tp-wheel-disabled-opacity: 0.3;           /* wheel items */
}`}
          language="css"
        />
      </Section>

      <dl>
        <div>
          <dt>Validation Best Practices</dt>
          <dd>
            When using disabled time, make sure to also implement server-side
            validation. Client-side restrictions can be bypassed, so always
            validate the submitted time values on your backend to ensure they
            meet your business rules.
          </dd>
          <dd>
            <Link href="/docs/features/validation">Learn about validation</Link>
          </dd>
        </div>
      </dl>
    </div>
  );
}
