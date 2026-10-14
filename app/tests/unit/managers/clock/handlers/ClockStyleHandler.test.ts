import { ClockStyleHandler } from '../../../../../src/managers/clock/handlers/ClockStyleHandler';
import { CoreState } from '../../../../../src/timepicker/CoreState';
import { DEFAULT_OPTIONS, mergeOptions } from '../../../../../src/utils/options/defaults';
import type { TimepickerOptions } from '../../../../../src/types/options';

describe('ClockStyleHandler', () => {
  let coreState: CoreState;
  let handler: ClockStyleHandler;
  let mockElement: HTMLElement;
  let mockCircle: HTMLElement;
  let mockClockHand: HTMLElement;
  let mockHour: HTMLInputElement;
  let mockMinutes: HTMLInputElement;
  let mockInput: HTMLInputElement;

  const stubDom = (core: CoreState): void => {
    jest.spyOn(core, 'getCircle').mockReturnValue(mockCircle as HTMLDivElement);
    jest.spyOn(core, 'getClockHand').mockReturnValue(mockClockHand as HTMLDivElement);
    jest.spyOn(core, 'getHour').mockReturnValue(mockHour);
    jest.spyOn(core, 'getMinutes').mockReturnValue(mockMinutes);
    jest.spyOn(core, 'getInput').mockReturnValue(mockInput);
  };

  const handlerWith = (options: TimepickerOptions): { core: CoreState; handler: ClockStyleHandler } => {
    const core = new CoreState(mockElement, mergeOptions(options), 'test-id');
    stubDom(core);
    return { core, handler: new ClockStyleHandler(core) };
  };

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
    stubDom(coreState);

    handler = new ClockStyleHandler(coreState);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.restoreAllMocks();
  });

  describe('setOnStartCSSClassesIfClockType24h', () => {
    const innerRingClasses = (): { circle: boolean; hand: boolean } => ({
      circle: mockCircle.classList.contains('tp-ui-circle-hand-24h'),
      hand: mockClockHand.classList.contains('tp-ui-clock-hand-24h'),
    });

    const runWith = (type: '12h' | '24h', inputValue: string): { circle: boolean; hand: boolean } => {
      mockInput.value = inputValue;
      handlerWith({ clock: { type } }).handler.setOnStartCSSClassesIfClockType24h();
      return innerRingClasses();
    };

    it.each(['13:00', '14:30', '23:59', '00:00', '00:30'])(
      'should add both the circle and the hand 24h classes for a 24h start time of %s',
      (value) => {
        expect(runWith('24h', value)).toEqual({ circle: true, hand: true });
      },
    );

    it.each(['01:00', '09:30', '10:30', '12:00', '12:45'])(
      'should add neither 24h class for a 24h start time of %s',
      (value) => {
        expect(runWith('24h', value)).toEqual({ circle: false, hand: false });
      },
    );

    it('should add neither 24h class for a 12h clock, even when the input holds an hour past 12', () => {
      expect(runWith('12h', '14:30')).toEqual({ circle: false, hand: false });
    });

    it('should add neither 24h class for a 24h clock with an empty input', () => {
      expect(runWith('24h', '')).toEqual({ circle: false, hand: false });
    });

    it('should not throw and add neither class when the input is missing', () => {
      const { core, handler: handler24h } = handlerWith({ clock: { type: '24h' } });
      jest.spyOn(core, 'getInput').mockReturnValue(null);

      expect(() => handler24h.setOnStartCSSClassesIfClockType24h()).not.toThrow();
      expect(innerRingClasses()).toEqual({ circle: false, hand: false });
    });

    it('should not throw when the circle and the hand are missing', () => {
      const { core, handler: handler24h } = handlerWith({ clock: { type: '24h' } });
      jest.spyOn(core, 'getCircle').mockReturnValue(null);
      jest.spyOn(core, 'getClockHand').mockReturnValue(null);
      mockInput.value = '14:30';

      expect(() => handler24h.setOnStartCSSClassesIfClockType24h()).not.toThrow();
    });
  });

  describe('setClassActiveToHourOnOpen', () => {
    it('should add active class to hour element', () => {
      handler.setClassActiveToHourOnOpen();

      expect(mockHour.classList.contains('active')).toBe(true);
    });

    it('should not add class when mobile option is true', () => {
      handlerWith({ ui: { mobile: true } }).handler.setClassActiveToHourOnOpen();

      expect(mockHour.classList.contains('active')).toBe(false);
    });

    it('should not add class when isMobileView is true', () => {
      coreState.setIsMobileView(true);

      handler.setClassActiveToHourOnOpen();

      expect(mockHour.classList.contains('active')).toBe(false);
    });

    it('should not throw when hour is null', () => {
      jest.spyOn(coreState, 'getHour').mockReturnValue(null);

      expect(() => handler.setClassActiveToHourOnOpen()).not.toThrow();
    });
  });
});
