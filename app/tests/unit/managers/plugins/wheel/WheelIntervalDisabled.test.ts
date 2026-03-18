import { WheelRenderer } from '../../../../../src/managers/plugins/wheel/WheelRenderer';
import { WheelDragHandler } from '../../../../../src/managers/plugins/wheel/WheelDragHandler';
import { WheelScrollHandler } from '../../../../../src/managers/plugins/wheel/WheelScrollHandler';
import { WheelEventHandler } from '../../../../../src/managers/plugins/wheel/WheelEventHandler';
import { CoreState } from '../../../../../src/timepicker/CoreState';
import { EventEmitter, type TimepickerEventMap } from '../../../../../src/utils/EventEmitter';
import { createWheelOptions, WHEEL_ITEM_HEIGHT_PX } from './wheel-test-helpers';

function buildIntervalModal(instanceId: string, clockType: '12h' | '24h'): HTMLDivElement {
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

  if (clockType === '12h') {
    const am = document.createElement('div');
    am.className = 'tp-ui-type-mode tp-ui-am active';
    modal.appendChild(am);

    const pm = document.createElement('div');
    pm.className = 'tp-ui-type-mode tp-ui-pm';
    modal.appendChild(pm);
  }

  const container = document.createElement('div');
  container.className = 'tp-ui-wheel-container';

  const start = clockType === '12h' ? 1 : 0;
  const end = clockType === '12h' ? 12 : 23;

  const hoursWrapper = document.createElement('div');
  hoursWrapper.className = 'tp-ui-wheel-column-wrapper';
  const hoursCol = document.createElement('div');
  hoursCol.className = 'tp-ui-wheel-column tp-ui-wheel-hours';
  hoursCol.setAttribute('role', 'listbox');
  hoursCol.setAttribute('tabindex', '0');
  for (let i = start; i <= end; i++) {
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

  if (clockType === '12h') {
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
  }

  modal.appendChild(container);
  return modal;
}

const INSTANCE_ID = 'interval-test';

describe('Wheel + interval disabled time (12h)', () => {
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
        disabledTime: { interval: '02:00 AM-05:30 AM' },
      },
    });

    core = new CoreState(element, options, INSTANCE_ID);
    core.setDisabledTime({
      value: {
        isInterval: true,
        clockType: '12h',
        intervals: ['02:00 AM-05:30 AM'],
      },
    });

    modal = buildIntervalModal(INSTANCE_ID, '12h');
    document.body.appendChild(modal);

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

  it('should mark hours 02-05 as disabled when AM is active', () => {
    const hoursCol = renderer.getColumnElement('hours');
    const items = hoursCol?.querySelectorAll<HTMLDivElement>('.tp-ui-wheel-item');

    const disabledValues: string[] = [];
    items?.forEach((item) => {
      if (item.classList.contains('is-disabled')) {
        disabledValues.push(item.getAttribute('data-value') ?? '');
      }
    });

    expect(disabledValues).toContain('03');
    expect(disabledValues).toContain('04');
    expect(disabledValues).not.toContain('01');
    expect(disabledValues).not.toContain('06');
    expect(disabledValues).not.toContain('12');
  });

  it('should mark minutes in interval range as disabled for hour 02', () => {
    const hourInput = core.getHour();
    if (hourInput) hourInput.value = '02';

    renderer.updateDisabledItems();

    const minutesCol = renderer.getColumnElement('minutes');
    const items = minutesCol?.querySelectorAll<HTMLDivElement>('.tp-ui-wheel-item');

    const minute00 = Array.from(items ?? []).find((i) => i.getAttribute('data-value') === '00');
    const minute30 = Array.from(items ?? []).find((i) => i.getAttribute('data-value') === '30');
    const minute59 = Array.from(items ?? []).find((i) => i.getAttribute('data-value') === '59');

    expect(minute00?.classList.contains('is-disabled')).toBe(true);
    expect(minute30?.classList.contains('is-disabled')).toBe(true);
    expect(minute59?.classList.contains('is-disabled')).toBe(true);
  });

  it('should NOT mark any hour as disabled when PM is active', () => {
    const am = modal.querySelector('.tp-ui-am');
    const pm = modal.querySelector('.tp-ui-pm');
    am?.classList.remove('active');
    pm?.classList.add('active');

    renderer.updateDisabledItems();

    const hoursCol = renderer.getColumnElement('hours');
    const items = hoursCol?.querySelectorAll<HTMLDivElement>('.tp-ui-wheel-item');

    const disabledCount = Array.from(items ?? []).filter((i) => i.classList.contains('is-disabled')).length;

    expect(disabledCount).toBe(0);
  });

  it('should re-evaluate disabled items on AM/PM DOM change', () => {
    const am = modal.querySelector('.tp-ui-am');
    const pm = modal.querySelector('.tp-ui-pm');
    am?.classList.remove('active');
    pm?.classList.add('active');

    renderer.updateDisabledItems();

    const hoursCol = renderer.getColumnElement('hours');
    const items = hoursCol?.querySelectorAll<HTMLDivElement>('.tp-ui-wheel-item');
    const disabledCount = Array.from(items ?? []).filter((i) => i.classList.contains('is-disabled')).length;

    expect(disabledCount).toBe(0);
  });

  it('should update disabled minutes when hour changes', () => {
    const hourInput = core.getHour();
    if (hourInput) hourInput.value = '06';

    renderer.updateDisabledItems();

    const minutesCol = renderer.getColumnElement('minutes');
    const items = minutesCol?.querySelectorAll<HTMLDivElement>('.tp-ui-wheel-item');
    const disabledCount = Array.from(items ?? []).filter((i) => i.classList.contains('is-disabled')).length;

    expect(disabledCount).toBe(0);
  });

  it('should mark minutes as disabled for boundary hour 05 up to :30', () => {
    const hourInput = core.getHour();
    if (hourInput) hourInput.value = '05';

    renderer.updateDisabledItems();

    const minutesCol = renderer.getColumnElement('minutes');
    const items = minutesCol?.querySelectorAll<HTMLDivElement>('.tp-ui-wheel-item');

    const minute00 = Array.from(items ?? []).find((i) => i.getAttribute('data-value') === '00');
    const minute30 = Array.from(items ?? []).find((i) => i.getAttribute('data-value') === '30');
    const minute31 = Array.from(items ?? []).find((i) => i.getAttribute('data-value') === '31');

    expect(minute00?.classList.contains('is-disabled')).toBe(true);
    expect(minute30?.classList.contains('is-disabled')).toBe(true);
    expect(minute31?.classList.contains('is-disabled')).toBe(false);
  });
});

