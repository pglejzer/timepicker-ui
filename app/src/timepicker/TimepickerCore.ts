import { createObjectFromData, getConfig, generateUUID } from '../utils/config';
import { getInputValue } from '../utils/input';
import { options as optionsDefault } from '../utils/options';
import type { OptionTypes } from '../types/types';
import ClockFaceManagerPool from '../managers/ClockFaceManagerPool';
import EventManager from '../managers/EventManager';
import ModalManager from '../managers/ModalManager';
import AnimationManager from '../managers/AnimationManager';
import ClockManager from '../managers/ClockManager';
import ValidationManager from '../managers/ValidationManager';
import ThemeManager from '../managers/ThemeManager';
import ConfigManager from '../managers/ConfigManager';
import { EventEmitter, type TimepickerEventMap } from '../utils/EventEmitter';
import { DOMUpdateBatcher } from '../utils/DOMUpdateBatcher';

export default class TimepickerCore {
  _degreesHours: number | null = null;
  _degreesMinutes: number | null = null;
  _options!: OptionTypes;
  _eventsClickMobile: (event: Event) => Promise<void> = () => Promise.resolve();
  _eventsClickMobileHandler: EventListenerOrEventListenerObject = () => {};
  _mutliEventsMove: (event: Event) => void = () => {};
  _mutliEventsMoveHandler!: EventListenerOrEventListenerObject;
  _clickTouchEvents!: string[];
  _element!: HTMLElement;
  _instanceId: string;
  _isMobileView!: boolean | null;
  _isTouchMouseMove!: boolean | null;
  _disabledTime!: {
    value?: {
      isInterval?: boolean;
      intervals?: string[];
      clockType?: string;
      hours?: string[];
      minutes?: string[];
    };
  } | null;
  _cloned!: Node | null;
  _inputEvents!: string[];
  _isModalRemove?: boolean;
  _isInitialized = false;
  _customId?: string;
  _eventHandlersRegistered = false;
  _isDestroyed = false;
  _pendingThemeConfig?: {
    primaryColor?: string;
    backgroundColor?: string;
    surfaceColor?: string;
    surfaceHoverColor?: string;
    textColor?: string;
    secondaryTextColor?: string;
    disabledTextColor?: string;
    onPrimaryColor?: string;
    borderColor?: string;
    shadow?: string;
    borderRadius?: string;
    fontFamily?: string;
  };

  clockFacePool!: ClockFaceManagerPool;
  eventManager!: EventManager;
  modalManager!: ModalManager;
  animationManager!: AnimationManager;
  clockManager!: ClockManager;
  validationManager!: ValidationManager;
  themeManager!: ThemeManager;
  configManager!: ConfigManager;
  domBatcher!: DOMUpdateBatcher;

  private _eventEmitter: EventEmitter<TimepickerEventMap>;

