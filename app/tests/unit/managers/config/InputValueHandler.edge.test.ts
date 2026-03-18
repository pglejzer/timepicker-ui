import { InputValueHandler } from '../../../../src/managers/config/InputValueHandler';
import { CoreState } from '../../../../src/timepicker/CoreState';
import { EventEmitter, type TimepickerEventMap } from '../../../../src/utils/EventEmitter';
import { DEFAULT_OPTIONS } from '../../../../src/utils/options/defaults';
import * as inputUtils from '../../../../src/utils/input';

describe('InputValueHandler edge cases', () => {
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

    coreState = new CoreState(mockElement, DEFAULT_OPTIONS, 'edge-input-id');
    emitter = new EventEmitter();
    handler = new InputValueHandler(coreState, emitter);
  });

  afterEach(() => {
    handler.destroy();
    document.body.innerHTML = '';
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('getInputValueOnOpenAndSet() with whitespace-only input', () => {
    it('should treat spaces-only input as having a value and parse it', () => {
      mockInput.value = '   ';
      const hourInput = document.createElement('input') as HTMLInputElement;
      const minutesInput = document.createElement('input') as HTMLInputElement;

      jest.spyOn(coreState, 'getHour').mockReturnValue(hourInput);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minutesInput);
      jest.spyOn(coreState, 'getActiveTypeMode').mockReturnValue(null);
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(document.createElement('div'));
      jest.spyOn(coreState, 'getAM').mockReturnValue(null);

      expect(() => handler.getInputValueOnOpenAndSet()).not.toThrow();
    });
  });

  describe('getInputValueOnOpenAndSet() with single-digit input', () => {
    it('should pad single-digit hour to two digits', () => {
      mockInput.value = '3:05 PM';
      const hourInput = document.createElement('input') as HTMLInputElement;
      const minutesInput = document.createElement('input') as HTMLInputElement;
      const modal = document.createElement('div');
      const pmEl = document.createElement('div');
      pmEl.setAttribute('data-type', 'PM');
      modal.appendChild(pmEl);

      jest.spyOn(coreState, 'getHour').mockReturnValue(hourInput);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minutesInput);
      jest.spyOn(coreState, 'getActiveTypeMode').mockReturnValue(null);
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(modal);
      jest.spyOn(coreState, 'getAM').mockReturnValue(null);

      handler.getInputValueOnOpenAndSet();

      expect(hourInput.value).toBe('03');
      expect(minutesInput.value).toBe('05');
    });
  });

  describe('getInputValueOnOpenAndSet() with no input element', () => {
    it('should return early without throwing when input is absent', () => {
      mockElement.innerHTML = '';

      expect(() => handler.getInputValueOnOpenAndSet()).not.toThrow();
    });
  });

  describe('preventClockTypeByCurrentTime() with boolean currentTime', () => {
    it('should not update options when currentTime is false', () => {
      const opts = {
        ...DEFAULT_OPTIONS,
        clock: { ...DEFAULT_OPTIONS.clock, currentTime: false as const },
      };
      const core = new CoreState(mockElement, opts, 'prevent-bool-false');
      const h = new InputValueHandler(core, emitter);
      const spy = jest.spyOn(core, 'updateOptions');

      h.preventClockTypeByCurrentTime();

      expect(spy).not.toHaveBeenCalled();
      h.destroy();
    });
  });

  describe('updateInputValueWithCurrentTimeOnStart() formatting', () => {
    it('should format 12h time with AM/PM suffix', () => {
      const opts = {
        ...DEFAULT_OPTIONS,
        clock: { ...DEFAULT_OPTIONS.clock, currentTime: true },
      };
      const core = new CoreState(mockElement, opts, 'update-input-12h');
      const h = new InputValueHandler(core, emitter);

      jest.spyOn(inputUtils, 'getInputValue').mockReturnValue({
        hour: '09',
        minutes: '30',
        type: 'AM',
      });

      h.updateInputValueWithCurrentTimeOnStart();

      expect(mockInput.value).toBe('09:30 AM');
      h.destroy();
    });

    it('should format 24h time without AM/PM suffix', () => {
      const opts = {
        ...DEFAULT_OPTIONS,
        clock: { ...DEFAULT_OPTIONS.clock, type: '24h' as const, currentTime: true },
      };
      const core = new CoreState(mockElement, opts, 'update-input-24h');
      const h = new InputValueHandler(core, emitter);

      jest.spyOn(inputUtils, 'getInputValue').mockReturnValue({
        hour: '14',
        minutes: '30',
        type: undefined,
      });

      h.updateInputValueWithCurrentTimeOnStart();

      expect(mockInput.value).toBe('14:30');
      h.destroy();
    });
  });

  describe('getInputValueOnOpenAndSet() data-type element mismatch', () => {
    it('should not crash when modal has no matching data-type element', () => {
      mockInput.value = '10:30 PM';
      const hourInput = document.createElement('input') as HTMLInputElement;
      const minutesInput = document.createElement('input') as HTMLInputElement;
      const modal = document.createElement('div');

      jest.spyOn(coreState, 'getHour').mockReturnValue(hourInput);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minutesInput);
      jest.spyOn(coreState, 'getActiveTypeMode').mockReturnValue(null);
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(modal);
      jest.spyOn(coreState, 'getAM').mockReturnValue(null);

      expect(() => handler.getInputValueOnOpenAndSet()).not.toThrow();
      expect(hourInput.value).toBe('10');
      expect(minutesInput.value).toBe('30');
    });
  });

  describe('destroy() idempotency', () => {
    it('should not throw when called multiple times', () => {
      handler.destroy();
      expect(() => handler.destroy()).not.toThrow();
    });
  });
});

