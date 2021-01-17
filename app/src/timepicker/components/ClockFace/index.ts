import { getRadians } from '../../utils';

class ClockFace {
  private array: any;
  private classToAdd: string;
  private clockFace: HTMLElement;
  private tipsWrapper: HTMLElement;
  private theme: string | undefined;
  constructor(obj: {
    array: Array<string>;
    classToAdd: string;
    clockFace: HTMLElement;
    tipsWrapper: HTMLElement;
    theme?: string;
  }) {
    this.array = obj.array;
    this.classToAdd = obj.classToAdd;
    this.clockFace = obj.clockFace;
    this.tipsWrapper = obj.tipsWrapper;
    this.theme = obj.theme;
  }

  create = (): void => {
    const clockWidth = (this.clockFace.offsetWidth - 32) / 2;
    const clockHeight = (this.clockFace.offsetHeight - 32) / 2;
    const radius = clockWidth - 9;

    this.tipsWrapper.innerHTML = '';

    this.array.forEach((num: string, index: number) => {
      const angle = getRadians(index * (360 / this.array.length));
      const span = document.createElement('span');
      const spanTips = document.createElement('span');

      spanTips.innerHTML = num;
      spanTips.classList.add('timepicker-ui-value-tips');
      span.classList.add(this.classToAdd);

      if (this.theme === 'crane-straight') {
        span.classList.add('crane-straight');
        spanTips.classList.add('crane-straight');
      }

      span.style.left = `${clockWidth + Math.sin(angle) * radius - span.offsetWidth}px`;
      span.style.bottom = `${clockHeight + Math.cos(angle) * radius - span.offsetHeight}px`;

      span.appendChild(spanTips);
      this.tipsWrapper.appendChild(span);
    });
  };
}

export default ClockFace;
