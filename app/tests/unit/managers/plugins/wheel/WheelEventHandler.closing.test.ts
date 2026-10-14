import TimepickerUI from '@/timepicker/TimepickerUI';
import { PluginRegistry } from '@/core/PluginRegistry';
import { WheelPlugin } from '@/plugins/wheel';
import { WheelRenderer } from '@/managers/plugins/wheel/WheelRenderer';
import { WheelDragHandler } from '@/managers/plugins/wheel/WheelDragHandler';
import { WheelScrollHandler } from '@/managers/plugins/wheel/WheelScrollHandler';
import { WheelEventHandler } from '@/managers/plugins/wheel/WheelEventHandler';
import { TIMINGS } from '@/constants/timings';
import {
  createWheelOptions,
  mockWheelItemHeight,
  selectedWheelValue,
  setupWheelTestContext,
  type WheelTestContext,
} from './wheel-test-helpers';

type WatchedEvent = 'wheel:scroll:start' | 'wheel:scroll:end' | 'select:hour' | 'update' | 'confirm';
type EventLog = Record<WatchedEvent, jest.Mock>;
type Subscribe = (event: WatchedEvent, handler: jest.Mock) => void;
type ClosePicker = (picker: TimepickerUI) => void;

const WATCHED: readonly WatchedEvent[] = [
  'wheel:scroll:start',
  'wheel:scroll:end',
  'select:hour',
  'update',
  'confirm',
];

const INPUT_VALUE = '10:30 AM';
const INLINE_INPUT_VALUE = '10:30';
const INLINE_CONTAINER_ID = 'wheel-closing-inline-host';
const SETTLE_MS = 1000;
const SNAP_SETTLE_MS = 500;
const AFTER_CLOSE_MS = 2000;
const CANCEL_AFTER_SCROLL_MS = 100;
const LATE_TIMER_WINDOW_MS = 1000;
const WHEEL_STEP_PX = 40;

const watchEvents = (subscribe: Subscribe): EventLog => {
  const log = {} as EventLog;
  WATCHED.forEach((event) => {
    log[event] = jest.fn();
    subscribe(event, log[event]);
  });
  return log;
};

const firedEvents = (log: EventLog): WatchedEvent[] =>
  WATCHED.filter((event) => log[event].mock.calls.length > 0);

const press = (target: Element, key: string): void => {
  target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
};

const pressEscape = (): void => {
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
};

const scrollWheel = (target: Element, deltaY: number): void => {
  target.dispatchEvent(new WheelEvent('wheel', { deltaY, bubbles: true, cancelable: true }));
};

const inModal = (root: ParentNode, selector: string): HTMLElement => {
  const element = root.querySelector<HTMLElement>(`.tp-ui-modal ${selector}`);
  if (!element) throw new Error(`${selector} is not rendered in the modal`);
  return element;
};

const CLOSERS: Array<[string, ClosePicker]> = [
  ['Escape', () => pressEscape()],
  ['close()', (picker) => picker.close()],
];

const INLINE_ACTIONS: Array<[string, string, 'confirm' | 'cancel']> = [
  ['OK', '.tp-ui-ok-btn', 'confirm'],
  ['Cancel', '.tp-ui-cancel-btn', 'cancel'],
];

const useWheelPickerLifecycle = (): void => {
  beforeAll(() => PluginRegistry.register(WheelPlugin));

  beforeEach(() => {
    jest.useFakeTimers();
    mockWheelItemHeight();
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.restoreAllMocks();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });
};

