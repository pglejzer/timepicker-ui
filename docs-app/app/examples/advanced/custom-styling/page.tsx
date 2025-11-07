"use client";

import { Section } from "@/components/section";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { Paintbrush, Palette } from "lucide-react";
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
        Timepicker-UI uses CSS custom properties that you can override to match
        your brand colors and design system.
      </InfoBox>

      <Section icon={Paintbrush} title="Custom CSS Class">
        <p className="text-muted-foreground mb-4">
          Add your own CSS class to apply custom styles:
        </p>
        <TimepickerExample
          code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker');
const picker = new TimepickerUI(input, {
  cssClass: 'my-custom-picker',
  theme: 'basic'
});

picker.create();

// CSS:
// .my-custom-picker .timepicker-ui-wrapper {
//   --timepicker-primary: #e91e63;
//   --timepicker-surface-hover: #fce4ec;
// }`}
          options={{
            cssClass: "custom-pink-picker",
            theme: "basic",
          }}
        />
      </Section>

      <Section icon={Palette} title="Custom Colors">
        <p className="text-muted-foreground mb-4">
          Override default color variables:
        </p>
        <TimepickerExample
          code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker');
const picker = new TimepickerUI(input, {
  cssClass: 'purple-theme'
});

picker.create();

// CSS:
// .purple-theme .timepicker-ui-wrapper {
//   --timepicker-primary: #9333ea;
//   --timepicker-surface: #f3e8ff;
//   --timepicker-surface-hover: #e9d5ff;
//   --timepicker-bg: #faf5ff;
// }`}
          options={{
            cssClass: "custom-purple-theme",
          }}
        />
      </Section>

      <Section icon={Paintbrush} title="Custom Font">
        <p className="text-muted-foreground mb-4">
          Change typography with CSS custom properties:
        </p>
        <TimepickerExample
          code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker');
const picker = new TimepickerUI(input, {
  cssClass: 'custom-font-picker'
});

picker.create();

// CSS:
// .custom-font-picker .timepicker-ui-wrapper {
//   --timepicker-font-family: 'Inter', sans-serif;
// }`}
          options={{
            cssClass: "custom-font-picker",
          }}
        />
      </Section>

      <Section icon={Palette} title="Border Radius">
        <p className="text-muted-foreground mb-4">
          Customize border radius for different design systems:
        </p>
        <TimepickerExample
          code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker');
const picker = new TimepickerUI(input, {
  cssClass: 'rounded-picker'
});

picker.create();

// CSS:
// .rounded-picker .timepicker-ui-wrapper {
//   --timepicker-border-radius: 24px;
// }`}
          options={{
            cssClass: "rounded-custom-picker",
          }}
        />
      </Section>

      <style jsx global>{`
        .custom-pink-picker .timepicker-ui-wrapper {
          --timepicker-primary: #e91e63;
          --timepicker-surface-hover: #fce4ec;
        }

        .custom-purple-theme .timepicker-ui-wrapper {
          --timepicker-primary: #9333ea;
          --timepicker-surface: #f3e8ff;
          --timepicker-surface-hover: #e9d5ff;
          --timepicker-bg: #faf5ff;
        }

        .custom-font-picker .timepicker-ui-wrapper {
          --timepicker-font-family: "Inter", -apple-system, sans-serif;
        }

        .rounded-custom-picker .timepicker-ui-wrapper {
          --timepicker-border-radius: 24px;
        }
      `}</style>
    </div>
  );
}
