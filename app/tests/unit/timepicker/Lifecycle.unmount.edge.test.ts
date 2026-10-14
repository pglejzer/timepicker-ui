import TimepickerUI from '@/timepicker/TimepickerUI';
import { TIMINGS } from '@/constants/timings';
import type { TimepickerOptions } from '@/types/options';

const FACE_SIZE = 200;
const RADIUS = FACE_SIZE / 2;
const FRAME_MS = 16;
const EXIT_MS = TIMINGS.MODAL_EXIT;
const CLOSE_DELAY_MS = 200;
const INLINE_CONTAINER_ID = 'closing-window-inline-host';
const SELECTION_EVENTS = [
  'update',
  'select:hour',
  'select:minute',
  'select:second',
  'select:am',
  'select:pm',
] as const;

type Point = Readonly<{ clientX: number; clientY: number }>;

type Internals = {
  lifecycle: { closeModal: () => void };
  managers: { clock: { destroyClockSystem: () => void } };
};

interface Mounted {
  readonly picker: TimepickerUI;
  readonly input: HTMLInputElement;
  readonly events: Readonly<Record<'show' | 'open' | 'confirm' | 'cancel', jest.Mock>>;
  readonly callbacks: Readonly<Record<'onConfirm' | 'onCancel' | 'onUpdate', jest.Mock>>;
}

interface Pointer {
  readonly name: string;
  readonly down: (face: HTMLElement, at: Point) => void;
  readonly move: (at: Point) => void;
  readonly up: () => void;
}

const touchAt = (type: string, at: Point): TouchEvent =>
  new TouchEvent(type, {
    touches: [{ ...at, identifier: 0 } as unknown as Touch],
    bubbles: true,
    cancelable: true,
  });

const MOUSE: Pointer = {
  name: 'mouse',
  down: (face, at) => {
    face.dispatchEvent(new MouseEvent('mousedown', { ...at, bubbles: true, cancelable: true }));
  },
  move: (at) => {
    document.dispatchEvent(new MouseEvent('mousemove', { ...at, bubbles: true, cancelable: true }));
  },
  up: () => {
    document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
  },
};

const TOUCH: Pointer = {
  name: 'touch',
  down: (face, at) => {
    face.dispatchEvent(touchAt('touchstart', at));
  },
  move: (at) => {
    document.dispatchEvent(touchAt('touchmove', at));
  },
  up: () => {
    document.dispatchEvent(new TouchEvent('touchend', { bubbles: true }));
  },
};

const pointAt = (degrees: number): Point => ({
  clientX: RADIUS + RADIUS * Math.sin((degrees * Math.PI) / 180),
  clientY: RADIUS - RADIUS * Math.cos((degrees * Math.PI) / 180),
});

const modals = (root: ParentNode = document): NodeListOf<HTMLElement> =>
  root.querySelectorAll<HTMLElement>('.tp-ui-modal');

const part = <T extends HTMLElement = HTMLElement>(selector: string): T => {
  const element = document.querySelector<T>(`.tp-ui-modal ${selector}`);
  if (!element) throw new Error(`${selector} is not rendered in the modal`);
  return element;
};

const press = (target: EventTarget, key: string, repeat = false): void => {
  target.dispatchEvent(new KeyboardEvent('keydown', { key, repeat, bubbles: true, cancelable: true }));
};

const pressEscape = (): void => press(document, 'Escape');
const clickOk = (): void => part('.tp-ui-ok-btn').click();
const clickCancel = (): void => part('.tp-ui-cancel-btn').click();
const raiseHour = (): void => press(part('.tp-ui-hour'), 'ArrowUp');

const readyFace = (): HTMLElement => {
  const face = part('.tp-ui-clock-face');
  Object.defineProperty(face, 'offsetWidth', { value: FACE_SIZE, configurable: true });
  Object.defineProperty(face, 'offsetHeight', { value: FACE_SIZE, configurable: true });
  jest.advanceTimersByTime(TIMINGS.TIPS_ANIMATION);
  return face;
};

const internals = (picker: TimepickerUI): Internals => picker as unknown as Internals;

const countCalls = (picker: TimepickerUI, names: readonly string[]): (() => Record<string, number>) => {
  const listeners = names.map((name) => {
    const listener = jest.fn();
    picker.on(name, listener);
    return [name, listener] as const;
  });
  return () => Object.fromEntries(listeners.map(([name, listener]) => [name, listener.mock.calls.length]));
};

