import type { CoreState } from './CoreState';
import type { Managers } from './Managers';
import type { EventEmitter, TimepickerEventMap } from '../utils/EventEmitter';
import type { TimepickerOptions } from '../types/options';
import { PluginRegistry, type PluginManager } from '../core/PluginRegistry';
import { initMd3Ripple } from '../utils/ripple';
import {
  isWheelMode,
  isCompactWheelMode,
  isPopoverMode,
  isInlineMode,
  isEmbeddedInlineMode,
} from '../utils/options/predicates';
import { setupCallbackBridge, emitMissingPluginErrors } from './LifecycleCallbacks';

type TypeFunction = () => void;
type DisabledMarksRefresher = PluginManager & { updateDisabledItems?(): void };

export class Lifecycle {
  private core: CoreState;
  private managers: Managers;
  private emitter: EventEmitter<TimepickerEventMap>;
  private unmountTimeouts: ReturnType<typeof setTimeout>[] = [];
  private rippleCleanup: TypeFunction = () => {};
  private isCommitting = false;
  private isRendering = false;
  private isRerenderPending = false;

  constructor(core: CoreState, managers: Managers, emitter: EventEmitter<TimepickerEventMap>) {
    this.core = core;
    this.managers = managers;
    this.emitter = emitter;
  }

  init(): void {
    if (this.core.isDestroyed) return;
    if (this.core.isInitialized) return;

    setupCallbackBridge(this.core, this.emitter);

    try {
      this.managers.config.updateInputValueWithCurrentTimeOnStart();
      this.managers.validation.checkDisabledValuesOnStart();
    } catch (error) {
      this.core.setIsDestroyed(true);
      this.reportError(error);
      return;
    }

    this.managers.theme.setTimepickerClassToElement();
    this.managers.theme.setInputClassToInputElement();
    this.managers.theme.setDataOpenToInputIfDoesntExistInWrapper();
    this.managers.theme.setClassTopOpenElement();
    this.managers.config.getDisableTime();

    if (!isInlineMode(this.core.options)) {
      this.managers.events.handleOpenOnClick();
    }
    this.managers.events.handleOpenOnEnterFocus();

    this.core.setIsInitialized(true);
  }

  applyOptions(options: TimepickerOptions): boolean {
    const previousOptions = this.core.options;
    this.core.updateOptions(options);

    try {
      this.managers.validation.checkDisabledValuesOnStart();
      this.managers.config.getDisableTime();
    } catch (error) {
      this.core.setOptions(previousOptions);
      this.reportError(error);
      return false;
    }

    this.managers.config.checkMobileOption();
    this.managers.config.syncInputFormat(previousOptions);
    return true;
  }

  refreshDisabledTime(): void {
    this.managers.config.clearPredicateCache();
    if (!this.core.isOpen) return;

    if (isWheelMode(this.core.options) && PluginRegistry.has('wheel')) {
      this.managers.getPlugin<DisabledMarksRefresher>('wheel')?.updateDisabledItems?.();
    } else {
      this.managers.clock.refreshDisabledTime();
    }

    this.managers.events.syncOkButton();
  }

  private reportError(error: unknown): void {
    this.emitter.emit('error', { error: error instanceof Error ? error.message : String(error) });
  }

  mount(): void {
    if (this.core.isDestroyed) return;
    if (this.core.isOpen) return;

    if (!this.core.isInitialized) {
      this.init();
    }

    this.eventsBundle();
  }

  rerender(): void {
    if (this.isRendering) {
      this.isRerenderPending = true;
      return;
    }

    const focusedControlSelector = this.managers.modal.getFocusedControlSelector();
    this.core.setIsOpen(false);
    this.releaseOpenView();
    this.core.setIsModalRemove(true);
    this.eventsBundle(true);

    if (focusedControlSelector !== null) {
      this.managers.modal.restoreFocus(focusedControlSelector);
    }
  }

  discardSelection(): void {
    if (isInlineMode(this.core.options)) {
      this.rerender();
      this.core.getCancelButton()?.focus();
      return;
    }
    this.unmount();
  }

  closeUnlessInline(): void {
    if (!isInlineMode(this.core.options)) {
      this.unmount();
    }
  }

  unmount(callback?: TypeFunction, commit = false): void {
    if (this.isCommitting) return;

    if (commit) {
      this.commitSelection();
    }

    this.deactivate();

    const close = (): void => {
      this.closeModal();
      if (callback) callback();
    };
    const { delayHandler } = this.core.options.behavior;

    if (delayHandler) {
      this.unmountTimeouts.push(setTimeout(close, delayHandler));
    } else {
      close();
    }
  }

  private deactivate(): void {
    this.core.setIsOpen(false);
    this.releaseOpenView();
  }

  private releaseOpenView(): void {
    this.detachOpenHandlers();
    this.managers.clock.destroyClockSystem();
    this.managers.getPlugin('wheel')?.detachPopover?.();
  }

  private commitSelection(): void {
    if (!this.core.isOpen) return;

    this.isCommitting = true;
    this.core.getOkButton()?.click();
    this.isCommitting = false;
  }

  private closeModal(): void {
    this.core.setIsMobileView(!!this.core.options.ui.mobile);
    this.core.setIsTouchMouseMove(false);

    this.unmountTimeouts.push(
      setTimeout(() => {
        this.managers.modal.unlockScroll();

        if (this.core.options.behavior.focusInputAfterClose) {
          this.core.getInput()?.focus();
        }

        this.releaseRipple();
        this.core.getModalElement()?.remove();
        this.core.setIsModalRemove(true);
        this.core.getOpenElement().forEach((openEl) => openEl?.classList.remove('disabled'));
      }, this.managers.animation.removeAnimationToClose()),
    );
  }

