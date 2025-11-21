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

    // Merge with defaults
    const mergedOptions = mergeOptions(options || {});

    // Handle inline mode defaults
    if (mergedOptions.ui.inline?.enabled && typeof options?.behavior?.focusTrap === 'undefined') {
      mergedOptions.behavior.focusTrap = false;
    }

    // Validate inline container
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
        const input = this.core.getInput();
        if (input && data.hour && data.minutes) {
          const type = data.type ? ` ${data.type}` : '';
          input.value = `${data.hour}:${data.minutes}${type}`;
        }
        this.lifecycle.unmount();
      }
    });
  }

  public create(): void {
    this.lifecycle.init();

    if (this.core.options.ui.inline?.enabled) {
      this.lifecycle.mount();
    }
  }

  public open(callback?: Callback): void {
    this.lifecycle.mount();
    if (callback) callback();
  }

  public close(update?: boolean, callback?: Callback): void {
    this.lifecycle.unmount(update ? callback : undefined);
    if (!update && callback) callback();
  }

  public destroy(options?: { keepInputValue?: boolean; callback?: Callback } | Callback): void {
    instanceRegistry.delete(this.core.instanceId);
    this.lifecycle.destroy(options);
  }

  public update(value: { options: TimepickerOptions; create?: boolean }, callback?: Callback): void {
    if (this.core.isDestroyed) return;

    this.core.updateOptions(value.options);
    this.managers.config.checkMobileOption();

    if (value.create) {
      this.create();
    }

    if (callback) callback();
  }

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

    const hour = this.core.getHour();
    const minutes = this.core.getMinutes();
    const activeTypeMode = this.core.getActiveTypeMode();

    const currentHour = hour?.value || '12';
    const currentMinutes = minutes?.value || '00';
    const currentType =
      this.core.options.clock.type === '24h' ? undefined : activeTypeMode?.textContent || 'AM';

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
      degreesHours: this.core.degreesHours,
      degreesMinutes: this.core.degreesMinutes,
    };
  }

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

  public getElement(): HTMLElement {
    return this.core.element;
  }

  public get instanceId(): string {
    return this.core.instanceId;
  }

  public get options(): Required<TimepickerOptions> {
    return this.core.options;
  }

  public get isInitialized(): boolean {
    return this.core.isInitialized;
  }

  public get isDestroyed(): boolean {
    return this.core.isDestroyed;
  }

  public get hour(): HTMLInputElement | null {
    return this.core.getHour();
  }

  public get minutes(): HTMLInputElement | null {
    return this.core.getMinutes();
  }

  public get okButton(): HTMLButtonElement | null {
    return this.core.getOkButton();
  }

  public get cancelButton(): HTMLButtonElement | null {
    return this.core.getCancelButton();
  }

  public get clockHand(): HTMLDivElement | null {
    return this.core.getClockHand();
  }

  public on<K extends keyof TimepickerEventMap>(
    event: K,
    handler: (data: TimepickerEventMap[K]) => void,
  ): void {
    if (this.core.isDestroyed) return;
    this.emitter.on(event, handler);
  }

  public once<K extends keyof TimepickerEventMap>(
    event: K,
    handler: (data: TimepickerEventMap[K]) => void,
  ): void {
    if (this.core.isDestroyed) return;
    this.emitter.once(event, handler);
  }

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

  static getById(id: string): TimepickerUI | undefined {
    return instanceRegistry.get(id);
  }

  static getAllInstances(): TimepickerUI[] {
    return Array.from(instanceRegistry.values());
  }

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

  static destroyAll(): void {
    const instances = Array.from(instanceRegistry.values());
    instances.forEach((instance) => instance.destroy());
    instanceRegistry.clear();
  }
}

