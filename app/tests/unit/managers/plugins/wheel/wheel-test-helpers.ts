import { CoreState } from '../../../../../src/timepicker/CoreState';
import { EventEmitter, type TimepickerEventMap } from '../../../../../src/utils/EventEmitter';
import { DEFAULT_OPTIONS } from '../../../../../src/utils/options/defaults';
import type { TimepickerOptions } from '../../../../../src/types/options';

const WHEEL_ITEM_HEIGHT_PX = 40;

function createModalWithWheel(instanceId: string, clockType: '12h' | '24h'): HTMLDivElement {
  const modal = document.createElement('div');
  modal.setAttribute('data-owner-id', instanceId);
  modal.classList.add('tp-ui-modal');

  const hourInput = document.createElement('input');
  hourInput.className = 'tp-ui-hour';
  hourInput.value = '12';
  modal.appendChild(hourInput);

  const minuteInput = document.createElement('input');
  minuteInput.className = 'tp-ui-minutes';
  minuteInput.value = '00';
  modal.appendChild(minuteInput);

  if (clockType !== '24h') {
    const am = document.createElement('div');
    am.className = 'tp-ui-type-mode tp-ui-am active';
    am.textContent = 'AM';
    modal.appendChild(am);

    const pm = document.createElement('div');
    pm.className = 'tp-ui-type-mode tp-ui-pm';
    pm.textContent = 'PM';
    modal.appendChild(pm);
  }

  const container = document.createElement('div');
  container.className = 'tp-ui-wheel-container';

  const hoursWrapper = document.createElement('div');
  hoursWrapper.className = 'tp-ui-wheel-column-wrapper at-start';
  const hoursCol = buildColumn(
    'tp-ui-wheel-hours',
    clockType === '12h' ? 1 : 0,
    clockType === '12h' ? 12 : 23,
  );
  hoursWrapper.appendChild(hoursCol);
  container.appendChild(hoursWrapper);

  const minutesWrapper = document.createElement('div');
  minutesWrapper.className = 'tp-ui-wheel-column-wrapper at-start';
  const minutesCol = buildColumn('tp-ui-wheel-minutes', 0, 59);
  minutesWrapper.appendChild(minutesCol);
  container.appendChild(minutesWrapper);

  if (clockType !== '24h') {
    const ampmWrapper = document.createElement('div');
    ampmWrapper.className = 'tp-ui-wheel-column-wrapper at-start';
    const ampmCol = buildAmPmColumn();
    ampmWrapper.appendChild(ampmCol);
    container.appendChild(ampmWrapper);
  }

  modal.appendChild(container);
  return modal;
}

function buildColumn(className: string, start: number, end: number): HTMLDivElement {
  const col = document.createElement('div');
  col.className = `tp-ui-wheel-column ${className}`;
  col.setAttribute('role', 'listbox');
  col.setAttribute('tabindex', '0');

  appendPadding(col);

  for (let i = start; i <= end; i++) {
    const item = document.createElement('div');
    item.className = 'tp-ui-wheel-item';
    item.setAttribute('data-value', String(i).padStart(2, '0'));
    item.setAttribute('role', 'option');
    item.textContent = String(i).padStart(2, '0');
    item.style.height = `${WHEEL_ITEM_HEIGHT_PX}px`;
    col.appendChild(item);
  }

  appendPadding(col);

  return col;
}

function appendPadding(col: HTMLDivElement): void {
  for (let p = 0; p < 2; p++) {
    const pad = document.createElement('div');
    pad.className = 'tp-ui-wheel-padding';
    pad.style.height = `${WHEEL_ITEM_HEIGHT_PX}px`;
    col.appendChild(pad);
  }
}

function buildAmPmColumn(): HTMLDivElement {
  const col = document.createElement('div');
  col.className = 'tp-ui-wheel-column tp-ui-wheel-ampm';
  col.setAttribute('role', 'listbox');
  col.setAttribute('tabindex', '0');

  appendPadding(col);

  ['AM', 'PM'].forEach((val) => {
    const item = document.createElement('div');
    item.className = 'tp-ui-wheel-item';
    item.setAttribute('data-value', val);
    item.setAttribute('role', 'option');
    item.textContent = val;
    item.style.height = `${WHEEL_ITEM_HEIGHT_PX}px`;
    col.appendChild(item);
  });

  appendPadding(col);

  return col;
}

function createWheelOptions(overrides: Partial<TimepickerOptions> = {}): Required<TimepickerOptions> {
  return {
    ...DEFAULT_OPTIONS,
    ui: { ...DEFAULT_OPTIONS.ui, mode: 'wheel', ...overrides.ui },
    clock: { ...DEFAULT_OPTIONS.clock, ...overrides.clock },
    labels: { ...DEFAULT_OPTIONS.labels, ...overrides.labels },
    behavior: { ...DEFAULT_OPTIONS.behavior, ...overrides.behavior },
    callbacks: { ...DEFAULT_OPTIONS.callbacks, ...overrides.callbacks },
    timezone: { ...DEFAULT_OPTIONS.timezone, ...overrides.timezone },
    range: { ...DEFAULT_OPTIONS.range, ...overrides.range },
    clearBehavior: { ...DEFAULT_OPTIONS.clearBehavior, ...overrides.clearBehavior },
  };
}

interface WheelTestContext {
  readonly element: HTMLDivElement;
  readonly modal: HTMLDivElement;
  readonly core: CoreState;
  readonly emitter: EventEmitter<TimepickerEventMap>;
}

function setupWheelTestContext(
  clockType: '12h' | '24h' = '12h',
  instanceId: string = 'test-wheel',
): WheelTestContext {
  const element = document.createElement('div');
  element.innerHTML = '<input type="text" />';
  document.body.appendChild(element);

  const options = createWheelOptions({
    clock: { type: clockType },
  });
  const core = new CoreState(element, options, instanceId);

  const modal = createModalWithWheel(instanceId, clockType);
  document.body.appendChild(modal);

  const emitter = new EventEmitter<TimepickerEventMap>();

  return { element, modal, core, emitter };
}

export { createModalWithWheel, createWheelOptions, setupWheelTestContext, WHEEL_ITEM_HEIGHT_PX };
export type { WheelTestContext };

