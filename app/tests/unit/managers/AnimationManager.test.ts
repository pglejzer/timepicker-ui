import AnimationManager from '../../../src/managers/AnimationManager';
import { CoreState } from '../../../src/timepicker/CoreState';
import { EventEmitter, type TimepickerEventMap } from '../../../src/utils/EventEmitter';
import { DEFAULT_OPTIONS } from '../../../src/utils/options/defaults';
import { TIMINGS } from '@/constants/timings';

describe('AnimationManager', () => {
  let coreState: CoreState;
  let emitter: EventEmitter<TimepickerEventMap>;
  let animationManager: AnimationManager;
  let mockElement: HTMLElement;
  const originalMatchMedia = window.matchMedia;

  const setReducedMotion = (reduce: boolean): void => {
    window.matchMedia = jest.fn((query: string) => ({
      matches: reduce && /prefers-reduced-motion:\s*reduce/.test(query),
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })) as unknown as typeof window.matchMedia;
  };

  const useAnimationOff = (): void => {
    const noAnimOptions = { ...DEFAULT_OPTIONS, ui: { ...DEFAULT_OPTIONS.ui, animation: false } };
    coreState = new CoreState(mockElement, noAnimOptions, 'test-no-anim');
    animationManager.destroy();
    animationManager = new AnimationManager(coreState, emitter);
  };

  const mockModal = (): HTMLDivElement => {
    const modal = document.createElement('div');
    jest.spyOn(coreState, 'getModalElement').mockReturnValue(modal);
    return modal;
  };

  const trackStyleFlush = (modal: HTMLElement): jest.Mock<number, []> => {
    const flush = jest.fn(() => {
      expect(modal).not.toHaveClass('show');
      return 0;
    });
    Object.defineProperty(modal, 'offsetHeight', { configurable: true, get: flush });
    return flush;
  };

  beforeEach(() => {
    jest.useFakeTimers();

    mockElement = document.createElement('div');
    mockElement.innerHTML = '<input type="text" />';
    document.body.appendChild(mockElement);

    coreState = new CoreState(mockElement, DEFAULT_OPTIONS, 'test-instance-id');
    emitter = new EventEmitter();
    animationManager = new AnimationManager(coreState, emitter);
  });

  afterEach(() => {
    animationManager.destroy();
    window.matchMedia = originalMatchMedia;
    document.body.innerHTML = '';
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create instance with CoreState and EventEmitter', () => {
      expect(animationManager).toBeInstanceOf(AnimationManager);
    });

    it('should setup event listeners', () => {
      const newEmitter = new EventEmitter<TimepickerEventMap>();
      const onSpy = jest.spyOn(newEmitter, 'on');

      const newManager = new AnimationManager(coreState, newEmitter);

      expect(onSpy).toHaveBeenCalledWith('animation:clock', expect.any(Function));

      newManager.destroy();
    });
  });

  describe('setAnimationToOpen', () => {
    it('should flush styles first, then add show synchronously without scheduling a timer', () => {
      const modal = mockModal();
      const flush = trackStyleFlush(modal);

      animationManager.setAnimationToOpen();

      expect(flush).toHaveBeenCalledTimes(1);
      expect(modal).toHaveClass('show');
      expect(jest.getTimerCount()).toBe(0);
    });

    it('should never add the opacity helper class', () => {
      const modal = mockModal();

      animationManager.setAnimationToOpen();
      animationManager.setAnimationToOpen(true);

      expect(modal).not.toHaveClass('opacity');
    });

    it('should add show without a style flush when immediate', () => {
      const modal = mockModal();
      const flush = trackStyleFlush(modal);

      animationManager.setAnimationToOpen(true);

      expect(flush).not.toHaveBeenCalled();
      expect(modal).toHaveClass('show');
      expect(jest.getTimerCount()).toBe(0);
    });

    it('should add show without a style flush when animation is off', () => {
      useAnimationOff();
      const modal = mockModal();
      const flush = trackStyleFlush(modal);

      animationManager.setAnimationToOpen();

      expect(flush).not.toHaveBeenCalled();
      expect(modal).toHaveClass('show');
    });
  });

  describe('removeAnimationToClose', () => {
    it('should not throw when modal is null', () => {
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(null);

      expect(() => animationManager.removeAnimationToClose()).not.toThrow();
    });

    it('should remove show at once and return the exit duration', () => {
      const modal = mockModal();
      modal.classList.add('show');

      const wait = animationManager.removeAnimationToClose();

      expect(modal).not.toHaveClass('show');
      expect(wait).toBe(TIMINGS.MODAL_EXIT);
    });

    it('should return no wait when animation is off', () => {
      useAnimationOff();
      const modal = mockModal();
      modal.classList.add('show');

      expect(animationManager.removeAnimationToClose()).toBe(0);
      expect(modal).not.toHaveClass('show');
    });

    it('should return no wait when the user prefers reduced motion', () => {
      setReducedMotion(true);
      const modal = mockModal();
      modal.classList.add('show');

      expect(animationManager.removeAnimationToClose()).toBe(0);
      expect(modal).not.toHaveClass('show');
    });

    it('should keep the exit duration when reduced motion is not requested', () => {
      setReducedMotion(false);
      mockModal();

      expect(animationManager.removeAnimationToClose()).toBe(TIMINGS.MODAL_EXIT);
    });
  });

  describe('handleAnimationSwitchTipsMode', () => {
    it('should do nothing when clock hand is null', () => {
      jest.spyOn(coreState, 'getClockHand').mockReturnValue(null);

      expect(() => animationManager.handleAnimationSwitchTipsMode()).not.toThrow();
    });

    it('should add animation class and emit events', () => {
      const clockHand = document.createElement('div');
      jest.spyOn(coreState, 'getClockHand').mockReturnValue(clockHand);
      const emitSpy = jest.spyOn(emitter, 'emit');

      animationManager.handleAnimationSwitchTipsMode();

      expect(clockHand.classList.contains('tp-ui-tips-animation')).toBe(true);
      expect(emitSpy).toHaveBeenCalledWith('animation:start', {});

      jest.advanceTimersByTime(TIMINGS.TIPS_ANIMATION);

      expect(clockHand.classList.contains('tp-ui-tips-animation')).toBe(false);
      expect(emitSpy).toHaveBeenCalledWith('animation:end', {});
    });

    it('should leave the hand alone and emit nothing when ui.animation is off', () => {
      useAnimationOff();
      const clockHand = document.createElement('div');
      jest.spyOn(coreState, 'getClockHand').mockReturnValue(clockHand);
      const emitSpy = jest.spyOn(emitter, 'emit');

      animationManager.handleAnimationSwitchTipsMode();

      expect(clockHand.classList.contains('tp-ui-tips-animation')).toBe(false);
      expect(emitSpy).not.toHaveBeenCalledWith('animation:start', {});
      expect(jest.getTimerCount()).toBe(0);
    });

    it('should leave the hand alone and emit nothing under reduced motion', () => {
      setReducedMotion(true);
      const clockHand = document.createElement('div');
      jest.spyOn(coreState, 'getClockHand').mockReturnValue(clockHand);
      const emitSpy = jest.spyOn(emitter, 'emit');

      animationManager.handleAnimationSwitchTipsMode();

      expect(clockHand.classList.contains('tp-ui-tips-animation')).toBe(false);
      expect(emitSpy).not.toHaveBeenCalledWith('animation:start', {});
      expect(jest.getTimerCount()).toBe(0);
    });
  });

  describe('event listeners', () => {
    it('should respond to animation:clock event', () => {
      const handleSpy = jest.spyOn(animationManager, 'handleAnimationSwitchTipsMode');

      emitter.emit('animation:clock', {});

      expect(handleSpy).toHaveBeenCalled();
    });
  });

  describe('destroy', () => {
    it('should clear a pending tips animation timer', () => {
      const clockHand = document.createElement('div');
      jest.spyOn(coreState, 'getClockHand').mockReturnValue(clockHand);
      const emitSpy = jest.spyOn(emitter, 'emit');

      animationManager.handleAnimationSwitchTipsMode();
      animationManager.destroy();

      jest.advanceTimersByTime(TIMINGS.TIPS_ANIMATION);

      expect(jest.getTimerCount()).toBe(0);
      expect(emitSpy).not.toHaveBeenCalledWith('animation:end', {});
    });
  });
});
