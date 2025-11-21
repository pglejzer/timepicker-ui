"use client";

import { Section } from "@/components/section";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { Globe, Languages } from "lucide-react";
import { InfoBox } from "@/components/info-box";

export default function LocalizationPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Localization
        </h1>
        <p className="text-lg text-muted-foreground">
          Customize labels and text for different languages and regions
        </p>
      </div>

      <InfoBox title="i18n Support" variant="blue" className="mb-8">
        Timepicker-UI supports full localization through label options. You can
        customize all button texts and time type labels.
      </InfoBox>

      <Section icon={Languages} title="Polish (Polski)">
        <p className="text-muted-foreground mb-4">Polish language example:</p>
        <TimepickerExample
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

      <Section icon={Languages} title="Spanish (Español)">
        <p className="text-muted-foreground mb-4">Spanish language example:</p>
        <TimepickerExample
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

      <Section icon={Languages} title="German (Deutsch)">
        <p className="text-muted-foreground mb-4">German language example:</p>
        <TimepickerExample
          code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker');
const picker = new TimepickerUI(input, {
  labels: {
    ok: 'OK',
    cancel: 'Abbrechen',
    am: 'Vormittag',
    pm: 'Nachmittag'
  }
});

picker.create();`}
          options={{
            labels: {
              ok: "OK",
              cancel: "Abbrechen",
              am: "Vormittag",
              pm: "Nachmittag",
            },
          }}
        />
      </Section>

      <Section icon={Languages} title="French (Français)">
        <p className="text-muted-foreground mb-4">French language example:</p>
        <TimepickerExample
          code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker');
const picker = new TimepickerUI(input, {
  labels: {
    ok: 'OK',
    cancel: 'Annuler',
    am: 'Matin',
    pm: 'Après-midi'
  }
});

picker.create();`}
          options={{
            labels: {
              ok: "OK",
              cancel: "Annuler",
              am: "Matin",
              pm: "Après-midi",
            },
          }}
        />
      </Section>

      <Section icon={Languages} title="Japanese (日本語)">
        <p className="text-muted-foreground mb-4">Japanese language example:</p>
        <TimepickerExample
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

      <Section icon={Globe} title="Dynamic Language Switching">
        <p className="text-muted-foreground mb-4">
          Switch languages dynamically using the update method:
        </p>
        <TimepickerExample
          code={`import { TimepickerUI } from 'timepicker-ui';

const translations = {
  en: { ok: 'OK', cancel: 'Cancel', am: 'AM', pm: 'PM' },
  es: { ok: 'Aceptar', cancel: 'Cancelar', am: 'AM', pm: 'PM' },
  pl: { ok: 'OK', cancel: 'Anuluj', am: 'Rano', pm: 'Popołudnie' },
  de: { ok: 'OK', cancel: 'Abbrechen', am: 'VM', pm: 'NM' }
};

const input = document.querySelector('#timepicker');
const picker = new TimepickerUI(input);
picker.create();

function changeLanguage(lang: string) {
  const t = translations[lang];
  picker.update({
    options: {
      labels: {
        ok: t.ok,
        cancel: t.cancel,
        am: t.am,
        pm: t.pm
      }
    }
  });
}

// Usage: changeLanguage('es');`}
          options={{}}
        />
      </Section>

      <Section icon={Globe} title="React i18n Integration">
        <p className="text-muted-foreground mb-4">
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

    if (pickerRef.current) {
      pickerRef.current.update({ options });
    } else {
      pickerRef.current = new TimepickerUI(inputRef.current, options);
      pickerRef.current.create();
    }

    return () => {
      pickerRef.current?.destroy();
    };
  }, [options]);

  return <input ref={inputRef} type="text" />;
}`}
          options={{}}
        />
      </Section>
    </div>
  );
}
