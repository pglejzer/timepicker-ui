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
