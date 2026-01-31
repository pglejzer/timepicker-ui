import { getInputValue } from '../utils/input';
import { createDisabledTime } from '../utils/time/disable';
import { selectorActive } from '../utils/variables';
import type { CoreState } from '../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../utils/EventEmitter';
import { TIMINGS } from '../constants/timings';
import keyboardSvg from '../../assets/keyboard.svg';
import scheduleSvg from '../../assets/schedule.svg';

export default class ConfigManager {
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

  private isCurrentTimeEnabled(optionKey: 'preventClockType' | 'updateInput'): boolean {
    const currentTime = this.core.options.clock.currentTime;
    if (typeof currentTime === 'boolean') return currentTime;
    return !!currentTime?.[optionKey];
  }

  preventClockTypeByCurrentTime(): void {
    if (!this.isCurrentTimeEnabled('preventClockType')) return;

    const input = this.core.getInput();
    if (!input) return;

    const { currentTime, clockType } = {
      currentTime: this.core.options.clock.currentTime,
      clockType: this.core.options.clock.type,
    };
    const { type } = getInputValue(input, clockType, currentTime, true);
    this.core.updateOptions({ clock: { type: type ? '12h' : '24h' } });
  }

  updateInputValueWithCurrentTimeOnStart(): void {
    if (!this.isCurrentTimeEnabled('updateInput')) return;

    const input = this.core.getInput();
    if (!input) return;

    const { hour, minutes, type } = getInputValue(
      input,
      this.core.options.clock.type,
      this.core.options.clock.currentTime,
    );

    input.value = type ? `${hour}:${minutes} ${type}` : `${hour}:${minutes}`;
  }

  checkMobileOption(): void {
    this.core.setIsMobileView(!!this.core.options.ui.mobile);
    if (this.core.options.ui.mobile) {
      this.core.updateOptions({ ui: { editable: true } });
    }
  }

  getDisableTime(): void {
    const disabledTimeResult = createDisabledTime(this.core.options);
    this.core.setDisabledTime(disabledTimeResult || null);
  }

  getInputValueOnOpenAndSet(): void {
    const input = this.core.getInput();
    if (!input) return;

    const value = getInputValue(input, this.core.options.clock.type, this.core.options.clock.currentTime);
    const hour = this.core.getHour();
    const minutes = this.core.getMinutes();
    const activeTypeMode = this.core.getActiveTypeMode();
    const AM = this.core.getAM();

    if (value === undefined) {
      if (hour) hour.value = '12';
      if (minutes) minutes.value = '00';

      const eventData = {
        hour: hour?.value || '12',
        minutes: minutes?.value || '00',
        type: activeTypeMode?.dataset.type,
        degreesHours: this.core.degreesHours,
        degreesMinutes: this.core.degreesMinutes,
      };

      this.emitter.emit('open', eventData);

      const isRangeMode = this.core.options.range?.enabled === true;
      if (this.core.options.clock.type !== '24h' && AM && !isRangeMode) {
        AM.classList.add(selectorActive);
      }
      return;
    }

    let [hourValue, minutesValue, typeValue] = input.value.split(':').join(' ').split(' ');
    if (input.value.length === 0) {
      hourValue = value.hour as string;
      minutesValue = value.minutes as string;
      typeValue = value.type as string;
    }

    if (hour) hour.value = hourValue.padStart(2, '0');
    if (minutes) minutes.value = minutesValue.padStart(2, '0');

    const modal = this.core.getModalElement();
    const typeMode = modal?.querySelector(`[data-type='${typeValue}']`) as HTMLElement;
    if (this.core.options.clock.type !== '24h' && typeMode) {
      typeMode.classList.add(selectorActive);
    }

    const eventData = {
      ...value,
      type: activeTypeMode?.dataset.type,
      degreesHours: this.core.degreesHours,
      degreesMinutes: this.core.degreesMinutes,
    };

    this.emitter.emit('open', eventData);
  }

  getInputValue(
    el: HTMLInputElement,
    clockType: string,
    currentTime: typeof this.core.options.clock.currentTime,
  ): ReturnType<typeof getInputValue> {
    return getInputValue(el, clockType, currentTime);
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

    const { iconTemplate, iconTemplateMobile } = this.core.options.ui;
    const { time: timeLabel, mobileTime: mobileTimeLabel } = this.core.options.labels;

    if (isMobileView) {
      selectTimeLabel?.classList.add('mobile');
      icon?.classList.add('mobile');
      hourInput?.classList.add('mobile');
      minuteInput?.classList.add('mobile');
      hourText?.classList.add('mobile');
      minuteText?.classList.add('mobile');
      header?.classList.add('mobile');
      inputWrapper?.forEach((wrapper) => {
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
      hourText?.classList.remove('mobile');
      minuteText?.classList.remove('mobile');
      header?.classList.remove('mobile');
      inputWrapper?.forEach((wrapper) => {
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

  destroy(): void {
    // No resources to clean up in ConfigManager}
  }
}
