import { InputHandlers } from '../../../../src/managers/events/InputHandlers';
import { CoreState } from '../../../../src/timepicker/CoreState';
import { EventEmitter } from '../../../../src/utils/EventEmitter';
import type { TimepickerEventMap } from '../../../../src/utils/EventEmitter';
import type { TimepickerOptions } from '../../../../src/types/options';
import { mergeOptions } from '../../../../src/utils/options/defaults';

describe('InputHandlers', () => {
  let core: CoreState;
  let emitter: EventEmitter<TimepickerEventMap>;
  let inputHandlers: InputHandlers;
  let hourInput: HTMLInputElement;
  let minuteInput: HTMLInputElement;

  beforeEach(() => {
    document.body.innerHTML = `
      <div>
        <input type="number" class="tp-ui-hour" value="12" />
        <input type="number" class="tp-ui-minutes" value="00" />
        <div class="tp-ui-am active" data-type="AM">AM</div>
      </div>
    `;

    hourInput = document.querySelector('.tp-ui-hour') as HTMLInputElement;
    minuteInput = document.querySelector('.tp-ui-minutes') as HTMLInputElement;

    const options: TimepickerOptions = {
      clock: { type: '12h' },
      ui: { editable: false, mobile: false },
    };

    core = new CoreState(hourInput, mergeOptions(options), 'test-instance-id', 'test-custom-id');

    jest.spyOn(core, 'getHour').mockReturnValue(hourInput);
    jest.spyOn(core, 'getMinutes').mockReturnValue(minuteInput);
    jest.spyOn(core, 'getActiveTypeMode').mockReturnValue(document.querySelector('.tp-ui-am'));

    emitter = new EventEmitter<TimepickerEventMap>();
    inputHandlers = new InputHandlers(core, emitter);
  });

  afterEach(() => {
    inputHandlers.destroy();
    document.body.innerHTML = '';
  });

  describe('handleHourEvents', () => {
    it('should attach click and blur event listeners', () => {
      const addEventListenerSpy = jest.spyOn(hourInput, 'addEventListener');

      inputHandlers.handleHourEvents();

      expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
      expect(addEventListenerSpy).toHaveBeenCalledWith('blur', expect.any(Function));
    });

    it('should emit select:hour and update events on click', () => {
      const selectHourSpy = jest.fn();
      const updateSpy = jest.fn();

      emitter.on('select:hour', selectHourSpy);
      emitter.on('update', updateSpy);

      inputHandlers.handleHourEvents();
      hourInput.click();

      expect(selectHourSpy).toHaveBeenCalledWith({ hour: '12' });
      expect(updateSpy).toHaveBeenCalledWith({
        hour: '12',
        minutes: '00',
        type: 'AM',
      });
    });

    it('should clamp hour value on blur when input is editable (no readonly)', () => {
      hourInput.removeAttribute('readonly');
      hourInput.value = '169';

      inputHandlers.handleHourEvents();
      hourInput.dispatchEvent(new FocusEvent('blur'));

      expect(hourInput.value).toBe('12');
      expect(hourInput.getAttribute('aria-valuenow')).toBe('12');
    });

    it('should NOT clamp hour value on blur when input has readonly attribute', () => {
      hourInput.setAttribute('readonly', '');
      hourInput.value = '169';

      inputHandlers.handleHourEvents();
      hourInput.dispatchEvent(new FocusEvent('blur'));

      expect(hourInput.value).toBe('169');
    });

    it('should clamp hour value correctly for 12h mode', () => {
      hourInput.removeAttribute('readonly');
      hourInput.value = '25';

      inputHandlers.handleHourEvents();
      hourInput.dispatchEvent(new FocusEvent('blur'));

      expect(hourInput.value).toBe('12');
    });

    it('should clamp hour value correctly for 24h mode', () => {
      hourInput.removeAttribute('readonly');
      hourInput.value = '169';

      core.options.clock.type = '24h';

      inputHandlers.handleHourEvents();
      hourInput.dispatchEvent(new FocusEvent('blur'));

      expect(hourInput.value).toBe('23');
    });

    it('should emit animation:clock and select:hour on blur when value changes', () => {
      const animationSpy = jest.fn();
      const selectHourSpy = jest.fn();
      const updateSpy = jest.fn();

      emitter.on('animation:clock', animationSpy);
      emitter.on('select:hour', selectHourSpy);
      emitter.on('update', updateSpy);

      hourInput.removeAttribute('readonly');
      hourInput.value = '08';

      inputHandlers.handleHourEvents();

      hourInput.value = '09';
      hourInput.dispatchEvent(new FocusEvent('blur'));

      expect(animationSpy).toHaveBeenCalledWith({});
      expect(selectHourSpy).toHaveBeenCalledWith({ hour: '09' });
      expect(updateSpy).toHaveBeenCalledWith({
        hour: '09',
        minutes: '00',
        type: 'AM',
      });
    });

    it('should NOT emit events on blur if value did not change', () => {
      const animationSpy = jest.fn();
      const selectHourSpy = jest.fn();

      emitter.on('animation:clock', animationSpy);
      emitter.on('select:hour', selectHourSpy);

      hourInput.removeAttribute('readonly');
      hourInput.value = '12';

      inputHandlers.handleHourEvents();

      hourInput.dispatchEvent(new FocusEvent('blur'));

      expect(animationSpy).not.toHaveBeenCalled();
      expect(selectHourSpy).not.toHaveBeenCalled();
    });

    it('should work when switching from desktop to mobile (readonly removed)', () => {
      hourInput.setAttribute('readonly', '');
      hourInput.value = '169';

      inputHandlers.handleHourEvents();

      hourInput.dispatchEvent(new FocusEvent('blur'));
      expect(hourInput.value).toBe('169');

      hourInput.removeAttribute('readonly');
      hourInput.value = '666';

      hourInput.dispatchEvent(new FocusEvent('blur'));
      expect(hourInput.value).toBe('12');
    });
  });

  describe('handleMinutesEvents', () => {
    it('should attach click and blur event listeners', () => {
      const addEventListenerSpy = jest.spyOn(minuteInput, 'addEventListener');

      inputHandlers.handleMinutesEvents();

      expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
      expect(addEventListenerSpy).toHaveBeenCalledWith('blur', expect.any(Function));
    });

    it('should emit select:minute and update events on click', () => {
      const selectMinuteSpy = jest.fn();
      const updateSpy = jest.fn();

      emitter.on('select:minute', selectMinuteSpy);
      emitter.on('update', updateSpy);

      inputHandlers.handleMinutesEvents();
      minuteInput.click();

      expect(selectMinuteSpy).toHaveBeenCalledWith({ minutes: '00' });
      expect(updateSpy).toHaveBeenCalledWith({
        hour: '12',
        minutes: '00',
        type: 'AM',
      });
    });

    it('should clamp minute value on blur when input is editable (no readonly)', () => {
      minuteInput.removeAttribute('readonly');
      minuteInput.value = '70';

      inputHandlers.handleMinutesEvents();
      minuteInput.dispatchEvent(new FocusEvent('blur'));

      expect(minuteInput.value).toBe('59');
      expect(minuteInput.getAttribute('aria-valuenow')).toBe('59');
    });

    it('should NOT clamp minute value on blur when input has readonly attribute', () => {
      minuteInput.setAttribute('readonly', '');
      minuteInput.value = '70';

      inputHandlers.handleMinutesEvents();
      minuteInput.dispatchEvent(new FocusEvent('blur'));

      expect(minuteInput.value).toBe('70');
    });

    it('should clamp minute value correctly (0-59 range)', () => {
      minuteInput.removeAttribute('readonly');
      minuteInput.value = '169';

      inputHandlers.handleMinutesEvents();
      minuteInput.dispatchEvent(new FocusEvent('blur'));

      expect(minuteInput.value).toBe('59');
    });

    it('should emit animation:clock and select:minute on blur when value changes', () => {
      const animationSpy = jest.fn();
      const selectMinuteSpy = jest.fn();
      const updateSpy = jest.fn();

      emitter.on('animation:clock', animationSpy);
      emitter.on('select:minute', selectMinuteSpy);
      emitter.on('update', updateSpy);

      minuteInput.removeAttribute('readonly');
      minuteInput.value = '45';

      inputHandlers.handleMinutesEvents();

      minuteInput.value = '30';
      minuteInput.dispatchEvent(new FocusEvent('blur'));

      expect(animationSpy).toHaveBeenCalledWith({});
      expect(selectMinuteSpy).toHaveBeenCalledWith({ minutes: '30' });
      expect(updateSpy).toHaveBeenCalledWith({
        hour: '12',
        minutes: '30',
        type: 'AM',
      });
    });

    it('should NOT emit events on blur if value did not change', () => {
      const animationSpy = jest.fn();
      const selectMinuteSpy = jest.fn();

      emitter.on('animation:clock', animationSpy);
      emitter.on('select:minute', selectMinuteSpy);

      minuteInput.removeAttribute('readonly');
      minuteInput.value = '00';

      inputHandlers.handleMinutesEvents();

      minuteInput.dispatchEvent(new FocusEvent('blur'));

      expect(animationSpy).not.toHaveBeenCalled();
      expect(selectMinuteSpy).not.toHaveBeenCalled();
    });

    it('should work when switching from desktop to mobile (readonly removed)', () => {
      minuteInput.setAttribute('readonly', '');
      minuteInput.value = '70';

      inputHandlers.handleMinutesEvents();

      minuteInput.dispatchEvent(new FocusEvent('blur'));
      expect(minuteInput.value).toBe('70');

      minuteInput.removeAttribute('readonly');
      minuteInput.value = '169';

      minuteInput.dispatchEvent(new FocusEvent('blur'));
      expect(minuteInput.value).toBe('59');
    });
  });

  describe('spinbutton ARIA on blur', () => {
    const ariaOf = (input: HTMLInputElement): { now: string | null; text: string | null } => ({
      now: input.getAttribute('aria-valuenow'),
      text: input.getAttribute('aria-valuetext'),
    });

    it('should remove aria-valuenow and aria-valuetext when an editable hour is left empty', () => {
      hourInput.removeAttribute('readonly');
      hourInput.setAttribute('aria-valuenow', '12');
      hourInput.setAttribute('aria-valuetext', '12');
      hourInput.value = '';

      inputHandlers.handleHourEvents();
      hourInput.dispatchEvent(new FocusEvent('blur'));

      expect(ariaOf(hourInput)).toEqual({ now: null, text: null });
    });

    it('should clamp a typed 75 minute to 59 with aria-valuetext 59', () => {
      minuteInput.removeAttribute('readonly');
      minuteInput.value = '75';

      inputHandlers.handleMinutesEvents();
      minuteInput.dispatchEvent(new FocusEvent('blur'));

      expect(minuteInput.value).toBe('59');
      expect(ariaOf(minuteInput)).toEqual({ now: '59', text: '59' });
    });
  });

  describe('destroy', () => {
    it('should remove all event listeners', () => {
      const hourRemoveSpy = jest.spyOn(hourInput, 'removeEventListener');
      const minuteRemoveSpy = jest.spyOn(minuteInput, 'removeEventListener');

      inputHandlers.handleHourEvents();
      inputHandlers.handleMinutesEvents();
      inputHandlers.destroy();

      expect(hourRemoveSpy).toHaveBeenCalledWith('click', expect.any(Function));
      expect(hourRemoveSpy).toHaveBeenCalledWith('blur', expect.any(Function));
      expect(minuteRemoveSpy).toHaveBeenCalledWith('click', expect.any(Function));
      expect(minuteRemoveSpy).toHaveBeenCalledWith('blur', expect.any(Function));
    });

    it('should clear cleanup handlers array', () => {
      inputHandlers.handleHourEvents();
      inputHandlers.handleMinutesEvents();

      inputHandlers.destroy();

      expect(() => inputHandlers.destroy()).not.toThrow();
    });
  });
});

