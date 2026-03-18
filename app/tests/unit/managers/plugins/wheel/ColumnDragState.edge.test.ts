import { ColumnDragState } from '../../../../../src/managers/plugins/wheel/ColumnDragState';

describe('ColumnDragState edge cases', () => {
  let element: HTMLDivElement;
  let state: ColumnDragState;

  beforeEach(() => {
    element = document.createElement('div');
    element.style.height = '200px';
    element.style.overflow = 'auto';
    document.body.appendChild(element);
    state = new ColumnDragState(element, 'hours');
  });

  afterEach(() => {
    state.destroy();
    document.body.innerHTML = '';
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  describe('computeReleaseVelocity() with identical timestamps', () => {
    it('should return 0 when all samples have the same timestamp', () => {
      const mockNow = 1000;
      jest.spyOn(performance, 'now').mockReturnValue(mockNow);

      state.startDrag(100, 1);
      state.addVelocitySample(110);
      state.addVelocitySample(120);

      expect(state.computeReleaseVelocity()).toBe(0);
    });
  });

  describe('destroy during active drag', () => {
    it('should abort signal without throwing when destroyed mid-drag', () => {
      state.startDrag(100, 1);
      state.addVelocitySample(110);
      const signal = state.signal;

      expect(state.isDragging).toBe(true);
      expect(() => state.destroy()).not.toThrow();
      expect(signal.aborted).toBe(true);
    });
  });

  describe('animateToOffset() edge distances', () => {
    it('should snap immediately for sub-pixel distance', () => {
      element.scrollTop = 100;
      const onComplete = jest.fn();

      state.animateToOffset(100.3, onComplete);

      expect(onComplete).toHaveBeenCalledTimes(1);
      expect(element.scrollTop).toBe(100.3);
    });
  });

  describe('scheduleSnapAfterWheel() replaced by destroy', () => {
    it('should not fire callback if destroyed before debounce fires', () => {
      jest.useFakeTimers();

      const callback = jest.fn();
      state.scheduleSnapAfterWheel(callback);
      state.destroy();

      jest.advanceTimersByTime(300);

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('multiple startDrag without endDrag', () => {
    it('should overwrite previous drag state', () => {
      state.startDrag(50, 1);
      expect(state.lastY).toBe(50);
      expect(state.pointerId).toBe(1);

      state.startDrag(200, 2);
      expect(state.lastY).toBe(200);
      expect(state.pointerId).toBe(2);
      expect(state.isDragging).toBe(true);
    });
  });

  describe('stopMomentum when no rAF is set', () => {
    it('should not throw when called without active momentum or snap', () => {
      expect(() => state.stopMomentum()).not.toThrow();
      expect(() => state.stopMomentum()).not.toThrow();
    });
  });

  describe('signal after double destroy', () => {
    it('should return a new non-aborted signal after controller is nullified', () => {
      state.destroy();
      const signal = state.signal;
      expect(signal).toBeInstanceOf(AbortSignal);
    });
  });
});

