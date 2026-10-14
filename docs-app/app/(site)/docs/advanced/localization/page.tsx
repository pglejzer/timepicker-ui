import { CodeBlock } from "@/components/code-block";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/page-header";
import { LinkCard } from "@/components/link-card";
import { Globe, Languages, Type, MapPin } from "lucide-react";
import { Section } from "@/components/section";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Localization",
  description:
    "Localize timepicker-ui for any language - translate every label and AM/PM text for global apps. Zero-dependency, framework-agnostic, accessible and SSR-safe.",
  path: "/docs/advanced/localization",
});

export default function LocalizationPage() {
  return (
    <div>
      <PageHeader
        title="Localization"
        description="Customize labels and formats for international audiences"
        eyebrow="Guide"
      />

      <Section icon={Globe} title="Custom Labels">
        <p className="text-muted-foreground mb-4">
          Timepicker-UI allows you to customize all text labels to support any
          language:
        </p>
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Default Labels
            </h3>
            <p className="text-muted-foreground mb-4">
              The <code>labels</code> group with its English defaults, without
              the deprecated keys. Keys you leave out keep these values.{" "}
              <code>clock</code>, <code>period</code>, <code>timeFields</code>,{" "}
              <code>range</code>, <code>switchToKeyboard</code>,{" "}
              <code>switchToClock</code> and the keys that start with{" "}
              <code>announce</code> are read by screen readers only.
            </p>
            <CodeBlock
              code={`// Default English labels
{
  labels: {
    am: 'AM',
    pm: 'PM',
    ok: 'OK',
    cancel: 'Cancel',
    clear: 'Clear',
    clockTitle: 'Select time',
    keyboardTitle: 'Enter Time',
    hour: 'Hour',
    minute: 'Minute',
    second: 'Second',
    clock: 'Clock',
    period: 'Period',
    timeFields: 'Time',
    range: 'Range selection',
    rangeFrom: 'From',
    rangeTo: 'To',
    timezone: 'Timezone',
    switchToKeyboard: 'Switch to keyboard input',
    switchToClock: 'Switch to clock',
    announceAmSelected: 'AM selected',
    announcePmSelected: 'PM selected',
    announceCleared: 'Time cleared',
    invalidTimeFormat: 'Invalid time format'
  }
}`}
              language="typescript"
            />
            <p className="text-muted-foreground mt-4 text-sm">
              <code>hour</code>, <code>minute</code> and <code>second</code>{" "}
              each set the field caption, the field&apos;s accessible name, the
              dial name and the prefix of the screen-reader announcement. Until
              5.0, the minute announcement says <code>Minutes</code> when{" "}
              <code>minute</code> is not set. <code>second</code> is used only
              with <code>clock.showSeconds: true</code>. <code>range</code>,{" "}
              <code>rangeFrom</code> and <code>rangeTo</code> are used by the
              range plugin, and <code>timezone</code> by the timezone plugin.
              Keys renamed in 4.5.0 are listed on the{" "}
              <Link
                href="/docs/api/options#renamed"
                className="text-primary underline"
              >
                Options
              </Link>{" "}
              page.
            </p>
            <p className="text-muted-foreground mt-2 text-sm">
              <code>labels.am</code> and <code>labels.pm</code> change only the
              text on screen and what screen readers announce. The input value
              and <code>getValue().type</code> always use <code>AM</code> /{" "}
              <code>PM</code>.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Spanish Localization
            </h3>
            <CodeBlock
              code={`const picker = new TimepickerUI(input, {
  labels: {
    ok: 'Aceptar',
    cancel: 'Cancelar',
    am: 'AM',
    pm: 'PM'
  }
});

picker.create();`}
              language="typescript"
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              French Localization
            </h3>
            <CodeBlock
              code={`const picker = new TimepickerUI(input, {
  labels: {
    ok: 'Valider',
    cancel: 'Annuler',
    am: 'AM',
    pm: 'PM'
  }
});

picker.create();`}
              language="typescript"
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              German Localization
            </h3>
            <CodeBlock
              code={`const picker = new TimepickerUI(input, {
  labels: {
    ok: 'OK',
    cancel: 'Abbrechen',
    am: 'AM',
    pm: 'PM'
  }
});

picker.create();`}
              language="typescript"
            />
          </div>
        </div>
      </Section>

      <Section icon={Languages} title="Language Configuration Object">
        <p className="text-muted-foreground mb-4">
          Create reusable language configuration objects for consistency:
        </p>
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Language Config Files
            </h3>
            <CodeBlock
              code={`// locales/es.ts
export const esLocale = {
  labels: {
    ok: 'Aceptar',
    cancel: 'Cancelar',
    am: 'AM',
    pm: 'PM'
  }
};

// locales/fr.ts
export const frLocale = {
  labels: {
    ok: 'Valider',
    cancel: 'Annuler',
    am: 'AM',
    pm: 'PM'
  }
};

// locales/de.ts
export const deLocale = {
  labels: {
    ok: 'OK',
    cancel: 'Abbrechen',
    am: 'AM',
    pm: 'PM'
  }
};

// locales/ja.ts
export const jaLocale = {
  labels: {
    ok: '確認',
    cancel: 'キャンセル',
    am: '午前',
    pm: '午後'
  }
};

// locales/zh.ts
export const zhLocale = {
  labels: {
    ok: '确定',
    cancel: '取消',
    am: '上午',
    pm: '下午'
  }
};`}
              language="typescript"
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Using Language Configs
            </h3>
            <CodeBlock
              code={`import TimepickerUI from 'timepicker-ui';
import { esLocale } from './locales/es';

const picker = new TimepickerUI(input, {
  ...esLocale,
  clock: { type: '24h' }
});

picker.create();`}
              language="typescript"
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Dynamic Language Switching
            </h3>
            <CodeBlock
              code={`import { esLocale, frLocale, deLocale } from './locales';

const locales = {
  es: esLocale,
  fr: frLocale,
  de: deLocale
};

function createLocalizedPicker(language: string) {
  const locale = locales[language] || esLocale;
  
  const picker = new TimepickerUI(input, {
    ...locale,
    clock: { type: '24h' }
  });
  
  return picker;
}

// Usage
let picker = createLocalizedPicker('es');
picker.create();

// Switch language
picker.destroy();
picker = createLocalizedPicker('fr');
picker.create();`}
              language="typescript"
            />
          </div>
        </div>
      </Section>

      <Section icon={Type} title="Time Format Localization">
        <p className="text-muted-foreground mb-4">
          Different regions use different time formats. Configure the clock type
          based on locale:
        </p>
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              12-hour Format (US, UK, Canada)
            </h3>
            <CodeBlock
              code={`const picker = new TimepickerUI(input, {
  clock: { type: '12h' },
  labels: {
    ok: 'OK',
    cancel: 'Cancel',
    am: 'AM',
    pm: 'PM'
  }
});`}
              language="typescript"
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              24-hour Format (Europe, Asia, Most of World)
            </h3>
            <CodeBlock
              code={`const picker = new TimepickerUI(input, {
  clock: { type: '24h' },
  labels: {
    ok: 'OK',
    cancel: 'Annuler'
  }
  // No am/pm labels needed for 24h format
});`}
              language="typescript"
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Auto-detect User Locale
            </h3>
            <p className="text-muted-foreground mb-4">
              <code>clock.type: &apos;auto&apos;</code> picks 12h or 24h from
              the browser locale when the picker is created and each time its
              options are set. New in 4.5.0.
            </p>
            <CodeBlock
              code={`const picker = new TimepickerUI(input, {
  clock: { type: 'auto' }
});

picker.create();`}
              language="typescript"
            />
          </div>
        </div>
      </Section>

      <Section icon={MapPin} title="Complete Locale Examples">
        <p className="text-muted-foreground mb-4">
          Ready-to-use configurations for common languages:
        </p>
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Japanese (日本語)
            </h3>
            <CodeBlock
              code={`const picker = new TimepickerUI(input, {
  clock: { type: '24h' },
  labels: {
    ok: '確認',
    cancel: 'キャンセル'
  }
});`}
              language="typescript"
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Chinese Simplified (简体中文)
            </h3>
            <CodeBlock
              code={`const picker = new TimepickerUI(input, {
  clock: { type: '24h' },
  labels: {
    ok: '确定',
    cancel: '取消'
  }
});`}
              language="typescript"
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Arabic (العربية)
            </h3>
            <CodeBlock
              code={`const picker = new TimepickerUI(input, {
  clock: { type: '12h' },
  labels: {
    ok: 'موافق',
    cancel: 'إلغاء',
    am: 'ص',
    pm: 'م'
  }
});`}
              language="typescript"
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Russian (Русский)
            </h3>
            <CodeBlock
              code={`const picker = new TimepickerUI(input, {
  clock: { type: '24h' },
  labels: {
    ok: 'ОК',
    cancel: 'Отмена'
  }
});`}
              language="typescript"
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Portuguese (Português)
            </h3>
            <CodeBlock
              code={`const picker = new TimepickerUI(input, {
  clock: { type: '24h' },
  labels: {
    ok: 'Confirmar',
    cancel: 'Cancelar'
  }
});`}
              language="typescript"
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Italian (Italiano)
            </h3>
            <CodeBlock
              code={`const picker = new TimepickerUI(input, {
  clock: { type: '24h' },
  labels: {
    ok: 'OK',
    cancel: 'Annulla'
  }
});`}
              language="typescript"
            />
          </div>
        </div>
      </Section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6 text-foreground">
          React i18n Integration
        </h2>
        <p className="text-muted-foreground mb-4">
          Integrate with popular i18n libraries:
        </p>
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              react-i18next
            </h3>
            <CodeBlock
              code={`import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';
import TimepickerUI from 'timepicker-ui';

function LocalizedTimePicker() {
  const { t, i18n } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<TimepickerUI | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      pickerRef.current = new TimepickerUI(inputRef.current, {
        clock: {
          type: i18n.language.includes('en') ? '12h' : '24h'
        },
        labels: {
          ok: t('timepicker.ok'),
          cancel: t('timepicker.cancel'),
          am: t('timepicker.am'),
          pm: t('timepicker.pm')
        }
      });
      
      pickerRef.current.create();
    }

    return () => {
      pickerRef.current?.destroy();
    };
  }, [t, i18n.language]);

  return <input ref={inputRef} type="text" />;
}`}
              language="typescript"
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              i18n Translation File
            </h3>
            <CodeBlock
              code={`// locales/en/translation.json
{
  "timepicker": {
    "ok": "OK",
    "cancel": "Cancel",
    "am": "AM",
    "pm": "PM"
  }
}

// locales/es/translation.json
{
  "timepicker": {
    "ok": "Aceptar",
    "cancel": "Cancelar",
    "am": "AM",
    "pm": "PM"
  }
}

// locales/fr/translation.json
{
  "timepicker": {
    "ok": "Valider",
    "cancel": "Annuler",
    "am": "AM",
    "pm": "PM"
  }
}`}
              language="json"
            />
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6 text-foreground">
          Right-to-Left (RTL) Support
        </h2>
        <p className="text-muted-foreground mb-4">
          The picker has no built-in RTL layout. The modal is appended to{" "}
          <code>body</code> unless <code>ui.appendTo</code> is set,
          so a <code>dir</code> attribute on a wrapper around the input does not
          reach it. Put <code>dir=&quot;rtl&quot;</code> on{" "}
          <code>&lt;html&gt;</code>, or append the modal to your RTL container:
        </p>
        <CodeBlock
          code={`<div id="rtl-root" dir="rtl">
  <input id="timepicker" type="text" />
</div>`}
          language="html"
        />
        <div className="mt-4">
          <CodeBlock
            code={`const picker = new TimepickerUI('#timepicker', {
  clock: { type: '12h' },
  ui: { appendTo: '#rtl-root' },
  labels: {
    ok: 'موافق',
    cancel: 'إلغاء',
    am: 'ص',
    pm: 'م'
  }
});

picker.create();`}
            language="typescript"
          />
        </div>
        <p className="text-muted-foreground mt-4 mb-4">
          <code>direction: rtl</code> also reverses flex rows, including the
          hour and minute fields. To keep them in HH:MM order, reset the
          direction on the field group:
        </p>
        <CodeBlock
          code={`[dir="rtl"] .tp-ui-wrapper-time {
  direction: ltr;
}`}
          language="css"
        />
      </section>

      <LinkCard
        icon={Globe}
        title="Contributing Translations"
        description="If you'd like to contribute translations for additional languages to the official documentation or create a locale pack, please open a pull request on GitHub. Community translations help make Timepicker-UI accessible to users worldwide."
        linkText="View on GitHub"
        linkHref="https://github.com/pglejzer/timepicker-ui/pulls"
        variant="blue"
      />
    </div>
  );
}
