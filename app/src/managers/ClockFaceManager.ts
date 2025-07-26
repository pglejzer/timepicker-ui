import { getRadians } from '../utils/config';
import { checkedDisabledValuesInterval } from '../utils/time/disable';

export default class ClockFaceManager {
  private array?: string[];
  private classToAdd?: string;
  private clockFace?: HTMLElement;
  private tipsWrapper?: HTMLElement;
  private theme?: string;
  private clockType?: string;
  private disabledTime?: { isInterval?: boolean; intervals?: any[]; clockType?: string } | string[];
  private hour?: string;
  private activeTypeMode?: string;
  private _tipsCache = new Map<string, { wrapper: HTMLElement; tip: HTMLElement }>();

  constructor(obj?: {
    array?: string[];
    classToAdd?: string;
    clockFace?: HTMLElement;
    tipsWrapper?: HTMLElement;
    theme?: string;
    clockType?: string;
    disabledTime?: any;
    hour?: any;
    activeTypeMode?: string;
  }) {
    Object.assign(this, obj);
  }

  /** @internal */
  clean = () => {
    const spanHours = this.tipsWrapper?.querySelectorAll('span.timepicker-ui-hour-time-12');
    const spanMinutes = this.tipsWrapper?.querySelectorAll('span.timepicker-ui-minutes-time');
    this._removeClasses(spanHours);
    this._removeClasses(spanMinutes);
  };

  /** @internal */
  create = (): void => {
    if (!this.clockFace || !this.array || !this.classToAdd || !this.tipsWrapper) return;

    const clockWidth = (this.clockFace.offsetWidth - 32) / 2;
    const clockHeight = (this.clockFace.offsetHeight - 32) / 2;
    const radius = clockWidth - 9;

    const existingTips = new Set(this._tipsCache.keys());
    const fragment = document.createDocumentFragment();

    this.array.forEach((num, index, arr) => {
      const cacheKey = `${this.classToAdd}-${num}-${this.theme || 'default'}`;
      existingTips.delete(cacheKey);

      let cached = this._tipsCache.get(cacheKey);
      if (!cached) {
        cached = this._createTip(num);
        this._tipsCache.set(cacheKey, cached);
      }

      const { wrapper: span, tip: spanTips } = cached;
      this._updateTipState(span, spanTips, num);

      const angle = getRadians(index * (360 / arr.length));
      span.style.left = `${clockWidth + Math.sin(angle) * radius}px`;
      span.style.bottom = `${clockHeight + Math.cos(angle) * radius}px`;

      fragment.appendChild(span);
    });

    existingTips.forEach((key) => this._tipsCache.delete(key));
    this.tipsWrapper.innerHTML = '';
    this.tipsWrapper.appendChild(fragment);
  };

  private _createTip(num: string): { wrapper: HTMLElement; tip: HTMLElement } {
    const span = document.createElement('span');
    const spanTips = document.createElement('span');

    spanTips.innerHTML = num;
    spanTips.setAttribute('role', 'option');
    spanTips.setAttribute('aria-selected', 'false');
    spanTips.tabIndex = 0;

    const tipsClass = this.clockType === '24h' ? 'timepicker-ui-value-tips-24h' : 'timepicker-ui-value-tips';
    spanTips.classList.add(tipsClass);

    span.classList.add(this.classToAdd || '');
    if (this.theme) {
      span.classList.add(this.theme);
      spanTips.classList.add(this.theme);
    }

    span.appendChild(spanTips);
    return { wrapper: span, tip: spanTips };
  }

