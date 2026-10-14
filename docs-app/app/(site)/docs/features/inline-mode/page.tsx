import { CodeBlock } from "@/components/code-block";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { LinkCard } from "@/components/link-card";
import { Eye, Code, Settings, Check } from "lucide-react";

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
        eyebrow="Feature"
      />

      <Section icon={Eye} title="What is Inline Mode?">
        <p className="text-muted-foreground mb-4">
          Inline mode displays the timepicker clock directly in your page
          layout, always visible without requiring a click to open. Perfect for
          dashboards, settings pages, or when you want the time selection to be
          immediately accessible.
        </p>
        <div className="rounded-lg border border-border bg-card p-6">
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>No modal or backdrop - stays in document flow</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>Always visible - no click needed to open</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>Works with all themes and customization options</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>Perfect for embedded forms and settings panels</span>
            </li>
          </ul>
        </div>
      </Section>

      <Section icon={Code} title="Basic Usage">
        <p className="text-muted-foreground mb-4">
          Set{" "}
          <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-sm">
            ui.inline.enabled
          </code>{" "}
          to <code>true</code> and pass the element to render into, or its
          selector, as <code>ui.inline.container</code>. The picker renders
          there when you call <code>create()</code>.
        </p>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3 text-foreground">
              HTML Structure
            </h3>
            <CodeBlock
              code={`<input type="text" id="timepicker" />
<div id="timepicker-container"></div>`}
              language="html"
            />
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-foreground">JavaScript</h3>
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
          </div>
        </div>
        <ul className="mt-6 list-disc pl-6 space-y-2 text-muted-foreground">
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

      <Section icon={Settings} title="Configuration Options">
        <p className="text-muted-foreground mb-4">
          Combine inline mode with other options for complete customization:
        </p>
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              12-hour Inline Picker
            </h3>
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
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              24-hour Inline with Theme
            </h3>
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
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Inline with Time Restrictions
            </h3>
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
          </div>
        </div>
      </Section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6 text-foreground">
          Styling Inline Mode
        </h2>
        <p className="text-muted-foreground mb-4">
          In inline mode the picker&apos;s root (<code>.tp-ui-modal</code>)
          gets the <code>tp-ui--inline</code> class. Its card,{" "}
          <code>.tp-ui-wrapper</code>, stays in the page flow, is centered, and
          fills the container up to 328px. These inline rules use{" "}
          <code>!important</code>, so your overrides need it too.
        </p>
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Card Border Instead of Shadow
            </h3>
            <CodeBlock
              code={`.tp-ui--inline .tp-ui-wrapper {
  box-shadow: none !important;
  border: 1px solid #e0e0e0;
}`}
              language="css"
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Sidebar Integration
            </h3>
            <CodeBlock
              code={`.sidebar .tp-ui--inline .tp-ui-wrapper {
  margin: 20px auto !important;
}`}
              language="css"
            />
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6 text-foreground">
          React Example
        </h2>
        <p className="text-muted-foreground mb-4">
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
      </section>

      <LinkCard
        icon={Eye}
        title="Best Practices"
        description="When using inline mode, make sure to provide enough space in your layout for the clock face (minimum 280x280px recommended). Consider using CSS media queries to adjust the size on smaller screens."
        linkText="Mobile optimization tips"
        linkHref="/docs/features/mobile"
        variant="blue"
      />
    </div>
  );
}
