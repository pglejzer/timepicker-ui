import { CoreState } from './CoreState';
import { Managers } from './Managers';
import { Lifecycle } from './Lifecycle';
import { EventEmitter, type TimepickerEventMap } from '../utils/EventEmitter';
import { generateUUID } from '../utils/config';
import { getInputValue } from '../utils/input';
import { mergeOptions } from '../utils/options';
import { getTimeFormat, isCompactWheelMode } from '../utils/options/predicates';
import { clockDegrees, formatTime, type ClockType, type TimeValue } from '../utils/time/parse';
import { sanitizeTimeInput } from '../utils/validation';
import type { TimepickerOptions } from '../types/options';
import type { UpdateEventData } from '../types/types';
import { isDocument, isNode } from '../utils/node';
import { getInlineContainer } from '../utils/dom';
import {
  resolveTimeFor,
  invalidTimeError,
  applyParsedTime,
  seedDegrees,
  syncPeriodIndicator,
  syncClockVisual,
} from './SetValue';

type Callback = () => void;

const instanceRegistry = new Map<string, TimepickerUI>();

export default class TimepickerUI {
  private readonly core: CoreState;
  private readonly managers: Managers;
  private readonly lifecycle: Lifecycle;
  private readonly emitter: EventEmitter<TimepickerEventMap>;

  constructor(selectorOrElement: string | HTMLElement, options?: TimepickerOptions) {
    if (isNode()) {
      throw new Error('TimepickerUI requires browser environment');
    }

    const element = this.resolveRootElement(selectorOrElement);
    if (!element) {
      throw new Error('Input element not found');
    }

    const customId = options?.behavior?.id;
    const instanceId = customId || `tp-ui-${generateUUID()}`;

    const mergedOptions = mergeOptions(options || {});

    if (mergedOptions.ui.inline?.enabled && typeof options?.behavior?.focusTrap === 'undefined') {
      mergedOptions.behavior.focusTrap = false;
    }

    if (mergedOptions.ui.inline?.enabled) {
      const { container, containerId } = mergedOptions.ui.inline;
      if (!container && !containerId) {
        throw new Error('inline.container is required when inline mode is enabled');
      }
      if (!getInlineContainer(mergedOptions.ui.inline)) {
        throw new Error('Inline container not found');
      }
    }

    this.emitter = new EventEmitter<TimepickerEventMap>();
    this.core = new CoreState(element, mergedOptions, instanceId, customId);

    const input = this.core.getInput();
    if (input) {
      const { type, showSeconds } = mergedOptions.clock;
      seedDegrees(this.core, getInputValue(input, type, undefined, undefined, !!showSeconds));
    }

    this.managers = new Managers(this.core, this.emitter);
    this.lifecycle = new Lifecycle(this.core, this.managers, this.emitter);

    this.managers.config.checkMobileOption();
    this.managers.config.preventClockTypeByCurrentTime();

    this.setupInternalEventListeners();

    instanceRegistry.set(this.core.instanceId, this);
  }

  private setupInternalEventListeners(): void {
    this.emitter.on('open:request', () => {
      if (!this.core.isDestroyed) {
        this.lifecycle.mount();
      }
    });

    this.emitter.on('cancel', () => {
      if (!this.core.isDestroyed) {
        this.lifecycle.discardSelection();
      }
    });

    this.emitter.on('confirm', (data) => {
      if (!this.core.isDestroyed) {
        if (this.core.options.range?.enabled) {
          return;
        }
        this.writeInputValue(data);
        if (!data.autoCommit) {
          this.lifecycle.closeUnlessInline();
        }
      }
    });

    this.emitter.on('update', (data) => {
      if (this.core.isDestroyed || this.core.options.range?.enabled) return;
      const { inline } = this.core.options.ui;
      if (!inline?.enabled || !inline.autoUpdate) return;
      this.writeInputValue(data);
    });

    this.emitter.on('range:confirm', (data) => {
      if (this.core.isDestroyed) return;

      const input = this.core.getInput();
      if (input) {
        input.value = `${data.from} - ${data.to}`;
      }
      this.lifecycle.closeUnlessInline();
    });

    this.emitter.on('select:am', () => this.emitter.emit('select:period', { type: 'AM' }));
    this.emitter.on('select:pm', () => this.emitter.emit('select:period', { type: 'PM' }));
  }

  private writeInputValue(data: UpdateEventData): void {
    if (!data.hour || !data.minutes) return;
    this.setInputText(formatTime(data as TimeValue, getTimeFormat(this.core.options)));
  }

