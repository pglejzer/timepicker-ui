import { CodeBlock } from "@/components/code-block";
import { Section } from "@/components/section";
import { LinkCard } from "@/components/link-card";
import { Eye, Code, Settings } from "lucide-react";

export const metadata = {
  title: "Inline Mode - Timepicker-UI",
  description: "Always-visible timepicker without modal or backdrop",
};

export default function InlineModePage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Inline Mode
        </h1>
        <p className="text-lg text-muted-foreground">
          Display the timepicker directly on your page without a modal
        </p>
      </div>

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
              <span className="text-primary">✓</span>
              <span>No modal or backdrop - stays in document flow</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Always visible - no click needed to open</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Works with all themes and customization options</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Perfect for embedded forms and settings panels</span>
            </li>
          </ul>
        </div>
      </Section>

      <Section icon={Code} title="Basic Usage">
        <p className="text-muted-foreground mb-4">
          Enable inline mode by setting{" "}
          <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-sm">
            enableSwitchIcon: false
          </code>
          :
        </p>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3 text-foreground">
              HTML Structure
            </h3>
            <CodeBlock
              code={`<div class="timepicker-container">
  <input 
    type="time" 
    id="timepicker" 
    class="timepicker-input"
  />
</div>`}
              language="html"
            />
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-foreground">JavaScript</h3>
            <CodeBlock
              code={`import TimepickerUI from 'timepicker-ui';

const input = document.querySelector('#timepicker');
const picker = new TimepickerUI(input, {
  enableSwitchIcon: false
});

picker.create();`}
              language="typescript"
            />
          </div>
        </div>
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
  enableSwitchIcon: false,
  clockType: '12h',
  theme: 'basic'
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
  enableSwitchIcon: false,
  clockType: '24h',
  theme: 'cyberpunk',
  animation: true
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
  enableSwitchIcon: false,
  disabledTime: {
    hours: [0, 1, 2, 3, 4, 5, 22, 23],
    minutes: [15, 30, 45]
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
          Position and style the inline timepicker using CSS:
        </p>
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Center Alignment
            </h3>
            <CodeBlock
              code={`.timepicker-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.timepicker-ui-wrapper {
  position: relative !important;
  transform: none !important;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}`}
              language="css"
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Sidebar Integration
            </h3>
            <CodeBlock
              code={`.sidebar .timepicker-ui-wrapper {
  position: relative !important;
  width: 100%;
  max-width: 280px;
  margin: 20px auto;
}

.sidebar .timepicker-ui-clock-face {
  width: 260px;
  height: 260px;
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
          Using inline mode in React components:
        </p>
        <CodeBlock
          code={`import { useEffect, useRef } from 'react';
import TimepickerUI from 'timepicker-ui';

function InlineTimepicker() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      const picker = new TimepickerUI(inputRef.current, {
        enableSwitchIcon: false,
        clockType: '12h',
        theme: 'm3'
      });
      
      picker.create();

      return () => {
        picker.destroy();
      };
    }
  }, []);

  return (
    <div className="flex justify-center p-8">
      <input 
        ref={inputRef}
        type="time" 
        className="sr-only"
      />
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
