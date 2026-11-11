import { DragHandlers, type DragHandlersConfig } from '@/managers/clock/handlers/DragHandlers';
import { dispatchPointer, installPointerEvents } from '../../../utils/pointer-helpers';

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

const createInput = (options: { active?: boolean; readOnly?: boolean } = {}): HTMLInputElement => {
  const input = document.createElement('input');
  if (options.active) input.classList.add('active');
  input.readOnly = options.readOnly === true;
  document.body.appendChild(input);
  return input;
};

describe('DragHandlers focus after the auto-switch', () => {
  let clockFace: HTMLDivElement;
  let handlers: DragHandlers | null;
  let restorePointerEvents: (() => void) | null;

  const mount = (config: DragHandlersConfig): void => {
    handlers = new DragHandlers(createMockController() as never, clockFace, config);
    handlers.attach();
  };

  const pointerDrag = (pointerType: string): void => {
    dispatchPointer(clockFace, 'pointerdown', { clientX: 150, clientY: 100, pointerType });
    dispatchPointer(document, 'pointerup', { pointerType });
  };

  const touchDrag = (): void => {
    clockFace.dispatchEvent(
      new TouchEvent('touchstart', {
        touches: [{ clientX: 150, clientY: 100, identifier: 0 } as Touch],
        bubbles: true,
        cancelable: true,
      }),
    );
    document.dispatchEvent(new TouchEvent('touchend', { bubbles: true, cancelable: true }));
  };

  const mouseDrag = (): void => {
    clockFace.dispatchEvent(
      new MouseEvent('mousedown', { clientX: 150, clientY: 100, bubbles: true, cancelable: true }),
    );
    document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
  };

  const useFallbackEvents = (): void => {
    restorePointerEvents?.();
    restorePointerEvents = null;
    const scope = globalThis as unknown as { PointerEvent?: unknown };
    const original = scope.PointerEvent;
    scope.PointerEvent = undefined;
    restorePointerEvents = () => {
      scope.PointerEvent = original;
    };
  };

  beforeEach(() => {
    restorePointerEvents = installPointerEvents();
    handlers = null;

    clockFace = document.createElement('div');
    clockFace.tabIndex = 0;
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
    restorePointerEvents?.();
    jest.restoreAllMocks();
    document.body.innerHTML = '';
  });

  describe('hour to minutes', () => {
    it.each(['touch', 'pen'])(
      'pointerType %s with an editable minutes input clicks it but focuses the clock face',
      (pointerType) => {
        const hourElement = createInput({ active: true });
        const minutesElement = createInput();
        const minutesClick = jest.spyOn(minutesElement, 'click');
        mount({ autoSwitchToMinutes: true, hourElement, minutesElement });

        pointerDrag(pointerType);

        expect(minutesClick).toHaveBeenCalledTimes(1);
        expect(document.activeElement).toBe(clockFace);
      },
    );

    it('pointerType mouse focuses the minutes input', () => {
      const hourElement = createInput({ active: true });
      const minutesElement = createInput();
      mount({ autoSwitchToMinutes: true, hourElement, minutesElement });

      pointerDrag('mouse');

      expect(document.activeElement).toBe(minutesElement);
    });

    it('touch with a readonly minutes input focuses the minutes input', () => {
      const hourElement = createInput({ active: true });
      const minutesElement = createInput({ readOnly: true });
      mount({ autoSwitchToMinutes: true, hourElement, minutesElement });

      pointerDrag('touch');

      expect(document.activeElement).toBe(minutesElement);
    });

    it('the hour input is blurred after the switch', () => {
      const hourElement = createInput({ active: true });
      const minutesElement = createInput();
      hourElement.focus();
      mount({ autoSwitchToMinutes: true, hourElement, minutesElement });

      pointerDrag('touch');

      expect(document.activeElement).not.toBe(hourElement);
    });
  });

  describe('minutes to seconds', () => {
    it('touch with an editable seconds input focuses the clock face', () => {
      const minutesElement = createInput({ active: true });
      const secondsElement = createInput();
      const secondsClick = jest.spyOn(secondsElement, 'click');
      mount({ minutesElement, secondsElement });

      pointerDrag('touch');

      expect(secondsClick).toHaveBeenCalledTimes(1);
      expect(document.activeElement).toBe(clockFace);
    });

    it('mouse focuses the seconds input', () => {
      const minutesElement = createInput({ active: true });
      const secondsElement = createInput();
      mount({ minutesElement, secondsElement });

      pointerDrag('mouse');

      expect(document.activeElement).toBe(secondsElement);
    });
  });

  describe('without PointerEvent', () => {
    beforeEach(() => {
      useFallbackEvents();
    });

    it('a touchstart drag with an editable minutes input focuses the clock face', () => {
      const hourElement = createInput({ active: true });
      const minutesElement = createInput();
      mount({ autoSwitchToMinutes: true, hourElement, minutesElement });

      touchDrag();

      expect(document.activeElement).toBe(clockFace);
    });

    it('a touchstart drag with a readonly minutes input focuses the minutes input', () => {
      const hourElement = createInput({ active: true });
      const minutesElement = createInput({ readOnly: true });
      mount({ autoSwitchToMinutes: true, hourElement, minutesElement });

      touchDrag();

      expect(document.activeElement).toBe(minutesElement);
    });

    it('a mousedown drag focuses the minutes input', () => {
      const hourElement = createInput({ active: true });
      const minutesElement = createInput();
      mount({ autoSwitchToMinutes: true, hourElement, minutesElement });

      mouseDrag();

      expect(document.activeElement).toBe(minutesElement);
    });

    it('onMinuteCommit receives true after a touchstart drag', () => {
      const minutesElement = createInput({ active: true });
      const onMinuteCommit = jest.fn();
      mount({ minutesElement, onMinuteCommit });

      touchDrag();

      expect(onMinuteCommit).toHaveBeenCalledTimes(1);
      expect(onMinuteCommit).toHaveBeenCalledWith(true);
    });

    it('onMinuteCommit receives false after a mousedown drag', () => {
      const minutesElement = createInput({ active: true });
      const onMinuteCommit = jest.fn();
      mount({ minutesElement, onMinuteCommit });

      mouseDrag();

      expect(onMinuteCommit).toHaveBeenCalledWith(false);
    });
  });

  describe('onMinuteCommit flag', () => {
    it.each([
      ['touch', true],
      ['pen', true],
      ['mouse', false],
    ])('pointerType %s calls onMinuteCommit with %s', (pointerType, expected) => {
      const minutesElement = createInput({ active: true });
      const onMinuteCommit = jest.fn();
      mount({ minutesElement, onMinuteCommit });

      pointerDrag(pointerType);

      expect(onMinuteCommit).toHaveBeenCalledTimes(1);
      expect(onMinuteCommit).toHaveBeenCalledWith(expected);
    });

    it('does not reuse the touch flag from a previous drag', () => {
      const minutesElement = createInput({ active: true });
      const onMinuteCommit = jest.fn();
      mount({ minutesElement, onMinuteCommit });

      pointerDrag('touch');
      pointerDrag('mouse');

      expect(onMinuteCommit).toHaveBeenNthCalledWith(1, true);
      expect(onMinuteCommit).toHaveBeenNthCalledWith(2, false);
    });
  });
});
