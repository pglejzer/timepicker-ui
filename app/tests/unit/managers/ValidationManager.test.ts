import ValidationManager from '../../../src/managers/ValidationManager';
import { CoreState } from '../../../src/timepicker/CoreState';
import { EventEmitter, type TimepickerEventMap } from '../../../src/utils/EventEmitter';
import { DEFAULT_OPTIONS } from '../../../src/utils/options/defaults';
import { TimepickerError } from '../../../src/utils/errors';

describe('ValidationManager', () => {
  let coreState: CoreState;
  let emitter: EventEmitter<TimepickerEventMap>;
  let validationManager: ValidationManager;
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
    validationManager = new ValidationManager(coreState, emitter);
  });

  afterEach(() => {
    validationManager.destroy();
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create instance with CoreState and EventEmitter', () => {
      expect(validationManager).toBeInstanceOf(ValidationManager);
    });
  });

  describe('setErrorHandler', () => {
    it('should return true when input is null', () => {
      jest.spyOn(coreState, 'getInput').mockReturnValue(null);

      expect(validationManager.setErrorHandler()).toBe(true);
    });

    it('should return true for valid time format', () => {
      mockInput.value = '09:30 AM';
      jest.spyOn(coreState, 'getInput').mockReturnValue(mockInput);

      expect(validationManager.setErrorHandler()).toBe(true);
    });

    it('should return false and add error class for invalid format', () => {
      mockInput.value = 'invalid';
      jest.spyOn(coreState, 'getInput').mockReturnValue(mockInput);

      const emitSpy = jest.spyOn(emitter, 'emit');

      const result = validationManager.setErrorHandler();

      expect(result).toBe(false);
      expect(mockInput.classList.contains('tp-ui-invalid-format')).toBe(true);
      expect(emitSpy).toHaveBeenCalledWith(
        'error',
        expect.objectContaining({
          error: expect.any(String),
        }),
      );
    });

    it('should add error message element for invalid format', () => {
      mockInput.value = 'invalid';
      jest.spyOn(coreState, 'getInput').mockReturnValue(mockInput);

      validationManager.setErrorHandler();

      const errorEl = mockInput.nextElementSibling;
      expect(errorEl).not.toBeNull();
      expect(errorEl?.classList.contains('tp-ui-invalid-text')).toBe(true);
    });

    it('should not duplicate error message element', () => {
      mockInput.value = 'invalid';
      jest.spyOn(coreState, 'getInput').mockReturnValue(mockInput);

      validationManager.setErrorHandler();
      validationManager.setErrorHandler();

      const errorElements = mockElement.querySelectorAll('.tp-ui-invalid-text');
      expect(errorElements.length).toBe(1);
    });
  });

  describe('removeErrorHandler', () => {
    it('should do nothing when input is null', () => {
      jest.spyOn(coreState, 'getInput').mockReturnValue(null);

      expect(() => validationManager.removeErrorHandler()).not.toThrow();
    });

    it('should remove error class from input', () => {
      mockInput.classList.add('tp-ui-invalid-format');
      jest.spyOn(coreState, 'getInput').mockReturnValue(mockInput);

      validationManager.removeErrorHandler();

      expect(mockInput.classList.contains('tp-ui-invalid-format')).toBe(false);
    });

    it('should remove error message element', () => {
      const errorEl = document.createElement('div');
      errorEl.classList.add('tp-ui-invalid-text');
      mockInput.after(errorEl);

      jest.spyOn(coreState, 'getInput').mockReturnValue(mockInput);

      validationManager.removeErrorHandler();

      expect(mockInput.nextElementSibling?.classList.contains('tp-ui-invalid-text')).toBeFalsy();
    });
  });

  describe('checkDisabledValuesOnStart', () => {
    it('should do nothing when disabledTime is not set', () => {
      expect(() => validationManager.checkDisabledValuesOnStart()).not.toThrow();
    });

    it('should throw error when interval is used without clockType', () => {
      const optionsWithInterval = {
        ...DEFAULT_OPTIONS,
        clock: {
          ...DEFAULT_OPTIONS.clock,
          type: undefined as unknown as '12h' | '24h',
          disabledTime: {
            interval: '09:00 AM - 05:00 PM',
          },
        },
      };

      const coreWithInterval = new CoreState(mockElement, optionsWithInterval, 'test-interval-id');
      const managerWithInterval = new ValidationManager(coreWithInterval, emitter);

      expect(() => managerWithInterval.checkDisabledValuesOnStart()).toThrow(TimepickerError);

      managerWithInterval.destroy();
    });

    it('should validate disabled hours and minutes', () => {
      const optionsWithDisabled = {
        ...DEFAULT_OPTIONS,
        clock: {
          ...DEFAULT_OPTIONS.clock,
          type: '12h' as const,
          disabledTime: {
            hours: ['01', '02', '03'],
            minutes: ['00', '15', '30', '45'],
          },
        },
      };

      const coreWithDisabled = new CoreState(mockElement, optionsWithDisabled, 'test-disabled-id');
      const managerWithDisabled = new ValidationManager(coreWithDisabled, emitter);

      expect(() => managerWithDisabled.checkDisabledValuesOnStart()).not.toThrow();

      managerWithDisabled.destroy();
    });

    it('should throw error for invalid disabled hours', () => {
      const optionsWithInvalid = {
        ...DEFAULT_OPTIONS,
        clock: {
          ...DEFAULT_OPTIONS.clock,
          type: '12h' as const,
          disabledTime: {
            hours: ['25', '26'],
          },
        },
      };

      const coreWithInvalid = new CoreState(mockElement, optionsWithInvalid, 'test-invalid-id');
      const managerWithInvalid = new ValidationManager(coreWithInvalid, emitter);

      expect(() => managerWithInvalid.checkDisabledValuesOnStart()).toThrow(TimepickerError);

      managerWithInvalid.destroy();
    });
  });

  describe('destroy', () => {
    it('should call removeErrorHandler', () => {
      const removeSpy = jest.spyOn(validationManager, 'removeErrorHandler');

      validationManager.destroy();

      expect(removeSpy).toHaveBeenCalled();
    });
  });
});

