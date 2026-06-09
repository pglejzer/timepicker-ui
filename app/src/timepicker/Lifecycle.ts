import type { CoreState } from './CoreState';
import type { Managers } from './Managers';
import type { EventEmitter, TimepickerEventMap } from '../utils/EventEmitter';
import { PluginRegistry } from '../core/PluginRegistry';
import { initMd3Ripple } from '../utils/ripple';
import { debounce } from '../utils/debounce';
import { allEvents } from '../utils/variables';
import { isDocument } from '../utils/node';
import { TIMINGS } from '../constants/timings';
import { isWheelMode, isCompactWheelMode, isPopoverMode } from '../utils/options/predicates';
import { setupCallbackBridge, emitMissingPluginErrors } from './LifecycleCallbacks';

type TypeFunction = () => void;

export class Lifecycle {
  private static readonly EXPANDED_EXCLUDED: ReadonlyArray<string> = [
    'tp-ui-select-time',
    'tp-ui-mobile-clock-wrapper',
    'tp-ui-wrapper',
  ];

  private core: CoreState;
  private managers: Managers;
  private emitter: EventEmitter<TimepickerEventMap>;
  private eventsClickMobileHandler: EventListenerOrEventListenerObject = () => {};
  private mutliEventsMoveHandler: EventListenerOrEventListenerObject = () => {};
  private unmountTimeouts: ReturnType<typeof setTimeout>[] = [];

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
    } catch {
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

    setupCallbackBridge(this.core, this.emitter);

    this.core.setIsInitialized(true);
  }

  mount(): void {
    if (this.core.isDestroyed) return;
    if (this.core.isOpen) return;

    if (!this.core.isInitialized) {
      this.init();
    }

    this.eventsBundle();
  }

  unmount(callback?: TypeFunction): void {
    const debouncedUnmount = debounce((...args: unknown[]): void => {
      if (args.length > 2) return;

      const [update] = args.filter((e) => typeof e === 'boolean') as boolean[];
      const [cb] = args.filter((e) => typeof e === 'function') as TypeFunction[];

      this.core.setIsMobileView(!!this.core.options.ui.mobile);

      const modal = this.core.getModalElement();

      if (update && modal) {
        const okButton = this.core.getOkButton();
        okButton?.click();
      }

      this.core.setIsTouchMouseMove(false);
      this.core.setIsOpen(false);

      this.removeEventListeners();

      if (isPopoverMode(this.core.options)) {
        const wheel = this.managers.getPlugin('wheel');
        wheel?.detachPopover?.();
      }

      if (modal) {
        this.managers.animation.removeAnimationToClose();
      }

      const openElements = this.core.getOpenElement();
      openElements.forEach((openEl) => openEl?.classList.remove('disabled'));

      const scrollbarTimeout = setTimeout(() => {
        this.managers.modal.unlockScroll();
      }, TIMINGS.SCROLLBAR_RESTORE);
      this.unmountTimeouts.push(scrollbarTimeout);

      const modalRemoveTimeout = setTimeout(() => {
        const input = this.core.getInput();
        if (this.core.options.behavior.focusInputAfterClose) {
          input?.focus();
        }

        const currentModal = this.core.getModalElement();
        if (currentModal) {
          currentModal.remove();
        }
        this.core.setIsModalRemove(true);
      }, TIMINGS.MODAL_REMOVE);
      this.unmountTimeouts.push(modalRemoveTimeout);

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

    this.clearUnmountTimeouts();

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

    this.managers.modal.unlockScroll();

    if (callback) callback();
  }

  private eventsBundle(): void {
    if (this.core.isDestroyed) return;
    if (!this.core.isModalRemove) return;

    this.clearUnmountTimeouts();
    this.core.setIsOpen(true);
    this.core.setIsModalRemove(false);

    this.setupValidation();
    this.disableOpenElements();
    this.setupModal();
    this.applyExpandedState();

    this.managers.modal.setFlexEndToFooterIfNoKeyboardIcon();
    this.applyThemeDeferred();
    this.managers.animation.setAnimationToOpen();
    this.managers.config.getInputValueOnOpenAndSet();

    const wheelModeActive = isWheelMode(this.core.options) && PluginRegistry.has('wheel');
    emitMissingPluginErrors(this.core, this.emitter);
    this.initClockOrWheel(wheelModeActive);
    this.initOptionalPlugins(wheelModeActive);
    this.bindEventHandlers(wheelModeActive);
    this.finalizeModal(wheelModeActive);

    if (isPopoverMode(this.core.options)) {
      const wheel = this.managers.getPlugin('wheel');
      wheel?.attachPopover?.();
    }

    this.managers.modal.setShowClassToBackdrop();
  }

  private setupValidation(): void {
    this.managers.validation.setErrorHandler();
    this.managers.validation.removeErrorHandler();
  }

  private disableOpenElements(): void {
    if (!this.core.options.ui.inline?.enabled) {
      const openElements = this.core.getOpenElement();
      openElements.forEach((openEl) => openEl?.classList.add('disabled'));

      if (!isPopoverMode(this.core.options)) {
        const input = this.core.getInput();
        input?.blur();
      }
    }
  }

  private setupModal(): void {
    this.managers.modal.setScrollbarOrNot();
    this.managers.modal.setModalTemplate();
    this.managers.modal.setNormalizeClass();
    this.managers.modal.removeBackdrop();
  }

  private applyExpandedState(): void {
    if (this.core.isMobileView) {
      this.managers.config.updateClockFaceAccessibility(true);
      return;
    }
    const modal = this.core.getModalElement();
    if (!modal) return;

    modal.querySelector('.tp-ui-mobile-clock-wrapper')?.classList.add('expanded');
    modal.querySelector('.tp-ui-wrapper')?.classList.add('expanded');

    modal.querySelectorAll('*').forEach((el) => {
      const isExcluded = Lifecycle.EXPANDED_EXCLUDED.some((cls) => el.classList.contains(cls));
      if (!isExcluded) {
        el.classList.add('expanded');
      }
    });
  }

  private applyThemeDeferred(): void {
    const themeTimeout = setTimeout(() => {
      this.managers.theme.setTheme();

      const wrapper = this.core.getWrapper();
      if (wrapper) {
        if (this.core.options.ui.cssClass) {
          wrapper.classList.add(this.core.options.ui.cssClass);
        }
      }
    }, 0);
    this.unmountTimeouts.push(themeTimeout);
  }

  private initClockOrWheel(isWheelMode: boolean): void {
    if (isWheelMode) {
      const wheel = this.managers.getPlugin('wheel');
      if (wheel) {
        wheel.init();
      }
    } else {
      this.managers.clock.initializeClockSystem();
      this.managers.clock.setOnStartCSSClassesIfClockType24h();
      this.managers.clock.setClassActiveToHourOnOpen();
    }
  }

  private initOptionalPlugins(isWheelMode: boolean): void {
    const timezone = this.managers.getPlugin('timezone');
    if (timezone) {
      timezone.init();
    }

    const range = this.managers.getPlugin('range');
    if (range && !isWheelMode) {
      range.init();
    }
  }

  private bindEventHandlers(isWheelMode: boolean): void {
    this.managers.events.handleCancelButton();
    this.managers.events.handleOkButton();
    this.managers.clearButton.init();

    if (!isWheelMode) {
      this.managers.events.handleHourEvents();
      this.managers.events.handleMinutesEvents();
    }

    this.managers.events.handleKeyboardInput();

    if (this.core.options.ui.enableSwitchIcon && !isWheelMode) {
      this.managers.events.handleSwitchViewButton();
    }

    if (this.core.options.clock.type !== '24h' && !isCompactWheelMode(this.core.options)) {
      this.managers.events.handleAmClick();
      this.managers.events.handlePmClick();
    }

    if (this.core.options.behavior.focusTrap) {
      this.managers.events.focusTrapHandler();
    }

    if (!this.core.options.ui.inline?.enabled) {
      this.managers.events.handleEscClick();

      if (!isPopoverMode(this.core.options)) {
        const isWheelWithPersist = isWheelMode && this.core.options.wheel?.ignoreOutsideClick;

        if (!isWheelWithPersist) {
          this.managers.events.handleBackdropClick();
        }
      }
    }
  }

  private finalizeModal(isWheelMode: boolean): void {
    const modal = this.core.getModalElement();
    if (modal) {
      initMd3Ripple(modal);
    }

    if (!isWheelMode) {
      const clockFace = this.core.getClockFace();
      if (clockFace && typeof requestAnimationFrame !== 'undefined') {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            clockFace?.classList.add('scale-in');
          });
        });
      }
    }
  }

  private clearUnmountTimeouts(): void {
    this.unmountTimeouts.forEach(clearTimeout);
    this.unmountTimeouts = [];
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
