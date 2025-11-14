import type { RenderConfig, ClockMode, DisabledTimeConfig, ClockType, AmPmType } from '../types';
import { HourEngine } from '../engine/HourEngine';
import { MinuteEngine } from '../engine/MinuteEngine';

export class ClockRenderer {
  private config: RenderConfig;
  private currentAngle: number = 0;
  private tipsCache = new Map<string, { wrapper: HTMLElement; tip: HTMLElement }>();

  constructor(config: RenderConfig) {
    this.config = config;
  }

  setHandAngle(angle: number): void {
    if (Math.abs(this.currentAngle - angle) < 0.1) return;

    this.currentAngle = angle;
    this.config.clockHand.style.transform = `rotateZ(${angle}deg)`;
  }

  setActiveValue(value: string): void {
    const wrappers = [this.config.tipsWrapper];
    if (this.config.tipsWrapperFor24h) {
      wrappers.push(this.config.tipsWrapperFor24h);
    }

    wrappers.forEach((wrapper) => {
      const tips = wrapper.querySelectorAll('.timepicker-ui-value-tips, .timepicker-ui-value-tips-24h');

      tips.forEach((tip) => {
        const htmlTip = tip as HTMLElement;
        const isActive = htmlTip.textContent === value || Number(htmlTip.textContent) === Number(value);

        if (isActive) {
          htmlTip.classList.add('active');
          htmlTip.setAttribute('aria-selected', 'true');
        } else {
          htmlTip.classList.remove('active');
          htmlTip.setAttribute('aria-selected', 'false');
        }
      });
    });
  }

  renderTips(
    values: string[],
    className: string,
    mode: ClockMode,
    disabledTime: DisabledTimeConfig | null,
    clockType: ClockType,
    clearBefore: boolean = true,
    targetWrapper?: HTMLElement,
    amPm: AmPmType = '',
    currentHour: string = '12',
  ): void {
    const wrapper = targetWrapper || this.config.tipsWrapper;

    if (clearBefore) {
      wrapper.innerHTML = '';
      this.tipsCache.clear();
    }

    const wrapperWidth = (wrapper.offsetWidth - 32) / 2;
    const wrapperHeight = (wrapper.offsetHeight - 32) / 2;
    const radius = wrapperWidth - 9;

    const fragment = document.createDocumentFragment();
    const cacheKey = `${className}-${this.config.theme || 'default'}`;

    values.forEach((value, index) => {
      const tipKey = `${cacheKey}-${value}`;

      let cached = this.tipsCache.get(tipKey);
      if (!cached) {
        cached = this.createTip(value, className, clockType);
        this.tipsCache.set(tipKey, cached);
      }

      const { wrapper: span, tip: spanTip } = cached;
      this.updateTipState(span, spanTip, value, mode, disabledTime, clockType, amPm, currentHour);

      const angle = index * (360 / values.length) * (Math.PI / 180);
      span.style.left = `${wrapperWidth + Math.sin(angle) * radius}px`;
      span.style.bottom = `${wrapperHeight + Math.cos(angle) * radius}px`;

      fragment.appendChild(span);
    });

    wrapper.appendChild(fragment);
  }

  private createTip(
    value: string,
    className: string,
    clockType: ClockType,
  ): { wrapper: HTMLElement; tip: HTMLElement } {
    const span = document.createElement('span');
    const spanTip = document.createElement('span');

    spanTip.textContent = value;
    spanTip.setAttribute('role', 'option');
    spanTip.setAttribute('aria-selected', 'false');
    spanTip.tabIndex = 0;

    const tipClass =
      clockType === '24h' && className.includes('24')
        ? 'timepicker-ui-value-tips-24h'
        : 'timepicker-ui-value-tips';

    spanTip.classList.add(tipClass);
    span.classList.add(className);

    if (this.config.theme) {
      span.classList.add(this.config.theme);
      spanTip.classList.add(this.config.theme);
    }

    span.appendChild(spanTip);
    return { wrapper: span, tip: spanTip };
  }

  private updateTipState(
    span: HTMLElement,
    spanTip: HTMLElement,
    value: string,
    mode: ClockMode,
    disabledTime: DisabledTimeConfig | null,
    clockType: ClockType,
    amPm: AmPmType,
    currentHour: string,
  ): void {
    span.classList.remove('timepicker-ui-tips-disabled');
    spanTip.classList.remove('timepicker-ui-tips-disabled');
    spanTip.removeAttribute('aria-disabled');
    spanTip.tabIndex = 0;

    const isDisabled = this.checkIfDisabled(value, mode, disabledTime, clockType, amPm, currentHour);

    if (isDisabled) {
      span.classList.add('timepicker-ui-tips-disabled');
      spanTip.classList.add('timepicker-ui-tips-disabled');
      spanTip.setAttribute('aria-disabled', 'true');
      spanTip.tabIndex = -1;
    }
  }

  private checkIfDisabled(
    value: string,
    mode: ClockMode,
    disabledTime: DisabledTimeConfig | null,
    clockType: ClockType,
    amPm: AmPmType,
    currentHour: string,
  ): boolean {
    if (!disabledTime) return false;

    if (mode === 'hours') {
      return HourEngine.isDisabled(value, amPm, disabledTime);
    }

    if (mode === 'minutes') {
      return MinuteEngine.isDisabled(value, currentHour, amPm, disabledTime, clockType);
    }

    return false;
  }

  setCircleSize(isLarge: boolean): void {
    if (isLarge) {
      this.config.circle.classList.remove('small-circle');
    } else {
      this.config.circle.classList.add('small-circle');
    }
  }

  setCircle24hMode(is24h: boolean): void {
    if (is24h) {
      this.config.circle.classList.add('timepicker-ui-circle-hand-24h');
      this.config.clockHand.classList.add('timepicker-ui-clock-hand-24h');
    } else {
      this.config.circle.classList.remove('timepicker-ui-circle-hand-24h');
      this.config.clockHand.classList.remove('timepicker-ui-clock-hand-24h');
    }
  }

  destroy(): void {
    this.tipsCache.clear();
    this.config.tipsWrapper.innerHTML = '';
  }
}

