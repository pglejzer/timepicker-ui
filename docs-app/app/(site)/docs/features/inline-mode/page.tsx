import { CodeBlock } from "@/components/code-block";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Inline Mode",
  description:
    "Inline mode in timepicker-ui - render an always-visible time picker with no modal or backdrop. Zero-dependency, framework-agnostic, accessible and SSR-safe.",
  path: "/docs/features/inline-mode",
});

export default function InlineModePage() {
  return (
    <div>
      <PageHeader
        title="Inline Mode"
        description="Display the timepicker directly on your page without a modal"
      />

      <Section title="What is Inline Mode?">
        <p>
          Inline mode displays the timepicker clock directly in your page
          layout, always visible without requiring a click to open. Perfect for
          dashboards, settings pages, or when you want the time selection to be
          immediately accessible.
        </p>
        <ul>
          <li>No modal or backdrop - stays in document flow</li>
          <li>Always visible - no click needed to open</li>
          <li>Works with all themes and customization options</li>
          <li>Perfect for embedded forms and settings panels</li>
        </ul>
      </Section>

      <Section title="Basic Usage">
        <p>
          Set{" "}
          <code>ui.inline.enabled</code>{" "}
          to <code>true</code> and pass the element to render into, or its
          selector, as <code>ui.inline.container</code>. The picker renders
          there when you call <code>create()</code>.
        </p>
        <h3>HTML Structure</h3>
        <CodeBlock
          code={`<input type="text" id="timepicker" />
<div id="timepicker-container"></div>`}
          language="html"
        />

        <h3>JavaScript</h3>
        <CodeBlock
          code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker');
const picker = new TimepickerUI(input, {
  ui: {
    inline: {
      enabled: true,
      container: '#timepicker-container'
    }
  }
});

picker.create();`}
          language="typescript"
        />
        <ul>
          <li>
            <code>container</code> is required. The constructor throws if it
            is missing or the element is not found.
          </li>
          <li>
            <code>showButtons</code> (default <code>false</code>) shows the OK
            and Cancel buttons. OK writes the time to the input and fires{" "}
            <code>confirm</code> / <code>onConfirm</code>. Cancel resets the
            picker to the input&apos;s value and fires <code>cancel</code> /{" "}
            <code>onCancel</code>. The picker stays on the page in both cases.
          </li>
          <li>
            <code>autoUpdate</code> (default <code>false</code>) writes the
            time to the input while the user changes it.
          </li>
          <li>
            Focus is not trapped in inline mode unless you set{" "}
            <code>behavior.focusTrap</code> yourself.
          </li>
        </ul>
      </Section>

      <Section title="Configuration Options">
        <p>
          Combine inline mode with other options for complete customization:
        </p>
        <h3>12-hour Inline Picker</h3>
        <CodeBlock
          code={`const picker = new TimepickerUI(input, {
  ui: {
    inline: { enabled: true, container: '#timepicker-container' },
    theme: 'basic'
  },
  clock: { type: '12h' }
});

picker.create();`}
          language="typescript"
        />

        <h3>24-hour Inline with Theme</h3>
        <CodeBlock
          code={`const picker = new TimepickerUI(input, {
  ui: {
    inline: { enabled: true, container: '#timepicker-container' },
    theme: 'cyberpunk'
  },
  clock: { type: '24h' }
});

picker.create();`}
          language="typescript"
        />

        <h3>Inline with Time Restrictions</h3>
        <CodeBlock
          code={`const picker = new TimepickerUI(input, {
  ui: {
    inline: { enabled: true, container: '#timepicker-container' }
  },
  clock: {
    type: '24h',
    disabledTime: {
      hours: [0, 1, 2, 3, 4, 5, 22, 23],
      minutes: [15, 30, 45]
    }
  }
});

picker.create();`}
          language="typescript"
        />
      </Section>

      <Section title="Styling Inline Mode">
        <p>
          In inline mode the picker&apos;s root (<code>.tp-ui-modal</code>)
          gets the <code>tp-ui--inline</code> class. Its card,{" "}
          <code>.tp-ui-wrapper</code>, stays in the page flow, is centered, and
          fills the container up to 328px. These inline rules use{" "}
          <code>!important</code>, so your overrides need it too.
        </p>
        <h3>Card Border Instead of Shadow</h3>
        <CodeBlock
          code={`.tp-ui--inline .tp-ui-wrapper {
  box-shadow: none !important;
  border: 1px solid #e0e0e0;
}`}
          language="css"
        />

        <h3>Sidebar Integration</h3>
        <CodeBlock
          code={`.sidebar .tp-ui--inline .tp-ui-wrapper {
  margin: 20px auto !important;
}`}
          language="css"
        />
      </Section>

      <Section title="Embedded in a host component">
        <p>
          Set <code>ui.inline.embedded</code> to <code>true</code> when the
          picker sits inside your own dialog, popover or form. The picker then
          behaves as part of that component instead of a standalone card:
        </p>
        <ul>
          <li>
            The root is <code>role=&quot;group&quot;</code> with an accessible
            name, not a dialog. It has no <code>aria-modal</code>.
          </li>
          <li>
            The card has no shadow and no minimum height. The{" "}
            <code>max-width</code> of 328px stays.
          </li>
          <li>
            Focus is not trapped, whatever <code>behavior.focusTrap</code>{" "}
            says, and the picker does not take focus when it mounts.
          </li>
          <li>
            <code>embedded</code> is ignored unless <code>enabled</code> is{" "}
            <code>true</code>. The default is <code>false</code>.
          </li>
        </ul>
        <CodeBlock
          code={`const dialog = document.querySelector('dialog');
const input = document.querySelector('#time');
let picker = null;

openButton.addEventListener('click', () => {
  dialog.showModal();
  if (picker) return;

  picker = new TimepickerUI(input, {
    ui: {
      inline: {
        enabled: true,
        container: '#dialog-picker',
        embedded: true,
        autoUpdate: true
      }
    }
  });
  picker.create();
});`}
          language="typescript"
        />
        <p>
          Create the picker once the container is visible, as above. The clock
          face measures itself on creation and gets a size of 0 inside a
          hidden container, such as a closed <code>&lt;dialog&gt;</code>. See{" "}
          <Link href="/examples/features/inline-mode">the live example</Link>.
        </p>
      </Section>

      <Section title="React Example">
        <p>
          Using inline mode in React components. <code>container</code> takes
          the element from a ref, so the container needs no id:
        </p>
        <CodeBlock
          code={`import { useEffect, useRef } from 'react';
import { TimepickerUI } from 'timepicker-ui';

function InlineTimepicker() {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!inputRef.current || !containerRef.current) return;

    const picker = new TimepickerUI(inputRef.current, {
      ui: {
        inline: {
          enabled: true,
          container: containerRef.current,
          autoUpdate: true
        },
        theme: 'm3-green'
      },
      clock: { type: '12h' }
    });

    picker.create();

    return () => {
      picker.destroy();
    };
  }, []);

  return (
    <div className="p-8">
      <input ref={inputRef} type="text" aria-label="Selected time" readOnly />
      <div ref={containerRef} />
    </div>
  );
}`}
          language="typescript"
        />
      </Section>

      <dl>
        <div>
          <dt>Best Practices</dt>
          <dd>
            When using inline mode, make sure to provide enough space in your
            layout for the clock face (minimum 280x280px recommended). Consider
            using CSS media queries to adjust the size on smaller screens.
          </dd>
          <dd>
            <Link href="/docs/features/mobile">Mobile optimization tips</Link>
          </dd>
        </div>
      </dl>
    </div>
  );
}
