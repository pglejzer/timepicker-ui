import type { CoreState } from '../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../utils/EventEmitter';
import { getTimezoneList, getLocalTimezone, clearTimezoneCache, type TimezoneInfo } from '../utils/timezone';
import { isDocument } from '../utils/node';

export default class TimezoneManager {
  private core: CoreState;
  private emitter: EventEmitter<TimepickerEventMap>;
  private selectedTimezone: string | null = null;
  private cleanupHandlers: Array<() => void> = [];

  constructor(core: CoreState, emitter: EventEmitter<TimepickerEventMap>) {
    this.core = core;
    this.emitter = emitter;
  }

  private get isEnabled(): boolean {
    return this.core.options.timezone?.enabled === true;
  }

  private getSelector(): HTMLSelectElement | null {
    return this.core.getModalElement()?.querySelector('.tp-ui-timezone-select') ?? null;
  }

  init(): void {
    if (!this.isEnabled || !isDocument()) return;

    const selector = this.getSelector();
    if (!selector) return;

    this.populateOptions(selector);
    this.setDefaultValue(selector);
    this.bindEvents(selector);
  }

  private populateOptions(selector: HTMLSelectElement): void {
    const { whitelist } = this.core.options.timezone ?? {};
    const timezones = getTimezoneList(whitelist);

    selector.innerHTML = timezones
      .map((tz: TimezoneInfo) => `<option value="${tz.id}">${tz.label}</option>`)
      .join('');
  }

  private setDefaultValue(selector: HTMLSelectElement): void {
    const defaultTz = this.core.options.timezone?.default ?? getLocalTimezone();
    this.selectedTimezone = defaultTz;
    selector.value = defaultTz;

    if (!selector.value && selector.options.length > 0) {
      selector.value = selector.options[0].value;
      this.selectedTimezone = selector.value;
    }
  }

  private bindEvents(selector: HTMLSelectElement): void {
    const handler = (e: Event): void => {
      const target = e.target as HTMLSelectElement;
      this.selectedTimezone = target.value;
      this.emitter.emit('timezone:change', { timezone: this.selectedTimezone });
    };

    selector.addEventListener('change', handler);
    this.cleanupHandlers.push(() => selector.removeEventListener('change', handler));
  }

  getSelectedTimezone(): string | null {
    return this.selectedTimezone;
  }

  setTimezone(timezoneId: string): void {
    if (!this.isEnabled) return;

    const selector = this.getSelector();
    if (selector) {
      selector.value = timezoneId;
      this.selectedTimezone = timezoneId;
    }
  }

  destroy(): void {
    this.cleanupHandlers.forEach((fn) => fn());
    this.cleanupHandlers = [];
    this.selectedTimezone = null;
    clearTimezoneCache();
  }
}

