import ClearButtonManager from '../../../src/managers/ClearButtonManager';
import { CoreState } from '../../../src/timepicker/CoreState';
import { setupCallbackBridge } from '../../../src/timepicker/LifecycleCallbacks';
import TimepickerUI from '../../../src/timepicker/TimepickerUI';
import { TIMINGS } from '../../../src/constants/timings';
import { EventEmitter, type TimepickerEventMap } from '../../../src/utils/EventEmitter';
import { DEFAULT_OPTIONS } from '../../../src/utils/options/defaults';
import { getModalTemplate } from '../../../src/utils/template';
import type { TimepickerOptions } from '../../../src/types/options';

const INSTANCE_ID = 'test-instance-id';

function createOptions(overrides: Partial<TimepickerOptions> = {}): Required<TimepickerOptions> {
  return {
    ...DEFAULT_OPTIONS,
    ui: {
      ...DEFAULT_OPTIONS.ui,
      clearButton: true,
      ...overrides.ui,
    },
    clock: {
      ...DEFAULT_OPTIONS.clock,
      ...overrides.clock,
    },
    labels: {
      ...DEFAULT_OPTIONS.labels,
      ...overrides.labels,
    },
    behavior: {
      ...DEFAULT_OPTIONS.behavior,
      ...overrides.behavior,
    },
    callbacks: {
      ...DEFAULT_OPTIONS.callbacks,
      ...overrides.callbacks,
    },
    timezone: {
      ...DEFAULT_OPTIONS.timezone,
      ...overrides.timezone,
    },
    range: {
      ...DEFAULT_OPTIONS.range,
      ...overrides.range,
    },
    clearBehavior: {
      ...DEFAULT_OPTIONS.clearBehavior,
      ...overrides.clearBehavior,
    },
  };
}

function mountModal(options: Required<TimepickerOptions>): void {
  const html = getModalTemplate(options, INSTANCE_ID);
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  document.body.appendChild(wrapper.firstElementChild!);
}

function getModal(): HTMLElement {
  return document.querySelector(`[data-owner-id="${INSTANCE_ID}"]`)!;
}

function getClearBtn(): HTMLElement {
  return getModal().querySelector('.tp-ui-clear-btn')!;
}

function getOkBtn(): HTMLElement {
  return getModal().querySelector('.tp-ui-ok-btn')!;
}

function getHourInput(): HTMLInputElement {
  return getModal().querySelector('.tp-ui-hour')!;
}

function getMinuteInput(): HTMLInputElement {
  return getModal().querySelector('.tp-ui-minutes')!;
}

function getSecondsInput(): HTMLInputElement {
  return getModal().querySelector('.tp-ui-seconds')!;
}

function ariaValues(field: HTMLInputElement): { now: string | null; text: string | null } {
  return { now: field.getAttribute('aria-valuenow'), text: field.getAttribute('aria-valuetext') };
}

function getClockHand(): HTMLElement {
  return getModal().querySelector('.tp-ui-clock-hand')!;
}

function getAMButton(): HTMLElement | null {
  return getModal().querySelector('.tp-ui-am');
}

function getPMButton(): HTMLElement | null {
  return getModal().querySelector('.tp-ui-pm');
}

function simulateUserSelectsHour(
  core: CoreState,
  emitter: EventEmitter<TimepickerEventMap>,
  hour: string,
  degrees: number,
): void {
  const hourInput = core.getHour();
  if (hourInput) hourInput.value = hour;
  core.setDegreesHours(degrees);
  emitter.emit('select:hour', { hour });
  emitter.emit('update', { hour, minutes: undefined, type: undefined });
}

function simulateUserSelectsMinute(
  core: CoreState,
  emitter: EventEmitter<TimepickerEventMap>,
  minutes: string,
  degrees: number,
): void {
  const minuteInput = core.getMinutes();
  if (minuteInput) minuteInput.value = minutes;
  core.setDegreesMinutes(degrees);
  emitter.emit('select:minute', { minutes });
  emitter.emit('update', { hour: undefined, minutes, type: undefined });
}

function simulateOpenWithValue(
  input: HTMLInputElement,
  core: CoreState,
  emitter: EventEmitter<TimepickerEventMap>,
  value: string,
  hour: string,
  minutes: string,
  type?: string,
): void {
  input.value = value;
  const hourInput = core.getHour();
  const minuteInput = core.getMinutes();
  if (hourInput) hourInput.value = hour;
  if (minuteInput) minuteInput.value = minutes;
  emitter.emit('open', {
    hour,
    minutes,
    type,
    degreesHours: null,
    degreesMinutes: null,
  });
}

