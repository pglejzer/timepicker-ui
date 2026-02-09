import type { CoreState } from '../../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../../utils/EventEmitter';
import { TIMINGS } from '../../constants/timings';
import keyboardSvg from '../../../assets/keyboard.svg';
import scheduleSvg from '../../../assets/schedule.svg';

export class MobileViewHandler {
  private core: CoreState;
  private emitter: EventEmitter<TimepickerEventMap>;
  private isAnimating: boolean = false;

  constructor(core: CoreState, emitter: EventEmitter<TimepickerEventMap>) {
    this.core = core;
    this.emitter = emitter;
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.emitter.on('switch:view', () => {
      this.toggleMobileClockFace();
    });
  }

  checkMobileOption(): void {
    this.core.setIsMobileView(!!this.core.options.ui.mobile);
    if (this.core.options.ui.mobile) {
      this.core.updateOptions({ ui: { editable: true } });
    }
  }

  toggleMobileClockFace(): void {
    if (this.isAnimating) return;

    const modal = this.core.getModalElement();
    if (!modal) return;

    const wrapper = modal.querySelector('.tp-ui-wrapper');
    const icon = this.core.getKeyboardClockIcon();
    const mobileClockWrapper = modal.querySelector('.tp-ui-mobile-clock-wrapper');
    const allElements = modal.querySelectorAll('*');
    const selectTimeLabel = modal.querySelector('.tp-ui-select-time');
    const hourInput = this.core.getHour();
    const minuteInput = this.core.getMinutes();
    const clockFace = this.core.getClockFace();

    if (!wrapper) return;

    const isExpanded = wrapper.classList.contains('expanded');
    const isOriginallyMobile = this.core.isMobileView;

    if (isExpanded) {
      this.collapseClockFace(
        wrapper,
        mobileClockWrapper,
        allElements,
        icon,
        selectTimeLabel,
        hourInput,
        minuteInput,
        clockFace,
        isOriginallyMobile,
      );
    } else {
      this.expandClockFace(
        wrapper,
        mobileClockWrapper,
        allElements,
        icon,
        selectTimeLabel,
        hourInput,
        minuteInput,
        clockFace,
      );
    }
  }

  private collapseClockFace(
    wrapper: Element,
    mobileClockWrapper: Element | null,
    allElements: NodeListOf<Element>,
    icon: HTMLElement | null,
    selectTimeLabel: Element | null,
    hourInput: HTMLInputElement | null,
    minuteInput: HTMLInputElement | null,
    clockFace: HTMLDivElement | null,
    isOriginallyMobile: boolean,
  ): void {
    this.isAnimating = true;

    this.switchView(selectTimeLabel, icon, hourInput, minuteInput, true);

    allElements.forEach((el) => {
      if (el !== mobileClockWrapper && el !== wrapper && el !== selectTimeLabel) {
        el.classList.remove('expanded');
        if (isOriginallyMobile) {
          el.classList.add('mobile');
        }
      }
    });

    if (selectTimeLabel) {
      selectTimeLabel.classList.remove('expanded');
      if (isOriginallyMobile) {
        selectTimeLabel.classList.add('mobile');
      }
    }

    if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(() => {
        mobileClockWrapper?.classList.remove('expanded');
        if (isOriginallyMobile) {
          mobileClockWrapper?.classList.add('mobile');
        }
        wrapper?.classList.remove('expanded');
        if (isOriginallyMobile) {
          wrapper?.classList.add('mobile');
        }

        if (isOriginallyMobile) {
          clockFace?.classList.remove('scale-in');
        } else {
          clockFace?.classList.add('scale-in');
        }

        setTimeout(() => {
          this.isAnimating = false;
        }, TIMINGS.MOBILE_TOGGLE);
      });
    } else {
      this.isAnimating = false;
    }

