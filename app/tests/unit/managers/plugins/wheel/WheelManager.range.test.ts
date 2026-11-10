import WheelManager from '@/managers/plugins/wheel/WheelManager';
import type { CoreState } from '@/timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '@/utils/EventEmitter';
import { mockWheelItemHeight, selectedWheelValue, setupWheelTestContext } from './wheel-test-helpers';

type Column = 'hours' | 'minutes';

const QUIET_EVENTS = [
  'update',
  'select:hour',
  'select:minute',
  'wheel:scroll:start',
  'wheel:scroll:end',
] as const;

const minutesBelow = (limit: number): string[] =>
  Array.from({ length: limit }, (_, index) => String(index).padStart(2, '0'));

const disabled = (column: Column, value: string): boolean | undefined =>
  document
    .querySelector(`.tp-ui-modal .tp-ui-wheel-${column} .tp-ui-wheel-item[data-value="${value}"]`)
    ?.classList.contains('is-disabled');

const clearHeader = (core: CoreState): void => {
  [core.getHour(), core.getMinutes()].forEach((field) => {
    if (field) field.value = '';
  });
};

const pressArrowDown = (column: Column): void => {
  document
    .querySelector(`.tp-ui-modal .tp-ui-wheel-${column}`)
    ?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
};

describe('WheelManager with the range plugin', () => {
  let frame: FrameRequestCallback | null;
  let managers: WheelManager[];

  const mount = (core: CoreState, emitter: EventEmitter<TimepickerEventMap>): WheelManager => {
    const manager = new WheelManager(core, emitter);
    manager.init();
    managers.push(manager);
    return manager;
  };

  beforeEach(() => {
    frame = null;
    managers = [];
    mockWheelItemHeight();
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      frame = callback;
      return 1;
    });
  });

  afterEach(() => {
    managers.forEach((manager) => manager.destroy());
    jest.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('16: range:switch marks the hours before From and null clears them', () => {
    const { core, emitter } = setupWheelTestContext('24h');
    mount(core, emitter);

    emitter.emit('range:switch', { active: 'to', disabledTime: { hours: [], minutes: [], fromHour: 11 } });
    expect(disabled('hours', '10')).toBe(true);
    expect(disabled('hours', '11')).toBe(false);

    emitter.emit('range:switch', { active: 'from', disabledTime: null });
    expect(disabled('hours', '10')).toBe(false);
  });

  it('16: an hour snap re-evaluates the minute marks', () => {
    const { core, emitter } = setupWheelTestContext('24h');
    clearHeader(core);
    const manager = mount(core, emitter);
    manager.scrollToValue('09', '00');
    emitter.emit('range:switch', {
      active: 'to',
      disabledTime: { hours: minutesBelow(9), minutes: minutesBelow(30), fromHour: 9 },
    });
    expect(disabled('minutes', '29')).toBe(true);

    pressArrowDown('hours');

    expect(selectedWheelValue('hours')).toBe('10');
    expect(disabled('minutes', '29')).toBe(false);
  });

  it('17: refreshDisabledTime keeps the limit next to clock.disabledTime', () => {
    const { core, emitter } = setupWheelTestContext('24h');
    const manager = mount(core, emitter);
    emitter.emit('range:switch', { active: 'to', disabledTime: { hours: [], minutes: [], fromHour: 11 } });
    core.setDisabledTime({ value: { hours: ['15'] } });

    manager.updateDisabledItems();

    expect(disabled('hours', '10')).toBe(true);
    expect(disabled('hours', '15')).toBe(true);
    expect(disabled('hours', '11')).toBe(false);
  });

  it('18: range:switch never moves the wheel and never emits update', () => {
    const { core, emitter } = setupWheelTestContext('24h');
    const manager = mount(core, emitter);
    manager.scrollToValue('10', '00');
    const heard = jest.fn();
    QUIET_EVENTS.forEach((event) => emitter.on(event, heard));

    emitter.emit('range:switch', { active: 'to', disabledTime: { hours: [], minutes: [], fromHour: 11 } });

    expect(selectedWheelValue('hours')).toBe('10');
    expect(selectedWheelValue('minutes')).toBe('00');
    expect(disabled('hours', '10')).toBe(true);
    expect(heard).not.toHaveBeenCalled();
  });

  it('19: the quiet show moves the columns and emits nothing', () => {
    const { core, emitter } = setupWheelTestContext('24h');
    const manager = mount(core, emitter);
    const heard = jest.fn();
    QUIET_EVENTS.forEach((event) => emitter.on(event, heard));

    manager.scrollToValue('09', '15');

    expect(selectedWheelValue('hours')).toBe('09');
    expect(selectedWheelValue('minutes')).toBe('15');
    expect(manager.getSelection()).toEqual(expect.objectContaining({ hour: '09', minutes: '15' }));
    expect(heard).not.toHaveBeenCalled();
  });

  describe('20: deferred initial sync in compact-wheel with a from - to input', () => {
    const mountCompact = (): { manager: WheelManager; emitter: EventEmitter<TimepickerEventMap> } => {
      const { core, emitter } = setupWheelTestContext('24h');
      core.updateOptions({ ui: { mode: 'compact-wheel' } });
      clearHeader(core);
      const input = core.getInput();
      if (input) input.value = '09:00 - 17:00';
      return { manager: mount(core, emitter), emitter };
    };

    it('keeps the time shown during init', () => {
      const { manager } = mountCompact();

      manager.scrollToValue('17', '00');
      expect(frame).not.toBeNull();
      frame?.(0);

      expect(selectedWheelValue('hours')).toBe('17');
      expect(selectedWheelValue('minutes')).toBe('00');
    });

    it('falls back to the neutral time when nothing was shown', () => {
      mountCompact();

      frame?.(0);

      expect(selectedWheelValue('hours')).toBe('00');
    });

    it('returns to the neutral time on Clear and forgets the shown time', () => {
      const { manager, emitter } = mountCompact();
      manager.scrollToValue('17', '00');
      frame?.(0);

      emitter.emit('clear', { previousValue: '09:00 - 17:00' });

      expect(selectedWheelValue('hours')).toBe('00');
      expect(selectedWheelValue('minutes')).toBe('00');
    });
  });
});
