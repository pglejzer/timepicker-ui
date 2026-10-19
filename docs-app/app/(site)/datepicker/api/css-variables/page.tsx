import Link from "next/link";
import { ApiTable } from "@/components/api-table";
import { CodeBlock } from "@/components/code-block";
import { DatepickerExample } from "@/components/datepicker-example";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import type { DatepickerOptions } from "@pglejzer/datepicker-ui";
import { withCode } from "../api-helpers";
import { BRAND_CODE, BRAND_CSS, VARIABLE_GROUPS } from "./css-variables-data";

const BRAND_OPTIONS: DatepickerOptions = { ui: { cssClass: "brand" } };

const VARIABLE_COUNT = VARIABLE_GROUPS.reduce((total, group) => total + group.rows.length, 0);

export default function DatepickerCssVariablesPage() {
  return (
    <div>
      <style>{BRAND_CSS}</style>

      <PageHeader
        title="CSS Variables"
        description={
          <>
            All {VARIABLE_COUNT} <code>--dp-ui-*</code> variables of <code>@pglejzer/datepicker-ui</code>, the
            companion of timepicker-ui, with their default values.
          </>
        }
      />

      <p>
        System tokens follow the Material Design 3 roles. Component tokens derive from them, so changing{" "}
        <code>--dp-ui-sys-color-primary</code> recolors the selected day, the buttons and the focus ring at once.
        The defaults below are the values of the <code>basic</code> theme in <code>main.css</code>. The other
        themes set their own values.
      </p>

      <Section title="Set a custom theme">
        <p>
          Add your own selector with <code>ui.cssClass</code> and set variables on it. The class is added to the
          surface root, which is the <code>&lt;dialog&gt;</code> for a modal and the{" "}
          <code>.dp-ui__container</code> element otherwise. Open the field to try the teal theme from the rule
          below.
        </p>
        <CodeBlock code={BRAND_CSS} language="css" />
        <DatepickerExample label="Custom theme" options={BRAND_OPTIONS} code={BRAND_CODE} />
        <p>
          The classes you can combine with these variables are on{" "}
          <Link href="/datepicker/api/css-classes">CSS Classes</Link>, and the themes are on{" "}
          <Link href="/datepicker/docs/themes">Themes</Link>.
        </p>
      </Section>

      {VARIABLE_GROUPS.map((group) => (
        <Section key={group.title} title={group.title}>
          {group.intro && <p>{withCode(group.intro)}</p>}
          <ApiTable
            columns={[
              { key: "name", label: "Variable" },
              { key: "value", label: "Default", mono: true },
            ]}
            rows={group.rows.map((row) => ({
              id: row.name,
              name: <code>{row.name}</code>,
              value: <code>{row.value}</code>,
            }))}
            rowKey="id"
          />
        </Section>
      ))}

      <Section title="Set by the picker">
        <p>
          With <code>calendar.months</code> above 1, the container gets <code>dp-ui__container--multi-month</code>{" "}
          and an inline <code>--dp-ui-visible-months</code> property that holds the number of months shown. Read it
          in your own CSS if you need it, and do not set it.
        </p>
      </Section>
    </div>
  );
}
