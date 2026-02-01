import { ClockStyleHandler } from '../../../../../src/managers/clock/handlers/ClockStyleHandler';
import { CoreState } from '../../../../../src/timepicker/CoreState';
import { DEFAULT_OPTIONS } from '../../../../../src/utils/options/defaults';

describe('ClockStyleHandler', () => {
  let coreState: CoreState;
  let handler: ClockStyleHandler;
  let mockElement: HTMLElement;
  let mockCircle: HTMLElement;
  let mockClockHand: HTMLElement;
  let mockHour: HTMLInputElement;
  let mockMinutes: HTMLInputElement;
  let mockInput: HTMLInputElement;

  beforeEach(() => {
    mockElement = document.createElement('div');
    mockCircle = document.createElement('div');
    mockClockHand = document.createElement('div');
    mockHour = document.createElement('input');
    mockMinutes = document.createElement('input');
    mockInput = document.createElement('input');

    mockElement.appendChild(mockCircle);
    mockElement.appendChild(mockClockHand);
    mockElement.appendChild(mockHour);
    mockElement.appendChild(mockMinutes);
    mockElement.appendChild(mockInput);
    document.body.appendChild(mockElement);

    coreState = new CoreState(mockElement, DEFAULT_OPTIONS, 'test-id');
    jest.spyOn(coreState, 'getCircle').mockReturnValue(mockCircle as HTMLDivElement);
    jest.spyOn(coreState, 'getClockHand').mockReturnValue(mockClockHand as HTMLDivElement);
    jest.spyOn(coreState, 'getHour').mockReturnValue(mockHour);
    jest.spyOn(coreState, 'getMinutes').mockReturnValue(mockMinutes);
    jest.spyOn(coreState, 'getInput').mockReturnValue(mockInput);

    handler = new ClockStyleHandler(coreState);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.restoreAllMocks();
  });

  describe('removeCircleClockClasses24h', () => {
    it('should remove 24h classes from circle and clockHand', () => {
      mockCircle.classList.add('tp-ui-circle-hand-24h');
      mockClockHand.classList.add('tp-ui-clock-hand-24h');

      handler.removeCircleClockClasses24h();

      expect(mockCircle.classList.contains('tp-ui-circle-hand-24h')).toBe(false);
      expect(mockClockHand.classList.contains('tp-ui-clock-hand-24h')).toBe(false);
    });

    it('should not throw when circle is null', () => {
      jest.spyOn(coreState, 'getCircle').mockReturnValue(null);

      expect(() => handler.removeCircleClockClasses24h()).not.toThrow();
    });

    it('should not throw when clockHand is null', () => {
      jest.spyOn(coreState, 'getClockHand').mockReturnValue(null);

      expect(() => handler.removeCircleClockClasses24h()).not.toThrow();
    });
  });

  describe('setCircleClockClasses24h', () => {
    it('should add 24h classes to circle and clockHand', () => {
      handler.setCircleClockClasses24h();

      expect(mockCircle.classList.contains('tp-ui-circle-hand-24h')).toBe(true);
      expect(mockClockHand.classList.contains('tp-ui-clock-hand-24h')).toBe(true);
    });

    it('should not throw when circle is null', () => {
      jest.spyOn(coreState, 'getCircle').mockReturnValue(null);

      expect(() => handler.setCircleClockClasses24h()).not.toThrow();
    });

    it('should not throw when clockHand is null', () => {
      jest.spyOn(coreState, 'getClockHand').mockReturnValue(null);

      expect(() => handler.setCircleClockClasses24h()).not.toThrow();
    });
  });

  describe('setOnStartCSSClassesIfClockType24h', () => {
    it('should not add classes when clock type is 12h', () => {
      handler.setOnStartCSSClassesIfClockType24h();

      expect(mockCircle.classList.contains('tp-ui-circle-hand-24h')).toBe(false);
    });

    it('should add classes when clock type is 24h and hour > 12', () => {
      Object.defineProperty(coreState.options.clock, 'type', { value: '24h' });
      mockInput.value = '14:30';

      handler.setOnStartCSSClassesIfClockType24h();

      expect(mockCircle.classList.contains('tp-ui-circle-hand-24h')).toBe(true);
    });

    it('should add classes when clock type is 24h and hour is 0', () => {
      Object.defineProperty(coreState.options.clock, 'type', { value: '24h' });
      mockInput.value = '00:30';

      handler.setOnStartCSSClassesIfClockType24h();

      expect(mockCircle.classList.contains('tp-ui-circle-hand-24h')).toBe(true);
    });

    it('should not add classes when hour is between 1 and 12', () => {
      Object.defineProperty(coreState.options.clock, 'type', { value: '24h' });
      mockInput.value = '10:30';

      handler.setOnStartCSSClassesIfClockType24h();

      expect(mockCircle.classList.contains('tp-ui-circle-hand-24h')).toBe(false);
    });

    it('should not throw when input is null', () => {
      Object.defineProperty(coreState.options.clock, 'type', { value: '24h' });
      jest.spyOn(coreState, 'getInput').mockReturnValue(null);

      expect(() => handler.setOnStartCSSClassesIfClockType24h()).not.toThrow();
    });

    it('should not add classes when input value is empty', () => {
      Object.defineProperty(coreState.options.clock, 'type', { value: '24h' });
      mockInput.value = '';

      handler.setOnStartCSSClassesIfClockType24h();

      expect(mockCircle.classList.contains('tp-ui-circle-hand-24h')).toBe(false);
    });
  });

  describe('setBgColorToCircleWithMinutesTips', () => {
    it('should not throw when minutes is null', () => {
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(null);

      expect(() => handler.setBgColorToCircleWithMinutesTips()).not.toThrow();
    });

    it('should not throw when circle is null', () => {
      jest.spyOn(coreState, 'getCircle').mockReturnValue(null);

      expect(() => handler.setBgColorToCircleWithMinutesTips()).not.toThrow();
    });

    it('should remove small-circle class when minutes is in MINUTES_STEP_5', () => {
      mockMinutes.value = '05';
      mockCircle.classList.add('small-circle');

      handler.setBgColorToCircleWithMinutesTips();

      expect(mockCircle.classList.contains('small-circle')).toBe(false);
    });

    it('should not modify circle when minutes is not in MINUTES_STEP_5', () => {
      mockMinutes.value = '07';
      mockCircle.classList.add('small-circle');

      handler.setBgColorToCircleWithMinutesTips();

      expect(mockCircle.classList.contains('small-circle')).toBe(true);
    });
  });

  describe('removeBgColorToCirleWithMinutesTips', () => {
    it('should not throw when minutes is null', () => {
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(null);

      expect(() => handler.removeBgColorToCirleWithMinutesTips()).not.toThrow();
    });

    it('should not throw when circle is null', () => {
      jest.spyOn(coreState, 'getCircle').mockReturnValue(null);

      expect(() => handler.removeBgColorToCirleWithMinutesTips()).not.toThrow();
    });

    it('should add small-circle class when minutes is not in MINUTES_STEP_5', () => {
      mockMinutes.value = '07';

      handler.removeBgColorToCirleWithMinutesTips();

      expect(mockCircle.classList.contains('small-circle')).toBe(true);
      expect(mockCircle.style.backgroundColor).toBe('');
    });

    it('should not add small-circle class when minutes is in MINUTES_STEP_5', () => {
      mockMinutes.value = '05';

      handler.removeBgColorToCirleWithMinutesTips();

      expect(mockCircle.classList.contains('small-circle')).toBe(false);
    });
  });

  describe('setClassActiveToHourOnOpen', () => {
    it('should add active class to hour element', () => {
      handler.setClassActiveToHourOnOpen();

      expect(mockHour.classList.contains('active')).toBe(true);
    });

    it('should not add class when mobile option is true', () => {
      Object.defineProperty(coreState.options.ui, 'mobile', { value: true });

      handler.setClassActiveToHourOnOpen();

      expect(mockHour.classList.contains('active')).toBe(false);
    });

    it('should not add class when isMobileView is true', () => {
      Object.defineProperty(coreState, 'isMobileView', { value: true, writable: true });

      handler.setClassActiveToHourOnOpen();

      expect(mockHour.classList.contains('active')).toBe(false);
    });

    it('should not throw when hour is null', () => {
      jest.spyOn(coreState, 'getHour').mockReturnValue(null);

      expect(() => handler.setClassActiveToHourOnOpen()).not.toThrow();
    });
  });

  describe('toggleClassActiveToValueTips', () => {
    let mockTips: HTMLElement[];

    beforeEach(() => {
      mockTips = [
        document.createElement('span'),
        document.createElement('span'),
        document.createElement('span'),
      ];
      mockTips[0].innerText = '1';
      mockTips[1].innerText = '2';
      mockTips[2].innerText = '3';

      jest.spyOn(coreState, 'getAllValueTips').mockReturnValue(mockTips as HTMLDivElement[]);
    });

    it('should not modify tips when hasClockSystem is true', () => {
      mockTips[0].classList.add('active');

      handler.toggleClassActiveToValueTips(true, '2');

      expect(mockTips[0].classList.contains('active')).toBe(true);
    });

    it('should not throw when allValueTips is null', () => {
      jest.spyOn(coreState, 'getAllValueTips').mockReturnValue([] as HTMLDivElement[]);

      expect(() => handler.toggleClassActiveToValueTips(false, '1')).not.toThrow();
    });

    it('should add active class to matching tip', () => {
      handler.toggleClassActiveToValueTips(false, '2');

      expect(mockTips[1].classList.contains('active')).toBe(true);
      expect(mockTips[1].getAttribute('aria-selected')).toBe('true');
    });

    it('should remove active class from other tips', () => {
      mockTips[0].classList.add('active');

      handler.toggleClassActiveToValueTips(false, '2');

      expect(mockTips[0].classList.contains('active')).toBe(false);
      expect(mockTips[0].getAttribute('aria-selected')).toBe('false');
    });

    it('should handle numeric value', () => {
      handler.toggleClassActiveToValueTips(false, 3);

      expect(mockTips[2].classList.contains('active')).toBe(true);
    });

    it('should not throw when value does not match any tip', () => {
      expect(() => handler.toggleClassActiveToValueTips(false, '99')).not.toThrow();
    });

    it('should handle null value', () => {
      expect(() => handler.toggleClassActiveToValueTips(false, null)).not.toThrow();
    });
  });
});

