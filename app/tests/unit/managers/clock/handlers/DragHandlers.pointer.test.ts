import { DragHandlers, type DragHandlersConfig } from '@/managers/clock/handlers/DragHandlers';
import { dispatchPointer, installPointerEvents } from '../../../utils/pointer-helpers';

const FRAME_MS = 16;
const FACE_SIZE = 200;

const createMockController = (): {
  handlePointerMove: jest.Mock;
  handlePointerUp: jest.Mock;
  snapToNearestHour: jest.Mock;
} => ({
  handlePointerMove: jest.fn(),
  handlePointerUp: jest.fn(),
  snapToNearestHour: jest.fn(),
});

describe('DragHandlers on Pointer Events', () => {
  let clockFace: HTMLDivElement;
  let restorePointerEvents: () => void;
  let handlers: DragHandlers | null;

  const mount = (
    config: DragHandlersConfig = {},
  ): { controller: ReturnType<typeof createMockController>; handlers: DragHandlers } => {
    const controller = createMockController();
    const created = new DragHandlers(controller as never, clockFace, config);
    handlers = created;
    created.attach();
    return { controller, handlers: created };
  };

  beforeEach(() => {
    jest.useFakeTimers();
    restorePointerEvents = installPointerEvents();
    handlers = null;

    clockFace = document.createElement('div');
    Object.defineProperty(clockFace, 'offsetWidth', { value: FACE_SIZE, configurable: true });
    Object.defineProperty(clockFace, 'offsetHeight', { value: FACE_SIZE, configurable: true });
    jest.spyOn(clockFace, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      right: FACE_SIZE,
      bottom: FACE_SIZE,
      width: FACE_SIZE,
      height: FACE_SIZE,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
    document.body.appendChild(clockFace);
  });

  afterEach(() => {
    handlers?.detach();
    delete (document as { elementFromPoint?: unknown }).elementFromPoint;
    restorePointerEvents();
    jest.restoreAllMocks();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  it('attach() adds a pointerdown listener and no mousedown or touchstart listener', () => {
    const controller = createMockController();
    handlers = new DragHandlers(controller as never, clockFace);
    const addSpy = jest.spyOn(clockFace, 'addEventListener');

    handlers.attach();

    const names = addSpy.mock.calls.map(([name]) => name);
    expect(names).toContain('pointerdown');
    expect(names).not.toContain('mousedown');
    expect(names).not.toContain('touchstart');
  });

  it('a press at (150, 100) then a pointerup on the document drags once and captures the pointer', () => {
    const { controller } = mount();

    dispatchPointer(clockFace, 'pointerdown', { clientX: 150, clientY: 100, pointerId: 7 });

    expect(controller.handlePointerMove).toHaveBeenCalledTimes(1);
    expect(controller.handlePointerMove).toHaveBeenCalledWith({ x: 150, y: 100 }, { x: 100, y: 100 }, 100);
    expect(HTMLElement.prototype.setPointerCapture).toHaveBeenCalledWith(7);

    dispatchPointer(document, 'pointerup', { pointerId: 7 });

    expect(controller.handlePointerUp).toHaveBeenCalledTimes(1);
  });

  it('ignores a pointermove of another pointer and follows the one that started the drag', () => {
    const { controller } = mount();
    dispatchPointer(clockFace, 'pointerdown', { clientX: 150, clientY: 100, pointerId: 3 });

    dispatchPointer(document, 'pointermove', { clientX: 100, clientY: 150, pointerId: 4 });
    jest.advanceTimersByTime(FRAME_MS);
    expect(controller.handlePointerMove).toHaveBeenCalledTimes(1);

    dispatchPointer(document, 'pointermove', { clientX: 100, clientY: 150, pointerId: 3 });
    jest.advanceTimersByTime(FRAME_MS);
    expect(controller.handlePointerMove).toHaveBeenCalledTimes(2);
    expect(controller.handlePointerMove).toHaveBeenLastCalledWith(
      { x: 100, y: 150 },
      { x: 100, y: 100 },
      100,
    );
  });

  it('ignores a pointerup of another pointer', () => {
    const { controller } = mount();
    dispatchPointer(clockFace, 'pointerdown', { clientX: 150, clientY: 100, pointerId: 3 });

    dispatchPointer(document, 'pointerup', { pointerId: 4 });

    expect(controller.handlePointerUp).not.toHaveBeenCalled();
  });

  it.each(['pen', 'touch', 'mouse'])('drags with pointerType %s like the mouse', (pointerType) => {
    const { controller } = mount();

    dispatchPointer(clockFace, 'pointerdown', { clientX: 150, clientY: 100, pointerType });
    dispatchPointer(document, 'pointermove', { clientX: 100, clientY: 150, pointerType });
    jest.advanceTimersByTime(FRAME_MS);
    dispatchPointer(document, 'pointerup', { pointerType });

    expect(controller.handlePointerMove).toHaveBeenCalledTimes(2);
    expect(controller.handlePointerUp).toHaveBeenCalledTimes(1);
  });

  it('a right-button press starts no drag', () => {
    const { controller } = mount();

    dispatchPointer(clockFace, 'pointerdown', { clientX: 150, clientY: 100, button: 2 });
    dispatchPointer(document, 'pointerup', {});

    expect(controller.handlePointerMove).not.toHaveBeenCalled();
    expect(controller.handlePointerUp).not.toHaveBeenCalled();
  });

  it('a non-primary pointer starts no drag', () => {
    const { controller } = mount();

    dispatchPointer(clockFace, 'pointerdown', { clientX: 150, clientY: 100, isPrimary: false });
    dispatchPointer(document, 'pointerup', {});

    expect(controller.handlePointerMove).not.toHaveBeenCalled();
    expect(controller.handlePointerUp).not.toHaveBeenCalled();
  });

  it('pointercancel ends the drag without the auto-switch or the minute commit', () => {
    const hourElement = document.createElement('input');
    hourElement.classList.add('active');
    const minutesElement = document.createElement('input');
    const onMinuteCommit = jest.fn();
    const minutesClick = jest.spyOn(minutesElement, 'click');
    const { controller } = mount({ autoSwitchToMinutes: true, hourElement, minutesElement, onMinuteCommit });
    dispatchPointer(clockFace, 'pointerdown', { clientX: 150, clientY: 100, pointerId: 5 });

    dispatchPointer(document, 'pointercancel', { pointerId: 5 });

    expect(controller.handlePointerUp).toHaveBeenCalledTimes(1);
    expect(onMinuteCommit).not.toHaveBeenCalled();
    expect(minutesClick).not.toHaveBeenCalled();
  });

  it('pointerup after a valid pick on the hour face still auto-switches to the minutes input', () => {
    const hourElement = document.createElement('input');
    hourElement.classList.add('active');
    const minutesElement = document.createElement('input');
    document.body.append(hourElement, minutesElement);
    const minutesClick = jest.spyOn(minutesElement, 'click');
    mount({ autoSwitchToMinutes: true, hourElement, minutesElement });

    dispatchPointer(clockFace, 'pointerdown', { clientX: 150, clientY: 100 });
    dispatchPointer(document, 'pointerup', {});

    expect(minutesClick).toHaveBeenCalledTimes(1);
  });

  it('pointerup after a valid move on the last unit calls onMinuteCommit once', () => {
    const minutesElement = document.createElement('input');
    minutesElement.classList.add('active');
    const onMinuteCommit = jest.fn();
    mount({ minutesElement, onMinuteCommit });

    dispatchPointer(clockFace, 'pointerdown', { clientX: 150, clientY: 100 });
    dispatchPointer(document, 'pointerup', {});

    expect(onMinuteCommit).toHaveBeenCalledTimes(1);
  });

  describe('disabled tips', () => {
    const addDisabledTip = (): HTMLDivElement => {
      const tip = document.createElement('div');
      tip.classList.add('tp-ui-tips-disabled');
      clockFace.appendChild(tip);
      return tip;
    };

    it('a press on a disabled tip starts no drag', () => {
      const { controller } = mount();
      const tip = addDisabledTip();

      dispatchPointer(tip, 'pointerdown', { clientX: 150, clientY: 100 });
      dispatchPointer(document, 'pointerup', {});

      expect(controller.handlePointerMove).not.toHaveBeenCalled();
      expect(controller.handlePointerUp).not.toHaveBeenCalled();
    });

    it('a pointermove over a disabled tip (elementFromPoint) is ignored', () => {
      const { controller } = mount();
      const tip = addDisabledTip();
      dispatchPointer(clockFace, 'pointerdown', { clientX: 150, clientY: 100 });
      (document as { elementFromPoint?: unknown }).elementFromPoint = jest.fn(() => tip);

      dispatchPointer(document, 'pointermove', { clientX: 100, clientY: 150 });
      jest.advanceTimersByTime(FRAME_MS);

      expect(controller.handlePointerMove).toHaveBeenCalledTimes(1);
    });
  });

  it('detach() mid-drag removes the document listeners', () => {
    const { controller, handlers: attached } = mount();
    dispatchPointer(clockFace, 'pointerdown', { clientX: 150, clientY: 100 });

    attached.detach();
    dispatchPointer(document, 'pointermove', { clientX: 100, clientY: 150 });
    jest.advanceTimersByTime(FRAME_MS);
    dispatchPointer(document, 'pointerup', {});

    expect(controller.handlePointerMove).toHaveBeenCalledTimes(1);
    expect(controller.handlePointerUp).not.toHaveBeenCalled();
  });

  it('a blocked handler starts no drag', () => {
    const { controller, handlers: attached } = mount();
    attached.block();

    dispatchPointer(clockFace, 'pointerdown', { clientX: 150, clientY: 100 });

    expect(controller.handlePointerMove).not.toHaveBeenCalled();
  });
});
