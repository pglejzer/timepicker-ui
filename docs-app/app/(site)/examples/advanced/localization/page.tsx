"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { Callout } from "@/components/callout";

export default function LocalizationPage() {
  return (
    <div>
      <PageHeader
        title="Localization"
        description="Customize labels and text for different languages and regions"
      />

      <Callout title="i18n Support">
        Timepicker-UI supports full localization through label options. You can
        customize all button texts and time type labels.
      </Callout>

      <Section title="Polish (Polski)">
        <p>Polish language example:</p>
        <TimepickerExample
          display="field"
          code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker');
const picker = new TimepickerUI(input, {
  labels: {
    ok: 'OK',
    cancel: 'Anuluj',
    am: 'AM',
    pm: 'PM'
  }
});

picker.create();`}
          options={{
            labels: {
              ok: "OK",
              cancel: "Anuluj",
              am: "AM",
              pm: "PM",
            },
          }}
        />
      </Section>

      <Section title="Spanish (Español)">
        <p>Spanish language example:</p>
        <TimepickerExample
          display="field"
          code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker');
const picker = new TimepickerUI(input, {
  labels: {
    ok: 'Aceptar',
    cancel: 'Cancelar',
    am: 'AM',
    pm: 'PM'
  }
});

picker.create();`}
          options={{
            labels: {
              ok: "Aceptar",
              cancel: "Cancelar",
              am: "AM",
              pm: "PM",
            },
          }}
        />
      </Section>

      <Section title="German (Deutsch)">
        <p>German language example:</p>
        <TimepickerExample
          display="field"
          code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker');
const picker = new TimepickerUI(input, {
  clock: { type: '24h' },
  labels: {
    ok: 'OK',
    cancel: 'Abbrechen'
  }
});

picker.create();`}
          options={{
            clock: { type: "24h" },
            labels: {
              ok: "OK",
              cancel: "Abbrechen",
            },
          }}
        />
      </Section>

      <Section title="French (Français)">
        <p>French language example:</p>
        <TimepickerExample
          display="field"
          code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker');
const picker = new TimepickerUI(input, {
  clock: { type: '24h' },
  labels: {
    ok: 'OK',
    cancel: 'Annuler'
  }
});

picker.create();`}
          options={{
            clock: { type: "24h" },
            labels: {
              ok: "OK",
              cancel: "Annuler",
            },
          }}
        />
      </Section>

      <Section title="Japanese (日本語)">
        <p>Japanese language example:</p>
        <TimepickerExample
          display="field"
          code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker');
const picker = new TimepickerUI(input, {
  labels: {
    ok: '確定',
    cancel: 'キャンセル',
    am: '午前',
    pm: '午後'
  }
});

picker.create();`}
          options={{
            labels: {
              ok: "確定",
              cancel: "キャンセル",
              am: "午前",
              pm: "午後",
            },
          }}
        />
      </Section>

      <Section title="Dynamic Language Switching">
        <p>
          Switch languages at runtime with <code>setOptions()</code>:
        </p>
        <TimepickerExample
          code={`import { TimepickerUI } from 'timepicker-ui';

const translations = {
  en: { ok: 'OK', cancel: 'Cancel', am: 'AM', pm: 'PM' },
  es: { ok: 'Aceptar', cancel: 'Cancelar', am: 'AM', pm: 'PM' },
  pl: { ok: 'OK', cancel: 'Anuluj', am: 'AM', pm: 'PM' },
  de: { ok: 'OK', cancel: 'Abbrechen', am: 'VM', pm: 'NM' }
};

const input = document.querySelector('#timepicker');
const picker = new TimepickerUI(input);
picker.create();

function changeLanguage(lang: string) {
  const t = translations[lang];
  picker.setOptions({
    labels: {
      ok: t.ok,
      cancel: t.cancel,
      am: t.am,
      pm: t.pm
    }
  });
}

// Usage: changeLanguage('es');`}
          options={{}}
        />
      </Section>

      <Section title="React i18n Integration">
        <p>
          Integrate with React i18n libraries like react-i18next:
        </p>
        <TimepickerExample
          code={`import { useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TimepickerUI } from 'timepicker-ui';

function LocalizedTimepicker() {
  const inputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<TimepickerUI | null>(null);
  const { t } = useTranslation();

  const options = useMemo(() => ({
    labels: {
      ok: t('timepicker.ok'),
      cancel: t('timepicker.cancel'),
      am: t('timepicker.am'),
      pm: t('timepicker.pm')
    }
  }), [t]);

  useEffect(() => {
    if (!inputRef.current) return;

    const picker = new TimepickerUI(inputRef.current, options);
    picker.create();
    pickerRef.current = picker;

    return () => {
      picker.destroy();
      pickerRef.current = null;
    };
  }, []);

  useEffect(() => {
    pickerRef.current?.setOptions(options);
  }, [options]);

  return <input ref={inputRef} type="text" />;
}`}
          options={{}}
        />
      </Section>
    </div>
  );
}
