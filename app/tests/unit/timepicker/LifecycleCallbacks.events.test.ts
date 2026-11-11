import TimepickerUI from '@/timepicker/TimepickerUI';
import { PluginRegistry } from '@/core/PluginRegistry';
import { WheelPlugin } from '@/plugins/wheel';
import { CALLBACK_BRIDGE, setupCallbackBridge } from '@/timepicker/LifecycleCallbacks';
import { CoreState } from '@/timepicker/CoreState';
import { EventEmitter, type TimepickerEventMap } from '@/utils/EventEmitter';
import { mergeOptions } from '@/utils/options/defaults';
import type { TimepickerOptions } from '@/types/options';
import { mockWheelItemHeight } from '../managers/plugins/wheel/wheel-test-helpers';

const SETTLE_MS = 1000;

type EventCallback =
  | 'onShow'
  | 'onSwitchView'
  | 'onSwitchFace'
  | 'onSelectPeriod'
  | 'onWheelScrollStart'
  | 'onWheelScrollEnd';

interface CallbackScenario {
  callback: EventCallback;
  event: string;
  options: TimepickerOptions;
  value?: string;
  trigger: (picker: TimepickerUI, input: HTMLInputElement) => void;
}

const settle = (): void => {
  jest.advanceTimersByTime(SETTLE_MS);
};

const clickOpener = (_picker: TimepickerUI, input: HTMLInputElement): void => {
  input.click();
  settle();
};

const clickInModal = (picker: TimepickerUI, selector: string): void => {
  picker.open();
  settle();
  const element = document.querySelector(`.tp-ui-modal ${selector}`) as HTMLElement;
  expect(element).not.toBeNull();
  element.click();
  settle();
};

const clickSwitchIcon = (picker: TimepickerUI): void =>
  clickInModal(picker, '.tp-ui-keyboard-icon-wrapper button');

const clickMinutesField = (picker: TimepickerUI): void => clickInModal(picker, '.tp-ui-minutes');

const clickPmButton = (picker: TimepickerUI): void => clickInModal(picker, '.tp-ui-pm');

const scrollHourWheel = (picker: TimepickerUI): void => {
  picker.open();
  settle();
  const column = document.querySelector('.tp-ui-modal .tp-ui-wheel-hours') as HTMLElement;
  expect(column).not.toBeNull();
  column.dispatchEvent(new WheelEvent('wheel', { deltaY: 100, bubbles: true, cancelable: true }));
  settle();
};

const CLOCK: TimepickerOptions = { clock: { type: '24h' }, ui: { animation: false } };
const CLOCK_WITH_SWITCH: TimepickerOptions = {
  clock: { type: '24h' },
  ui: { animation: false, enableSwitchIcon: true },
};
const CLOCK_12H: TimepickerOptions = { clock: { type: '12h' }, ui: { animation: false } };
const WHEEL: TimepickerOptions = { clock: { type: '24h' }, ui: { mode: 'wheel', animation: false } };

const SCENARIOS: CallbackScenario[] = [
  { callback: 'onShow', event: 'show', options: CLOCK, trigger: clickOpener },
  { callback: 'onSwitchView', event: 'switch:view', options: CLOCK_WITH_SWITCH, trigger: clickSwitchIcon },
  { callback: 'onSwitchFace', event: 'switch:face', options: CLOCK, trigger: clickMinutesField },
  {
    callback: 'onSelectPeriod',
    event: 'select:period',
    options: CLOCK_12H,
    value: '10:15 AM',
    trigger: clickPmButton,
  },
  { callback: 'onWheelScrollStart', event: 'wheel:scroll:start', options: WHEEL, trigger: scrollHourWheel },
  { callback: 'onWheelScrollEnd', event: 'wheel:scroll:end', options: WHEEL, trigger: scrollHourWheel },
];

describe('callbacks exist for every public event', () => {
  beforeAll(() => PluginRegistry.register(WheelPlugin));

  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(performance, 'now').mockImplementation(() => Date.now());
    mockWheelItemHeight();
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.restoreAllMocks();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  describe.each(['create', 'update'] as const)('when the callback is given at %s', (givenAt) => {
    it.each(SCENARIOS)(
      'should call $callback once with the $event payload',
      ({ callback, event, options, value = '10:15', trigger }) => {
        const input = document.createElement('input');
        input.value = value;
        document.body.appendChild(input);
        const handler = jest.fn();
        const callbacks = { [callback]: handler } as TimepickerOptions['callbacks'];
        const picker = new TimepickerUI(input, givenAt === 'create' ? { ...options, callbacks } : options);
        const listener = jest.fn();
        picker.on(event, listener);
        picker.create();
        if (givenAt === 'update') {
          picker.update({ options: { callbacks } });
        }

        trigger(picker, input);

        expect(listener).toHaveBeenCalledTimes(1);
        expect(handler).toHaveBeenCalledTimes(1);
        expect(handler).toHaveBeenCalledWith(listener.mock.calls[0][0]);
      },
    );
  });

  it('should bridge each event to exactly one callback and leave hide, open:request and animation events unbridged', () => {
    const bridgedEvents = CALLBACK_BRIDGE.map(([, eventName]) => eventName);
    const callbackNames = CALLBACK_BRIDGE.map(([callbackName]) => callbackName);

    expect(bridgedEvents).toEqual(expect.arrayContaining(SCENARIOS.map(({ event }) => event)));
    expect(callbackNames).toEqual(expect.arrayContaining(SCENARIOS.map(({ callback }) => callback)));
    expect(new Set(bridgedEvents).size).toBe(bridgedEvents.length);
    expect(new Set(callbackNames).size).toBe(callbackNames.length);
    ['hide', 'open:request', 'input:commit', 'animation:clock', 'animation:start', 'animation:end'].forEach(
      (eventName) => {
        expect(bridgedEvents).not.toContain(eventName);
      },
    );
  });

  it('should bridge range:change to callbacks.onRangeChange with the emitted payload', () => {
    const onRangeChange = jest.fn();
    const input = document.createElement('input');
    document.body.appendChild(input);
    const core = new CoreState(input, mergeOptions({ callbacks: { onRangeChange } }), 'range-change-bridge');
    const emitter = new EventEmitter<TimepickerEventMap>();
    setupCallbackBridge(core, emitter);
    const payload = {
      part: 'from' as const,
      from: { hour: '09', minutes: '00' },
      to: null,
    };

    emitter.emit('range:change', payload);

    expect(onRangeChange).toHaveBeenCalledTimes(1);
    expect(onRangeChange).toHaveBeenCalledWith(payload);
  });
});
