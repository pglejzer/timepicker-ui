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

  public clean = () => {
    const spanHours = this.tipsWrapper?.querySelectorAll('span.timepicker-ui-hour-time-12');
    const spanMinutes = this.tipsWrapper?.querySelectorAll('span.timepicker-ui-minutes-time');

    this._removeClasses(spanHours);
    this._removeClasses(spanMinutes);
  };

  public create = (): void => {
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

        if (this.hour === this.disabledTime.removedEndHour && this.disabledTime?.endMinutes?.includes(num)) {
          spanTips.classList.add('timepicker-ui-tips-disabled');
          span.classList.add('timepicker-ui-tips-disabled');
        }
      }

      if (this.clockType === '24h') {
        spanTips.classList.add('timepicker-ui-value-tips-24h');
      } else {
        spanTips.classList.add('timepicker-ui-value-tips');
      }

      span.classList.add(this.classToAdd as string);

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

  public updateDisable = (obj?: any): void => {
    const spanHours = this.tipsWrapper?.querySelectorAll('span.timepicker-ui-hour-time-12');
    const spanMinutes = this.tipsWrapper?.querySelectorAll('span.timepicker-ui-minutes-time');

    this._removeClasses(spanHours);
    this._removeClasses(spanMinutes);

    if (obj?.hoursToUpdate && spanHours) {
      this._addClassesWithIncludes(spanHours, obj.hoursToUpdate);
    }

    if (obj?.minutesToUpdate && spanMinutes) {
      const { actualHour, removedEndHour, removedStartedHour, startMinutes, endMinutes } =
        obj.minutesToUpdate;

      if (removedEndHour === actualHour && endMinutes.length > 0) {
        this._addClassesWithIncludes(spanMinutes, endMinutes);
      } else if (
        Number(actualHour) > Number(removedStartedHour) &&
        Number(actualHour) < Number(removedEndHour)
      ) {
        this._addClasses(spanMinutes);
      }

      if (removedStartedHour === actualHour && startMinutes.length > 0) {
        this._addClassesWithIncludes(spanMinutes, startMinutes);
      } else if (
        Number(actualHour) > Number(removedStartedHour) &&
        Number(actualHour) < Number(removedEndHour)
      ) {
        this._addClasses(spanMinutes);
      }
    }

    if (obj) {
      const {
        amHours,
        pmHours,
        activeMode,
        startMinutes,
        endMinutes,
        removedAmHour,
        removedPmHour,
        actualHour,
      } = obj.minutesToUpdate;

      if (!amHours || !pmHours) return;

      if (spanHours) {
        if (amHours && activeMode === 'AM') {
          this._addClassesWithIncludes(spanHours, amHours);
        }

        if (pmHours && activeMode === 'PM') {
          this._addClassesWithIncludes(spanHours, pmHours);
        }
      }

      if (spanMinutes && startMinutes && endMinutes) {
        if (activeMode === 'AM') {
          if (startMinutes.length === 0 && endMinutes.length === 1 && endMinutes[0] === '00') {
            if (Number(actualHour) >= Number(amHours[0])) {
              this._addClasses(spanMinutes);
            }
          }

          if (startMinutes.length === 0 && endMinutes.length > 1) {
            if (Number(actualHour) >= Number(removedAmHour)) {
              this._addClasses(spanMinutes);
            }
          }

          if (startMinutes.length > 0 && endMinutes.length > 1 && endMinutes[0] === '00') {
            if (Number(removedAmHour) === Number(actualHour)) {
              this._addClassesWithIncludes(spanMinutes, startMinutes);
            } else if (Number(actualHour) > Number(removedAmHour)) {
              this._addClasses(spanMinutes);
            }
          }

          if (endMinutes[0] === '00' && endMinutes.length === 1 && startMinutes.length > 0) {
            if (Number(removedAmHour) === Number(actualHour)) {
              this._addClassesWithIncludes(spanMinutes, startMinutes);
            } else if (Number(actualHour) > Number(removedAmHour)) {
              this._addClasses(spanMinutes);
            }
          }
        }

        if (activeMode === 'PM') {
          if (actualHour < Number(removedPmHour)) {
            this._addClasses(spanMinutes);
          }

          if (actualHour === removedPmHour) {
            this._addClassesWithIncludes(spanMinutes, endMinutes);
          }

          if (endMinutes.length > 0 && Number(actualHour) === removedPmHour - 1) {
            this._addClassesWithIncludes(spanMinutes, endMinutes);
          }
        }
      }
    }
  };

  private _removeClasses = (list?: NodeListOf<Element>) => {
    list?.forEach(({ classList, children }) => {
      classList.remove('timepicker-ui-tips-disabled');
      children[0].classList.remove('timepicker-ui-tips-disabled');
    });
  };

  private _addClasses = (nodeList?: NodeListOf<Element>) => {
    nodeList?.forEach(({ classList, children }) => {
      classList.add('timepicker-ui-tips-disabled');
      children[0].classList.add('timepicker-ui-tips-disabled');
    });
  };

  private _addClassesWithIncludes = (nodeList?: NodeListOf<Element>, includesArr?: any) => {
    nodeList?.forEach(({ classList, children, textContent }) => {
      if (includesArr?.includes(textContent)) {
        classList.add('timepicker-ui-tips-disabled');
        children[0].classList.add('timepicker-ui-tips-disabled');
      }
    });
  };
}

export default ClockFace;