  destroy(options?: { keepInputValue?: boolean; callback?: TypeFunction } | TypeFunction): void {
    if (this.core.isDestroyed) return;

    this.clearUnmountTimeouts();

    const config = typeof options === 'function' ? { callback: options } : options || {};
    const { keepInputValue = false, callback } = config;

    const input = this.core.getInput();
    const inputValue = keepInputValue ? input?.value : null;

    this.releaseRipple();

    const modal = this.core.getModalElement();
    modal?.remove();

    const openElements = this.core.getOpenElement();
    openElements?.forEach((el) => {
      if (el) {
        el.classList.remove('disabled', 'tp-ui-open-element');
      }
    });

    if (input) {
      input.classList.remove('tp-ui-invalid-format', 'tp-ui-input');

      input.removeAttribute('data-open');
      input.removeAttribute('data-owner-id');

      if (keepInputValue && inputValue) {
        input.value = inputValue;
      }
    }

    const element = this.core.element;
    if (element) {
      element.removeAttribute('data-owner-id');
      element.removeAttribute('data-open');

      if (this.core.options.ui.cssClass) {
        element.classList.remove(this.core.options.ui.cssClass);
      }
    }

    const invalidTextElements = element?.querySelectorAll('.tp-ui-invalid-text');
    invalidTextElements?.forEach((el) => el.remove());

    this.core.reset();
    this.managers.destroy();
    this.emitter.clear();

    this.managers.modal.unlockScroll();

    if (callback) callback();
  }

  private eventsBundle(isRerender = false): void {
    if (this.core.isDestroyed) return;
    if (!this.core.isModalRemove) return;

    this.isRendering = true;
    this.clearUnmountTimeouts();
    this.detachOpenHandlers();
    this.core.setIsOpen(true);
    this.core.setIsModalRemove(false);

    this.disableOpenElements();
    this.setupModal();
    this.setupValidation();
    this.applyExpandedState();

    this.managers.modal.setFlexEndToFooterIfNoKeyboardIcon();
    this.applyWrapperCssClass();

    if (isRerender) {
      this.managers.animation.setAnimationToOpen(true);
    }

    this.managers.config.getInputValueOnOpenAndSet(!isRerender);

    const wheelModeActive = isWheelMode(this.core.options) && PluginRegistry.has('wheel');
    emitMissingPluginErrors(this.core, this.emitter);
    this.revealClockFace(wheelModeActive, isRerender);
    this.initClockOrWheel(wheelModeActive);
    this.initOptionalPlugins(wheelModeActive);
    this.bindEventHandlers(wheelModeActive);
    this.initRipple();

    if (isPopoverMode(this.core.options)) {
      const wheel = this.managers.getPlugin('wheel');
      wheel?.attachPopover?.();
    }

    if (!isRerender) {
      this.managers.animation.setAnimationToOpen();
      this.managers.modal.setInitialFocus();
    }

    this.isRendering = false;
    this.runPendingRerender(isRerender);
  }

  private runPendingRerender(isRerender: boolean): void {
    const isPending = this.isRerenderPending;
    this.isRerenderPending = false;

    if (isPending && !isRerender && this.core.isOpen) {
      this.rerender();
    }
  }

  private setupValidation(): void {
    this.managers.validation.setErrorHandler();
  }

  private detachOpenHandlers(): void {
    this.managers.events.detach();
    this.managers.clearButton.detach();
  }

  private disableOpenElements(): void {
    if (!isInlineMode(this.core.options)) {
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
    modal?.querySelectorAll('*').forEach((el) => {
      if (!el.classList.contains('tp-ui-select-time')) {
        el.classList.add('expanded');
      }
    });
  }

  private applyWrapperCssClass(): void {
    const { cssClass } = this.core.options.ui;
    if (cssClass) {
      this.core.getWrapper()?.classList.add(cssClass);
    }
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

      if (this.core.options.clock.showSeconds) {
        this.managers.events.handleSecondsEvents();
      }
    }

    this.managers.events.handleKeyboardInput();
    this.managers.events.handlePointerModality();

    if (this.core.options.ui.enableSwitchIcon && !isWheelMode) {
      this.managers.events.handleSwitchViewButton();
    }

    if (this.core.options.clock.type !== '24h' && !isCompactWheelMode(this.core.options)) {
      this.managers.events.handleAmClick();
      this.managers.events.handlePmClick();
    }

    if (this.core.options.behavior.focusTrap && !isEmbeddedInlineMode(this.core.options)) {
      this.managers.events.focusTrapHandler();
    }

    if (!isInlineMode(this.core.options)) {
      this.managers.events.handleEscClick();

      if (!isPopoverMode(this.core.options)) {
        const isWheelWithPersist = isWheelMode && this.core.options.wheel?.ignoreOutsideClick;

        if (!isWheelWithPersist) {
          this.managers.events.handleBackdropClick();
        }
      }
    }
  }

  private initRipple(): void {
    const modal = this.core.getModalElement();
    if (modal) {
      this.rippleCleanup();
      this.rippleCleanup = initMd3Ripple(modal);
    }
  }

  private revealClockFace(isWheelMode: boolean, immediately: boolean): void {
    const clockFace = isWheelMode ? null : this.core.getClockFace();
    if (!clockFace) return;

    if (immediately) {
      clockFace.classList.add('scale-in');
    } else if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          clockFace.classList.add('scale-in');
        });
      });
    }
  }

  private releaseRipple(): void {
    this.rippleCleanup();
    this.rippleCleanup = () => {};
  }

  private clearUnmountTimeouts(): void {
    this.unmountTimeouts.forEach(clearTimeout);
    this.unmountTimeouts = [];
  }
}
