import { WheelRenderer } from '@/managers/plugins/wheel/WheelRenderer';
import { WheelDragHandler } from '@/managers/plugins/wheel/WheelDragHandler';
import { WheelScrollHandler } from '@/managers/plugins/wheel/WheelScrollHandler';
import { WheelEventHandler } from '@/managers/plugins/wheel/WheelEventHandler';
import { CoreState } from '@/timepicker/CoreState';
import { EventEmitter, type TimepickerEventMap } from '@/utils/EventEmitter';
import { getWheelTemplate } from '@/utils/template/wheel';
import { TIMINGS } from '@/constants/timings';
import { createWheelOptions, WHEEL_ITEM_HEIGHT_PX } from './wheel-test-helpers';

const INSTANCE_ID = 'wheel-seconds-test';

const RECT_STUB: DOMRect = {
  height: WHEEL_ITEM_HEIGHT_PX,
  width: 64,
  x: 0,
  y: 0,
  top: 0,
  left: 0,
  bottom: WHEEL_ITEM_HEIGHT_PX,
  right: 64,
  toJSON: () => ({}),
};

interface WheelHarness {
  readonly element: HTMLDivElement;
  readonly modal: HTMLDivElement;
  readonly core: CoreState;
  readonly emitter: EventEmitter<TimepickerEventMap>;
  readonly scrollHandler: WheelScrollHandler;
  readonly destroy: () => void;
}

interface MountOptions {
  readonly showSeconds: boolean;
  readonly disabledSeconds?: string[];
}

function buildModal(showSeconds: boolean): HTMLDivElement {
  const modal = document.createElement('div');
  modal.setAttribute('data-owner-id', INSTANCE_ID);
  const secondsField = showSeconds ? '<input class="tp-ui-seconds" value="00">' : '';
  const wheel = showSeconds
    ? getWheelTemplate('24h', 1, false, INSTANCE_ID, {}, { show: true, increment: 1 })
    : getWheelTemplate('24h', 1, false, INSTANCE_ID, {});
  modal.innerHTML =
    `<input class="tp-ui-hour" value="10"><input class="tp-ui-minutes" value="30">${secondsField}` +
    `<div class="timepicker-announcer" aria-live="polite"></div>${wheel}`;
  return modal;
}

function mount({ showSeconds, disabledSeconds }: MountOptions): WheelHarness {
  const element = document.createElement('div');
  element.innerHTML = '<input type="text" />';
  document.body.appendChild(element);

  const options = createWheelOptions({
    clock: { type: '24h', showSeconds },
    labels: { second: 'Sekunda' },
    wheel: { commitOnScroll: true },
  });
  const core = new CoreState(element, options, INSTANCE_ID);
  core.setIsOpen(true);
  if (disabledSeconds) {
    core.setDisabledTime({ value: { seconds: disabledSeconds } });
  }

  const modal = buildModal(showSeconds);
  document.body.appendChild(modal);
  modal.querySelectorAll<HTMLDivElement>('.tp-ui-wheel-item').forEach((item) => {
    jest.spyOn(item, 'getBoundingClientRect').mockReturnValue(RECT_STUB);
  });

  const emitter = new EventEmitter<TimepickerEventMap>();
  const renderer = new WheelRenderer(core);
  const dragHandler = new WheelDragHandler(renderer);
  const scrollHandler = new WheelScrollHandler(renderer, core);
  scrollHandler.setDragHandler(dragHandler);
  const eventHandler = new WheelEventHandler(emitter, scrollHandler, core);

  renderer.init();
  dragHandler.init();
  scrollHandler.init();
  scrollHandler.scrollToValue('hours', '10');
  scrollHandler.scrollToValue('minutes', '30');
  eventHandler.init();

  const destroy = (): void => {
    eventHandler.destroy();
    scrollHandler.destroy();
    dragHandler.destroy();
    renderer.destroy();
  };

  return { element, modal, core, emitter, scrollHandler, destroy };
}

const pressKey = (column: Element, key: string): void => {
  column.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
};

const secondsColumnOf = (harness: WheelHarness): Element => {
  const column = harness.modal.querySelector('.tp-ui-wheel-seconds');
  expect(column).not.toBeNull();
  return column as Element;
};

const fieldValue = (harness: WheelHarness, selector: string): string | undefined =>
  harness.modal.querySelector<HTMLInputElement>(selector)?.value;

const pickerInputValue = (harness: WheelHarness): string | undefined =>
  harness.element.querySelector<HTMLInputElement>('input')?.value;

