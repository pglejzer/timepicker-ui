import Link from "next/link";
import type { DatepickerOptions } from "@pglejzer/datepicker-ui";
import { buildMetadata } from "@/lib/metadata";
import { DATEPICKER_NPM_URL, DATEPICKER_REPO_URL, DATEPICKER_VERSION } from "@/lib/datepicker";
import { DatepickerSoftwareApplicationJsonLd, JsonLdBreadcrumb } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { DatepickerExample } from "@/components/datepicker-example";

export const metadata = buildMetadata({
  title: "JavaScript Date Picker (datepicker-ui)",
  description:
    "@pglejzer/datepicker-ui is a zero-dependency JavaScript date picker, the companion of timepicker-ui: docked, modal or inline, with ranges and ten themes.",
  path: "/datepicker",
});

const FEATURES = [
  "Docked popover, modal dialog and inline display",
  "Single date, date range and multiple dates",
  "Typed input with an opt-in mask, and a switch between the calendar and the input view",
  "Month and year selection, plus drag and wheel paging between months",
  "Several months side by side, range presets, and a range in two page inputs",
  "Month-only and year-only pickers",
  "Per-day content such as prices, and field validation with your own rules",
  "Keyboard and screen reader support, with every text available as a label",
  "Ten themes, with light and dark detection",
  "RTL and any Intl locale, with day, week and year numbers in the locale's digits",
  "Form integration through a hidden ISO value",
  "No dependencies",
];

const QUICK_START: DatepickerOptions = {
  calendar: { minDate: "today" },
  ui: { theme: "m3-green" },
};

const QUICK_START_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

const picker = new DatepickerUI("#date", {
  calendar: { minDate: "today" },
  ui: { theme: "m3-green" },
  callbacks: {
    onConfirm: ({ value }) => console.log(value),
  },
});

picker.create();`;

export default function DatepickerPage() {
  return (
    <div>
      <JsonLdBreadcrumb pathname="/datepicker" />
      <DatepickerSoftwareApplicationJsonLd />
      <PageHeader
        badge="Companion of timepicker-ui"
        title="datepicker-ui"
        description="A date picker for the web that follows Material Design 3, from the author of timepicker-ui."
      />

      <p>
        <code>@pglejzer/datepicker-ui</code> is a zero-dependency, framework-agnostic date picker written in
        TypeScript and safe to import during server rendering. It is the companion of timepicker-ui: the same
        architecture, theme names shared with the time picker, and an options object split into groups. These
        pages document version {DATEPICKER_VERSION}.
      </p>

      <h2>Features</h2>
      <ul>
        {FEATURES.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>

      <h2>Try it</h2>
      <p>
        The demo uses the quick start options: days before today are disabled and the <code>m3-green</code> theme
        is applied. Pick another theme from the menu, or switch the preview to an inline calendar.
      </p>
      <DatepickerExample label="Quick start" options={QUICK_START} code={QUICK_START_CODE} themeControl />

      <h2>Links</h2>
      <dl>
        <div>
          <dt>
            <a href={DATEPICKER_NPM_URL} target="_blank" rel="noopener noreferrer">
              npm package
            </a>
          </dt>
          <dd>
            <code>@pglejzer/datepicker-ui</code> on the npm registry
          </dd>
        </div>
        <div>
          <dt>
            <a href={DATEPICKER_REPO_URL} target="_blank" rel="noopener noreferrer">
              GitHub repository
            </a>
          </dt>
          <dd>Source code and issues</dd>
        </div>
        <div>
          <dt>
            <Link href="/datepicker/examples">Examples</Link>
          </dt>
          <dd>Live demos with the code next to them</dd>
        </div>
      </dl>

      <h2>Next steps</h2>
      <dl>
        <div>
          <dt>
            <Link href="/datepicker/installation">Installation</Link>
          </dt>
          <dd>Install the package from npm or load it from a CDN</dd>
        </div>
        <div>
          <dt>
            <Link href="/datepicker/quick-start">Quick Start</Link>
          </dt>
          <dd>Create your first picker and learn the five option groups</dd>
        </div>
        <div>
          <dt>
            <Link href="/datepicker/docs/display-modes">Guides</Link>
          </dt>
          <dd>Display modes, selection modes, typed input, themes and localization</dd>
        </div>
        <div>
          <dt>
            <Link href="/datepicker/api/options">API reference</Link>
          </dt>
          <dd>Every option, method, event, CSS class and CSS variable</dd>
        </div>
        <div>
          <dt>
            <Link href="/datepicker/examples">Examples</Link>
          </dt>
          <dd>Ranges, constraints, month and year pickers, themes and more</dd>
        </div>
        <div>
          <dt>
            <Link href="/datepicker/docs/with-timepicker">Date and Time</Link>
          </dt>
          <dd>Use datepicker-ui and timepicker-ui together for a date and a time</dd>
        </div>
      </dl>
    </div>
  );
}
