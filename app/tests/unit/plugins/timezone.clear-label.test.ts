import TimepickerUI from '@/timepicker/TimepickerUI';
import { PluginRegistry } from '@/core/PluginRegistry';
import { TimezonePlugin } from '@/plugins/timezone';
import { DEFAULT_OPTIONS } from '@/utils/options/defaults';
import type { TimepickerOptions } from '@/types/options';

const WHITELIST = ['Europe/Warsaw', 'Europe/London'];
const CUSTOM_LABEL = 'Strefa czasowa';
const HARDCODED_ENGLISH = 'Timezone...';

const selected = (): HTMLElement =>
  document.querySelector('.tp-ui-modal .tp-ui-timezone-selected') as HTMLElement;

const openPicker = (timezone: TimepickerOptions['timezone'] = {}): void => {
  const input = document.createElement('input');
  input.value = '10:30';
  document.body.appendChild(input);
  const picker = new TimepickerUI(input, {
    clock: { type: '24h' },
    ui: { animation: false, clearButton: true },
    timezone: { enabled: true, whitelist: WHITELIST, ...timezone },
  });
  picker.create();
  picker.open();
};

const selectZone = (zone: string): void => {
  const option = document.querySelector(
    `.tp-ui-modal .tp-ui-timezone-option[data-value="${zone}"]`,
  ) as HTMLElement | null;
  expect(option).not.toBeNull();
  option?.click();
};

const clickClear = (): void => {
  const clear = document.querySelector('.tp-ui-modal .tp-ui-clear-btn') as HTMLElement;
  expect(clear).toHaveAttribute('aria-disabled', 'false');
  clear.click();
};

describe('timezone trigger after Clear shows the configured label, never hardcoded English', () => {
  beforeAll(() => PluginRegistry.register(TimezonePlugin));

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  it.each<[string, TimepickerOptions['timezone'], string]>([
    ['a custom timezone.label', { label: CUSTOM_LABEL }, CUSTOM_LABEL],
    ['the default timezone.label', {}, DEFAULT_OPTIONS.timezone.label as string],
  ])('should restore the placeholder built from %s after a zone was selected', (_name, timezone, label) => {
    openPicker(timezone);
    const placeholder = selected().getAttribute('data-placeholder');
    expect(placeholder).toContain(label);

    selectZone('Europe/London');
    expect(selected().textContent).toContain('London');

    clickClear();

    expect(selected().textContent).toBe(placeholder);
    expect(selected()).toHaveAttribute('data-placeholder', placeholder as string);
  });

  it('should show the custom label after clearing a zone that was preselected by timezone.default', () => {
    openPicker({ label: CUSTOM_LABEL, default: 'Europe/Warsaw' });
    expect(selected().textContent).toContain('Warsaw');

    clickClear();

    const text = selected().textContent ?? '';
    expect(text).toContain(CUSTOM_LABEL);
    expect(text).not.toContain(HARDCODED_ENGLISH);
    expect(selected()).toHaveAttribute('data-placeholder', text);
  });
});
