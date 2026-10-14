import TimepickerUI from '@/timepicker/TimepickerUI';
import { TIMINGS } from '@/constants/timings';
import type { TimepickerOptions } from '@/types/options';

const FIELDS = ['input.tp-ui-hour', 'input.tp-ui-minutes', 'input.tp-ui-seconds'];
const CLOSE_MS = TIMINGS.MODAL_EXIT;

const SECONDS_CASES = [
  { seconds: false, secondsLabel: 'without seconds' },
  { seconds: true, secondsLabel: 'with seconds' },
];

const HISTORY_CASES = [
  { openedOnMobile: false, history: 'never opened before' },
  { openedOnMobile: true, history: 'opened and closed on mobile first' },
];

const CASES = SECONDS_CASES.flatMap((secondsCase) =>
  HISTORY_CASES.map((historyCase) => ({ ...secondsCase, ...historyCase })),
);

const modal = (): HTMLElement => {
  const element = document.querySelector<HTMLElement>('.tp-ui-modal');
  if (!element) throw new Error('the picker modal is not open');
  return element;
};

const readonlyFields = (): Record<string, boolean> =>
  Object.fromEntries(
    FIELDS.flatMap((selector): Array<[string, boolean]> => {
      const field = modal().querySelector<HTMLInputElement>(selector);
      return field ? [[selector, field.hasAttribute('readonly')]] : [];
    }),
  );

const fieldsWith = (seconds: boolean, readonly: boolean): Record<string, boolean> =>
  Object.fromEntries(FIELDS.slice(0, seconds ? 3 : 2).map((selector) => [selector, readonly]));

const createPicker = (seconds: boolean, ui: TimepickerOptions['ui']): TimepickerUI => {
  const input = document.createElement('input');
  input.value = seconds ? '10:30:00' : '10:30';
  document.body.appendChild(input);
  const picker = new TimepickerUI(input, {
    clock: { type: '24h', showSeconds: seconds },
    ui: { animation: false, ...ui },
  });
  picker.create();
  return picker;
};

const openAndCloseOnMobile = (picker: TimepickerUI, seconds: boolean): void => {
  picker.open();
  expect(readonlyFields()).toEqual(fieldsWith(seconds, false));
  picker.close();
  jest.advanceTimersByTime(CLOSE_MS);
  expect(document.querySelector('.tp-ui-modal')).toBeNull();
};

describe('the desktop clock view follows ui.editable after ui.mobile is turned off', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  it.each(CASES)(
    'should render read-only time fields when the user left ui.editable at its default ($history, $secondsLabel)',
    ({ seconds, openedOnMobile }) => {
      const picker = createPicker(seconds, { mobile: true });
      if (openedOnMobile) openAndCloseOnMobile(picker, seconds);

      picker.update({ options: { ui: { mobile: false } } });
      picker.open();

      expect(modal().classList.contains('mobile')).toBe(false);
      expect(readonlyFields()).toEqual(fieldsWith(seconds, true));
    },
  );

  it.each(CASES)(
    'should keep the time fields editable when the user set ui.editable: true ($history, $secondsLabel)',
    ({ seconds, openedOnMobile }) => {
      const picker = createPicker(seconds, { mobile: true, editable: true });
      if (openedOnMobile) openAndCloseOnMobile(picker, seconds);

      picker.update({ options: { ui: { mobile: false } } });
      picker.open();

      expect(modal().classList.contains('mobile')).toBe(false);
      expect(readonlyFields()).toEqual(fieldsWith(seconds, false));
    },
  );
});
