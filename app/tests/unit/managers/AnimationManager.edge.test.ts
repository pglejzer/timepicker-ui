import AnimationManager from '../../../src/managers/AnimationManager';
import { CoreState } from '../../../src/timepicker/CoreState';
import { EventEmitter, type TimepickerEventMap } from '../../../src/utils/EventEmitter';
import { DEFAULT_OPTIONS } from '../../../src/utils/options/defaults';

describe('AnimationManager edge cases', () => {
  let coreState: CoreState;
  let emitter: EventEmitter<TimepickerEventMap>;
  let manager: AnimationManager;
  let mockElement: HTMLElement;

  beforeEach(() => {
    jest.useFakeTimers();

    mockElement = document.createElement('div');
    mockElement.innerHTML = '<input type="text" />';
    document.body.appendChild(mockElement);

    coreState = new CoreState(mockElement, DEFAULT_OPTIONS, 'anim-edge-id');
    emitter = new EventEmitter();
    manager = new AnimationManager(coreState, emitter);
  });

  afterEach(() => {
    manager.destroy();
    document.body.innerHTML = '';
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('rapid open/close toggle', () => {
    it('should not leak classes when open and close are called rapidly', () => {
      const modal = document.createElement('div') as HTMLDivElement;
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(modal);

      manager.setAnimationToOpen();
      manager.removeAnimationToClose();
      manager.setAnimationToOpen();
      manager.removeAnimationToClose();

      jest.advanceTimersByTime(1000);

      expect(modal.classList.contains('show')).toBe(false);
      expect(modal.classList.contains('opacity')).toBe(false);
    });
  });

  describe('setAnimationToOpen with null modal', () => {
    it('should not throw when modal is null', () => {
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(null);

      expect(() => manager.setAnimationToOpen()).not.toThrow();
    });
  });

  describe('destroy cancels pending animation timers', () => {
    it('should not apply show class after destroy', () => {
      const modal = document.createElement('div') as HTMLDivElement;
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(modal);

      manager.setAnimationToOpen();
      expect(modal.classList.contains('opacity')).toBe(true);

      manager.destroy();

      jest.advanceTimersByTime(1000);

      expect(modal.classList.contains('show')).toBe(false);
    });
  });

  describe('handleAnimationSwitchTipsMode rapid calls', () => {
    it('should handle rapid toggle without issues', () => {
      const clockHand = document.createElement('div');
      jest.spyOn(coreState, 'getClockHand').mockReturnValue(clockHand);

      manager.handleAnimationSwitchTipsMode();
      manager.handleAnimationSwitchTipsMode();
      manager.handleAnimationSwitchTipsMode();

      jest.advanceTimersByTime(1000);

      expect(clockHand.classList.contains('tp-ui-tips-animation')).toBe(false);
    });
  });

  describe('animation:clock event after destroy', () => {
    it('should not throw when event fires after destroy', () => {
      manager.destroy();

      expect(() => emitter.emit('animation:clock', {})).not.toThrow();
    });
  });
});

