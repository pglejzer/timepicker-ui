import { WheelRenderer } from '../../../../../src/managers/plugins/wheel/WheelRenderer';
import { WheelDragHandler } from '../../../../../src/managers/plugins/wheel/WheelDragHandler';
import { WheelScrollHandler } from '../../../../../src/managers/plugins/wheel/WheelScrollHandler';
import { WheelEventHandler } from '../../../../../src/managers/plugins/wheel/WheelEventHandler';
import { CoreState } from '../../../../../src/timepicker/CoreState';
import { EventEmitter, type TimepickerEventMap } from '../../../../../src/utils/EventEmitter';
import { createWheelOptions, WHEEL_ITEM_HEIGHT_PX } from './wheel-test-helpers';

const RECT_STUB: DOMRect = {
  height: WHEEL_ITEM_HEIGHT_PX,
  width: 80,
  x: 0,
  y: 0,
  top: 0,
  left: 0,
  bottom: WHEEL_ITEM_HEIGHT_PX,
  right: 80,
  toJSON: () => ({}),
};

function mockItemHeights(modal: HTMLDivElement): void {
  modal.querySelectorAll<HTMLDivElement>('.tp-ui-wheel-item').forEach((item) => {
    jest.spyOn(item, 'getBoundingClientRect').mockReturnValue(RECT_STUB);
  });
}

function buildModalWithDisabledMinutes(instanceId: string): HTMLDivElement {
  const modal = document.createElement('div');
  modal.setAttribute('data-owner-id', instanceId);

  const hourInput = document.createElement('input');
  hourInput.className = 'tp-ui-hour';
  hourInput.value = '12';
  modal.appendChild(hourInput);

  const minuteInput = document.createElement('input');
  minuteInput.className = 'tp-ui-minutes';
  minuteInput.value = '00';
  modal.appendChild(minuteInput);

  const am = document.createElement('div');
  am.className = 'tp-ui-type-mode tp-ui-am active';
  modal.appendChild(am);

  const pm = document.createElement('div');
  pm.className = 'tp-ui-type-mode tp-ui-pm';
  modal.appendChild(pm);

  const container = document.createElement('div');
  container.className = 'tp-ui-wheel-container';

  const hoursWrapper = document.createElement('div');
  hoursWrapper.className = 'tp-ui-wheel-column-wrapper';
  const hoursCol = document.createElement('div');
  hoursCol.className = 'tp-ui-wheel-column tp-ui-wheel-hours';
  hoursCol.setAttribute('role', 'listbox');
  hoursCol.setAttribute('tabindex', '0');

  for (let i = 1; i <= 12; i++) {
    const item = document.createElement('div');
    item.className = 'tp-ui-wheel-item';
    item.setAttribute('data-value', String(i).padStart(2, '0'));
    item.setAttribute('role', 'option');
    item.textContent = String(i).padStart(2, '0');
    item.style.height = `${WHEEL_ITEM_HEIGHT_PX}px`;
    hoursCol.appendChild(item);
  }
  hoursWrapper.appendChild(hoursCol);
  container.appendChild(hoursWrapper);

  const minutesWrapper = document.createElement('div');
  minutesWrapper.className = 'tp-ui-wheel-column-wrapper';
  const minutesCol = document.createElement('div');
  minutesCol.className = 'tp-ui-wheel-column tp-ui-wheel-minutes';
  minutesCol.setAttribute('role', 'listbox');
  minutesCol.setAttribute('tabindex', '0');

  for (let i = 0; i < 60; i++) {
    const item = document.createElement('div');
    item.className = 'tp-ui-wheel-item';
    item.setAttribute('data-value', String(i).padStart(2, '0'));
    item.setAttribute('role', 'option');
    item.textContent = String(i).padStart(2, '0');
    item.style.height = `${WHEEL_ITEM_HEIGHT_PX}px`;
    minutesCol.appendChild(item);
  }
  minutesWrapper.appendChild(minutesCol);
  container.appendChild(minutesWrapper);

  const ampmWrapper = document.createElement('div');
  ampmWrapper.className = 'tp-ui-wheel-column-wrapper';
  const ampmCol = document.createElement('div');
  ampmCol.className = 'tp-ui-wheel-column tp-ui-wheel-ampm';
  ampmCol.setAttribute('role', 'listbox');
  ampmCol.setAttribute('tabindex', '0');

  ['AM', 'PM'].forEach((val) => {
    const item = document.createElement('div');
    item.className = 'tp-ui-wheel-item';
    item.setAttribute('data-value', val);
    item.setAttribute('role', 'option');
    item.textContent = val;
    item.style.height = `${WHEEL_ITEM_HEIGHT_PX}px`;
    ampmCol.appendChild(item);
  });
  ampmWrapper.appendChild(ampmCol);
  container.appendChild(ampmWrapper);

  modal.appendChild(container);
  return modal;
}

