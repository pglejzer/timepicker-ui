import { initCallback } from '../utils/config';
import { debounce } from '../utils/debounce';
import { allEvents } from '../utils/variables';
import { initMd3Ripple } from '../utils/ripple';
import TimepickerCore from './TimepickerCore';

type TypeFunction = () => void;

export default class TimepickerLifecycle extends TimepickerCore {
  public create = (): void => {
    if (this._isDestroyed) {
      return;
    }

    if (this._isInitialized) {
      return;
    }

    try {
      this.configManager.updateInputValueWithCurrentTimeOnStart();
      this.validationManager.checkDisabledValuesOnStart();
    } catch (error) {
      this._isDestroyed = true;
      return;
    }

    this.themeManager.setTimepickerClassToElement();
    this.themeManager.setInputClassToInputElement();
    this.themeManager.setDataOpenToInputIfDoesntExistInWrapper();
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

  public open = (callback?: () => void): void => {
    if (this._isDestroyed) {
      return;
    }

    if (!this._isInitialized) {
      this.create();
    }

    this._eventsBundle();

    initCallback(callback);
  };

  public close = () =>
    debounce((...args: Array<boolean | TypeFunction>): void => {
      if (args.length > 2 || !this.modalElement) return;

      const [update] = args.filter((e) => typeof e === 'boolean');
      const [callback] = args.filter((e) => typeof e === 'function');

      this._isMobileView = !!this._options.mobile;

      if (update) {
        this.eventManager.handleOkButton();
        this.okButton?.click();
      }

      this._isTouchMouseMove = false;

      document.removeEventListener('mousedown', this.eventManager._onDragStart, false);
      document.removeEventListener('touchstart', this.eventManager._onDragStart);
      document.removeEventListener('mousemove', this.eventManager._onDragMove, false);
      document.removeEventListener('mouseup', this.eventManager._onDragEnd, false);
      document.removeEventListener('touchmove', this.eventManager._onDragMove);
      document.removeEventListener('touchend', this.eventManager._onDragEnd, false);
      document.removeEventListener('mouseleave', this.eventManager._onDragEnd, false);

      document.removeEventListener('mousedown', this._eventsClickMobileHandler);
      document.removeEventListener('touchstart', this._eventsClickMobileHandler);
      document.removeEventListener('keypress', this.eventManager.handleEscClick);
      this.wrapper.removeEventListener('keydown', this.eventManager.focusTrapHandler);

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

        this.clockManager.destroyClockSystem();

        this.modalElement.remove();

        this._isModalRemove = true;
      }, 300);

      initCallback(callback as TypeFunction);
    }, this._options.delayHandler || 300);

  public destroy = (options?: { keepInputValue?: boolean; callback?: TypeFunction } | TypeFunction): void => {
    if (this._isDestroyed) {
      return;
    }

    const config = typeof options === 'function' ? { callback: options } : options || {};
    const { keepInputValue = false, callback } = config;

    const inputValue = keepInputValue ? this.input?.value : null;

    this.domBatcher.destroy();

    allEvents.split(' ').forEach((event) => {
      document.removeEventListener(event, this._mutliEventsMoveHandler, false);
    });

    document.removeEventListener('mousedown', this.eventManager._onDragStart, false);
    document.removeEventListener('touchstart', this.eventManager._onDragStart);
    document.removeEventListener('mousemove', this.eventManager._onDragMove, false);
    document.removeEventListener('mouseup', this.eventManager._onDragEnd, false);
    document.removeEventListener('touchmove', this.eventManager._onDragMove);
    document.removeEventListener('touchend', this.eventManager._onDragEnd, false);
    document.removeEventListener('mouseleave', this.eventManager._onDragEnd, false);

    document.removeEventListener('mousedown', this._eventsClickMobileHandler);
    document.removeEventListener('touchstart', this._eventsClickMobileHandler);

    this.modalElement?.remove();

    this.openElement?.forEach((el) => {
      if (el) {
        el.classList.remove('disabled', 'active', 'timepicker-ui-open-element');
        el.classList.remove('basic', 'crane-straight', 'crane', 'm2', 'm3-green');
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
      this._element.classList.remove('basic', 'crane-straight', 'crane', 'm2', 'm3-green');

      this._element.classList.remove('error', 'active', 'disabled');

      this._element.removeAttribute('data-owner-id');
      this._element.removeAttribute('data-open');

      if (this._options.cssClass) {
        this._element.classList.remove(this._options.cssClass);
      }
    }

    const invalidTextElements = this._element?.querySelectorAll('.timepicker-ui-invalid-text');
    invalidTextElements?.forEach((el) => el.remove());

    this._mutliEventsMoveHandler = (() => {}) as EventListenerOrEventListenerObject;
    this._eventsClickMobileHandler = (() => {}) as EventListenerOrEventListenerObject;
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

    this.onDestroy?.();

    initCallback(callback);
  };

  protected onDestroy?: () => void;

  _eventsBundle = (): void => {
    if (this._isDestroyed) {
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

    this.clockManager.setOnStartCSSClassesIfClockType24h();
    this.clockManager.setClassActiveToHourOnOpen();

    if (this.modalElement) {
      initMd3Ripple(this.modalElement);
    }

    if (!this._isMobileView) {
      const clockWrapper = this.modalElement?.querySelector('.timepicker-ui-mobile-clock-wrapper');
      const wrapper = this.modalElement?.querySelector('.timepicker-ui-wrapper');
      const allElements = this.modalElement?.querySelectorAll('*');

      clockWrapper?.classList.add('expanded');
      wrapper?.classList.add('expanded');
      allElements?.forEach((el) => {
        if (
          !el.classList.contains('timepicker-ui-select-time') &&
          !el.classList.contains('timepicker-ui-mobile-clock-wrapper') &&
          !el.classList.contains('timepicker-ui-wrapper')
        ) {
          el.classList.add('expanded');
        }
      });
    }
    this.modalManager.setFlexEndToFooterIfNoKeyboardIcon();

    setTimeout(() => {
      this.themeManager.setTheme();

      const wrapper = this.modalElement?.querySelector('.timepicker-ui-wrapper');
      if (wrapper) {
        if (this._options.cssClass) {
          wrapper.classList.add(this._options.cssClass);
        }

        if (this._pendingThemeConfig) {
          this._applyThemeToWrapper(wrapper as HTMLElement);
        }
      }
    }, 0);

    this.animationManager.setAnimationToOpen();
    this.configManager.getInputValueOnOpenAndSet();

    this.clockManager.initializeClockSystem();

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

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.clockFace?.classList.add('scale-in');
        });
      });
    }

    this.eventManager.handleCancelButton();
    this.eventManager.handleOkButton();

    if (this.modalElement) {
      this.modalManager.setShowClassToBackdrop();
      if (!this._options.inline?.enabled) {
        this.eventManager.handleBackdropClick();
      }
    }

    this.eventManager.handleClickOnHourMobile();
    this.eventManager.handleIconChangeView();

    if (this._options.focusTrap) {
      this.eventManager.focusTrapHandler();
    }

    if (this._options.inline?.enabled && this._options.inline.autoUpdate !== false) {
      this.eventManager.handleInlineAutoUpdate();
    }
  };
}
