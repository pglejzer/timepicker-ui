"use client";

import { useEffect, useId, useRef } from "react";
import { TimepickerUI } from "timepicker-ui";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { CodeBlock } from "@/components/code-block";
import { InfoBox } from "@/components/info-box";
import {
  Atom,
  Clock,
  ListChecks,
  MousePointerClick,
  Palette,
} from "lucide-react";

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
    <button
      type="button"
      data-open={openValue}
      aria-label="Choose time"
      className={`absolute top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring ${
        iconOnLeft ? "left-1" : "right-1"
      }`}
    >
      <Clock className="h-4 w-4" aria-hidden="true" />
    </button>
  );

  return (
    <div className="bench-in mb-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/30 px-3 py-2">
        <span className="eyebrow">Preview</span>
        <span className="eyebrow hidden sm:inline">Live</span>
      </div>
      <div className="@container">
        <div className="relative overflow-hidden bg-muted/20 p-5 @sm:p-8 @md:p-10">
          <div
            className="bp-grid pointer-events-none absolute inset-0 opacity-[0.35]"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-sm">
            <label htmlFor={fieldId} className="eyebrow mb-2 block">
              {label}
            </label>
            <div ref={wrapperRef} className="relative">
              {iconOnLeft && button}
              <input
                id={fieldId}
                type="text"
                placeholder={placeholder}
                className={`w-full rounded-lg border border-border bg-background py-2.5 text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-ring/25 ${
                  iconOnLeft ? "pl-12 pr-4" : "pl-4 pr-12"
                }`}
              />
              {!iconOnLeft && button}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OpenFromButtonPage() {
  return (
    <div>
      <PageHeader
        title="Open From a Button"
        description="Open the picker from an icon button next to the field. The field stays a normal text input, so the time can also be typed."
        eyebrow="Example · Features"
      />

      <InfoBox title="Version" variant="blue" className="mb-8">
        This setup needs timepicker-ui 4.5.0 or later.
      </InfoBox>

      <Section icon={MousePointerClick} title="Icon on the Right (12h)">
        <p className="text-muted-foreground mb-4">
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
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3 text-foreground">HTML</h3>
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
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-foreground">JavaScript</h3>
            <CodeBlock
              code={`import { TimepickerUI } from 'timepicker-ui';

const wrapper = document.querySelector('#meeting-time-field');
const picker = new TimepickerUI(wrapper, {
  behavior: { returnFocus: true }
});
picker.create();`}
              language="typescript"
            />
          </div>
        </div>
      </Section>

      <Section icon={MousePointerClick} title="Icon on the Left (24h)">
        <p className="text-muted-foreground mb-4">
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
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3 text-foreground">HTML</h3>
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
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-foreground">JavaScript</h3>
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
          </div>
        </div>
      </Section>

      <Section icon={Palette} title="Placing the Icon">
        <p className="text-muted-foreground mb-4">
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

      <Section icon={Atom} title="React">
        <p className="text-muted-foreground mb-4">
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

      <Section icon={ListChecks} title="Notes">
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
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
