import ClockManager from '../../../src/managers/ClockManager';
import { CoreState } from '../../../src/timepicker/CoreState';
import { EventEmitter, type TimepickerEventMap } from '../../../src/utils/EventEmitter';
import { DEFAULT_OPTIONS } from '../../../src/utils/options/defaults';

describe('ClockManager', () => {
  let coreState: CoreState;
  let emitter: EventEmitter<TimepickerEventMap>;
  let clockManager: ClockManager;
  let mockElement: HTMLElement;

  beforeEach(() => {
    mockElement = document.createElement('div');
    mockElement.innerHTML = '<input type="text" />';
    document.body.appendChild(mockElement);

    coreState = new CoreState(mockElement, DEFAULT_OPTIONS, 'test-instance-id');
    emitter = new EventEmitter();
    clockManager = new ClockManager(coreState, emitter);
  });

  afterEach(() => {
    clockManager.destroy();
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create instance with CoreState and EventEmitter', () => {
      expect(clockManager).toBeInstanceOf(ClockManager);
    });

    it('should setup event listeners', () => {
      const newEmitter = new EventEmitter<TimepickerEventMap>();
      const onSpy = jest.spyOn(newEmitter, 'on');

      const newManager = new ClockManager(coreState, newEmitter);

      expect(onSpy).toHaveBeenCalled();

      newManager.destroy();
    });
  });

  describe('event listeners', () => {
    it('should respond to select:hour event', () => {
      expect(() => emitter.emit('select:hour', { hour: '09' })).not.toThrow();
    });

    it('should respond to select:minute event', () => {
      expect(() => emitter.emit('select:minute', { minutes: '30' })).not.toThrow();
    });

    it('should respond to select:am event', () => {
      expect(() => emitter.emit('select:am', {})).not.toThrow();
    });

    it('should respond to select:pm event', () => {
      expect(() => emitter.emit('select:pm', {})).not.toThrow();
    });

    it('should respond to animation:start event', () => {
      expect(() => emitter.emit('animation:start', {})).not.toThrow();
    });

    it('should respond to animation:end event', () => {
      expect(() => emitter.emit('animation:end', {})).not.toThrow();
    });

    it('should respond to range:switch event', () => {
      expect(() =>
        emitter.emit('range:switch', {
          active: 'from',
          disabledTime: { hours: ['01'], minutes: [] },
        }),
      ).not.toThrow();
    });

    it('should handle range:switch with null disabledTime', () => {
      expect(() =>
        emitter.emit('range:switch', {
          active: 'to',
          disabledTime: null,
        }),
      ).not.toThrow();
    });
  });

  describe('initializeClockSystem', () => {
    it('should not initialize if clock elements are missing', () => {
      jest.spyOn(coreState, 'getClockFace').mockReturnValue(null);

      expect(() => clockManager.initializeClockSystem()).not.toThrow();
    });

    it('should not initialize if tips wrapper is missing', () => {
      const clockFace = document.createElement('div');
      const clockHand = document.createElement('div');
      const circle = document.createElement('div');

      jest.spyOn(coreState, 'getClockFace').mockReturnValue(clockFace);
      jest.spyOn(coreState, 'getClockHand').mockReturnValue(clockHand);
      jest.spyOn(coreState, 'getCircle').mockReturnValue(circle);
      jest.spyOn(coreState, 'getTipsWrapper').mockReturnValue(null);

      expect(() => clockManager.initializeClockSystem()).not.toThrow();
    });

    it('should initialize clock system when all elements present', () => {
      const clockFace = document.createElement('div');
      const clockHand = document.createElement('div');
      const circle = document.createElement('div');
      const tipsWrapper = document.createElement('div');
      const hour = document.createElement('input') as HTMLInputElement;
      const minutes = document.createElement('input') as HTMLInputElement;

      hour.value = '09';
      minutes.value = '30';

      jest.spyOn(coreState, 'getClockFace').mockReturnValue(clockFace);
      jest.spyOn(coreState, 'getClockHand').mockReturnValue(clockHand);
      jest.spyOn(coreState, 'getCircle').mockReturnValue(circle);
      jest.spyOn(coreState, 'getTipsWrapper').mockReturnValue(tipsWrapper);
      jest.spyOn(coreState, 'getTipsWrapperFor24h').mockReturnValue(null);
      jest.spyOn(coreState, 'getHour').mockReturnValue(hour);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minutes);
      jest.spyOn(coreState, 'getActiveTypeMode').mockReturnValue(null);
      jest.spyOn(coreState, 'getAM').mockReturnValue(null);
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(null);

      expect(() => clockManager.initializeClockSystem()).not.toThrow();
    });

    it('should initialize 24h clock system', () => {
      const options24h = {
        ...DEFAULT_OPTIONS,
        clock: {
          ...DEFAULT_OPTIONS.clock,
          type: '24h' as const,
        },
      };

      const core24h = new CoreState(mockElement, options24h, 'test-24h');
      const manager24h = new ClockManager(core24h, emitter);

      const clockFace = document.createElement('div');
      const clockHand = document.createElement('div');
      const circle = document.createElement('div');
      const tipsWrapper = document.createElement('div');
      const tipsWrapper24h = document.createElement('div');
      const hour = document.createElement('input') as HTMLInputElement;
      const minutes = document.createElement('input') as HTMLInputElement;

      hour.value = '14';
      minutes.value = '30';

      jest.spyOn(core24h, 'getClockFace').mockReturnValue(clockFace);
      jest.spyOn(core24h, 'getClockHand').mockReturnValue(clockHand);
      jest.spyOn(core24h, 'getCircle').mockReturnValue(circle);
      jest.spyOn(core24h, 'getTipsWrapper').mockReturnValue(tipsWrapper);
      jest.spyOn(core24h, 'getTipsWrapperFor24h').mockReturnValue(tipsWrapper24h);
      jest.spyOn(core24h, 'getHour').mockReturnValue(hour);
      jest.spyOn(core24h, 'getMinutes').mockReturnValue(minutes);
      jest.spyOn(core24h, 'getActiveTypeMode').mockReturnValue(null);
      jest.spyOn(core24h, 'getAM').mockReturnValue(null);
      jest.spyOn(core24h, 'getModalElement').mockReturnValue(null);

      expect(() => manager24h.initializeClockSystem()).not.toThrow();

      manager24h.destroy();
    });

    it('should handle disabled time configuration', () => {
      const optionsWithDisabled = {
        ...DEFAULT_OPTIONS,
        clock: {
          ...DEFAULT_OPTIONS.clock,
          disabledTime: {
            hours: ['01', '02'],
            minutes: ['15', '45'],
          },
        },
      };

      const coreDisabled = new CoreState(mockElement, optionsWithDisabled, 'test-disabled');
      const managerDisabled = new ClockManager(coreDisabled, emitter);

      coreDisabled.setDisabledTime({
        value: {
          hours: ['01', '02'],
          minutes: ['15', '45'],
        },
      });

      const clockFace = document.createElement('div');
      const clockHand = document.createElement('div');
      const circle = document.createElement('div');
      const tipsWrapper = document.createElement('div');
      const hour = document.createElement('input') as HTMLInputElement;
      const minutes = document.createElement('input') as HTMLInputElement;

      jest.spyOn(coreDisabled, 'getClockFace').mockReturnValue(clockFace);
      jest.spyOn(coreDisabled, 'getClockHand').mockReturnValue(clockHand);
      jest.spyOn(coreDisabled, 'getCircle').mockReturnValue(circle);
      jest.spyOn(coreDisabled, 'getTipsWrapper').mockReturnValue(tipsWrapper);
      jest.spyOn(coreDisabled, 'getTipsWrapperFor24h').mockReturnValue(null);
      jest.spyOn(coreDisabled, 'getHour').mockReturnValue(hour);
      jest.spyOn(coreDisabled, 'getMinutes').mockReturnValue(minutes);
      jest.spyOn(coreDisabled, 'getActiveTypeMode').mockReturnValue(null);
      jest.spyOn(coreDisabled, 'getAM').mockReturnValue(null);
      jest.spyOn(coreDisabled, 'getModalElement').mockReturnValue(null);

      expect(() => managerDisabled.initializeClockSystem()).not.toThrow();

      managerDisabled.destroy();
    });

    it('should handle interval disabled time', () => {
      const coreInterval = new CoreState(mockElement, DEFAULT_OPTIONS, 'test-interval');
      const managerInterval = new ClockManager(coreInterval, emitter);

      coreInterval.setDisabledTime({
        value: {
          isInterval: true,
          intervals: ['09:00 - 12:00'],
        },
      });

      const clockFace = document.createElement('div');
      const clockHand = document.createElement('div');
      const circle = document.createElement('div');
      const tipsWrapper = document.createElement('div');
      const hour = document.createElement('input') as HTMLInputElement;
      const minutes = document.createElement('input') as HTMLInputElement;

      jest.spyOn(coreInterval, 'getClockFace').mockReturnValue(clockFace);
      jest.spyOn(coreInterval, 'getClockHand').mockReturnValue(clockHand);
      jest.spyOn(coreInterval, 'getCircle').mockReturnValue(circle);
      jest.spyOn(coreInterval, 'getTipsWrapper').mockReturnValue(tipsWrapper);
      jest.spyOn(coreInterval, 'getTipsWrapperFor24h').mockReturnValue(null);
      jest.spyOn(coreInterval, 'getHour').mockReturnValue(hour);
      jest.spyOn(coreInterval, 'getMinutes').mockReturnValue(minutes);
      jest.spyOn(coreInterval, 'getActiveTypeMode').mockReturnValue(null);
      jest.spyOn(coreInterval, 'getAM').mockReturnValue(null);
      jest.spyOn(coreInterval, 'getModalElement').mockReturnValue(null);

      expect(() => managerInterval.initializeClockSystem()).not.toThrow();

      managerInterval.destroy();
    });

    it('should call onHourChange callback', () => {
      const clockFace = document.createElement('div');
      const clockHand = document.createElement('div');
      const circle = document.createElement('div');
      const tipsWrapper = document.createElement('div');
      const hour = document.createElement('input') as HTMLInputElement;
      const minutes = document.createElement('input') as HTMLInputElement;
      const modal = document.createElement('div');
      const typeMode = document.createElement('button') as HTMLButtonElement;
      typeMode.textContent = 'AM';

      jest.spyOn(coreState, 'getClockFace').mockReturnValue(clockFace);
      jest.spyOn(coreState, 'getClockHand').mockReturnValue(clockHand);
      jest.spyOn(coreState, 'getCircle').mockReturnValue(circle);
      jest.spyOn(coreState, 'getTipsWrapper').mockReturnValue(tipsWrapper);
      jest.spyOn(coreState, 'getTipsWrapperFor24h').mockReturnValue(null);
      jest.spyOn(coreState, 'getHour').mockReturnValue(hour);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minutes);
      jest.spyOn(coreState, 'getActiveTypeMode').mockReturnValue(typeMode);
      jest.spyOn(coreState, 'getAM').mockReturnValue(null);
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(modal);

      clockManager.initializeClockSystem();
    });
  });

  describe('destroyClockSystem', () => {
    it('should safely destroy when clock system is null', () => {
      expect(() => clockManager.destroyClockSystem()).not.toThrow();
    });

    it('should destroy existing clock system', () => {
      const clockFace = document.createElement('div');
      const clockHand = document.createElement('div');
      const circle = document.createElement('div');
      const tipsWrapper = document.createElement('div');
      const hour = document.createElement('input') as HTMLInputElement;
      const minutes = document.createElement('input') as HTMLInputElement;

      jest.spyOn(coreState, 'getClockFace').mockReturnValue(clockFace);
      jest.spyOn(coreState, 'getClockHand').mockReturnValue(clockHand);
      jest.spyOn(coreState, 'getCircle').mockReturnValue(circle);
      jest.spyOn(coreState, 'getTipsWrapper').mockReturnValue(tipsWrapper);
      jest.spyOn(coreState, 'getTipsWrapperFor24h').mockReturnValue(null);
      jest.spyOn(coreState, 'getHour').mockReturnValue(hour);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minutes);
      jest.spyOn(coreState, 'getActiveTypeMode').mockReturnValue(null);
      jest.spyOn(coreState, 'getAM').mockReturnValue(null);
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(null);

      clockManager.initializeClockSystem();

      expect(() => clockManager.destroyClockSystem()).not.toThrow();
    });
  });

  describe('removeCircleClockClasses24h', () => {
    it('should remove 24h classes from circle and clock hand', () => {
      const circle = document.createElement('div');
      const clockHand = document.createElement('div');

      circle.classList.add('tp-ui-circle-hand-24h');
      clockHand.classList.add('tp-ui-clock-hand-24h');

      jest.spyOn(coreState, 'getCircle').mockReturnValue(circle);
      jest.spyOn(coreState, 'getClockHand').mockReturnValue(clockHand);

      clockManager.removeCircleClockClasses24h();

      expect(circle.classList.contains('tp-ui-circle-hand-24h')).toBe(false);
      expect(clockHand.classList.contains('tp-ui-clock-hand-24h')).toBe(false);
    });

    it('should handle null elements', () => {
      jest.spyOn(coreState, 'getCircle').mockReturnValue(null);
      jest.spyOn(coreState, 'getClockHand').mockReturnValue(null);

      expect(() => clockManager.removeCircleClockClasses24h()).not.toThrow();
    });
  });

  describe('setCircleClockClasses24h', () => {
    it('should add 24h classes to circle and clock hand', () => {
      const circle = document.createElement('div');
      const clockHand = document.createElement('div');

      jest.spyOn(coreState, 'getCircle').mockReturnValue(circle);
      jest.spyOn(coreState, 'getClockHand').mockReturnValue(clockHand);

      clockManager.setCircleClockClasses24h();

      expect(circle.classList.contains('tp-ui-circle-hand-24h')).toBe(true);
      expect(clockHand.classList.contains('tp-ui-clock-hand-24h')).toBe(true);
    });

    it('should handle null circle', () => {
      const clockHand = document.createElement('div');

      jest.spyOn(coreState, 'getCircle').mockReturnValue(null);
      jest.spyOn(coreState, 'getClockHand').mockReturnValue(clockHand);

      expect(() => clockManager.setCircleClockClasses24h()).not.toThrow();
    });

    it('should handle null clockHand', () => {
      const circle = document.createElement('div');

      jest.spyOn(coreState, 'getCircle').mockReturnValue(circle);
      jest.spyOn(coreState, 'getClockHand').mockReturnValue(null);

      clockManager.setCircleClockClasses24h();

      expect(circle.classList.contains('tp-ui-circle-hand-24h')).toBe(true);
    });
  });

  describe('setOnStartCSSClassesIfClockType24h', () => {
    it('should do nothing for 12h clock type', () => {
      const circle = document.createElement('div');
      jest.spyOn(coreState, 'getCircle').mockReturnValue(circle);

      clockManager.setOnStartCSSClassesIfClockType24h();

      expect(circle.classList.contains('tp-ui-circle-hand-24h')).toBe(false);
    });

    it('should set classes for 24h clock type with hour > 12', () => {
      const options24h = {
        ...DEFAULT_OPTIONS,
        clock: {
          ...DEFAULT_OPTIONS.clock,
          type: '24h' as const,
        },
      };

      const core24h = new CoreState(mockElement, options24h, 'test-24h-id');
      const manager24h = new ClockManager(core24h, emitter);

      const input = document.createElement('input') as HTMLInputElement;
      input.value = '14:30';

      const circle = document.createElement('div');
      const clockHand = document.createElement('div');

      jest.spyOn(core24h, 'getInput').mockReturnValue(input);
      jest.spyOn(core24h, 'getCircle').mockReturnValue(circle);
      jest.spyOn(core24h, 'getClockHand').mockReturnValue(clockHand);

      manager24h.setOnStartCSSClassesIfClockType24h();

      expect(circle.classList.contains('tp-ui-circle-hand-24h')).toBe(true);

      manager24h.destroy();
    });

    it('should set classes for 24h clock type with hour 0', () => {
      const options24h = {
        ...DEFAULT_OPTIONS,
        clock: {
          ...DEFAULT_OPTIONS.clock,
          type: '24h' as const,
        },
      };

      const core24h = new CoreState(mockElement, options24h, 'test-24h-id');
      const manager24h = new ClockManager(core24h, emitter);

      const input = document.createElement('input') as HTMLInputElement;
      input.value = '00:30';

      const circle = document.createElement('div');
      const clockHand = document.createElement('div');

      jest.spyOn(core24h, 'getInput').mockReturnValue(input);
      jest.spyOn(core24h, 'getCircle').mockReturnValue(circle);
      jest.spyOn(core24h, 'getClockHand').mockReturnValue(clockHand);

      manager24h.setOnStartCSSClassesIfClockType24h();

      expect(circle.classList.contains('tp-ui-circle-hand-24h')).toBe(true);

      manager24h.destroy();
    });

    it('should not set classes for 24h clock type with hour <= 12 and > 0', () => {
      const options24h = {
        ...DEFAULT_OPTIONS,
        clock: {
          ...DEFAULT_OPTIONS.clock,
          type: '24h' as const,
        },
      };

      const core24h = new CoreState(mockElement, options24h, 'test-24h-id');
      const manager24h = new ClockManager(core24h, emitter);

      const input = document.createElement('input') as HTMLInputElement;
      input.value = '09:30';

      const circle = document.createElement('div');
      const clockHand = document.createElement('div');

      jest.spyOn(core24h, 'getInput').mockReturnValue(input);
      jest.spyOn(core24h, 'getCircle').mockReturnValue(circle);
      jest.spyOn(core24h, 'getClockHand').mockReturnValue(clockHand);

      manager24h.setOnStartCSSClassesIfClockType24h();

      expect(circle.classList.contains('tp-ui-circle-hand-24h')).toBe(false);

      manager24h.destroy();
    });

    it('should return early when input is null', () => {
      const options24h = {
        ...DEFAULT_OPTIONS,
        clock: {
          ...DEFAULT_OPTIONS.clock,
          type: '24h' as const,
        },
      };

      const core24h = new CoreState(mockElement, options24h, 'test-24h-id');
      const manager24h = new ClockManager(core24h, emitter);

      jest.spyOn(core24h, 'getInput').mockReturnValue(null);

      expect(() => manager24h.setOnStartCSSClassesIfClockType24h()).not.toThrow();

      manager24h.destroy();
    });

    it('should not set classes when input value is empty', () => {
      const options24h = {
        ...DEFAULT_OPTIONS,
        clock: {
          ...DEFAULT_OPTIONS.clock,
          type: '24h' as const,
        },
      };

      const core24h = new CoreState(mockElement, options24h, 'test-24h-id');
      const manager24h = new ClockManager(core24h, emitter);

      const input = document.createElement('input') as HTMLInputElement;
      input.value = '';

      const circle = document.createElement('div');

      jest.spyOn(core24h, 'getInput').mockReturnValue(input);
      jest.spyOn(core24h, 'getCircle').mockReturnValue(circle);

      manager24h.setOnStartCSSClassesIfClockType24h();

      expect(circle.classList.contains('tp-ui-circle-hand-24h')).toBe(false);

      manager24h.destroy();
    });
  });

  describe('setClassActiveToHourOnOpen', () => {
    it('should add active class to hour input', () => {
      const hour = document.createElement('input') as HTMLInputElement;
      jest.spyOn(coreState, 'getHour').mockReturnValue(hour);

      clockManager.setClassActiveToHourOnOpen();

      expect(hour.classList.contains('active')).toBe(true);
    });

    it('should not add active class in mobile mode', () => {
      const mobileOptions = {
        ...DEFAULT_OPTIONS,
        ui: {
          ...DEFAULT_OPTIONS.ui,
          mobile: true,
        },
      };

      const mobileCore = new CoreState(mockElement, mobileOptions, 'test-mobile-id');
      const mobileManager = new ClockManager(mobileCore, emitter);

      const hour = document.createElement('input') as HTMLInputElement;
      jest.spyOn(mobileCore, 'getHour').mockReturnValue(hour);

      mobileManager.setClassActiveToHourOnOpen();

      expect(hour.classList.contains('active')).toBe(false);

      mobileManager.destroy();
    });

    it('should not add active class when isMobileView is true', () => {
      coreState.setIsMobileView(true);

      const hour = document.createElement('input') as HTMLInputElement;
      jest.spyOn(coreState, 'getHour').mockReturnValue(hour);

      clockManager.setClassActiveToHourOnOpen();

      expect(hour.classList.contains('active')).toBe(false);
    });
  });

  describe('setBgColorToCircleWithMinutesTips', () => {
    it('should not modify if minutes or circle is null', () => {
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(null);
      jest.spyOn(coreState, 'getCircle').mockReturnValue(null);

      expect(() => clockManager.setBgColorToCircleWithMinutesTips()).not.toThrow();
    });

    it('should remove small-circle class for 5-step minutes', () => {
      const minutes = document.createElement('input') as HTMLInputElement;
      minutes.value = '30';
      const circle = document.createElement('div');
      circle.classList.add('small-circle');

      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minutes);
      jest.spyOn(coreState, 'getCircle').mockReturnValue(circle);

      clockManager.setBgColorToCircleWithMinutesTips();

      expect(circle.classList.contains('small-circle')).toBe(false);
    });

    it('should not modify for non-5-step minutes', () => {
      const minutes = document.createElement('input') as HTMLInputElement;
      minutes.value = '07';
      const circle = document.createElement('div');

      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minutes);
      jest.spyOn(coreState, 'getCircle').mockReturnValue(circle);

      clockManager.setBgColorToCircleWithMinutesTips();

      expect(circle.classList.contains('small-circle')).toBe(false);
    });
  });

  describe('removeBgColorToCirleWithMinutesTips', () => {
    it('should not modify if minutes or circle is null', () => {
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(null);
      jest.spyOn(coreState, 'getCircle').mockReturnValue(null);

      expect(() => clockManager.removeBgColorToCirleWithMinutesTips()).not.toThrow();
    });

    it('should add small-circle class for non-5-step minutes', () => {
      const minutes = document.createElement('input') as HTMLInputElement;
      minutes.value = '07';
      const circle = document.createElement('div');

      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minutes);
      jest.spyOn(coreState, 'getCircle').mockReturnValue(circle);

      clockManager.removeBgColorToCirleWithMinutesTips();

      expect(circle.classList.contains('small-circle')).toBe(true);
    });

    it('should not add small-circle class for 5-step minutes', () => {
      const minutes = document.createElement('input') as HTMLInputElement;
      minutes.value = '15';
      const circle = document.createElement('div');

      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minutes);
      jest.spyOn(coreState, 'getCircle').mockReturnValue(circle);

      clockManager.removeBgColorToCirleWithMinutesTips();

      expect(circle.classList.contains('small-circle')).toBe(false);
    });
  });

  describe('setMinutesToClock', () => {
    it('should not throw when clock system is null', () => {
      expect(() => clockManager.setMinutesToClock('30')).not.toThrow();
    });

    it('should set minutes when clock system exists', () => {
      const clockFace = document.createElement('div');
      const clockHand = document.createElement('div');
      const circle = document.createElement('div');
      const tipsWrapper = document.createElement('div');
      const hour = document.createElement('input') as HTMLInputElement;
      const minutes = document.createElement('input') as HTMLInputElement;

      jest.spyOn(coreState, 'getClockFace').mockReturnValue(clockFace);
      jest.spyOn(coreState, 'getClockHand').mockReturnValue(clockHand);
      jest.spyOn(coreState, 'getCircle').mockReturnValue(circle);
      jest.spyOn(coreState, 'getTipsWrapper').mockReturnValue(tipsWrapper);
      jest.spyOn(coreState, 'getTipsWrapperFor24h').mockReturnValue(null);
      jest.spyOn(coreState, 'getHour').mockReturnValue(hour);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minutes);
      jest.spyOn(coreState, 'getActiveTypeMode').mockReturnValue(null);
      jest.spyOn(coreState, 'getAM').mockReturnValue(null);
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(null);

      clockManager.initializeClockSystem();

      expect(() => clockManager.setMinutesToClock('45')).not.toThrow();
    });
  });

  describe('setHoursToClock', () => {
    it('should not throw when clock system is null', () => {
      expect(() => clockManager.setHoursToClock('09')).not.toThrow();
    });

    it('should set hours when clock system exists', () => {
      const clockFace = document.createElement('div');
      const clockHand = document.createElement('div');
      const circle = document.createElement('div');
      const tipsWrapper = document.createElement('div');
      const hour = document.createElement('input') as HTMLInputElement;
      const minutes = document.createElement('input') as HTMLInputElement;

      jest.spyOn(coreState, 'getClockFace').mockReturnValue(clockFace);
      jest.spyOn(coreState, 'getClockHand').mockReturnValue(clockHand);
      jest.spyOn(coreState, 'getCircle').mockReturnValue(circle);
      jest.spyOn(coreState, 'getTipsWrapper').mockReturnValue(tipsWrapper);
      jest.spyOn(coreState, 'getTipsWrapperFor24h').mockReturnValue(null);
      jest.spyOn(coreState, 'getHour').mockReturnValue(hour);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minutes);
      jest.spyOn(coreState, 'getActiveTypeMode').mockReturnValue(null);
      jest.spyOn(coreState, 'getAM').mockReturnValue(null);
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(null);

      clockManager.initializeClockSystem();

      expect(() => clockManager.setHoursToClock('10')).not.toThrow();
    });
  });

  describe('setTransformToCircleWithSwitchesHour', () => {
    it('should not throw when clock system is null', () => {
      expect(() => clockManager.setTransformToCircleWithSwitchesHour('09')).not.toThrow();
    });

    it('should not throw with null value', () => {
      expect(() => clockManager.setTransformToCircleWithSwitchesHour(null)).not.toThrow();
    });
  });

  describe('setTransformToCircleWithSwitchesMinutes', () => {
    it('should not throw when clock system is null', () => {
      expect(() => clockManager.setTransformToCircleWithSwitchesMinutes('30')).not.toThrow();
    });

    it('should not throw with null value', () => {
      expect(() => clockManager.setTransformToCircleWithSwitchesMinutes(null)).not.toThrow();
    });
  });

  describe('updateAmPm', () => {
    it('should not throw when clock system is null', () => {
      expect(() => clockManager.updateAmPm()).not.toThrow();
    });

    it('should not update for 24h clock type', () => {
      const options24h = {
        ...DEFAULT_OPTIONS,
        clock: {
          ...DEFAULT_OPTIONS.clock,
          type: '24h' as const,
        },
      };

      const core24h = new CoreState(mockElement, options24h, 'test-24h-id');
      const manager24h = new ClockManager(core24h, emitter);

      expect(() => manager24h.updateAmPm()).not.toThrow();

      manager24h.destroy();
    });
  });

  describe('toggleClassActiveToValueTips', () => {
    it('should not throw when allValueTips is empty', () => {
      jest.spyOn(coreState, 'getAllValueTips').mockReturnValue([]);

      expect(() => clockManager.toggleClassActiveToValueTips('09')).not.toThrow();
    });

    it('should return early when clock system exists', () => {
      const clockFace = document.createElement('div');
      const clockHand = document.createElement('div');
      const circle = document.createElement('div');
      const tipsWrapper = document.createElement('div');
      const hour = document.createElement('input') as HTMLInputElement;
      const minutes = document.createElement('input') as HTMLInputElement;

      jest.spyOn(coreState, 'getClockFace').mockReturnValue(clockFace);
      jest.spyOn(coreState, 'getClockHand').mockReturnValue(clockHand);
      jest.spyOn(coreState, 'getCircle').mockReturnValue(circle);
      jest.spyOn(coreState, 'getTipsWrapper').mockReturnValue(tipsWrapper);
      jest.spyOn(coreState, 'getTipsWrapperFor24h').mockReturnValue(null);
      jest.spyOn(coreState, 'getHour').mockReturnValue(hour);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minutes);
      jest.spyOn(coreState, 'getActiveTypeMode').mockReturnValue(null);
      jest.spyOn(coreState, 'getAM').mockReturnValue(null);
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(null);

      clockManager.initializeClockSystem();

      const getAllSpy = jest.spyOn(coreState, 'getAllValueTips');

      clockManager.toggleClassActiveToValueTips('09');

      expect(getAllSpy).not.toHaveBeenCalled();
    });

    it('should toggle active class on matching tip', () => {
      const tip1 = document.createElement('div') as HTMLDivElement;
      tip1.innerText = '9';
      const tip2 = document.createElement('div') as HTMLDivElement;
      tip2.innerText = '10';
      tip2.classList.add('active');

      jest.spyOn(coreState, 'getAllValueTips').mockReturnValue([tip1, tip2]);

      clockManager.toggleClassActiveToValueTips(9);

      expect(tip1.classList.contains('active')).toBe(true);
      expect(tip2.classList.contains('active')).toBe(false);
    });

    it('should not add active class when no matching tip', () => {
      const tip1 = document.createElement('div') as HTMLDivElement;
      tip1.innerText = '1';

      jest.spyOn(coreState, 'getAllValueTips').mockReturnValue([tip1]);

      clockManager.toggleClassActiveToValueTips(9);

      expect(tip1.classList.contains('active')).toBe(false);
    });
  });

  describe('destroy', () => {
    it('should destroy clock system', () => {
      const destroySpy = jest.spyOn(clockManager, 'destroyClockSystem');

      clockManager.destroy();

      expect(destroySpy).toHaveBeenCalled();
    });
  });
});
