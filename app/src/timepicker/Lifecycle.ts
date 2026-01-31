import type { CoreState } from './CoreState';
import type { Managers } from './Managers';
import type { EventEmitter, TimepickerEventMap } from '../utils/EventEmitter';
import { initMd3Ripple } from '../utils/ripple';
import { debounce } from '../utils/debounce';
import { allEvents } from '../utils/variables';
import { isDocument, isNode } from '../utils/node';
import { TIMINGS } from '../constants/timings';

type TypeFunction = () => void;

export class Lifecycle {
  private core: CoreState;
  private managers: Managers;
  private emitter: EventEmitter<TimepickerEventMap>;
  private eventsClickMobileHandler: EventListenerOrEventListenerObject = () => {};
  private mutliEventsMoveHandler: EventListenerOrEventListenerObject = () => {};

  constructor(core: CoreState, managers: Managers, emitter: EventEmitter<TimepickerEventMap>) {
    this.core = core;
    this.managers = managers;
    this.emitter = emitter;
  }

  init(): void {
    if (this.core.isDestroyed) return;
    if (this.core.isInitialized) return;

    try {
      this.managers.config.updateInputValueWithCurrentTimeOnStart();
      this.managers.validation.checkDisabledValuesOnStart();
    } catch (error) {
      this.core.setIsDestroyed(true);
      return;
    }

    this.managers.theme.setTimepickerClassToElement();
    this.managers.theme.setInputClassToInputElement();
    this.managers.theme.setDataOpenToInputIfDoesntExistInWrapper();
    this.managers.theme.setClassTopOpenElement();
    this.managers.config.getDisableTime();

    if (!this.core.options.ui.inline?.enabled) {
      this.managers.events.handleOpenOnClick();
    }
    this.managers.events.handleOpenOnEnterFocus();

    this.setupCallbackBridge();

    this.core.setIsInitialized(true);
  }

  private setupCallbackBridge(): void {
    const { callbacks } = this.core.options;

    if (callbacks.onOpen) {
      this.emitter.on('open', callbacks.onOpen);
    }
    if (callbacks.onCancel) {
      this.emitter.on('cancel', callbacks.onCancel);
    }
    if (callbacks.onConfirm) {
      this.emitter.on('confirm', callbacks.onConfirm);
    }
    if (callbacks.onUpdate) {
      this.emitter.on('update', callbacks.onUpdate);
    }
    if (callbacks.onSelectHour) {
      this.emitter.on('select:hour', callbacks.onSelectHour);
    }
    if (callbacks.onSelectMinute) {
      this.emitter.on('select:minute', callbacks.onSelectMinute);
    }
    if (callbacks.onSelectAM) {
      this.emitter.on('select:am', callbacks.onSelectAM);
    }
    if (callbacks.onSelectPM) {
      this.emitter.on('select:pm', callbacks.onSelectPM);
    }
    if (callbacks.onError) {
      this.emitter.on('error', callbacks.onError);
    }
    if (callbacks.onTimezoneChange) {
      this.emitter.on('timezone:change', callbacks.onTimezoneChange);
    }
    if (callbacks.onRangeConfirm) {
      this.emitter.on('range:confirm', callbacks.onRangeConfirm);
    }
    if (callbacks.onRangeSwitch) {
      this.emitter.on('range:switch', callbacks.onRangeSwitch);
    }
    if (callbacks.onRangeValidation) {
      this.emitter.on('range:validation', callbacks.onRangeValidation);
    }
  }

  mount(): void {
    if (this.core.isDestroyed) return;

    if (!this.core.isInitialized) {
      this.init();
    }

    this.eventsBundle();
  }

  unmount(callback?: TypeFunction): void {
    const debouncedUnmount = debounce((...args: unknown[]): void => {
      if (args.length > 2 || !this.core.getModalElement()) return;

      const [update] = args.filter((e) => typeof e === 'boolean') as boolean[];
      const [cb] = args.filter((e) => typeof e === 'function') as TypeFunction[];

      this.core.setIsMobileView(!!this.core.options.ui.mobile);

      if (update) {
        const okButton = this.core.getOkButton();
        okButton?.click();
      }

      this.core.setIsTouchMouseMove(false);

      this.removeEventListeners();

      this.managers.animation.removeAnimationToClose();

      const openElements = this.core.getOpenElement();
      openElements.forEach((openEl) => openEl?.classList.remove('disabled'));

      setTimeout(() => {
        if (isDocument()) {
          document.body.style.overflowY = '';
          document.body.style.paddingRight = '';
        }
      }, TIMINGS.SCROLLBAR_RESTORE);

      setTimeout(() => {
        const input = this.core.getInput();
        if (this.core.options.behavior.focusInputAfterClose) {
          input?.focus();
        }

        const modal = this.core.getModalElement();
        if (modal === null) return;

        modal.remove();
        this.core.setIsModalRemove(true);
      }, TIMINGS.MODAL_REMOVE);

      if (cb) cb();
    }, this.core.options.behavior.delayHandler || TIMINGS.DEFAULT_DELAY);

    if (callback) {
      debouncedUnmount(callback);
    } else {
      debouncedUnmount();
    }
  }

