import TimepickerUI from '../../../../../src/timepicker/TimepickerUI';
import { PluginRegistry } from '../../../../../src/core/PluginRegistry';
import { WheelPlugin } from '../../../../../src/plugins/wheel';

const RECT = {
  height: 40,
  width: 80,
  x: 0,
  y: 0,
  top: 0,
  left: 0,
  bottom: 40,
  right: 80,
  toJSON: () => ({}),
} as DOMRect;

describe('getValue on an open compact-wheel (S15)', () => {
  beforeAll(() => PluginRegistry.register(WheelPlugin));
  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('reads the wheel selection instead of absent header inputs', () => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });
    const input = document.createElement('input');
    input.value = '14:45';
    document.body.appendChild(input);
    const picker = new TimepickerUI(input, {
      clock: { type: '24h' },
      ui: { mode: 'compact-wheel', animation: false },
    });
    picker.create();
    picker.open();
    document
      .querySelectorAll('.tp-ui-modal .tp-ui-wheel-item')
      .forEach((item) => jest.spyOn(item, 'getBoundingClientRect').mockReturnValue(RECT));
    const wheel = (
      picker as unknown as {
        managers: { getPlugin: (n: string) => { scrollToValue: (h: string, m: string) => void } };
      }
    ).managers.getPlugin('wheel');
    wheel.scrollToValue('14', '45');
    expect(picker.getValue().time).toBe('14:45');
  });
});
