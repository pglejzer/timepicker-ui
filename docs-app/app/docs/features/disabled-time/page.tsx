import { CodeBlock } from "@/components/code-block";
import { Section } from "@/components/section";
import { LinkCard } from "@/components/link-card";
import { Ban, Clock, Calendar, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Disabled Time - Timepicker-UI",
  description: "Disable specific hours, minutes, or time intervals",
};

export default function DisabledTimePage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Disabled Time
        </h1>
        <p className="text-lg text-muted-foreground">
          Restrict time selection by disabling specific hours, minutes, or
          intervals
        </p>
      </div>

      <Section icon={Ban} title="Overview">
        <p className="text-muted-foreground mb-4">
          The disabled time feature allows you to prevent users from selecting
          certain time values. This is useful for business hours restrictions,
          appointment scheduling, or any scenario where only specific times
          should be selectable.
        </p>
        <div className="rounded-lg border border-border bg-card p-6">
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Disable specific hours (e.g., after business hours)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>
                Disable specific minutes (e.g., only allow :00, :15, :30, :45)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>
                Set minute intervals (e.g., 5, 10, 15 minute increments)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Visual indicators show disabled times</span>
            </li>
          </ul>
        </div>
      </Section>

      <Section icon={Clock} title="Disable Hours">
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
  disabledTime: {
    hours: [0, 1, 2, 3, 4, 5, 6, 7, 8]
  }
});

picker.create();`}
              language="typescript"
            />
            <p className="text-sm text-muted-foreground mt-3">
              Only hours 9-17 (9 AM to 5 PM) will be selectable.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Night Time Only
            </h3>
            <CodeBlock
              code={`const picker = new TimepickerUI(input, {
  clockType: '24h',
  disabledTime: {
    hours: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
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

      <Section icon={Calendar} title="Disable Minutes">
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
  disabledTime: {
    minutes: Array.from({ length: 60 }, (_, i) => i)
      .filter(m => ![0, 15, 30, 45].includes(m))
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
              Using Minute Interval Helper
            </h3>
            <CodeBlock
              code={`const picker = new TimepickerUI(input, {
  disabledTime: {
    interval: 15  // Only show minutes in 15-minute intervals
  }
});

picker.create();`}
              language="typescript"
            />
            <p className="text-sm text-muted-foreground mt-3">
              Shorthand for 15-minute intervals (0, 15, 30, 45).
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              5-Minute Intervals
            </h3>
            <CodeBlock
              code={`const picker = new TimepickerUI(input, {
  disabledTime: {
    interval: 5  // Show minutes in 5-minute intervals
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
              Business Hours with Intervals
            </h3>
            <CodeBlock
              code={`const picker = new TimepickerUI(input, {
  disabledTime: {
    hours: [0, 1, 2, 3, 4, 5, 6, 7, 8, 18, 19, 20, 21, 22, 23],
    interval: 30  // 30-minute intervals
  }
});

picker.create();

// Result: Can only select 9:00, 9:30, 10:00, 10:30... until 17:00, 17:30`}
              language="typescript"
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Custom Minutes per Hour
            </h3>
            <CodeBlock
              code={`const picker = new TimepickerUI(input, {
  disabledTime: {
    hours: [0, 1, 2, 3, 4, 5, 6, 7, 8, 20, 21, 22, 23],
    minutes: [5, 10, 20, 25, 35, 40, 50, 55]
  }
});

// Only allows minutes: 0, 15, 30, 45 during hours 9-19`}
              language="typescript"
            />
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
const picker = new TimepickerUI(input);

// Initial creation with no restrictions
picker.create();

// Update to add restrictions (e.g., after selecting a date)
function updateTimeRestrictions(selectedDate) {
  const isWeekend = [0, 6].includes(selectedDate.getDay());
  
  const restrictions = isWeekend
    ? { hours: [] }  // No restrictions on weekends
    : { hours: [0, 1, 2, 3, 4, 5, 6, 7, 8, 18, 19, 20, 21, 22, 23] };  // Business hours

  picker.update({
    options: {
      disabledTime: restrictions
    },
    create: true
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
          Disabled times are automatically styled to be visually distinct:
        </p>
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Default Disabled Styling
            </h3>
            <CodeBlock
              code={`.timepicker-ui-clock-face__clock-hand[disabled],
.timepicker-ui-minutes__minute[disabled],
.timepicker-ui-hour__hour[disabled] {
  opacity: 0.3;
  cursor: not-allowed;
  pointer-events: none;
}

.timepicker-ui-minutes__minute[disabled]:hover,
.timepicker-ui-hour__hour[disabled]:hover {
  background-color: transparent;
}`}
              language="css"
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Custom Disabled Colors
            </h3>
            <CodeBlock
              code={`.timepicker-ui-minutes__minute[disabled],
.timepicker-ui-hour__hour[disabled] {
  opacity: 0.2;
  text-decoration: line-through;
  color: #ef4444;  /* Red to indicate disabled */
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
