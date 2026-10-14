import { CodeBlock } from "@/components/code-block";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { LinkCard } from "@/components/link-card";
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Check,
} from "lucide-react";

export const metadata = buildMetadata({
  title: "Validation",
  description:
    "Validation in timepicker-ui - enforce allowed times, show inline errors and add custom rules. Zero-dependency, framework-agnostic, accessible and SSR-safe.",
  path: "/docs/features/validation",
});

export default function ValidationPage() {
  return (
    <div>
      <PageHeader
        title="Validation"
        description="Built-in validation with custom rules and error handling"
        eyebrow="Feature"
      />

      <Section icon={Shield} title="Built-in Validation">
        <p className="text-muted-foreground mb-4">
          The picker checks the value already in the input, the values people
          pick, and its own options:
        </p>
        <div className="rounded-lg border border-border bg-card p-6">
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                When the picker opens, it reads the input value. If it cannot
                read it, it shows <code>labels.invalidTimeFormat</code> after
                the input and emits <code>error</code>. An empty input is not
                an error.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                It reads <code>2:30 PM</code> or <code>02:30 pm</code> on a
                12-hour clock (the default) and <code>14:30</code> on a 24-hour
                clock. With <code>clock.showSeconds</code>, seconds are
                optional: <code>14:30:15</code>.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                Times blocked by <code>clock.disabledTime</code> are shown as
                disabled on the clock face and the wheel (or left out, with{" "}
                <code>wheel.hideDisabled</code>) and cannot be picked there.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                The hour and minute fields inside the picker keep typed values
                in range: hours 1-12 or 0-23, minutes 0-59.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                <code>create()</code> and <code>setOptions()</code> check{" "}
                <code>clock.disabledTime</code> and report invalid values
                through <code>error</code>.
              </span>
            </li>
          </ul>
        </div>
      </Section>

      <Section icon={CheckCircle} title="Valid Time Detection">
        <p className="text-muted-foreground mb-4">
          Read the selected time in <code>callbacks.onConfirm</code> or with{" "}
          <code>picker.on(&apos;confirm&apos;)</code>. Both run after the
          picker has written the new value to the input:
        </p>
        <CodeBlock
          code={`import { TimepickerUI } from 'timepicker-ui';

const picker = new TimepickerUI('#timepicker', {
  callbacks: {
    onConfirm: (data) => {
      console.log(data.hour, data.minutes, data.type); // 02 30 PM
    }
  }
});

picker.create();

picker.on('confirm', () => {
  console.log(picker.getValue().time); // 02:30 PM
});`}
          language="typescript"
        />
        <p className="text-muted-foreground mt-4">
          The payload has <code>hour</code> and <code>minutes</code>,{" "}
          <code>type</code> (<code>&apos;AM&apos;</code> or{" "}
          <code>&apos;PM&apos;</code>, <code>undefined</code> on a 24-hour
          clock) and, with <code>clock.showSeconds</code>,{" "}
          <code>seconds</code>. The time values are strings. With{" "}
          <code>wheel.commitOnScroll</code>, <code>confirm</code> also fires
          when a wheel stops scrolling, with <code>autoCommit: true</code>.
        </p>
        <p className="text-muted-foreground mt-2">
          The picker sets <code>input.value</code> directly and does not fire{" "}
          <code>input</code> or <code>change</code> events. A listener on the
          input only sees what people type into it, so check picked values in{" "}
          <code>onConfirm</code>.
        </p>
      </Section>

      <Section icon={AlertTriangle} title="Error Handling">
        <p className="text-muted-foreground mb-4">
          The <code>error</code> event and <code>callbacks.onError</code>{" "}
          report four kinds of problems: an input value the picker cannot
          read, a <code>setValue()</code> string that is not a time, invalid
          options, and a mode or feature whose plugin is not registered (for
          example <code>ui.mode: &apos;wheel&apos;</code> without{" "}
          <code>WheelPlugin</code>).
        </p>
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Invalid Input Detection
            </h3>
            <p className="text-muted-foreground mb-4">
              Each time the picker opens, it reads the input value. When it
              cannot, for example <code>25:00</code> on a 24-hour clock or{" "}
              <code>2:30</code> without AM/PM on a 12-hour clock, it adds the{" "}
              <code>tp-ui-invalid-format</code> class to the input, puts a
              message right after the input and emits <code>error</code>:
            </p>
            <CodeBlock
              code={`const picker = new TimepickerUI('#timepicker', {
  clock: { type: '24h' },
  labels: { invalidTimeFormat: 'Enter a time as HH:MM' },
  callbacks: {
    onError: (data) => {
      console.warn(data.error, data.inputHour, data.inputMinute);
    }
  }
});

picker.create();

// Input value '25:00', picker opened:
// Invalid 24h time. 25 0`}
              language="typescript"
            />
            <p className="text-muted-foreground mt-4 mb-4">
              The message the picker inserts after the input:
            </p>
            <CodeBlock
              code={`<div class="tp-ui-invalid-text" role="alert"><b>Enter a time as HH:MM</b></div>`}
              language="html"
            />
            <p className="text-muted-foreground mt-4">
              <code>role=&quot;alert&quot;</code> makes screen readers announce
              it. The text comes from <code>labels.invalidTimeFormat</code>{" "}
              (default <code>Invalid time format</code>). The picker still
              opens. The message and the class are removed when a time is
              confirmed or set with <code>setValue()</code>, and on the next
              open if the value can be read by then. With{" "}
              <code>range.enabled</code> this check is skipped.
            </p>
            <p className="text-muted-foreground mt-4">
              <code>setValue()</code> converts a time in the other clock
              format: <code>14:30</code> sets <code>02:30 PM</code> on a
              12-hour clock. A string that is not a time, such as{" "}
              <code>25:00</code> or <code>abc</code>, leaves the value and the
              input as they were and emits <code>error</code>. It does not add
              the class or the message.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Disabled Time Validation
            </h3>
            <p className="text-muted-foreground mb-4">
              <code>create()</code> and <code>setOptions()</code> check{" "}
              <code>clock.disabledTime</code>. An hour, minute or second out of
              range, or a time range that cannot be parsed or overlaps another,
              is reported through <code>error</code>:
            </p>
            <CodeBlock
              code={`const picker = new TimepickerUI('#timepicker', {
  clock: {
    disabledTime: { hours: [0, 22, 23] }
  },
  callbacks: {
    onError: (data) => console.error(data.error)
  }
});

picker.create();
// [TimepickerUI] Invalid hours or minutes in disabledTime option

console.log(picker.isDestroyed); // true`}
              language="typescript"
            />
            <p className="text-muted-foreground mt-4 mb-4">
              The default clock is 12-hour, where <code>hours</code> takes 1 to
              12, so <code>0</code>, <code>22</code> and <code>23</code> are
              rejected. Set <code>clock.type: &apos;24h&apos;</code> to use
              them. After a failed <code>create()</code> the picker is not set
              up and does not open. On a working picker, a failed{" "}
              <code>setOptions()</code> keeps the previous options:
            </p>
            <CodeBlock
              code={`const picker = new TimepickerUI('#meeting-time', {
  callbacks: {
    onError: (data) => console.error(data.error)
  }
});

picker.create();

picker.setOptions({
  clock: {
    disabledTime: {
      ranges: ['9:00 AM - 11:00 AM', '10:00 AM - 12:00 PM']
    }
  }
});
// Logs that the two ranges overlap; the previous options stay`}
              language="typescript"
            />
            <p className="text-muted-foreground mt-4">
              If you use <code>picker.on(&apos;error&apos;, ...)</code> instead
              of <code>callbacks.onError</code>, subscribe before{" "}
              <code>create()</code>, so the handler is in place when the
              options are checked.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Error Payload
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                <code>error</code>: a short English description, for example{" "}
                <code>Invalid 24h time.</code> Use it for logging. The text
                people see comes from <code>labels.invalidTimeFormat</code>.
              </li>
              <li>
                <code>inputHour</code>, <code>inputMinute</code>: the hour and
                minute read from the input.
              </li>
              <li>
                <code>inputSecond</code>: the seconds, only with{" "}
                <code>clock.showSeconds</code>.
              </li>
              <li>
                <code>inputType</code>: the AM/PM part as typed.
              </li>
              <li>
                <code>inputLength</code>: the length of the value, set when the
                AM/PM part or the length is wrong.
              </li>
            </ul>
            <p className="text-muted-foreground mt-4 text-sm">
              Which <code>input*</code> fields are set depends on what went
              wrong. Option, plugin and <code>setValue()</code> errors carry
              only <code>error</code>.{" "}
              <code>rejectedHour</code> and <code>rejectedMinute</code> are
              deprecated and always <code>undefined</code>.
            </p>
          </div>
        </div>
      </Section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6 text-foreground">
          Custom Validation Rules
        </h2>
        <p className="text-muted-foreground mb-4">
          <code>clock.disabledTime</code> covers fixed rules. For anything
          else, such as a limit that changes or a rule that depends on another
          field, check the value in <code>callbacks.onConfirm</code>. The input
          already holds the new value at that point, so you can clear it and
          show your own message. The picker closes either way.
        </p>
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Minimum Time Validation
            </h3>
            <CodeBlock
              code={`<label for="pickup-time">Pickup time</label>
<input id="pickup-time" type="text" aria-describedby="pickup-time-error" />
<p id="pickup-time-error" role="alert"></p>`}
              language="html"
            />
            <div className="mt-4">
              <CodeBlock
                code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector<HTMLInputElement>('#pickup-time')!;
const message = document.querySelector<HTMLElement>('#pickup-time-error')!;

function toMinutes(hour = '0', minutes = '0', type?: string): number {
  let h = Number(hour);
  if (type === 'PM' && h < 12) h += 12;
  if (type === 'AM' && h === 12) h = 0;
  return h * 60 + Number(minutes);
}

function showError(text: string): void {
  message.textContent = text;
  input.setAttribute('aria-invalid', 'true');
}

function clearError(): void {
  message.textContent = '';
  input.removeAttribute('aria-invalid');
}

const earliest = toMinutes('10', '30', 'AM');

const picker = new TimepickerUI(input, {
  callbacks: {
    onConfirm: ({ hour, minutes, type }) => {
      if (toMinutes(hour, minutes, type) < earliest) {
        input.value = '';
        showError('Pickup starts at 10:30 AM.');
        return;
      }
      clearError();
    }
  }
});

picker.create();`}
                language="typescript"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              <code>toMinutes</code> works for both clock types;{" "}
              <code>type</code> is <code>undefined</code> on a 24-hour clock.
              The message element has <code>role=&quot;alert&quot;</code>, so
              screen readers announce it when its text changes.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Time Range Validation
            </h3>
            <p className="text-muted-foreground mb-4">
              For a fixed window, use <code>clock.disabledTime.ranges</code>{" "}
              instead of a check after the fact. Times outside the window
              cannot be picked on the clock face or the wheel:
            </p>
            <CodeBlock
              code={`const picker = new TimepickerUI('#meeting-time', {
  clock: {
    type: '24h',
    disabledTime: {
      ranges: ['00:00 - 08:59', '17:01 - 23:59']
    }
  }
});

picker.create();`}
              language="typescript"
            />
            <p className="text-sm text-muted-foreground mt-3">
              Ranges include both ends, so this leaves 09:00 to 17:00. If
              people can type into the hour and minute fields (
              <code>ui.editable</code> or the keyboard view), also check the
              confirmed value as in the example above.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Date-Time Validation
            </h3>
            <CodeBlock
              code={`const dateInput = document.querySelector<HTMLInputElement>('#pickup-date')!;

const picker = new TimepickerUI(input, {
  clock: { type: '24h' },
  callbacks: {
    onConfirm: ({ hour, minutes }) => {
      if (!dateInput.value) {
        showError('Pick a date first.');
        return;
      }

      const [year, month, day] = dateInput.value.split('-').map(Number);
      const selected = new Date(year, month - 1, day, Number(hour), Number(minutes));

      if (selected.getTime() <= Date.now()) {
        input.value = '';
        showError('Pick a time later than now.');
        return;
      }

      clearError();
    }
  }
});

picker.create();`}
              language="typescript"
            />
            <p className="text-sm text-muted-foreground mt-3">
              <code>#pickup-date</code> is an{" "}
              <code>&lt;input type=&quot;date&quot;&gt;</code>, whose value is{" "}
              <code>YYYY-MM-DD</code>. <code>input</code>,{" "}
              <code>showError</code> and <code>clearError</code> come from the
              first example.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6 text-foreground">
          HTML5 Validation
        </h2>
        <p className="text-muted-foreground mb-4">
          Native form validation works on the input the picker is attached to.
          Use <code>type=&quot;text&quot;</code>. A{" "}
          <code>type=&quot;time&quot;</code> input only takes values like{" "}
          <code>14:30</code>, so it drops 12-hour values such as{" "}
          <code>02:30 PM</code>, and the browser adds its own time controls.{" "}
          <code>min</code>, <code>max</code> and <code>step</code> apply only
          to <code>type=&quot;time&quot;</code>. Use{" "}
          <code>clock.disabledTime</code> and{" "}
          <code>clock.incrementMinutes</code> instead.
        </p>
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Required Time Input
            </h3>
            <CodeBlock
              code={`<form>
  <label for="meeting-time">Meeting time</label>
  <input id="meeting-time" type="text" required />
  <button type="submit">Schedule</button>
</form>`}
              language="html"
            />
            <div className="mt-4">
              <CodeBlock
                code={`const picker = new TimepickerUI('#meeting-time', {
  clock: { type: '24h' }
});

picker.create();`}
                language="typescript"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              With <code>required</code>, the browser blocks the submit and
              shows its own message while the input is empty. No extra code is
              needed.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Custom Validation Messages
            </h3>
            <p className="text-muted-foreground mb-4">
              <code>setCustomValidity()</code> adds your own rule to the
              browser&apos;s check. Call it from <code>onConfirm</code> for
              picked values and from <code>change</code> for typed ones:
            </p>
            <CodeBlock
              code={`const input = document.querySelector<HTMLInputElement>('#meeting-time')!;

function checkBusinessHours(): void {
  const { hour, minutes } = picker.getValue();
  const total = Number(hour) * 60 + Number(minutes);
  const outside = total < 9 * 60 || total > 17 * 60;
  input.setCustomValidity(outside ? 'Business hours are 09:00 to 17:00.' : '');
}

const picker = new TimepickerUI(input, {
  clock: { type: '24h' },
  callbacks: { onConfirm: checkBusinessHours }
});

picker.create();

input.addEventListener('change', checkBusinessHours);`}
              language="typescript"
            />
            <p className="text-sm text-muted-foreground mt-3">
              During <code>onConfirm</code> the input already holds the
              confirmed time, so <code>getValue()</code> returns it. The
              browser shows the message when the form is submitted.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6 text-foreground">
          Visual Error States
        </h2>
        <p className="text-muted-foreground mb-4">
          When the picker cannot read the input value, it adds{" "}
          <code>tp-ui-invalid-format</code> to the input and inserts a{" "}
          <code>tp-ui-invalid-text</code> element after it.{" "}
          <code>main.css</code> gives the input a 2px border and colors its
          text and the message with <code>--tp-error</code>. The message text
          comes from <code>labels.invalidTimeFormat</code>.
        </p>
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Error Styling
            </h3>
            <CodeBlock
              code={`:root {
  --tp-error: #b3261e;
}

.tp-ui-invalid-format {
  border-radius: 8px;
}

.tp-ui-invalid-text {
  margin-top: 4px;
  font-size: 0.875rem;
}`}
              language="css"
            />
            <p className="text-sm text-muted-foreground mt-3">
              The message is text, so the error is not shown by color alone.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Complete Example
            </h3>
            <p className="text-muted-foreground mb-4">
              The picker&apos;s own check for values it cannot read, plus a
              rule of your own with its own message. Both states get the same
              border:
            </p>
            <CodeBlock
              code={`<div class="field">
  <label for="pickup-time">Pickup time</label>
  <input id="pickup-time" type="text" aria-describedby="pickup-time-error" />
  <p id="pickup-time-error" class="field-error" role="alert"></p>
</div>

<style>
  .field input {
    border: 2px solid #d1d5db;
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 16px;
  }

  .field input[aria-invalid='true'],
  .field input.tp-ui-invalid-format {
    border-color: #b3261e;
  }

  .field-error {
    margin-top: 4px;
    color: #b3261e;
    font-size: 0.875rem;
  }
</style>`}
              language="html"
            />
            <div className="mt-4">
              <CodeBlock
                code={`import { TimepickerUI } from 'timepicker-ui';
import 'timepicker-ui/main.css';

const input = document.querySelector<HTMLInputElement>('#pickup-time')!;
const message = document.querySelector<HTMLElement>('#pickup-time-error')!;

function setError(text: string): void {
  message.textContent = text;
  if (text) {
    input.setAttribute('aria-invalid', 'true');
  } else {
    input.removeAttribute('aria-invalid');
  }
}

const picker = new TimepickerUI(input, {
  clock: { type: '24h' },
  labels: { invalidTimeFormat: 'Enter a time as HH:MM' },
  callbacks: {
    onConfirm: ({ hour, minutes }) => {
      const total = Number(hour) * 60 + Number(minutes);
      if (total < 10 * 60 + 30) {
        input.value = '';
        setError('Pickup starts at 10:30.');
        return;
      }
      setError('');
    },
    onError: (data) => console.warn(data.error)
  }
});

picker.create();`}
                language="typescript"
              />
            </div>
          </div>
        </div>
      </section>

      <LinkCard
        icon={XCircle}
        title="Server-Side Validation"
        description="Check the time again on your server. Anything that runs in the browser, including clock.disabledTime and the checks on this page, can be bypassed."
        linkText="Learn about events"
        linkHref="/docs/api/events"
        variant="blue"
      />
    </div>
  );
}
