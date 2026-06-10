import { CodeBlock } from "@/components/code-block";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { InfoBox } from "@/components/info-box";
import { Terminal, Package, FileCode, Globe } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Installation",
  description:
    "Install timepicker-ui via npm, yarn, pnpm or CDN. Zero-dependency, framework-agnostic and SSR-safe - works in React, Vue, Angular, Svelte and vanilla JS.",
  alternates: {
    canonical: "/docs/installation",
  },
};

export default function InstallationPage() {
  return (
    <div>
      <PageHeader
        title="Installation"
        description="Get started with Timepicker-UI in your project"
        eyebrow="Guide"
      />

      <Section icon={Terminal} title="Package Manager">
        <p className="text-muted-foreground mb-4">
          Install via npm, yarn, or pnpm:
        </p>
        <CodeBlock
          code={`npm install timepicker-ui

yarn add timepicker-ui

pnpm add timepicker-ui`}
          language="bash"
        />
      </Section>

      <Section icon={Package} title="Required Global CSS">
        <p className="text-muted-foreground mb-4">
          Add this to your global stylesheet to avoid layout issues:
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

      <Section icon={FileCode} title="Import Styles">
        <p className="text-muted-foreground mb-4">
          Import the library styles in your main entry file:
        </p>
        <CodeBlock
          code={`import "timepicker-ui/main.css";`}
          language="typescript"
        />
      </Section>

      <Section icon={Globe} title="CDN">
        <p className="text-muted-foreground mb-4">
          For quick prototyping, use the CDN version:
        </p>
        <CodeBlock
          code={`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/timepicker-ui@4.4.0/dist/css/main.css">
<script src="https://cdn.jsdelivr.net/npm/timepicker-ui@4.4.0/dist/index.umd.js"></script>
<script>
  // The UMD build exposes the class as the global TimepickerUI
  const picker = new TimepickerUI('#timepicker');
  picker.create();
</script>`}
          language="html"
        />
      </Section>

      <InfoBox title="Ready for the next step?" variant="emerald">
        Check out the{" "}
        <Link
          href="/docs/quick-start"
          className="text-primary hover:underline font-medium"
        >
          Quick Start
        </Link>{" "}
        guide to start building with Timepicker-UI
      </InfoBox>
    </div>
  );
}
