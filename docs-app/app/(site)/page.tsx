import Link from "next/link";
import { Anatomy, type AnatomyNote } from "@/components/anatomy";
import { ApiTable } from "@/components/api-table";
import { formatBytes } from "@/components/bundleStats/types";
import { FrameworkTabs } from "@/components/home/framework-tabs";
import { ThemeFigure } from "@/components/home/theme-figure";
import { InstallCommand } from "@/components/install-command";
import { TimepickerExample } from "@/components/timepicker-example";
import { getStarCount } from "@/lib/github";
import { ISSUES_URL, LIBRARY_VERSION, NPM_URL, REPO, REPO_URL } from "@/lib/site";
import bundleData from "@/public/bundle-data.json";
import styles from "./home.module.css";

const NOTES: AnatomyNote[] = [
  { selector: ".tp-ui-select-time", side: "left", code: "labels.clockTitle", text: "Header text. Every label is an option." },
  { selector: ".tp-ui-hour", side: "left", code: "clock.incrementHours", text: "Hour step: 1, 2, 3, 4 or 6." },
  { selector: ".tp-ui-clock-face", side: "left", code: "ui.mode", text: "'clock', 'wheel' or 'compact-wheel'." },
  { selector: ".tp-ui-cancel-btn, .tp-ui-ok-btn", side: "left", code: "labels.ok · labels.cancel", text: "Button text. Optional in inline mode." },
  { selector: ".tp-ui-type-mode, .tp-ui-am", side: "right", code: "clock.type", text: "'12h', '24h' or 'auto' from the locale." },
  { selector: ".tp-ui-minutes", side: "right", code: "clock.incrementMinutes", text: "Minute step, for example 5 or 15." },
  { selector: ".tp-ui-clock-hand", side: "right", code: "clock.discreteHourJump", text: "The hour hand jumps from hour to hour while you drag." },
  { selector: ".tp-ui-wrapper", side: "right", code: ".tp-ui-wrapper", text: "Root class. Every part has a stable tp-ui- class." },
];

const HERO_OPTIONS = { ui: { inline: { enabled: true, showButtons: true } } };

const HERO_CODE = `new TimepickerUI(input, {
  ui: { inline: { enabled: true, container: '#picker', showButtons: true } },
}).create();`;

const MODES = [
  { label: "Fig. 2a", name: "Clock", mode: "clock", wheel: false },
  { label: "Fig. 2b", name: "Wheel", mode: "wheel", wheel: true },
  { label: "Fig. 2c", name: "Compact wheel", mode: "compact-wheel", wheel: true },
] as const;

const PART_ROWS = [
  { no: "01", feature: "12-hour, 24-hour, or the browser's choice", option: <code>clock.type</code>, docs: <Link href="/docs/features/clock-format">12h/24h Format</Link> },
  { no: "02", feature: "Seconds field, wheel column and clock face", option: <code>clock.showSeconds</code>, docs: <Link href="/docs/features/seconds">Seconds</Link> },
  { no: "03", feature: "Hours, minutes or ranges that can't be picked", option: <code>clock.disabledTime</code>, docs: <Link href="/docs/features/disabled-time">Disabled Time</Link> },
  { no: "04", feature: "Render in the page instead of a modal", option: <code>ui.inline</code>, docs: <Link href="/docs/features/inline-mode">Inline Mode</Link> },
  { no: "05", feature: "Layout for phones", option: <code>ui.mobile</code>, docs: <Link href="/docs/features/mobile">Mobile Support</Link> },
  { no: "06", feature: "Button that clears the value", option: <code>ui.clearButton</code>, docs: <Link href="/docs/features/clear-button">Clear Button</Link> },
  { no: "07", feature: "Every text, in any language", option: <code>labels.*</code>, docs: <Link href="/docs/advanced/localization">Localization</Link> },
  { no: "08", feature: "Keyboard, focus trap and screen-reader labels", option: "built in", docs: <Link href="/docs/advanced/accessibility">Accessibility</Link> },
  { no: "09", feature: "Events for every selection", option: <><code>callbacks.*</code>, <code>picker.on()</code></>, docs: <Link href="/docs/api/events">Events</Link> },
  { no: "10", feature: "Types for every option and event", option: "included", docs: <Link href="/docs/api/typescript">TypeScript</Link> },
];

