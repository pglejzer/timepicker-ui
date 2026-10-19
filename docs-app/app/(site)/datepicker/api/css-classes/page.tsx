import Link from "next/link";
import { ApiTable } from "@/components/api-table";
import { CodeBlock } from "@/components/code-block";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { withCode } from "../api-helpers";

type ClassRow = { classes: string[]; element: string };

type ClassGroup = { title: string; intro?: string; rows: ClassRow[] };

const GROUPS: ClassGroup[] = [
  {
    title: "Host and surface",
    intro:
      "The host wraps your input. The surface is the picker itself: the `<dialog>` for a modal and the `.dp-ui__container` element otherwise.",
    rows: [
      { classes: ["dp-ui"], element: "Host element around the input." },
      { classes: ["dp-ui--error"], element: "Host while the typed text is invalid." },
      { classes: ["dp-ui__container"], element: "Surface root." },
      {
        classes: ["dp-ui__container--docked", "dp-ui__container--modal", "dp-ui__container--inline"],
        element: "Surface kind.",
      },
      {
        classes: ["dp-ui__container--range", "dp-ui__container--fullscreen"],
        element: "Range picker, and its full-screen form.",
      },
      {
        classes: [
          "dp-ui__container--menu-open",
          "dp-ui__container--input",
          "dp-ui__container--morphing",
          "dp-ui__container--rtl",
        ],
        element: "Month or year menu open, input view, view change in progress, right-to-left.",
      },
      { classes: ["dp-ui__dialog"], element: "The `<dialog>` of a modal picker." },
    ],
  },
  {
    title: "Header and navigation",
    rows: [
      {
        classes: ["dp-ui__header", "dp-ui__header--docked", "dp-ui__header--modal", "dp-ui__header--range"],
        element: "Header.",
      },
      { classes: ["dp-ui__supporting-text", "dp-ui__headline"], element: "Header texts." },
      { classes: ["dp-ui__navigation", "dp-ui__navigation-group"], element: "Month and year controls." },
      { classes: ["dp-ui__navigation--year-grid"], element: "Navigation while the year grid is shown." },
      {
        classes: ["dp-ui__icon-button", "dp-ui__menu-button", "dp-ui__text-button"],
        element:
          "Buttons, with a modifier for each one such as `--prev-month`, `--next-month`, `--switch-view`, `--close`, `--today`, `--clear`, `--cancel`, `--confirm` and `--save`.",
      },
    ],
  },
  {
    title: "Calendar and days",
    rows: [
      { classes: ["dp-ui__calendar", "dp-ui__content"], element: "Calendar body." },
      {
        classes: ["dp-ui__pager", "dp-ui__pager--swipe", "dp-ui__pager--dragging", "dp-ui__pager-track", "dp-ui__page"],
        element: "Month paging.",
      },
      {
        classes: ["dp-ui__weekdays", "dp-ui__weekday", "dp-ui__week-number-header"],
        element: "Weekday row.",
      },
      {
        classes: ["dp-ui__month-grid", "dp-ui__week", "dp-ui__week-number"],
        element: "Day table, rows and week numbers.",
      },
      {
        classes: [
          "dp-ui__date",
          "dp-ui__date--selected",
          "dp-ui__date--today",
          "dp-ui__date--disabled",
          "dp-ui__date--outside-month",
          "dp-ui__date--empty",
          "dp-ui__date--range-start",
          "dp-ui__date--range-end",
          "dp-ui__date--in-range",
        ],
        element: "Day cell and its states.",
      },
      {
        classes: ["dp-ui__date-indicator", "dp-ui__date-badge"],
        element: "Day circle, and the badge dot from `calendar.decorateDate`.",
      },
      {
        classes: ["dp-ui__date-content", "dp-ui__date--has-content"],
        element: "Text or node from `calendar.renderDate`, and the cell that has it.",
      },
    ],
  },
  {
    title: "Several months, presets and range",
    rows: [
      {
        classes: ["dp-ui__container--multi-month", "dp-ui__months", "dp-ui__navigation--months"],
        element:
          "Several months: the container (with `--dp-ui-visible-months` set inline), a page of months, and the range arrows row.",
      },
      {
        classes: ["dp-ui__presets", "dp-ui__preset", "dp-ui__container--presets"],
        element: "Range presets, and the container when they show as a column.",
      },
      {
        classes: ["dp-ui__range", "dp-ui__weekdays-bar", "dp-ui__month-list", "dp-ui__month-subhead"],
        element: "Range calendar.",
      },
      {
        classes: ["dp-ui__input--active"],
        element:
          "Page input that the next pick fills, with `ui.endInput`. Added to your input and not styled by the picker.",
      },
    ],
  },
  {
    title: "Menus and grids",
    rows: [
      {
        classes: ["dp-ui__menu", "dp-ui__menu--month", "dp-ui__menu--year", "dp-ui__menu-item", "dp-ui__menu-item--selected"],
        element: "Month and year menus.",
      },
      {
        classes: [
          "dp-ui__month-selection",
          "dp-ui__month-selection-item",
          "dp-ui__month-selection-item--selected",
          "dp-ui__month-selection-item--current",
        ],
        element: 'Month grid, for month precision and `startView: "month"` in a modal.',
      },
      {
        classes: [
          "dp-ui__year-selection",
          "dp-ui__year-selection-item",
          "dp-ui__year-selection-item--selected",
          "dp-ui__year-selection-item--current",
        ],
        element: "Year grid.",
      },
    ],
  },
  {
    title: "Input view, footer and helpers",
    rows: [
      {
        classes: [
          "dp-ui__input-panel",
          "dp-ui__text-field",
          "dp-ui__text-field-input",
          "dp-ui__text-field-label",
          "dp-ui__text-field-supporting",
          "dp-ui__text-field--error",
        ],
        element: "Input view.",
      },
      {
        classes: ["dp-ui__actions", "dp-ui__actions-start", "dp-ui__actions-end"],
        element: "Footer.",
      },
      {
        classes: ["dp-ui__live-region", "dp-ui__visually-hidden"],
        element: "Screen reader announcements and hidden text.",
      },
      { classes: ["dp-ui__form-value"], element: "The hidden form input." },
    ],
  },
];

