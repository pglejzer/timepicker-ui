import TimepickerUI from '@/timepicker/TimepickerUI';
import { KeyboardHandlers } from '@/managers/events/KeyboardHandlers';
import { CoreState } from '@/timepicker/CoreState';
import { EventEmitter, type TimepickerEventMap } from '@/utils/EventEmitter';
import type { TimepickerOptions } from '@/types/options';
import { mergeOptions } from '@/utils/options/defaults';

type Field = 'hour' | 'minutes';
type Target = 'hour field' | 'dial';
type ClockOptions = NonNullable<TimepickerOptions['clock']>;
type DisabledValue = NonNullable<CoreState['disabledTime']>['value'];
type KeyCase = readonly [from: string, key: string, expected: string];

interface Setup {
  clock: ClockOptions;
  hour: string;
  minutes?: string;
  active?: Field;
  disabled?: DisabledValue;
}

const OWNER_ID = 'kbd-hour-increment';

describe('KeyboardHandlers steps the hour on the incrementHours grid', () => {
  let core: CoreState;
  let emitter: EventEmitter<TimepickerEventMap>;
  let keyboard: KeyboardHandlers;
  let emitSpy: jest.SpyInstance;

  const field = (name: Field): HTMLInputElement =>
    document.querySelector(`.tp-ui-modal .tp-ui-${name}`) as HTMLInputElement;
  const dial = (): HTMLElement => document.querySelector('.tp-ui-modal .tp-ui-clock-face') as HTMLElement;
  const targetOf = (target: Target): HTMLElement => (target === 'dial' ? dial() : field('hour'));

  const press = (target: HTMLElement, key: string): void => {
    target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
  };

  const spinbutton = (name: Field, value: string, active: boolean): string =>
    `<input class="tp-ui-${name}${active ? ' active' : ''}" type="number" role="spinbutton"` +
    ` aria-valuenow="${Number(value)}" aria-valuetext="${value}" value="${value}" />`;

  const setup = ({ clock, hour, minutes = '30', active = 'hour', disabled }: Setup): void => {
    const options = mergeOptions({ clock, ui: { mobile: false } });
    const is12h = options.clock.type === '12h';

    const host = document.createElement('div');
    host.appendChild(document.createElement('input'));
    document.body.appendChild(host);
    document.body.insertAdjacentHTML(
      'beforeend',
      `<div class="tp-ui-modal" data-owner-id="${OWNER_ID}">
        ${spinbutton('hour', hour, active === 'hour')}
        ${spinbutton('minutes', minutes, active === 'minutes')}
        ${is12h ? '<div class="tp-ui-type-mode tp-ui-am active" data-type="AM">AM</div>' : ''}
        <div class="tp-ui-clock-face" role="slider" tabindex="0"></div>
        <div class="timepicker-announcer"></div>
      </div>`,
    );

    core = new CoreState(host, options, OWNER_ID);
    if (disabled) core.setDisabledTime({ value: disabled });

    emitter = new EventEmitter<TimepickerEventMap>();
    keyboard = new KeyboardHandlers(core, emitter);
    keyboard.handleKeyboardInput();
    emitSpy = jest.spyOn(emitter, 'emit');
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    keyboard?.destroy();
    document.body.innerHTML = '';
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  const TARGETS: readonly Target[] = ['hour field', 'dial'];

  const TWELVE_HOUR_STEP_2: readonly KeyCase[] = [
    ['02', 'ArrowUp', '04'],
    ['12', 'ArrowUp', '02'],
    ['02', 'ArrowDown', '12'],
    ['06', 'Home', '02'],
    ['06', 'End', '12'],
    ['03', 'ArrowUp', '04'],
    ['03', 'ArrowDown', '02'],
    ['02', 'PageUp', '08'],
    ['08', 'PageUp', '12'],
    ['12', 'PageDown', '06'],
    ['04', 'PageDown', '02'],
  ];

  const TWENTY_FOUR_HOUR_STEP_2: readonly KeyCase[] = [
    ['22', 'ArrowUp', '00'],
    ['00', 'ArrowDown', '22'],
    ['10', 'Home', '00'],
    ['10', 'End', '22'],
  ];

  const TWENTY_FOUR_HOUR_STEP_3: readonly KeyCase[] = [
    ['21', 'ArrowUp', '00'],
    ['09', 'End', '21'],
  ];

  describe.each(TARGETS)('keys on the %s', (target) => {
    it.each(TWELVE_HOUR_STEP_2)('12h, incrementHours 2: %s %s moves to %s', (from, key, expected) => {
      setup({ clock: { type: '12h', incrementHours: 2 }, hour: from });

      press(targetOf(target), key);

      expect(field('hour').value).toBe(expected);
    });

    it.each(TWENTY_FOUR_HOUR_STEP_2)('24h, incrementHours 2: %s %s moves to %s', (from, key, expected) => {
      setup({ clock: { type: '24h', incrementHours: 2 }, hour: from });

      press(targetOf(target), key);

      expect(field('hour').value).toBe(expected);
    });

    it.each(TWENTY_FOUR_HOUR_STEP_3)('24h, incrementHours 3: %s %s moves to %s', (from, key, expected) => {
      setup({ clock: { type: '24h', incrementHours: 3 }, hour: from });

      press(targetOf(target), key);

      expect(field('hour').value).toBe(expected);
    });

    it('12h, incrementHours 2: steps over a disabled grid hour in both directions', () => {
      setup({ clock: { type: '12h', incrementHours: 2 }, hour: '02', disabled: { hours: ['4'] } });

      press(targetOf(target), 'ArrowUp');
      expect(field('hour').value).toBe('06');

      press(targetOf(target), 'ArrowDown');
      expect(field('hour').value).toBe('02');
    });
  });

  describe('ArrowRight and ArrowLeft on the dial', () => {
    it.each<KeyCase>([
      ['02', 'ArrowRight', '04'],
      ['03', 'ArrowRight', '04'],
      ['12', 'ArrowRight', '02'],
      ['02', 'ArrowLeft', '12'],
      ['03', 'ArrowLeft', '02'],
    ])('12h, incrementHours 2: %s %s moves to %s', (from, key, expected) => {
      setup({ clock: { type: '12h', incrementHours: 2 }, hour: from });

      press(dial(), key);

      expect(field('hour').value).toBe(expected);
    });

    it('24h, incrementHours 3: ArrowRight wraps from 21 to 00', () => {
      setup({ clock: { type: '24h', incrementHours: 3 }, hour: '21' });

      press(dial(), 'ArrowRight');

      expect(field('hour').value).toBe('00');
    });
  });

  describe('events, ARIA and the dial follow the new hour', () => {
    it('emits select:hour then update with the grid hour from the hour field', () => {
      setup({ clock: { type: '12h', incrementHours: 2 }, hour: '12' });

      press(field('hour'), 'ArrowUp');

      expect(emitSpy.mock.calls).toEqual([
        ['select:hour', { hour: '02' }],
        ['update', { hour: '02', minutes: '30', type: 'AM' }],
      ]);
      expect(field('hour').getAttribute('aria-valuenow')).toBe('2');
      expect(field('hour').getAttribute('aria-valuetext')).toBe('02');
    });

    it('emits select:hour with the grid hour from the dial and mirrors it on the dial', () => {
      setup({ clock: { type: '24h', incrementHours: 2 }, hour: '22' });

      press(dial(), 'ArrowRight');

      expect(emitSpy.mock.calls).toEqual([
        ['select:hour', { hour: '00' }],
        ['update', { hour: '00', minutes: '30', type: undefined }],
      ]);
      expect(dial().getAttribute('aria-valuenow')).toBe('0');
      expect(dial().getAttribute('aria-valuetext')).toBe('00');
    });
  });

  describe('minutes ignore incrementHours', () => {
    it.each<[Target | 'minutes field', string]>([
      ['minutes field', 'ArrowUp'],
      ['dial', 'ArrowRight'],
    ])('the %s steps the minute by one with %s', (target, key) => {
      setup({ clock: { type: '24h', incrementHours: 2 }, hour: '10', minutes: '10', active: 'minutes' });

      press(target === 'dial' ? dial() : field('minutes'), key);

      expect(field('minutes').value).toBe('11');
      expect(field('hour').value).toBe('10');
      expect(emitSpy.mock.calls[0]).toEqual(['select:minute', { minutes: '11' }]);
    });
  });
});

describe('an open picker with incrementHours', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.restoreAllMocks();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  it('steps the hour field to the next grid hour, emits select:hour and confirms it to the input', () => {
    const input = document.createElement('input');
    input.value = '22:30';
    document.body.appendChild(input);
    const picker = new TimepickerUI(input, {
      clock: { type: '24h', incrementHours: 2 },
      ui: { animation: false },
    });
    const onSelectHour = jest.fn();
    picker.on('select:hour', onSelectHour);
    picker.create();
    picker.open();
    jest.advanceTimersByTime(1000);

    const hour = document.querySelector('.tp-ui-modal .tp-ui-hour') as HTMLInputElement;
    hour.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }));

    expect(hour.value).toBe('00');
    expect(onSelectHour).toHaveBeenLastCalledWith({ hour: '00' });

    (document.querySelector('.tp-ui-modal .tp-ui-ok-btn') as HTMLElement).click();

    expect(input.value).toBe('00:30');
  });
});
