import RangeManager from '@/managers/plugins/range/RangeManager';
import { EventEmitter, type TimepickerEventMap } from '@/utils/EventEmitter';
import type { PluginTimeView } from '@/core/PluginRegistry';

const normalize = (text: string): string => text.replace(/\s+/g, ' ').trim();

const exposedText = (node: Node): string => {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? '';
  if (!(node instanceof Element)) return '';
  if (node.getAttribute('aria-hidden') === 'true') return '';
  return Array.from(node.childNodes).map(exposedText).join(' ');
};

const accessibleName = (element: Element): string => {
  const labelledBy = element.getAttribute('aria-labelledby');
  if (labelledBy) {
    return normalize(
      labelledBy
        .split(/\s+/)
        .map((id) => {
          const referenced = document.getElementById(id);
          return referenced ? exposedText(referenced) : '';
        })
        .join(' '),
    );
  }

  const label = element.getAttribute('aria-label');
  if (label !== null && label.trim() !== '') return normalize(label);

  return normalize(exposedText(element));
};

interface RangeHarnessConfig {
  readonly clockType?: '12h' | '24h';
  readonly showSeconds?: boolean;
  readonly linked?: boolean;
  readonly minDuration?: number;
  readonly maxDuration?: number;
  readonly inputValue?: string;
  readonly isOpen?: boolean;
  readonly mode?: 'clock' | 'wheel' | 'compact-wheel';
  readonly currentTime?: boolean | { time?: Date };
  readonly timeView?: PluginTimeView;
}

const WHEEL_MODE_CLASS = {
  wheel: 'tp-ui-wheel-mode',
  'compact-wheel': 'tp-ui-compact-wheel-mode',
} as const;

interface RangeHarnessOptions {
  readonly range: {
    enabled: boolean;
    minDuration?: number;
    maxDuration?: number;
    linked?: boolean;
  };
  readonly clock: {
    type: '12h' | '24h';
    showSeconds: boolean;
    currentTime?: boolean | { time?: Date };
  };
  readonly ui: { mode: 'clock' | 'wheel' | 'compact-wheel' };
}

type TypedField = 'hour' | 'minutes';

interface RangeChange {
  part: string;
  from: unknown;
  to: unknown;
}

interface RangeHarness {
  readonly manager: RangeManager;
  readonly emitter: EventEmitter<TimepickerEventMap>;
  readonly core: Record<string, unknown>;
  readonly options: RangeHarnessOptions;
  readonly input: HTMLInputElement;
  readonly modal: HTMLElement;
  readonly hour: HTMLInputElement;
  readonly minutes: HTMLInputElement;
  readonly fromTab: HTMLElement;
  readonly toTab: HTMLElement;
  readonly fromTime: HTMLElement;
  readonly toTime: HTMLElement;
  readonly okButton: HTMLElement;
  readonly events: Array<{ event: string; payload: unknown }>;
  readonly commit: (hour: string, minutes: string, type?: string) => void;
  readonly typeInto: (field: HTMLInputElement, value: string, name: TypedField) => void;
  readonly typePreview: (hour: string, minutes: string) => void;
  readonly changes: () => RangeChange[];
}

const RECORDED_EVENTS = [
  'range:change',
  'error',
  'range:switch',
  'range:validation',
  'range:confirm',
] as const;

const mountRangeManager = (config: RangeHarnessConfig = {}): RangeHarness => {
  const { clockType = '24h', showSeconds = false, inputValue = '', isOpen = true, mode = 'clock' } = config;

  const modal = document.createElement('div');
  if (mode !== 'clock') modal.classList.add(WHEEL_MODE_CLASS[mode]);
  modal.innerHTML =
    '<button type="button" class="tp-ui-range-tab tp-ui-range-from"></button>' +
    '<button type="button" class="tp-ui-range-tab tp-ui-range-to"></button>' +
    '<span class="tp-ui-range-from-time"></span><span class="tp-ui-range-to-time"></span>' +
    '<input class="tp-ui-hour" value="12"><input class="tp-ui-minutes" value="00">' +
    '<div class="tp-ui-ok-btn" role="button" tabindex="0">OK</div>';
  document.body.appendChild(modal);

  const input = document.createElement('input');
  input.value = inputValue;
  document.body.appendChild(input);

  const query = <T extends HTMLElement>(selector: string): T => modal.querySelector<T>(selector) as T;
  const hour = query<HTMLInputElement>('.tp-ui-hour');
  const minutes = query<HTMLInputElement>('.tp-ui-minutes');
  const okButton = query<HTMLElement>('.tp-ui-ok-btn');

  const range: RangeHarnessOptions['range'] = {
    enabled: true,
    minDuration: config.minDuration,
    maxDuration: config.maxDuration,
  };
  if (config.linked !== undefined) range.linked = config.linked;

  const options: RangeHarnessOptions = {
    range,
    clock: { type: clockType, showSeconds, currentTime: config.currentTime },
    ui: { mode },
  };

  const core: Record<string, unknown> = {
    getModalElement: () => (isOpen ? modal : null),
    getInput: () => input,
    getHour: () => (isOpen ? hour : null),
    getMinutes: () => (isOpen ? minutes : null),
    getSeconds: () => null,
    getClockFace: () => null,
    getAM: () => null,
    getPM: () => null,
    getActiveType: () => undefined,
    getOkButton: () => (isOpen ? okButton : null),
    isOpen,
    isRerendering: false,
    isApiChange: false,
    options,
  };

  const emitter = new EventEmitter<TimepickerEventMap>();
  const events: RangeHarness['events'] = [];
  RECORDED_EVENTS.forEach((event) => {
    emitter.on(event, (payload: unknown) => {
      events.push({ event, payload });
    });
  });

  const manager = new RangeManager(core as never, emitter);
  if (config.timeView) manager.setTimeView(config.timeView);
  manager.init();

  const commit = (h: string, m: string, type?: string): void => {
    emitter.emit('range:minute:commit', { hour: h, minutes: m, type });
  };

  const pressAndWrite = (field: HTMLInputElement, value: string): void => {
    field.dispatchEvent(new KeyboardEvent('keydown', { key: value.slice(-1), bubbles: true }));
    field.value = value;
  };

  const emitFieldUpdate = (): void => {
    emitter.emit('update', { hour: hour.value, minutes: minutes.value, type: undefined });
  };

  const typeInto = (field: HTMLInputElement, value: string, name: TypedField): void => {
    pressAndWrite(field, value);
    emitFieldUpdate();
    emitter.emit('input:commit', { field: name });
  };

  const typePreview = (h: string, m: string): void => {
    pressAndWrite(hour, h);
    pressAndWrite(minutes, m);
    emitFieldUpdate();
  };

  const changes = (): RangeChange[] =>
    events.filter((entry) => entry.event === 'range:change').map((entry) => entry.payload as RangeChange);

  return {
    manager,
    emitter,
    core,
    options,
    input,
    modal,
    hour,
    minutes,
    fromTab: query('.tp-ui-range-from'),
    toTab: query('.tp-ui-range-to'),
    fromTime: query('.tp-ui-range-from-time'),
    toTime: query('.tp-ui-range-to-time'),
    okButton,
    events,
    commit,
    typeInto,
    typePreview,
    changes,
  };
};

export { accessibleName, mountRangeManager };
export type { RangeChange, RangeHarness, RangeHarnessConfig, RangeHarnessOptions };
