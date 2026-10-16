import { CodeBlock } from "@/components/code-block";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { Callout } from "@/components/callout";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Installation",
  description:
    "Install timepicker-ui via npm, yarn, pnpm or CDN. Zero-dependency, framework-agnostic and SSR-safe - works in React, Vue, Angular, Svelte and vanilla JS.",
  path: "/docs/installation",
});

export default function InstallationPage() {
  return (
    <div>
      <PageHeader
        title="Installation"
        description="Get started with Timepicker-UI in your project"
      />

      <Section title="Package Manager">
        <p>
          Install via npm, yarn, or pnpm:
        </p>
        <CodeBlock
          code={`npm install timepicker-ui

yarn add timepicker-ui

pnpm add timepicker-ui`}
          language="bash"
        />
      </Section>

      <Section title="Box Sizing">
        <p>
          You do not need a global <code>box-sizing</code> reset for the
          picker. It sets <code>box-sizing: border-box</code> on its own modal
          and on every element inside it.
        </p>
        <p>
          If your own layout already uses the common reset below, keep it. It
          does not conflict with the picker.
        </p>
        <CodeBlock
          code={`*,
*::before,
*::after {
  box-sizing: border-box;
}`}
          language="css"
        />
      </Section>

      <Section title="Import Styles">
        <p>
          Import the library styles in your main entry file:
        </p>
        <CodeBlock
          code={`import "timepicker-ui/main.css";`}
          language="typescript"
        />
      </Section>

      <Section title="CDN">
        <p>
          For quick prototyping, use the CDN version:
        </p>
        <CodeBlock
          code={`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/timepicker-ui@4.5.0/dist/css/main.css">
<script src="https://cdn.jsdelivr.net/npm/timepicker-ui@4.5.0/dist/index.umd.js"></script>
<script>
  // The UMD build exposes the class as the global TimepickerUI
  const picker = new TimepickerUI('#timepicker');
  picker.create();
</script>`}
          language="html"
        />
      </Section>

      <Callout title="Ready for the next step?" tone="tip">
        Check out the{" "}
        <Link href="/docs/quick-start">Quick Start</Link>{" "}
        guide to start building with Timepicker-UI
      </Callout>
    </div>
  );
}
