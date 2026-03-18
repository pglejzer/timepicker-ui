import { WheelRenderer } from '../../../../../src/managers/plugins/wheel/WheelRenderer';
import { WheelDragHandler } from '../../../../../src/managers/plugins/wheel/WheelDragHandler';
import { WheelScrollHandler } from '../../../../../src/managers/plugins/wheel/WheelScrollHandler';
import WheelManager from '../../../../../src/managers/plugins/wheel/WheelManager';
import { CoreState } from '../../../../../src/timepicker/CoreState';
import { EventEmitter, type TimepickerEventMap } from '../../../../../src/utils/EventEmitter';
import { createWheelOptions, WHEEL_ITEM_HEIGHT_PX } from './wheel-test-helpers';

const DISABLED_HOURS_24H = [0, 1, 2, 3, 4, 5, 22, 23];
const INCREMENT_MINUTES = 5;
const INSTANCE_ID = 'hide-disabled-popover-test';

function buildCompactWheelModal(instanceId: string): HTMLDivElement {
  const modal = document.createElement('div');
  modal.setAttribute('data-owner-id', instanceId);
  modal.classList.add('tp-ui-modal', 'tp-ui-compact-wheel-mode');

  const wrapper = document.createElement('div');
  wrapper.className = 'tp-ui-wrapper';

  const clockWrapper = document.createElement('div');
  clockWrapper.className = 'tp-ui-mobile-clock-wrapper';

  const container = document.createElement('div');
  container.className = 'tp-ui-wheel-container';

  const hoursWrapper = document.createElement('div');
  hoursWrapper.className = 'tp-ui-wheel-column-wrapper at-start';
  const hoursCol = document.createElement('div');
  hoursCol.className = 'tp-ui-wheel-column tp-ui-wheel-hours';
  hoursCol.setAttribute('role', 'listbox');
  hoursCol.setAttribute('tabindex', '0');

  for (let i = 0; i <= 23; i++) {
    const item = document.createElement('div');
    item.className = 'tp-ui-wheel-item';
    const val = String(i).padStart(2, '0');
    item.setAttribute('data-value', val);
    item.setAttribute('role', 'option');
    item.textContent = val;
    item.style.height = `${WHEEL_ITEM_HEIGHT_PX}px`;
    hoursCol.appendChild(item);
  }

  hoursWrapper.appendChild(hoursCol);
  container.appendChild(hoursWrapper);

  const minutesWrapper = document.createElement('div');
  minutesWrapper.className = 'tp-ui-wheel-column-wrapper at-start';
  const minutesCol = document.createElement('div');
  minutesCol.className = 'tp-ui-wheel-column tp-ui-wheel-minutes';
  minutesCol.setAttribute('role', 'listbox');
  minutesCol.setAttribute('tabindex', '0');

  for (let i = 0; i < 60; i += INCREMENT_MINUTES) {
    const item = document.createElement('div');
    item.className = 'tp-ui-wheel-item';
    const val = String(i).padStart(2, '0');
    item.setAttribute('data-value', val);
    item.setAttribute('role', 'option');
    item.textContent = val;
    item.style.height = `${WHEEL_ITEM_HEIGHT_PX}px`;
    minutesCol.appendChild(item);
  }

  minutesWrapper.appendChild(minutesCol);
  container.appendChild(minutesWrapper);

  clockWrapper.appendChild(container);
  wrapper.appendChild(clockWrapper);
  modal.appendChild(wrapper);
  return modal;
}