describe('ClearButtonManager', () => {
  let core: CoreState;
  let emitter: EventEmitter<TimepickerEventMap>;
  let manager: ClearButtonManager;
  let element: HTMLElement;
  let input: HTMLInputElement;

  function setup(optionOverrides: Partial<TimepickerOptions> = {}): void {
    const options = createOptions(optionOverrides);

    element = document.createElement('div');
    input = document.createElement('input');
    input.type = 'text';
    element.appendChild(input);
    document.body.appendChild(element);

    core = new CoreState(element, options, INSTANCE_ID);
    emitter = new EventEmitter();
    setupCallbackBridge(core, emitter);

    mountModal(options);

    manager = new ClearButtonManager(core, emitter);
    manager.init();
  }

  afterEach(() => {
    manager.destroy();
    document.body.innerHTML = '';
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  describe('user opens picker with a value then clicks clear', () => {
    it('should empty the input value', () => {
      setup();
      simulateOpenWithValue(input, core, emitter, '03:30 PM', '03', '30', 'PM');

      getClearBtn().click();

      expect(input.value).toBe('');
    });

    it('should reset hour display to 12', () => {
      setup();
      simulateOpenWithValue(input, core, emitter, '03:30 PM', '03', '30', 'PM');

      getClearBtn().click();

      expect(getHourInput().value).toBe('12');
    });

    it('should reset minute display to 00', () => {
      setup();
      simulateOpenWithValue(input, core, emitter, '03:30 PM', '03', '30', 'PM');

      getClearBtn().click();

      expect(getMinuteInput().value).toBe('00');
    });

    it('should reset clock hand rotation to 0 degrees', () => {
      setup();
      simulateOpenWithValue(input, core, emitter, '03:30 PM', '03', '30', 'PM');
      getClockHand().style.transform = 'rotateZ(90deg)';

      getClearBtn().click();

      expect(getClockHand().style.transform).toBe('rotateZ(0deg)');
    });

    it('should reset AM/PM to PM in 12h mode', () => {
      setup();
      simulateOpenWithValue(input, core, emitter, '03:30 AM', '03', '30', 'AM');
      getAMButton()!.classList.add('active');

      getClearBtn().click();

      expect(getPMButton()!.classList.contains('active')).toBe(true);
      expect(getAMButton()!.classList.contains('active')).toBe(false);
      expect(getPMButton()!.getAttribute('aria-pressed')).toBe('true');
      expect(getAMButton()!.getAttribute('aria-pressed')).toBe('false');
    });

    it('should reset the hour spinbutton to aria-valuenow 12 / aria-valuetext 12 and the minutes to 0 / 00', () => {
      setup();
      simulateOpenWithValue(input, core, emitter, '03:30 PM', '03', '30', 'PM');
      getHourInput().setAttribute('aria-valuenow', '3');
      getMinuteInput().setAttribute('aria-valuenow', '30');

      getClearBtn().click();

      expect(ariaValues(getHourInput())).toEqual({ now: '12', text: '12' });
      expect(ariaValues(getMinuteInput())).toEqual({ now: '0', text: '00' });
    });

    it('should reset the seconds spinbutton to aria-valuenow 0 / aria-valuetext 00 when seconds are shown', () => {
      setup({ clock: { type: '24h', showSeconds: true } });
      simulateOpenWithValue(input, core, emitter, '15:30:45', '15', '30');
      const seconds = getSecondsInput();
      seconds.value = '45';
      seconds.setAttribute('aria-valuenow', '45');
      seconds.setAttribute('aria-valuetext', '45');

      getClearBtn().click();

      expect(seconds.value).toBe('00');
      expect(ariaValues(seconds)).toEqual({ now: '0', text: '00' });
    });

    it('should set degrees to null in core state', () => {
      setup();
      simulateOpenWithValue(input, core, emitter, '03:30 PM', '03', '30', 'PM');
      core.setDegreesHours(90);
      core.setDegreesMinutes(180);

      getClearBtn().click();

      expect(core.degreesHours).toBeNull();
      expect(core.degreesMinutes).toBeNull();
    });
  });

  describe('confirm button after clear', () => {
    it('should disable the confirm button when user clicks clear', () => {
      setup();
      simulateOpenWithValue(input, core, emitter, '03:30 PM', '03', '30', 'PM');

      getClearBtn().click();

      expect(getOkBtn().classList.contains('disabled')).toBe(true);
      expect(getOkBtn().getAttribute('aria-disabled')).toBe('true');
    });

    it('should keep confirm button disabled after clear despite clock showing 12:00', () => {
      setup();
      simulateOpenWithValue(input, core, emitter, '05:15 PM', '05', '15', 'PM');

      getClearBtn().click();

      expect(getHourInput().value).toBe('12');
      expect(getMinuteInput().value).toBe('00');
      expect(getOkBtn().classList.contains('disabled')).toBe(true);
    });

    it('should re-enable confirm button when user selects a new hour after clearing', () => {
      setup();
      simulateOpenWithValue(input, core, emitter, '03:30 PM', '03', '30', 'PM');

      getClearBtn().click();
      expect(getOkBtn().classList.contains('disabled')).toBe(true);

      simulateUserSelectsHour(core, emitter, '05', 150);

      expect(getOkBtn().classList.contains('disabled')).toBe(false);
      expect(getOkBtn().getAttribute('aria-disabled')).toBe('false');
    });

    it('should re-enable confirm button when user selects a new minute after clearing', () => {
      setup();
      simulateOpenWithValue(input, core, emitter, '03:30 PM', '03', '30', 'PM');

      getClearBtn().click();
      expect(getOkBtn().classList.contains('disabled')).toBe(true);

      simulateUserSelectsMinute(core, emitter, '45', 270);

      expect(getOkBtn().classList.contains('disabled')).toBe(false);
    });
  });

  describe('onClear callback', () => {
    it('should fire onClear with previous value when user clicks clear', () => {
      const onClear = jest.fn();
      setup({ callbacks: { onClear } });
      simulateOpenWithValue(input, core, emitter, '08:45 AM', '08', '45', 'AM');

      getClearBtn().click();

      expect(onClear).toHaveBeenCalledTimes(1);
      expect(onClear).toHaveBeenCalledWith({ previousValue: '08:45 AM' });
    });

    it('should fire onClear with null when there was no value', () => {
      const onClear = jest.fn();
      setup({ callbacks: { onClear } });
      input.value = '';

      getHourInput().value = '05';
      emitter.emit('update', { hour: '05', minutes: undefined, type: undefined });

      getClearBtn().click();

      expect(onClear).toHaveBeenCalledWith({ previousValue: null });
    });

    it('should emit clear event on the EventEmitter with previous value', () => {
      setup();
      simulateOpenWithValue(input, core, emitter, '10:00 PM', '10', '00', 'PM');
      const clearListener = jest.fn();
      emitter.on('clear', clearListener);

      getClearBtn().click();

      expect(clearListener).toHaveBeenCalledWith({ previousValue: '10:00 PM' });
    });

    it('should emit update event after clear event', () => {
      setup();
      simulateOpenWithValue(input, core, emitter, '10:00 PM', '10', '00', 'PM');
      const events: string[] = [];
      emitter.on('clear', () => events.push('clear'));
      emitter.on('update', () => events.push('update'));

      getClearBtn().click();

      expect(events[0]).toBe('clear');
      expect(events[1]).toBe('update');
    });
  });

  describe('clear button disabled state', () => {
    it('should start disabled when no time is selected', () => {
      setup();

      expect(getClearBtn().classList.contains('disabled')).toBe(true);
      expect(getClearBtn().getAttribute('aria-disabled')).toBe('true');
    });

    it('should not fire handleClearClick when user clicks a disabled clear button', () => {
      const onClear = jest.fn();
      setup({ callbacks: { onClear } });

      getClearBtn().click();

      expect(onClear).not.toHaveBeenCalled();
      expect(input.value).toBe('');
    });

    it('should become enabled when user selects a non-default hour', () => {
      setup();

      getHourInput().value = '05';
      emitter.emit('update', { hour: '05', minutes: undefined, type: undefined });

      expect(getClearBtn().classList.contains('disabled')).toBe(false);
      expect(getClearBtn().getAttribute('aria-disabled')).toBe('false');
    });

    it('should become enabled when user selects a non-default minute', () => {
      setup();

      getMinuteInput().value = '30';
      emitter.emit('update', { hour: undefined, minutes: '30', type: undefined });

      expect(getClearBtn().classList.contains('disabled')).toBe(false);
    });

    it('should become enabled when the input already has a value', () => {
      setup();
      input.value = '03:30 PM';
      emitter.emit('open', {
        hour: '03',
        minutes: '30',
        type: 'PM',
        degreesHours: 90,
        degreesMinutes: 180,
      });

      expect(getClearBtn().classList.contains('disabled')).toBe(false);
    });

    it('should become disabled again after user clicks clear', () => {
      setup();
      input.value = '03:30 PM';

      getClearBtn().click();

      expect(getClearBtn().classList.contains('disabled')).toBe(true);
      expect(getClearBtn().getAttribute('aria-disabled')).toBe('true');
    });

    it('should re-enable after clear when user starts a new selection', () => {
      setup();
      input.value = '03:30 PM';

      getClearBtn().click();
      expect(getClearBtn().classList.contains('disabled')).toBe(true);

      getHourInput().value = '07';
      emitter.emit('select:hour', { hour: '07' });

      expect(getClearBtn().classList.contains('disabled')).toBe(false);
    });
  });

  describe('24h mode', () => {
    it('should reset clock to 12:00 in 24h mode', () => {
      setup({ clock: { type: '24h' } });
      simulateOpenWithValue(input, core, emitter, '14:30', '14', '30');

      getClearBtn().click();

      expect(getHourInput().value).toBe('12');
      expect(getMinuteInput().value).toBe('00');
      expect(input.value).toBe('');
    });

    it('should not render AM/PM buttons in 24h mode', () => {
      setup({ clock: { type: '24h' } });

      expect(getAMButton()).toBeNull();
      expect(getPMButton()).toBeNull();
    });

    it('should fire onClear with the 24h previous value', () => {
      const onClear = jest.fn();
      setup({ clock: { type: '24h' }, callbacks: { onClear } });
      simulateOpenWithValue(input, core, emitter, '22:15', '22', '15');

      getClearBtn().click();

      expect(onClear).toHaveBeenCalledWith({ previousValue: '22:15' });
    });

    it('should disable confirm button after clearing in 24h mode', () => {
      setup({ clock: { type: '24h' } });
      simulateOpenWithValue(input, core, emitter, '14:30', '14', '30');

      getClearBtn().click();

      expect(getOkBtn().classList.contains('disabled')).toBe(true);
    });
  });

  describe('clear button not enabled', () => {
    it('should not init when clearButton is false', () => {
      const options = createOptions({ ui: { clearButton: false } });
      element = document.createElement('div');
      input = document.createElement('input');
      input.type = 'text';
      element.appendChild(input);
      document.body.appendChild(element);

      core = new CoreState(element, options, INSTANCE_ID);
      emitter = new EventEmitter();
      mountModal(options);
      manager = new ClearButtonManager(core, emitter);
      manager.init();

      expect(getModal().querySelector('.tp-ui-clear-btn')).toBeNull();
    });
  });

  describe('screen reader announcement', () => {
    it('should announce time cleared to screen readers', () => {
      jest.useFakeTimers();
      setup();
      simulateOpenWithValue(input, core, emitter, '03:30 PM', '03', '30', 'PM');

      getClearBtn().click();

      jest.advanceTimersByTime(150);

      const announcer = getModal().querySelector('.timepicker-announcer');
      expect(announcer!.textContent).toBe('Time cleared');
    });
  });

  describe('active tip states after clear', () => {
    it('should remove active class from all value tips', () => {
      setup();
      simulateOpenWithValue(input, core, emitter, '03:30 PM', '03', '30', 'PM');

      const tipsWrapper = getModal().querySelector('.tp-ui-tips-wrapper')!;
      const tip = document.createElement('div');
      tip.classList.add('tp-ui-value-tips', 'active');
      tipsWrapper.appendChild(tip);

      getClearBtn().click();

      expect(tip.classList.contains('active')).toBe(false);
    });

    it('should write nothing to tips that were not active', () => {
      setup();
      simulateOpenWithValue(input, core, emitter, '03:30 PM', '03', '30', 'PM');
      const tipsWrapper = getModal().querySelector('.tp-ui-tips-wrapper')!;
      const tips = ['12', '1', '2', '3'].map((value) => {
        const tip = document.createElement('span');
        tip.className = value === '3' ? 'tp-ui-value-tips active' : 'tp-ui-value-tips';
        tip.textContent = value;
        tipsWrapper.appendChild(tip);
        return tip;
      });
      const [, , , activeTip] = tips;
      const observer = new MutationObserver(() => {});
      observer.observe(tipsWrapper, { attributes: true, subtree: true, attributeOldValue: true });

      getClearBtn().click();

      const records = observer.takeRecords();
      observer.disconnect();
      tips
        .filter((tip) => tip !== activeTip)
        .forEach((tip) => expect(records.filter((record) => record.target === tip)).toHaveLength(0));
      expect(records).toHaveLength(1);
      expect(records[0].target).toBe(activeTip);
      expect(records[0].attributeName).toBe('class');
      expect(activeTip.classList.contains('active')).toBe(false);
    });
  });

  describe('destroyed instance guard', () => {
    it('should not fire clear when instance is destroyed', () => {
      const onClear = jest.fn();
      setup({ callbacks: { onClear } });
      simulateOpenWithValue(input, core, emitter, '03:30 PM', '03', '30', 'PM');

      core.setIsDestroyed(true);

      getClearBtn().click();

      expect(onClear).not.toHaveBeenCalled();
    });
  });

  describe('full user flow: select → clear → reselect', () => {
    it('should handle a complete select → clear → reselect cycle', () => {
      const onClear = jest.fn();
      setup({ callbacks: { onClear } });

      simulateUserSelectsHour(core, emitter, '03', 90);
      simulateUserSelectsMinute(core, emitter, '30', 180);
      input.value = '03:30 PM';

      expect(getClearBtn().classList.contains('disabled')).toBe(false);
      expect(getOkBtn().classList.contains('disabled')).toBe(false);

      getClearBtn().click();

      expect(input.value).toBe('');
      expect(getHourInput().value).toBe('12');
      expect(getMinuteInput().value).toBe('00');
      expect(getClearBtn().classList.contains('disabled')).toBe(true);
      expect(getOkBtn().classList.contains('disabled')).toBe(true);
      expect(onClear).toHaveBeenCalledWith({ previousValue: '03:30 PM' });

      simulateUserSelectsHour(core, emitter, '07', 210);

      expect(getClearBtn().classList.contains('disabled')).toBe(false);
      expect(getOkBtn().classList.contains('disabled')).toBe(false);
    });

    it('should handle double clear without errors', () => {
      setup();
      simulateOpenWithValue(input, core, emitter, '03:30 PM', '03', '30', 'PM');

      getClearBtn().click();

      expect(getClearBtn().classList.contains('disabled')).toBe(true);

      getClearBtn().click();

      expect(input.value).toBe('');
      expect(getClearBtn().classList.contains('disabled')).toBe(true);
    });
  });

  describe('clearBehavior.clearInput option', () => {
    it('should clear input value when clearInput is true (default)', () => {
      setup();
      simulateOpenWithValue(input, core, emitter, '03:30 PM', '03', '30', 'PM');

      getClearBtn().click();

      expect(input.value).toBe('');
    });

    it('should keep input value when clearInput is false', () => {
      setup({ clearBehavior: { clearInput: false } });
      simulateOpenWithValue(input, core, emitter, '03:30 PM', '03', '30', 'PM');

      getClearBtn().click();

      expect(input.value).toBe('03:30 PM');
    });

    it('should still reset clock hands when clearInput is false', () => {
      setup({ clearBehavior: { clearInput: false } });
      simulateOpenWithValue(input, core, emitter, '03:30 PM', '03', '30', 'PM');

      getClearBtn().click();

      expect(getHourInput().value).toBe('12');
      expect(getMinuteInput().value).toBe('00');
    });

    it('should still reset clock hand rotation when clearInput is false', () => {
      setup({ clearBehavior: { clearInput: false } });
      simulateOpenWithValue(input, core, emitter, '03:30 PM', '03', '30', 'PM');
      getClockHand().style.transform = 'rotateZ(90deg)';

      getClearBtn().click();

      expect(getClockHand().style.transform).toBe('rotateZ(0deg)');
    });

    it('should still disable confirm button when clearInput is false', () => {
      setup({ clearBehavior: { clearInput: false } });
      simulateOpenWithValue(input, core, emitter, '03:30 PM', '03', '30', 'PM');

      getClearBtn().click();

      expect(getOkBtn().classList.contains('disabled')).toBe(true);
    });

    it('should still fire onClear callback when clearInput is false', () => {
      const onClear = jest.fn();
      setup({ clearBehavior: { clearInput: false }, callbacks: { onClear } });
      simulateOpenWithValue(input, core, emitter, '05:00 AM', '05', '00', 'AM');

      getClearBtn().click();

      expect(onClear).toHaveBeenCalledWith({ previousValue: '05:00 AM' });
    });

    it('should still set degrees to null when clearInput is false', () => {
      setup({ clearBehavior: { clearInput: false } });
      simulateOpenWithValue(input, core, emitter, '03:30 PM', '03', '30', 'PM');
      core.setDegreesHours(90);
      core.setDegreesMinutes(180);

      getClearBtn().click();

      expect(core.degreesHours).toBeNull();
      expect(core.degreesMinutes).toBeNull();
    });

    it('should handle full flow with clearInput false: select → clear → reselect', () => {
      const onClear = jest.fn();
      setup({ clearBehavior: { clearInput: false }, callbacks: { onClear } });

      simulateUserSelectsHour(core, emitter, '03', 90);
      simulateUserSelectsMinute(core, emitter, '30', 180);
      input.value = '03:30 PM';

      getClearBtn().click();

      expect(input.value).toBe('03:30 PM');
      expect(getHourInput().value).toBe('12');
      expect(getMinuteInput().value).toBe('00');
      expect(getOkBtn().classList.contains('disabled')).toBe(true);

      simulateUserSelectsHour(core, emitter, '07', 210);

      expect(getOkBtn().classList.contains('disabled')).toBe(false);
    });
  });
});

describe('callbacks.onClear through the public TimepickerUI API', () => {
  let input: HTMLInputElement;

  function createPicker(onClear: jest.Mock): TimepickerUI {
    const picker = new TimepickerUI(input, {
      clock: { type: '12h' },
      ui: { clearButton: true, animation: false },
      callbacks: { onClear },
    });
    picker.create();
    picker.setValue('08:45 AM');
    return picker;
  }

  function clickClear(): void {
    const clear = document.querySelector('.tp-ui-modal .tp-ui-clear-btn') as HTMLElement;
    expect(clear.getAttribute('aria-disabled')).toBe('false');
    clear.click();
  }

  beforeEach(() => {
    jest.useFakeTimers();
    input = document.createElement('input');
    document.body.appendChild(input);
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  it('should fire onClear exactly once with the previous value when the user clicks Clear', () => {
    const onClear = jest.fn();
    const picker = createPicker(onClear);
    picker.open();

    clickClear();

    expect(onClear).toHaveBeenCalledTimes(1);
    expect(onClear).toHaveBeenCalledWith({ previousValue: '08:45 AM' });
    expect(input.value).toBe('');
  });

  it('should still fire onClear exactly once after the picker was closed and reopened', () => {
    const onClear = jest.fn();
    const picker = createPicker(onClear);
    picker.open();
    picker.close();
    jest.advanceTimersByTime(TIMINGS.MODAL_EXIT);
    expect(document.querySelector('.tp-ui-modal')).toBeNull();
    picker.open();

    clickClear();

    expect(onClear).toHaveBeenCalledTimes(1);
    expect(onClear).toHaveBeenCalledWith({ previousValue: '08:45 AM' });
  });

  it('should touch only the old active tip and the neutral 12 tip, without rebuilding the tips', () => {
    const picker = createPicker(jest.fn());
    picker.open();
    jest.advanceTimersByTime(TIMINGS.TIPS_ANIMATION);
    const tipsWrapper = document.querySelector('.tp-ui-modal .tp-ui-tips-wrapper') as HTMLElement;
    const tips = [...tipsWrapper.querySelectorAll<HTMLElement>('.tp-ui-value-tips')];
    const tipFor = (value: string): HTMLElement =>
      tips.find((tip) => tip.textContent === value) as HTMLElement;
    expect(tips).toHaveLength(12);
    expect(tipFor('8').classList.contains('active')).toBe(true);
    const observer = new MutationObserver(() => {});
    observer.observe(tipsWrapper, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeOldValue: true,
    });

    clickClear();

    const records = observer.takeRecords();
    observer.disconnect();
    const changedTargets = new Set(records.map((record) => record.target));
    expect(records.filter((record) => record.type === 'childList')).toHaveLength(0);
    expect(records.every((record) => record.attributeName === 'class')).toBe(true);
    expect(changedTargets.size).toBe(2);
    expect(changedTargets.has(tipFor('8'))).toBe(true);
    expect(changedTargets.has(tipFor('12'))).toBe(true);
    const activeTips = tips.filter((tip) => tip.classList.contains('active'));
    expect(activeTips).toHaveLength(1);
    expect(activeTips[0]).toBe(tipFor('12'));
    tips.forEach((tip) => expect(tip).not.toHaveAttribute('aria-selected'));
  });
});

