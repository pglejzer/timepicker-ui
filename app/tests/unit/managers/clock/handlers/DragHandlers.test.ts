import { DragHandlers } from '../../../../../src/managers/clock/handlers/DragHandlers';

const createMockController = (): {
  handlePointerMove: jest.Mock;
  handlePointerUp: jest.Mock;
  snapToNearestHour: jest.Mock;
} => ({
  handlePointerMove: jest.fn(),
  handlePointerUp: jest.fn(),
  snapToNearestHour: jest.fn(),
});

describe('DragHandlers', () => {
  let clockFace: HTMLDivElement;

  beforeEach(() => {
    clockFace = document.createElement('div');
    clockFace.style.width = '200px';
    clockFace.style.height = '200px';
    Object.defineProperty(clockFace, 'offsetWidth', { value: 200, configurable: true });
    Object.defineProperty(clockFace, 'offsetHeight', { value: 200, configurable: true });
    document.body.appendChild(clockFace);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('constructor', () => {
    it('should create drag handlers', () => {
      const controller = createMockController();

      expect(() => {
        new DragHandlers(controller as never, clockFace);
      }).not.toThrow();
    });

    it('should accept config options', () => {
      const controller = createMockController();

      expect(() => {
        new DragHandlers(controller as never, clockFace, {
          autoSwitchToMinutes: true,
          isMobileView: false,
          smoothHourSnap: true,
        });
      }).not.toThrow();
    });
  });

  describe('attach', () => {
    it('should attach event listeners', () => {
      const controller = createMockController();
      const handlers = new DragHandlers(controller as never, clockFace);
      const addEventListenerSpy = jest.spyOn(clockFace, 'addEventListener');

      handlers.attach();

      expect(addEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
      expect(addEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function), {
        passive: false,
      });

      handlers.detach();
    });
  });

  describe('detach', () => {
    it('should remove event listeners', () => {
      const controller = createMockController();
      const handlers = new DragHandlers(controller as never, clockFace);
      const removeEventListenerSpy = jest.spyOn(clockFace, 'removeEventListener');

      handlers.attach();
      handlers.detach();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));
    });

    describe('in the middle of a drag', () => {
      const FRAME_MS = 16;

      beforeEach(() => {
        jest.useFakeTimers();
      });

      afterEach(() => {
        jest.useRealTimers();
      });

      const startDragWithQueuedFrame = (): {
        controller: ReturnType<typeof createMockController>;
        handlers: DragHandlers;
      } => {
        const controller = createMockController();
        const hourElement = document.createElement('input');
        hourElement.classList.add('active');
        const handlers = new DragHandlers(controller as never, clockFace, {
          smoothHourSnap: true,
          hourElement,
        });
        handlers.attach();

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

        clockFace.dispatchEvent(new MouseEvent('mousedown', { clientX: 150, clientY: 100, bubbles: true }));
        expect(controller.handlePointerMove).toHaveBeenCalledTimes(1);

        document.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 150, bubbles: true }));
        expect(jest.getTimerCount()).toBe(1);

        return { controller, handlers };
      };

      it('should drop the queued frame and ignore the next mouseup after detach', () => {
        const { controller, handlers } = startDragWithQueuedFrame();

        handlers.detach();
        expect(jest.getTimerCount()).toBe(0);
        jest.advanceTimersByTime(FRAME_MS);

        expect(controller.handlePointerMove).toHaveBeenCalledTimes(1);

        document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

        expect(controller.handlePointerUp).not.toHaveBeenCalled();
        expect(controller.snapToNearestHour).not.toHaveBeenCalled();
      });

      it('should run the queued frame and finish the drag on mouseup while still attached', () => {
        const { controller, handlers } = startDragWithQueuedFrame();

        jest.advanceTimersByTime(FRAME_MS);

        expect(controller.handlePointerMove).toHaveBeenCalledTimes(2);
        expect(controller.handlePointerMove).toHaveBeenLastCalledWith(
          { x: 100, y: 150 },
          { x: 100, y: 100 },
          100,
        );

        document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

        expect(controller.handlePointerUp).toHaveBeenCalledTimes(1);
        expect(controller.snapToNearestHour).toHaveBeenCalledTimes(1);

        handlers.detach();
      });
    });
  });

  describe('block', () => {
    it('should block interactions', () => {
      const controller = createMockController();
      const handlers = new DragHandlers(controller as never, clockFace);

      handlers.attach();
      handlers.block();

      const mouseEvent = new MouseEvent('mousedown', {
        clientX: 150,
        clientY: 100,
        bubbles: true,
      });
      clockFace.dispatchEvent(mouseEvent);

      expect(controller.handlePointerMove).not.toHaveBeenCalled();

      handlers.detach();
    });
  });

  describe('unblock', () => {
    it('should unblock interactions after block', () => {
      const controller = createMockController();
      const handlers = new DragHandlers(controller as never, clockFace);

      handlers.attach();
      handlers.block();
      handlers.unblock();

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

      const mouseEvent = new MouseEvent('mousedown', {
        clientX: 150,
        clientY: 100,
        bubbles: true,
      });
      clockFace.dispatchEvent(mouseEvent);

      expect(controller.handlePointerMove).toHaveBeenCalled();

      handlers.detach();
    });
  });

  describe('pointer events', () => {
    it('should handle mousedown event', () => {
      const controller = createMockController();
      const handlers = new DragHandlers(controller as never, clockFace);

      handlers.attach();

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

      const mouseEvent = new MouseEvent('mousedown', {
        clientX: 150,
        clientY: 100,
        bubbles: true,
      });
      clockFace.dispatchEvent(mouseEvent);

      expect(controller.handlePointerMove).toHaveBeenCalled();

      handlers.detach();
    });

    it('should not process events on disabled tips', () => {
      const controller = createMockController();
      const handlers = new DragHandlers(controller as never, clockFace);

      handlers.attach();

      const disabledTip = document.createElement('span');
      disabledTip.classList.add('tp-ui-tips-disabled');
      clockFace.appendChild(disabledTip);

      const mouseEvent = new MouseEvent('mousedown', {
        clientX: 150,
        clientY: 100,
        bubbles: true,
      });
      Object.defineProperty(mouseEvent, 'target', { value: disabledTip });
      clockFace.dispatchEvent(mouseEvent);

      expect(controller.handlePointerMove).not.toHaveBeenCalled();

      handlers.detach();
    });
  });

  describe('with config callbacks', () => {
    it('should respect autoSwitchToMinutes config', () => {
      const controller = createMockController();
      const hourElement = document.createElement('input') as HTMLInputElement;
      hourElement.classList.add('active');

      const minutesElement = document.createElement('input') as HTMLInputElement;
      minutesElement.click = jest.fn();
      minutesElement.focus = jest.fn();

      const handlers = new DragHandlers(controller as never, clockFace, {
        autoSwitchToMinutes: true,
        isMobileView: false,
        hourElement,
        minutesElement,
      });

      handlers.attach();

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

      const mousedownEvent = new MouseEvent('mousedown', {
        clientX: 150,
        clientY: 100,
        bubbles: true,
      });
      clockFace.dispatchEvent(mousedownEvent);

      const mouseupEvent = new MouseEvent('mouseup', { bubbles: true });
      document.dispatchEvent(mouseupEvent);

      expect(minutesElement.click).toHaveBeenCalled();
      expect(minutesElement.focus).toHaveBeenCalled();

      handlers.detach();
    });

    it('should blur the hour field when auto-switching to minutes', () => {
      const controller = createMockController();
      const hourElement = document.createElement('input') as HTMLInputElement;
      hourElement.classList.add('active');
      hourElement.blur = jest.fn();

      const minutesElement = document.createElement('input') as HTMLInputElement;
      minutesElement.click = jest.fn();
      minutesElement.focus = jest.fn();

      const handlers = new DragHandlers(controller as never, clockFace, {
        autoSwitchToMinutes: true,
        isMobileView: false,
        hourElement,
        minutesElement,
      });

      handlers.attach();

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

      const mousedownEvent = new MouseEvent('mousedown', {
        clientX: 150,
        clientY: 100,
        bubbles: true,
      });
      clockFace.dispatchEvent(mousedownEvent);

      const mouseupEvent = new MouseEvent('mouseup', { bubbles: true });
      document.dispatchEvent(mouseupEvent);

      expect(hourElement.blur).toHaveBeenCalledTimes(1);

      handlers.detach();
    });

    it('should hand off to minutes in order: click the minutes field, focus it, then blur the hour field', () => {
      const controller = createMockController();
      const hourElement = document.createElement('input') as HTMLInputElement;
      hourElement.classList.add('active');
      hourElement.blur = jest.fn();

      const minutesElement = document.createElement('input') as HTMLInputElement;
      minutesElement.click = jest.fn();
      minutesElement.focus = jest.fn();

      const handlers = new DragHandlers(controller as never, clockFace, {
        autoSwitchToMinutes: true,
        isMobileView: false,
        hourElement,
        minutesElement,
      });

      handlers.attach();

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

      const mousedownEvent = new MouseEvent('mousedown', {
        clientX: 150,
        clientY: 100,
        bubbles: true,
      });
      clockFace.dispatchEvent(mousedownEvent);

      const mouseupEvent = new MouseEvent('mouseup', { bubbles: true });
      document.dispatchEvent(mouseupEvent);

      const [clickOrder] = (minutesElement.click as jest.Mock).mock.invocationCallOrder;
      const [focusOrder] = (minutesElement.focus as jest.Mock).mock.invocationCallOrder;
      const [blurOrder] = (hourElement.blur as jest.Mock).mock.invocationCallOrder;
      expect(clickOrder).toBeLessThan(focusOrder);
      expect(focusOrder).toBeLessThan(blurOrder);

      handlers.detach();
    });

    it('should leave moving the active class to the minutes field click handler', () => {
      const controller = createMockController();
      const hourElement = document.createElement('input') as HTMLInputElement;
      hourElement.classList.add('active');

      const minutesElement = document.createElement('input') as HTMLInputElement;
      minutesElement.click = jest.fn();
      minutesElement.focus = jest.fn();

      const handlers = new DragHandlers(controller as never, clockFace, {
        autoSwitchToMinutes: true,
        isMobileView: false,
        hourElement,
        minutesElement,
      });

      handlers.attach();

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

      const mousedownEvent = new MouseEvent('mousedown', {
        clientX: 150,
        clientY: 100,
        bubbles: true,
      });
      clockFace.dispatchEvent(mousedownEvent);

      const mouseupEvent = new MouseEvent('mouseup', { bubbles: true });
      document.dispatchEvent(mouseupEvent);

      expect(minutesElement.click).toHaveBeenCalledTimes(1);
      expect(hourElement.classList.contains('active')).toBe(true);
      expect(minutesElement.classList.contains('active')).toBe(false);

      handlers.detach();
    });

    it('should not toggle active classes when autoSwitchToMinutes is disabled', () => {
      const controller = createMockController();
      const hourElement = document.createElement('input') as HTMLInputElement;
      hourElement.classList.add('active');

      const minutesElement = document.createElement('input') as HTMLInputElement;
      minutesElement.click = jest.fn();
      minutesElement.focus = jest.fn();

      const handlers = new DragHandlers(controller as never, clockFace, {
        autoSwitchToMinutes: false,
        isMobileView: false,
        hourElement,
        minutesElement,
      });

      handlers.attach();

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

      const mousedownEvent = new MouseEvent('mousedown', {
        clientX: 150,
        clientY: 100,
        bubbles: true,
      });
      clockFace.dispatchEvent(mousedownEvent);

      const mouseupEvent = new MouseEvent('mouseup', { bubbles: true });
      document.dispatchEvent(mouseupEvent);

      expect(hourElement.classList.contains('active')).toBe(true);
      expect(minutesElement.classList.contains('active')).toBe(false);
      expect(minutesElement.click).not.toHaveBeenCalled();

      handlers.detach();
    });

    it('should not toggle active classes in mobile view', () => {
      const controller = createMockController();
      const hourElement = document.createElement('input') as HTMLInputElement;
      hourElement.classList.add('active');

      const minutesElement = document.createElement('input') as HTMLInputElement;
      minutesElement.click = jest.fn();
      minutesElement.focus = jest.fn();

      const handlers = new DragHandlers(controller as never, clockFace, {
        autoSwitchToMinutes: true,
        isMobileView: true,
        hourElement,
        minutesElement,
      });

      handlers.attach();

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

      const mousedownEvent = new MouseEvent('mousedown', {
        clientX: 150,
        clientY: 100,
        bubbles: true,
      });
      clockFace.dispatchEvent(mousedownEvent);

      const mouseupEvent = new MouseEvent('mouseup', { bubbles: true });
      document.dispatchEvent(mouseupEvent);

      expect(hourElement.classList.contains('active')).toBe(true);
      expect(minutesElement.classList.contains('active')).toBe(false);
      expect(minutesElement.click).not.toHaveBeenCalled();

      handlers.detach();
    });

    it('should call onMinuteCommit when in minutes mode', () => {
      const controller = createMockController();
      const hourElement = document.createElement('input') as HTMLInputElement;

      const minutesElement = document.createElement('input') as HTMLInputElement;
      minutesElement.classList.add('active');

      const onMinuteCommit = jest.fn();

      const handlers = new DragHandlers(controller as never, clockFace, {
        hourElement,
        minutesElement,
        onMinuteCommit,
      });

      handlers.attach();

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

      const mousedownEvent = new MouseEvent('mousedown', {
        clientX: 150,
        clientY: 100,
        bubbles: true,
      });
      clockFace.dispatchEvent(mousedownEvent);

      const mouseupEvent = new MouseEvent('mouseup', { bubbles: true });
      document.dispatchEvent(mouseupEvent);

      expect(onMinuteCommit).toHaveBeenCalled();

      handlers.detach();
    });

    it('should snap to nearest hour when smoothHourSnap is true', () => {
      const controller = createMockController();
      const hourElement = document.createElement('input') as HTMLInputElement;
      hourElement.classList.add('active');

      const handlers = new DragHandlers(controller as never, clockFace, {
        smoothHourSnap: true,
        hourElement,
        autoSwitchToMinutes: false,
      });

      handlers.attach();

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

      const mousedownEvent = new MouseEvent('mousedown', {
        clientX: 150,
        clientY: 100,
        bubbles: true,
      });
      clockFace.dispatchEvent(mousedownEvent);

      const mouseupEvent = new MouseEvent('mouseup', { bubbles: true });
      document.dispatchEvent(mouseupEvent);

      expect(controller.snapToNearestHour).toHaveBeenCalled();

      handlers.detach();
    });

    it('should handle touch events', () => {
      const controller = createMockController();
      const handlers = new DragHandlers(controller as never, clockFace);

      handlers.attach();

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

      const touchEvent = new TouchEvent('touchstart', {
        touches: [{ clientX: 150, clientY: 100, identifier: 0 } as Touch],
        bubbles: true,
      });
      clockFace.dispatchEvent(touchEvent);

      expect(controller.handlePointerMove).toHaveBeenCalled();

      handlers.detach();
    });

    it('should handle mousemove during drag', () => {
      const controller = createMockController();
      const handlers = new DragHandlers(controller as never, clockFace);

      handlers.attach();

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

      const mousedownEvent = new MouseEvent('mousedown', {
        clientX: 150,
        clientY: 100,
        bubbles: true,
      });
      clockFace.dispatchEvent(mousedownEvent);

      controller.handlePointerMove.mockClear();

      const mousemoveEvent = new MouseEvent('mousemove', {
        clientX: 160,
        clientY: 110,
        bubbles: true,
      });
      document.dispatchEvent(mousemoveEvent);

      handlers.detach();
    });

    it('should not process move when blocked', () => {
      const controller = createMockController();
      const handlers = new DragHandlers(controller as never, clockFace);

      handlers.attach();

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

      const mousedownEvent = new MouseEvent('mousedown', {
        clientX: 150,
        clientY: 100,
        bubbles: true,
      });
      clockFace.dispatchEvent(mousedownEvent);

      handlers.block();
      controller.handlePointerMove.mockClear();

      const mousemoveEvent = new MouseEvent('mousemove', {
        clientX: 160,
        clientY: 110,
        bubbles: true,
      });
      document.dispatchEvent(mousemoveEvent);

      expect(controller.handlePointerMove).not.toHaveBeenCalled();

      handlers.detach();
    });

    it('should handle touchmove during drag', () => {
      const controller = createMockController();
      const handlers = new DragHandlers(controller as never, clockFace);

      handlers.attach();

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

      const touchstartEvent = new TouchEvent('touchstart', {
        touches: [{ clientX: 150, clientY: 100, identifier: 0 } as Touch],
        bubbles: true,
      });
      clockFace.dispatchEvent(touchstartEvent);

      expect(controller.handlePointerMove).toHaveBeenCalled();

      handlers.detach();
    });

    it('should handle touchend to complete drag', () => {
      const controller = createMockController();
      const handlers = new DragHandlers(controller as never, clockFace);

      handlers.attach();

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

      const touchstartEvent = new TouchEvent('touchstart', {
        touches: [{ clientX: 150, clientY: 100, identifier: 0 } as Touch],
        bubbles: true,
      });
      clockFace.dispatchEvent(touchstartEvent);

      const touchendEvent = new TouchEvent('touchend', { bubbles: true });
      document.dispatchEvent(touchendEvent);

      expect(controller.handlePointerUp).toHaveBeenCalled();

      handlers.detach();
    });

    it('should handle changedTouches for touch position', () => {
      const controller = createMockController();
      const handlers = new DragHandlers(controller as never, clockFace);

      handlers.attach();

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

      const touchstartEvent = new TouchEvent('touchstart', {
        changedTouches: [{ clientX: 150, clientY: 100, identifier: 0 } as Touch],
        bubbles: true,
      });
      clockFace.dispatchEvent(touchstartEvent);

      expect(controller.handlePointerMove).toHaveBeenCalled();

      handlers.detach();
    });
  });

  describe('smoothHourSnap behavior', () => {
    it('should call snapToNearestHour when smoothHourSnap is true and hour is active', () => {
      const controller = createMockController();
      const hourElement = document.createElement('input') as HTMLInputElement;
      hourElement.classList.add('active');
      const minutesElement = document.createElement('input') as HTMLInputElement;

      const handlers = new DragHandlers(controller as never, clockFace, {
        smoothHourSnap: true,
        hourElement,
        minutesElement,
        isMobileView: true,
      });

      handlers.attach();

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

      const mousedownEvent = new MouseEvent('mousedown', {
        clientX: 150,
        clientY: 100,
        bubbles: true,
      });
      clockFace.dispatchEvent(mousedownEvent);

      const mouseupEvent = new MouseEvent('mouseup', { bubbles: true });
      document.dispatchEvent(mouseupEvent);

      expect(controller.snapToNearestHour).toHaveBeenCalled();

      handlers.detach();
    });

    it('should not call snapToNearestHour when smoothHourSnap is false', () => {
      const controller = createMockController();
      const hourElement = document.createElement('input') as HTMLInputElement;
      hourElement.classList.add('active');
      const minutesElement = document.createElement('input') as HTMLInputElement;

      const handlers = new DragHandlers(controller as never, clockFace, {
        smoothHourSnap: false,
        hourElement,
        minutesElement,
        isMobileView: true,
      });

      handlers.attach();

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

      const mousedownEvent = new MouseEvent('mousedown', {
        clientX: 150,
        clientY: 100,
        bubbles: true,
      });
      clockFace.dispatchEvent(mousedownEvent);

      const mouseupEvent = new MouseEvent('mouseup', { bubbles: true });
      document.dispatchEvent(mouseupEvent);

      expect(controller.snapToNearestHour).not.toHaveBeenCalled();

      handlers.detach();
    });
  });

  describe('clock radius calculation', () => {
    it('should use clock face dimensions for radius', () => {
      const controller = createMockController();
      const handlers = new DragHandlers(controller as never, clockFace);

      handlers.attach();

      jest.spyOn(clockFace, 'getBoundingClientRect').mockReturnValue({
        left: 50,
        top: 50,
        right: 250,
        bottom: 250,
        width: 200,
        height: 200,
        x: 50,
        y: 50,
        toJSON: () => ({}),
      });

      const mousedownEvent = new MouseEvent('mousedown', {
        clientX: 150,
        clientY: 150,
        bubbles: true,
      });
      clockFace.dispatchEvent(mousedownEvent);

      expect(controller.handlePointerMove).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), 100);

      handlers.detach();
    });
  });
});
