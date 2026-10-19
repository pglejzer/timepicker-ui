import RangeManager from '@/managers/plugins/range/RangeManager';
import { EventEmitter, type TimepickerEventMap } from '@/utils/EventEmitter';

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
}

interface RangeHarness {
  readonly manager: RangeManager;
  readonly emitter: EventEmitter<TimepickerEventMap>;
  readonly core: Record<string, unknown>;
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
}

const RECORDED_EVENTS = ['error', 'range:switch', 'range:validation', 'range:confirm'] as const;

const mountRangeManager = (config: RangeHarnessConfig = {}): RangeHarness => {
  const { clockType = '24h', showSeconds = false, inputValue = '', isOpen = true } = config;

  const modal = document.createElement('div');
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

  const range: Record<string, unknown> = {
    enabled: true,
    minDuration: config.minDuration,
    maxDuration: config.maxDuration,
  };
  if (config.linked !== undefined) range.linked = config.linked;

  const core: Record<string, unknown> = {
    getModalElement: () => (isOpen ? modal : null),
    getInput: () => input,
    getHour: () => (isOpen ? hour : null),
    getMinutes: () => (isOpen ? minutes : null),
    getSeconds: () => null,
    getAM: () => null,
    getPM: () => null,
    getActiveType: () => undefined,
    getOkButton: () => (isOpen ? okButton : null),
    isOpen,
    options: { range, clock: { type: clockType, showSeconds } },
  };

  const emitter = new EventEmitter<TimepickerEventMap>();
  const events: RangeHarness['events'] = [];
  RECORDED_EVENTS.forEach((event) => {
    emitter.on(event, (payload: unknown) => {
      events.push({ event, payload });
    });
  });

  const manager = new RangeManager(core as never, emitter);
  manager.init();

  const commit = (h: string, m: string, type?: string): void => {
    emitter.emit('range:minute:commit', { hour: h, minutes: m, type });
  };

  return {
    manager,
    emitter,
    core,
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
  };
};

export { accessibleName, mountRangeManager };
export type { RangeHarness };
