import Link from "next/link";
import { ApiTable } from "@/components/api-table";
import { Callout } from "@/components/callout";
import { CodeBlock } from "@/components/code-block";
import { InstallCommand } from "@/components/install-command";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";

const CSS_ROWS = [
  {
    id: "index",
    file: <code>@pglejzer/datepicker-ui/index.css</code>,
    contains: "The core and every theme",
  },
  {
    id: "main",
    file: <code>@pglejzer/datepicker-ui/main.css</code>,
    contains: (
      <>
        The core only, which is enough for <code>basic</code>
      </>
    ),
  },
  {
    id: "theme",
    file: <code>@pglejzer/datepicker-ui/theme-m3-green.css</code>,
    contains: (
      <>
        One theme, to load next to <code>main.css</code>
      </>
    ),
  },
];

const THEME_FILES = [
  "theme-m3-green.css",
  "theme-crane.css",
  "theme-crane-straight.css",
  "theme-m2.css",
  "theme-glassmorphic.css",
  "theme-pastel.css",
  "theme-ai.css",
  "theme-cyberpunk.css",
  "theme-blueprint.css",
];

const UNPKG_CODE = `<link
  rel="stylesheet"
  href="https://unpkg.com/@pglejzer/datepicker-ui/dist/css/index.css"
/>
<script src="https://unpkg.com/@pglejzer/datepicker-ui/dist/umd/index.js"></script>
<script>
  new DatepickerUI("#date").create();
</script>`;

const JSDELIVR_CODE = `<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@pglejzer/datepicker-ui/dist/css/index.css"
/>
<script src="https://cdn.jsdelivr.net/npm/@pglejzer/datepicker-ui/dist/umd/index.js"></script>`;

const TYPES_CODE = `import DatepickerUI, {
  type DatepickerOptions,
  type PickerValue,
} from "@pglejzer/datepicker-ui";

const options: DatepickerOptions = {
  calendar: { mode: "range" },
};

const picker = new DatepickerUI("#date", options);
picker.create();

const value: PickerValue | null = picker.getValue();`;

export default function DatepickerInstallationPage() {
  return (
    <div>
      <PageHeader
        title="Installation"
        description="Install @pglejzer/datepicker-ui, the date picker companion of timepicker-ui, and load its CSS."
      />

      <Section title="Package manager">
        <p>
          The package has no dependencies. Install it with the package manager your project uses:
        </p>
        <dl>
          <div>
            <dt>npm</dt>
            <dd>
              <InstallCommand command="npm install @pglejzer/datepicker-ui" />
            </dd>
          </div>
          <div>
            <dt>yarn</dt>
            <dd>
              <InstallCommand command="yarn add @pglejzer/datepicker-ui" />
            </dd>
          </div>
          <div>
            <dt>pnpm</dt>
            <dd>
              <InstallCommand command="pnpm add @pglejzer/datepicker-ui" />
            </dd>
          </div>
        </dl>
      </Section>

      <Section title="Import the styles">
        <p>
          The picker needs its stylesheet. Import <code>index.css</code> to get every theme, or{" "}
          <code>main.css</code> plus the theme files you use.
        </p>
        <ApiTable
          columns={[
            { key: "file", label: "Import" },
            { key: "contains", label: "Contains" },
          ]}
          rows={CSS_ROWS}
          rowKey="id"
          caption="CSS entry points of the package."
        />
        <p>The theme files are:</p>
        <ul>
          {THEME_FILES.map((file) => (
            <li key={file}>
              <code>{file}</code>
            </li>
          ))}
        </ul>
        <CodeBlock
          code={`import "@pglejzer/datepicker-ui/main.css";
import "@pglejzer/datepicker-ui/theme-m2.css";`}
          language="typescript"
        />
        <p>
          Set <code>ui.theme</code> to the matching name, for example <code>&quot;m2&quot;</code>. See{" "}
          <Link href="/datepicker/docs/themes">Themes</Link> for the color scheme and custom themes.
        </p>
      </Section>

      <Section title="CDN">
        <p>
          The UMD build exposes the class itself as the global <code>DatepickerUI</code>. From unpkg:
        </p>
        <CodeBlock code={UNPKG_CODE} language="html" />
        <p>jsDelivr serves the same files:</p>
        <CodeBlock code={JSDELIVR_CODE} language="html" />
      </Section>

      <Section title="TypeScript">
        <p>
          Types ship in the package, so there is nothing else to install. <code>DatepickerUI</code> is the default
          export and also a named export, and every option, value and event payload has an exported type.
        </p>
        <CodeBlock code={TYPES_CODE} language="typescript" />
        <p>
          The full list is on the <Link href="/datepicker/api/typescript">TypeScript</Link> page.
        </p>
      </Section>

      <Section title="Server rendering">
        <p>
          Importing the package does not touch <code>window</code> or <code>document</code>, so it is safe to
          import on the server. The constructor needs a document, so create the picker on the client after the
          input is mounted and call <code>destroy()</code> when it unmounts.
        </p>
        <Callout title="Frameworks">
          React, Next.js, Vue, Svelte and Angular setups are on{" "}
          <Link href="/datepicker/docs/frameworks">Frameworks and SSR</Link>.
        </Callout>
      </Section>

      <h2>Next steps</h2>
      <dl>
        <div>
          <dt>
            <Link href="/datepicker/quick-start">Quick Start</Link>
          </dt>
          <dd>Create your first picker</dd>
        </div>
        <div>
          <dt>
            <Link href="/datepicker/examples">Examples</Link>
          </dt>
          <dd>Live demos with code</dd>
        </div>
      </dl>
    </div>
  );
}