const INSTANCE_ID = 'header-sync-test';
const DISABLED_MINUTES = ['28', '29', '30', '31', '32'];

describe('Wheel header sync on disabled skip', () => {
  let element: HTMLDivElement;
  let modal: HTMLDivElement;
  let core: CoreState;
  let emitter: EventEmitter<TimepickerEventMap>;
  let renderer: WheelRenderer;
  let dragHandler: WheelDragHandler;
  let scrollHandler: WheelScrollHandler;
  let eventHandler: WheelEventHandler;

  beforeEach(() => {
    element = document.createElement('div');
    element.innerHTML = '<input type="text" />';
    document.body.appendChild(element);

    const options = createWheelOptions({
      clock: {
        type: '12h',
        disabledTime: { minutes: [28, 29, 30, 31, 32] },
      },
    });

    core = new CoreState(element, options, INSTANCE_ID);
    core.setDisabledTime({
      value: {
        minutes: DISABLED_MINUTES,
      },
    });

    modal = buildModalWithDisabledMinutes(INSTANCE_ID);
    document.body.appendChild(modal);
    mockItemHeights(modal);

    emitter = new EventEmitter<TimepickerEventMap>();
    renderer = new WheelRenderer(core, emitter);
    dragHandler = new WheelDragHandler(renderer);
    scrollHandler = new WheelScrollHandler(renderer, core);
    scrollHandler.setDragHandler(dragHandler);
    eventHandler = new WheelEventHandler(emitter, scrollHandler, core);

    renderer.init();
    dragHandler.init();
    scrollHandler.init();
    eventHandler.init();
  });

  afterEach(() => {
    eventHandler.destroy();
    scrollHandler.destroy();
    dragHandler.destroy();
    renderer.destroy();
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  it('should emit select:minute when scrollToNextValid skips disabled value', () => {
    const minuteSpy = jest.fn();
    emitter.on('select:minute', minuteSpy);

    dragHandler.setScrollOffset('minutes', 30 * WHEEL_ITEM_HEIGHT_PX);
    scrollHandler['onColumnSnapped']('minutes');

    expect(minuteSpy).toHaveBeenCalled();
    const payload = minuteSpy.mock.calls[0][0];
    expect(DISABLED_MINUTES).not.toContain(payload.minutes);
  });

  it('should sync the minute header input after disabled skip', () => {
    dragHandler.setScrollOffset('minutes', 30 * WHEEL_ITEM_HEIGHT_PX);
    scrollHandler['onColumnSnapped']('minutes');

    const minuteInput = modal.querySelector<HTMLInputElement>('.tp-ui-minutes');
    const value = minuteInput?.value;

    expect(value).toBeDefined();
    expect(DISABLED_MINUTES).not.toContain(value);
  });

  it('should emit update event after disabled skip', () => {
    const updateSpy = jest.fn();
    emitter.on('update', updateSpy);

    dragHandler.setScrollOffset('minutes', 30 * WHEEL_ITEM_HEIGHT_PX);
    scrollHandler['onColumnSnapped']('minutes');

    expect(updateSpy).toHaveBeenCalled();
  });

  it('should emit wheel:scroll:end after disabled skip', () => {
    const scrollEndSpy = jest.fn();
    emitter.on('wheel:scroll:end', scrollEndSpy);

    dragHandler.setScrollOffset('minutes', 30 * WHEEL_ITEM_HEIGHT_PX);
    scrollHandler['onColumnSnapped']('minutes');

    expect(scrollEndSpy).toHaveBeenCalled();
  });

  it('should emit select:hour when hour snaps to disabled value', () => {
    core.setDisabledTime({
      value: {
        hours: ['3', '4', '5'],
      },
    });
    renderer.updateDisabledItems();

    const hourSpy = jest.fn();
    emitter.on('select:hour', hourSpy);

    dragHandler.setScrollOffset('hours', 3 * WHEEL_ITEM_HEIGHT_PX);
    scrollHandler['onColumnSnapped']('hours');

    expect(hourSpy).toHaveBeenCalled();
  });

  it('should sync hour header input after disabled hour skip', () => {
    core.setDisabledTime({
      value: {
        hours: ['3', '4', '5'],
      },
    });
    renderer.updateDisabledItems();

    dragHandler.setScrollOffset('hours', 3 * WHEEL_ITEM_HEIGHT_PX);
    scrollHandler['onColumnSnapped']('hours');

    const hourInput = modal.querySelector<HTMLInputElement>('.tp-ui-hour');
    const value = hourInput?.value;

    expect(value).toBeDefined();
    expect(['03', '04', '05']).not.toContain(value);
  });
});

describe('Wheel commitOnScroll after disabled skip', () => {
  let element: HTMLDivElement;
  let modal: HTMLDivElement;
  let core: CoreState;
  let emitter: EventEmitter<TimepickerEventMap>;
  let renderer: WheelRenderer;
  let dragHandler: WheelDragHandler;
  let scrollHandler: WheelScrollHandler;
  let eventHandler: WheelEventHandler;

  beforeEach(() => {
    jest.useFakeTimers();

    element = document.createElement('div');
    element.innerHTML = '<input type="text" />';
    document.body.appendChild(element);

    const options = createWheelOptions({
      clock: {
        type: '12h',
        disabledTime: { minutes: [28, 29, 30, 31, 32] },
      },
      ui: { mode: 'wheel', wheel: { commitOnScroll: true } },
    });

    core = new CoreState(element, options, INSTANCE_ID);
    core.setDisabledTime({
      value: {
        minutes: DISABLED_MINUTES,
      },
    });

    modal = buildModalWithDisabledMinutes(INSTANCE_ID);
    document.body.appendChild(modal);
    mockItemHeights(modal);

    emitter = new EventEmitter<TimepickerEventMap>();
    renderer = new WheelRenderer(core, emitter);
    dragHandler = new WheelDragHandler(renderer);
    scrollHandler = new WheelScrollHandler(renderer, core);
    scrollHandler.setDragHandler(dragHandler);
    eventHandler = new WheelEventHandler(emitter, scrollHandler, core);

    renderer.init();
    dragHandler.init();
    scrollHandler.init();
    eventHandler.init();
  });

  afterEach(() => {
    eventHandler.destroy();
    scrollHandler.destroy();
    dragHandler.destroy();
    renderer.destroy();
    document.body.innerHTML = '';
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('should emit confirm event after commitOnScroll delay on disabled skip', () => {
    const confirmSpy = jest.fn();
    emitter.on('confirm', confirmSpy);

    dragHandler.setScrollOffset('minutes', 30 * WHEEL_ITEM_HEIGHT_PX);
    scrollHandler['onColumnSnapped']('minutes');

    jest.advanceTimersByTime(500);

    expect(confirmSpy).toHaveBeenCalledWith(expect.objectContaining({ autoCommit: true }));
  });

  it('should write valid time to input element after commitOnScroll', () => {
    dragHandler.setScrollOffset('minutes', 30 * WHEEL_ITEM_HEIGHT_PX);
    scrollHandler['onColumnSnapped']('minutes');

    jest.advanceTimersByTime(500);

    const input = element.querySelector<HTMLInputElement>('input');

    expect(input?.value).toBeDefined();
    expect(input?.value).not.toContain(':30 ');
  });
});