const ATTRIBUTE_ROWS = [
  {
    attribute: 'data-theme="<name>"',
    element: "The theme name, written on the host and on the surface root.",
  },
  {
    attribute: 'data-color-scheme="light" | "dark"',
    element: "The color scheme, written on the host and on the surface root.",
  },
  {
    attribute: 'data-positioning="anchor" | "fallback"',
    element: "On a docked picker. `anchor` is CSS anchor positioning and `fallback` is the JavaScript placement.",
  },
  {
    attribute: "data-placement",
    element: "On a docked picker. The placement of the popover.",
  },
];

const SELECTOR_CODE = `new DatepickerUI("#date", { ui: { cssClass: "brand" } }).create();`;

const CSS_CODE = `.brand .dp-ui__date--today {
  font-style: italic;
}

.dp-ui__input--active {
  border-color: #6750a4;
  box-shadow: inset 0 0 0 1px #6750a4;
}

[data-theme="crane"] .dp-ui__date--selected {
  border-radius: 4px;
}`;

function ClassList({ classes }: { classes: string[] }) {
  return (
    <>
      {classes.map((name, index) => (
        <span key={name}>
          {index > 0 && " "}
          <code>{name}</code>
        </span>
      ))}
    </>
  );
}

export default function DatepickerCssClassesPage() {
  return (
    <div>
      <PageHeader
        title="CSS Classes"
        description={
          <>
            The <code>dp-ui</code> classes <code>@pglejzer/datepicker-ui</code> renders, the companion of
            timepicker-ui, and the attributes it sets.
          </>
        }
      />

      <p>
        The picker uses the block <code>dp-ui</code> with BEM elements and modifiers. Change colors, sizes and
        shapes with the <Link href="/datepicker/api/css-variables">CSS variables</Link> first, and target these
        classes for what the variables do not cover.
      </p>

      {GROUPS.map((group) => (
        <Section key={group.title} title={group.title}>
          {group.intro && <p>{withCode(group.intro)}</p>}
          <ApiTable
            columns={[
              { key: "classes", label: "Class" },
              { key: "element", label: "Element" },
            ]}
            rows={group.rows.map((row) => ({
              id: row.classes[0],
              classes: <ClassList classes={row.classes} />,
              element: withCode(row.element),
            }))}
            rowKey="id"
          />
        </Section>
      ))}

      <Section title="Data attributes">
        <p>
          The theme and the color scheme are attributes, not classes. A docked picker also carries two attributes
          for its position.
        </p>
        <ApiTable
          columns={[
            { key: "attribute", label: "Attribute" },
            { key: "element", label: "Set on" },
          ]}
          rows={ATTRIBUTE_ROWS.map((row) => ({
            id: row.attribute,
            attribute: <code>{row.attribute}</code>,
            element: withCode(row.element),
          }))}
          rowKey="id"
        />
      </Section>

      <Section title="Writing selectors">
        <p>
          <code>ui.cssClass</code> adds your own class to the surface root. Start a selector with it to style one
          picker without touching the others. Load your stylesheet after the picker CSS so it wins a tie.
        </p>
        <CodeBlock code={SELECTOR_CODE} language="typescript" />
        <CodeBlock code={CSS_CODE} language="css" />
        <p>
          <code>dp-ui__input--active</code> is added to your own input, and the picker leaves its styling to you.
          Custom themes are covered on <Link href="/datepicker/docs/themes">Themes</Link>.
        </p>
      </Section>
    </div>
  );
}