  private setInputText(text: string): void {
    const input = this.core.getInput();
    if (!input) return;
    input.value = text;
    this.managers.validation.removeErrorHandler();
  }

  /**
   * Create the timepicker instance and render it in the DOM. If inline mode is enabled, the timepicker will be mounted immediately.
   */
  public create(): void {
    this.lifecycle.init();

    if (this.core.options.ui.inline?.enabled) {
      this.lifecycle.mount();
    }
  }

  /**
   * Open the timepicker, optionally executing a callback after opening.
   * @param callback - Optional callback to be executed after opening.
   */
  public open(callback?: Callback): void {
    this.lifecycle.mount();
    if (callback) callback();
  }

  /**
   * Close the timepicker. An inline picker is removed from its container until `open()` is called.
   * @param update - If true, the current selection is committed first, exactly like clicking OK: the input is updated and `confirm` is emitted (nothing is committed while OK is disabled). Otherwise the selection is discarded.
   * @param callback - Optional callback. With `update: true` it runs once the picker has closed; otherwise it runs immediately.
   */
  public close(update?: boolean, callback?: Callback): void {
    if (update) {
      this.lifecycle.unmount(callback, true);
      return;
    }

    this.lifecycle.unmount();
    if (callback) callback();
  }

  /**
   * Destroy the timepicker instance, removing all event listeners and DOM elements.
   * @param options - Optional parameters to control destruction behavior.
   *                  If a callback function is provided directly, it will be treated as the callback parameter.
   *                  If an options object is provided, it can include:
   *                  - keepInputValue: A boolean indicating whether to keep the input value after destruction (default: false).
   *                  - callback: An optional callback function to be executed after destruction.
   */
  public destroy(options?: { keepInputValue?: boolean; callback?: Callback } | Callback): void {
    instanceRegistry.delete(this.core.instanceId);
    this.lifecycle.destroy(options);
  }

  /**
   * Update the timepicker instance with new options. Options that fail validation (for example an invalid `clock.disabledTime`) are reported through the `error` event / `callbacks.onError`; the previous options stay in place and the callback is not run. When `clock.type` or `clock.showSeconds` changes, a valid time in the input, or both times of a range value (`from - to`), is rewritten in the new format (no `update` or `confirm` event); an empty or invalid input is left as it is. An open picker is re-rendered with the new options, and a selection that was not confirmed is reset to the input value.
   * @param value - The new options and optional create flag.
   * @param callback - Optional callback to be executed after update.
   * @deprecated Use `setOptions(options)`. Removed in 5.0.
   */
  public update(value: { options: TimepickerOptions; create?: boolean }, callback?: Callback): void {
    if (this.core.isDestroyed) return;
    if (!this.lifecycle.applyOptions(value.options)) return;

    if (this.core.isOpen) {
      this.lifecycle.rerender();
    }

    if (value.create) {
      this.create();
    }

    if (callback) callback();
  }

  /**
   * Set options at runtime. Options that fail validation (for example an invalid `clock.disabledTime`) are reported through the `error` event / `callbacks.onError` and the previous options stay in place. When `clock.type` or `clock.showSeconds` changes, a valid time in the input is rewritten in the new format. An open picker is re-rendered with the new options.
   * @param options - The options to change. Groups you leave out keep their values.
   */
  public setOptions(options: TimepickerOptions): void {
    this.update({ options });
  }

  /**
   * Get the current selected time value from the timepicker. While the picker is open this is the selection shown in it; otherwise, including while it is closing, it is the value in the input.
   * @returns An object containing the current hour, minutes, seconds (only with `clock.showSeconds`), type (if applicable), formatted time string, and degrees for hours and minutes.
   */
  public getValue(): {
    hour: string;
    minutes: string;
    /**
     * Present only with `clock.showSeconds`.
     */
    seconds?: string;
    type?: string;
    time: string;
    /**
     * @deprecated Internal clock-hand angle; use `hour` instead. Removed in 5.0.
     */
    degreesHours: number | null;
    /**
     * @deprecated Internal clock-hand angle; use `minutes` instead. Removed in 5.0.
     */
    degreesMinutes: number | null;
  } {
    if (this.core.isDestroyed) {
      return {
        hour: '',
        minutes: '',
        type: undefined,
        time: '',
        degreesHours: null,
        degreesMinutes: null,
      };
    }

    const format = getTimeFormat(this.core.options);
    const fallback: TimeValue = {
      hour: '12',
      minutes: '00',
      seconds: format.showSeconds ? '00' : undefined,
      type: format.clockType === '24h' ? undefined : 'AM',
    };
    const modal = this.core.getModalElement();
    const input = this.core.getInput();

    let value = fallback;

    if (modal && this.core.isOpen) {
      value = this.readOpenValue(format.clockType, fallback);
    } else if (input) {
      value = getInputValue(input, this.core.options.clock.type, undefined, undefined, format.showSeconds);
    }

    const { degreesHours, degreesMinutes } =
      modal || input ? clockDegrees(value) : { degreesHours: null, degreesMinutes: null };

    const result: ReturnType<TimepickerUI['getValue']> = {
      hour: value.hour,
      minutes: value.minutes,
      type: value.type,
      time: formatTime(value, format),
      degreesHours,
      degreesMinutes,
    };

    if (format.showSeconds) {
      result.seconds = value.seconds ?? fallback.seconds;
    }

    return result;
  }

