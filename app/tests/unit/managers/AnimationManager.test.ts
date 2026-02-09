import AnimationManager from '../../../src/managers/AnimationManager';
import { CoreState } from '../../../src/timepicker/CoreState';
import { EventEmitter, type TimepickerEventMap } from '../../../src/utils/EventEmitter';
import { DEFAULT_OPTIONS } from '../../../src/utils/options/defaults';

describe('AnimationManager', () => {
  let coreState: CoreState;
  let emitter: EventEmitter<TimepickerEventMap>;
  let animationManager: AnimationManager;
  let mockElement: HTMLElement;

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
    it('should add opacity class to modal', () => {
      const modal = document.createElement('div') as HTMLDivElement;
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(modal);

      animationManager.setAnimationToOpen();

      expect(modal.classList.contains('opacity')).toBe(true);
    });

    it('should add show class after animation delay', () => {
      const modal = document.createElement('div') as HTMLDivElement;
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(modal);

      animationManager.setAnimationToOpen();

      expect(modal.classList.contains('show')).toBe(false);

      jest.advanceTimersByTime(400);

      expect(modal.classList.contains('show')).toBe(true);
    });
  });

  describe('removeAnimationToClose', () => {
    it('should do nothing when modal is null', () => {
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(null);

      expect(() => animationManager.removeAnimationToClose()).not.toThrow();
    });

    it('should remove show and opacity classes', () => {
      const modal = document.createElement('div') as HTMLDivElement;
      modal.classList.add('show', 'opacity');
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(modal);

      animationManager.removeAnimationToClose();

      jest.advanceTimersByTime(400);

      expect(modal.classList.contains('show')).toBe(false);
      expect(modal.classList.contains('opacity')).toBe(false);
    });
  });

  describe('handleAnimationClock', () => {
    it('should add and remove animation class', () => {
      const clockFace = document.createElement('div');
      jest.spyOn(coreState, 'getClockFace').mockReturnValue(clockFace);

      animationManager.handleAnimationClock();

      jest.advanceTimersByTime(400);

      expect(clockFace.classList.contains('tp-ui-clock-animation')).toBe(true);

      jest.advanceTimersByTime(350);

      expect(clockFace.classList.contains('tp-ui-clock-animation')).toBe(false);
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

      jest.advanceTimersByTime(450);

      expect(clockHand.classList.contains('tp-ui-tips-animation')).toBe(false);
      expect(emitSpy).toHaveBeenCalledWith('animation:end', {});
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
    it('should clear all timeouts', () => {
      const modal = document.createElement('div') as HTMLDivElement;
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(modal);

      animationManager.setAnimationToOpen();

      animationManager.destroy();

      jest.advanceTimersByTime(500);

      expect(modal.classList.contains('show')).toBe(false);
    });
  });

  describe('animations disabled', () => {
    it('should run callback immediately when animation is disabled', () => {
      const noAnimOptions = {
        ...DEFAULT_OPTIONS,
        ui: { ...DEFAULT_OPTIONS.ui, animation: false },
      };
      coreState = new CoreState(mockElement, noAnimOptions, 'test-no-anim');
      animationManager = new AnimationManager(coreState, emitter);

      const modal = document.createElement('div') as HTMLDivElement;
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(modal);

      animationManager.setAnimationToOpen();

      expect(modal.classList.contains('opacity')).toBe(true);
      expect(modal.classList.contains('show')).toBe(true);
    });

    it('should not run handleAnimationClock when animation disabled', () => {
      const noAnimOptions = {
        ...DEFAULT_OPTIONS,
        ui: { ...DEFAULT_OPTIONS.ui, animation: false },
      };
      coreState = new CoreState(mockElement, noAnimOptions, 'test-no-anim');
      animationManager = new AnimationManager(coreState, emitter);

      const clockFace = document.createElement('div');
      jest.spyOn(coreState, 'getClockFace').mockReturnValue(clockFace);

      animationManager.handleAnimationClock();

      expect(clockFace.classList.contains('tp-ui-clock-animation')).toBe(false);
    });
  });
});
