import { KeyboardHandlers } from '../../../../src/managers/events/KeyboardHandlers';
import { InputHandlers } from '../../../../src/managers/events/InputHandlers';
import { TIMINGS } from '../../../../src/constants/timings';
import { CoreState } from '../../../../src/timepicker/CoreState';
import { EventEmitter } from '../../../../src/utils/EventEmitter';
import type { TimepickerEventMap } from '../../../../src/utils/EventEmitter';
import type { TimepickerOptions } from '../../../../src/types/options';
import { mergeOptions } from '../../../../src/utils/options/defaults';

function dispatchKey(el: HTMLElement, key: string): void {
  el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
}

describe('KeyboardHandlers spinbutton navigation', () => {
  let core: CoreState;
  let emitter: EventEmitter<TimepickerEventMap>;
  let handlers: KeyboardHandlers;
  let hourInput: HTMLInputElement;
  let minuteInput: HTMLInputElement;

  const setup = (clockType: '12h' | '24h'): void => {
    const hourMin = clockType === '12h' ? '1' : '0';
    const hourMax = clockType === '12h' ? '12' : '23';

    document.body.innerHTML = `
      <div>
        <input type="number" class="tp-ui-hour" min="${hourMin}" max="${hourMax}" value="${hourMin === '1' ? '06' : '06'}" />
        <input type="number" class="tp-ui-minutes" min="0" max="59" value="30" />
        <div class="tp-ui-am active" data-type="AM">AM</div>
      </div>
    `;

    hourInput = document.querySelector('.tp-ui-hour') as HTMLInputElement;
    minuteInput = document.querySelector('.tp-ui-minutes') as HTMLInputElement;

    const options: TimepickerOptions = { clock: { type: clockType }, ui: { mobile: false } };
    core = new CoreState(hourInput, mergeOptions(options), 'kbd-instance');

    jest.spyOn(core, 'getHour').mockReturnValue(hourInput);
    jest.spyOn(core, 'getMinutes').mockReturnValue(minuteInput);
    jest.spyOn(core, 'getActiveTypeMode').mockReturnValue(document.querySelector('.tp-ui-am'));
    jest.spyOn(core, 'getModalElement').mockReturnValue(null);

    emitter = new EventEmitter<TimepickerEventMap>();
    handlers = new KeyboardHandlers(core, emitter);
    handlers.handleKeyboardInput();
  };

  afterEach(() => {
    handlers.destroy();
    document.body.innerHTML = '';
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  describe('hour input - 12h mode', () => {
    beforeEach(() => setup('12h'));

    it('ArrowUp increments and updates aria-valuenow to the number', () => {
      dispatchKey(hourInput, 'ArrowUp');
      expect(hourInput.value).toBe('07');
      expect(hourInput.getAttribute('aria-valuenow')).toBe('7');
      expect(hourInput.getAttribute('aria-valuetext')).toBe('07');
    });

    it('ArrowDown decrements', () => {
      dispatchKey(hourInput, 'ArrowDown');
      expect(hourInput.value).toBe('05');
    });

    it('ArrowUp wraps from max to min', () => {
      hourInput.value = '12';
      dispatchKey(hourInput, 'ArrowUp');
      expect(hourInput.value).toBe('01');
    });

    it('ArrowDown wraps from min to max', () => {
      hourInput.value = '01';
      dispatchKey(hourInput, 'ArrowDown');
      expect(hourInput.value).toBe('12');
    });

    it('Home jumps to min', () => {
      dispatchKey(hourInput, 'Home');
      expect(hourInput.value).toBe('01');
    });

    it('End jumps to max', () => {
      dispatchKey(hourInput, 'End');
      expect(hourInput.value).toBe('12');
    });

    it('PageUp steps by 3 and clamps at max', () => {
      hourInput.value = '11';
      dispatchKey(hourInput, 'PageUp');
      expect(hourInput.value).toBe('12');
    });

    it('PageDown steps by 3 and clamps at min', () => {
      hourInput.value = '02';
      dispatchKey(hourInput, 'PageDown');
      expect(hourInput.value).toBe('01');
    });

    it('emits select:hour on navigation', () => {
      const spy = jest.fn();
      emitter.on('select:hour', spy);
      dispatchKey(hourInput, 'ArrowUp');
      expect(spy).toHaveBeenCalledWith({ hour: '07' });
    });
  });

  describe('hour input - 24h mode', () => {
    beforeEach(() => setup('24h'));

    it('Home jumps to 00', () => {
      dispatchKey(hourInput, 'Home');
      expect(hourInput.value).toBe('00');
    });

    it('End jumps to 23', () => {
      dispatchKey(hourInput, 'End');
      expect(hourInput.value).toBe('23');
    });

    it('ArrowDown wraps from 0 to 23', () => {
      hourInput.value = '00';
      dispatchKey(hourInput, 'ArrowDown');
      expect(hourInput.value).toBe('23');
    });

    it('PageUp steps by 3 clamped at 23', () => {
      hourInput.value = '22';
      dispatchKey(hourInput, 'PageUp');
      expect(hourInput.value).toBe('23');
    });
  });

  describe('aria-valuetext sync', () => {
    beforeEach(() => setup('12h'));

    it('keeps hour aria-valuetext in sync with the value', () => {
      dispatchKey(hourInput, 'ArrowUp');
      expect(hourInput.getAttribute('aria-valuetext')).toBe('07');
      expect(hourInput.getAttribute('aria-valuetext')).toBe(hourInput.value);

      dispatchKey(hourInput, 'End');
      expect(hourInput.getAttribute('aria-valuetext')).toBe('12');
      expect(hourInput.getAttribute('aria-valuetext')).toBe(hourInput.value);
    });

    it('keeps minute aria-valuetext in sync with the value', () => {
      dispatchKey(minuteInput, 'ArrowDown');
      expect(minuteInput.getAttribute('aria-valuetext')).toBe('29');
      expect(minuteInput.getAttribute('aria-valuetext')).toBe(minuteInput.value);

      dispatchKey(minuteInput, 'Home');
      expect(minuteInput.getAttribute('aria-valuetext')).toBe('00');
      expect(minuteInput.getAttribute('aria-valuetext')).toBe(minuteInput.value);
    });
  });

  describe('custom announce labels', () => {
    let modal: HTMLElement;
    let announcer: HTMLElement;

    const setupWithAnnounce = (announceHour: string, announceMinute: string): void => {
      jest.useFakeTimers();

      document.body.innerHTML = `
        <div>
          <input type="number" class="tp-ui-hour" min="1" max="12" value="06" />
          <input type="number" class="tp-ui-minutes" min="0" max="59" value="30" />
        </div>
      `;

      hourInput = document.querySelector('.tp-ui-hour') as HTMLInputElement;
      minuteInput = document.querySelector('.tp-ui-minutes') as HTMLInputElement;

      modal = document.createElement('div');
      announcer = document.createElement('div');
      announcer.className = 'timepicker-announcer';
      modal.appendChild(announcer);
      document.body.appendChild(modal);

      const options: TimepickerOptions = {
        clock: { type: '12h' },
        labels: { announceHour, announceMinute },
      };
      core = new CoreState(hourInput, mergeOptions(options), 'kbd-announce-instance');

      jest.spyOn(core, 'getHour').mockReturnValue(hourInput);
      jest.spyOn(core, 'getMinutes').mockReturnValue(minuteInput);
      jest.spyOn(core, 'getActiveTypeMode').mockReturnValue(null);
      jest.spyOn(core, 'getModalElement').mockReturnValue(modal as HTMLDivElement);

      emitter = new EventEmitter<TimepickerEventMap>();
      handlers = new KeyboardHandlers(core, emitter);
      handlers.handleKeyboardInput();
    };

    it('announces the hour using the custom announceHour label', () => {
      setupWithAnnounce('Godzina', 'Minuty');

      dispatchKey(hourInput, 'ArrowUp');
      jest.advanceTimersByTime(150);

      expect(announcer.textContent).toBe('Godzina: 07');
    });

    it('announces the minute using the custom announceMinute label', () => {
      setupWithAnnounce('Godzina', 'Minuty');

      dispatchKey(minuteInput, 'ArrowUp');
      jest.advanceTimersByTime(150);

      expect(announcer.textContent).toBe('Minuty: 31');
    });
  });

  describe('minute input', () => {
    beforeEach(() => setup('24h'));

    it('ArrowUp increments and updates aria-valuenow', () => {
      dispatchKey(minuteInput, 'ArrowUp');
      expect(minuteInput.value).toBe('31');
      expect(minuteInput.getAttribute('aria-valuenow')).toBe('31');
    });

    it('Home jumps to 00', () => {
      dispatchKey(minuteInput, 'Home');
      expect(minuteInput.value).toBe('00');
    });

    it('End jumps to 59', () => {
      dispatchKey(minuteInput, 'End');
      expect(minuteInput.value).toBe('59');
    });

    it('PageUp steps by 5 and clamps at 59', () => {
      minuteInput.value = '57';
      dispatchKey(minuteInput, 'PageUp');
      expect(minuteInput.value).toBe('59');
    });

    it('PageDown steps by 5 and clamps at 0', () => {
      minuteInput.value = '03';
      dispatchKey(minuteInput, 'PageDown');
      expect(minuteInput.value).toBe('00');
    });

    it('ArrowDown wraps from 0 to 59', () => {
      minuteInput.value = '00';
      dispatchKey(minuteInput, 'ArrowDown');
      expect(minuteInput.value).toBe('59');
    });

    it('emits select:minute on navigation', () => {
      const spy = jest.fn();
      emitter.on('select:minute', spy);
      dispatchKey(minuteInput, 'PageUp');
      expect(spy).toHaveBeenCalledWith({ minutes: '35' });
    });
  });
});

describe('KeyboardHandlers skips disabled times', () => {
  type DisabledValue = NonNullable<CoreState['disabledTime']>['value'];
  type ClockOptions = NonNullable<TimepickerOptions['clock']>;

  interface Header {
    hour: string;
    minutes: string;
    seconds?: string;
    period?: 'AM' | 'PM';
  }

  let core: CoreState;
  let emitter: EventEmitter<TimepickerEventMap>;
  let handlers: KeyboardHandlers;
  let hourInput: HTMLInputElement;
  let minuteInput: HTMLInputElement;
  let secondInput: HTMLInputElement;
  let emitSpy: jest.SpyInstance;

  const setup = (clock: ClockOptions, disabled: DisabledValue, header: Header): void => {
    const { hour, minutes, seconds = '00', period } = header;

    document.body.innerHTML = `
      <div>
        <input type="number" class="tp-ui-hour" value="${hour}" />
        <input type="number" class="tp-ui-minutes" value="${minutes}" />
        <input type="number" class="tp-ui-seconds" value="${seconds}" />
        <div class="tp-ui-type-mode tp-ui-am" data-type="AM">AM</div>
        <div class="tp-ui-type-mode tp-ui-pm" data-type="PM">PM</div>
      </div>
    `;

    hourInput = document.querySelector('.tp-ui-hour') as HTMLInputElement;
    minuteInput = document.querySelector('.tp-ui-minutes') as HTMLInputElement;
    secondInput = document.querySelector('.tp-ui-seconds') as HTMLInputElement;
    const activePeriod = period
      ? (document.querySelector(`[data-type="${period}"]`) as HTMLButtonElement)
      : null;

    core = new CoreState(hourInput, mergeOptions({ clock, ui: { mobile: false } }), 'kbd-disabled-instance');
    core.setDisabledTime({ value: disabled });

    jest.spyOn(core, 'getHour').mockReturnValue(hourInput);
    jest.spyOn(core, 'getMinutes').mockReturnValue(minuteInput);
    jest.spyOn(core, 'getSeconds').mockReturnValue(clock.showSeconds ? secondInput : null);
    jest.spyOn(core, 'getActiveTypeMode').mockReturnValue(activePeriod);
    jest.spyOn(core, 'getModalElement').mockReturnValue(null);

    emitter = new EventEmitter<TimepickerEventMap>();
    handlers = new KeyboardHandlers(core, emitter);
    handlers.handleKeyboardInput();
    emitSpy = jest.spyOn(emitter, 'emit');
  };

  const interval = (intervals: string[], clockType: '12h' | '24h' = '24h'): DisabledValue => ({
    isInterval: true,
    clockType,
    intervals,
  });

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

  describe('listed hours', () => {
    it('ArrowUp steps over a disabled hour and ArrowDown steps back over it', () => {
      setup({ type: '12h' }, { hours: ['3'] }, { hour: '02', minutes: '30', period: 'AM' });

      dispatchKey(hourInput, 'ArrowUp');

      expect(spinState(hourInput)).toEqual({ value: '04', now: '4', text: '04' });
      expect(selections()).toEqual([
        ['select:hour', { hour: '04' }],
        ['update', { hour: '04', minutes: '30', type: 'AM' }],
      ]);

      emitSpy.mockClear();
      dispatchKey(hourInput, 'ArrowDown');

      expect(spinState(hourInput)).toEqual({ value: '02', now: '2', text: '02' });
      expect(selections()).toEqual([
        ['select:hour', { hour: '02' }],
        ['update', { hour: '02', minutes: '30', type: 'AM' }],
      ]);
    });

    it('Home skips a disabled first hour', () => {
      setup({ type: '12h' }, { hours: ['1'] }, { hour: '06', minutes: '30', period: 'AM' });

      dispatchKey(hourInput, 'Home');

      expect(spinState(hourInput)).toEqual({ value: '02', now: '2', text: '02' });
      expect(selections()).toEqual([
        ['select:hour', { hour: '02' }],
        ['update', { hour: '02', minutes: '30', type: 'AM' }],
      ]);
    });

    it('ArrowUp from the last hour wraps past a disabled first hour', () => {
      setup({ type: '12h' }, { hours: ['1'] }, { hour: '12', minutes: '30', period: 'AM' });

      dispatchKey(hourInput, 'ArrowUp');

      expect(spinState(hourInput)).toEqual({ value: '02', now: '2', text: '02' });
      expect(selections()).toEqual([
        ['select:hour', { hour: '02' }],
        ['update', { hour: '02', minutes: '30', type: 'AM' }],
      ]);
    });

    it('End skips a disabled last hour', () => {
      setup({ type: '12h' }, { hours: ['12'] }, { hour: '06', minutes: '30', period: 'AM' });

      dispatchKey(hourInput, 'End');

      expect(spinState(hourInput)).toEqual({ value: '11', now: '11', text: '11' });
      expect(selections()).toEqual([
        ['select:hour', { hour: '11' }],
        ['update', { hour: '11', minutes: '30', type: 'AM' }],
      ]);
    });

    it('PageUp from the last enabled hour stays put and emits nothing', () => {
      setup({ type: '12h' }, { hours: ['12'] }, { hour: '11', minutes: '30', period: 'AM' });

      dispatchKey(hourInput, 'PageUp');

      expect(spinState(hourInput)).toEqual({ value: '11', now: null, text: null });
      expect(emitSpy).not.toHaveBeenCalled();
    });

    it.each(['ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'])(
      '%s changes nothing and emits nothing when every hour is disabled',
      (key) => {
        const allHours = Array.from({ length: 24 }, (_, hour) => String(hour));
        setup({ type: '24h' }, { hours: allHours }, { hour: '06', minutes: '30' });

        dispatchKey(hourInput, key);

        expect(spinState(hourInput)).toEqual({ value: '06', now: null, text: null });
        expect(emitSpy).not.toHaveBeenCalled();
      },
    );
  });

  describe('disabled intervals', () => {
    it('ArrowUp steps over the disabled minutes of the current hour', () => {
      setup({ type: '24h' }, interval(['10:00 - 10:30']), { hour: '10', minutes: '29' });

      dispatchKey(minuteInput, 'ArrowUp');

      expect(spinState(minuteInput)).toEqual({ value: '31', now: '31', text: '31' });
      expect(selections()).toEqual([
        ['select:minute', { minutes: '31' }],
        ['update', { hour: '10', minutes: '31', type: undefined }],
      ]);
    });

    it('ArrowDown wraps to the end of the hour when the block reaches minute 00', () => {
      setup({ type: '24h' }, interval(['10:00 - 10:30']), { hour: '10', minutes: '31' });

      dispatchKey(minuteInput, 'ArrowDown');

      expect(spinState(minuteInput)).toEqual({ value: '59', now: '59', text: '59' });
      expect(selections()).toEqual([
        ['select:minute', { minutes: '59' }],
        ['update', { hour: '10', minutes: '59', type: undefined }],
      ]);
    });

    it('ArrowDown steps below a disabled block to the nearest enabled minute', () => {
      setup({ type: '24h' }, interval(['10:10 - 10:30']), { hour: '10', minutes: '31' });

      dispatchKey(minuteInput, 'ArrowDown');

      expect(spinState(minuteInput)).toEqual({ value: '09', now: '9', text: '09' });
      expect(selections()).toEqual([
        ['select:minute', { minutes: '09' }],
        ['update', { hour: '10', minutes: '09', type: undefined }],
      ]);
    });

    it('steps over disabled minutes on the incrementMinutes grid', () => {
      setup({ type: '24h', incrementMinutes: 5 }, interval(['10:05 - 10:10']), {
        hour: '10',
        minutes: '00',
      });

      dispatchKey(minuteInput, 'ArrowUp');

      expect(spinState(minuteInput)).toEqual({ value: '15', now: '15', text: '15' });
      expect(selections()).toEqual([
        ['select:minute', { minutes: '15' }],
        ['update', { hour: '10', minutes: '15', type: undefined }],
      ]);
    });

    it.each([
      ['PM', '11'],
      ['AM', '10'],
    ] as const)('12h: with %s active, ArrowUp from 09 lands on %s', (period, expected) => {
      setup({ type: '12h' }, interval(['10:00 PM - 10:59 PM'], '12h'), {
        hour: '09',
        minutes: '30',
        period,
      });

      dispatchKey(hourInput, 'ArrowUp');

      expect(spinState(hourInput)).toEqual({ value: expected, now: expected, text: expected });
      expect(selections()).toEqual([
        ['select:hour', { hour: expected }],
        ['update', { hour: expected, minutes: '30', type: period }],
      ]);
    });
  });

  describe('with showSeconds', () => {
    const clock: ClockOptions = { type: '24h', showSeconds: true };

    it('ArrowUp on seconds steps over a disabled run of seconds', () => {
      setup(clock, interval(['10:30:15 - 10:30:45']), { hour: '10', minutes: '30', seconds: '14' });

      dispatchKey(secondInput, 'ArrowUp');

      expect(spinState(secondInput)).toEqual({ value: '46', now: '46', text: '46' });
      expect(selections()).toEqual([
        ['select:second', { seconds: '46' }],
        ['update', { hour: '10', minutes: '30', seconds: '46', type: undefined }],
      ]);
    });

    it('keeps a minute reachable while only some of its seconds are disabled', () => {
      setup(clock, interval(['10:30:15 - 10:30:45']), { hour: '10', minutes: '29', seconds: '14' });

      dispatchKey(minuteInput, 'ArrowUp');

      expect(spinState(minuteInput)).toEqual({ value: '30', now: '30', text: '30' });
      expect(selections()).toEqual([
        ['select:minute', { minutes: '30' }],
        ['update', { hour: '10', minutes: '30', seconds: '14', type: undefined }],
      ]);
    });

    it('skips a minute whose every second is disabled', () => {
      setup(clock, interval(['10:30 - 10:30']), { hour: '10', minutes: '29', seconds: '14' });

      dispatchKey(minuteInput, 'ArrowUp');

      expect(spinState(minuteInput)).toEqual({ value: '31', now: '31', text: '31' });
      expect(selections()).toEqual([
        ['select:minute', { minutes: '31' }],
        ['update', { hour: '10', minutes: '31', seconds: '14', type: undefined }],
      ]);
    });
  });
});

describe('KeyboardHandlers clock dial', () => {
  type Field = 'hour' | 'minutes' | 'seconds';
  type DisabledValue = NonNullable<CoreState['disabledTime']>['value'];
  type ClockOptions = NonNullable<TimepickerOptions['clock']>;

  interface DialSetup {
    clock?: ClockOptions;
    hour?: string;
    minutes?: string;
    seconds?: string;
    active?: Field | null;
    disabled?: DisabledValue;
    withDial?: boolean;
  }

  const OWNER_ID = 'kbd-dial-instance';

  let core: CoreState;
  let emitter: EventEmitter<TimepickerEventMap>;
  let keyboard: KeyboardHandlers;
  let inputs: InputHandlers;
  let emitSpy: jest.SpyInstance;

  const field = (name: Field): HTMLInputElement =>
    document.querySelector(`.tp-ui-${name}`) as HTMLInputElement;
  const dial = (): HTMLElement => document.querySelector('.tp-ui-clock-face') as HTMLElement;
  const announcer = (): HTMLElement => document.querySelector('.timepicker-announcer') as HTMLElement;
  const activeFields = (): string[] =>
    [...document.querySelectorAll<HTMLInputElement>('input.active')].map((input) => input.classList[0]);
  const dialState = (): Record<string, string | null> => ({
    label: dial().getAttribute('aria-label'),
    min: dial().getAttribute('aria-valuemin'),
    max: dial().getAttribute('aria-valuemax'),
    now: dial().getAttribute('aria-valuenow'),
    text: dial().getAttribute('aria-valuetext'),
  });
  const emitted = (prefix = ''): unknown[][] =>
    emitSpy.mock.calls.filter(([event]: [string]) => event.startsWith(prefix));

  const press = (target: HTMLElement, key: string): KeyboardEvent => {
    const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
    target.dispatchEvent(event);
    return event;
  };

  const spinbutton = (
    name: Field,
    label: string,
    [min, max]: [number, number],
    value: string,
    active: boolean,
  ): string =>
    `<input class="tp-ui-${name}${active ? ' active' : ''}" type="number" role="spinbutton" aria-label="${label}"` +
    ` aria-valuemin="${min}" aria-valuemax="${max}" aria-valuenow="${Number(value)}" aria-valuetext="${value}"` +
    ` value="${value}" />`;

  const setup = ({
    clock = { type: '12h' },
    hour = '06',
    minutes = '30',
    seconds = '15',
    active = 'hour',
    disabled,
    withDial = true,
  }: DialSetup = {}): void => {
    const options = mergeOptions({ clock, ui: { mobile: false } });
    const { hourLabel, minuteLabel, second: secondLabel } = options.labels;
    const is12h = options.clock.type === '12h';

    const host = document.createElement('div');
    host.appendChild(document.createElement('input'));
    document.body.appendChild(host);
    document.body.insertAdjacentHTML(
      'beforeend',
      `<div class="tp-ui-modal" data-owner-id="${OWNER_ID}">
        ${spinbutton('hour', hourLabel ?? '', is12h ? [1, 12] : [0, 23], hour, active === 'hour')}
        ${spinbutton('minutes', minuteLabel ?? '', [0, 59], minutes, active === 'minutes')}
        ${options.clock.showSeconds ? spinbutton('seconds', secondLabel ?? '', [0, 59], seconds, active === 'seconds') : ''}
        ${is12h ? '<div class="tp-ui-type-mode tp-ui-am active" data-type="AM">AM</div>' : ''}
        ${withDial ? '<div class="tp-ui-clock-face" role="slider" tabindex="0"></div>' : ''}
        <div class="timepicker-announcer"></div>
      </div>`,
    );

    core = new CoreState(host, options, OWNER_ID);
    if (disabled) core.setDisabledTime({ value: disabled });

    emitter = new EventEmitter<TimepickerEventMap>();
    inputs = new InputHandlers(core, emitter);
    inputs.handleHourEvents();
    inputs.handleMinutesEvents();
    inputs.handleSecondsEvents();
    keyboard = new KeyboardHandlers(core, emitter);
    keyboard.handleKeyboardInput();
    emitSpy = jest.spyOn(emitter, 'emit');
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    keyboard?.destroy();
    inputs?.destroy();
    document.body.innerHTML = '';
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  describe('name and value', () => {
    it('mirrors the active hour field as soon as the keys are bound', () => {
      setup();

      expect(dialState()).toEqual({ label: 'Hour', min: '1', max: '12', now: '6', text: '06' });
    });

    it('mirrors the minutes field when minutes is the active field', () => {
      setup({ active: 'minutes' });

      expect(dialState()).toEqual({ label: 'Minute', min: '0', max: '59', now: '30', text: '30' });
    });

    it('follows every step it makes', () => {
      setup({ clock: { type: '24h' }, hour: '22' });

      press(dial(), 'ArrowRight');
      expect(dialState()).toEqual({ label: 'Hour', min: '0', max: '23', now: '23', text: '23' });

      press(dial(), 'ArrowRight');
      expect(dialState()).toEqual({ label: 'Hour', min: '0', max: '23', now: '0', text: '00' });
    });
  });

  describe('keys on the dial step the active field', () => {
    it.each([
      ['ArrowUp', '07'],
      ['ArrowRight', '07'],
      ['ArrowDown', '05'],
      ['ArrowLeft', '05'],
      ['PageUp', '09'],
      ['PageDown', '03'],
      ['Home', '01'],
      ['End', '12'],
    ])('12h hour 06: %s moves to %s and prevents the default action', (key, expected) => {
      setup();

      const event = press(dial(), key);

      expect(field('hour').value).toBe(expected);
      expect(event.defaultPrevented).toBe(true);
      expect(field('minutes').value).toBe('30');
    });

    it.each([
      ['ArrowUp', '31'],
      ['ArrowRight', '31'],
      ['ArrowDown', '29'],
      ['ArrowLeft', '29'],
      ['PageUp', '35'],
      ['PageDown', '25'],
      ['Home', '00'],
      ['End', '59'],
    ])('minutes 30: %s moves to %s and leaves the hour alone', (key, expected) => {
      setup({ active: 'minutes' });

      const event = press(dial(), key);

      expect(field('minutes').value).toBe(expected);
      expect(event.defaultPrevented).toBe(true);
      expect(field('hour').value).toBe('06');
    });

    it.each([
      ['ArrowRight', '35'],
      ['ArrowLeft', '25'],
      ['PageUp', '55'],
      ['PageDown', '05'],
      ['End', '55'],
    ])('minutes 30 with incrementMinutes 5: %s moves to %s', (key, expected) => {
      setup({ clock: { type: '24h', incrementMinutes: 5 }, active: 'minutes' });

      press(dial(), key);

      expect(field('minutes').value).toBe(expected);
    });

    it.each([
      ['ArrowRight', '16'],
      ['ArrowLeft', '14'],
      ['PageUp', '20'],
      ['PageDown', '10'],
      ['End', '59'],
    ])('seconds 15: %s moves to %s', (key, expected) => {
      setup({ clock: { type: '24h', showSeconds: true }, active: 'seconds' });

      press(dial(), key);

      expect(field('seconds').value).toBe(expected);
      expect(field('minutes').value).toBe('30');
    });

    it.each<[string, string, string, DialSetup, Field]>([
      ['12h hour 12', 'ArrowRight', '01', { hour: '12' }, 'hour'],
      ['12h hour 01', 'ArrowLeft', '12', { hour: '01' }, 'hour'],
      ['24h hour 23', 'ArrowRight', '00', { clock: { type: '24h' }, hour: '23' }, 'hour'],
      ['24h hour 00', 'ArrowLeft', '23', { clock: { type: '24h' }, hour: '00' }, 'hour'],
      ['minutes 59', 'ArrowRight', '00', { minutes: '59', active: 'minutes' }, 'minutes'],
      ['minutes 00', 'ArrowLeft', '59', { minutes: '00', active: 'minutes' }, 'minutes'],
    ])('%s: %s wraps around to %s', (_label, key, expected, options, name) => {
      setup(options);

      press(dial(), key);

      expect(field(name).value).toBe(expected);
    });

    it('steps the hour when no field is active and makes the hour active', () => {
      setup({ active: null });

      press(dial(), 'ArrowUp');

      expect(field('hour').value).toBe('07');
      expect(activeFields()).toEqual(['tp-ui-hour']);
    });

    it('skips a disabled hour in both directions', () => {
      setup({ hour: '02', disabled: { hours: ['3'] } });

      press(dial(), 'ArrowRight');
      expect(field('hour').value).toBe('04');

      press(dial(), 'ArrowLeft');
      expect(field('hour').value).toBe('02');
    });

    it('skips disabled minutes of the current hour', () => {
      setup({
        clock: { type: '24h' },
        hour: '10',
        minutes: '29',
        active: 'minutes',
        disabled: { isInterval: true, clockType: '24h', intervals: ['10:00 - 10:30'] },
      });

      press(dial(), 'ArrowRight');

      expect(field('minutes').value).toBe('31');
    });

    it.each(['Tab', 'a', '1'])('leaves %p alone: not prevented, nothing stepped or emitted', (key) => {
      setup();

      const event = press(dial(), key);

      expect(event.defaultPrevented).toBe(false);
      expect(field('hour').value).toBe('06');
      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('events and announcements', () => {
    it('emits select:hour then update for a dial step', () => {
      setup();

      press(dial(), 'ArrowRight');

      expect(emitSpy.mock.calls).toEqual([
        ['select:hour', { hour: '07' }],
        ['update', { hour: '07', minutes: '30', type: 'AM' }],
      ]);
    });

    it('emits select:minute then update for a field step', () => {
      setup({ active: 'minutes' });

      press(field('minutes'), 'ArrowUp');

      expect(emitSpy.mock.calls).toEqual([
        ['select:minute', { minutes: '31' }],
        ['update', { hour: '06', minutes: '31', type: 'AM' }],
      ]);
    });

    it('never emits animation:clock from a dial step or a field step', () => {
      setup();

      press(dial(), 'ArrowRight');
      press(dial(), 'End');
      press(field('hour'), 'ArrowDown');
      press(field('minutes'), 'ArrowUp');

      expect(emitted('animation')).toEqual([]);
    });

    it('does not announce a dial step', () => {
      setup();
      announcer().textContent = 'previous';

      press(dial(), 'ArrowUp');
      jest.advanceTimersByTime(TIMINGS.ANNOUNCE_DELAY);

      expect(field('hour').value).toBe('07');
      expect(announcer().textContent).toBe('previous');
    });

    it('announces a field step', () => {
      setup();

      press(field('hour'), 'ArrowUp');
      jest.advanceTimersByTime(TIMINGS.ANNOUNCE_DELAY);

      expect(announcer().textContent).toBe('Hour: 07');
    });
  });

  describe('a step on a field that is not active', () => {
    it('moves the active class to that field, emits one select and the dial follows it', () => {
      setup();

      press(field('minutes'), 'ArrowUp');

      expect(activeFields()).toEqual(['tp-ui-minutes']);
      expect(emitted('select:')).toEqual([['select:minute', { minutes: '31' }]]);
      expect(dialState()).toEqual({ label: 'Minute', min: '0', max: '59', now: '31', text: '31' });
    });

    it('keeps the active field and emits nothing when no step is possible', () => {
      setup({ hour: '11', active: 'minutes', disabled: { hours: ['12'] } });

      press(field('hour'), 'PageUp');

      expect(field('hour').value).toBe('11');
      expect(activeFields()).toEqual(['tp-ui-minutes']);
      expect(emitSpy).not.toHaveBeenCalled();
      expect(dialState().label).toBe('Minute');
    });
  });

  describe('Enter and Space on the dial switch to the next face', () => {
    it.each(['Enter', ' '])('%p goes from hour to minutes, announces it and keeps focus on the dial', (key) => {
      setup();
      dial().focus();
      const openMinutes = jest.spyOn(field('minutes'), 'click');

      const event = press(dial(), key);

      expect(event.defaultPrevented).toBe(true);
      expect(openMinutes).toHaveBeenCalledTimes(1);
      expect(activeFields()).toEqual(['tp-ui-minutes']);
      expect(dialState()).toEqual({ label: 'Minute', min: '0', max: '59', now: '30', text: '30' });
      expect(document.activeElement).toBe(dial());

      jest.advanceTimersByTime(TIMINGS.ANNOUNCE_DELAY);
      expect(announcer().textContent).toBe('Minutes: 30');
    });

    it('goes from minutes to seconds with showSeconds', () => {
      setup({ clock: { type: '24h', showSeconds: true }, active: 'minutes' });
      dial().focus();

      press(dial(), 'Enter');

      expect(activeFields()).toEqual(['tp-ui-seconds']);
      expect(dialState().label).toBe('Second');
      expect(document.activeElement).toBe(dial());
      jest.advanceTimersByTime(TIMINGS.ANNOUNCE_DELAY);
      expect(announcer().textContent).toBe('Second: 15');
    });

    it.each<[Field, string, DialSetup]>([
      ['hour', 'autoSwitchToMinutes is false', { clock: { type: '12h', autoSwitchToMinutes: false } }],
      ['minutes', 'there is no seconds field', { active: 'minutes' }],
      [
        'minutes',
        'autoSwitchToSeconds is false',
        { clock: { type: '24h', showSeconds: true, autoSwitchToSeconds: false }, active: 'minutes' },
      ],
      ['seconds', 'it is the last face', { clock: { type: '24h', showSeconds: true }, active: 'seconds' }],
    ])('stays on the %s face when %s', (stays, _reason, options) => {
      setup(options);
      announcer().textContent = 'previous';

      const event = press(dial(), 'Enter');
      jest.advanceTimersByTime(TIMINGS.ANNOUNCE_DELAY);

      expect(event.defaultPrevented).toBe(true);
      expect(activeFields()).toEqual([`tp-ui-${stays}`]);
      expect(emitSpy).not.toHaveBeenCalled();
      expect(announcer().textContent).toBe('previous');
    });
  });

  describe('binding', () => {
    it('steps once per key after the keys are bound again on reopen', () => {
      setup();

      for (let reopen = 0; reopen < 3; reopen++) {
        keyboard.detach();
        keyboard.handleKeyboardInput();
      }
      press(dial(), 'ArrowRight');
      press(field('hour'), 'ArrowUp');

      expect(field('hour').value).toBe('08');
      expect(emitted('select:')).toEqual([
        ['select:hour', { hour: '07' }],
        ['select:hour', { hour: '08' }],
      ]);
    });

    it('stops reacting to dial keys after detach', () => {
      setup();

      keyboard.detach();
      const event = press(dial(), 'ArrowRight');

      expect(event.defaultPrevented).toBe(false);
      expect(field('hour').value).toBe('06');
      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('binds the field keys without throwing when there is no dial', () => {
      expect(() => setup({ withDial: false })).not.toThrow();

      press(field('hour'), 'ArrowUp');

      expect(field('hour').value).toBe('07');
    });
  });
});
