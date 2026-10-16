"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { CodeBlock } from "@/components/code-block";
import { Callout } from "@/components/callout";

export default function CustomContainerPage() {
  return (
    <div>
      <PageHeader
        title="Custom Container"
        description="Control where the timepicker modal is rendered in the DOM"
      />

      <Callout title="ui.appendTo">
        By default, the timepicker modal is appended to{" "}
        <code>
          document.body
        </code>
        . Set{" "}
        <code>
          ui.appendTo
        </code>{" "}
        to a CSS selector or an element to render it inside another element. The
        picker looks a selector up with <code>document.querySelector</code> each
        time it opens, so the element must exist by then. A selector cannot point
        into a shadow root or another frame&apos;s document.
      </Callout>

      <Section title="Custom Container">
        <p>
          Append the modal to a specific container:
        </p>
        <TimepickerExample
          display="field"
          code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker');
const picker = new TimepickerUI(input, {
  ui: { appendTo: '#modal-container' }
});

picker.create();

// HTML:
// <div id="modal-container"></div>`}
          options={{
            ui: { appendTo: "body" },
          }}
        />
      </Section>

      <Section title="Within Modal Dialog">
        <p>
          Use inside a modal or dialog component:
        </p>
        <CodeBlock
          code={`import { TimepickerUI } from 'timepicker-ui';

// HTML:
// <div class="modal" id="appointment-modal">
//   <div class="modal-content" id="modal-content">
//     <h2>Schedule Appointment</h2>
//     <input id="timepicker" type="text" />
//   </div>
// </div>

const input = document.querySelector('#timepicker');
const picker = new TimepickerUI(input, {
  // Append to modal content instead of body
  ui: { appendTo: '#modal-content' }
});

picker.create();`}
          language="typescript"
        />
      </Section>

      <Section title="React">
        <p>
          Render the container in your component and pass its selector. Create
          the picker in an effect, so it only runs in the browser:
        </p>
        <CodeBlock
          code={`import { useEffect, useRef } from 'react';
import { TimepickerUI } from 'timepicker-ui';

function TimepickerWithContainer() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    const picker = new TimepickerUI(inputRef.current, {
      ui: { appendTo: '#timepicker-root' }
    });
    picker.create();

    return () => {
      picker.destroy();
    };
  }, []);

  return (
    <>
      <input ref={inputRef} type="text" />
      <div id="timepicker-root" />
    </>
  );
}`}
          language="tsx"
        />
      </Section>

      <Section title="Iframe Integration">
        <p>
          Load timepicker-ui in the iframe&apos;s own page. The modal is
          appended to that document&apos;s <code>body</code>, so it stays inside
          the frame:
        </p>
        <CodeBlock
          code={`// Script running inside the iframe page
import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker');
const picker = new TimepickerUI(input);

picker.create();`}
          language="typescript"
        />
      </Section>

      <Section title="Scoped Styles">
        <p>
          Use custom container with scoped CSS:
        </p>
        <CodeBlock
          code={`import { TimepickerUI } from 'timepicker-ui';

// HTML:
// <div class="custom-scope" id="scoped-container">
//   <input id="timepicker" type="text" />
// </div>

const input = document.querySelector('#timepicker');
const picker = new TimepickerUI(input, {
  ui: {
    appendTo: '#scoped-container',
    cssClass: 'scoped-picker'
  }
});

picker.create();

// CSS: the modal now sits inside .custom-scope,
// so rules scoped to it reach the picker
// .custom-scope .tp-ui-wrapper.scoped-picker {
//   --tp-primary: #0b57d0;
// }`}
          language="typescript"
        />
      </Section>

      <Section title="Multiple Containers">
        <p>
          Different pickers in different containers:
        </p>
        <CodeBlock
          code={`import { TimepickerUI } from 'timepicker-ui';

// Picker 1 in sidebar
const input1 = document.querySelector('#timepicker-1');
const picker1 = new TimepickerUI(input1, {
  ui: { appendTo: '#sidebar-container' }
});
picker1.create();

// Picker 2 in main content
const input2 = document.querySelector('#timepicker-2');
const picker2 = new TimepickerUI(input2, {
  ui: { appendTo: '#main-content' }
});
picker2.create();

// Picker 3 in modal
const input3 = document.querySelector('#timepicker-3');
const picker3 = new TimepickerUI(input3, {
  ui: { appendTo: '#modal-dialog' }
});
picker3.create();`}
          language="typescript"
        />
      </Section>
    </div>
  );
}