  constructor(selectorOrElement: string | HTMLElement, options?: OptionTypes) {
    if (typeof window === 'undefined') {
      throw new Error('TimepickerUI: Cannot initialize in non-browser environment (SSR/Node.js)');
    }

    this._eventEmitter = new EventEmitter<TimepickerEventMap>();
    this.domBatcher = new DOMUpdateBatcher();

    const customId = options?.id;
    this._customId = customId;
    this._instanceId = customId || `timepicker-ui-${generateUUID()}`;

    let element: HTMLElement | null = null;
    if (typeof selectorOrElement === 'string') {
      element = document.querySelector(selectorOrElement);
      if (!element) {
        console.error(`TimepickerUI: Element with selector "${selectorOrElement}" not found`);
        this._isDestroyed = true;
        return;
      }
    } else if (selectorOrElement instanceof HTMLElement) {
      element = selectorOrElement;
    } else {
      console.error('TimepickerUI: First parameter must be a string selector or HTMLElement');
      this._isDestroyed = true;
      return;
    }

    let targetInput: HTMLInputElement | null = null;
    if (element.tagName === 'INPUT') {
      targetInput = element as HTMLInputElement;
    } else {
      targetInput = element.querySelector('input');
    }

    if (!targetInput) {
      const elementDesc =
        typeof selectorOrElement === 'string' ? `selector "${selectorOrElement}"` : 'provided element';
      throw new Error(`TimepickerUI: No input element found for ${elementDesc}`);
    }

    if (element.tagName === 'INPUT') {
      const wrapper = document.createElement('div');
      wrapper.className = 'timepicker-ui';
      element.parentNode?.insertBefore(wrapper, element);
      wrapper.appendChild(element);
      this._element = wrapper;
    } else {
      this._element = element as HTMLElement;
      if (!this._element.classList.contains('timepicker-ui')) {
        this._element.classList.add('timepicker-ui');
      }
    }

    this._cloned = null;

    const datasetOptions = createObjectFromData(this._element?.dataset);
    this._options = {
      ...getConfig({ ...optionsDefault, ...options, ...datasetOptions }, optionsDefault),
    };

    if (this._options.inline?.enabled && typeof options?.focusTrap === 'undefined') {
      this._options.focusTrap = false;
    }

    this._isTouchMouseMove = false;
    this._degreesHours =
      Number(
        getInputValue(this._element?.querySelector('input') as HTMLInputElement, this._options.clockType)
          .hour,
      ) * 30;
    this._degreesMinutes =
      Number(
        getInputValue(this._element?.querySelector('input') as HTMLInputElement, this._options.clockType)
          .minutes,
      ) * 6;

    this._isMobileView = false;

    this._mutliEventsMove = (event) => this.eventManager.handleEventToMoveHand(event as TouchEvent);
    this._mutliEventsMoveHandler = this._mutliEventsMove.bind(this);

    this._eventsClickMobile = (event) => this.eventManager.handlerClickHourMinutes(event);
    this._eventsClickMobileHandler = this._eventsClickMobile.bind(this);

    this.clockFacePool = new ClockFaceManagerPool();
    this.eventManager = new EventManager(this as unknown as import('../types/ITimepickerUI').ITimepickerUI);
    this.modalManager = new ModalManager(this as unknown as import('../types/ITimepickerUI').ITimepickerUI);
    this.animationManager = new AnimationManager(
      this as unknown as import('../types/ITimepickerUI').ITimepickerUI,
    );
    this.clockManager = new ClockManager(this as unknown as import('../types/ITimepickerUI').ITimepickerUI);
    this.validationManager = new ValidationManager(
      this as unknown as import('../types/ITimepickerUI').ITimepickerUI,
    );
    this.themeManager = new ThemeManager(this as unknown as import('../types/ITimepickerUI').ITimepickerUI);
    this.configManager = new ConfigManager(this as unknown as import('../types/ITimepickerUI').ITimepickerUI);

    this.configManager.checkMobileOption();

    this._clickTouchEvents = ['click', 'mousedown', 'touchstart'];
    this._inputEvents = ['change', ...this._clickTouchEvents];

    this._disabledTime = null;

    this.configManager.preventClockTypeByCurrentTime();

    this._isModalRemove = true;
    this._isInitialized = false;

    if (this._options.inline?.enabled) {
      if (!this._options.inline.containerId) {
        console.error('TimepickerUI: containerId is required when inline mode is enabled');
        throw new Error('TimepickerUI: containerId is required when inline mode is enabled');
      }

      const containerElement = document.getElementById(this._options.inline.containerId);
      if (!containerElement) {
        console.error(
          `TimepickerUI: Container element with ID "${this._options.inline.containerId}" not found`,
        );
        throw new Error(
          `TimepickerUI: Container element with ID "${this._options.inline.containerId}" not found`,
        );
      }
    }
  }

  get modalTemplate() {
    const { getMobileModalTemplate, getModalTemplate } = require('../utils/template');
    if (!this._options.mobile || !this._isMobileView) {
      return getModalTemplate(this._options, this._instanceId);
    }
    return getMobileModalTemplate(this._options, this._instanceId);
  }

  get modalElement() {
    return document.querySelector(`[data-owner-id="${this._instanceId}"]`) as HTMLDivElement;
  }

  get clockFace() {
    return this.modalElement?.querySelector('.timepicker-ui-clock-face') as HTMLDivElement;
  }

  get input() {
    return this._element?.querySelector('input') as HTMLInputElement;
  }

  get clockHand() {
    return this.modalElement?.querySelector('.timepicker-ui-clock-hand') as HTMLDivElement;
  }

  get circle() {
    return this.modalElement?.querySelector('.timepicker-ui-circle-hand') as HTMLDivElement;
  }

  get tipsWrapper() {
    return this.modalElement?.querySelector('.timepicker-ui-tips-wrapper') as HTMLDivElement;
  }

  get tipsWrapperFor24h() {
    return this.modalElement?.querySelector('.timepicker-ui-tips-wrapper-24h') as HTMLDivElement;
  }

  get minutes() {
    return this.modalElement?.querySelector('.timepicker-ui-minutes') as HTMLInputElement;
  }

  get hour() {
    return this.modalElement?.querySelector('.timepicker-ui-hour') as HTMLInputElement;
  }

  get AM() {
    return this.modalElement?.querySelector('.timepicker-ui-am') as HTMLDivElement;
  }