    icon?.setAttribute('aria-label', 'Show clock face');
    icon?.setAttribute('aria-pressed', 'false');
  }

  private expandClockFace(
    wrapper: Element,
    mobileClockWrapper: Element | null,
    allElements: NodeListOf<Element>,
    icon: HTMLElement | null,
    selectTimeLabel: Element | null,
    hourInput: HTMLInputElement | null,
    minuteInput: HTMLInputElement | null,
    clockFace: HTMLDivElement | null,
  ): void {
    this.isAnimating = true;

    const isMinutesActive = minuteInput?.classList.contains('active');

    if (isMinutesActive && minuteInput) {
      this.emitter.emit('select:minute', { minutes: minuteInput.value });
    } else if (hourInput) {
      this.emitter.emit('select:hour', { hour: hourInput.value });
    }

    allElements.forEach((el) => {
      if (el !== mobileClockWrapper && el !== wrapper && el !== selectTimeLabel) {
        el.classList.remove('mobile');
        el.classList.add('expanded');
      }
    });

    if (selectTimeLabel) {
      selectTimeLabel.classList.remove('mobile');
      selectTimeLabel.classList.add('expanded');
    }

    this.switchView(selectTimeLabel, icon, hourInput, minuteInput, false);

    if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(() => {
        wrapper.classList.remove('mobile');
        wrapper.classList.add('expanded');

        requestAnimationFrame(() => {
          if (mobileClockWrapper) {
            mobileClockWrapper.classList.remove('mobile');
            mobileClockWrapper.classList.add('expanded');
          }

          if (clockFace) {
            clockFace.classList.remove('scale-in');
          }

          setTimeout(() => {
            if (clockFace) {
              clockFace.classList.add('scale-in');
            }
          }, TIMINGS.CLOCK_SCALE_DELAY);

          setTimeout(() => {
            this.isAnimating = false;
          }, TIMINGS.MOBILE_TOGGLE);
        });
      });
    } else {
      this.isAnimating = false;
    }

    icon?.setAttribute('aria-label', 'Hide clock face');
    icon?.setAttribute('aria-pressed', 'true');
  }

  private switchView(
    selectTimeLabel: Element | null,
    icon: HTMLElement | null,
    hourInput: HTMLInputElement | null,
    minuteInput: HTMLInputElement | null,
    isMobileView: boolean,
  ): void {
    const modal = this.core.getModalElement();
    const hourText = modal?.querySelector('.tp-ui-hour-text');
    const minuteText = modal?.querySelector('.tp-ui-minute-text');
    const iconButton = icon?.querySelector('.tp-ui-keyboard-icon');
    const inputWrapper = this.core.getInputWrappers();
    const header = this.core.getHeader();
    const wrapperTypeTime = modal?.querySelector('.tp-ui-wrapper-type-time');
    const amButton = modal?.querySelector('.tp-ui-am');
    const pmButton = modal?.querySelector('.tp-ui-pm');
    const inputRippleWrappers = modal?.querySelectorAll('.tp-ui-input-ripple-wrapper');

    const { iconTemplate, iconTemplateMobile } = this.core.options.ui;
    const { time: timeLabel, mobileTime: mobileTimeLabel } = this.core.options.labels;

    if (isMobileView) {
      selectTimeLabel?.classList.add('mobile');
      icon?.classList.add('mobile');
      hourInput?.classList.add('mobile');
      hourInput?.removeAttribute('readonly');
      minuteInput?.classList.add('mobile');
      minuteInput?.removeAttribute('readonly');
      hourText?.classList.add('mobile');
      minuteText?.classList.add('mobile');
      header?.classList.add('mobile');
      wrapperTypeTime?.classList.add('mobile');
      amButton?.classList.add('mobile');
      amButton?.classList.remove('tp-ui-ripple');
      pmButton?.classList.add('mobile');
      pmButton?.classList.remove('tp-ui-ripple');
      inputWrapper?.forEach((wrapper) => {
        wrapper.classList.add('mobile');
      });
      inputRippleWrappers?.forEach((wrapper) => {
        wrapper.classList.add('mobile');
      });

      if (selectTimeLabel && mobileTimeLabel) {
        selectTimeLabel.textContent = mobileTimeLabel;
      }

      if (iconButton) {
        iconButton.innerHTML = iconTemplateMobile || scheduleSvg;
      }

      this.updateClockFaceAccessibility(true);
    } else {
      selectTimeLabel?.classList.remove('mobile');
      icon?.classList.remove('mobile');
      hourInput?.classList.remove('mobile');
      minuteInput?.classList.remove('mobile');

      if (!this.core.options.ui.editable) {
        hourInput?.setAttribute('readonly', '');
        minuteInput?.setAttribute('readonly', '');
      }

      hourText?.classList.remove('mobile');
      minuteText?.classList.remove('mobile');
      header?.classList.remove('mobile');
      wrapperTypeTime?.classList.remove('mobile');
      amButton?.classList.remove('mobile');
      amButton?.classList.add('tp-ui-ripple');
      pmButton?.classList.remove('mobile');
      pmButton?.classList.add('tp-ui-ripple');
      inputWrapper?.forEach((wrapper) => {
        wrapper.classList.remove('mobile');
      });
      inputRippleWrappers?.forEach((wrapper) => {
        wrapper.classList.remove('mobile');
      });

      if (selectTimeLabel && timeLabel) {
        selectTimeLabel.textContent = timeLabel;
      }

      if (iconButton) {
        iconButton.innerHTML = iconTemplate || keyboardSvg;
      }

      this.updateClockFaceAccessibility(false);
    }
  }

  public updateClockFaceAccessibility(isHidden: boolean): void {
    const clockFace = this.core.getClockFace();
    if (!clockFace) return;

    const tipsWrapper = clockFace.querySelector('.tp-ui-tips-wrapper');
    const tipsWrapper24h = clockFace.querySelector('.tp-ui-tips-wrapper-24h');
    const allTips = clockFace.querySelectorAll<HTMLElement>('.tp-ui-tip');

    if (isHidden) {
      clockFace.setAttribute('aria-hidden', 'true');
      tipsWrapper?.setAttribute('aria-hidden', 'true');
      tipsWrapper24h?.setAttribute('aria-hidden', 'true');
      allTips.forEach((tip) => {
        tip.setAttribute('tabindex', '-1');
        tip.setAttribute('aria-hidden', 'true');
      });
    } else {
      clockFace.removeAttribute('aria-hidden');
      tipsWrapper?.removeAttribute('aria-hidden');
      tipsWrapper24h?.removeAttribute('aria-hidden');
      allTips.forEach((tip) => {
        tip.setAttribute('tabindex', '0');
        tip.removeAttribute('aria-hidden');
      });
    }
  }

  destroy(): void {}
}