  private readOpenValue(clockType: ClockType, fallback: TimeValue): TimeValue {
    const periodOf = (type: string | undefined): string | undefined => {
      if (clockType === '24h') return undefined;
      return type ?? 'AM';
    };

    if (isCompactWheelMode(this.core.options)) {
      const selection = this.managers.getPlugin('wheel')?.getSelection?.();
      if (!selection) return fallback;
      return {
        hour: selection.hour,
        minutes: selection.minutes,
        seconds: selection.seconds ?? fallback.seconds,
        type: periodOf(selection.type),
      };
    }

    return {
      hour: this.core.getHour()?.value || fallback.hour,
      minutes: this.core.getMinutes()?.value || fallback.minutes,
      seconds: this.core.getSeconds()?.value || fallback.seconds,
      type: periodOf(this.core.getActiveType()),
    };
  }

  /**
   * Set the timepicker value programmatically.
   * @param time - The time string to set: "HH:MM" for 24h or "HH:MM AM/PM" for 12h. With `clock.showSeconds` also "HH:MM:SS" / "HH:MM:SS AM/PM"; a value without seconds means ":00". Without `clock.showSeconds` seconds in the string are accepted and dropped. A valid time in the other clock format is converted: "2:30 PM" sets 14:30 in a 24h picker, "00:15" sets 12:15 AM in a 12h picker. A string that is not a valid time in either format changes nothing and emits `error` (`callbacks.onError`); an empty string is ignored.
   * @param updateInput - If true, the input field will be updated with the new time value. Default is true.
   */
  public setValue(time: string, updateInput: boolean = true): void {
    if (this.core.isDestroyed) return;
    if (typeof time !== 'string' || !time.trim()) return;

    if (!this.core.isInitialized) {
      this.create();
      if (this.core.isDestroyed) return;
    }

    const resolved = resolveTimeFor(this.core, sanitizeTimeInput(time.trim()));
    if (!resolved) {
      this.emitter.emit('error', invalidTimeError(this.core));
      return;
    }

    const { parsed, inputText } = resolved;
    applyParsedTime(this.core, parsed);
    syncPeriodIndicator(this.core, parsed.type);

    if (updateInput) {
      this.setInputText(inputText);
    }

    syncClockVisual(this.core, this.managers, parsed);
  }

  /**
   * Get the root element of the timepicker instance.
   * @returns - The HTMLElement that serves as the root of the timepicker instance.
   */
  public getElement(): HTMLElement {
    return this.core.element;
  }

  /**
   * Get the unique instance ID of the timepicker.
   * @return - The unique instance ID as a string.
   */
  public get instanceId(): string {
    return this.core.instanceId;
  }

  /**
   * Get the current options of the timepicker instance.
   * @returns - The current options of the timepicker instance.
   */
  public get options(): Required<TimepickerOptions> {
    return this.core.options;
  }

  /**
   * Check if the timepicker instance is currently initialized.
   * @returns - True if the instance is initialized, false otherwise.
   */
  public get isInitialized(): boolean {
    return this.core.isInitialized;
  }

  /**
   * Check if the timepicker instance has been destroyed.
   * @returns - True if the instance is destroyed, false otherwise.
   */
  public get isDestroyed(): boolean {
    return this.core.isDestroyed;
  }

  /**
   * Get the hour input element of the timepicker instance.
   * @returns - The HTMLInputElement for the hour input, or null if not found.
   */
  public get hour(): HTMLInputElement | null {
    return this.core.getHour();
  }

