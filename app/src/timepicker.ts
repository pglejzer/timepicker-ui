/* eslint-disable no-useless-return */
import { createObjectFromData, getConfig, initCallback, generateUUID } from './utils/config';
import { getInputValue } from './utils/input';
import { options as optionsDefault } from './utils/options';
import type { OptionTypes } from './types/types';
import { allEvents } from './utils/variables';
import { debounce } from './utils/debounce';
import {
  getMobileModalTemplate,
  getModalTemplate,
  getNumberOfHours12,
  getNumberOfHours24,
} from './utils/template';

import ClockFaceManager from './managers/ClockFaceManager';
import EventManager from './managers/EventManager';
import ModalManager from './managers/ModalManager';
import AnimationManager from './managers/AnimationManager';
import ClockManager from './managers/ClockManager';
import ValidationManager from './managers/ValidationManager';
import ThemeManager from './managers/ThemeManager';
import ConfigManager from './managers/ConfigManager';
import type { ITimepickerUI } from './types/ITimepickerUI';

type TypeFunction = () => void;

const instanceRegistry = new Map<string, TimepickerUI>();

export default class TimepickerUI implements ITimepickerUI {
  _degreesHours: number | null = null;

  _degreesMinutes: number | null = null;

  _options: OptionTypes;

  _eventsClickMobile: (event: Event) => Promise<void> = () => Promise.resolve();

  _eventsClickMobileHandler: EventListenerOrEventListenerObject = () => {};

  _mutliEventsMove: (event: Event) => void = () => {};

  _mutliEventsMoveHandler: EventListenerOrEventListenerObject;

  _clickTouchEvents: string[];

  _element: HTMLElement;

  _instanceId: string;

  _isMobileView: boolean | null;

  _isTouchMouseMove: boolean | null;

  _disabledTime: any;

  _cloned: Node | null;

  _inputEvents: string[];

  _isModalRemove?: boolean;

  _isInitialized = false;

  _customId?: string;
  _eventHandlersRegistered = false;

  _isDestroyed = false;

  eventManager: EventManager;
  modalManager: ModalManager;
  animationManager: AnimationManager;
  clockManager: ClockManager;
  validationManager: ValidationManager;
  themeManager: ThemeManager;
  configManager: ConfigManager;

