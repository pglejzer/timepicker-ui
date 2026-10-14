import TimepickerUI from '@/timepicker/TimepickerUI';
import { PluginRegistry } from '@/core/PluginRegistry';
import { TimezonePlugin } from '@/plugins/timezone';
import { TIMINGS } from '@/constants/timings';
import type { TimepickerOptions } from '@/types/options';

const WHITELIST = ['Europe/Warsaw', 'Europe/London'];
const LABEL = 'Strefa czasowa';
const ZONE = 'Europe/London';
const ZONE_TEXT = 'London';
const DEFAULT_ZONE = 'Europe/Warsaw';
const DEFAULT_ZONE_TEXT = 'Warsaw';
const CLOSE_MS = TIMINGS.MODAL_EXIT;

const modal = (): HTMLElement => {
  const element = document.querySelector<HTMLElement>('.tp-ui-modal');
  if (!element) throw new Error('the picker modal is not open');
  return element;
};

const trigger = (): HTMLElement => {
  const element = modal().querySelector<HTMLElement>('.tp-ui-timezone-selected');
  if (!element) throw new Error('the timezone trigger is not rendered');
  return element;
};

const selectedZones = (): string[] =>
  [...modal().querySelectorAll('.tp-ui-timezone-option')]
    .filter(
      (option) =>
        option.getAttribute('aria-selected') === 'true' || option.getAttribute('data-selected') === 'true',
    )
    .map((option) => option.getAttribute('data-value') ?? '');

type PickerExtras = Pick<TimepickerOptions, 'timezone' | 'callbacks'>;

const createPicker = ({ timezone, callbacks }: PickerExtras = {}): TimepickerUI => {
  const input = document.createElement('input');
  input.value = '10:30';
  document.body.appendChild(input);
  const picker = new TimepickerUI(input, {
    clock: { type: '24h' },
    ui: { animation: false, clearButton: true },
    callbacks,
    timezone: { enabled: true, whitelist: WHITELIST, label: LABEL, ...timezone },
  });
  picker.create();
  picker.open();
  return picker;
};

const selectZone = (zone: string): void => {
  const option = modal().querySelector<HTMLElement>(`.tp-ui-timezone-option[data-value="${zone}"]`);
  if (!option) throw new Error(`the ${zone} option is not rendered`);
  option.click();
};

const clickClear = (): void => {
  const clear = modal().querySelector<HTMLElement>('.tp-ui-clear-btn');
  if (!clear) throw new Error('the Clear button is not rendered');
  expect(clear).toHaveAttribute('aria-disabled', 'false');
  clear.click();
};

const reopen = (picker: TimepickerUI): void => {
  picker.close();
  jest.advanceTimersByTime(CLOSE_MS);
  expect(document.querySelector('.tp-ui-modal')).toBeNull();
  picker.open();
};

describe('timezone Clear resets the selected zone, not only the trigger text', () => {
  beforeAll(() => PluginRegistry.register(TimezonePlugin));

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  it('should leave no option selected right after Clear', () => {
    createPicker();
    selectZone(ZONE);
    expect(selectedZones()).toEqual([ZONE]);

    clickClear();

    expect(selectedZones()).toEqual([]);
  });

  it('should reopen with no zone selected and the timezone.label placeholder, then select a zone again', () => {
    const picker = createPicker();
    selectZone(ZONE);
    clickClear();

    reopen(picker);

    expect(selectedZones()).toEqual([]);
    const text = trigger().textContent ?? '';
    expect(text).toContain(LABEL);
    expect(text).not.toContain(ZONE_TEXT);
    expect(trigger()).toHaveAttribute('data-placeholder', text);

    const onChange = jest.fn();
    picker.on('timezone:change', onChange);
    selectZone(ZONE);

    expect(selectedZones()).toEqual([ZONE]);
    expect(trigger().textContent).toContain(ZONE_TEXT);
    expect(trigger()).not.toHaveAttribute('data-placeholder');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({ timezone: ZONE });
  });
});

describe('timezone Clear with timezone.default set', () => {
  const zoneState = (
    onTimezoneChange: jest.Mock,
  ): { selected: string[]; text: string | null; placeholder: string | null; changes: unknown[][] } => ({
    selected: selectedZones(),
    text: trigger().textContent,
    placeholder: trigger().getAttribute('data-placeholder'),
    changes: [...onTimezoneChange.mock.calls],
  });

  beforeAll(() => PluginRegistry.register(TimezonePlugin));

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  it('should leave no option selected right after Clear', () => {
    createPicker({ timezone: { default: DEFAULT_ZONE } });
    selectZone(ZONE);
    expect(selectedZones()).toEqual([ZONE]);

    clickClear();

    expect(selectedZones()).toEqual([]);
  });

  it('should apply the default zone again on reopen after Clear, exactly as on a fresh open', () => {
    const onTimezoneChange = jest.fn();
    const picker = createPicker({ timezone: { default: DEFAULT_ZONE }, callbacks: { onTimezoneChange } });
    const freshOpen = zoneState(onTimezoneChange);
    expect(freshOpen.selected).toEqual([DEFAULT_ZONE]);
    expect(freshOpen.text).toContain(DEFAULT_ZONE_TEXT);
    expect(freshOpen.placeholder).toBeNull();
    expect(freshOpen.changes).toEqual([[{ timezone: DEFAULT_ZONE }]]);

    selectZone(ZONE);
    clickClear();
    onTimezoneChange.mockClear();

    reopen(picker);

    expect(zoneState(onTimezoneChange)).toEqual(freshOpen);
  });
});
