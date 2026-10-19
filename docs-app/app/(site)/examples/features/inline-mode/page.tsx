"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { Figure } from "@/components/figure";
import { EmbeddedDialogDemo } from "@/components/embedded-dialog-demo";

export default function InlineModePage() {
  return (
    <div>
      <PageHeader
        title="Inline Mode"
        description="Display timepicker without modal overlay"
      />

      <Section title="Inline with Theme">
        <p>
          Apply custom theme to inline timepicker:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: {
    inline: {
      enabled: true,
      container: '#timepicker-container',
      autoUpdate: true
    },
    theme: 'dark'
  },
  clock: { type: '24h' }
});
picker.create();`}
          options={{
            ui: {
              inline: {
                enabled: true,
                container: "#timepicker-container-inline",
                autoUpdate: true,
              },
              theme: "dark",
            },
            clock: { type: "24h" },
          }}
        />
      </Section>

      <Section title="Embedded in a Dialog">
        <p>
          With <code>ui.inline.embedded</code> the picker drops its own card
          chrome and dialog semantics, so it can live inside your own{" "}
          <code>&lt;dialog&gt;</code>. The picker is created when the dialog
          first opens, because the clock face cannot measure itself inside a
          hidden container.
        </p>
        <Figure
          code={`const dialog = document.querySelector('dialog');
const input = document.querySelector('#time');
let picker = null;

openButton.addEventListener('click', () => {
  dialog.showModal();
  if (picker) return;

  picker = new TimepickerUI(input, {
    ui: {
      inline: {
        enabled: true,
        container: '#dialog-picker',
        embedded: true,
        autoUpdate: true
      }
    }
  });
  picker.create();
});`}
        >
          <EmbeddedDialogDemo />
        </Figure>
      </Section>
    </div>
  );
}
