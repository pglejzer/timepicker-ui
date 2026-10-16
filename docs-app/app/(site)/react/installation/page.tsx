import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/page-header";
import { Callout } from "@/components/callout";
import { CodeBlock } from "@/components/code-block";
import { InstallCommand } from "@/components/install-command";

export const metadata = buildMetadata({
  title: "React Installation",
  description:
    "Install timepicker-ui-react - the official React time picker wrapper. SSR-safe and fully typed, works with Next.js, Remix and Vite.",
  path: "/react/installation",
});

export default function InstallationPage() {
  return (
    <div>
      <PageHeader
        title="Installation"
        description="Install timepicker-ui-react in your project using npm, yarn, or pnpm"
      />

      <h2>Package Manager</h2>
      <p>Choose your preferred package manager:</p>
      <dl>
        <div>
          <dt>npm</dt>
          <dd>
            <InstallCommand command="npm install timepicker-ui-react" />
          </dd>
        </div>
        <div>
          <dt>yarn</dt>
          <dd>
            <InstallCommand command="yarn add timepicker-ui-react" />
          </dd>
        </div>
        <div>
          <dt>pnpm</dt>
          <dd>
            <InstallCommand command="pnpm add timepicker-ui-react" />
          </dd>
        </div>
      </dl>

      <Callout title="Automatic Dependency">
        <code>timepicker-ui</code> is automatically installed as a dependency.
        You don&apos;t need to install it separately.
      </Callout>

      <h2>Requirements</h2>
      <ul>
        <li>
          <strong>React:</strong> 17.0.0 or higher
        </li>
        <li>
          <strong>React DOM:</strong> 17.0.0 or higher
        </li>
        <li>
          <strong>timepicker-ui:</strong> installed with{" "}
          <code>timepicker-ui-react</code> as a dependency
        </li>
      </ul>

      <h2>Import Styles</h2>
      <p>Import the required CSS in your component or global styles:</p>
      <CodeBlock code={`import "timepicker-ui/main.css";`} language="typescript" />

      <h2>Next Steps</h2>
      <dl>
        <div>
          <dt>
            <Link href="/react/quick-start">Quick Start</Link>
          </dt>
          <dd>Create your first timepicker component</dd>
        </div>
        <div>
          <dt>
            <Link href="/react/examples">View Examples</Link>
          </dt>
          <dd>Explore interactive demos</dd>
        </div>
      </dl>
    </div>
  );
}
