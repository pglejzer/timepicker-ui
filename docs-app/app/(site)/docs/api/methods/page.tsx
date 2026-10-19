import { Fragment, type ReactNode } from "react";
import { CodeBlock } from "@/components/code-block";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";

export const metadata = buildMetadata({
  title: "Methods",
  description:
    "Methods reference for timepicker-ui - create, open, close, getValue, setValue, setOptions, destroy and static helpers for the zero-dependency, SSR-safe time picker.",
  path: "/docs/api/methods",
});

const methods = [
  {
    name: "create()",
    description:
      "Initialize the timepicker. Must be called before using other methods. If clock.disabledTime is invalid, create() reports it through the error event and the picker does not open.",
    code: `const picker = new TimepickerUI(input);
picker.create();`,
  },
  {
    name: "open(callback?)",
    description:
      "Open the timepicker programmatically. It emits open, not show.",
    code: `picker.open();

picker.open(() => {
  console.log('Picker opened');
});`,
  },
  {
    name: "close(update?, callback?)",
    description:
      "Close the timepicker. close(true) commits the current selection like clicking OK: the input is updated and confirm is emitted. Nothing is committed while OK is disabled. With true, the callback runs once the picker has closed. Without it, the selection is discarded and the callback runs at once.",
    code: `picker.close();

picker.close(true, () => {
  console.log('Value committed and picker closed');
});`,
  },
  {
    name: "getValue()",
    description:
      "Get the current time. seconds is present only with clock.showSeconds, and time then includes it. degreesHours and degreesMinutes are deprecated and will be removed in 5.0. Use hour and minutes instead.",
    code: `const value = picker.getValue();

// 12h
{
  hour: '10',
  minutes: '30',
  type: 'AM',
  time: '10:30 AM',
  degreesHours: 300,     // deprecated
  degreesMinutes: 180    // deprecated
}

// 12h with clock.showSeconds
{
  hour: '10',
  minutes: '30',
  seconds: '15',
  type: 'AM',
  time: '10:30:15 AM',
  degreesHours: 300,     // deprecated
  degreesMinutes: 180    // deprecated
}`,
  },
  {
    name: "setValue(time, updateInput?)",
    description:
      "Set the time programmatically. Use HH:MM for 24h and H:MM AM or H:MM PM for 12h. With clock.showSeconds, HH:MM:SS and H:MM:SS AM/PM work too, and a value without seconds means :00. Without it, seconds in the string are dropped. A time in the other clock format is converted, so '2:30 PM' sets 14:30 in a 24h picker. A string that is not a time, such as '25:00' or 'abc', leaves the value as it was and emits error (callbacks.onError).",
    code: `// clock: { type: '12h' }
picker.setValue('10:30 AM');
picker.setValue('14:30');        // converted, the input shows 02:30 PM

// clock: { type: '24h' }, input text left unchanged
picker.setValue('15:45', false);

// clock: { type: '24h', showSeconds: true }
picker.setValue('14:30:15');

// clock: { type: '12h', showSeconds: true }
picker.setValue('2:30:15 PM');`,
  },
  {
    name: "setOptions(options)",
    description:
      "Change options at runtime. Groups you leave out keep their values. An open picker is re-rendered with the new options, and a selection that was not confirmed yet is reset to the input value. When clock.type or clock.showSeconds changes, a valid time in the input, including a range (from - to), is rewritten in the new format without an update or confirm event. An empty or invalid input is left as it is. Options that fail validation are reported through the error event and callbacks.onError, and the old options stay. New in 4.5.0.",
    code: `picker.setOptions({
  ui: {
    theme: 'dark'
  },
  clock: {
    type: '24h'
  }
});`,
  },
  {
    name: "update({ options, create? }, callback?)",
    description:
      "Deprecated and removed in 5.0. Use setOptions(options). It applies options the same way. create: true calls create() afterwards, and the callback runs only when the options were valid.",
    code: `// Deprecated
picker.update({ options: { ui: { theme: 'dark' } } });

// Use instead
picker.setOptions({ ui: { theme: 'dark' } });`,
  },
  {
    name: "setRange({ from, to }, updateInput?)",
    description:
      "Set both ends of the range. Each time uses the setValue() format. updateInput defaults to true and writes 'from - to' to the input. It works while the picker is open or closed and emits range:validation. Needs RangePlugin and range.enabled: without them it emits error and does nothing. A time that is not valid emits error and leaves the range as it was.",
    code: `picker.setRange({ from: '09:00', to: '17:00' });

picker.setRange({ from: '9:00 AM', to: '5:00 PM' }, false);`,
  },
  {
    name: "getRange()",
    description:
      "Read both ends of the range. Returns { from, to }, where each end is { hour, minutes, seconds?, type? } or null until it is complete. Returns null, and emits error, without RangePlugin or range.enabled.",
    code: `const range = picker.getRange();

// { from: { hour: '09', minutes: '00' }, to: { hour: '17', minutes: '00' } }`,
  },
  {
    name: "setActivePart('from' | 'to')",
    description:
      "Switch the clock to one end of the range without moving focus. Updates the tabs and emits range:switch. Returns true when the active end changed or was already that end. With the default range.linked, 'to' is refused until From is complete and the method returns false.",
    code: `picker.open();

const switched = picker.setActivePart('to');`,
  },
  {
    name: "refreshDisabledTime()",
    description:
      "Apply clock.disabledTime and clock.isTimeDisabled again without a re-render. It clears the cached isTimeDisabled results and updates the disabled marks on the clock or wheel and the OK button. It does not write to the input. Safe to call while the picker is closed.",
    code: `let lunchBreak = false;

const picker = new TimepickerUI(input, {
  clock: {
    type: '24h',
    isTimeDisabled: ({ hour }) => lunchBreak && hour === 12
  }
});
picker.create();

lunchBreak = true;
picker.refreshDisabledTime();`,
  },
  {
    name: "on(event, handler) / once(event, handler)",
    description:
      "Subscribe to an event. Both return a function that removes the handler, and calling it more than once does nothing. With once(), the function removes the handler before it runs. See Events for off().",
    code: `const unsubscribe = picker.on('confirm', (data) => {
  console.log(data.hour, data.minutes);
});

unsubscribe();`,
  },
  {
    name: "destroy(options?)",
    description: "Destroy the picker instance and clean up.",
    code: `picker.destroy();

picker.destroy({
  keepInputValue: true,
  callback: () => console.log('Destroyed')
});`,
  },
  {
    name: "getElement()",
    description: "Get the root wrapper element.",
    code: `const wrapper = picker.getElement();`,
  },
];

