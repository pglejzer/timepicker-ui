import Link from "next/link";
import type { DatepickerOptions } from "@pglejzer/datepicker-ui";
import { DatepickerExample } from "@/components/datepicker-example";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { datepickerNav } from "@/lib/nav";
import styles from "./page.module.css";

const EXAMPLES_PREFIX = "/datepicker/examples/";

const CATALOG = datepickerNav
  .map((group) => ({
    title: group.title,
    links: group.links.filter((link) => link.href.startsWith(EXAMPLES_PREFIX)),
  }))
  .filter((group) => group.links.length > 0);

const RANGE: DatepickerOptions = {
  calendar: { mode: "range" },
};

const RANGE_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  calendar: { mode: "range" },
}).create();`;

const INLINE: DatepickerOptions = {
  calendar: { mode: "multiple" },
  ui: { inline: { enabled: true } },
  behavior: { commitOnChange: true },
};

const INLINE_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  calendar: { mode: "multiple" },
  ui: { inline: { enabled: true, container: "#calendar" } },
  behavior: { commitOnChange: true },
}).create();`;

export default function DatepickerExamplesPage() {
  return (
    <div>
      <PageHeader
        title="Date Picker Examples"
        description="Working @pglejzer/datepicker-ui configurations you can copy into your project."
      />

      <p>
        Each example runs live next to its code. Field demos open the picker when you click the input: a docked
        popover on wide screens and a modal dialog on narrow ones. Switch a demo to Inline to see the calendar in
        the page.
      </p>

      <nav aria-label="All datepicker examples" className={styles.catalog}>
        {CATALOG.map((group) => (
          <section key={group.title} className={styles.group}>
            <h2 className={styles.groupTitle}>
              {group.title} <span className={styles.count}>{group.links.length}</span>
            </h2>
            <ul className={styles.links}>
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.title}</Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </nav>

      <Section title="Date range">
        <p>
          Set <code>calendar.mode</code> to <code>&quot;range&quot;</code> to pick a start and an end date in one
          field. More in <Link href="/datepicker/examples/selection/range">Date Range</Link>.
        </p>
        <DatepickerExample label="Range" options={RANGE} code={RANGE_CODE} inputLabel="Dates" />
      </Section>

      <Section title="Inline calendar">
        <p>
          With <code>ui.inline</code> the calendar stays in the page. An inline picker has no footer, so{" "}
          <code>behavior.commitOnChange</code> writes each change to the input. This one selects several dates.
          More in <Link href="/datepicker/examples/basic/inline">Inline Calendar</Link>.
        </p>
        <DatepickerExample label="Inline, multiple" options={INLINE} code={INLINE_CODE} />
      </Section>
    </div>
  );
}