describe('InputHandlers snaps a typed value to the nearest enabled time on blur', () => {
  type DisabledValue = NonNullable<CoreState['disabledTime']>['value'];

  let core: CoreState;
  let emitter: EventEmitter<TimepickerEventMap>;
  let handlers: InputHandlers;
  let hourInput: HTMLInputElement;
  let minuteInput: HTMLInputElement;
  let emitSpy: jest.SpyInstance;

  const setup = (
    clockType: '12h' | '24h',
    disabled: DisabledValue,
    header: { hour: string; minutes: string },
  ): void => {
    document.body.innerHTML = `
      <div>
        <input type="number" class="tp-ui-hour" value="${header.hour}" />
        <input type="number" class="tp-ui-minutes" value="${header.minutes}" />
        <div class="tp-ui-type-mode tp-ui-am active" data-type="AM">AM</div>
      </div>
    `;

    hourInput = document.querySelector('.tp-ui-hour') as HTMLInputElement;
    minuteInput = document.querySelector('.tp-ui-minutes') as HTMLInputElement;
    const activePeriod =
      clockType === '12h' ? (document.querySelector('.tp-ui-am') as HTMLButtonElement) : null;

    const options: TimepickerOptions = { clock: { type: clockType }, ui: { editable: true, mobile: false } };
    core = new CoreState(hourInput, mergeOptions(options), 'input-disabled-instance');
    core.setDisabledTime({ value: disabled });

    jest.spyOn(core, 'getHour').mockReturnValue(hourInput);
    jest.spyOn(core, 'getMinutes').mockReturnValue(minuteInput);
    jest.spyOn(core, 'getActiveTypeMode').mockReturnValue(activePeriod);

    emitter = new EventEmitter<TimepickerEventMap>();
    handlers = new InputHandlers(core, emitter);
    handlers.handleHourEvents();
    handlers.handleMinutesEvents();
    emitSpy = jest.spyOn(emitter, 'emit');
  };

  const typeAndBlur = (input: HTMLInputElement, value: string): void => {
    input.value = value;
    input.dispatchEvent(new FocusEvent('blur'));
  };

  const spinState = (input: HTMLInputElement): Record<string, string | null> => ({
    value: input.value,
    now: input.getAttribute('aria-valuenow'),
    text: input.getAttribute('aria-valuetext'),
  });

  const selections = (): unknown[][] =>
    emitSpy.mock.calls.filter(([event]: [string]) => event !== 'animation:clock');

  afterEach(() => {
    handlers.destroy();
    document.body.innerHTML = '';
    jest.restoreAllMocks();
  });

  it('moves a disabled typed hour to the next enabled hour and emits the snapped value', () => {
    setup('12h', { hours: ['3'] }, { hour: '12', minutes: '00' });

    typeAndBlur(hourInput, '3');

    expect(spinState(hourInput)).toEqual({ value: '04', now: '4', text: '04' });
    expect(selections()).toEqual([
      ['select:hour', { hour: '04' }],
      ['update', { hour: '04', minutes: '00', type: 'AM' }],
    ]);
  });

  it('12h: falls back to the lower neighbour when the higher one wraps onto a disabled hour', () => {
    setup('12h', { hours: ['12', '1'] }, { hour: '06', minutes: '00' });

    typeAndBlur(hourInput, '12');

    expect(spinState(hourInput)).toEqual({ value: '11', now: '11', text: '11' });
    expect(selections()).toEqual([
      ['select:hour', { hour: '11' }],
      ['update', { hour: '11', minutes: '00', type: 'AM' }],
    ]);
  });

  it('moves a typed minute out of a disabled interval to the nearest enabled minute', () => {
    setup('24h', { isInterval: true, clockType: '24h', intervals: ['10:00 - 10:30'] }, {
      hour: '10',
      minutes: '45',
    });

    typeAndBlur(minuteInput, '15');

    expect(spinState(minuteInput)).toEqual({ value: '31', now: '31', text: '31' });
    expect(selections()).toEqual([
      ['select:minute', { minutes: '31' }],
      ['update', { hour: '10', minutes: '31', type: undefined }],
    ]);
  });

  it('keeps the clamped value when every hour is disabled', () => {
    const allHours = Array.from({ length: 12 }, (_, index) => String(index + 1));
    setup('12h', { hours: allHours }, { hour: '06', minutes: '00' });

    typeAndBlur(hourInput, '25');

    expect(spinState(hourInput)).toEqual({ value: '12', now: '12', text: '12' });
    expect(selections()).toEqual([
      ['select:hour', { hour: '12' }],
      ['update', { hour: '12', minutes: '00', type: 'AM' }],
    ]);
  });

  it('leaves a readonly field untouched', () => {
    setup('12h', { hours: ['3'] }, { hour: '12', minutes: '00' });
    hourInput.setAttribute('readonly', '');

    typeAndBlur(hourInput, '3');

    expect(spinState(hourInput)).toEqual({ value: '3', now: null, text: null });
    expect(emitSpy).not.toHaveBeenCalled();
  });
});

