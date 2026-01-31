import type { RenderConfig, ClockMode, DisabledTimeConfig, ClockType, AmPmType } from '../types';
import { HourEngine } from '../engine/HourEngine';
import { MinuteEngine } from '../engine/MinuteEngine';
import { AngleEngine } from '../engine/AngleEngine';
import { isDocument } from '../../../utils/node';

export class ClockRenderer {
  private config: RenderConfig;
  private currentAngle: number = 0;
  private tipsCache = new Map<string, { wrapper: HTMLElement; tip: HTMLElement }>();
  private cachedDimensions: Map<HTMLElement, { width: number; height: number; radius: number }> = new Map();
  private currentActiveElement: HTMLElement | null = null;
  private lastActiveValue: string = '';

  constructor(config: RenderConfig) {
    this.config = config;
  }

  private getCachedDimensions(wrapper: HTMLElement): { width: number; height: number; radius: number } {
    let cached = this.cachedDimensions.get(wrapper);
    if (!cached) {
      const wrapperWidth = (wrapper.offsetWidth - 32) / 2;
      const wrapperHeight = (wrapper.offsetHeight - 32) / 2;
      const radius = wrapperWidth - 9;
      cached = { width: wrapperWidth, height: wrapperHeight, radius };
      this.cachedDimensions.set(wrapper, cached);
    }
    return cached;
  }

  private normalizeAngle(angle: number): number {
    let normalized = angle % 360;
    if (normalized < 0) normalized += 360;
    return normalized;
  }

  setHandAngle(angle: number): void {
    const normalizedCurrent = this.normalizeAngle(this.currentAngle);
    const normalizedTarget = this.normalizeAngle(angle);

    if (Math.abs(normalizedCurrent - normalizedTarget) < 0.1) return;

    const targetAngle = AngleEngine.calculateShortestPath(normalizedCurrent, normalizedTarget);
    this.currentAngle = this.normalizeAngle(targetAngle);
    this.config.clockHand.style.transform = `rotateZ(${this.currentAngle}deg)`;
  }

  animateToAngle(angle: number): void {
    const normalizedCurrent = this.normalizeAngle(this.currentAngle);
    const normalizedTarget = this.normalizeAngle(angle);

    const targetAngle = AngleEngine.calculateShortestPath(normalizedCurrent, normalizedTarget);
    this.currentAngle = this.normalizeAngle(targetAngle);

    this.config.tipsWrapper.classList.add('tp-ui-tips-animation');
    this.config.clockHand.style.transform = `rotateZ(${this.currentAngle}deg)`;

    setTimeout(() => {
      this.config.tipsWrapper.classList.remove('tp-ui-tips-animation');
    }, 401);
  }

  setActiveValue(value: string): void {
    if (value === this.lastActiveValue) {
      return;
    }
    this.lastActiveValue = value;

    if (this.currentActiveElement) {
      this.currentActiveElement.classList.remove('active');
      this.currentActiveElement.setAttribute('aria-selected', 'false');
      this.currentActiveElement = null;
    }

    const wrappers = [this.config.tipsWrapper];
    if (this.config.tipsWrapperFor24h) {
      wrappers.push(this.config.tipsWrapperFor24h);
    }

    for (const wrapper of wrappers) {
      const tips = wrapper.querySelectorAll('.tp-ui-value-tips, .tp-ui-value-tips-24h');

      for (let i = 0; i < tips.length; i++) {
        const htmlTip = tips[i] as HTMLElement;
        if (htmlTip.textContent === value || Number(htmlTip.textContent) === Number(value)) {
          htmlTip.classList.add('active');
          htmlTip.setAttribute('aria-selected', 'true');
          this.currentActiveElement = htmlTip;
          return;
        }
      }
    }
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
    if (isDocument() === false) {
      return;
    }

    const wrapper = targetWrapper || this.config.tipsWrapper;

    if (clearBefore) {
      wrapper.innerHTML = '';
      this.tipsCache.clear();
      this.currentActiveElement = null;
      this.lastActiveValue = '';
    }

    const { width: wrapperWidth, height: wrapperHeight, radius } = this.getCachedDimensions(wrapper);

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
    if (isDocument() === false) {
      const dummy = {} as HTMLElement;
      return { wrapper: dummy, tip: dummy };
    }

    const span = document.createElement('span');
    const spanTip = document.createElement('span');

    spanTip.textContent = value;
    spanTip.setAttribute('role', 'option');
    spanTip.setAttribute('aria-selected', 'false');
    spanTip.tabIndex = 0;

    const tipClass =
      clockType === '24h' && className.includes('24') ? 'tp-ui-value-tips-24h' : 'tp-ui-value-tips';

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
    span.classList.remove('tp-ui-tips-disabled');
    spanTip.classList.remove('tp-ui-tips-disabled');
    spanTip.removeAttribute('aria-disabled');
    spanTip.tabIndex = 0;

    const isDisabled = this.checkIfDisabled(value, mode, disabledTime, clockType, amPm, currentHour);

    if (isDisabled) {
      span.classList.add('tp-ui-tips-disabled');
      spanTip.classList.add('tp-ui-tips-disabled');
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
      this.config.circle.classList.add('tp-ui-circle-hand-24h');
      this.config.clockHand.classList.add('tp-ui-clock-hand-24h');
    } else {
      this.config.circle.classList.remove('tp-ui-circle-hand-24h');
      this.config.clockHand.classList.remove('tp-ui-clock-hand-24h');
    }
  }

  destroy(): void {
    this.tipsCache.clear();
    this.cachedDimensions.clear();
    this.currentActiveElement = null;
    this.lastActiveValue = '';
    this.config.tipsWrapper.innerHTML = '';
  }
}