  get PM() {
    return this.modalElement?.querySelector('.timepicker-ui-pm') as HTMLDivElement;
  }

  get minutesTips() {
    return this.modalElement?.querySelector('.timepicker-ui-minutes-time') as HTMLDivElement;
  }

  get hourTips() {
    return this.modalElement?.querySelector('.timepicker-ui-hour-time-12') as HTMLDivElement;
  }

  get allValueTips() {
    const modal = this.modalElement;
    if (!modal) return [] as const as Array<HTMLDivElement>;

    return [
      ...modal.querySelectorAll('.timepicker-ui-value-tips'),
      ...modal.querySelectorAll('.timepicker-ui-value-tips-24h'),
    ] as const as Array<HTMLDivElement>;
  }

  get openElementData() {
    const data: NodeListOf<HTMLElement> = this._element?.querySelectorAll('[data-open]');

    if (data?.length > 0) {
      const arr: string[] = [];

      data.forEach(({ dataset }) => arr.push(dataset.open ?? ''));
      return [...new Set(arr)];
    }

    return null;
  }

  get openElement(): NodeListOf<Element> | readonly [HTMLInputElement] {
    if (this.openElementData === null) {
      this.input?.setAttribute('data-open', 'timepicker-ui-input');

      return [this.input] as const;
    }

    return (
      this.openElementData.map((open) => this._element?.querySelectorAll(`[data-open='${open}']`))[0] ?? ''
    );
  }

  get cancelButton() {
    return this.modalElement?.querySelector('.timepicker-ui-cancel-btn') as HTMLButtonElement;
  }

  get okButton() {
    return this.modalElement?.querySelector('.timepicker-ui-ok-btn') as HTMLButtonElement;
  }

  get activeTypeMode() {
    return this.modalElement?.querySelector('.timepicker-ui-type-mode.active') as HTMLButtonElement;
  }

  get keyboardClockIcon() {
    return this.modalElement?.querySelector('.timepicker-ui-keyboard-icon-wrapper') as HTMLButtonElement;
  }

  get footer() {
    return this.modalElement?.querySelector('.timepicker-ui-footer') as HTMLDivElement;
  }

  get wrapper() {
    return this.modalElement?.querySelector('.timepicker-ui-wrapper') as HTMLDivElement;
  }

  public getElement(): HTMLElement {
    return this._element;
  }

  public on<K extends keyof TimepickerEventMap>(
    event: K,
    handler: (data: TimepickerEventMap[K]) => void,
  ): void {
    if (this._isDestroyed) {
      console.warn('TimepickerUI: Cannot add event listener - instance failed to initialize');
      return;
    }
    this._eventEmitter.on(event, handler);
  }

  public once<K extends keyof TimepickerEventMap>(
    event: K,
    handler: (data: TimepickerEventMap[K]) => void,
  ): void {
    if (this._isDestroyed) {
      console.warn('TimepickerUI: Cannot add event listener - instance failed to initialize');
      return;
    }
    this._eventEmitter.once(event, handler);
  }

  public off<K extends keyof TimepickerEventMap>(
    event: K,
    handler?: (data: TimepickerEventMap[K]) => void,
  ): void {
    if (this._isDestroyed) {
      console.warn('TimepickerUI: Cannot remove event listener - instance failed to initialize');
      return;
    }
    this._eventEmitter.off(event, handler);
  }

  protected emit<K extends keyof TimepickerEventMap>(event: K, data?: TimepickerEventMap[K]): void {
    this._eventEmitter.emit(event, data);
  }

  protected _applyThemeToWrapper(wrapper: HTMLElement): void {
    if (!this._pendingThemeConfig) return;

    const cssVarMap = {
      primaryColor: '--timepicker-primary',
      backgroundColor: '--timepicker-bg',
      surfaceColor: '--timepicker-surface',
      surfaceHoverColor: '--timepicker-surface-hover',
      textColor: '--timepicker-text',
      secondaryTextColor: '--timepicker-secondary-text',
      disabledTextColor: '--timepicker-disabled-text',
      onPrimaryColor: '--timepicker-on-primary',
      borderColor: '--timepicker-border',
      shadow: '--timepicker-shadow',
      borderRadius: '--timepicker-border-radius',
      fontFamily: '--timepicker-font-family',
    };

    Object.entries(this._pendingThemeConfig).forEach(([key, value]) => {
      if (value && cssVarMap[key as keyof typeof cssVarMap]) {
        wrapper.style.setProperty(cssVarMap[key as keyof typeof cssVarMap], value);
      }
    });
  }
}