  private _updateTipState(span: HTMLElement, spanTips: HTMLElement, num: string): void {
    span.classList.remove('timepicker-ui-tips-disabled');
    spanTips.classList.remove('timepicker-ui-tips-disabled');
    spanTips.removeAttribute('aria-disabled');
    spanTips.tabIndex = 0;

    if (this.disabledTime) {
      if (Array.isArray(this.disabledTime) && this.disabledTime.includes(num)) {
        spanTips.classList.add('timepicker-ui-tips-disabled');
        span.classList.add('timepicker-ui-tips-disabled');
        spanTips.setAttribute('aria-disabled', 'true');
      }

      if ((this.disabledTime as any).isInterval && (this.disabledTime as any).clockType) {
        const isMinuteTip = this.classToAdd?.includes('minutes');
        const isHourTip = this.classToAdd?.includes('hour');

        if (isMinuteTip && this.hour) {
          const isDisabled = !checkedDisabledValuesInterval(
            this.hour,
            num,
            this.activeTypeMode || '',
            (this.disabledTime as { intervals: string[] }).intervals || [],
            (this.disabledTime as { clockType: '12h' | '24h' }).clockType,
          );
          if (isDisabled) {
            spanTips.classList.add('timepicker-ui-tips-disabled');
            span.classList.add('timepicker-ui-tips-disabled');
            spanTips.tabIndex = -1;
            spanTips.setAttribute('aria-disabled', 'true');
          }
        } else if (isHourTip) {
          let allMinutesDisabled = true;
          for (let m = 0; m < 60; m++) {
            const minuteStr = m.toString().padStart(2, '0');
            const isEnabled = checkedDisabledValuesInterval(
              num,
              minuteStr,
              this.activeTypeMode || '',
              (this.disabledTime as any).intervals || [],
              (this.disabledTime as any).clockType,
            );
            if (isEnabled) {
              allMinutesDisabled = false;
              break;
            }
          }

          if (allMinutesDisabled) {
            spanTips.classList.add('timepicker-ui-tips-disabled');
            span.classList.add('timepicker-ui-tips-disabled');
            spanTips.tabIndex = -1;
            spanTips.setAttribute('aria-disabled', 'true');
          }
        }
      }
    }
  }

  /** @internal */
  updateDisable = (hour?: string, activeTypeMode?: string): void => {
    const spanHours = this.tipsWrapper?.querySelectorAll('span.timepicker-ui-hour-time-12');
    const spanMinutes = this.tipsWrapper?.querySelectorAll('span.timepicker-ui-minutes-time');

    this._removeClasses(spanHours);
    this._removeClasses(spanMinutes);

    if (!(this.disabledTime as any)?.isInterval || !(this.disabledTime as any)?.intervals) return;

    const intervals = (this.disabledTime as any).intervals;
    const clockType = (this.disabledTime as any).clockType;
    const currentActiveTypeMode = activeTypeMode || this.activeTypeMode || '';

    spanHours?.forEach((span) => {
      const spanTips = span.querySelector('.timepicker-ui-value-tips');
      if (!spanTips) return;
      const hourValue = spanTips.innerHTML;

      let allMinutesDisabled = true;
      for (let m = 0; m < 60; m++) {
        const minuteStr = m.toString().padStart(2, '0');
        const isEnabled = checkedDisabledValuesInterval(
          hourValue,
          minuteStr,
          currentActiveTypeMode,
          intervals,
          clockType,
        );
        if (isEnabled) {
          allMinutesDisabled = false;
          break;
        }
      }

      if (allMinutesDisabled) {
        span.classList.add('timepicker-ui-tips-disabled');
        spanTips.classList.add('timepicker-ui-tips-disabled');
        spanTips.setAttribute('aria-disabled', 'true');
        (spanTips as HTMLElement).tabIndex = -1;
      }
    });

    if (spanMinutes && hour) {
      spanMinutes.forEach((span) => {
        const spanTips = span.querySelector('.timepicker-ui-value-tips');
        if (!spanTips) return;
        const minuteValue = spanTips.innerHTML;

        const isDisabled = !checkedDisabledValuesInterval(
          hour,
          minuteValue,
          currentActiveTypeMode,
          intervals,
          clockType,
        );

        if (isDisabled) {
          span.classList.add('timepicker-ui-tips-disabled');
          spanTips.classList.add('timepicker-ui-tips-disabled');
          spanTips.setAttribute('aria-disabled', 'true');
          (spanTips as HTMLElement).tabIndex = -1;
        }
      });
    }
  };

  /** @internal */
  private _removeClasses = (list?: NodeListOf<Element>) => {
    list?.forEach((el) => {
      const first = el.children[0] as HTMLElement | undefined;
      el.classList.remove('timepicker-ui-tips-disabled');
      if (first) {
        first.classList.remove('timepicker-ui-tips-disabled');
        first.removeAttribute('aria-disabled');
        first.tabIndex = 0;
      }
    });
  };

  /** Cleanup */
  destroy() {
    if (this.tipsWrapper) this.tipsWrapper.innerHTML = '';
    this._tipsCache.clear();
    this.array = this.classToAdd = this.theme = this.clockType = undefined;
    this.disabledTime = this.hour = this.activeTypeMode = undefined;
    this.clockFace = this.tipsWrapper = undefined;
  }
}