describe('wheel plugin while a modal picker is closing', () => {
  useWheelPickerLifecycle();

  const openWheel = (): { picker: TimepickerUI; input: HTMLInputElement; log: EventLog } => {
    const input = document.createElement('input');
    input.value = INPUT_VALUE;
    document.body.appendChild(input);
    const picker = new TimepickerUI(input, { ui: { mode: 'wheel' }, wheel: { commitOnScroll: true } });
    picker.create();
    picker.open();
    jest.advanceTimersByTime(SETTLE_MS);
    expect(selectedWheelValue('hours')).toBe('10');

    const log = watchEvents((event, handler) => picker.on(event, handler));
    return { picker, input, log };
  };

  const hours = (): HTMLElement => inModal(document, '.tp-ui-wheel-hours');

  it('should report an ArrowDown on the hours column and auto-commit it while the picker is open', () => {
    const { input, log } = openWheel();

    press(hours(), 'ArrowDown');

    expect(log['wheel:scroll:end']).toHaveBeenCalledWith(
      expect.objectContaining({ column: 'hours', value: '11' }),
    );
    expect(log['select:hour']).toHaveBeenCalledWith({ hour: '11' });

    jest.advanceTimersByTime(TIMINGS.COMMIT_ON_SCROLL_DELAY);

    expect(log.confirm).toHaveBeenCalledWith(
      expect.objectContaining({ hour: '11', minutes: '30', autoCommit: true }),
    );
    expect(input.value).toBe('11:30 AM');
  });

  it('should report a mouse-wheel step once its snap settles while the picker is open', () => {
    const { log } = openWheel();

    scrollWheel(hours(), WHEEL_STEP_PX);
    jest.advanceTimersByTime(SNAP_SETTLE_MS);

    expect(log['wheel:scroll:start']).toHaveBeenCalledWith({ column: 'hours' });
    expect(log['wheel:scroll:end']).toHaveBeenCalledWith(
      expect.objectContaining({ column: 'hours', value: '11' }),
    );
  });

  it('should ignore keyboard and mouse-wheel scrolling after Escape while the modal fades out', () => {
    const { input, log } = openWheel();

    pressEscape();
    press(hours(), 'ArrowDown');
    scrollWheel(hours(), WHEEL_STEP_PX);
    expect(document.querySelector('.tp-ui-modal')).not.toBeNull();

    jest.advanceTimersByTime(AFTER_CLOSE_MS);

    expect(firedEvents(log)).toEqual([]);
    expect(input.value).toBe(INPUT_VALUE);
    expect(document.querySelector('.tp-ui-modal')).toBeNull();
  });

  it.each(CLOSERS)(
    'should drop the auto-commit still pending when the picker closes through %s',
    (_name, closePicker) => {
      const { picker, input, log } = openWheel();
      press(hours(), 'ArrowDown');
      expect(log['wheel:scroll:end']).toHaveBeenCalledTimes(1);

      closePicker(picker);
      jest.advanceTimersByTime(TIMINGS.COMMIT_ON_SCROLL_DELAY + 100);

      expect(log.confirm).not.toHaveBeenCalled();
      expect(input.value).toBe(INPUT_VALUE);
    },
  );

  it('should not report the snap of a mouse-wheel step still animating when Escape closes the picker', () => {
    const { log } = openWheel();
    scrollWheel(hours(), WHEEL_STEP_PX);
    expect(log['wheel:scroll:start']).toHaveBeenCalledTimes(1);

    pressEscape();
    jest.advanceTimersByTime(SNAP_SETTLE_MS);

    expect(firedEvents(log)).toEqual(['wheel:scroll:start']);
    expect(log['wheel:scroll:start']).toHaveBeenCalledTimes(1);
  });
});

describe('wheel plugin in an inline picker after OK and Cancel', () => {
  useWheelPickerLifecycle();

  const mountInlineWheel = (): { picker: TimepickerUI; input: HTMLInputElement; container: HTMLElement } => {
    const input = document.createElement('input');
    input.value = INLINE_INPUT_VALUE;
    const container = document.createElement('div');
    container.id = INLINE_CONTAINER_ID;
    document.body.append(input, container);
    const picker = new TimepickerUI(input, {
      clock: { type: '24h' },
      ui: { mode: 'wheel', inline: { enabled: true, containerId: INLINE_CONTAINER_ID, showButtons: true } },
      wheel: { commitOnScroll: true },
    });
    picker.create();
    jest.advanceTimersByTime(SETTLE_MS);
    return { picker, input, container };
  };

  it.each(INLINE_ACTIONS)(
    'should still report hour scrolling and auto-commit it after %s',
    (_name, button, buttonEvent) => {
      const { picker, input, container } = mountInlineWheel();
      const onButton = jest.fn();
      picker.on(buttonEvent, onButton);

      inModal(container, button).click();
      jest.advanceTimersByTime(SETTLE_MS);

      expect(onButton).toHaveBeenCalledTimes(1);
      expect(selectedWheelValue('hours')).toBe('10');

      const log = watchEvents((event, handler) => picker.on(event, handler));
      press(inModal(container, '.tp-ui-wheel-hours'), 'ArrowDown');

      expect(log['wheel:scroll:end']).toHaveBeenCalledWith(
        expect.objectContaining({ column: 'hours', value: '11' }),
      );
      expect(input.value).toBe(INLINE_INPUT_VALUE);

      jest.advanceTimersByTime(TIMINGS.COMMIT_ON_SCROLL_DELAY);

      expect(log.confirm).toHaveBeenCalledTimes(1);
      expect(log.confirm).toHaveBeenCalledWith(
        expect.objectContaining({ hour: '11', minutes: '30', autoCommit: true }),
      );
      expect(input.value).toBe('11:30');
    },
  );
});