  destroy(options?: { keepInputValue?: boolean; callback?: TypeFunction } | TypeFunction): void {
    if (this.core.isDestroyed) return;

    const config = typeof options === 'function' ? { callback: options } : options || {};
    const { keepInputValue = false, callback } = config;

    const input = this.core.getInput();
    const inputValue = keepInputValue ? input?.value : null;

    this.removeEventListeners();

    const modal = this.core.getModalElement();
    modal?.remove();

    const openElements = this.core.getOpenElement();
    openElements?.forEach((el) => {
      if (el) {
        el.classList.remove('disabled', 'active', 'tp-ui-open-element');
        el.classList.remove('basic', 'crane-straight', 'crane', 'm2', 'm3-green');
      }
    });

    if (input) {
      input.classList.remove('tp-ui-invalid-format', 'invalid-value', 'error', 'active', 'tp-ui-input');

      input.removeAttribute('data-open');
      input.removeAttribute('data-owner-id');

      if (keepInputValue && inputValue) {
        input.value = inputValue;
      }
    }

    const element = this.core.element;
    if (element) {
      element.classList.remove('basic', 'crane-straight', 'crane', 'm2', 'm3-green');
      element.classList.remove('error', 'active', 'disabled');
      element.removeAttribute('data-owner-id');
      element.removeAttribute('data-open');

      if (this.core.options.ui.cssClass) {
        element.classList.remove(this.core.options.ui.cssClass);
      }
    }

    const invalidTextElements = element?.querySelectorAll('.tp-ui-invalid-text');
    invalidTextElements?.forEach((el) => el.remove());

    this.mutliEventsMoveHandler = (() => {}) as EventListenerOrEventListenerObject;
    this.eventsClickMobileHandler = (() => {}) as EventListenerOrEventListenerObject;

    this.core.reset();
    this.managers.destroy();
    this.emitter.clear();

    if (!isNode()) {
      document.body.style.overflowY = '';
      document.body.style.paddingRight = '';
    }

    if (callback) callback();
  }

  private eventsBundle(): void {
    if (this.core.isDestroyed) return;
    if (!this.core.isModalRemove) return;

    this.managers.validation.setErrorHandler();
    this.managers.validation.removeErrorHandler();

    if (!this.core.options.ui.inline?.enabled) {
      const openElements = this.core.getOpenElement();
      const input = this.core.getInput();
      openElements.forEach((openEl) => openEl?.classList.add('disabled'));
      input?.blur();
    }

    this.managers.modal.setScrollbarOrNot();
    this.managers.modal.setModalTemplate();
    this.managers.modal.setNormalizeClass();
    this.managers.modal.removeBackdrop();

    if (!this.core.isMobileView) {
      const modal = this.core.getModalElement();
      const clockWrapper = modal?.querySelector('.tp-ui-mobile-clock-wrapper');
      const wrapper = modal?.querySelector('.tp-ui-wrapper');
      const allElements = modal?.querySelectorAll('*');

      clockWrapper?.classList.add('expanded');
      wrapper?.classList.add('expanded');
      allElements?.forEach((el) => {
        if (
          !el.classList.contains('tp-ui-select-time') &&
          !el.classList.contains('tp-ui-mobile-clock-wrapper') &&
          !el.classList.contains('tp-ui-wrapper')
        ) {
          el.classList.add('expanded');
        }
      });
    } else {
      this.managers.config.updateClockFaceAccessibility(true);
    }

    this.managers.modal.setFlexEndToFooterIfNoKeyboardIcon();

    setTimeout(() => {
      this.managers.theme.setTheme();

      const wrapper = this.core.getWrapper();
      if (wrapper) {
        if (this.core.options.ui.cssClass) {
          wrapper.classList.add(this.core.options.ui.cssClass);
        }
      }
    }, 0);

    this.managers.animation.setAnimationToOpen();
    this.managers.config.getInputValueOnOpenAndSet();

    this.managers.clock.initializeClockSystem();
    this.managers.clock.setOnStartCSSClassesIfClockType24h();
    this.managers.clock.setClassActiveToHourOnOpen();

    const timezone = this.managers.getPlugin('timezone');
    if (timezone) {
      timezone.init();
    }

    const range = this.managers.getPlugin('range');
    if (range) {
      range.init();
    }

    this.managers.events.handleCancelButton();
    this.managers.events.handleOkButton();
    this.managers.events.handleHourEvents();
    this.managers.events.handleMinutesEvents();
    this.managers.events.handleKeyboardInput();

    if (this.core.options.ui.enableSwitchIcon) {
      this.managers.events.handleSwitchViewButton();
    }

    if (this.core.options.clock.type !== '24h') {
      this.managers.events.handleAmClick();
      this.managers.events.handlePmClick();
    }

    if (this.core.options.behavior.focusTrap) {
      this.managers.events.focusTrapHandler();
    }

    if (!this.core.options.ui.inline?.enabled) {
      this.managers.events.handleEscClick();
      this.managers.events.handleBackdropClick();
    }

    const modal = this.core.getModalElement();
    if (modal) {
      initMd3Ripple(modal);
    }

    const clockFace = this.core.getClockFace();
    if (clockFace && typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          clockFace?.classList.add('scale-in');
        });
      });
    }

    this.managers.modal.setShowClassToBackdrop();
  }

  private removeEventListeners(): void {
    if (isDocument() === false) {
      return;
    }

    const eventList = allEvents.split(' ');
    eventList.forEach((event: string) => {
      document.removeEventListener(event, this.mutliEventsMoveHandler, false);
    });

    document.removeEventListener('mousedown', this.eventsClickMobileHandler);
  }
}
