import { InputValueHandler } from '../../../../src/managers/config/InputValueHandler';
import { CoreState } from '../../../../src/timepicker/CoreState';
import { EventEmitter, type TimepickerEventMap } from '../../../../src/utils/EventEmitter';
import { DEFAULT_OPTIONS, mergeOptions } from '../../../../src/utils/options/defaults';
import { getModalTemplate } from '../../../../src/utils/template';
import type { TimepickerOptions } from '../../../../src/types/options';

type ClockOptions = NonNullable<TimepickerOptions['clock']>;

describe('InputValueHandler', () => {
  let coreState: CoreState;
  let emitter: EventEmitter<TimepickerEventMap>;
  let handler: InputValueHandler;
  let mockElement: HTMLElement;
  let mockInput: HTMLInputElement;

  beforeEach(() => {
    mockElement = document.createElement('div');
    mockInput = document.createElement('input');
    mockInput.type = 'text';
    mockElement.appendChild(mockInput);
    document.body.appendChild(mockElement);

    coreState = new CoreState(mockElement, DEFAULT_OPTIONS, 'test-instance-id');
    emitter = new EventEmitter();
    handler = new InputValueHandler(coreState, emitter);
  });

  afterEach(() => {
    handler.destroy();
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create instance', () => {
      expect(handler).toBeInstanceOf(InputValueHandler);
    });
  });

  describe('preventClockTypeByCurrentTime', () => {
    it('should not throw', () => {
      expect(() => handler.preventClockTypeByCurrentTime()).not.toThrow();
    });
  });

  describe('updateInputValueWithCurrentTimeOnStart', () => {
    it('should not throw', () => {
      expect(() => handler.updateInputValueWithCurrentTimeOnStart()).not.toThrow();
    });
  });

  describe('getInputValueOnOpenAndSet', () => {
    it('should not throw', () => {
      expect(() => handler.getInputValueOnOpenAndSet()).not.toThrow();
    });

    it('should set 12:00 when input is empty', () => {
      mockInput.value = '';
      const hourInput = document.createElement('input') as HTMLInputElement;
      const minutesInput = document.createElement('input') as HTMLInputElement;
      const amElement = document.createElement('div');

      jest.spyOn(coreState, 'getHour').mockReturnValue(hourInput);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minutesInput);
      jest.spyOn(coreState, 'getActiveTypeMode').mockReturnValue(null);
      jest.spyOn(coreState, 'getAM').mockReturnValue(amElement);

      handler.getInputValueOnOpenAndSet();

      expect(hourInput.value).toBe('12');
      expect(minutesInput.value).toBe('00');
    });

    it('should emit open event', () => {
      const emitSpy = jest.spyOn(emitter, 'emit');
      const hourInput = document.createElement('input') as HTMLInputElement;
      const minutesInput = document.createElement('input') as HTMLInputElement;

      jest.spyOn(coreState, 'getHour').mockReturnValue(hourInput);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minutesInput);
      jest.spyOn(coreState, 'getActiveTypeMode').mockReturnValue(null);
      jest.spyOn(coreState, 'getAM').mockReturnValue(null);

      handler.getInputValueOnOpenAndSet();

      expect(emitSpy).toHaveBeenCalledWith('open', expect.any(Object));
    });

    it('should parse existing input value', () => {
      mockInput.value = '10:30 PM';
      const hourInput = document.createElement('input') as HTMLInputElement;
      const minutesInput = document.createElement('input') as HTMLInputElement;
      const modal = document.createElement('div');
      const pmElement = document.createElement('div');
      pmElement.setAttribute('data-type', 'PM');
      modal.appendChild(pmElement);

      jest.spyOn(coreState, 'getHour').mockReturnValue(hourInput);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minutesInput);
      jest.spyOn(coreState, 'getActiveTypeMode').mockReturnValue(null);
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(modal);
      jest.spyOn(coreState, 'getAM').mockReturnValue(null);

      handler.getInputValueOnOpenAndSet();

      expect(hourInput.value).toBe('10');
      expect(minutesInput.value).toBe('30');
    });

    it('should add active class to type mode element', () => {
      mockInput.value = '10:30 PM';
      const hourInput = document.createElement('input') as HTMLInputElement;
      const minutesInput = document.createElement('input') as HTMLInputElement;
      const modal = document.createElement('div');
      const pmElement = document.createElement('div');
      pmElement.setAttribute('data-type', 'PM');
      modal.appendChild(pmElement);

      jest.spyOn(coreState, 'getHour').mockReturnValue(hourInput);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minutesInput);
      jest.spyOn(coreState, 'getActiveTypeMode').mockReturnValue(null);
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(modal);
      jest.spyOn(coreState, 'getAM').mockReturnValue(null);

      handler.getInputValueOnOpenAndSet();

      expect(pmElement.classList.contains('active')).toBe(true);
    });

    it('should still emit the 12:00 open payload when the modal is not rendered', () => {
      const emitSpy = jest.spyOn(emitter, 'emit');

      handler.getInputValueOnOpenAndSet();

      expect(emitSpy).toHaveBeenCalledWith(
        'open',
        expect.objectContaining({
          hour: '12',
          minutes: '00',
          type: undefined,
        }),
      );
    });
  });

  describe('getInputValueOnOpenAndSet() against the rendered modal', () => {
    const mountModal = (core: CoreState): HTMLElement => {
      const container = document.createElement('div');
      container.innerHTML = getModalTemplate(core.options, core.instanceId);
      const modal = container.firstElementChild as HTMLElement;
      document.body.appendChild(modal);
      return modal;
    };

    const getPeriod = (modal: HTMLElement, type: 'AM' | 'PM'): HTMLElement =>
      modal.querySelector(`[data-type='${type}']`) as HTMLElement;

    it('should open an empty 12h input on 12:00 with PM active and emit type PM', () => {
      mockInput.value = '';
      const modal = mountModal(coreState);
      const emitSpy = jest.spyOn(emitter, 'emit');

      handler.getInputValueOnOpenAndSet();

      expect(coreState.getHour()?.value).toBe('12');
      expect(coreState.getMinutes()?.value).toBe('00');
      expect(getPeriod(modal, 'PM').classList.contains('active')).toBe(true);
      expect(getPeriod(modal, 'AM').classList.contains('active')).toBe(false);
      expect(getPeriod(modal, 'PM').getAttribute('aria-pressed')).toBe('true');
      expect(getPeriod(modal, 'AM').getAttribute('aria-pressed')).toBe('false');
      expect(emitSpy).toHaveBeenCalledWith(
        'open',
        expect.objectContaining({ hour: '12', minutes: '00', type: 'PM' }),
      );
    });

    it('should default the period to AM when a 12h input has no AM/PM suffix', () => {
      mockInput.value = '10:55';
      const modal = mountModal(coreState);
      const emitSpy = jest.spyOn(emitter, 'emit');

      handler.getInputValueOnOpenAndSet();

      expect(coreState.getHour()?.value).toBe('10');
      expect(coreState.getMinutes()?.value).toBe('55');
      expect(getPeriod(modal, 'AM').classList.contains('active')).toBe(true);
      expect(getPeriod(modal, 'PM').classList.contains('active')).toBe(false);
      expect(getPeriod(modal, 'AM').getAttribute('aria-pressed')).toBe('true');
      expect(getPeriod(modal, 'PM').getAttribute('aria-pressed')).toBe('false');
      expect(emitSpy).toHaveBeenCalledWith(
        'open',
        expect.objectContaining({ hour: '10', minutes: '55', type: 'AM' }),
      );
    });

    it('should keep PM when a 12h input has an explicit PM suffix', () => {
      mockInput.value = '3:20 PM';
      const modal = mountModal(coreState);
      const emitSpy = jest.spyOn(emitter, 'emit');

      handler.getInputValueOnOpenAndSet();

      expect(coreState.getHour()?.value).toBe('03');
      expect(coreState.getMinutes()?.value).toBe('20');
      expect(getPeriod(modal, 'PM').classList.contains('active')).toBe(true);
      expect(getPeriod(modal, 'AM').classList.contains('active')).toBe(false);
      expect(getPeriod(modal, 'PM').getAttribute('aria-pressed')).toBe('true');
      expect(getPeriod(modal, 'AM').getAttribute('aria-pressed')).toBe('false');
      expect(emitSpy).toHaveBeenCalledWith(
        'open',
        expect.objectContaining({ hour: '03', minutes: '20', type: 'PM' }),
      );
    });

    it('should fill the fields and the period without emitting open when asked not to emit', () => {
      mockInput.value = '3:20 PM';
      const modal = mountModal(coreState);
      const emitSpy = jest.spyOn(emitter, 'emit');

      handler.getInputValueOnOpenAndSet(false);

      expect(coreState.getHour()?.value).toBe('03');
      expect(coreState.getMinutes()?.value).toBe('20');
      expect(getPeriod(modal, 'PM').classList.contains('active')).toBe(true);
      expect(getPeriod(modal, 'PM').getAttribute('aria-pressed')).toBe('true');
      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should compute the open payload degrees from the input value, not from stored degrees', () => {
      mockInput.value = '10:30 PM';
      mountModal(coreState);
      coreState.setDegreesHours(999);
      coreState.setDegreesMinutes(999);
      const emitSpy = jest.spyOn(emitter, 'emit');

      handler.getInputValueOnOpenAndSet();

      expect(emitSpy).toHaveBeenCalledWith(
        'open',
        expect.objectContaining({
          hour: '10',
          minutes: '30',
          type: 'PM',
          degreesHours: 300,
          degreesMinutes: 180,
        }),
      );
    });

    it.each([
      ['an empty input', '', '12', '00'],
      ['a value', '14:30', '14', '30'],
    ])('should not set a period for %s in 24h mode', (_label, value, hour, minutes) => {
      const options24h = {
        ...DEFAULT_OPTIONS,
        clock: { ...DEFAULT_OPTIONS.clock, type: '24h' as const },
      };
      const core24h = new CoreState(mockElement, options24h, 'test-24h-period');
      const handler24h = new InputValueHandler(core24h, emitter);
      mockInput.value = value;
      const modal = mountModal(core24h);
      const emitSpy = jest.spyOn(emitter, 'emit');

      handler24h.getInputValueOnOpenAndSet();

      expect(core24h.getHour()?.value).toBe(hour);
      expect(core24h.getMinutes()?.value).toBe(minutes);
      expect(modal.querySelector('.tp-ui-type-mode.active')).toBeNull();
      expect(emitSpy).toHaveBeenCalledWith(
        'open',
        expect.objectContaining({ hour, minutes, type: undefined }),
      );

      handler24h.destroy();
    });
  });

  describe('syncInputFormat()', () => {
    const syncInput = (
      value: string,
      previousClock: ClockOptions,
      nextOptions: TimepickerOptions,
      element: HTMLElement = mockElement,
    ): void => {
      const core = new CoreState(element, mergeOptions({ clock: previousClock }), 'sync-format-id');
      const previousOptions = core.options;
      core.updateOptions(nextOptions);
      mockInput.value = value;
      new InputValueHandler(core, emitter).syncInputFormat(previousOptions);
    };

    it.each<[string, ClockOptions, ClockOptions, string]>([
      ['03:45 PM', { type: '12h' }, { type: '24h' }, '15:45'],
      ['12:15 AM', { type: '12h' }, { type: '24h' }, '00:15'],
      ['00:15', { type: '24h' }, { type: '12h' }, '12:15 AM'],
      ['14:30:45', { type: '24h', showSeconds: true }, { type: '12h' }, '02:30:45 PM'],
      ['14:30', { type: '24h' }, { showSeconds: true }, '14:30:00'],
      ['02:30:15 PM', { type: '12h', showSeconds: true }, { showSeconds: false }, '02:30 PM'],
      ['03:45 PM', { type: '12h' }, { type: '24h', showSeconds: true }, '15:45:00'],
    ])('should rewrite %p from %o after the clock changes to %o as %p', (value, previous, next, expected) => {
      syncInput(value, previous, { clock: next });

      expect(mockInput.value).toBe(expected);
    });

    it.each<[string, ClockOptions, ClockOptions, string]>([
      ['10:00 - 14:00', { type: '24h' }, { type: '12h' }, '10:00 AM - 02:00 PM'],
      ['02:00 PM - 04:30 PM', { type: '12h' }, { type: '24h' }, '14:00 - 16:30'],
      ['2:00 PM - 4:00 PM', { type: '12h' }, { type: '24h' }, '14:00 - 16:00'],
      ['14:00:30 - 15:00:45', { type: '24h', showSeconds: true }, { showSeconds: false }, '14:00 - 15:00'],
      ['10:00 - 14:00', { type: '24h' }, { showSeconds: true }, '10:00:00 - 14:00:00'],
    ])(
      'should rewrite both times of the range %p from %o after the clock changes to %o as %p',
      (value, previous, next, expected) => {
        syncInput(value, previous, { clock: next });

        expect(mockInput.value).toBe(expected);
      },
    );

    it.each([
      '',
      'abc',
      '99:99',
      '10:00 - --:--',
      '--:-- - --:--',
      '10:00 - abc',
      '10:00 - 14:00 - 16:00',
      '10:00 - ',
    ])('should leave %p untouched when the clock type changes', (value) => {
      syncInput(value, { type: '24h' }, { clock: { type: '12h' } });

      expect(mockInput.value).toBe(value);
    });

    it.each<[string, TimepickerOptions]>([
      ['labels', { labels: { ok: 'X' } }],
      ['the same clock type', { clock: { type: '12h' } }],
      ['the minute increment', { clock: { incrementMinutes: 5 } }],
    ])('should keep the typed text after an update to %s', (_label, nextOptions) => {
      syncInput('3:45 PM', { type: '12h' }, nextOptions);

      expect(mockInput.value).toBe('3:45 PM');
    });

    it.each([
      ['a single time', '03:45 PM', '15:45'],
      ['a range', '02:00 PM - 04:30 PM', '14:00 - 16:30'],
    ])('should rewrite %s without emitting any event', (_label, value, expected) => {
      const emitSpy = jest.spyOn(emitter, 'emit');

      syncInput(value, { type: '12h' }, { clock: { type: '24h' } });

      expect(mockInput.value).toBe(expected);
      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should do nothing when the picker has no input', () => {
      const bare = document.createElement('div');
      document.body.appendChild(bare);

      expect(() => syncInput('03:45 PM', { type: '12h' }, { clock: { type: '24h' } }, bare)).not.toThrow();
      expect(mockInput.value).toBe('03:45 PM');
    });
  });

  describe('destroy', () => {
    it('should not throw on destroy', () => {
      expect(() => handler.destroy()).not.toThrow();
    });
  });
});
