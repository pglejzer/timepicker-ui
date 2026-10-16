import { CodeBlock } from "@/components/code-block";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/page-header";
import { Callout } from "@/components/callout";
import { Section } from "@/components/section";
import { ApiTable } from "@/components/api-table";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Testing",
  description:
    "Test forms that use timepicker-ui with Testing Library and Playwright: find the picker by role, set a time with the keyboard and check the value.",
  path: "/docs/guides/testing",
});

const ROLE_ROWS = [
  {
    id: "dialog",
    part: "Picker",
    role: <code>dialog</code>,
    name: "Select time. Enter Time in the keyboard view",
    label: (
      <>
        <code>labels.clockTitle</code>, <code>labels.keyboardTitle</code>
      </>
    ),
  },
  {
    id: "hour",
    part: "Hour field",
    role: <code>spinbutton</code>,
    name: "Hour",
    label: <code>labels.hour</code>,
  },
  {
    id: "minute",
    part: "Minute field",
    role: <code>spinbutton</code>,
    name: "Minute",
    label: <code>labels.minute</code>,
  },
  {
    id: "second",
    part: (
      <>
        Second field, with <code>clock.showSeconds</code>
      </>
    ),
    role: <code>spinbutton</code>,
    name: "Second",
    label: <code>labels.second</code>,
  },
  {
    id: "period",
    part: "AM and PM",
    role: (
      <>
        <code>button</code> with <code>aria-pressed</code>
      </>
    ),
    name: "AM, PM",
    label: (
      <>
        <code>labels.am</code>, <code>labels.pm</code>
      </>
    ),
  },
  {
    id: "dial",
    part: "Clock face",
    role: <code>slider</code>,
    name: "Same as the active field: Hour, Minute or Second",
    label: (
      <>
        <code>labels.hour</code>, <code>labels.minute</code>,{" "}
        <code>labels.second</code>
      </>
    ),
  },
  {
    id: "actions",
    part: "OK and Cancel",
    role: <code>button</code>,
    name: "OK, Cancel",
    label: (
      <>
        <code>labels.ok</code>, <code>labels.cancel</code>
      </>
    ),
  },
  {
    id: "clear",
    part: (
      <>
        Clear, with <code>ui.clearButton</code>
      </>
    ),
    role: <code>button</code>,
    name: "Clear",
    label: <code>labels.clear</code>,
  },
  {
    id: "switch",
    part: (
      <>
        View switch, with <code>ui.viewSwitch</code>
      </>
    ),
    role: <code>button</code>,
    name: "Switch to keyboard input, Switch to clock",
    label: (
      <>
        <code>labels.switchToKeyboard</code>,{" "}
        <code>labels.switchToClock</code>
      </>
    ),
  },
  {
    id: "groups",
    part: "Groups around the fields, AM/PM and the clock face",
    role: <code>group</code>,
    name: "Time, Period, Clock",
    label: (
      <>
        <code>labels.timeFields</code>, <code>labels.period</code>,{" "}
        <code>labels.clock</code>
      </>
    ),
  },
  {
    id: "range",
    part: "Range tabs (range plugin)",
    role: (
      <>
        <code>tablist</code> with two <code>tab</code> elements
      </>
    ),
    name: "Range selection. Tabs: From, To",
    label: (
      <>
        <code>labels.range</code>, <code>labels.rangeFrom</code>,{" "}
        <code>labels.rangeTo</code>
      </>
    ),
  },
  {
    id: "timezone",
    part: "Timezone selector (timezone plugin)",
    role: (
      <>
        <code>combobox</code> with a <code>listbox</code> of{" "}
        <code>option</code> elements
      </>
    ),
    name: "Timezone",
    label: <code>labels.timezone</code>,
  },
  {
    id: "wheel",
    part: "Wheel columns (wheel plugin)",
    role: (
      <>
        <code>listbox</code> of <code>option</code> elements
      </>
    ),
    name: "Hour and Minute, plus Period in compact-wheel. Options: Hour 02, Minute 30",
    label: (
      <>
        <code>labels.hour</code>, <code>labels.minute</code>,{" "}
        <code>labels.period</code>
      </>
    ),
  },
  {
    id: "alert",
    part: "Invalid input message, next to the input",
    role: <code>alert</code>,
    name: "Text: Invalid time format",
    label: <code>labels.invalidTimeFormat</code>,
  },
];

