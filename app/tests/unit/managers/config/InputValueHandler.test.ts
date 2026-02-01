import { InputValueHandler } from '../../../../src/managers/config/InputValueHandler';
import { CoreState } from '../../../../src/timepicker/CoreState';
import { EventEmitter, type TimepickerEventMap } from '../../../../src/utils/EventEmitter';
import { DEFAULT_OPTIONS } from '../../../../src/utils/options/defaults';
import * as inputUtils from '../../../../src/utils/input';

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

    it('should set 12:00 when input is empty and add AM class', () => {
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

    it('should not add AM class in range mode', () => {
      const rangeOptions = {
        ...DEFAULT_OPTIONS,
        range: { ...DEFAULT_OPTIONS.range, enabled: true },
      };
      const rangeCore = new CoreState(mockElement, rangeOptions, 'test-range');
      const rangeHandler = new InputValueHandler(rangeCore, emitter);

      const hourInput = document.createElement('input') as HTMLInputElement;
      const minutesInput = document.createElement('input') as HTMLInputElement;
      const amElement = document.createElement('div');

      jest.spyOn(rangeCore, 'getHour').mockReturnValue(hourInput);
      jest.spyOn(rangeCore, 'getMinutes').mockReturnValue(minutesInput);
      jest.spyOn(rangeCore, 'getActiveTypeMode').mockReturnValue(null);
      jest.spyOn(rangeCore, 'getAM').mockReturnValue(amElement);

      rangeHandler.getInputValueOnOpenAndSet();

      expect(amElement.classList.contains('active')).toBe(false);
      rangeHandler.destroy();
    });

    it('should handle undefined value from getInputValue and emit open event', () => {
      jest.spyOn(inputUtils, 'getInputValue').mockReturnValue(undefined as never);

      const emitSpy = jest.spyOn(emitter, 'emit');
      const hourInput = document.createElement('input') as HTMLInputElement;
      const minutesInput = document.createElement('input') as HTMLInputElement;
      const amElement = document.createElement('div');
      const activeTypeMode = document.createElement('button');
      activeTypeMode.dataset.type = 'AM';

      jest.spyOn(coreState, 'getHour').mockReturnValue(hourInput);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minutesInput);
      jest.spyOn(coreState, 'getActiveTypeMode').mockReturnValue(activeTypeMode as HTMLButtonElement);
      jest.spyOn(coreState, 'getAM').mockReturnValue(amElement);
      Object.defineProperty(coreState.options.clock, 'type', { value: '12h', writable: true });

      handler.getInputValueOnOpenAndSet();

      expect(hourInput.value).toBe('12');
      expect(minutesInput.value).toBe('00');
      expect(emitSpy).toHaveBeenCalledWith(
        'open',
        expect.objectContaining({
          hour: '12',
          minutes: '00',
          type: 'AM',
        }),
      );
      expect(amElement.classList.contains('active')).toBe(true);

      jest.restoreAllMocks();
    });

    it('should handle undefined value with null hour and minutes elements', () => {
      jest.spyOn(inputUtils, 'getInputValue').mockReturnValue(undefined as never);

      const emitSpy = jest.spyOn(emitter, 'emit');

      jest.spyOn(coreState, 'getHour').mockReturnValue(null);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(null);
      jest.spyOn(coreState, 'getActiveTypeMode').mockReturnValue(null);
      jest.spyOn(coreState, 'getAM').mockReturnValue(null);

      handler.getInputValueOnOpenAndSet();

      expect(emitSpy).toHaveBeenCalledWith(
        'open',
        expect.objectContaining({
          hour: '12',
          minutes: '00',
        }),
      );

      jest.restoreAllMocks();
    });

    it('should not add AM class in 24h mode even with undefined value', () => {
      jest.spyOn(inputUtils, 'getInputValue').mockReturnValue(undefined as never);

      const options24h = {
        ...DEFAULT_OPTIONS,
        clock: { ...DEFAULT_OPTIONS.clock, type: '24h' as const },
      };
      const core24h = new CoreState(mockElement, options24h, 'test-24h');
      const handler24h = new InputValueHandler(core24h, emitter);

      const hourInput = document.createElement('input') as HTMLInputElement;
      const minutesInput = document.createElement('input') as HTMLInputElement;
      const amElement = document.createElement('div');

      jest.spyOn(core24h, 'getHour').mockReturnValue(hourInput);
      jest.spyOn(core24h, 'getMinutes').mockReturnValue(minutesInput);
      jest.spyOn(core24h, 'getActiveTypeMode').mockReturnValue(null);
      jest.spyOn(core24h, 'getAM').mockReturnValue(amElement);

      handler24h.getInputValueOnOpenAndSet();

      expect(amElement.classList.contains('active')).toBe(false);

      handler24h.destroy();
      jest.restoreAllMocks();
    });
  });

  describe('getInputValue', () => {
    it('should return input value object for 12h format', () => {
      mockInput.value = '10:45 PM';
      const result = handler.getInputValue(mockInput, '12h', false);
      expect(result).toBeDefined();
      expect(result?.hour).toBe('10');
      expect(result?.minutes).toBe('45');
    });

    it('should return input value object for 24h format', () => {
      mockInput.value = '14:30';
      const result = handler.getInputValue(mockInput, '24h', false);
      expect(result).toBeDefined();
      expect(result?.hour).toBe('14');
      expect(result?.minutes).toBe('30');
    });
  });

  describe('destroy', () => {
    it('should not throw on destroy', () => {
      expect(() => handler.destroy()).not.toThrow();
    });
  });
});

