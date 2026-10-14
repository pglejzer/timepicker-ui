import TimepickerUI from '../../../../../src/timepicker/TimepickerUI';
import { PluginRegistry } from '../../../../../src/core/PluginRegistry';
import { WheelPlugin } from '../../../../../src/plugins/wheel';
import { WheelScrollHandler } from '../../../../../src/managers/plugins/wheel/WheelScrollHandler';

describe('compact-wheel 12h restores the period from the input (S1)', () => {
  beforeAll(() => PluginRegistry.register(WheelPlugin));
  beforeEach(() => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });
  });
  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it.each([
    ['09:15 AM', 'AM'],
    ['09:15 PM', 'PM'],
  ])('input %s → period column %s', (value, period) => {
    const spy = jest.spyOn(WheelScrollHandler.prototype, 'scrollToValue');
    const input = document.createElement('input');
    input.value = value;
    document.body.appendChild(input);
    const picker = new TimepickerUI(input, { ui: { mode: 'compact-wheel', animation: false } });
    picker.create();
    picker.open();
    const ampmCalls = spy.mock.calls.filter(([column]) => column === 'ampm');
    expect(ampmCalls[ampmCalls.length - 1]?.[1]).toBe(period);
  });
});
