"use client";

import { Section } from "@/components/section";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { Paintbrush, Palette, Zap } from "lucide-react";
import { InfoBox } from "@/components/info-box";

export default function CustomStylingPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Custom Styling
        </h1>
        <p className="text-lg text-muted-foreground">
          Customize the timepicker appearance using CSS custom properties and
          your own styles
        </p>
      </div>

      <InfoBox title="CSS Custom Properties" variant="blue" className="mb-8">
        Timepicker-UI uses CSS custom properties (CSS variables) that you can
        override to match your brand colors and design system. Version 3.2.0
        added Material Design 3 ripple effects and expanded the color system
        with container colors.
      </InfoBox>

      <Section icon={Paintbrush} title="Custom CSS Class">
        <p className="text-muted-foreground mb-4">
          Add your own CSS class via <code>cssClass</code> option and define
          custom CSS variables:
        </p>
        <TimepickerExample
          code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker');
const picker = new TimepickerUI(input, {
  ui: { cssClass: 'my-custom-picker' }
});
picker.create();

// CSS:
.tp-ui-wrapper.my-custom-picker {
  --tp-bg: #fce4ec;
  --tp-primary: #e91e63;
  --tp-surface-hover: #f8bbd0;
  --tp-input-bg: #f48fb1;
  --tp-primary-container: #f8bbd0;
}`}
          options={{
            ui: { cssClass: "custom-pink-picker" },
          }}
        />
      </Section>

      <Section icon={Palette} title="Dark Theme Example">
        <p className="text-muted-foreground mb-4">
          Create a custom dark theme with purple accents:
        </p>
        <TimepickerExample
          code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker');
const picker = new TimepickerUI(input, {
  ui: { cssClass: 'purple-dark-theme' }
});
picker.create();

// CSS:
.tp-ui-wrapper.purple-dark-theme {
  --tp-bg: #0f172a;
  --tp-surface: #1e293b;
  --tp-surface-hover: #334155;
  --tp-text: #f1f5f9;
  --tp-text-secondary: #94a3b8;
  --tp-primary: #a855f7;
  --tp-on-primary: #ffffff;
  --tp-border: rgba(168, 85, 247, 0.3);
  --tp-shadow: 0 20px 25px -5px rgba(168, 85, 247, 0.2);
  --tp-border-radius: 16px;
}`}
          options={{
            ui: { cssClass: "custom-purple-dark" },
          }}
        />
      </Section>

      <Section icon={Paintbrush} title="Custom Font & Border Radius">
        <p className="text-muted-foreground mb-4">
          Customize typography and rounded corners:
        </p>
        <TimepickerExample
          code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker');
const picker = new TimepickerUI(input, {
  ui: { cssClass: 'custom-rounded-picker' }
});
picker.create();

// CSS:
.tp-ui-wrapper.custom-rounded-picker {
  --tp-font-family: 'Inter', -apple-system, sans-serif;
  --tp-border-radius: 24px;
  --tp-primary: #10b981;
  --tp-surface-hover: #d1fae5;
}`}
          options={{
            ui: { cssClass: "custom-rounded-picker" },
          }}
        />
      </Section>

      <Section icon={Palette} title="Material Design 3 Features (v3.2.0+)">
        <p className="text-muted-foreground mb-4">
          Version 3.2.0 introduced full Material Design 3 support with ripple
          effects and container colors:
        </p>
        <TimepickerExample
          code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker');
const picker = new TimepickerUI(input, {
  ui: { theme: 'm3-green' } // or 'm2' for Material Design 2
});
picker.create();

// CSS variables for MD3 customization:
.tp-ui-wrapper.custom {
  /* Material Design 3 container colors */
  --tp-primary-container: #eaddff;
  --tp-on-primary-container: #21005d;
  --tp-tertiary-container: #ffd8e4;
  --tp-on-tertiary-container: #633b48;
  
  /* AM/PM specific colors */
  --tp-am-pm-text-selected: #633b48;
  --tp-am-pm-text-unselected: #49454f;
  --tp-am-pm-active: #ece0fd;
}

// Ripple effect is automatically applied to:
// - AM/PM buttons
// - Hour and minute inputs`}
          options={{
            ui: { theme: "m3-green" },
          }}
        />
        <InfoBox title="Ripple Effect" variant="green" className="mt-4">
          Material Design 3 ripple effects are automatically applied to AM/PM
          buttons and time input fields. Customize the ripple color using{" "}
          <code>--timepicker-on-primary-container</code> variable or override
          the <code>[data-md3-ripple]::before</code> pseudo-element styles.
        </InfoBox>
      </Section>

      <style jsx global>{`
        .tp-ui-wrapper.custom-pink-picker {
          --tp-bg: #fce4ec;
          --tp-primary: #e91e63;
          --tp-surface: #f8bbd0;
          --tp-surface-hover: #f48fb1;
          --tp-input-bg: #f48fb1;
          --tp-primary-container: #f8bbd0;
        }

        .tp-ui-wrapper.custom-purple-dark {
          --tp-bg: #0f172a;
          --tp-surface: #1e293b;
          --tp-surface-hover: #334155;
          --tp-input-bg: #1e293b;
          --tp-text: #f1f5f9;
          --tp-text-secondary: #94a3b8;
          --tp-primary: #a855f7;
          --tp-on-primary: #ffffff;
          --tp-border: rgba(168, 85, 247, 0.3);
          --tp-hover-bg: rgba(168, 85, 247, 0.1);
          --tp-shadow: 0 20px 25px -5px rgba(168, 85, 247, 0.2);
          --tp-border-radius: 16px;
        }

        .tp-ui-wrapper.custom-rounded-picker {
          --tp-font-family: "Inter", -apple-system, sans-serif;
          --tp-border-radius: 24px;
          --tp-primary: #10b981;
          --tp-surface-hover: #d1fae5;
          --tp-bg: #ecfdf5;
          --tp-surface: #d1fae5;
        }
      `}</style>
    </div>
  );
}