const rollup = bundleData.results.rollup;
const coreGzip = rollup.core.files.find((file) => file.name === "core-only.min.js")?.gzip;
const lazyGzip = (name: string) => rollup.lazy.files.find((file) => file.name === name)?.gzip;

const PLUGINS = [
  { name: "Range", text: "Start and end time in one picker, with a minimum and maximum duration.", importLine: "import { RangePlugin } from 'timepicker-ui/plugins/range';", gzip: lazyGzip("plugin-range.js") },
  { name: "Timezone", text: "A timezone dropdown next to the time, with keyboard support.", importLine: "import { TimezonePlugin } from 'timepicker-ui/plugins/timezone';", gzip: lazyGzip("plugin-timezone.js") },
  { name: "Wheel", text: "The scroll wheel and compact-wheel modes from Fig. 2.", importLine: "import { WheelPlugin } from 'timepicker-ui/plugins/wheel';", gzip: undefined },
];

const RANGE_CODE = `import { TimepickerUI, PluginRegistry } from 'timepicker-ui';
import { RangePlugin } from 'timepicker-ui/plugins/range';

PluginRegistry.register(RangePlugin);
new TimepickerUI(input, { range: { enabled: true, minDuration: 30 } }).create();`;

export default async function HomePage() {
  const stars = await getStarCount();

  return (
    <main id="main-content" className={styles.main}>
      <section className={styles.hero} aria-labelledby="home-title">
        <div className={styles.inner}>
          <div className={styles.head}>
            <h1 id="home-title" className={styles.display}>
              A time picker you can configure part by part.
            </h1>
            <div>
              <p className={styles.lede}>
                Each part of the picker maps to one option or one <code>tp-ui-</code> class. Analog clock,
                scroll wheel or compact wheel. No dependencies, 12 themes, TypeScript types, safe to render on
                the server.
              </p>
              <div className={styles.actions}>
                <Link href="/docs/quick-start" className={styles.primary}>
                  Get started
                </Link>
                <InstallCommand />
              </div>
            </div>
          </div>
          <Anatomy
            notes={NOTES}
            options={HERO_OPTIONS}
            label="Fig. 1"
            caption="Analog mode with the default theme. Drag the hand or type a time."
            code={HERO_CODE}
          />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="modes-title">
        <div className={styles.inner}>
          <div className={styles.head}>
            <h2 id="modes-title" className={styles.h2}>Three modes, one option</h2>
            <p className={styles.text}>
              The analog clock is built in. The scroll wheel and the compact wheel come from the wheel plugin,
              so they only reach your bundle when you import it.
            </p>
          </div>
          <div className={styles.views}>
            {MODES.map((item) => (
              <TimepickerExample
                key={item.mode}
                label={item.label}
                caption={
                  <>
                    {item.name} <code>{`ui: { mode: '${item.mode}' }`}</code>
                  </>
                }
                code={`new TimepickerUI(input, { ui: { mode: '${item.mode}' } }).create();`}
                options={{ ui: { mode: item.mode } }}
                plugins={item.wheel ? ["wheel"] : []}
                showCode={false}
              />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="themes-title">
        <div className={styles.inner}>
          <div className={styles.head}>
            <h2 id="themes-title" className={styles.h2}>Twelve themes</h2>
            <p className={styles.text}>
              Each theme is a CSS file that sets the picker&apos;s custom properties. Pick one here, or write
              your own on top of <code>main.css</code>.
            </p>
          </div>
          <ThemeFigure />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="parts-title">
        <div className={styles.inner}>
          <div className={styles.head}>
            <h2 id="parts-title" className={styles.h2}>What the picker does</h2>
            <p className={styles.text}>
              Every feature has an option and a page in the docs. Options are grouped by what they change:{" "}
              <code>clock</code>, <code>ui</code>, <code>labels</code>, <code>behavior</code>,{" "}
              <code>callbacks</code>.
            </p>
          </div>
          <ApiTable
            columns={[
              { key: "no", label: "No." },
              { key: "feature", label: "Feature" },
              { key: "option", label: "Option" },
              { key: "docs", label: "Docs" },
            ]}
            rows={PART_ROWS}
            rowKey="no"
            caption={
              <>
                <strong>Table 1</strong> Features and the options that control them.{" "}
                <Link href="/docs/api/options">All options</Link>
              </>
            }
          />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="plugins-title">
        <div className={styles.inner}>
          <div className={styles.head}>
            <h2 id="plugins-title" className={styles.h2}>Plugins you import when you need them</h2>
            <p className={styles.text}>
              Register a plugin once and its options start working. Sizes are min + gzip from the{" "}
              <Link href="/bundle-stats">bundle analysis</Link>
              {coreGzip !== undefined && <>. The core is {formatBytes(coreGzip)}</>}.
            </p>
          </div>
          <div className={styles.plugins}>
            <dl className={styles.pluginList}>
              {PLUGINS.map((plugin) => (
                <div key={plugin.name} className={styles.pluginRow}>
                  <dt>{plugin.name}</dt>
                  <dd>
                    {plugin.text}
                    <code className={styles.importLine}>{plugin.importLine}</code>
                  </dd>
                  <dd className={styles.size}>
                    {plugin.gzip !== undefined ? formatBytes(plugin.gzip) : <Link href="/bundle-stats">Bundle analysis</Link>}
                  </dd>
                </div>
              ))}
            </dl>
            <TimepickerExample
              label="Fig. 4"
              caption="Range plugin, at least 30 minutes."
              code={RANGE_CODE}
              options={{ range: { enabled: true, minDuration: 30 } }}
              plugins={["range"]}
              showCode={false}
            />
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="frameworks-title">
        <div className={styles.inner}>
          <div className={styles.head}>
            <h2 id="frameworks-title" className={styles.h2}>Works where your app runs</h2>
            <p className={styles.text}>
              The core is plain TypeScript with no DOM access at import time, so it runs under Next.js, Nuxt and
              other SSR setups. React has its own wrapper.
            </p>
          </div>
          <FrameworkTabs />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="datepicker-title">
        <div className={styles.inner}>
          <div className={styles.head}>
            <h2 id="datepicker-title" className={styles.h2}>Need dates too? datepicker-ui</h2>
            <div>
              <p className={styles.text}>
                <code>@pglejzer/datepicker-ui</code> is the companion date picker. It has the same architecture,
                follows Material Design 3 and ships ten themes named like the timepicker ones. It opens as a docked
                popover, a modal dialog or an inline calendar, for one date, a range or several dates.
              </p>
              <Link href="/datepicker" className={styles.secondary}>
                Date picker docs
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="oss-title">
        <div className={`${styles.inner} ${styles.split}`}>
          <div>
            <h2 id="oss-title" className={styles.h2}>Open source, MIT</h2>
            <p className={styles.text}>
              Written and maintained by one developer. No runtime dependencies, no telemetry. Bugs and ideas go
              to GitHub issues. Every release is listed in the changelog.
            </p>
            <a href={REPO_URL} target="_blank" rel="noreferrer" className={styles.primary}>
              Star on GitHub
            </a>
          </div>
          <ul className={styles.facts}>
            <li>
              <a href={REPO_URL} target="_blank" rel="noreferrer">GitHub repository</a>
              <span>{stars === null ? REPO : `${stars.toLocaleString("en-US")} stars`}</span>
            </li>
            <li>
              <a href={NPM_URL} target="_blank" rel="noreferrer">npm package</a>
              <span>timepicker-ui</span>
            </li>
            <li>
              <Link href="/docs/changelog">Changelog</Link>
              <span>{LIBRARY_VERSION}</span>
            </li>
            <li>
              <Link href="/docs/roadmap">Roadmap</Link>
              <span>5.0</span>
            </li>
            <li>
              <a href={ISSUES_URL} target="_blank" rel="noreferrer">Report a bug</a>
              <span>issues</span>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
