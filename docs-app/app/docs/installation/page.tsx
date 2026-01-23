import { CodeBlock } from "@/components/code-block";
import { Section } from "@/components/section";
import { InfoBox } from "@/components/info-box";
import { Terminal, Package, FileCode, Globe } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Installation - Timepicker-UI",
  description: "Install and set up Timepicker-UI in your project",
};

export default function InstallationPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Installation</h1>
        <p className="text-lg text-muted-foreground">
          Get started with Timepicker-UI in your project
        </p>
      </div>

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
          code={`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/timepicker-ui@3.2.0/dist/css/main.css">
<script src="https://cdn.jsdelivr.net/npm/timepicker-ui@3.2.0/dist/index.js"></script>`}
          language="html"
        />
      </Section>

      <InfoBox title="Ready for the next step?" emoji="✅" variant="purple">
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
