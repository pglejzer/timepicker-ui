import { ColumnDragState } from '../../../../../src/managers/plugins/wheel/ColumnDragState';

describe('ColumnDragState', () => {
  let element: HTMLDivElement;
  let state: ColumnDragState;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
    state = new ColumnDragState(element, 'hours');
  });

  afterEach(() => {
    state.destroy();
    document.body.innerHTML = '';
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  describe('constructor', () => {
    it('should store the element and column type', () => {
      expect(state.element).toBe(element);
      expect(state.columnType).toBe('hours');
    });

    it('should start in non-dragging state', () => {
      expect(state.isDragging).toBe(false);
    });

    it('should produce a valid AbortSignal', () => {
      expect(state.signal).toBeInstanceOf(AbortSignal);
      expect(state.signal.aborted).toBe(false);
    });
  });

  describe('startDrag()', () => {
    it('should set dragging state', () => {
      state.startDrag(100, 1);

      expect(state.isDragging).toBe(true);
      expect(state.lastY).toBe(100);
      expect(state.pointerId).toBe(1);
    });

    it('should stop existing momentum before starting', () => {
      const stopSpy = jest.spyOn(state, 'stopMomentum');
      state.startDrag(50, 2);

      expect(stopSpy).toHaveBeenCalled();
    });
  });

  describe('updateLastY()', () => {
    it('should update the lastY value', () => {
      state.startDrag(100, 1);
      state.updateLastY(200);

      expect(state.lastY).toBe(200);
    });
  });

  describe('addVelocitySample()', () => {
    it('should not throw', () => {
      state.startDrag(100, 1);
      expect(() => state.addVelocitySample(110)).not.toThrow();
      expect(() => state.addVelocitySample(120)).not.toThrow();
    });
  });

  describe('computeReleaseVelocity()', () => {
    it('should return 0 with no samples', () => {
      expect(state.computeReleaseVelocity()).toBe(0);
    });

    it('should return 0 with only one recent sample', () => {
      state.startDrag(100, 1);
      expect(state.computeReleaseVelocity()).toBe(0);
    });
  });

  describe('endDrag()', () => {
    it('should clear dragging state', () => {
      state.startDrag(100, 1);
      state.endDrag();

      expect(state.isDragging).toBe(false);
      expect(state.pointerId).toBe(-1);
    });
  });

  describe('stopMomentum()', () => {
    it('should not throw when no momentum is active', () => {
      expect(() => state.stopMomentum()).not.toThrow();
    });

    it('should cancel active momentum rAF', () => {
      const cancelSpy = jest.spyOn(window, 'cancelAnimationFrame');
      state.setMomentumRaf(42);
      state.stopMomentum();

      expect(cancelSpy).toHaveBeenCalledWith(42);
    });
  });

  describe('setMomentumRaf()', () => {
    it('should not throw', () => {
      expect(() => state.setMomentumRaf(123)).not.toThrow();
      expect(() => state.setMomentumRaf(null)).not.toThrow();
    });
  });

  describe('animateToOffset()', () => {
    it('should call onComplete immediately when distance is negligible', () => {
      element.scrollTop = 100;
      const onComplete = jest.fn();

      state.animateToOffset(100, onComplete);

      expect(onComplete).toHaveBeenCalled();
    });

    it('should start animation for non-trivial distances', () => {
      jest.useFakeTimers();
      const rafSpy = jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
        setTimeout(() => cb(performance.now()), 16);
        return 1;
      });

      element.scrollTop = 0;
      const onComplete = jest.fn();

      state.animateToOffset(200, onComplete);

      expect(rafSpy).toHaveBeenCalled();

      state.stopMomentum();
      rafSpy.mockRestore();
    });
  });

  describe('scheduleSnapAfterWheel()', () => {
    it('should call callback after debounce timeout', () => {
      jest.useFakeTimers();
      const callback = jest.fn();

      state.scheduleSnapAfterWheel(callback);
      expect(callback).not.toHaveBeenCalled();

      jest.advanceTimersByTime(200);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should debounce multiple calls', () => {
      jest.useFakeTimers();
      const callback = jest.fn();

      state.scheduleSnapAfterWheel(callback);
      state.scheduleSnapAfterWheel(callback);
      state.scheduleSnapAfterWheel(callback);

      jest.advanceTimersByTime(200);
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('destroy()', () => {
    it('should abort the signal', () => {
      const signal = state.signal;
      state.destroy();
      expect(signal.aborted).toBe(true);
    });

    it('should not throw when called multiple times', () => {
      state.destroy();
      expect(() => state.destroy()).not.toThrow();
    });

    it('should clear pending snap timeout', () => {
      jest.useFakeTimers();
      const callback = jest.fn();

      state.scheduleSnapAfterWheel(callback);
      state.destroy();

      jest.advanceTimersByTime(200);
      expect(callback).not.toHaveBeenCalled();
    });
  });
});

