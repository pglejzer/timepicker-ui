import TimepickerUI from '../../../../../src/timepicker/TimepickerUI';
import { PluginRegistry } from '../../../../../src/core/PluginRegistry';
import { RangePlugin } from '../../../../../src/plugins/range';

type RangeLike = { getFromValue: () => unknown; getToValue: () => unknown };

describe('range after re-opening (S5)', () => {
  beforeAll(() => PluginRegistry.register(RangePlugin));
  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  it('commits the From part once (To stays empty)', () => {
    jest.useFakeTimers();
    const input = document.createElement('input');
    document.body.appendChild(input);
    const picker = new TimepickerUI(input, {
      clock: { type: '24h' },
      ui: { animation: false },
      range: { enabled: true },
    });
    picker.create();
    picker.open();
    jest.advanceTimersByTime(500);
    picker.close();
    jest.advanceTimersByTime(1000);
    picker.open();
    jest.advanceTimersByTime(500);
    const internals = picker as unknown as {
      emitter: { emit: (e: string, d: unknown) => void };
      managers: { getPlugin: (n: string) => RangeLike };
    };
    internals.emitter.emit('range:minute:commit', { hour: '10', minutes: '15' });
    const range = internals.managers.getPlugin('range');
    expect(range.getFromValue()).toEqual(expect.objectContaining({ hour: '10', minutes: '15' }));
    expect(range.getToValue()).toBeNull();
  });
});
