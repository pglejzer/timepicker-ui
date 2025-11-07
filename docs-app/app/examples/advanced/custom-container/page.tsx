"use client";

import { Section } from "@/components/section";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { CodeBlock } from "@/components/code-block";
import { Box, Layout } from "lucide-react";
import { InfoBox } from "@/components/info-box";

export default function CustomContainerPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Custom Container
        </h1>
        <p className="text-lg text-muted-foreground">
          Control where the timepicker modal is rendered in the DOM
        </p>
      </div>

      <InfoBox title="appendModalSelector" variant="blue" className="mb-8">
        By default, the timepicker modal is appended to{" "}
        <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-xs">
          document.body
        </code>
        . Use{" "}
        <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-xs">
          appendModalSelector
        </code>{" "}
        to render it inside a specific container element.
      </InfoBox>

      <Section icon={Box} title="Custom Container">
        <p className="text-muted-foreground mb-4">
          Append the modal to a specific container:
        </p>
        <TimepickerExample
          code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker');
const picker = new TimepickerUI(input, {
  appendModalSelector: '#modal-container'
});

picker.create();

// HTML:
// <div id="modal-container"></div>`}
          options={{
            appendModalSelector: "body",
          }}
        />
      </Section>

      <Section icon={Layout} title="Within Modal Dialog">
        <p className="text-muted-foreground mb-4">
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
  appendModalSelector: '#modal-content'
});

picker.create();`}
          language="typescript"
        />
      </Section>

      <Section icon={Box} title="Shadow DOM">
        <p className="text-muted-foreground mb-4">
          Use with Web Components and Shadow DOM:
        </p>
        <CodeBlock
          code={`class TimePickerComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    // Create container inside shadow DOM
    this.shadowRoot.innerHTML = \`
      <style>
        @import url('timepicker-ui/index.css');
      </style>
      <div id="picker-container">
        <input id="timepicker" type="text" />
      </div>
    \`;

    const input = this.shadowRoot.querySelector('#timepicker');
    const container = this.shadowRoot.querySelector('#picker-container');
    
    const picker = new TimepickerUI(input, {
      appendModalSelector: container
    });
    
    picker.create();
  }
}

customElements.define('time-picker', TimePickerComponent);`}
          language="typescript"
        />
      </Section>

      <Section icon={Layout} title="React Portal Pattern">
        <p className="text-muted-foreground mb-4">
          Integrate with React Portals for complex layouts:
        </p>
        <CodeBlock
          code={`import { useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { TimepickerUI } from 'timepicker-ui';

function TimepickerWithPortal() {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<TimepickerUI | null>(null);

  const options = useMemo(() => ({
    appendModalSelector: containerRef.current
  }), []);

  useEffect(() => {
    if (!inputRef.current || !containerRef.current) return;

    pickerRef.current = new TimepickerUI(
      inputRef.current, 
      options
    );
    pickerRef.current.create();

    return () => {
      pickerRef.current?.destroy();
    };
  }, []);

  return (
    <>
      <input ref={inputRef} type="text" />
      {createPortal(
        <div ref={containerRef} />,
        document.body
      )}
    </>
  );
}`}
          language="tsx"
        />
      </Section>

      <Section icon={Box} title="Iframe Integration">
        <p className="text-muted-foreground mb-4">
          Use timepicker inside an iframe:
        </p>
        <CodeBlock
          code={`// Inside iframe document
import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker');
const iframeBody = document.body;

const picker = new TimepickerUI(input, {
  // Keep modal inside iframe
  appendModalSelector: iframeBody
});

picker.create();

// Or append to parent document (if same origin)
const parentContainer = window.parent.document.querySelector('#container');
const pickerToParent = new TimepickerUI(input, {
  appendModalSelector: parentContainer
});`}
          language="typescript"
        />
      </Section>

      <Section icon={Layout} title="Scoped Styles">
        <p className="text-muted-foreground mb-4">
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
  appendModalSelector: '#scoped-container',
  cssClass: 'scoped-picker'
});

picker.create();

// CSS:
// .custom-scope {
//   /* Container styles */
//   position: relative;
//   z-index: 100;
// }
//
// .custom-scope .timepicker-ui-modal {
//   /* Scoped modal styles */
//   position: absolute;
// }`}
          language="typescript"
        />
      </Section>

      <Section icon={Box} title="Multiple Containers">
        <p className="text-muted-foreground mb-4">
          Different pickers in different containers:
        </p>
        <CodeBlock
          code={`import { TimepickerUI } from 'timepicker-ui';

// Picker 1 in sidebar
const input1 = document.querySelector('#timepicker-1');
const picker1 = new TimepickerUI(input1, {
  appendModalSelector: '#sidebar-container'
});
picker1.create();

// Picker 2 in main content
const input2 = document.querySelector('#timepicker-2');
const picker2 = new TimepickerUI(input2, {
  appendModalSelector: '#main-content'
});
picker2.create();

// Picker 3 in modal
const input3 = document.querySelector('#timepicker-3');
const picker3 = new TimepickerUI(input3, {
  appendModalSelector: '#modal-dialog'
});
picker3.create();`}
          language="typescript"
        />
      </Section>
    </div>
  );
}
