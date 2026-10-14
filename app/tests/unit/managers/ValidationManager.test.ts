import ValidationManager from '../../../src/managers/ValidationManager';
import { CoreState } from '../../../src/timepicker/CoreState';
import { EventEmitter, type TimepickerEventMap } from '../../../src/utils/EventEmitter';
import { DEFAULT_OPTIONS, mergeOptions } from '../../../src/utils/options/defaults';
import { TimepickerError } from '../../../src/utils/errors';
import { TIMINGS } from '../../../src/constants/timings';

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

    it('should set role="alert" on the error element', () => {
      mockInput.value = 'invalid';
      jest.spyOn(coreState, 'getInput').mockReturnValue(mockInput);

      validationManager.setErrorHandler();

      const errorEl = mockInput.nextElementSibling;
      expect(errorEl?.getAttribute('role')).toBe('alert');
    });

    it('should use labels.invalidTimeFormat as the error text', () => {
      mockInput.value = 'invalid';
      jest.spyOn(coreState, 'getInput').mockReturnValue(mockInput);

      validationManager.setErrorHandler();

      const errorEl = mockInput.nextElementSibling;
      expect(errorEl?.textContent).toBe(DEFAULT_OPTIONS.labels.invalidTimeFormat);
    });

    it('should use a custom labels.invalidTimeFormat when provided', () => {
      const customOptions = {
        ...DEFAULT_OPTIONS,
        labels: { ...DEFAULT_OPTIONS.labels, invalidTimeFormat: 'Bad time' },
      };
      const customCore = new CoreState(mockElement, customOptions, 'test-custom-invalid');
      const customManager = new ValidationManager(customCore, emitter);

      mockInput.value = 'invalid';
      jest.spyOn(customCore, 'getInput').mockReturnValue(mockInput);

      customManager.setErrorHandler();

      const errorEl = mockInput.nextElementSibling;
      expect(errorEl?.getAttribute('role')).toBe('alert');
      expect(errorEl?.textContent).toBe('Bad time');

      customManager.destroy();
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

    it.each<[string, (input: HTMLInputElement) => void]>([
      ['a bare valid input', () => {}],
      [
        'a valid input with other classes and a developer aria-describedby',
        (input) => {
          input.className = 'tp-ui-input';
          input.setAttribute('aria-describedby', 'hint');
        },
      ],
    ])('writes nothing to %s', (_, prepare) => {
      mockInput.value = '09:30 AM';
      prepare(mockInput);
      const observer = new MutationObserver(() => {});
      observer.observe(mockInput, { attributes: true, attributeOldValue: true });

      validationManager.removeErrorHandler();

      const records = observer.takeRecords();
      observer.disconnect();
      expect(records).toHaveLength(0);
    });
  });

  describe('linking the error message to the input', () => {
    const errorId = 'tp-ui-invalid-text-test-instance-id';
    const describedBy = (): string | null => mockInput.getAttribute('aria-describedby');

    beforeEach(() => {
      mockInput.value = 'invalid';
    });

    it('gives the error message an id derived from the instance id', () => {
      validationManager.setErrorHandler();

      expect(mockInput.nextElementSibling?.id).toBe(errorId);
    });

    it('marks the input invalid and points aria-describedby at the error message', () => {
      validationManager.setErrorHandler();

      expect(mockInput.getAttribute('aria-invalid')).toBe('true');
      expect(describedBy()?.split(' ')).toContain(errorId);
    });

    it('appends the error id after an existing token and restores that token on removal', () => {
      mockInput.setAttribute('aria-describedby', 'hint');

      validationManager.setErrorHandler();
      expect(describedBy()).toBe(`hint ${errorId}`);

      validationManager.removeErrorHandler();
      expect(describedBy()).toBe('hint');
      expect(mockInput.hasAttribute('aria-invalid')).toBe(false);
    });

    it('keeps a single error id token when the error is set twice', () => {
      mockInput.setAttribute('aria-describedby', 'hint');

      validationManager.setErrorHandler();
      validationManager.setErrorHandler();

      expect(describedBy()).toBe(`hint ${errorId}`);
    });

    it.each<[string, () => void]>([
      ['removeErrorHandler without a prior error', () => validationManager.removeErrorHandler()],
      [
        'setErrorHandler on a valid value',
        () => {
          mockInput.value = '09:30 AM';
          validationManager.setErrorHandler();
        },
      ],
    ])('leaves developer-set aria-invalid and aria-describedby alone on %s', (_, act) => {
      mockInput.setAttribute('aria-invalid', 'true');
      mockInput.setAttribute('aria-describedby', 'hint');

      act();

      expect(mockInput.getAttribute('aria-invalid')).toBe('true');
      expect(describedBy()).toBe('hint');
    });

    it('removes both attributes when the error id was the only token', () => {
      validationManager.setErrorHandler();
      validationManager.removeErrorHandler();

      expect(mockInput.hasAttribute('aria-describedby')).toBe(false);
      expect(mockInput.hasAttribute('aria-invalid')).toBe(false);
    });

    it('adds no aria attributes when range is enabled', () => {
      const rangeCore = new CoreState(mockElement, mergeOptions({ range: { enabled: true } }), 'range-aria');
      const rangeManager = new ValidationManager(rangeCore, emitter);

      expect(rangeManager.setErrorHandler()).toBe(true);
      expect(mockInput.hasAttribute('aria-invalid')).toBe(false);
      expect(mockInput.hasAttribute('aria-describedby')).toBe(false);

      rangeManager.destroy();
    });
  });

  describe('announcing the error inside the dialog', () => {
    const label = DEFAULT_OPTIONS.labels.invalidTimeFormat;
    let wrapper: HTMLElement;
    let announcer: HTMLElement;

    const managerWithModal = (focusTrap: boolean, ownerId: string): ValidationManager => {
      document.body.insertAdjacentHTML(
        'beforeend',
        `<div class="tp-ui-modal" data-owner-id="${ownerId}">
          <div class="tp-ui-wrapper" tabindex="0"></div>
          <div class="timepicker-announcer" role="status"></div>
        </div>`,
      );
      wrapper = document.querySelector(`[data-owner-id="${ownerId}"] .tp-ui-wrapper`) as HTMLElement;
      announcer = document.querySelector(`[data-owner-id="${ownerId}"] .timepicker-announcer`) as HTMLElement;

      const core = new CoreState(mockElement, mergeOptions({ behavior: { focusTrap } }), ownerId);
      return new ValidationManager(core, emitter);
    };

    const focusIntoDialog = (): void => {
      wrapper.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    };

    beforeEach(() => {
      jest.useFakeTimers();
      mockInput.value = 'invalid';
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('announces the label after ANNOUNCE_DELAY when focusTrap is off', () => {
      const manager = managerWithModal(false, 'announce-no-trap');

      manager.setErrorHandler();
      jest.advanceTimersByTime(TIMINGS.ANNOUNCE_DELAY);

      expect(announcer.textContent).toBe(label);
      manager.destroy();
    });

    it('waits for focus to enter the dialog when focusTrap is on', () => {
      const manager = managerWithModal(true, 'announce-trap');

      manager.setErrorHandler();
      jest.advanceTimersByTime(TIMINGS.ANNOUNCE_DELAY * 5);
      expect(announcer.textContent).toBe('');

      focusIntoDialog();
      jest.advanceTimersByTime(TIMINGS.ANNOUNCE_DELAY);

      expect(announcer.textContent).toBe(label);
      manager.destroy();
    });

    it('announces only on the first focusin', () => {
      const manager = managerWithModal(true, 'announce-once');

      manager.setErrorHandler();
      focusIntoDialog();
      jest.advanceTimersByTime(TIMINGS.ANNOUNCE_DELAY);
      announcer.textContent = 'Hour: 10';

      focusIntoDialog();
      jest.advanceTimersByTime(TIMINGS.ANNOUNCE_DELAY);

      expect(announcer.textContent).toBe('Hour: 10');
      manager.destroy();
    });

    it('does not throw without a modal and still marks the input invalid', () => {
      expect(() => validationManager.setErrorHandler()).not.toThrow();
      expect(mockInput.getAttribute('aria-invalid')).toBe('true');
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

    it('should throw error for invalid disabled minutes', () => {
      const optionsWithInvalidMinutes = {
        ...DEFAULT_OPTIONS,
        clock: {
          ...DEFAULT_OPTIONS.clock,
          type: '12h' as const,
          disabledTime: {
            minutes: ['99', '100'],
          },
        },
      };

      const coreWithInvalidMinutes = new CoreState(
        mockElement,
        optionsWithInvalidMinutes,
        'test-invalid-minutes',
      );
      const managerWithInvalidMinutes = new ValidationManager(coreWithInvalidMinutes, emitter);

      expect(() => managerWithInvalidMinutes.checkDisabledValuesOnStart()).toThrow(TimepickerError);

      managerWithInvalidMinutes.destroy();
    });

    it('should validate only hours when minutes not provided', () => {
      const optionsOnlyHours = {
        ...DEFAULT_OPTIONS,
        clock: {
          ...DEFAULT_OPTIONS.clock,
          type: '12h' as const,
          disabledTime: {
            hours: ['01', '02'],
          },
        },
      };

      const coreOnlyHours = new CoreState(mockElement, optionsOnlyHours, 'test-only-hours');
      const managerOnlyHours = new ValidationManager(coreOnlyHours, emitter);

      expect(() => managerOnlyHours.checkDisabledValuesOnStart()).not.toThrow();

      managerOnlyHours.destroy();
    });

    it('should validate only minutes when hours not provided', () => {
      const optionsOnlyMinutes = {
        ...DEFAULT_OPTIONS,
        clock: {
          ...DEFAULT_OPTIONS.clock,
          type: '12h' as const,
          disabledTime: {
            minutes: ['00', '30'],
          },
        },
      };

      const coreOnlyMinutes = new CoreState(mockElement, optionsOnlyMinutes, 'test-only-minutes');
      const managerOnlyMinutes = new ValidationManager(coreOnlyMinutes, emitter);

      expect(() => managerOnlyMinutes.checkDisabledValuesOnStart()).not.toThrow();

      managerOnlyMinutes.destroy();
    });

    it('should handle array of intervals', () => {
      const optionsMultipleIntervals = {
        ...DEFAULT_OPTIONS,
        clock: {
          ...DEFAULT_OPTIONS.clock,
          type: '12h' as const,
          disabledTime: {
            interval: ['09:00 AM - 10:00 AM', '02:00 PM - 03:00 PM'],
          },
        },
      };

      const coreMultipleIntervals = new CoreState(
        mockElement,
        optionsMultipleIntervals,
        'test-multi-intervals',
      );
      const managerMultipleIntervals = new ValidationManager(coreMultipleIntervals, emitter);

      expect(() => managerMultipleIntervals.checkDisabledValuesOnStart()).not.toThrow();

      managerMultipleIntervals.destroy();
    });

    it('should throw error for overlapping intervals', () => {
      const optionsOverlapping = {
        ...DEFAULT_OPTIONS,
        clock: {
          ...DEFAULT_OPTIONS.clock,
          type: '12h' as const,
          disabledTime: {
            interval: ['09:00 AM - 11:00 AM', '10:00 AM - 12:00 PM'],
          },
        },
      };

      const coreOverlapping = new CoreState(mockElement, optionsOverlapping, 'test-overlapping');
      const managerOverlapping = new ValidationManager(coreOverlapping, emitter);

      expect(() => managerOverlapping.checkDisabledValuesOnStart()).toThrow(TimepickerError);

      managerOverlapping.destroy();
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