describe('WheelEventHandler with a seconds column', () => {
  let harness: WheelHarness | null = null;

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    harness?.destroy();
    harness = null;
    document.body.innerHTML = '';
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it('ArrowDown on the seconds column syncs the field, emits the events and announces', () => {
    harness = mount({ showSeconds: true });
    const onSecond = jest.fn();
    const onUpdate = jest.fn();
    harness.emitter.on('select:second', onSecond);
    harness.emitter.on('update', onUpdate);

    pressKey(secondsColumnOf(harness), 'ArrowDown');

    expect(fieldValue(harness, '.tp-ui-seconds')).toBe('01');
    expect(harness.core.degreesSeconds).toBe(6);
    expect(onSecond).toHaveBeenCalledWith({ seconds: '01' });
    expect(onUpdate).toHaveBeenLastCalledWith(
      expect.objectContaining({ hour: '10', minutes: '30', seconds: '01' }),
    );
    expect(harness.scrollHandler.getCurrentSelection()).toEqual(
      expect.objectContaining({ hour: '10', minute: '30', second: '01' }),
    );

    jest.advanceTimersByTime(TIMINGS.ANNOUNCE_DELAY);

    expect(harness.modal.querySelector('.timepicker-announcer')?.textContent).toBe('Sekunda: 01');
  });

  it('commitOnScroll writes HH:MM:SS to the input and confirms with the seconds', () => {
    harness = mount({ showSeconds: true });
    const onConfirm = jest.fn();
    harness.emitter.on('confirm', onConfirm);

    pressKey(secondsColumnOf(harness), 'ArrowDown');
    jest.advanceTimersByTime(TIMINGS.COMMIT_ON_SCROLL_DELAY);

    expect(pickerInputValue(harness)).toBe('10:30:01');
    expect(onConfirm).toHaveBeenCalledWith(
      expect.objectContaining({ hour: '10', minutes: '30', seconds: '01', autoCommit: true }),
    );
  });

  it('keyboard navigation skips disabled seconds', () => {
    harness = mount({ showSeconds: true, disabledSeconds: ['01', '02'] });
    const onSecond = jest.fn();
    harness.emitter.on('select:second', onSecond);

    pressKey(secondsColumnOf(harness), 'ArrowDown');

    expect(fieldValue(harness, '.tp-ui-seconds')).toBe('03');
    expect(onSecond).toHaveBeenCalledWith({ seconds: '03' });
  });

  it('mouse-wheel scrolling the seconds column to 05 gives the seconds field aria-valuenow 5 and aria-valuetext 05', () => {
    harness = mount({ showSeconds: true });
    const column = secondsColumnOf(harness);

    for (let step = 0; step < 5; step++) {
      column.dispatchEvent(new WheelEvent('wheel', { deltaY: 50, bubbles: true, cancelable: true }));
      jest.advanceTimersByTime(TIMINGS.COMMIT_ON_SCROLL_DELAY);
    }

    const seconds = harness.modal.querySelector<HTMLInputElement>('.tp-ui-seconds');
    expect(harness.scrollHandler.getSelectedValue('seconds')).toBe('05');
    expect(seconds?.value).toBe('05');
    expect(seconds?.getAttribute('aria-valuenow')).toBe('5');
    expect(seconds?.getAttribute('aria-valuetext')).toBe('05');
  });

  it('clear scrolls the seconds column back to 00', () => {
    harness = mount({ showSeconds: true });
    pressKey(secondsColumnOf(harness), 'ArrowDown');

    harness.emitter.emit('clear', { previousValue: '10:30:01' });

    expect(harness.scrollHandler.getSelectedValue('seconds')).toBe('00');
  });

  it('keeps the minutes path and payloads unchanged when seconds are not shown', () => {
    harness = mount({ showSeconds: false });
    const onUpdate = jest.fn();
    const onConfirm = jest.fn();
    harness.emitter.on('update', onUpdate);
    harness.emitter.on('confirm', onConfirm);
    const minutesColumn = harness.modal.querySelector('.tp-ui-wheel-minutes') as Element;

    expect(harness.modal.querySelector('.tp-ui-wheel-seconds')).toBeNull();

    pressKey(minutesColumn, 'ArrowDown');
    jest.advanceTimersByTime(TIMINGS.COMMIT_ON_SCROLL_DELAY);

    expect(fieldValue(harness, '.tp-ui-minutes')).toBe('31');
    expect(onUpdate).toHaveBeenLastCalledWith(expect.objectContaining({ hour: '10', minutes: '31' }));
    expect(onUpdate.mock.calls[0][0].seconds).toBeUndefined();
    expect(pickerInputValue(harness)).toBe('10:31');
    expect(onConfirm).toHaveBeenCalledWith(expect.objectContaining({ hour: '10', minutes: '31' }));
    expect(onConfirm.mock.calls[0][0].seconds).toBeUndefined();
  });
});