interface InlineCommitHarness {
  readonly input: HTMLInputElement;
  readonly container: HTMLElement;
  readonly order: string[];
  readonly onConfirm: jest.Mock;
}

describe('wheel plugin in an inline picker when Cancel lands inside the auto-commit delay', () => {
  useWheelPickerLifecycle();

  const mountInlineWheel = (): InlineCommitHarness => {
    const input = document.createElement('input');
    input.value = INPUT_VALUE;
    const container = document.createElement('div');
    container.id = INLINE_CONTAINER_ID;
    document.body.append(input, container);
    const picker = new TimepickerUI(input, {
      ui: { mode: 'wheel', inline: { enabled: true, containerId: INLINE_CONTAINER_ID, showButtons: true } },
      wheel: { commitOnScroll: true },
    });
    picker.create();
    jest.advanceTimersByTime(SETTLE_MS);
    expect(selectedWheelValue('hours')).toBe('10');

    const order: string[] = [];
    const onConfirm = jest.fn();
    picker.on('cancel', () => order.push('cancel'));
    picker.on('confirm', (data) => {
      order.push('confirm');
      onConfirm(data);
    });
    return { input, container, order, onConfirm };
  };

  it('should auto-commit the scrolled hour once the delay ends when nothing cancels it', () => {
    const { input, container, order, onConfirm } = mountInlineWheel();

    press(inModal(container, '.tp-ui-wheel-hours'), 'ArrowDown');
    jest.advanceTimersByTime(TIMINGS.COMMIT_ON_SCROLL_DELAY);

    expect(order).toEqual(['confirm']);
    expect(onConfirm).toHaveBeenCalledWith(
      expect.objectContaining({ hour: '11', minutes: '30', type: 'AM', autoCommit: true }),
    );
    expect(input.value).toBe('11:30 AM');
  });

  it('should drop the pending auto-commit and keep the input when Cancel lands inside the delay', () => {
    const { input, container, order, onConfirm } = mountInlineWheel();

    press(inModal(container, '.tp-ui-wheel-hours'), 'ArrowDown');
    jest.advanceTimersByTime(CANCEL_AFTER_SCROLL_MS);
    inModal(container, '.tp-ui-cancel-btn').click();
    jest.advanceTimersByTime(LATE_TIMER_WINDOW_MS);

    expect(order).toEqual(['cancel']);
    expect(onConfirm).not.toHaveBeenCalledWith(expect.objectContaining({ autoCommit: true }));
    expect(input.value).toBe(INPUT_VALUE);
    expect(selectedWheelValue('hours')).toBe('10');
  });
});

