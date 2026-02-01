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

  describe('initialize with full DOM', () => {
    let clockFace: HTMLDivElement;
    let clockHand: HTMLDivElement;
    let circle: HTMLDivElement;
    let tipsWrapper: HTMLDivElement;
    let hourInput: HTMLInputElement;
    let minutesInput: HTMLInputElement;

    beforeEach(() => {
      clockFace = document.createElement('div');
      clockFace.className = 'tp-ui-clock-face';
      clockHand = document.createElement('div');
      clockHand.className = 'tp-ui-clock-hand';
      circle = document.createElement('div');
      circle.className = 'tp-ui-circle';
      tipsWrapper = document.createElement('div');
      tipsWrapper.className = 'tp-ui-tips-wrapper';
      hourInput = document.createElement('input');
      hourInput.value = '10';
      minutesInput = document.createElement('input');
      minutesInput.value = '30';

      jest.spyOn(coreState, 'getClockFace').mockReturnValue(clockFace);
      jest.spyOn(coreState, 'getClockHand').mockReturnValue(clockHand);
      jest.spyOn(coreState, 'getCircle').mockReturnValue(circle);
      jest.spyOn(coreState, 'getTipsWrapper').mockReturnValue(tipsWrapper);
      jest.spyOn(coreState, 'getHour').mockReturnValue(hourInput);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minutesInput);
    });

    it('should create ClockSystem when all elements are present', () => {
      initializer.initialize();

      expect(initializer.getClockSystem()).not.toBeNull();
    });

    it('should destroy ClockSystem on destroy', () => {
      initializer.initialize();
      const clockSystem = initializer.getClockSystem();
      expect(clockSystem).not.toBeNull();

      initializer.destroy();

      expect(initializer.getClockSystem()).toBeNull();
    });
  });

  describe('initialize with 24h clock', () => {
    it('should include tipsWrapperFor24h in config', () => {
      const options24h = {
        ...DEFAULT_OPTIONS,
        clock: { ...DEFAULT_OPTIONS.clock, type: '24h' as const },
      };
      const core24h = new CoreState(mockElement, options24h, 'test-24h-init');
      const init24h = new ClockSystemInitializer(core24h, emitter);

      const clockFace = document.createElement('div');
      const clockHand = document.createElement('div');
      const circle = document.createElement('div');
      const tipsWrapper = document.createElement('div');
      const tipsWrapper24h = document.createElement('div');

      jest.spyOn(core24h, 'getClockFace').mockReturnValue(clockFace);
      jest.spyOn(core24h, 'getClockHand').mockReturnValue(clockHand);
      jest.spyOn(core24h, 'getCircle').mockReturnValue(circle);
      jest.spyOn(core24h, 'getTipsWrapper').mockReturnValue(tipsWrapper);
      jest.spyOn(core24h, 'getTipsWrapperFor24h').mockReturnValue(tipsWrapper24h);
      jest.spyOn(core24h, 'getHour').mockReturnValue(document.createElement('input') as HTMLInputElement);
      jest.spyOn(core24h, 'getMinutes').mockReturnValue(document.createElement('input') as HTMLInputElement);

      init24h.initialize();

      expect(init24h.getClockSystem()).not.toBeNull();
      init24h.destroy();
    });
  });

  describe('callbacks in initialize', () => {
    let clockFace: HTMLDivElement;
    let clockHand: HTMLDivElement;
    let circle: HTMLDivElement;
    let tipsWrapper: HTMLDivElement;
    let hourInput: HTMLInputElement;
    let minutesInput: HTMLInputElement;
    let modal: HTMLDivElement;

    beforeEach(() => {
      clockFace = document.createElement('div');
      clockHand = document.createElement('div');
      circle = document.createElement('div');
      tipsWrapper = document.createElement('div');
      hourInput = document.createElement('input');
      hourInput.value = '10';
      minutesInput = document.createElement('input');
      minutesInput.value = '30';
      modal = document.createElement('div');
      modal.setAttribute('role', 'dialog');

      jest.spyOn(coreState, 'getClockFace').mockReturnValue(clockFace);
      jest.spyOn(coreState, 'getClockHand').mockReturnValue(clockHand);
      jest.spyOn(coreState, 'getCircle').mockReturnValue(circle);
      jest.spyOn(coreState, 'getTipsWrapper').mockReturnValue(tipsWrapper);
      jest.spyOn(coreState, 'getHour').mockReturnValue(hourInput);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minutesInput);
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(modal);
      jest.spyOn(coreState, 'getActiveTypeMode').mockReturnValue(null);
    });

    it('should update hourInput value when setHour is called', () => {
      initializer.initialize();

      const clockSystem = initializer.getClockSystem();
      expect(clockSystem).not.toBeNull();

      clockSystem?.setHour('11');
      expect(clockSystem?.getHour()).toBe('11');
    });

    it('should update minuteInput value when setMinute is called', () => {
      initializer.initialize();

      const clockSystem = initializer.getClockSystem();
      expect(clockSystem).not.toBeNull();

      clockSystem?.setMinute('45');
      expect(clockSystem?.getMinute()).toBe('45');
    });

    it('should switch between hours and minutes modes', () => {
      initializer.initialize();

      const clockSystem = initializer.getClockSystem();
      expect(clockSystem).not.toBeNull();

      expect(() => clockSystem?.switchToMinutes()).not.toThrow();
      expect(() => clockSystem?.switchToHours()).not.toThrow();
    });

    it('should set AM/PM value', () => {
      initializer.initialize();

      const clockSystem = initializer.getClockSystem();
      expect(clockSystem).not.toBeNull();

      clockSystem?.setAmPm('PM');
      expect(clockSystem?.getAmPm()).toBe('PM');
    });

    it('should block and unblock interactions', () => {
      initializer.initialize();

      const clockSystem = initializer.getClockSystem();
      expect(clockSystem).not.toBeNull();

      expect(() => clockSystem?.blockInteractions()).not.toThrow();
      expect(() => clockSystem?.unblockInteractions()).not.toThrow();
    });

    it('should update disabled time', () => {
      initializer.initialize();

      const clockSystem = initializer.getClockSystem();
      expect(clockSystem).not.toBeNull();

      expect(() =>
        clockSystem?.updateDisabledTime({
          hours: ['13', '14'],
          minutes: undefined,
        }),
      ).not.toThrow();
    });

    it('should emit update when drag changes hour', () => {
      const emitSpy = jest.spyOn(emitter, 'emit');
      initializer.initialize();

      const clockSystem = initializer.getClockSystem();
      expect(clockSystem).not.toBeNull();

      jest.spyOn(clockFace, 'getBoundingClientRect').mockReturnValue({
        left: 0,
        top: 0,
        right: 200,
        bottom: 200,
        width: 200,
        height: 200,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      });

      clockSystem?.switchToHours();

      const mousedownEvent = new MouseEvent('mousedown', {
        clientX: 100,
        clientY: 20,
        bubbles: true,
      });
      clockFace.dispatchEvent(mousedownEvent);

      const mouseupEvent = new MouseEvent('mouseup', { bubbles: true });
      document.dispatchEvent(mouseupEvent);

      expect(emitSpy).toHaveBeenCalledWith('update', expect.any(Object));
    });

    it('should emit update when drag changes minute', () => {
      const emitSpy = jest.spyOn(emitter, 'emit');
      initializer.initialize();

      const clockSystem = initializer.getClockSystem();
      expect(clockSystem).not.toBeNull();

      jest.spyOn(clockFace, 'getBoundingClientRect').mockReturnValue({
        left: 0,
        top: 0,
        right: 200,
        bottom: 200,
        width: 200,
        height: 200,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      });

      clockSystem?.switchToMinutes();

      const mousedownEvent = new MouseEvent('mousedown', {
        clientX: 100,
        clientY: 20,
        bubbles: true,
      });
      clockFace.dispatchEvent(mousedownEvent);

      expect(emitSpy).toHaveBeenCalledWith('update', expect.any(Object));
    });

    it('should emit range:minute:commit on mouseup in minutes mode', () => {
      const emitSpy = jest.spyOn(emitter, 'emit');
      initializer.initialize();

      const clockSystem = initializer.getClockSystem();
      expect(clockSystem).not.toBeNull();

      minutesInput.classList.add('active');

      jest.spyOn(clockFace, 'getBoundingClientRect').mockReturnValue({
        left: 0,
        top: 0,
        right: 200,
        bottom: 200,
        width: 200,
        height: 200,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      });

      clockSystem?.switchToMinutes();

      const mousedownEvent = new MouseEvent('mousedown', {
        clientX: 100,
        clientY: 20,
        bubbles: true,
      });
      clockFace.dispatchEvent(mousedownEvent);

      const mouseupEvent = new MouseEvent('mouseup', { bubbles: true });
      document.dispatchEvent(mouseupEvent);

      expect(emitSpy).toHaveBeenCalledWith('range:minute:commit', expect.any(Object));
    });
  });
});

