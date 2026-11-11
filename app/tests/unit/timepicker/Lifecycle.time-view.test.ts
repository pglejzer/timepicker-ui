import type TimepickerUIClass from '@/timepicker/TimepickerUI';
import type { CoreState } from '@/timepicker/CoreState';
import type { Plugin, PluginTimeView } from '@/core/PluginRegistry';

type TimepickerUIConstructor = typeof TimepickerUIClass;
type Mode = 'clock' | 'wheel' | 'compact-wheel';

interface Harness {
  readonly Ctor: TimepickerUIConstructor;
  readonly calls: string[];
  readonly views: PluginTimeView[];
  readonly rerenderingAtInit: boolean[];
  readonly scrollToValue: jest.SpyInstance;
  readonly getCore: () => CoreState | null;
}

const MODES: Mode[] = ['clock', 'wheel', 'compact-wheel'];
const WHEEL_MODES: Mode[] = ['wheel', 'compact-wheel'];

const load = (withTimeView = true): Harness => {
  const calls: string[] = [];
  const views: PluginTimeView[] = [];
  const rerenderingAtInit: boolean[] = [];
  const captured: { core: CoreState | null } = { core: null };
  let loaded: { Ctor: TimepickerUIConstructor; scrollToValue: jest.SpyInstance } | undefined;

  jest.isolateModules(() => {
    const Ctor: TimepickerUIConstructor = require('@/timepicker/TimepickerUI').default;
    const { PluginRegistry } = require('@/core/PluginRegistry');
    const { WheelPlugin, WheelManager } = require('@/plugins/wheel');
    const scrollToValue = jest
      .spyOn(WheelManager.prototype, 'scrollToValue')
      .mockImplementation(() => undefined);

    const rangeStub: Plugin = {
      name: 'range',
      factory: (core) => {
        captured.core = core;
        return {
          init: () => {
            calls.push('init');
            rerenderingAtInit.push(core.isRerendering);
          },
          destroy: () => undefined,
          ...(withTimeView
            ? {
                setTimeView: (view: PluginTimeView) => {
                  calls.push('setTimeView');
                  views.push(view);
                },
              }
            : {}),
        };
      },
    };
    PluginRegistry.register(WheelPlugin);
    PluginRegistry.register(rangeStub);
    loaded = { Ctor, scrollToValue };
  });

  if (!loaded) throw new Error('TimepickerUI failed to load');
  return { ...loaded, calls, views, rerenderingAtInit, getCore: () => captured.core };
};

const mountPicker = (Ctor: TimepickerUIConstructor, mode: Mode): TimepickerUIClass => {
  const input = document.createElement('input');
  document.body.appendChild(input);
  const picker = new Ctor(input, { ui: { mode, animation: false }, range: { enabled: true } });
  picker.create();
  picker.open();
  return picker;
};

describe('Lifecycle hands the time view to the range plugin', () => {
  let harness: Harness | null = null;

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    harness?.Ctor.destroyAll();
    harness = null;
    jest.useRealTimers();
    jest.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it.each(MODES)('before init, in %s mode', (mode) => {
    harness = load();

    mountPicker(harness.Ctor, mode);

    expect(harness.calls).toEqual(['setTimeView', 'init']);
    expect(harness.views).toHaveLength(1);
    expect(typeof harness.views[0].show).toBe('function');
  });

  it('before every init, as the same view', () => {
    harness = load();
    const picker = mountPicker(harness.Ctor, 'wheel');

    picker.update({ options: { ui: { theme: 'dark' } } });

    expect(harness.calls).toEqual(['setTimeView', 'init', 'setTimeView', 'init']);
    expect(harness.views[1]).toBe(harness.views[0]);
  });

  it('and still inits a range plugin that has no setTimeView', () => {
    harness = load(false);

    mountPicker(harness.Ctor, 'wheel');

    expect(harness.calls).toEqual(['init']);
  });

  it('with isRerendering set only while an open picker is re-rendered', () => {
    harness = load();
    const picker = mountPicker(harness.Ctor, 'clock');
    expect(harness.rerenderingAtInit).toEqual([false]);

    picker.update({ options: { ui: { theme: 'dark' } } });

    expect(harness.rerenderingAtInit).toEqual([false, true]);
    expect(harness.getCore()?.isRerendering).toBe(false);
  });

  describe('show', () => {
    it.each(WHEEL_MODES)('moves the wheel to the shown time in %s mode', (mode) => {
      harness = load();
      mountPicker(harness.Ctor, mode);
      harness.scrollToValue.mockClear();

      harness.views[0].show({ hour: '03', minutes: '45', type: 'PM' });

      expect(harness.scrollToValue).toHaveBeenCalledTimes(1);
      expect(harness.scrollToValue).toHaveBeenCalledWith('03', '45', 'PM', undefined);
    });

    it('passes the seconds on to the wheel', () => {
      harness = load();
      mountPicker(harness.Ctor, 'wheel');
      harness.scrollToValue.mockClear();

      harness.views[0].show({ hour: '03', minutes: '45', seconds: '10', type: 'AM' });

      expect(harness.scrollToValue).toHaveBeenCalledWith('03', '45', 'AM', '10');
    });

    it('turns the clock hand to the shown hour in clock mode', () => {
      harness = load();
      mountPicker(harness.Ctor, 'clock');
      const hand = document.querySelector<HTMLElement>('.tp-ui-clock-hand:not(.mobile)');

      harness.views[0].show({ hour: '03', minutes: '45', type: 'PM' });

      expect(hand).not.toBeNull();
      const angle = Number(/rotateZ\((-?[\d.]+)deg\)/.exec(hand?.style.transform ?? '')?.[1]);
      expect(((angle % 360) + 360) % 360).toBe(90);
      expect(harness.scrollToValue).not.toHaveBeenCalled();
    });
  });
});