  constructor(selectorOrElement: string | HTMLElement, options?: OptionTypes) {
    if (typeof window === 'undefined') {
      throw new Error('TimepickerUI: Cannot initialize in non-browser environment (SSR/Node.js)');
    }

    const customId = options?.id;
    this._customId = customId;
    this._instanceId = customId || `timepicker-ui-${generateUUID()}`;

    if (customId && instanceRegistry.has(customId)) {
      throw new Error(`TimepickerUI: Instance with ID "${customId}" already exists`);
    }

    let element: HTMLElement | null = null;
    if (typeof selectorOrElement === 'string') {
      element = document.querySelector(selectorOrElement);
      if (!element) {
        throw new Error(`TimepickerUI: Element with selector "${selectorOrElement}" not found`);
      }
    } else if (selectorOrElement instanceof HTMLElement) {
      element = selectorOrElement;
    } else {
      throw new Error('TimepickerUI: First parameter must be a string selector or HTMLElement');
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

    this.eventManager = new EventManager(this);
    this.modalManager = new ModalManager(this);
    this.animationManager = new AnimationManager(this);
    this.clockManager = new ClockManager(this);
    this.validationManager = new ValidationManager(this);
    this.themeManager = new ThemeManager(this);
    this.configManager = new ConfigManager(this);

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

    instanceRegistry.set(this._instanceId, this);
  }

  /**
   * @description Static method to get a timepicker instance by its ID
   * @param id - The ID of the timepicker instance
   * @returns TimepickerUI instance or undefined if not found
   */
  static getById(id: string): TimepickerUI | undefined {
    return instanceRegistry.get(id);
  }

  /**
   * @description Static method to get all active timepicker instances
   * @returns Array of all active TimepickerUI instances
   */
  static getAllInstances(): TimepickerUI[] {
    return Array.from(instanceRegistry.values());
  }

  /**
   * @description Static method to check if an element is available in the DOM
   * @param selectorOrElement - String selector or HTMLElement to check
   * @returns boolean indicating if the element exists
   */
  static isAvailable(selectorOrElement: string | HTMLElement): boolean {
    if (typeof window === 'undefined') return false;

    if (typeof selectorOrElement === 'string') {
      return document.querySelector(selectorOrElement) !== null;
    } else if (selectorOrElement instanceof HTMLElement) {
      return document.contains(selectorOrElement);
    }
    return false;
  }

  /**
   * @description Static method to destroy all timepicker instances
   */
  static destroyAll(): void {
    const instances = Array.from(instanceRegistry.values());
    instances.forEach((instance) => instance.destroy());
    instanceRegistry.clear();
  }

  /** @internal */
  get modalTemplate() {
    if (!this._options.mobile || !this._isMobileView) {
      return getModalTemplate(this._options, this._instanceId);
    }
    return getMobileModalTemplate(this._options, this._instanceId);
  }

  /** @internal */
  get modalElement() {
    return document.querySelector(`[data-owner-id="${this._instanceId}"]`) as HTMLDivElement;
  }

  /** @internal */
  get clockFace() {
    return this.modalElement?.querySelector('.timepicker-ui-clock-face') as HTMLDivElement;
  }

  /** @internal */
  get input() {
    return this._element?.querySelector('input') as HTMLInputElement;
  }

  /** @internal */
  get clockHand() {
    return this.modalElement?.querySelector('.timepicker-ui-clock-hand') as HTMLDivElement;
  }

  /** @internal */
  get circle() {
    return this.modalElement?.querySelector('.timepicker-ui-circle-hand') as HTMLDivElement;
  }

  /** @internal */
  get tipsWrapper() {
    return this.modalElement?.querySelector('.timepicker-ui-tips-wrapper') as HTMLDivElement;
  }

  /** @internal */
  get tipsWrapperFor24h() {
    return this.modalElement?.querySelector('.timepicker-ui-tips-wrapper-24h') as HTMLDivElement;
  }

  /** @internal */
  get minutes() {
    return this.modalElement?.querySelector('.timepicker-ui-minutes') as HTMLInputElement;
  }

  /** @internal */
  get hour() {
    return this.modalElement?.querySelector('.timepicker-ui-hour') as HTMLInputElement;
  }

  /** @internal */
  get AM() {
    return this.modalElement?.querySelector('.timepicker-ui-am') as HTMLDivElement;
  }

  /** @internal */
  get PM() {
    return this.modalElement?.querySelector('.timepicker-ui-pm') as HTMLDivElement;
  }

  /** @internal */
  get minutesTips() {
    return this.modalElement?.querySelector('.timepicker-ui-minutes-time') as HTMLDivElement;
  }

  /** @internal */
  get hourTips() {
    return this.modalElement?.querySelector('.timepicker-ui-hour-time-12') as HTMLDivElement;
  }

  /** @internal */
  get allValueTips() {
    const modal = this.modalElement;
    if (!modal) return [] as const as Array<HTMLDivElement>;

    return [
      ...modal.querySelectorAll('.timepicker-ui-value-tips'),
      ...modal.querySelectorAll('.timepicker-ui-value-tips-24h'),
    ] as const as Array<HTMLDivElement>;
  }

  /** @internal */
  get openElementData() {
    const data: NodeListOf<HTMLElement> = this._element?.querySelectorAll('[data-open]');

    if (data?.length > 0) {
      const arr: string[] = [];

      data.forEach(({ dataset }) => arr.push(dataset.open ?? ''));
      return [...new Set(arr)];
    }

    return null;
  }

  /** @internal */
  get openElement() {
    if (this.openElementData === null) {
      this.input?.setAttribute('data-open', 'timepicker-ui-input');

      return [this.input];
    }

    return (
      this.openElementData.map((open) => this._element?.querySelectorAll(`[data-open='${open}']`))[0] ?? ''
    );
  }

  /** @internal */
  get cancelButton() {
    return this.modalElement?.querySelector('.timepicker-ui-cancel-btn') as HTMLButtonElement;
  }

  /** @internal */
  get okButton() {
    return this.modalElement?.querySelector('.timepicker-ui-ok-btn') as HTMLButtonElement;
  }

  /** @internal */
  get activeTypeMode() {
    return this.modalElement?.querySelector('.timepicker-ui-type-mode.active') as HTMLButtonElement;
  }

  /** @internal */
  get keyboardClockIcon() {
    return this.modalElement?.querySelector('.timepicker-ui-keyboard-icon-wrapper') as HTMLButtonElement;
  }

  /** @internal */
  get footer() {
    return this.modalElement?.querySelector('.timepicker-ui-footer') as HTMLDivElement;
  }

  /** @internal */
  get wrapper() {
    return this.modalElement?.querySelector('.timepicker-ui-wrapper') as HTMLDivElement;
  }

  /**
   * @description Returns the root wrapper element (`.timepicker-ui`) for this instance.
   * This is the element that dispatches custom events like `timepicker:confirm`.
   * @returns {HTMLElement}
   */
  public getElement(): HTMLElement {
    return this._element;
  }

  /**
   * @description The create method that init timepicker
   */
  public create = (): void => {
    if (this._isInitialized) {
      console.warn('TimepickerUI: Instance is already initialized');
      return;
    }

    this.configManager.updateInputValueWithCurrentTimeOnStart();
    this.validationManager.checkDisabledValuesOnStart();
    this.themeManager.setTimepickerClassToElement();
    this.themeManager.setInputClassToInputElement();
    this.themeManager.setDataOpenToInputIfDosentExistInWrapper();
    this.themeManager.setClassTopOpenElement();

    if (this._options.inline?.enabled) {
      this.eventManager.handleOpenOnEnterFocus();
      this._eventsBundle();
    } else {
      this.eventManager.handleOpenOnEnterFocus();
      this.eventManager.handleOpenOnClick();
    }

    this.configManager.getDisableTime();
    this._isInitialized = true;
  };

  /**
   * @description The open method opens immediately timepicker after init
   * @param callback - The callback function triggered when timepicker is open by this method
   */
  public open = (callback?: () => void): void => {
    if (!this._isInitialized) {
      this.create();
    }

    this._eventsBundle();

    initCallback(callback);
  };

  /**
   * @description Closure method closes the timepicker with double parentheses
   * @param args - The first parentheses doesn't have any paremeters. The second parentheses accepts parameters and these parameters are optional in this method and order is any. You can set callback function first or boolean,
   * or just boolean or just callback. If the boolean is set to true the input will be updating with the current value on picker.
   * The callback function start immediately after close, if is invoke. The max parameters length is set to 2
   */
  public close = () =>
    debounce((...args: Array<boolean | TypeFunction>): void => {
      if (args.length > 2 || !this.modalElement) return;

      const [update] = args.filter((e) => typeof e === 'boolean');
      const [callback] = args.filter((e) => typeof e === 'function');

      if (update) {
        this.eventManager.handleOkButton();
        this.okButton?.click();
      }

      this._isTouchMouseMove = false;

      allEvents
        .split(' ')
        .map((event) => document.removeEventListener(event, this._mutliEventsMoveHandler, false));

      document.removeEventListener('mousedown', this._eventsClickMobileHandler);
      document.removeEventListener('touchstart', this._eventsClickMobileHandler);
      document.removeEventListener('keypress', this.eventManager.handleEscClick);
      this.wrapper.removeEventListener('keydown', this.eventManager.focusTrapHandler);

      if (this._options.enableSwitchIcon) {
        this.keyboardClockIcon.removeEventListener('touchstart', this.configManager.handlerViewChange());
        this.keyboardClockIcon.removeEventListener('mousedown', this.configManager.handlerViewChange());
      }

      this.animationManager.removeAnimationToClose();

      this.openElement.forEach((openEl) => openEl?.classList.remove('disabled'));

      setTimeout(() => {
        document.body.style.overflowY = '';
        document.body.style.paddingRight = '';
      }, 400);

      this.openElement.forEach((openEl) => openEl?.classList.remove('disabled'));

      setTimeout(() => {
        if (this._options.focusInputAfterCloseModal) this.input?.focus();

        if (this.modalElement === null) return;

        this.modalElement.remove();

        this._isModalRemove = true;
      }, 300);

      initCallback(callback as TypeFunction);
      // @ts-ignore
      // eslint-disable-next-line tree-shaking/no-side-effects-in-initialization
    }, this._options.delayHandler || 300);

  /**
   * @description
   * Destroys the current TimepickerUI instance by:
   * - removing all event listeners
   * - cleaning up DOM elements related to the modal
   * - removing all dynamically added classes and data attributes
   * - clearing handler references for better garbage collection
   * - resetting internal state
   *
   * The original element remains in place (no DOM cloning).
   * Fully compatible with React, Vue, Angular and vanilla JS.
   *
   * @param options - Optional configuration object with:
   *   - keepInputValue: boolean - if true, preserves input value after destruction (default: false)
   *   - callback: function - callback executed after cleanup completes
   */
  public destroy = (options?: { keepInputValue?: boolean; callback?: TypeFunction } | TypeFunction): void => {
    if (this._isDestroyed) {
      console.warn('TimepickerUI: Instance is already destroyed');
      return;
    }

    const config = typeof options === 'function' ? { callback: options } : options || {};
    const { keepInputValue = false, callback } = config;

    const inputValue = keepInputValue ? this.input?.value : null;

    allEvents.split(' ').forEach((event) => {
      document.removeEventListener(event, this._mutliEventsMoveHandler, false);
    });

    document.removeEventListener('mousedown', this._eventsClickMobileHandler);
    document.removeEventListener('touchstart', this._eventsClickMobileHandler);
    document.removeEventListener('keypress', this.eventManager.handleEscClick);

    if (this._options.enableSwitchIcon && this.keyboardClockIcon) {
      this.keyboardClockIcon.removeEventListener('touchstart', this.configManager.handlerViewChange());
      this.keyboardClockIcon.removeEventListener('mousedown', this.configManager.handlerViewChange());
    }

    if (this.input) {
      this._inputEvents.forEach((event) => {
        this.input.removeEventListener(event, () => {});
      });
    }

    this.modalElement?.remove();

    this.openElement?.forEach((el) => {
      if (el) {
        el.classList.remove('disabled', 'active', 'timepicker-ui-open-element');
        el.classList.remove('basic', 'crane-straight', 'crane-radius', 'm3');
      }
    });

    if (this.input) {
      this.input.classList.remove(
        'timepicker-ui-invalid-format',
        'invalid-value',
        'error',
        'active',
        'timepicker-ui-input',
      );

      this.input.removeAttribute('data-open');
      this.input.removeAttribute('data-owner-id');

      if (keepInputValue && inputValue !== null) {
        this.input.value = inputValue;
      }
    }

    if (this._element) {
      this._element.classList.remove('basic', 'crane-straight', 'crane-radius', 'm3');

      this._element.classList.remove('error', 'active', 'disabled');

      this._element.removeAttribute('data-owner-id');
      this._element.removeAttribute('data-open');

      if (this._options.cssClass) {
        this._element.classList.remove(this._options.cssClass);
      }
    }

    const invalidTextElements = this._element?.querySelectorAll('.timepicker-ui-invalid-text');
    invalidTextElements?.forEach((el) => el.remove());

    this._mutliEventsMoveHandler = null as any;
    this._eventsClickMobileHandler = null as any;
    this._mutliEventsMove = () => {};
    this._eventsClickMobile = () => Promise.resolve();

    this._isModalRemove = true;
    this._isTouchMouseMove = false;
    this._disabledTime = null;
    this._cloned = null;
    this._degreesHours = null;
    this._degreesMinutes = null;
    this._isInitialized = false;
    this._isDestroyed = true;

    if (typeof document !== 'undefined') {
      document.body.style.overflowY = '';
      document.body.style.paddingRight = '';
    }

    instanceRegistry.delete(this._instanceId);

    initCallback(callback);
  };

  /**
   * @description The update method which update timepicker with new options and can create a new instance.
   * @param value - The first parameter is a object with key options which is timepicker options and it will be updated to current
   * instance and is `required`. The `create` key is a boolean which if is set to true it starting the create() method after invoke update
   * function and is optional. The `create` option is useful if you are using destroy and update methods together.
   * @param callback - The `callback` function is started after update method. This parameter is optional.
   */
  public update = (
    value: {
      options: OptionTypes;
      create?: boolean;
    },
    callback?: TypeFunction,
  ): void => {
    if (this._isDestroyed) {
      console.warn('TimepickerUI: Instance is destroyed');
      return;
    }

    this._options = { ...this._options, ...value.options };

    this.configManager.checkMobileOption();

    if (value.create) {
      this.create();
    }

    initCallback(callback);
  };

  /**
   * @description Get the current time value from the timepicker
   * @returns Object with hour, minutes, type (AM/PM), and formatted time string
   */
  public getValue = (): {
    hour: string;
    minutes: string;
    type?: string;
    time: string;
    degreesHours: number | null;
    degreesMinutes: number | null;
  } => {
    if (this._isDestroyed) {
      console.warn('TimepickerUI: Instance is destroyed');
      return {
        hour: '',
        minutes: '',
        time: '',
        degreesHours: null,
        degreesMinutes: null,
      };
    }

    const currentHour = this.hour?.value || '12';
    const currentMinutes = this.minutes?.value || '00';
    const currentType =
      this._options.clockType === '24h' ? undefined : this.activeTypeMode?.textContent || 'AM';

    let timeString = '';
    if (this._options.clockType === '24h') {
      timeString = `${currentHour.padStart(2, '0')}:${currentMinutes.padStart(2, '0')}`;
    } else {
      timeString = `${currentHour}:${currentMinutes.padStart(2, '0')} ${currentType}`;
    }

    return {
      hour: currentHour,
      minutes: currentMinutes,
      type: currentType,
      time: timeString,
      degreesHours: this._degreesHours,
      degreesMinutes: this._degreesMinutes,
    };
  };

  /**
   * @description Set the time value in the timepicker
   * @param time - Time string in format "HH:MM" for 24h or "HH:MM AM/PM" for 12h
   * @param updateInput - Whether to update the input element (default: true)
   */
  public setValue = (time: string, updateInput: boolean = true): void => {
    if (this._isDestroyed) {
      console.warn('TimepickerUI: Instance is destroyed');
      return;
    }

    if (!time || typeof time !== 'string') {
      throw new Error('TimepickerUI: setValue requires a valid time string');
    }

    const trimmedTime = time.trim();
    let hour = '12';
    let minutes = '00';
    let type = 'AM';

    try {
      if (this._options.clockType === '24h') {
        const timeMatch = trimmedTime.match(/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/);
        if (!timeMatch) {
          throw new Error('Invalid 24h format. Expected HH:MM');
        }
        hour = timeMatch[1].padStart(2, '0');
        minutes = timeMatch[2];
      } else {
        const timeMatch = trimmedTime.match(/^(1[0-2]|[1-9]):([0-5][0-9])\s*(AM|PM)$/i);
        if (!timeMatch) {
          throw new Error('Invalid 12h format. Expected HH:MM AM/PM');
        }
        hour = timeMatch[1];
        minutes = timeMatch[2];
        type = timeMatch[3].toUpperCase();
      }

      if (this.hour) {
        this.hour.value = hour;
        this._degreesHours = Number(hour) * 30;
      }

      if (this.minutes) {
        this.minutes.value = minutes;
        this._degreesMinutes = Number(minutes) * 6;
      }

      if (this._options.clockType !== '24h' && this.AM && this.PM) {
        if (type === 'AM') {
          this.AM.classList.add('active');
          this.PM.classList.remove('active');
        } else {
          this.PM.classList.add('active');
          this.AM.classList.remove('active');
        }
      }

      if (updateInput && this.input) {
        this.input.value = trimmedTime;
      }

      if (this.clockHand) {
        this.clockHand.style.transform = `rotateZ(${this._degreesHours || 0}deg)`;
      }
    } catch (error) {
      throw new Error(`TimepickerUI: ${error instanceof Error ? error.message : 'Invalid time format'}`);
    }
  };

  _eventsBundle = (): void => {
    if (this._isDestroyed) {
      console.warn('TimepickerUI: Instance is destroyed');
      return;
    }

    if (!this._isModalRemove) {
      return;
    }

    if (!this._options.inline?.enabled) {
      this.eventManager.handleEscClick();
    }

    this.validationManager.setErrorHandler();
    this.validationManager.removeErrorHandler();

    if (!this._options.inline?.enabled) {
      this.openElement.forEach((openEl) => openEl?.classList.add('disabled'));
      this.input?.blur();
    }

    this.modalManager.setScrollbarOrNot();
    this.modalManager.setModalTemplate();
    this.modalManager.setNormalizeClass();
    this.modalManager.removeBackdrop();
    this.clockManager.setBgColorToCirleWithHourTips();
    this.clockManager.setOnStartCSSClassesIfClockType24h();
    this.clockManager.setClassActiveToHourOnOpen();

    if (this.clockFace !== null) {
      const initClockFace = new ClockFaceManager({
        array: getNumberOfHours12,
        classToAdd: 'timepicker-ui-hour-time-12',
        clockFace: this.clockFace,
        tipsWrapper: this.tipsWrapper,
        theme: this._options.theme,
        disabledTime: this._disabledTime?.value?.isInterval
          ? this._disabledTime?.value.rangeArrHour
          : this._disabledTime?.value?.hours,
        clockType: '12h',
        hour: this.hour.value,
      });

      initClockFace.create();

      if (this._options.clockType === '24h') {
        const initClockFace24h = new ClockFaceManager({
          array: getNumberOfHours24,
          classToAdd: 'timepicker-ui-hour-time-24',
          clockFace: this.tipsWrapperFor24h,
          tipsWrapper: this.tipsWrapperFor24h,
          theme: this._options.theme,
          clockType: '24h',
          disabledTime: this._disabledTime?.value?.isInterval
            ? this._disabledTime?.value.rangeArrHour
            : this._disabledTime?.value?.hours,
          hour: this.hour.value,
        });

        initClockFace24h.create();
      } else {
        if (this._disabledTime?.value.startType === this._disabledTime?.value.endType) {
          setTimeout(() => {
            if (this._disabledTime?.value.startType === this.activeTypeMode?.textContent) {
              initClockFace.updateDisable({
                hoursToUpdate: this._disabledTime?.value?.rangeArrHour,
                minutesToUpdate: {
                  endMinutes: this._disabledTime?.value.endMinutes,
                  removedEndHour: this._disabledTime?.value.removedEndHour,
                  removedStartedHour: this._disabledTime?.value.removedStartedHour,
                  actualHour: this.hour.value,
                  startMinutes: this._disabledTime?.value.startMinutes,
                },
              });
            }
          }, 300);
        } else {
          setTimeout(() => {
            initClockFace.updateDisable({
              minutesToUpdate: {
                actualHour: this.hour.value,
                pmHours: this._disabledTime?.value.pmHours,
                amHours: this._disabledTime?.value.amHours,
                activeMode: this.activeTypeMode?.textContent,
              },
            });
          }, 300);
        }

        initClockFace.updateDisable();
      }
    }

    this.modalManager.setFlexEndToFooterIfNoKeyboardIcon();

    setTimeout(() => {
      this.themeManager.setTheme();
    }, 0);

    this.animationManager.setAnimationToOpen();
    this.configManager.getInputValueOnOpenAndSet();
    this.clockManager.toggleClassActiveToValueTips(this.hour.value);

    if (!this._isMobileView) {
      this.clockManager.setTransformToCircleWithSwitchesHour(this.hour.value);
      this.animationManager.handleAnimationClock();
    }

    this.eventManager.handleMinutesEvents();
    this.eventManager.handleHourEvents();

    if (this._options.clockType !== '24h') {
      this.eventManager.handleAmClick();
      this.eventManager.handlePmClick();
    }

    if (this.clockFace) {
      this.eventManager.handleMoveHand();
    }

    this.eventManager.handleCancelButton();
    this.eventManager.handleOkButton();

    if (this.modalElement) {
      this.modalManager.setShowClassToBackdrop();
      if (!this._options.inline?.enabled) {
        this.eventManager.handleBackdropClick();
      }
    }

    this.eventManager.handleIconChangeView();
    this.eventManager.handleClickOnHourMobile();

    if (this._options.focusTrap) {
      this.eventManager.focusTrapHandler();
    }

    if (this._options.inline?.enabled && this._options.inline.autoUpdate !== false) {
      this.eventManager.handleInlineAutoUpdate();
    }
  };
}