  /**
   * Get the minutes input element of the timepicker instance.
   * @returns - The HTMLInputElement for the minutes input, or null if not found.
   */
  public get minutes(): HTMLInputElement | null {
    return this.core.getMinutes();
  }

  /**
   * Get the OK button element of the timepicker instance.
   * @returns - The HTMLButtonElement for the OK button, or null if not found.
   */
  public get okButton(): HTMLButtonElement | null {
    return this.core.getOkButton();
  }

  /**
   * Get the Cancel button element of the timepicker instance.
   * @returns - The HTMLButtonElement for the Cancel button, or null if not found.
   */
  public get cancelButton(): HTMLButtonElement | null {
    return this.core.getCancelButton();
  }

  /**
   * Get the clock hand element of the timepicker instance.
   * @returns - The HTMLDivElement for the clock hand, or null if not found.
   */
  public get clockHand(): HTMLDivElement | null {
    return this.core.getClockHand();
  }

  /**
   * Subscribe to a timepicker event with a handler function.
   * @param event - The name of the event to subscribe to.
   * @param handler - The function to handle the event.
   * @returns - void
   */
  public on<K extends keyof TimepickerEventMap>(
    event: K,
    handler: (data: TimepickerEventMap[K]) => void,
  ): void {
    if (this.core.isDestroyed) return;
    this.emitter.on(event, handler);
  }

  /**
   * Subscribe to a timepicker event with a handler function that will be called only once.
   * @param event - The name of the event to subscribe to.
   * @param handler - The function to handle the event.
   * @returns - void
   */
  public once<K extends keyof TimepickerEventMap>(
    event: K,
    handler: (data: TimepickerEventMap[K]) => void,
  ): void {
    if (this.core.isDestroyed) return;
    this.emitter.once(event, handler);
  }

  /**
   * Unsubscribe from a timepicker event. If a handler is provided, only that handler will be removed. If no handler is provided, all handlers for the event will be removed.
   * @param event - The name of the event to unsubscribe from.
   * @param handler - The function to handle the event.
   * @returns - void
   */
  public off<K extends keyof TimepickerEventMap>(
    event: K,
    handler?: (data: TimepickerEventMap[K]) => void,
  ): void {
    if (this.core.isDestroyed) return;
    this.emitter.off(event, handler);
  }

  private resolveRootElement(selectorOrElement: string | HTMLElement): HTMLElement | null {
    if (isDocument() === false) {
      return null;
    }

    const target =
      typeof selectorOrElement === 'string' ? document.querySelector(selectorOrElement) : selectorOrElement;
    if (!(target instanceof HTMLElement)) return null;

    if (target.tagName !== 'INPUT') {
      if (!target.querySelector('input')) return null;
      target.classList.add('tp-ui');
      return target;
    }

    const parent = target.parentElement;
    if (parent?.classList.contains('tp-ui')) return parent;

    const wrapper = document.createElement('div');
    wrapper.className = 'tp-ui';
    target.before(wrapper);
    wrapper.appendChild(target);
    return wrapper;
  }

  /**
   * Get a timepicker instance by its unique ID.
   * @param id - The unique instance ID of the timepicker to retrieve.
   * @returns - The timepicker instance if found, otherwise undefined.
   */
  static getById(id: string): TimepickerUI | undefined {
    return instanceRegistry.get(id);
  }

  /**
   * Get all existing timepicker instances.
   * @returns - An array of all timepicker instances.
   */
  static getAllInstances(): TimepickerUI[] {
    return Array.from(instanceRegistry.values());
  }

  /**
   * Check whether the given selector or element exists in the document. Always false outside a browser. It does not check that the element is, or contains, an input.
   * @param selectorOrElement - A CSS selector string or an HTMLElement to look up.
   * @returns - True if the selector matches an element in the document, or the element is attached to the document; false otherwise.
   */
  static isAvailable(selectorOrElement: string | HTMLElement): boolean {
    if (isNode()) {
      return false;
    }

    if (typeof selectorOrElement === 'string') {
      return document.querySelector(selectorOrElement) !== null;
    } else if (selectorOrElement instanceof HTMLElement) {
      return document.contains(selectorOrElement);
    }
    return false;
  }

  /**
   * Destroy all existing timepicker instances. This method iterates through all registered instances, calls their destroy method, and clears the instance registry.
   */
  static destroyAll(): void {
    const instances = Array.from(instanceRegistry.values());
    instances.forEach((instance) => instance.destroy());
    instanceRegistry.clear();
  }
}