describe('Wheel + interval disabled time (24h)', () => {
  let element: HTMLDivElement;
  let modal: HTMLDivElement;
  let core: CoreState;
  let emitter: EventEmitter<TimepickerEventMap>;
  let renderer: WheelRenderer;

  beforeEach(() => {
    element = document.createElement('div');
    element.innerHTML = '<input type="text" />';
    document.body.appendChild(element);

    const options = createWheelOptions({
      clock: {
        type: '24h',
        disabledTime: { interval: '09:00-12:30' },
      },
    });

    core = new CoreState(element, options, INSTANCE_ID);
    core.setDisabledTime({
      value: {
        isInterval: true,
        clockType: '24h',
        intervals: ['09:00-12:30'],
      },
    });

    modal = buildIntervalModal(INSTANCE_ID, '24h');
    document.body.appendChild(modal);

    emitter = new EventEmitter<TimepickerEventMap>();
    renderer = new WheelRenderer(core, emitter);
    renderer.init();
  });

  afterEach(() => {
    renderer.destroy();
    document.body.innerHTML = '';
  });

  it('should mark hours 10-11 as disabled (fully inside interval)', () => {
    const hoursCol = renderer.getColumnElement('hours');
    const items = hoursCol?.querySelectorAll<HTMLDivElement>('.tp-ui-wheel-item');

    const item10 = Array.from(items ?? []).find((i) => i.getAttribute('data-value') === '10');
    const item11 = Array.from(items ?? []).find((i) => i.getAttribute('data-value') === '11');

    expect(item10?.classList.contains('is-disabled')).toBe(true);
    expect(item11?.classList.contains('is-disabled')).toBe(true);
  });

  it('should NOT disable hour 08 (before interval)', () => {
    const hoursCol = renderer.getColumnElement('hours');
    const items = hoursCol?.querySelectorAll<HTMLDivElement>('.tp-ui-wheel-item');

    const item08 = Array.from(items ?? []).find((i) => i.getAttribute('data-value') === '08');

    expect(item08?.classList.contains('is-disabled')).toBe(false);
  });

  it('should NOT disable hour 13 (after interval)', () => {
    const hoursCol = renderer.getColumnElement('hours');
    const items = hoursCol?.querySelectorAll<HTMLDivElement>('.tp-ui-wheel-item');

    const item13 = Array.from(items ?? []).find((i) => i.getAttribute('data-value') === '13');

    expect(item13?.classList.contains('is-disabled')).toBe(false);
  });
});

describe('Wheel + multiple intervals', () => {
  let element: HTMLDivElement;
  let modal: HTMLDivElement;
  let core: CoreState;
  let emitter: EventEmitter<TimepickerEventMap>;
  let renderer: WheelRenderer;

  beforeEach(() => {
    element = document.createElement('div');
    element.innerHTML = '<input type="text" />';
    document.body.appendChild(element);

    const options = createWheelOptions({
      clock: {
        type: '12h',
        disabledTime: { interval: ['01:00 AM-03:00 AM', '06:00 PM-08:00 PM'] },
      },
    });

    core = new CoreState(element, options, INSTANCE_ID);
    core.setDisabledTime({
      value: {
        isInterval: true,
        clockType: '12h',
        intervals: ['01:00 AM-03:00 AM', '06:00 PM-08:00 PM'],
      },
    });

    modal = buildIntervalModal(INSTANCE_ID, '12h');
    document.body.appendChild(modal);

    emitter = new EventEmitter<TimepickerEventMap>();
    renderer = new WheelRenderer(core, emitter);
    renderer.init();
  });

  afterEach(() => {
    renderer.destroy();
    document.body.innerHTML = '';
  });

  it('should disable hours in AM interval when AM active', () => {
    const hoursCol = renderer.getColumnElement('hours');
    const items = hoursCol?.querySelectorAll<HTMLDivElement>('.tp-ui-wheel-item');

    const item02 = Array.from(items ?? []).find((i) => i.getAttribute('data-value') === '02');

    expect(item02?.classList.contains('is-disabled')).toBe(true);
  });

  it('should disable hours in PM interval when PM active', () => {
    const am = modal.querySelector('.tp-ui-am');
    const pm = modal.querySelector('.tp-ui-pm');
    am?.classList.remove('active');
    pm?.classList.add('active');

    renderer.updateDisabledItems();

    const hoursCol = renderer.getColumnElement('hours');
    const items = hoursCol?.querySelectorAll<HTMLDivElement>('.tp-ui-wheel-item');

    const item07 = Array.from(items ?? []).find((i) => i.getAttribute('data-value') === '07');

    expect(item07?.classList.contains('is-disabled')).toBe(true);
  });
});