describe('Wheel hideDisabled — compact-wheel popover 24h + 5min step', () => {
  let element: HTMLDivElement;
  let modal: HTMLDivElement;
  let core: CoreState;
  let emitter: EventEmitter<TimepickerEventMap>;
  let renderer: WheelRenderer;
  let dragHandler: WheelDragHandler;
  let scrollHandler: WheelScrollHandler;

  beforeEach(() => {
    element = document.createElement('div');
    const input = document.createElement('input');
    input.type = 'text';
    input.value = '10:00';
    element.appendChild(input);
    document.body.appendChild(element);

    const options = createWheelOptions({
      clock: {
        type: '24h',
        incrementMinutes: INCREMENT_MINUTES,
        disabledTime: { hours: DISABLED_HOURS_24H },
      },
      ui: { mode: 'compact-wheel' },
      wheel: { placement: 'auto', hideDisabled: true },
    });

    core = new CoreState(element, options, INSTANCE_ID);
    core.setDisabledTime({
      value: {
        hours: DISABLED_HOURS_24H.map(String),
      },
    });

    modal = buildCompactWheelModal(INSTANCE_ID);
    document.body.appendChild(modal);

    emitter = new EventEmitter<TimepickerEventMap>();
    renderer = new WheelRenderer(core, emitter);
    dragHandler = new WheelDragHandler(renderer);
    scrollHandler = new WheelScrollHandler(renderer, core);
    scrollHandler.setDragHandler(dragHandler);

    jest.spyOn(renderer, 'getItemHeight').mockReturnValue(WHEEL_ITEM_HEIGHT_PX);

    renderer.init();
    dragHandler.init();
    scrollHandler.init();
  });

  afterEach(() => {
    scrollHandler.destroy();
    dragHandler.destroy();
    renderer.destroy();
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  describe('disabled hours removal', () => {
    it('should remove disabled hours [0-5, 22-23] from DOM', () => {
      const items = renderer.getItems('hours');
      const values = Array.from(items ?? []).map((el) => el.getAttribute('data-value'));

      DISABLED_HOURS_24H.forEach((h) => {
        expect(values).not.toContain(String(h).padStart(2, '0'));
      });
    });

    it('should keep enabled hours 06-21 visible', () => {
      const items = renderer.getItems('hours');
      const values = Array.from(items ?? []).map((el) => el.getAttribute('data-value'));

      for (let h = 6; h <= 21; h++) {
        expect(values).toContain(String(h).padStart(2, '0'));
      }
    });

    it('should report 16 visible hours (24 total minus 8 disabled)', () => {
      expect(renderer.getItemCount('hours')).toBe(16);
    });
  });

  describe('initial value sync after hideDisabled', () => {
    it('should scroll to hour 10 when input value is 10:00', () => {
      scrollHandler.scrollToValue('hours', '10');
      const selected = scrollHandler.getSelectedValue('hours');

      expect(selected).toBe('10');
    });

    it('should scroll to minute 00 when input value is 10:00', () => {
      scrollHandler.scrollToValue('minutes', '00');
      const selected = scrollHandler.getSelectedValue('minutes');

      expect(selected).toBe('00');
    });

    it('should return correct selection state for 10:00 in 24h mode', () => {
      scrollHandler.scrollToValue('hours', '10');
      scrollHandler.scrollToValue('minutes', '00');

      const selection = scrollHandler.getCurrentSelection();

      expect(selection.hour).toBe('10');
      expect(selection.minute).toBe('00');
      expect(selection.ampm).toBeNull();
    });

    it('should scroll to hour 15 (enabled, not removed)', () => {
      scrollHandler.scrollToValue('hours', '15');
      const selected = scrollHandler.getSelectedValue('hours');

      expect(selected).toBe('15');
    });

    it('should not find removed hour 03 via scrollToValue', () => {
      scrollHandler.scrollToValue('hours', '03');
      const selected = scrollHandler.getSelectedValue('hours');

      expect(selected).not.toBe('03');
    });

    it('should not find removed hour 00 via scrollToValue', () => {
      scrollHandler.scrollToValue('hours', '00');
      const selected = scrollHandler.getSelectedValue('hours');

      expect(selected).not.toBe('00');
    });
  });

  describe('minute increments with hideDisabled', () => {
    it('should have 12 minute options (0, 5, 10, ..., 55)', () => {
      expect(renderer.getItemCount('minutes')).toBe(12);
    });

    it('should have minute values at 5min intervals', () => {
      const items = renderer.getItems('minutes');
      const values = Array.from(items ?? []).map((el) => el.getAttribute('data-value'));

      const expectedMinutes = Array.from({ length: 12 }, (_, i) =>
        String(i * INCREMENT_MINUTES).padStart(2, '0'),
      );

      expect(values).toEqual(expectedMinutes);
    });

    it('should scroll to minute 30 correctly', () => {
      scrollHandler.scrollToValue('minutes', '30');
      const selected = scrollHandler.getSelectedValue('minutes');

      expect(selected).toBe('30');
    });
  });

  describe('edge cases', () => {
    it('should scroll to first enabled hour (06) from index 0', () => {
      scrollHandler.scrollToValue('hours', '06');
      const selected = scrollHandler.getSelectedValue('hours');

      expect(selected).toBe('06');
    });

    it('should scroll to last enabled hour (21) correctly', () => {
      scrollHandler.scrollToValue('hours', '21');
      const selected = scrollHandler.getSelectedValue('hours');

      expect(selected).toBe('21');
    });

    it('should apply visual classes for scrolled-to hour', () => {
      scrollHandler.scrollToValue('hours', '10');
      scrollHandler.updateVisualClasses('hours');

      const items = renderer.getItems('hours');
      const centerItem = Array.from(items ?? []).find((el) => el.getAttribute('data-value') === '10');

      expect(centerItem?.classList.contains('is-center')).toBe(true);
      expect(centerItem?.getAttribute('aria-selected')).toBe('true');
    });
  });
});

describe('WheelManager integration — popover 24h hideDisabled + 5min step', () => {
  let element: HTMLDivElement;
  let modal: HTMLDivElement;
  let core: CoreState;
  let emitter: EventEmitter<TimepickerEventMap>;
  let wheelManager: WheelManager;

  beforeEach(() => {
    jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      height: WHEEL_ITEM_HEIGHT_PX,
      width: 80,
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      bottom: WHEEL_ITEM_HEIGHT_PX,
      right: 80,
      toJSON: () => ({}),
    });

    element = document.createElement('div');
    const input = document.createElement('input');
    input.type = 'text';
    input.value = '10:00';
    element.appendChild(input);
    document.body.appendChild(element);

    const options = createWheelOptions({
      clock: {
        type: '24h',
        incrementMinutes: INCREMENT_MINUTES,
        disabledTime: { hours: DISABLED_HOURS_24H },
      },
      ui: { mode: 'compact-wheel' },
      wheel: { placement: 'auto', hideDisabled: true },
    });

    core = new CoreState(element, options, INSTANCE_ID);
    core.setDisabledTime({
      value: {
        hours: DISABLED_HOURS_24H.map(String),
      },
    });

    modal = buildCompactWheelModal(INSTANCE_ID);
    document.body.appendChild(modal);

    emitter = new EventEmitter<TimepickerEventMap>();
    wheelManager = new WheelManager(core, emitter);
  });

  afterEach(() => {
    wheelManager.destroy();
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  it('should select hour 10 after init + deferred sync via rAF', () => {
    const rafCallbacks: FrameRequestCallback[] = [];
    jest.spyOn(globalThis, 'requestAnimationFrame').mockImplementation((cb) => {
      rafCallbacks.push(cb);
      return rafCallbacks.length;
    });

    wheelManager.init();

    rafCallbacks.forEach((cb) => cb(0));

    const hourItems = modal.querySelectorAll<HTMLDivElement>('.tp-ui-wheel-hours .tp-ui-wheel-item');
    const centerItem = Array.from(hourItems).find((el) => el.classList.contains('is-center'));

    expect(centerItem).toBeDefined();
    expect(centerItem?.getAttribute('data-value')).toBe('10');
  });

  it('should select minute 00 after init + deferred sync via rAF', () => {
    const rafCallbacks: FrameRequestCallback[] = [];
    jest.spyOn(globalThis, 'requestAnimationFrame').mockImplementation((cb) => {
      rafCallbacks.push(cb);
      return rafCallbacks.length;
    });

    wheelManager.init();

    rafCallbacks.forEach((cb) => cb(0));

    const minuteItems = modal.querySelectorAll<HTMLDivElement>('.tp-ui-wheel-minutes .tp-ui-wheel-item');
    const centerItem = Array.from(minuteItems).find((el) => el.classList.contains('is-center'));

    expect(centerItem).toBeDefined();
    expect(centerItem?.getAttribute('data-value')).toBe('00');
  });

  it('should not have any disabled hour in the DOM', () => {
    wheelManager.init();

    const hourItems = modal.querySelectorAll<HTMLDivElement>('.tp-ui-wheel-hours .tp-ui-wheel-item');
    const values = Array.from(hourItems).map((el) => el.getAttribute('data-value'));

    DISABLED_HOURS_24H.forEach((h) => {
      expect(values).not.toContain(String(h).padStart(2, '0'));
    });
  });
});

