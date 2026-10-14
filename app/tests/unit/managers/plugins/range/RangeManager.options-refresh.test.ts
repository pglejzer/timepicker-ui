import TimepickerUI from '@/timepicker/TimepickerUI';
import { PluginRegistry } from '@/core/PluginRegistry';
import { RangePlugin } from '@/plugins/range';
import { TIMINGS } from '@/constants/timings';
import type { TimepickerOptions } from '@/types/options';

type RangeOptions = NonNullable<TimepickerOptions['range']>;
type Internals = { emitter: { emit: (event: string, data: unknown) => void } };

const INPUT_VALUE = '09:00 - 09:20';
const RANGE_MINUTES = 20;
const OPEN_MS = 500;
const CLOSE_MS = TIMINGS.MODAL_EXIT;

const createRangePicker = (range: RangeOptions): TimepickerUI => {
  const input = document.createElement('input');
  input.value = INPUT_VALUE;
  document.body.appendChild(input);
  const picker = new TimepickerUI(input, {
    clock: { type: '24h' },
    ui: { animation: false },
    range: { enabled: true, ...range },
  });
  picker.create();
  return picker;
};

const openAndCommitFrom = (picker: TimepickerUI): jest.Mock => {
  const onValidation = jest.fn();
  picker.on('range:validation', onValidation);
  picker.open();
  jest.advanceTimersByTime(OPEN_MS);
  (picker as unknown as Internals).emitter.emit('range:minute:commit', { hour: '09', minutes: '00' });
  picker.off('range:validation', onValidation);
  return onValidation;
};

const close = (picker: TimepickerUI): void => {
  picker.close();
  jest.advanceTimersByTime(CLOSE_MS);
  expect(document.querySelector('.tp-ui-modal')).toBeNull();
};

const CASES: Array<{ option: keyof RangeOptions; initial: RangeOptions; updated: RangeOptions }> = [
  { option: 'minDuration', initial: { minDuration: 10 }, updated: { minDuration: 30 } },
  { option: 'maxDuration', initial: { maxDuration: 30 }, updated: { maxDuration: 15 } },
];

describe('range validation follows range options changed with update()', () => {
  beforeAll(() => PluginRegistry.register(RangePlugin));

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  it.each(CASES)(
    'should validate against the $option from update() on the first open',
    ({ initial, updated }) => {
      const picker = createRangePicker(initial);

      picker.update({ options: { range: updated } });
      const onValidation = openAndCommitFrom(picker);

      expect(onValidation).toHaveBeenLastCalledWith(
        expect.objectContaining({ valid: false, duration: RANGE_MINUTES, ...updated }),
      );
    },
  );

  it.each(CASES)(
    'should validate against the $option from update() when the picker opens again',
    ({ initial, updated }) => {
      const picker = createRangePicker(initial);
      const firstOpen = openAndCommitFrom(picker);
      expect(firstOpen).toHaveBeenLastCalledWith(
        expect.objectContaining({ valid: true, duration: RANGE_MINUTES, ...initial }),
      );
      close(picker);

      picker.update({ options: { range: updated } });
      const reopened = openAndCommitFrom(picker);

      expect(reopened).toHaveBeenLastCalledWith(
        expect.objectContaining({ valid: false, duration: RANGE_MINUTES, ...updated }),
      );
    },
  );
});