export default function TestingPage() {
  return (
    <div>
      <PageHeader
        title="Testing"
        description="Find the picker's controls by role and name, and check the value the input ends up with."
      />

      <p>
        Test the picker from the user&apos;s side: click the input to open
        it, then reach the controls by role and accessible name. Assert on
        the value the input shows at the end. Testing Library&apos;s{" "}
        <a href="https://testing-library.com/docs/queries/about/">
          guiding principle
        </a>{" "}
        is that a test earns more trust the closer it stays to how people
        use the page. A selector built on a <code>tp-ui-*</code> class
        tests the markup rather than what the user sees, so keep classes
        for the few parts that have no role.
      </p>

      <Section title="Roles and names">
        <p>
          The table shows what a 12-hour picker exposes with the default
          English labels. Every name comes from the <code>labels</code>{" "}
          option, so a test for a translated picker uses your strings.
        </p>
        <ApiTable
          columns={[
            { key: "part", label: "Part" },
            { key: "role", label: "Role" },
            { key: "name", label: "Default name" },
            { key: "label", label: "Set with" },
          ]}
          rows={ROLE_ROWS}
          rowKey="id"
        />
        <p>
          The hour, minute and second fields are{" "}
          <code>{'<input type="number">'}</code>. On the clock face view
          they are read-only unless <code>ui.editable</code> is{" "}
          <code>true</code>, so typing into them changes nothing. In the
          keyboard view (<code>{"ui.initialView: 'keyboard'"}</code>) they
          accept typing. These keys work on the fields in both views:
        </p>
        <ul>
          <li>Up and Down arrows: one step. They wrap around at the ends.</li>
          <li>Home and End: the first and the last value.</li>
          <li>
            Page Up and Page Down: 3 hours, or 5 steps on minutes and
            seconds.
          </li>
        </ul>
        <p>
          The clock face takes the same keys for the active field. Enter or
          Space on it moves to the next field.
        </p>
      </Section>

      <Section title="Unit tests (Jest and Testing Library)">
        <p>
          The picker needs a DOM. In Jest&apos;s default <code>node</code>{" "}
          environment the constructor throws{" "}
          <code>TimepickerUI requires browser environment</code>, so run
          these tests in jsdom:
        </p>
        <CodeBlock
          code={`npm install --save-dev jest-environment-jsdom @testing-library/dom @testing-library/user-event @testing-library/jest-dom`}
          language="bash"
        />
        <CodeBlock
          filename="jest.config.js"
          code={`module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  // Only needed when the code under test imports timepicker-ui CSS
  moduleNameMapper: { '\\\\.css$': '<rootDir>/test/style-stub.js' },
};`}
          language="javascript"
        />
        <p>
          <code>test/style-stub.js</code> holds one line,{" "}
          <code>{"module.exports = {};"}</code>. The examples are
          TypeScript, so Jest also needs the transform your project already
          uses, such as <code>ts-jest</code> or <code>babel-jest</code>. In
          Vitest, set <code>{"environment: 'jsdom'"}</code> and use{" "}
          <code>vi.fn()</code> where the example uses <code>jest.fn()</code>.
        </p>
        <CodeBlock
          filename="time-field.test.ts"
          code={`import { screen, within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { TimepickerUI, type TimepickerOptions } from 'timepicker-ui';

function renderPicker(options: TimepickerOptions = {}) {
  document.body.innerHTML =
    '<label for="start">Start time</label><input id="start" type="text" />';
  const input = screen.getByLabelText('Start time');
  const picker = new TimepickerUI(input, {
    ...options,
    ui: { animation: false, ...options.ui },
  });
  picker.create();
  return { input, picker };
}

afterEach(() => {
  TimepickerUI.destroyAll();
  document.body.innerHTML = '';
});

test('picks 2:30 PM with the keyboard', async () => {
  const user = userEvent.setup();
  const onConfirm = jest.fn();
  const { input } = renderPicker({ callbacks: { onConfirm } });

  await user.click(input);
  const dialog = screen.getByRole('dialog', { name: 'Select time' });

  await user.click(within(dialog).getByRole('spinbutton', { name: 'Hour' }));
  await user.keyboard('{Home}{ArrowUp}'); // 01, then 02

  await user.click(within(dialog).getByRole('spinbutton', { name: 'Minute' }));
  await user.keyboard('{Home}' + '{PageUp}'.repeat(6)); // 00, then 05, 10 ... 30

  const pm = within(dialog).getByRole('button', { name: 'PM' });
  await user.click(pm);
  expect(pm).toHaveAttribute('aria-pressed', 'true');

  await user.click(within(dialog).getByRole('button', { name: 'OK' }));

  expect(input).toHaveValue('02:30 PM');
  expect(onConfirm).toHaveBeenCalledWith(
    expect.objectContaining({ hour: '02', minutes: '30', type: 'PM' }),
  );
});

test('setValue() converts a 24-hour time', () => {
  const { input, picker } = renderPicker();

  picker.setValue('14:30');

  expect(input).toHaveValue('02:30 PM');
  expect(picker.getValue().time).toBe('02:30 PM');
});`}
          language="typescript"
        />
        <p>
          The first test opens the picker, sets 2:30 PM with the keys and
          confirms with OK. It checks the input and the{" "}
          <code>confirm</code> payload. The second test calls{" "}
          <code>setValue()</code>, which converts a 24-hour time for a
          12-hour picker.
        </p>
        <Callout tone="warning" title="jsdom has no layout">
          <p>
            Every element in jsdom has a size of zero, so a click on the
            clock face cannot be turned into an hour or a minute. Set the
            time with the keys or with <code>setValue()</code>.
          </p>
        </Callout>
        <Callout tone="warning" title="Turn off animations in jsdom">
          <p>
            <code>renderPicker()</code> passes{" "}
            <code>{"ui: { animation: false }"}</code>. With animations on,
            the switch from the hour face to the minute face animates the
            clock hand and reads its angle with <code>DOMMatrix</code>.
            jsdom does not have <code>DOMMatrix</code>, so the animation
            frame throws{" "}
            <code>ReferenceError: DOMMatrix is not defined</code>. With
            animations off, the picker skips that step and removes the modal
            without waiting for the close transition.
          </p>
        </Callout>
        <ul>
          <li>
            <code>setValue()</code> does not emit <code>confirm</code>. Test{" "}
            <code>callbacks.onConfirm</code> through the OK button.
          </li>
          <li>
            In a 12-hour picker, <code>{"setValue('14:30')"}</code> writes{" "}
            <code>02:30 PM</code>, the format OK writes.{" "}
            <code>{"setValue('2:30 PM')"}</code> is already in 12-hour
            format, and the input gets the string as you passed it:{" "}
            <code>2:30 PM</code>.
          </li>
          <li>
            <code>TimepickerUI.destroyAll()</code> destroys every picker
            with its modal and listeners. It leaves the{" "}
            <code>div.tp-ui</code> wrapper that the picker put around the
            input, so the example also empties <code>document.body</code>.
          </li>
        </ul>
      </Section>

      <Section title="End-to-end tests (Playwright)">
        <p>
          In a browser the clock face has a size, so clicks on it work. The
          keys still make the steadier test, because they do not depend on
          the viewport. The example follows the{" "}
          <a href="https://playwright.dev/docs/best-practices">
            Playwright best practices
          </a>
          : locators by role, and assertions that wait.
        </p>
        <CodeBlock
          filename="time-field.spec.ts"
          code={`import { test, expect } from '@playwright/test';

test('picks 2:30 PM', async ({ page }) => {
  await page.goto('/booking');

  const input = page.getByLabel('Start time');
  await input.click();

  const dialog = page.getByRole('dialog', { name: 'Select time' });
  await expect(dialog).toBeVisible();

  const hour = dialog.getByRole('spinbutton', { name: 'Hour' });
  await hour.press('Home');
  await hour.press('ArrowUp');

  const minute = dialog.getByRole('spinbutton', { name: 'Minute' });
  await minute.press('Home');
  for (let step = 0; step < 6; step++) {
    await minute.press('PageUp');
  }

  await dialog.getByRole('button', { name: 'PM' }).click();
  await dialog.getByRole('button', { name: 'OK' }).click();

  await expect(dialog).toBeHidden();
  await expect(input).toHaveValue('02:30 PM');
});`}
          language="typescript"
        />
        <p>
          The page under test has{" "}
          <code>{'<label for="start">Start time</label>'}</code> for the
          input. <code>02:30 PM</code> is the default 12-hour format: a
          two-digit hour and minutes, a space, then AM or PM. With{" "}
          <code>{"clock.type: '24h'"}</code> the same time is{" "}
          <code>14:30</code>.
        </p>
        <p>
          <code>fill()</code> waits for an editable element, so on the
          read-only fields it times out. Use <code>press()</code>, or turn
          on <code>ui.editable</code> in the page under test. Editable
          fields pad and clamp the value when they lose focus, so{" "}
          <code>{"fill('2')"}</code> on the hour field becomes{" "}
          <code>02</code>.
        </p>
      </Section>

      <Section title="When a class is the only option">
        <p>
          A few parts have no role, or a name that changes while the test
          runs. Use a <code>tp-ui-*</code> class for these, scoped to the
          dialog locator. Keep such locators in one helper, so a markup
          change means one edit.{" "}
          <Link href="/docs/api/css-classes">CSS Classes</Link> lists the
          classes.
        </p>
        <ul>
          <li>
            <strong>Numbers on the clock face.</strong> They are{" "}
            <code>aria-hidden</code>, so role queries skip them. In a
            browser you can click one through <code>.tp-ui-value-tips</code>
            , or <code>.tp-ui-value-tips-24h</code> on the inner ring of a
            24-hour clock. A disabled number also has{" "}
            <code>.tp-ui-tips-disabled</code>.
          </li>
          <li>
            <strong>The selected timezone.</strong> The combobox takes its
            name from <code>labels.timezone</code>, and the option list sits
            inside it, so its text contains every timezone. Read the
            selected one from <code>.tp-ui-timezone-selected</code>. Option
            names include the current UTC offset, for example{" "}
            <code>Paris (+01:00)</code>, and the offset changes with
            daylight saving time. Match options by city with a regular
            expression.
          </li>
          <li>
            <strong>The time on a range tab.</strong> Find the tabs with{" "}
            <code>{"getByRole('tab', { name: /^From/ })"}</code> and{" "}
            <code>{"{ name: /^To/ }"}</code>. Once a tab shows a time, the
            time becomes part of its name, so match the start of the name.
            For the time alone, use <code>.tp-ui-range-from-time</code> or{" "}
            <code>.tp-ui-range-to-time</code>.
          </li>
        </ul>
        <CodeBlock
          filename="locators.ts"
          code={`const dialog = page.getByRole('dialog', { name: 'Select time' });

// Clock face numbers are aria-hidden: click the 3 by class
await dialog.locator('.tp-ui-value-tips', { hasText: /^3$/ }).click();

// Timezone plugin: pick an option by city, read the selection by class
await dialog.getByRole('combobox', { name: 'Timezone' }).click();
await dialog.getByRole('option', { name: /^Paris / }).click();
await expect(dialog.locator('.tp-ui-timezone-selected')).toHaveText(/^Paris /);

// Range plugin, after a From time is set: the tab by role, its time by class
const fromTab = dialog.getByRole('tab', { name: /^From/ });
await expect(fromTab.locator('.tp-ui-range-from-time')).not.toHaveText('--:--');`}
          language="typescript"
        />
      </Section>
    </div>
  );
}
