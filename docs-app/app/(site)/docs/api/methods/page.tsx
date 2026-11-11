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
      "Set the time programmatically. Use HH:MM for 24h and H:MM AM or H:MM PM for 12h. With clock.showSeconds, HH:MM:SS and H:MM:SS AM/PM work too, and a value without seconds means :00. Without it, seconds in the string are dropped. A time in the other clock format is converted, so '2:30 PM' sets 14:30 in a 24h picker. A string that is not a time, such as '25:00' or 'abc', leaves the value as it was and emits error (callbacks.onError). In range mode (RangePlugin and range.enabled) it sets the end being edited, see getActivePart(), and with updateInput writes 'from - to' to the input.",
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
      "Change options at runtime. Groups you leave out keep their values. An open picker is re-rendered with the new options, and a selection that was not confirmed yet is reset to the input value. With a range, the active end (From or To) and the times already set are kept, and keeping To emits range:switch. The view (clock or keyboard) is kept too, unless the call changes ui.initialView: then an open picker switches to the new initial view and emits switch:view once, after the new view is shown. A closed picker emits nothing and opens in the new view. With a range, a time typed into the active end is committed first and emits range:change. When clock.type or clock.showSeconds changes, a valid time in the input, including a range (from - to), is rewritten in the new format without an update or confirm event. An empty or invalid input is left as it is. Options that fail validation are reported through the error event and callbacks.onError, and the old options stay. New in 4.5.0.",
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
    name: "setRange({ from?, to? }, updateInput?)",
    description:
      "Set one or both ends of the range. Each time uses the setValue() format. An end you leave out keeps its value, and null or '' clears it. With range.linked (the default), clearing From while To is active switches back to From. updateInput defaults to true and writes 'from - to' to the input, with --:-- for an empty end, or nothing when both ends are empty. It works while the picker is open or closed and emits range:validation, but not range:change. When the end shown on the clock does not change, the dial and the typed fields are left alone. range:switch for the before-From limit fires only when From actually changed. On an open picker in wheel or compact-wheel mode the wheel moves to the active end quietly, without update or select:* events. In clock mode it still emits select:hour and update. Needs RangePlugin and range.enabled: without them it emits error and does nothing. A time that is not valid, or an object with neither end, emits error and leaves the range as it was.",
    code: `picker.setRange({ from: '09:00', to: '17:00' });

picker.setRange({ from: '9:00 AM', to: '5:00 PM' }, false);

picker.setRange({ from: '09:00' });
picker.setRange({ to: null });`,
  },
  {
    name: "getRange()",
    description:
      "Read both ends of the range. Returns { from, to }, where each end is { hour, minutes, seconds?, type? } or null until it is complete. A time typed in a field counts as soon as it is applied on blur or Enter, or when you switch ends, so getRange() then returns it. Returns null, and emits error, without RangePlugin or range.enabled.",
    code: `const range = picker.getRange();

// { from: { hour: '09', minutes: '00' }, to: { hour: '17', minutes: '00' } }`,
  },
  {
    name: "setActivePart('from' | 'to')",
    description:
      "Switch the clock or the wheel to one end of the range without moving focus. On an open picker, a time typed into the current end is committed first, and that emits range:change when the value of that end changes. Then it updates the tabs and emits range:switch. Returns true when the active end changed or was already that end. With the default range.linked, 'to' is refused until From is complete and the method returns false. In wheel and compact-wheel mode the wheel shows the end quietly, without update or select:* events. In clock mode it still emits select:hour and update. While the picker is closed, setActivePart('to') emits nothing, and the next open emits range:switch. When the end shown does not change, the dial stays as it is.",
    code: `picker.open();

const switched = picker.setActivePart('to');`,
  },
  {
    name: "getActivePart()",
    description:
      "Read the range end being edited. Returns 'from' or 'to'. Returns null after destroy(), and also without RangePlugin or range.enabled, where it emits error like getRange().",
    code: `if (picker.getActivePart() === 'from') {
  picker.setActivePart('to');
}`,
  },
  {
    name: "setRangeCaptions({ from?, to? })",
    description:
      "Show a second line under a range tab label, for example the date of that end. The text is plain text, not HTML, and becomes part of the tab's accessible name. A tab you leave out keeps its caption, and null or '' removes it. Works open or closed, survives setOptions() and Clear, and emits no event. Needs RangePlugin and range.enabled, otherwise it emits error.",
    code: `picker.setRangeCaptions({ from: 'Wed Oct 21', to: 'Thu Oct 22' });

picker.setRangeCaptions({ to: null });`,
  },
  {
    name: "clear()",
    description:
      "Clear the picker like the Clear button: empties the input (unless ui.clearButton is { clearInput: false }), returns the clock or wheel to its neutral time and empties both range ends. It works open or closed, and without ui.clearButton. It emits clear and update like the button, makes no screen reader announcement and never moves focus. It does not emit range:change.",
    code: `picker.clear();`,
  },
  {
    name: "setView(view) / getView()",
    description:
      "Show the clock face or the keyboard view, for example from your own switch button. Open: switches at once and emits switch:view. Closed: the next open starts in that view, and later opens start in ui.initialView again. Focus does not move, unless it was on the part that gets hidden: then it moves to the active time field. setView() returns true when that view is shown or will be at the next open. It returns false, without an error, in wheel and compact-wheel modes and after destroy(), and returns false and emits error for a value other than 'clock' or 'keyboard'. getView() returns the view shown now, or the view the next open starts in, and null in wheel modes or after destroy().",
    code: `picker.setView('keyboard');

const view = picker.getView();`,
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
      "Subscribe to an event. Both return a function that removes the handler, and calling it more than once does nothing. With once(), the function removes the handler before it runs. The event name is typed as TimepickerEventName, so the handler gets the payload type of that event. See Events for off().",
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

const utilities = [
  {
    name: "parseTime(text, options?)",
    description:
      "Parse a time the way setValue() does. options is { clockType?: '12h' | '24h', showSeconds?: boolean }, with '12h' and no seconds by default. A valid time in the other clock format is converted, so '2:30 PM' gives 14:30 in 24h. Returns a TimeValue, or null when the text is not a time. It needs no picker and no DOM.",
    code: `import { parseTime } from 'timepicker-ui';

parseTime('2:30 PM', { clockType: '24h' });
// { hour: '14', minutes: '30' }

parseTime('abc');
// null`,
  },
  {
    name: "formatTime(value, options?)",
    description:
      "Format a TimeValue as the picker writes it to the input. It takes the same options as parseTime().",
    code: `import { formatTime } from 'timepicker-ui';

formatTime({ hour: '2', minutes: '30', type: 'PM' });
// '02:30 PM'`,
  },
  {
    name: "createDisabledTimeCheck(options)",
    description:
      "Build a check that tells whether a time is disabled by clock.disabledTime and clock.isTimeDisabled, with the same rules as a mounted picker. options takes type, disabledTime, isTimeDisabled and showSeconds from the clock group. The edges of disabledTime.ranges use the clock format of type. The check accepts a time string or a { hour, minutes, seconds } object with hour from 0 to 23 in both clock types, and returns true for text that is not a time. Results of isTimeDisabled are cached, so build a new check after the data behind it changes. It throws the same message a picker reports through error when disabledTime is invalid. It needs no picker and no DOM.",
    code: `import { createDisabledTimeCheck } from 'timepicker-ui';

const isDisabled = createDisabledTimeCheck({
  type: '24h',
  disabledTime: { ranges: ['12:00 - 13:00'] }
});

isDisabled('12:30');                               // true
isDisabled({ hour: 9, minutes: 0, seconds: 0 });   // false`,
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

      <Section title="Utilities">
        <p>
          Three helpers are exported from the package root. They need no picker
          instance and no DOM, so they also run on the server.
        </p>
        {utilities.map((method) => (
          <Fragment key={method.name}>
            <h3>
              <code>{method.name}</code>
            </h3>
            <p>{method.description}</p>
            <CodeBlock code={method.code} language="typescript" />
          </Fragment>
        ))}
      </Section>

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