describe('WheelEventHandler built directly', () => {
  let ctx: WheelTestContext;
  let renderer: WheelRenderer;
  let dragHandler: WheelDragHandler;
  let scrollHandler: WheelScrollHandler;
  let eventHandler: WheelEventHandler;
  let log: EventLog;

  const hours = (): HTMLDivElement => {
    const column = renderer.getColumnElement('hours');
    if (!column) throw new Error('the hours column is not rendered');
    return column;
  };

  const pickerInputValue = (): string | undefined => ctx.element.querySelector('input')?.value;

  beforeEach(() => {
    jest.useFakeTimers();
    mockWheelItemHeight();
    ctx = setupWheelTestContext('12h', 'wheel-closed-core');
    ctx.core.setOptions(createWheelOptions({ clock: { type: '12h' }, wheel: { commitOnScroll: true } }));

    renderer = new WheelRenderer(ctx.core);
    dragHandler = new WheelDragHandler(renderer);
    scrollHandler = new WheelScrollHandler(renderer, ctx.core);
    scrollHandler.setDragHandler(dragHandler);
    eventHandler = new WheelEventHandler(ctx.emitter, scrollHandler, ctx.core);

    renderer.init();
    dragHandler.init();
    scrollHandler.init();
    eventHandler.init();

    log = watchEvents((event, handler) => ctx.emitter.on(event, handler));
  });

  afterEach(() => {
    eventHandler.destroy();
    scrollHandler.destroy();
    dragHandler.destroy();
    renderer.destroy();
    document.body.innerHTML = '';
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  describe('on a core that is not open', () => {
    it('should emit nothing for an ArrowDown, and emit again once the core is open', () => {
      ctx.core.setIsOpen(false);

      press(hours(), 'ArrowDown');
      jest.advanceTimersByTime(TIMINGS.COMMIT_ON_SCROLL_DELAY + 100);

      expect(firedEvents(log)).toEqual([]);
      expect(pickerInputValue()).toBe('');

      ctx.core.setIsOpen(true);
      press(hours(), 'ArrowDown');

      expect(log['wheel:scroll:end']).toHaveBeenCalledTimes(1);
    });

    it('should report neither the start nor the snap of a mouse-wheel step, and report both once the core is open', () => {
      ctx.core.setIsOpen(false);

      scrollWheel(hours(), WHEEL_STEP_PX);
      jest.advanceTimersByTime(SNAP_SETTLE_MS + TIMINGS.COMMIT_ON_SCROLL_DELAY);

      expect(firedEvents(log)).toEqual([]);

      ctx.core.setIsOpen(true);
      scrollWheel(hours(), WHEEL_STEP_PX);
      jest.advanceTimersByTime(SNAP_SETTLE_MS);

      expect(log['wheel:scroll:start']).toHaveBeenCalledTimes(1);
      expect(log['wheel:scroll:end']).toHaveBeenCalledTimes(1);
    });

    it('should not report a committed scrollToValue, the path a disabled-value skip takes', () => {
      ctx.core.setIsOpen(false);

      scrollHandler.scrollToValue('hours', '05', true);
      jest.advanceTimersByTime(TIMINGS.COMMIT_ON_SCROLL_DELAY + 100);

      expect(firedEvents(log)).toEqual([]);
      expect(pickerInputValue()).toBe('');
    });

    it('should drop a pending auto-commit when the core closes before the delay ends', () => {
      press(hours(), 'ArrowDown');
      expect(log['wheel:scroll:end']).toHaveBeenCalledTimes(1);

      ctx.core.setIsOpen(false);
      jest.advanceTimersByTime(TIMINGS.COMMIT_ON_SCROLL_DELAY + 100);

      expect(log.confirm).not.toHaveBeenCalled();
      expect(pickerInputValue()).toBe('');
    });
  });

  describe('when init() runs again with an auto-commit pending', () => {
    it('should confirm the scrolled hour when nothing re-initialises the handler', () => {
      press(hours(), 'ArrowDown');
      jest.advanceTimersByTime(TIMINGS.COMMIT_ON_SCROLL_DELAY);

      expect(log.confirm).toHaveBeenCalledWith(expect.objectContaining({ hour: '02', autoCommit: true }));
    });

    it('should drop the pending auto-commit on an open core', () => {
      press(hours(), 'ArrowDown');
      expect(log['wheel:scroll:end']).toHaveBeenCalledTimes(1);

      eventHandler.init();
      jest.advanceTimersByTime(LATE_TIMER_WINDOW_MS);

      expect(ctx.core.isOpen).toBe(true);
      expect(log.confirm).not.toHaveBeenCalled();
      expect(pickerInputValue()).toBe('');
    });
  });
});
