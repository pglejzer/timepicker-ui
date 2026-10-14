import { CodeBlock } from "@/components/code-block";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { LinkCard } from "@/components/link-card";
import { Ban, Clock, Calendar, AlertCircle, Check } from "lucide-react";

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
        eyebrow="Feature"
      />

      <Section
        icon={Ban}
        title="How does disabling times work in timepicker-ui?"
        description="Add a clock.disabledTime config to block specific hours, minutes, seconds or time ranges. Blocked values are dimmed and cannot be picked on the clock face or the wheel. Arrow keys skip them, and OK stays disabled while the shown time is blocked."
      >
        <p className="text-muted-foreground mb-4">
          The disabled time feature allows you to prevent users from selecting
          certain time values. This is useful for business hours restrictions,
          appointment scheduling, or any scenario where only specific times
          should be selectable.
        </p>
        <div className="rounded-lg border border-border bg-card p-6">
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>Disable specific hours (e.g., after business hours)</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                Disable specific minutes (e.g., only allow :00, :15, :30, :45)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                Disable specific seconds with{" "}
                <code>clock.disabledTime.seconds</code> when{" "}
                <code>clock.showSeconds</code> is on
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                Set minute steps (e.g., 5, 10, 15 minute increments)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>Visual indicators show disabled times</span>
            </li>
          </ul>
        </div>
      </Section>

      <Section
        icon={Clock}
        title="How do I disable specific hours?"
        description="Pass an array of hours to clock.disabledTime.hours. With clock: { type: '24h', disabledTime: { hours: [0, 1, 2, 3, 4, 5, 6, 7, 8] } }, only hours 9 to 23 can be selected. In 12-hour mode, the default, the list takes values 1 to 12 and blocks each listed hour in both AM and PM."
      >
        <p className="text-muted-foreground mb-4">
          Restrict which hours can be selected by providing an array of hour
          values:
        </p>
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Business Hours (9 AM - 5 PM)
            </h3>
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
            <p className="text-sm text-muted-foreground mt-3">
              Only hours 9 to 17 can be selected. In 12-hour mode{" "}
              <code>hours</code> takes values 1 to 12 and blocks that hour in
              both AM and PM, so use <code>clock.type: &apos;24h&apos;</code>{" "}
              to block by time of day.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Night Time Only
            </h3>
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
            <p className="text-sm text-muted-foreground mt-3">
              Only allows selection from 10 PM to 5 AM.
            </p>
          </div>
        </div>
      </Section>

      <Section
        icon={Calendar}
        title="How do I limit which minutes can be selected?"
        description="List the minutes to block in clock.disabledTime.minutes, or set clock.incrementMinutes to a step like 15 so only 0, 15, 30 and 45 are offered."
      >
        <p className="text-muted-foreground mb-4">
          Control which minute values are available:
        </p>
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Quarter Hour Intervals
            </h3>
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
            <p className="text-sm text-muted-foreground mt-3">
              Only :00, :15, :30, and :45 minutes will be selectable.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Using Minute Increments
            </h3>
            <CodeBlock
              code={`const picker = new TimepickerUI(input, {
  clock: {
    incrementMinutes: 15  // Only show minutes in 15-minute steps
  }
});

picker.create();`}
              language="typescript"
            />
            <p className="text-sm text-muted-foreground mt-3">
              <code className="text-primary">clock.incrementMinutes</code>{" "}
              limits selection to 15-minute steps (0, 15, 30, 45).
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              5-Minute Intervals
            </h3>
            <CodeBlock
              code={`const picker = new TimepickerUI(input, {
  clock: {
    incrementMinutes: 5  // Show minutes in 5-minute steps
  }
});

picker.create();`}
              language="typescript"
            />
            <p className="text-sm text-muted-foreground mt-3">
              Minutes: 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55
            </p>
          </div>
        </div>
      </Section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6 text-foreground">
          Combined Restrictions
        </h2>
        <p className="text-muted-foreground mb-4">
          Combine hour and minute restrictions for precise control:
        </p>
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Business Hours with Ranges
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
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
            <p className="text-sm text-muted-foreground mt-3">
              Range edges are inclusive, and an edge without seconds covers its
              whole minute, so <code>&apos;12:00 - 12:59&apos;</code> blocks
              12:00:00 to 12:59:59. Ranges must not overlap.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Hours and Minutes Together
            </h3>
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
            <p className="text-sm text-muted-foreground mt-3">
              The <code>minutes</code> list applies to every hour. To block
              different minutes in different hours, use{" "}
              <code>ranges</code>.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6 text-foreground">
          Dynamic Restrictions
        </h2>
        <p className="text-muted-foreground mb-4">
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
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6 text-foreground">
          Visual Styling
        </h2>
        <p className="text-muted-foreground mb-4">
          Disabled values are dimmed and cannot be clicked. On the clock face
          the library adds <code>tp-ui-tips-disabled</code> to the number. In
          the wheel modes it adds <code>is-disabled</code> to the wheel item.
        </p>
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Default Disabled Styling
            </h3>
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
            <p className="text-sm text-muted-foreground mt-3">
              In forced-colors mode, disabled clock numbers use the system{" "}
              <code>GrayText</code> color.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Custom Disabled Colors
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
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
          </div>
        </div>
      </section>

      <LinkCard
        icon={AlertCircle}
        title="Validation Best Practices"
        description="When using disabled time, make sure to also implement server-side validation. Client-side restrictions can be bypassed, so always validate the submitted time values on your backend to ensure they meet your business rules."
        linkText="Learn about validation"
        linkHref="/docs/features/validation"
        variant="red"
      />
    </div>
  );
}
