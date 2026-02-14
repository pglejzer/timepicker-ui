import { CoreState } from './CoreState';
import { Managers } from './Managers';
import { Lifecycle } from './Lifecycle';
import { EventEmitter, type TimepickerEventMap } from '../utils/EventEmitter';
import { generateUUID } from '../utils/config';
import { getInputValue } from '../utils/input';
import { mergeOptions } from '../utils/options';
import { sanitizeTimeInput } from '../utils/validation';
import type { TimepickerOptions } from '../types/options';
import { isDocument, isNode } from '../utils/node';

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

    const targetInput = this.resolveInputElement(selectorOrElement);
    if (!targetInput) {
      throw new Error('Input element not found');
    }

    const customId = options?.behavior?.id;
    const instanceId = customId || `tp-ui-${generateUUID()}`;
    const element = this.createWrapperElement(targetInput);

    const mergedOptions = mergeOptions(options || {});

    if (mergedOptions.ui.inline?.enabled && typeof options?.behavior?.focusTrap === 'undefined') {
      mergedOptions.behavior.focusTrap = false;
    }

    if (mergedOptions.ui.inline?.enabled) {
      if (!mergedOptions.ui.inline.containerId) {
        throw new Error('inline.containerId is required when inline mode is enabled');
      }

      if (!isNode()) {
        const containerElement = document.getElementById(mergedOptions.ui.inline.containerId);
        if (!containerElement) {
          throw new Error(`Container element with id "${mergedOptions.ui.inline.containerId}" not found`);
        }
      }
    }

    this.emitter = new EventEmitter<TimepickerEventMap>();
    this.core = new CoreState(element, mergedOptions, instanceId, customId);

    const input = this.core.getInput();
    if (input) {
      const inputValue = getInputValue(input, mergedOptions.clock.type);
      const degreesHours = Number(inputValue.hour) * 30;
      const degreesMinutes = Number(inputValue.minutes) * 6;
      this.core.setDegreesHours(degreesHours);
      this.core.setDegreesMinutes(degreesMinutes);
    }

    this.managers = new Managers(this.core, this.emitter);
    this.lifecycle = new Lifecycle(this.core, this.managers, this.emitter);

    this.managers.config.checkMobileOption();
    this.managers.config.preventClockTypeByCurrentTime();

    this.setupInternalEventListeners();

    instanceRegistry.set(this.core.instanceId, this);
  }

  private setupInternalEventListeners(): void {
    this.emitter.on('show', () => {
      if (!this.core.isDestroyed) {
        this.lifecycle.mount();
      }
    });

    this.emitter.on('cancel', () => {
      if (!this.core.isDestroyed) {
        this.lifecycle.unmount();
      }
    });

    this.emitter.on('confirm', (data) => {
      if (!this.core.isDestroyed) {
        if (this.core.options.range?.enabled) {
          return;
        }
        const input = this.core.getInput();
        if (input && data.hour && data.minutes) {
          const type = data.type ? ` ${data.type}` : '';
          input.value = `${data.hour}:${data.minutes}${type}`;
        }
        this.lifecycle.unmount();
      }
    });

    this.emitter.on('range:confirm', (data) => {
      if (this.core.isDestroyed) return;

      const input = this.core.getInput();
      if (input) {
        input.value = `${data.from} - ${data.to}`;
      }
      this.lifecycle.unmount();
    });
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
   * Close the timepicker, optionally updating the input value before closing.
   * @param update - If true, the input value will be updated with the current selection before closing.
   * @param callback - Optional callback to be executed after closing.
   */
  public close(update?: boolean, callback?: Callback): void {
    this.lifecycle.unmount(update ? callback : undefined);
    if (!update && callback) callback();
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
   * Update the timepicker instance with new options.
   * @param value - The new options and optional create flag.
   * @param callback - Optional callback to be executed after update.
   */
  public update(value: { options: TimepickerOptions; create?: boolean }, callback?: Callback): void {
    if (this.core.isDestroyed) return;

    this.core.updateOptions(value.options);
    this.managers.config.checkMobileOption();
    this.managers.config.getDisableTime();

    if (value.create) {
      this.create();
    }

    if (callback) callback();
  }

  /**
   * Get the current selected time value from the timepicker.
   * @returns An object containing the current hour, minutes, type (if applicable), formatted time string, and degrees for hours and minutes.
   */
  public getValue(): {
    hour: string;
    minutes: string;
    type?: string;
    time: string;
    degreesHours: number | null;
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

    const modal = this.core.getModalElement();
    const input = this.core.getInput();

    let currentHour = '12';
    let currentMinutes = '00';
    let currentType: string | undefined = this.core.options.clock.type === '24h' ? undefined : 'AM';
    let degreesHours: number | null = null;
    let degreesMinutes: number | null = null;

    if (modal) {
      const hour = this.core.getHour();
      const minutes = this.core.getMinutes();
      const activeTypeMode = this.core.getActiveTypeMode();

      currentHour = hour?.value || '12';
      currentMinutes = minutes?.value || '00';
      currentType = this.core.options.clock.type === '24h' ? undefined : activeTypeMode?.textContent || 'AM';

      degreesHours = this.core.degreesHours;
      degreesMinutes = this.core.degreesMinutes;
    } else if (input) {
      const inputValue = getInputValue(input, this.core.options.clock.type);
      currentHour = inputValue.hour;
      currentMinutes = inputValue.minutes;
      currentType = inputValue.type;

      degreesHours = Number(currentHour) * 30;
      degreesMinutes = Number(currentMinutes) * 6;
    }

    let timeString = '';
    if (this.core.options.clock.type === '24h') {
      timeString = `${currentHour.padStart(2, '0')}:${currentMinutes.padStart(2, '0')}`;
    } else {
      timeString = `${currentHour}:${currentMinutes.padStart(2, '0')} ${currentType}`;
    }

    return {
      hour: currentHour,
      minutes: currentMinutes,
      type: currentType,
      time: timeString,
      degreesHours,
      degreesMinutes,
    };
  }

  /**
   * Set the timepicker value programmatically.
   * @param time - The time string to set, in the format "HH:MM" for 24h or "HH:MM AM/PM" for 12h.
   * @param updateInput - If true, the input field will be updated with the new time value. Default is true.
   */
  public setValue(time: string, updateInput: boolean = true): void {
    if (this.core.isDestroyed) return;
    if (!time || typeof time !== 'string') return;

    if (!this.core.isInitialized) {
      this.create();
    }

    const trimmedTime = sanitizeTimeInput(time.trim());
    let hourValue = '12';
    let minutesValue = '00';
    let typeValue = 'AM';

    try {
      if (this.core.options.clock.type === '24h') {
        const timeMatch = trimmedTime.match(/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/);
        if (!timeMatch) {
          throw new Error('Invalid 24h format. Expected HH:MM');
        }
        hourValue = timeMatch[1].padStart(2, '0');
        minutesValue = timeMatch[2];
      } else {
        const timeMatch = trimmedTime.match(/^(1[0-2]|[1-9]):([0-5][0-9])\s*(AM|PM)$/i);
        if (!timeMatch) {
          throw new Error('Invalid 12h format. Expected HH:MM AM/PM');
        }
        hourValue = timeMatch[1];
        minutesValue = timeMatch[2];
        typeValue = timeMatch[3].toUpperCase();
      }

      const hour = this.core.getHour();
      const minutes = this.core.getMinutes();
      const AM = this.core.getAM();
      const PM = this.core.getPM();

      if (hour) {
        hour.value = hourValue;
        hour.setAttribute('aria-valuenow', hourValue);
        this.core.setDegreesHours(Number(hourValue) * 30);
      }

      if (minutes) {
        minutes.value = minutesValue;
        minutes.setAttribute('aria-valuenow', minutesValue);
        this.core.setDegreesMinutes(Number(minutesValue) * 6);
      }

      if (this.core.options.clock.type !== '24h' && AM && PM) {
        if (typeValue === 'AM') {
          AM.classList.add('active');
          PM.classList.remove('active');
        } else {
          PM.classList.add('active');
          AM.classList.remove('active');
        }
      }

      if (updateInput) {
        const input = this.core.getInput();
        if (input) {
          input.value = trimmedTime;
        }
      }

      const clockHand = this.core.getClockHand();
      if (clockHand) {
        clockHand.style.transform = `rotateZ(${this.core.degreesHours || 0}deg)`;
      }
    } catch (error) {
      return;
    }
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

  private resolveInputElement(selectorOrElement: string | HTMLElement): HTMLInputElement | null {
    if (isDocument() === false) {
      return null;
    }

    let element: HTMLElement | null = null;

    if (typeof selectorOrElement === 'string') {
      element = document.querySelector(selectorOrElement);
      if (!element) return null;
    } else if (selectorOrElement instanceof HTMLElement) {
      element = selectorOrElement;
    } else {
      return null;
    }

    if (element.tagName === 'INPUT') {
      return element as HTMLInputElement;
    }

    const inputElement = element.querySelector('input');
    return inputElement;
  }

  private createWrapperElement(inputElement: HTMLInputElement): HTMLElement {
    if (isDocument() === false) {
      return inputElement;
    }

    const parentElement = inputElement.parentElement;

    if (inputElement.tagName === 'INPUT' && !parentElement?.classList.contains('tp-ui')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'tp-ui';
      inputElement.parentNode?.insertBefore(wrapper, inputElement);
      wrapper.appendChild(inputElement);
      return wrapper;
    }

    if (parentElement && !parentElement.classList.contains('tp-ui')) {
      parentElement.classList.add('tp-ui');
    }

    return parentElement || inputElement;
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
   *  Check if a timepicker instance can be created for the given selector or element. This method verifies that the environment is a browser, the element exists in the DOM, and is either an input or contains an input.
   * @param selectorOrElement - A CSS selector string or an HTMLElement to check for timepicker availability.
   * @returns - True if a timepicker instance can be created for the given selector or element, false otherwise.
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
