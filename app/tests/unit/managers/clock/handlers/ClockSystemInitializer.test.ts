import { ClockSystemInitializer } from '../../../../../src/managers/clock/handlers/ClockSystemInitializer';
import { CoreState } from '../../../../../src/timepicker/CoreState';
import { EventEmitter, type TimepickerEventMap } from '../../../../../src/utils/EventEmitter';
import { DEFAULT_OPTIONS } from '../../../../../src/utils/options/defaults';

describe('ClockSystemInitializer', () => {
  let coreState: CoreState;
  let emitter: EventEmitter<TimepickerEventMap>;
  let initializer: ClockSystemInitializer;
  let mockElement: HTMLElement;

  beforeEach(() => {
    mockElement = document.createElement('div');
    mockElement.innerHTML = '<input type="text" />';
    document.body.appendChild(mockElement);

    coreState = new CoreState(mockElement, DEFAULT_OPTIONS, 'test-id');
    emitter = new EventEmitter<TimepickerEventMap>();
    initializer = new ClockSystemInitializer(coreState, emitter);
  });

  afterEach(() => {
    initializer.destroy();
    document.body.innerHTML = '';
    jest.restoreAllMocks();
  });

  describe('getClockSystem', () => {
    it('should return null before initialization', () => {
      expect(initializer.getClockSystem()).toBeNull();
    });
  });

  describe('initialize', () => {
    it('should not throw when clockFace is null', () => {
      jest.spyOn(coreState, 'getClockFace').mockReturnValue(null);

      expect(() => initializer.initialize()).not.toThrow();
      expect(initializer.getClockSystem()).toBeNull();
    });

    it('should not throw when clockHand is null', () => {
      jest.spyOn(coreState, 'getClockFace').mockReturnValue(document.createElement('div'));
      jest.spyOn(coreState, 'getClockHand').mockReturnValue(null);

      expect(() => initializer.initialize()).not.toThrow();
      expect(initializer.getClockSystem()).toBeNull();
    });

    it('should not throw when circle is null', () => {
      jest.spyOn(coreState, 'getClockFace').mockReturnValue(document.createElement('div'));
      jest.spyOn(coreState, 'getClockHand').mockReturnValue(document.createElement('div'));
      jest.spyOn(coreState, 'getCircle').mockReturnValue(null);

      expect(() => initializer.initialize()).not.toThrow();
      expect(initializer.getClockSystem()).toBeNull();
    });

    it('should not throw when tipsWrapper is null', () => {
      jest.spyOn(coreState, 'getClockFace').mockReturnValue(document.createElement('div'));
      jest.spyOn(coreState, 'getClockHand').mockReturnValue(document.createElement('div'));
      jest.spyOn(coreState, 'getCircle').mockReturnValue(document.createElement('div'));
      jest.spyOn(coreState, 'getTipsWrapper').mockReturnValue(null);

      expect(() => initializer.initialize()).not.toThrow();
      expect(initializer.getClockSystem()).toBeNull();
    });
  });

  describe('convertDisabledTime', () => {
    it('should return null when disabledTime is not set', () => {
      expect(initializer.convertDisabledTime()).toBeNull();
    });

    it('should convert disabledTime with hours and minutes', () => {
      coreState.setDisabledTime({
        value: {
          hours: ['01', '02'],
          minutes: ['30'],
        },
      });

      const result = initializer.convertDisabledTime();

      expect(result).toEqual({
        hours: ['01', '02'],
        minutes: ['30'],
        isInterval: undefined,
        intervals: undefined,
        clockType: undefined,
      });
    });

    it('should convert disabledTime with intervals array', () => {
      coreState.setDisabledTime({
        value: {
          intervals: ['09:00-12:00', '14:00-17:00'],
          isInterval: true,
        },
      });

      const result = initializer.convertDisabledTime();

      expect(result).toEqual({
        hours: undefined,
        minutes: undefined,
        isInterval: true,
        intervals: ['09:00-12:00', '14:00-17:00'],
        clockType: undefined,
      });
    });

    it('should convert disabledTime with single interval string', () => {
      coreState.setDisabledTime({
        value: {
          intervals: '09:00-12:00' as unknown as string[],
          isInterval: true,
        },
      });

      const result = initializer.convertDisabledTime();

      expect(result?.intervals).toEqual(['09:00-12:00']);
    });

    it('should include clockType when provided', () => {
      coreState.setDisabledTime({
        value: {
          hours: ['13'],
          clockType: '24h',
        },
      });

      const result = initializer.convertDisabledTime();

      expect(result?.clockType).toBe('24h');
    });
  });

  describe('getAmPmValue', () => {
    it('should return empty string for 24h clock type', () => {
      const options24h = {
        ...DEFAULT_OPTIONS,
        clock: { ...DEFAULT_OPTIONS.clock, type: '24h' as const },
      };
      const core24h = new CoreState(mockElement, options24h, 'test-24h');
      const init24h = new ClockSystemInitializer(core24h, emitter);

      expect(init24h.getAmPmValue()).toBe('');
      init24h.destroy();
    });

    it('should return AM when activeTypeMode text is AM', () => {
      const mockActiveMode = document.createElement('button');
      mockActiveMode.textContent = 'AM';
      jest.spyOn(coreState, 'getActiveTypeMode').mockReturnValue(mockActiveMode);

      const newInit = new ClockSystemInitializer(coreState, emitter);
      expect(newInit.getAmPmValue()).toBe('AM');
      newInit.destroy();
    });

    it('should return PM when activeTypeMode text is PM', () => {
      const mockActiveMode = document.createElement('button');
      mockActiveMode.textContent = 'PM';
      jest.spyOn(coreState, 'getActiveTypeMode').mockReturnValue(mockActiveMode);

      const newInit = new ClockSystemInitializer(coreState, emitter);
      expect(newInit.getAmPmValue()).toBe('PM');
      newInit.destroy();
    });

    it('should return AM when AM element has active class', () => {
      jest.spyOn(coreState, 'getActiveTypeMode').mockReturnValue(null);
      const mockAM = document.createElement('div');
      mockAM.classList.add('active');
      jest.spyOn(coreState, 'getAM').mockReturnValue(mockAM);

      const newInit = new ClockSystemInitializer(coreState, emitter);
      expect(newInit.getAmPmValue()).toBe('AM');
      newInit.destroy();
    });

    it('should return PM when AM element does not have active class', () => {
      jest.spyOn(coreState, 'getActiveTypeMode').mockReturnValue(null);
      const mockAM = document.createElement('div');
      jest.spyOn(coreState, 'getAM').mockReturnValue(mockAM);

      const newInit = new ClockSystemInitializer(coreState, emitter);
      expect(newInit.getAmPmValue()).toBe('PM');
      newInit.destroy();
    });

    it('should return empty string in range mode when AM not active', () => {
      const rangeOptions = {
        ...DEFAULT_OPTIONS,
        range: { ...DEFAULT_OPTIONS.range, enabled: true },
      };
      const coreRange = new CoreState(mockElement, rangeOptions, 'test-range');
      jest.spyOn(coreRange, 'getActiveTypeMode').mockReturnValue(null);
      const mockAM = document.createElement('div');
      jest.spyOn(coreRange, 'getAM').mockReturnValue(mockAM);

      const initRange = new ClockSystemInitializer(coreRange, emitter);
      expect(initRange.getAmPmValue()).toBe('');
      initRange.destroy();
    });

    it('should return AM in range mode when AM has active class', () => {
      const rangeOptions = {
        ...DEFAULT_OPTIONS,
        range: { ...DEFAULT_OPTIONS.range, enabled: true },
      };
      const coreRange = new CoreState(mockElement, rangeOptions, 'test-range-am');
      jest.spyOn(coreRange, 'getActiveTypeMode').mockReturnValue(null);
      const mockAM = document.createElement('div');
      mockAM.classList.add('active');
      jest.spyOn(coreRange, 'getAM').mockReturnValue(mockAM);

      const initRange = new ClockSystemInitializer(coreRange, emitter);
      expect(initRange.getAmPmValue()).toBe('AM');
      initRange.destroy();
    });
  });

  describe('destroy', () => {
    it('should set clockSystem to null', () => {
      initializer.destroy();

      expect(initializer.getClockSystem()).toBeNull();
    });

    it('should not throw when called multiple times', () => {
      initializer.destroy();

      expect(() => initializer.destroy()).not.toThrow();
    });
  });
});

