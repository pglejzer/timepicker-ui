"use client";

import { useEffect, useId, useRef } from "react";
import { TimepickerUI } from "timepicker-ui";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { CodeBlock } from "@/components/code-block";
import { Callout } from "@/components/callout";
import { Figure } from "@/components/figure";
import demo from "@/components/demo-controls.module.css";
import styles from "./page.module.css";

type ButtonFieldDemoProps = {
  label: string;
  placeholder: string;
  openValue: string;
  iconSide: "left" | "right";
  clockType: "12h" | "24h";
};

function ButtonFieldDemo({
  label,
  placeholder,
  openValue,
  iconSide,
  clockType,
}: ButtonFieldDemoProps) {
  const fieldId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const picker = new TimepickerUI(wrapperRef.current, {
      clock: { type: clockType },
      behavior: { returnFocus: true },
    });
    picker.create();

    return () => picker.destroy();
  }, [clockType]);

  const iconOnLeft = iconSide === "left";

  const button = (
    <button type="button" data-open={openValue} className={demo.button}>
      Choose time
    </button>
  );

  return (
    <Figure>
      <div className={styles.stage}>
        <label htmlFor={fieldId} className={demo.label}>
          {label}
        </label>
        <div ref={wrapperRef} className={styles.field}>
          {iconOnLeft && button}
          <input
            id={fieldId}
            type="text"
            placeholder={placeholder}
            className={demo.input}
          />
          {!iconOnLeft && button}
        </div>
      </div>
    </Figure>
  );
}

export default function OpenFromButtonPage() {
  return (
    <div>
      <PageHeader
        title="Open From a Button"
        description="Open the picker from an icon button next to the field. The field stays a normal text input, so the time can also be typed."
      />

      <Callout title="Version">
        This setup needs timepicker-ui 4.5.0 or later.
      </Callout>

      <Section title="Icon on the Right (12h)">
        <p>
          Pass the wrapper to the constructor, not the input. The wrapper
          becomes the picker root, and the <code>data-open</code> button inside
          it opens the picker. A click on the field does not.
        </p>
        <ButtonFieldDemo
          label="Meeting time"
          placeholder="Type a time, e.g. 02:30 PM"
          openValue="meeting-time"
          iconSide="right"
          clockType="12h"
        />
        <h3>HTML</h3>
        <CodeBlock
          code={`<label for="meeting-time">Meeting time</label>
<div class="time-field" id="meeting-time-field">
  <input id="meeting-time" type="text" />
  <button type="button" data-open="meeting-time" aria-label="Choose time">
    <svg aria-hidden="true"><!-- clock icon --></svg>
  </button>
</div>`}
          language="html"
        />
        <h3>JavaScript</h3>
        <CodeBlock
          code={`import { TimepickerUI } from 'timepicker-ui';

const wrapper = document.querySelector('#meeting-time-field');
const picker = new TimepickerUI(wrapper, {
  behavior: { returnFocus: true }
});
picker.create();`}
          language="typescript"
        />
      </Section>

      <Section title="Icon on the Left (24h)">
        <p>
          The same setup with <code>clock: {"{ type: '24h' }"}</code>. The
          button comes before the input in the markup, so the Tab order matches
          what you see.
        </p>
        <ButtonFieldDemo
          label="Departure time"
          placeholder="Type a time, e.g. 14:30"
          openValue="departure-time"
          iconSide="left"
          clockType="24h"
        />
        <h3>HTML</h3>
        <CodeBlock
          code={`<label for="departure-time">Departure time</label>
<div class="time-field time-field--icon-left" id="departure-time-field">
  <button type="button" data-open="departure-time" aria-label="Choose time">
    <svg aria-hidden="true"><!-- clock icon --></svg>
  </button>
  <input id="departure-time" type="text" />
</div>`}
          language="html"
        />
        <h3>JavaScript</h3>
        <CodeBlock
          code={`import { TimepickerUI } from 'timepicker-ui';

const wrapper = document.querySelector('#departure-time-field');
const picker = new TimepickerUI(wrapper, {
  clock: { type: '24h' },
  behavior: { returnFocus: true }
});
picker.create();`}
          language="typescript"
        />
      </Section>

      <Section title="Placing the Icon">
        <p>
          Position the button with your own CSS. For example:
        </p>
        <CodeBlock
          code={`.time-field {
  position: relative;
}

.time-field input {
  width: 100%;
  padding-right: 3rem;
}

.time-field button {
  position: absolute;
  top: 50%;
  right: 0.25rem;
  transform: translateY(-50%);
}

.time-field--icon-left input {
  padding-right: 1rem;
  padding-left: 3rem;
}

.time-field--icon-left button {
  right: auto;
  left: 0.25rem;
}`}
          language="css"
        />
      </Section>

      <Section title="React">
        <p>
          Put a ref on the wrapper and create the picker in an effect, so it
          only runs in the browser:
        </p>
        <CodeBlock
          code={`import { useEffect, useId, useRef } from 'react';
import { TimepickerUI } from 'timepicker-ui';
import { Clock } from 'lucide-react';

export function MeetingTimeField() {
  const id = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const picker = new TimepickerUI(wrapperRef.current, {
      behavior: { returnFocus: true }
    });
    picker.create();

    return () => picker.destroy();
  }, []);

  return (
    <>
      <label htmlFor={id}>Meeting time</label>
      <div ref={wrapperRef} className="time-field">
        <input id={id} type="text" />
        <button type="button" data-open="meeting-time" aria-label="Choose time">
          <Clock aria-hidden="true" />
        </button>
      </div>
    </>
  );
}`}
          language="tsx"
        />
      </Section>

      <Section title="Notes">
        <ul>
          <li>
            Only the button opens the picker. The field can be typed in, and
            the picker reads the typed value when it opens.
          </li>
          <li>
            Use a real <code>&lt;button type=&quot;button&quot;&gt;</code>. It
            also opens the picker with Enter and Space, and inside a form{" "}
            <code>type=&quot;button&quot;</code> keeps it from submitting the
            form.
          </li>
          <li>
            An icon-only button has no text, so give it an{" "}
            <code>aria-label</code> such as <code>&quot;Choose time&quot;</code>.
          </li>
          <li>
            <code>behavior.returnFocus: true</code> moves focus back to the
            field after the picker closes.
          </li>
          <li>
            Every element in the wrapper with the same <code>data-open</code>{" "}
            value as the first one opens the picker.
          </li>
        </ul>
      </Section>
    </div>
  );
}
