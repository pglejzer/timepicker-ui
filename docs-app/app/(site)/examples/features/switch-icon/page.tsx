"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { Figure } from "@/components/figure";
import { ViewSwitchDemo } from "@/components/view-and-range-demos";

export default function SwitchIconPage() {
  return (
    <div>
      <PageHeader
        title="Switch Icon"
        description={
          <>
            Show a button that switches between the clock face and the
            keyboard view, with <code>ui.viewSwitch</code>.
          </>
        }
      />

      <Section title="Enable the View Switch">
        <p>
          Show the icon that switches between the clock face and the keyboard
          view:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: { viewSwitch: true }
});
picker.create();`}
          options={{
            ui: { viewSwitch: true },
          }}
        />
      </Section>

      <Section title="Start in the Keyboard View">
        <p>
          Open in the keyboard view, with the icon to switch to the clock face:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: {
    initialView: 'keyboard',
    viewSwitch: true
  }
});
picker.create();`}
          options={{
            ui: {
              initialView: "keyboard",
              viewSwitch: true,
            },
          }}
        />
      </Section>

      <Section title="Switch from Your Own Button">
        <p>
          <code>setView()</code> and <code>getView()</code> drive the view from
          outside, and <code>switch:view</code> reports every change with the
          view that is now shown. Both need the clock or keyboard views, so
          they do nothing in the wheel modes. New in 4.7.0.
        </p>
        <Figure
          code={`const picker = new TimepickerUI(input, {
  clock: { type: '24h' }
});
picker.create();

button.addEventListener('click', () => {
  picker.setView(picker.getView() === 'clock' ? 'keyboard' : 'clock');
});

picker.on('switch:view', ({ view }) => {
  button.textContent = view === 'clock' ? 'Keyboard' : 'Clock';
});`}
        >
          <ViewSwitchDemo />
        </Figure>
      </Section>

      <Section title="With Theme">
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: {
    viewSwitch: true,
    theme: 'dark'
  }
});
picker.create();`}
          options={{
            ui: {
              viewSwitch: true,
              theme: "dark",
            },
          }}
        />
      </Section>
    </div>
  );
}