const noCalls = (names: readonly string[]): Record<string, number> =>
  Object.fromEntries(names.map((name) => [name, 0]));

const createPicker = (value: string, options: TimepickerOptions = {}): Mounted => {
  const input = document.createElement('input');
  input.value = value;
  document.body.appendChild(input);

  const callbacks = { onConfirm: jest.fn(), onCancel: jest.fn(), onUpdate: jest.fn() };
  const picker = new TimepickerUI(input, {
    ...options,
    clock: { type: '12h', ...options.clock },
    ui: { animation: true, ...options.ui },
    callbacks,
  });
  const events = { show: jest.fn(), open: jest.fn(), confirm: jest.fn(), cancel: jest.fn() };
  (Object.keys(events) as Array<keyof typeof events>).forEach((name) => picker.on(name, events[name]));

  picker.create();
  return { picker, input, events, callbacks };
};

const openPicker = (value: string, options?: TimepickerOptions): Mounted => {
  const mounted = createPicker(value, options);
  mounted.picker.open();
  expect(modals()).toHaveLength(1);
  return mounted;
};

describe('a close is final from its first moment', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.restoreAllMocks();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  describe('repeated close input', () => {
    it('should confirm once on a double click on OK (S130)', () => {
      const { input, events, callbacks } = openPicker('10:30 AM');
      raiseHour();

      clickOk();
      clickOk();

      expect(events.confirm).toHaveBeenCalledTimes(1);
      expect(callbacks.onConfirm).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(EXIT_MS);

      expect(events.confirm).toHaveBeenCalledTimes(1);
      expect(input.value).toBe('11:30 AM');
      expect(modals()).toHaveLength(0);
    });

    it('should confirm once while Enter is held on OK', () => {
      const { events, callbacks } = openPicker('10:30 AM');
      const ok = part('.tp-ui-ok-btn');

      press(ok, 'Enter');
      press(ok, 'Enter', true);

      expect(events.confirm).toHaveBeenCalledTimes(1);
      expect(callbacks.onConfirm).toHaveBeenCalledTimes(1);
    });

    it('should cancel once on a double click on Cancel', () => {
      const { events, callbacks } = openPicker('10:30 AM');

      clickCancel();
      clickCancel();

      expect(events.cancel).toHaveBeenCalledTimes(1);
      expect(callbacks.onCancel).toHaveBeenCalledTimes(1);
    });

    it('should cancel once on two Escapes 100 ms apart', () => {
      const { events, callbacks } = openPicker('10:30 AM');

      pressEscape();
      jest.advanceTimersByTime(100);
      pressEscape();

      expect(events.cancel).toHaveBeenCalledTimes(1);
      expect(callbacks.onCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe('input that reaches the closing picker', () => {
    it('should ignore a click on PM after OK (12h)', () => {
      const { picker, input, events, callbacks } = openPicker('10:30 AM');
      clickOk();
      expect(events.confirm).toHaveBeenCalledTimes(1);
      const lateCalls = countCalls(picker, ['select:pm', 'update']);
      callbacks.onUpdate.mockClear();
      const pm = part('.tp-ui-pm');

      pm.click();

      expect(lateCalls()).toEqual({ 'select:pm': 0, update: 0 });
      expect(callbacks.onUpdate).not.toHaveBeenCalled();
      expect(pm).toHaveAttribute('aria-pressed', 'false');

      jest.advanceTimersByTime(EXIT_MS);

      expect(input.value).toBe('10:30 AM');
    });

    it('should not reopen on Enter in the input until the closing modal is removed', () => {
      const { input, events } = openPicker('10:30 AM');
      pressEscape();

      press(input, 'Enter');
      jest.advanceTimersByTime(EXIT_MS - 1);
      press(input, 'Enter');

      expect(events.show).not.toHaveBeenCalled();
      expect(modals()).toHaveLength(1);

      jest.advanceTimersByTime(1);
      expect(modals()).toHaveLength(0);

      press(input, 'Enter');

      expect(events.show).toHaveBeenCalledTimes(1);
      expect(events.open).toHaveBeenCalledTimes(2);
      expect(modals()).toHaveLength(1);
    });
  });

  describe('destroy() while the close runs', () => {
    const DELAYED: TimepickerOptions = { behavior: { delayHandler: CLOSE_DELAY_MS } };

    it('should start the close synchronously with the default delay', () => {
      const { picker } = openPicker('10:30 AM');
      const closeModal = jest.spyOn(internals(picker).lifecycle, 'closeModal');

      clickCancel();

      expect(closeModal).toHaveBeenCalledTimes(1);
    });

    it('should run a delayed close once after delayHandler when nothing destroys the picker', () => {
      const { picker } = openPicker('10:30 AM', DELAYED);
      const closeModal = jest.spyOn(internals(picker).lifecycle, 'closeModal');

      clickCancel();
      jest.advanceTimersByTime(CLOSE_DELAY_MS - 1);
      expect(closeModal).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1);

      expect(closeModal).toHaveBeenCalledTimes(1);
    });

    it('should cancel a delayed close so it never runs', () => {
      const { picker } = openPicker('10:30 AM', DELAYED);
      const closeModal = jest.spyOn(internals(picker).lifecycle, 'closeModal');

      clickCancel();
      picker.destroy();

      expect(modals()).toHaveLength(0);
      expect(() => jest.advanceTimersByTime(CLOSE_DELAY_MS + EXIT_MS)).not.toThrow();
      expect(closeModal).not.toHaveBeenCalled();
      expect(modals()).toHaveLength(0);
    });

    it('should cancel the exit step so the input is not focused after destroy', () => {
      const { picker, input } = openPicker('10:30 AM', { behavior: { focusInputAfterClose: true } });

      clickCancel();
      expect(modals()).toHaveLength(1);
      picker.destroy();

      expect(modals()).toHaveLength(0);
      expect(() => jest.advanceTimersByTime(EXIT_MS)).not.toThrow();
      expect(document.activeElement).not.toBe(input);
      expect(input).not.toHaveClass('disabled');
    });

    it('should not run the close(true) callback of a delayed close', () => {
      const { picker, events } = openPicker('10:30 AM', DELAYED);
      const done = jest.fn();

      picker.close(true, done);
      picker.destroy();
      jest.advanceTimersByTime(CLOSE_DELAY_MS + EXIT_MS);

      expect(events.confirm).toHaveBeenCalledTimes(1);
      expect(done).not.toHaveBeenCalled();
      expect(modals()).toHaveLength(0);
    });
  });

  describe('getValue() while the close runs', () => {
    it('should report the input value, not the discarded change, after Cancel', () => {
      const { picker } = openPicker('10:30 AM');
      raiseHour();
      expect(picker.getValue().time).toBe('11:30 AM');

      clickCancel();

      expect(modals()).toHaveLength(1);
      expect(picker.getValue()).toMatchObject({ hour: '10', minutes: '30', type: 'AM', time: '10:30 AM' });
    });

    it('should report the confirmed value after OK', () => {
      const { picker, events } = openPicker('10:30 AM');
      raiseHour();

      clickOk();

      expect(modals()).toHaveLength(1);
      expect(picker.getValue()).toMatchObject({ ...events.confirm.mock.calls[0][0], time: '11:30 AM' });
    });
  });

  describe('close(true)', () => {
    it('should confirm once and tear the clock down before any timer runs', () => {
      const { picker, input, events, callbacks } = openPicker('10:30 AM');
      raiseHour();
      const destroyClockSystem = jest.spyOn(internals(picker).managers.clock, 'destroyClockSystem');

      picker.close(true);

      expect(destroyClockSystem).toHaveBeenCalledTimes(1);
      expect(events.confirm).toHaveBeenCalledTimes(1);
      expect(callbacks.onConfirm).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(EXIT_MS);

      expect(destroyClockSystem).toHaveBeenCalledTimes(1);
      expect(events.confirm).toHaveBeenCalledTimes(1);
      expect(input.value).toBe('11:30 AM');
    });
  });

  describe('a drag still held when the picker closes (S129)', () => {
    const CLOSERS: ReadonlyArray<[string, () => void]> = [
      ['Escape', pressEscape],
      ['a Cancel click', clickCancel],
    ];

    beforeEach(() => {
      Object.defineProperty(document, 'elementFromPoint', { value: () => null, configurable: true });
    });

    afterEach(() => {
      delete (document as { elementFromPoint?: unknown }).elementFromPoint;
    });

    describe.each([MOUSE, TOUCH])('with a $name pointer', (pointer) => {
      it.each(CLOSERS)('should drop the rest of the drag after %s', (_closer, close) => {
        const { picker, callbacks } = openPicker('10:00 AM');
        const hour = part<HTMLInputElement>('.tp-ui-hour');
        pointer.down(readyFace(), pointAt(90));
        expect(hour.value).toBe('03');

        close();
        const lateCalls = countCalls(picker, SELECTION_EVENTS);
        callbacks.onUpdate.mockClear();
        expect(modals()).toHaveLength(1);

        pointer.move(pointAt(180));
        jest.advanceTimersByTime(FRAME_MS);
        pointer.up();

        expect(lateCalls()).toEqual(noCalls(SELECTION_EVENTS));
        expect(callbacks.onUpdate).not.toHaveBeenCalled();
        expect(hour.value).toBe('03');
        expect(modals()).toHaveLength(1);
      });
    });
  });

  describe('the clock face of a closed picker', () => {
    it('should let only the new face drive the hour after the picker reopens', () => {
      const { picker } = openPicker('10:00 AM');
      const oldFace = readyFace();
      clickCancel();
      jest.advanceTimersByTime(EXIT_MS);
      expect(modals()).toHaveLength(0);

      picker.open();
      const newFace = readyFace();
      const onUpdate = jest.fn();
      picker.on('update', onUpdate);
      expect(newFace).not.toBe(oldFace);

      MOUSE.down(oldFace, pointAt(180));
      MOUSE.up();

      expect(onUpdate).not.toHaveBeenCalled();

      MOUSE.down(newFace, pointAt(90));

      expect(onUpdate).toHaveBeenCalledTimes(1);
      expect(onUpdate).toHaveBeenCalledWith(expect.objectContaining({ hour: '03' }));
      MOUSE.up();
    });

    it('should keep the 12 hour tips on the closing face until the modal is removed', () => {
      openPicker('10:00 AM', { ui: { animation: true } });
      const modal = modals()[0];
      const tipCount = (): number => modal.querySelectorAll('.tp-ui-value-tips').length;
      expect(tipCount()).toBe(12);

      clickCancel();

      expect(tipCount()).toBe(12);

      jest.advanceTimersByTime(EXIT_MS - 1);

      expect(modal.isConnected).toBe(true);
      expect(tipCount()).toBe(12);

      jest.advanceTimersByTime(1);

      expect(modal.isConnected).toBe(false);
    });
  });

  describe('an inline picker', () => {
    const mountInline = (): Mounted & { readonly container: HTMLElement } => {
      const container = document.createElement('div');
      container.id = INLINE_CONTAINER_ID;
      document.body.appendChild(container);
      const mounted = createPicker('10:30', {
        clock: { type: '24h' },
        ui: { inline: { enabled: true, containerId: INLINE_CONTAINER_ID, showButtons: true } },
      });
      expect(modals(container)).toHaveLength(1);
      return { ...mounted, container };
    };

    it('should mount no second modal on update() while close() runs, and open again afterwards', () => {
      const { picker, container, events } = mountInline();

      picker.close();
      picker.update({ options: { labels: { ok: 'X' } } });
      expect(modals()).toHaveLength(1);
      picker.update({ options: { labels: { ok: 'X' } }, create: true });
      expect(modals()).toHaveLength(1);

      jest.advanceTimersByTime(EXIT_MS);

      expect(modals(container)).toHaveLength(0);
      expect(events.open).toHaveBeenCalledTimes(1);

      picker.open();

      expect(modals(container)).toHaveLength(1);
      expect(part('.tp-ui-ok-btn').textContent).toBe('X');
      expect(events.open).toHaveBeenCalledTimes(2);
    });

    it('should confirm on each of two back-to-back OK clicks (S122)', () => {
      const { container, events, callbacks } = mountInline();

      clickOk();
      clickOk();

      expect(events.confirm).toHaveBeenCalledTimes(2);
      expect(callbacks.onConfirm).toHaveBeenCalledTimes(2);

      jest.advanceTimersByTime(EXIT_MS);

      expect(modals(container)).toHaveLength(1);
    });

    it('should cancel on every Cancel click (S122)', () => {
      const { container, events, callbacks } = mountInline();

      [1, 2, 3].forEach((count) => {
        clickCancel();

        expect(events.cancel).toHaveBeenCalledTimes(count);
        expect(callbacks.onCancel).toHaveBeenCalledTimes(count);
        expect(modals(container)).toHaveLength(1);
      });

      jest.advanceTimersByTime(EXIT_MS);

      expect(modals(container)).toHaveLength(1);
      expect(events.open).toHaveBeenCalledTimes(1);
    });
  });
});
