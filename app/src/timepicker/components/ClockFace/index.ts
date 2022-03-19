import { getRadians } from '../../utils';

class ClockFace {
  private array: string[] | undefined;
  private classToAdd: string | undefined;
  private clockFace: HTMLElement | undefined;
  private tipsWrapper: HTMLElement | undefined;
  private theme: string | undefined;
  private clockType: string | undefined;
  private disabledTime: any;
  private hour: any;
  constructor(obj?: {
    array?: Array<string>;
    classToAdd?: string;
    clockFace?: HTMLElement;
    tipsWrapper?: HTMLElement;
    theme?: string;
    clockType?: string;
    disabledTime?: any;
    hour?: any;
  }) {
    this.array = obj?.array;
    this.classToAdd = obj?.classToAdd;
    this.clockFace = obj?.clockFace;
    this.tipsWrapper = obj?.tipsWrapper;
    this.theme = obj?.theme;
    this.clockType = obj?.clockType;
    this.disabledTime = obj?.disabledTime;
    this.hour = obj?.hour;
  }

  update = (): void => {
    const spanHours = this.tipsWrapper?.querySelectorAll('span.timepicker-ui-hour-time-12');
    const spanMinutes = this.tipsWrapper?.querySelectorAll('span.timepicker-ui-minutes-time');

    this._removeClasses(spanHours);
    this._removeClasses(spanMinutes);
  };

  create = (): void => {
    if (!this.clockFace || !this.array || !this.classToAdd || !this.tipsWrapper) return;

    const clockWidth = (this.clockFace.offsetWidth - 32) / 2;
    const clockHeight = (this.clockFace.offsetHeight - 32) / 2;
    const radius = clockWidth - 9;

    this.tipsWrapper.innerHTML = '';

    this.array?.forEach((num: string, index: number) => {
      // @ts-ignore
      const angle = getRadians(index * (360 / this.array.length));
      const span = document.createElement('span');
      const spanTips = document.createElement('span');

      spanTips.innerHTML = num;

      if (this.disabledTime) {
        if (Array.isArray(this.disabledTime) && this.disabledTime?.includes(num)) {
          spanTips.classList.add('timepicker-ui-tips-disabled');
          span.classList.add('timepicker-ui-tips-disabled');
        }

        if (
          this.hour === this.disabledTime.removedStartedHour &&
          this.disabledTime?.startMinutes?.includes(num)
        ) {
          spanTips.classList.add('timepicker-ui-tips-disabled');
          span.classList.add('timepicker-ui-tips-disabled');
        }

        if (
          this.hour === this.disabledTime.removedEndHour &&
          this.disabledTime?.endMinutes?.includes(num)
        ) {
          spanTips.classList.add('timepicker-ui-tips-disabled');
          span.classList.add('timepicker-ui-tips-disabled');
        }
      } else {
        // console.log(this.disabledTime);
      }

      if (this.clockType === '24h') {
        spanTips.classList.add('timepicker-ui-value-tips-24h');
      } else {
        spanTips.classList.add('timepicker-ui-value-tips');
      }

      // @ts-ignore
      span.classList.add(this.classToAdd);

      if (this.theme === 'crane-straight') {
        span.classList.add('crane-straight');
        spanTips.classList.add('crane-straight');
      }

      span.style.left = `${clockWidth + Math.sin(angle) * radius - span.offsetWidth}px`;
      span.style.bottom = `${clockHeight + Math.cos(angle) * radius - span.offsetHeight}px`;

      span.appendChild(spanTips);
      this.tipsWrapper?.appendChild(span);
    });
  };

  _removeClasses = (spanHours: NodeListOf<Element> | undefined) => {
    spanHours?.forEach(({ classList, children }) => {
      classList.remove('timepicker-ui-tips-disabled');
      children[0].classList.remove('timepicker-ui-tips-disabled');
    });
  };
}

export default ClockFace;
