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
        override to match your brand colors and design system. You can also use
        the runtime <code>setTheme()</code> API for dynamic theming.
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
  cssClass: 'my-custom-picker'
});
picker.create();

// CSS:
.timepicker-ui-wrapper.my-custom-picker {
  --timepicker-bg: #fce4ec;
  --timepicker-primary: #e91e63;
  --timepicker-surface-hover: #f8bbd0;
}`}
          options={{
            cssClass: "custom-pink-picker",
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
  cssClass: 'purple-dark-theme'
});
picker.create();

// CSS:
.timepicker-ui-wrapper.purple-dark-theme {
  --timepicker-bg: #0f172a;
  --timepicker-surface: #1e293b;
  --timepicker-surface-hover: #334155;
  --timepicker-text: #f1f5f9;
  --timepicker-secondary-text: #94a3b8;
  --timepicker-primary: #a855f7;
  --timepicker-on-primary: #ffffff;
  --timepicker-border: rgba(168, 85, 247, 0.3);
  --timepicker-shadow: 0 20px 25px -5px rgba(168, 85, 247, 0.2);
  --timepicker-border-radius: 16px;
}`}
          options={{
            cssClass: "custom-purple-dark",
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
  cssClass: 'custom-rounded-picker'
});
picker.create();

// CSS:
.timepicker-ui-wrapper.custom-rounded-picker {
  --timepicker-font-family: 'Inter', -apple-system, sans-serif;
  --timepicker-border-radius: 24px;
  --timepicker-primary: #10b981;
  --timepicker-surface-hover: #d1fae5;
}`}
          options={{
            cssClass: "custom-rounded-picker",
          }}
        />
      </Section>

      <Section icon={Zap} title="Runtime Theme API">
        <p className="text-muted-foreground mb-4">
          Use <code>setTheme()</code> method to change colors dynamically at
          runtime:
        </p>
        <TimepickerExample
          code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker');
const picker = new TimepickerUI(input);
picker.create();

// Change theme at runtime
picker.setTheme({
  primaryColor: '#ff5722',
  backgroundColor: '#fff3e0',
  surfaceColor: '#ffe0b2',
  surfaceHoverColor: '#ffcc80',
  textColor: '#212121',
  secondaryTextColor: '#757575',
  onPrimaryColor: '#ffffff',
  borderColor: 'rgba(255, 87, 34, 0.3)',
  shadow: '0 4px 6px rgba(255, 87, 34, 0.1)',
  borderRadius: '12px',
  fontFamily: 'Arial, sans-serif'
});`}
          options={{}}
        />
        <InfoBox title="Runtime API" variant="orange" className="mt-4">
          The <code>setTheme()</code> method allows you to change the timepicker
          appearance dynamically without recreating the instance. Perfect for
          implementing theme switchers!
        </InfoBox>
      </Section>

      <style jsx global>{`
        .timepicker-ui-wrapper.custom-pink-picker {
          --timepicker-bg: #fce4ec;
          --timepicker-primary: #e91e63;
          --timepicker-surface: #f8bbd0;
          --timepicker-surface-hover: #f48fb1;
        }

        .timepicker-ui-wrapper.custom-purple-dark {
          --timepicker-bg: #0f172a;
          --timepicker-surface: #1e293b;
          --timepicker-surface-hover: #334155;
          --timepicker-input-bg: #1e293b;
          --timepicker-text: #f1f5f9;
          --timepicker-secondary-text: #94a3b8;
          --timepicker-primary: #a855f7;
          --timepicker-on-primary: #ffffff;
          --timepicker-border: rgba(168, 85, 247, 0.3);
          --timepicker-hover-bg: rgba(168, 85, 247, 0.1);
          --timepicker-shadow: 0 20px 25px -5px rgba(168, 85, 247, 0.2);
          --timepicker-border-radius: 16px;
        }

        .timepicker-ui-wrapper.custom-rounded-picker {
          --timepicker-font-family: "Inter", -apple-system, sans-serif;
          --timepicker-border-radius: 24px;
          --timepicker-primary: #10b981;
          --timepicker-surface-hover: #d1fae5;
          --timepicker-bg: #ecfdf5;
          --timepicker-surface: #d1fae5;
        }
      `}</style>
    </div>
  );
}
