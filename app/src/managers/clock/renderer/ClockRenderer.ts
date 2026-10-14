import type { RenderConfig, ClockMode, DisabledTimeConfig, ClockType, AmPmType, FaceContext } from '../types';
import { HourEngine } from '../engine/HourEngine';
import { MinuteEngine } from '../engine/MinuteEngine';
import { AngleEngine } from '../engine/AngleEngine';
import { isDocument } from '../../../utils/node';
import { prefersReducedMotion, setClass } from '../../../utils/accessibility';
import { TIMINGS } from '../../../constants/timings';

export class ClockRenderer {
  private config: RenderConfig;
  private currentAngle: number = 0;
  private tipsCache = new Map<string, { wrapper: HTMLElement; tip: HTMLElement }>();
  private cachedDimensions: Map<HTMLElement, { width: number; height: number; radius: number }> = new Map();
  private snapTimeout: ReturnType<typeof setTimeout> | null = null;
  private sweep: (() => void) | null = null;

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

  setHandAngle(angle: number): void {
    this.cancelSweep();
    const targetAngle = AngleEngine.calculateShortestPath(this.currentAngle, angle);

    if (Math.abs(this.currentAngle - targetAngle) < 0.01) return;

    this.currentAngle = targetAngle;
    this.config.clockHand.style.transform = `rotateZ(${targetAngle}deg)`;
  }

  animateToAngle(angle: number): void {
    const targetAngle = AngleEngine.calculateShortestPath(this.currentAngle, angle);
    this.currentAngle = targetAngle;

    if (prefersReducedMotion()) {
      this.config.clockHand.style.transform = `rotateZ(${targetAngle}deg)`;
      return;
    }

    this.clearSnapTimeout();
    this.config.clockHand.classList.add('tp-ui-tips-animation');
    this.config.clockHand.style.transform = `rotateZ(${targetAngle}deg)`;

    this.snapTimeout = setTimeout(() => {
      this.snapTimeout = null;
      this.config.clockHand.classList.remove('tp-ui-tips-animation');
    }, TIMINGS.TIPS_ANIMATION);
  }

  private clearSnapTimeout(): void {
    if (this.snapTimeout === null) return;
    clearTimeout(this.snapTimeout);
    this.snapTimeout = null;
  }

  setActiveValue(value: string): void {
    const target = Number(value);

    [this.config.tipsWrapper, this.config.tipsWrapperFor24h].forEach((wrapper) => {
      wrapper?.querySelectorAll('.tp-ui-value-tips, .tp-ui-value-tips-24h').forEach((tip) => {
        setClass(tip, 'active', tip.textContent === value || Number(tip.textContent) === target);
      });
    });
  }

  followHand(valueAt: (angle: number) => string, finalValue: string): void {
    this.cancelSweep();
    const hand = this.config.clockHand;

    if (prefersReducedMotion() || !hand.classList.contains('tp-ui-tips-animation')) {
      this.setActiveValue(finalValue);
      return;
    }

    let frame = 0;
    const step = (): void => {
      const { a, b } = new DOMMatrix(getComputedStyle(hand).transform);
      this.setActiveValue(valueAt((Math.atan2(b, a) * 180) / Math.PI));
      frame = requestAnimationFrame(step);
    };
    const timeout = setTimeout(() => {
      this.cancelSweep();
      this.setActiveValue(finalValue);
    }, TIMINGS.TIPS_ANIMATION);

    this.sweep = () => {
      cancelAnimationFrame(frame);
      clearTimeout(timeout);
    };
    frame = requestAnimationFrame(step);
  }

  cancelSweep(): void {
    this.sweep?.();
    this.sweep = null;
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
    currentMinute: string = '00',
  ): void {
    if (isDocument() === false) {
      return;
    }

    const wrapper = targetWrapper || this.config.tipsWrapper;
    const context: FaceContext = {
      hour: currentHour,
      minute: currentMinute,
      amPm,
      disabledTime,
      clockType,
      showSeconds: this.config.showSeconds,
    };

    if (clearBefore) {
      wrapper.innerHTML = '';
      this.tipsCache.clear();
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
      this.updateTipState(span, spanTip, value, mode, context);

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
    spanTip.tabIndex = -1;

    const tipClass =
      clockType === '24h' && className.includes('24') ? 'tp-ui-value-tips-24h' : 'tp-ui-value-tips';

    spanTip.classList.add(tipClass);
    span.classList.add(className);

    span.appendChild(spanTip);
    return { wrapper: span, tip: spanTip };
  }

  private updateTipState(
    span: HTMLElement,
    spanTip: HTMLElement,
    value: string,
    mode: ClockMode,
    context: FaceContext,
  ): void {
    const isDisabled = this.checkIfDisabled(value, mode, context);

    setClass(span, 'tp-ui-tips-disabled', isDisabled);
    setClass(spanTip, 'tp-ui-tips-disabled', isDisabled);
  }

  private checkIfDisabled(value: string, mode: ClockMode, context: FaceContext): boolean {
    const { amPm, disabledTime, clockType, showSeconds } = context;
    if (!disabledTime) return false;

    if (mode === 'hours') {
      return HourEngine.isDisabled(value, amPm, disabledTime, clockType, showSeconds);
    }

    return MinuteEngine.isUnitDisabled(mode, value, context);
  }

  setCircle24hMode(is24h: boolean): void {
    setClass(this.config.circle, 'tp-ui-circle-hand-24h', is24h);
    setClass(this.config.clockHand, 'tp-ui-clock-hand-24h', is24h);
  }

  destroy(): void {
    this.cancelSweep();
    this.clearSnapTimeout();
    this.tipsCache.clear();
    this.cachedDimensions.clear();
  }
}
