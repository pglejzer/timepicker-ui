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
  });
});