const staticMethods: { name: string; description: ReactNode; code: string }[] =
  [
    {
      name: "TimepickerUI.getById(id)",
      description: (
        <>
          Get an instance by the ID set with <code>behavior.id</code>. Returns{" "}
          <code>undefined</code> when no live instance has that ID.
        </>
      ),
      code: `const picker = new TimepickerUI(input, {
  behavior: { id: 'my-picker' }
});
picker.create();

const instance = TimepickerUI.getById('my-picker');`,
    },
    {
      name: "TimepickerUI.getAllInstances()",
      description: "Get all live instances.",
      code: `const allPickers = TimepickerUI.getAllInstances();
console.log(allPickers.length);`,
    },
    {
      name: "TimepickerUI.destroyAll()",
      description: "Destroy every live instance.",
      code: `TimepickerUI.destroyAll();`,
    },
    {
      name: "TimepickerUI.isAvailable(selector)",
      description: (
        <>
          Check whether a selector or element exists in the document. Always{" "}
          <code>false</code> outside a browser. It does not check that the
          element is, or contains, an input.
        </>
      ),
      code: `if (TimepickerUI.isAvailable('#timepicker')) {
  console.log('Element exists in DOM');
}`,
    },
  ];

export default function MethodsPage() {
  return (
    <div>
      <PageHeader
        title="Methods"
        description="Available methods on TimepickerUI instance"
      />

      {methods.map((method) => (
        <Fragment key={method.name}>
          <h2>
            <code>{method.name}</code>
          </h2>
          <p>{method.description}</p>
          <CodeBlock code={method.code} language="typescript" />
        </Fragment>
      ))}

      <Section title="Static Methods">
        {staticMethods.map((method) => (
          <Fragment key={method.name}>
            <h3>
              <code>{method.name}</code>
            </h3>
            <p>{method.description}</p>
            <CodeBlock code={method.code} language="typescript" />
          </Fragment>
        ))}
      </Section>
    </div>
  );
}
