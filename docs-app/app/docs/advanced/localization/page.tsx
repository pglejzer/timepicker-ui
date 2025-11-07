import { CodeBlock } from "@/components/code-block";
import { LinkCard } from "@/components/link-card";
import { Globe, Languages, Type, MapPin } from "lucide-react";
import { Section } from "@/components/section";

export const metadata = {
  title: "Localization - Timepicker-UI",
  description: "Internationalization and custom labels for global applications",
};

export default function LocalizationPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Localization
        </h1>
        <p className="text-lg text-muted-foreground">
          Customize labels and formats for international audiences
        </p>
      </div>

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
            <CodeBlock
              code={`// Default English labels
{
  okLabel: 'Ok',
  cancelLabel: 'Cancel',
  amLabel: 'AM',
  pmLabel: 'PM'
}`}
              language="typescript"
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Spanish Localization
            </h3>
            <CodeBlock
              code={`const picker = new TimepickerUI(input, {
  okLabel: 'Aceptar',
  cancelLabel: 'Cancelar',
  amLabel: 'AM',
  pmLabel: 'PM'
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
  okLabel: 'Valider',
  cancelLabel: 'Annuler',
  amLabel: 'AM',
  pmLabel: 'PM'
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
  okLabel: 'OK',
  cancelLabel: 'Abbrechen',
  amLabel: 'AM',
  pmLabel: 'PM'
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
  okLabel: 'Aceptar',
  cancelLabel: 'Cancelar',
  amLabel: 'AM',
  pmLabel: 'PM'
};

// locales/fr.ts
export const frLocale = {
  okLabel: 'Valider',
  cancelLabel: 'Annuler',
  amLabel: 'AM',
  pmLabel: 'PM'
};

// locales/de.ts
export const deLocale = {
  okLabel: 'OK',
  cancelLabel: 'Abbrechen',
  amLabel: 'AM',
  pmLabel: 'PM'
};

// locales/ja.ts
export const jaLocale = {
  okLabel: '確認',
  cancelLabel: 'キャンセル',
  amLabel: '午前',
  pmLabel: '午後'
};

// locales/zh.ts
export const zhLocale = {
  okLabel: '确定',
  cancelLabel: '取消',
  amLabel: '上午',
  pmLabel: '下午'
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
  clockType: '24h'
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
    clockType: '24h'
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
  clockType: '12h',
  okLabel: 'OK',
  cancelLabel: 'Cancel',
  amLabel: 'AM',
  pmLabel: 'PM'
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
  clockType: '24h',
  okLabel: 'OK',
  cancelLabel: 'Annuler'
  // No amLabel/pmLabel needed for 24h format
});`}
              language="typescript"
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Auto-detect User Locale
            </h3>
            <CodeBlock
              code={`function getLocaleTimeFormat() {
  // Get user's locale
  const locale = navigator.language || 'en-US';
  
  // Test if locale uses 12-hour format
  const testDate = new Date(2000, 0, 1, 13, 0);
  const formatted = testDate.toLocaleTimeString(locale);
  
  return formatted.includes('PM') || formatted.includes('AM') ? '12h' : '24h';
}

// Usage
const clockType = getLocaleTimeFormat();
const picker = new TimepickerUI(input, {
  clockType: clockType
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
  clockType: '24h',
  okLabel: '確認',
  cancelLabel: 'キャンセル'
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
  clockType: '24h',
  okLabel: '确定',
  cancelLabel: '取消'
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
  clockType: '12h',
  okLabel: 'موافق',
  cancelLabel: 'إلغاء',
  amLabel: 'ص',
  pmLabel: 'م'
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
  clockType: '24h',
  okLabel: 'ОК',
  cancelLabel: 'Отмена'
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
  clockType: '24h',
  okLabel: 'Confirmar',
  cancelLabel: 'Cancelar'
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
  clockType: '24h',
  okLabel: 'OK',
  cancelLabel: 'Annulla'
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
        clockType: i18n.language.includes('en') ? '12h' : '24h',
        okLabel: t('timepicker.ok'),
        cancelLabel: t('timepicker.cancel'),
        amLabel: t('timepicker.am'),
        pmLabel: t('timepicker.pm')
      });
      
      pickerRef.current.create();
    }

    return () => {
      pickerRef.current?.destroy();
    };
  }, [t, i18n.language]);

  return <input ref={inputRef} type="time" />;
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
          Support for RTL languages like Arabic and Hebrew:
        </p>
        <CodeBlock
          code={`/* Add to your CSS */
[dir="rtl"] .timepicker-ui-wrapper {
  direction: rtl;
}

[dir="rtl"] .timepicker-ui-hour,
[dir="rtl"] .timepicker-ui-minutes {
  text-align: right;
}

// JavaScript
const picker = new TimepickerUI(input, {
  clockType: '12h',
  okLabel: 'موافق',
  cancelLabel: 'إلغاء',
  amLabel: 'ص',
  pmLabel: 'م'
});

picker.create();

// Set RTL on container
document.querySelector('.timepicker-container').dir = 'rtl';`}
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
