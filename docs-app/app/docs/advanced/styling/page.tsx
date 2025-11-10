import { CodeBlock } from "@/components/code-block";
import { LinkCard } from "@/components/link-card";
import { Palette, Paintbrush, Wand2, Code2 } from "lucide-react";
import { Section } from "@/components/section";

export const metadata = {
  title: "Custom Styling - Timepicker-UI",
  description: "Customize colors, themes, and appearance with CSS",
};

export default function StylingPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Custom Styling
        </h1>
        <p className="text-lg text-muted-foreground">
          Customize the timepicker appearance to match your brand
        </p>
      </div>

      <Section icon={Palette} title="CSS Variables">
        <p className="text-muted-foreground mb-4">
          Timepicker-UI uses CSS custom properties (variables) for easy
          customization. Override these variables to change colors and styles:
        </p>
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Available CSS Variables
            </h3>
            <CodeBlock
              code={`:root {
  /* Background colors */
  --timepicker-bg: #ffffff;
  --timepicker-surface: #e0e0e0;
  --timepicker-surface-hover: #ece0fd;
  --timepicker-input-bg: #e4e4e4;

  /* Text colors */
  --timepicker-text: #000000;
  --timepicker-secondary-text: #a9a9a9;
  --timepicker-disabled-text: rgba(156, 155, 155, 0.6);
  --timepicker-type-time-text: #787878;
  --timepicker-icon-text: #4e545a;

  /* Primary colors */
  --timepicker-primary: #6200ee;
  --timepicker-on-primary: #ffffff;

  /* Material Design 3 colors */
  --timepicker-primary-container: #eaddff;
  --timepicker-on-primary-container: #21005d;
  --timepicker-tertiary-container: #ffd8e4;
  --timepicker-on-tertiary-container: #633b48;
  --timepicker-am-pm-text-selected: #633b48;
  --timepicker-am-pm-text-unselected: #49454f;
  --timepicker-am-pm-active: #ece0fd;

  /* Borders and shadows */
  --timepicker-border: #d6d6d6;
  --timepicker-hover-bg: #d6d6d6;
  --timepicker-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 
                       0px 5px 8px 0px rgba(0, 0, 0, 0.14),
                       0px 1px 14px 0px rgba(0, 0, 0, 0.12);

  /* Typography and spacing */
  --timepicker-font-family: 'Roboto', sans-serif;
  --timepicker-border-radius: 4px;
}`}
              language="css"
            />
          </div>
        </div>
      </Section>

      <Section icon={Paintbrush} title="Creating Custom Themes">
        <p className="text-muted-foreground mb-4">
          Timepicker-UI comes with several built-in themes:
        </p>
        <div className="rounded-lg border border-border bg-card p-6 mb-6">
          <h3 className="font-semibold mb-3 text-foreground">
            Available Themes
          </h3>
          <CodeBlock
            code={`import { TimepickerUI } from 'timepicker-ui';

// Material Design 2 theme (purple/magenta)
const picker1 = new TimepickerUI(input1, { theme: 'm2' });

// Material Design 3 theme (green)
const picker2 = new TimepickerUI(input2, { theme: 'm3-green' });

// Dark theme
const picker3 = new TimepickerUI(input3, { theme: 'dark' });

// Crane theme with rounded corners
const picker4 = new TimepickerUI(input4, { theme: 'crane' });

// Crane-straight theme (sharp edges)
const picker5 = new TimepickerUI(input5, { theme: 'crane-straight' });`}
            language="typescript"
          />
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-md border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>Note:</strong> Version 3.2.0 introduced the Material
              Design 2 theme ({`'m2'`}) and renamed the previous default
              Material Design 3 theme from {`'m3'`} to {`'m3-green'`} for
              clarity.
            </p>
          </div>
        </div>

        <p className="text-muted-foreground mb-4">
          Create your own theme using the{" "}
          <code className="text-primary">custom</code> theme class and CSS
          variables:
        </p>
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Custom Theme Example
            </h3>
            <CodeBlock
              code={`/* Override CSS variables in the custom theme wrapper */
.timepicker-ui-wrapper.custom {
  --timepicker-bg: #ffffff;
  --timepicker-text: #000000;
  --timepicker-primary: #6200ee;
  --timepicker-on-primary: #ffffff;
  --timepicker-surface: #e0e0e0;
  --timepicker-surface-hover: #ece0fd;
  --timepicker-input-bg: #e4e4e4;
  --timepicker-border: #d6d6d6;
  --timepicker-hover-bg: #d6d6d6;
  --timepicker-secondary-text: #a9a9a9;
  --timepicker-type-time-text: #787878;
  --timepicker-icon-text: #4e545a;
  --timepicker-disabled-text: rgba(156, 155, 155, 0.6);
  --timepicker-shadow: 0 10px 35px 0 rgba(0, 0, 0, 0.25);
  --timepicker-border-radius: 4px;
  --timepicker-font-family: 'Roboto', sans-serif;
}`}
              language="css"
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Using Your Custom Theme
            </h3>
            <CodeBlock
              code={`import { TimepickerUI } from 'timepicker-ui';

const picker = new TimepickerUI('#timepicker', {
  theme: 'custom'
});

picker.create();`}
              language="typescript"
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Runtime Theme Customization
            </h3>
            <p className="text-muted-foreground mb-4">
              You can also change theme colors dynamically using the{" "}
              <code className="text-primary">setTheme()</code> method:
            </p>
            <CodeBlock
              code={`const picker = new TimepickerUI('#timepicker', {
  theme: 'custom'
});

picker.create();
picker.open();

// Customize theme colors at runtime
picker.setTheme({
  primaryColor: '#ff0000',
  backgroundColor: '#ffffff',
  surfaceColor: '#f0f0f0',
  textColor: '#000000',
  borderRadius: '12px',
  fontFamily: 'Arial, sans-serif'
});`}
              language="typescript"
            />
          </div>
        </div>
      </Section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6 text-foreground flex items-center gap-2">
          <Wand2 className="h-6 w-6" />
          Material Design 3 Ripple Effect
        </h2>
        <p className="text-muted-foreground mb-4">
          Version 3.2.0 added Material Design 3 ripple effects for enhanced
          touch feedback on interactive elements. The ripple effect is
          automatically applied to AM/PM buttons and time input fields.
        </p>

        <div className="rounded-lg border border-border bg-card p-6 mb-6">
          <h3 className="font-semibold mb-3 text-foreground">
            Ripple Effect Features
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Material Design 3 compliant ripple animation</li>
            <li>Automatic application to AM/PM toggle buttons</li>
            <li>Applied to hour and minute input fields</li>
            <li>Smooth circular ripple expansion from touch/click point</li>
            <li>Customizable via CSS variables</li>
          </ul>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 mb-6">
          <h3 className="font-semibold mb-3 text-foreground">
            Customizing Ripple Effect
          </h3>
          <p className="text-muted-foreground mb-4">
            You can customize the ripple effect appearance using CSS variables:
          </p>
          <CodeBlock
            code={`/* Customize ripple in your custom theme */
.timepicker-ui-wrapper.custom {
  /* Ripple color (uses --timepicker-on-primary-container by default) */
  --timepicker-on-primary-container: #21005d;
  
  /* Or override ripple directly */
  [data-md3-ripple]::before {
    background: radial-gradient(
      circle,
      rgba(98, 0, 238, 0.3) 0%,
      rgba(98, 0, 238, 0) 70%
    );
  }
}

/* Adjust ripple animation duration */
.timepicker-ui-wrapper.custom [data-md3-ripple].is-rippling::before {
  animation: ripple-animation 0.4s ease-out;
}

/* Disable ripple effect if needed */
.timepicker-ui-wrapper.no-ripple [data-md3-ripple]::before {
  display: none;
}`}
            language="css"
          />
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold mb-3 text-foreground">
            Technical Implementation
          </h3>
          <p className="text-muted-foreground mb-4">
            The ripple effect uses the{" "}
            <code className="text-primary">data-md3-ripple</code> attribute and
            CSS pseudo-elements. Elements with this attribute automatically
            receive ripple animations on pointer events.
          </p>
          <CodeBlock
            code={`/* Elements with ripple effect */
- AM/PM toggle buttons: .timepicker-ui-am, .timepicker-ui-pm
- Hour input wrapper: .timepicker-ui-input-wrapper (hour)
- Minute input wrapper: .timepicker-ui-input-wrapper (minute)

/* CSS pseudo-element approach */
[data-md3-ripple] {
  position: relative;
  overflow: hidden;
}

[data-md3-ripple]::before {
  content: '';
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, var(--ripple-color) 0%, transparent 70%);
  transform: translate(-50%, -50%) scale(0);
  pointer-events: none;
}`}
            language="css"
          />
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6 text-foreground">
          Complete Custom Theme Example
        </h2>
        <p className="text-muted-foreground mb-4">
          Here's a complete example of a custom purple theme:
        </p>
        <CodeBlock
          code={`/* theme-purple.css */
.timepicker-ui-wrapper.custom {
  --timepicker-bg: #faf5ff;
  --timepicker-text: #1e1b4b;
  --timepicker-primary: #8b5cf6;
  --timepicker-on-primary: #ffffff;
  --timepicker-surface: #ede9fe;
  --timepicker-surface-hover: #ddd6fe;
  --timepicker-input-bg: #f3e8ff;
  --timepicker-border: #c4b5fd;
  --timepicker-hover-bg: #ddd6fe;
  --timepicker-secondary-text: #7c3aed;
  --timepicker-type-time-text: #6d28d9;
  --timepicker-icon-text: #7c3aed;
  --timepicker-disabled-text: #a78bfa;
  --timepicker-shadow: 0 10px 35px 0 rgba(139, 92, 246, 0.3);
  --timepicker-border-radius: 16px;
  --timepicker-font-family: 'Inter', system-ui, sans-serif;
}

/* Usage in JavaScript */
import { TimepickerUI } from 'timepicker-ui';
import './theme-purple.css';

const picker = new TimepickerUI('#timepicker', {
  theme: 'custom'
});

picker.create();

// Or customize at runtime:
picker.open();
picker.setTheme({
  primaryColor: '#8b5cf6',
  backgroundColor: '#faf5ff',
  surfaceColor: '#ede9fe',
  textColor: '#1e1b4b',
  borderRadius: '16px'
});`}
          language="css"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6 text-foreground">
          setTheme() API Reference
        </h2>
        <p className="text-muted-foreground mb-4">
          The <code className="text-primary">setTheme()</code> method allows you
          to customize theme colors at runtime:
        </p>
        <div className="rounded-lg border border-border bg-card p-6">
          <CodeBlock
            code={`picker.setTheme({
  primaryColor?: string;           // Primary color (e.g., '#6200ee')
  backgroundColor?: string;         // Background color
  surfaceColor?: string;           // Surface color (clock face)
  surfaceHoverColor?: string;      // Surface hover color
  inputBgColor?: string;           // Input background color
  textColor?: string;              // Text color
  secondaryTextColor?: string;     // Secondary text color
  typeTimeTextColor?: string;      // AM/PM text color
  iconTextColor?: string;          // Icon text color
  disabledTextColor?: string;      // Disabled text color
  onPrimaryColor?: string;         // Text color on primary background
  borderColor?: string;            // Border color
  hoverBgColor?: string;           // Hover background color
  shadow?: string;                 // Box shadow
  borderRadius?: string;           // Border radius (e.g., '12px')
  fontFamily?: string;             // Font family
});

// Example:
picker.setTheme({
  primaryColor: '#ff0000',
  backgroundColor: '#ffffff',
  surfaceColor: '#f0f0f0',
  borderRadius: '20px'
});`}
            language="typescript"
          />
        </div>
      </section>

      <LinkCard
        icon={Palette}
        title="Browser Compatibility"
        description="CSS custom properties are supported in all modern browsers. For older browsers, provide fallback values or use a PostCSS plugin to generate static CSS. Test your custom themes across different browsers to ensure consistent appearance."
        linkText="View built-in themes"
        linkHref="/docs/features/themes"
        variant="purple"
      />
    </div>
  );
}
