import type { CoreState } from '../../../timepicker/CoreState';
import { selectorActive } from '../../../utils/variables';
import { MINUTES_STEP_5 } from '../../../utils/template';

export class ClockStyleHandler {
  private core: CoreState;

  constructor(core: CoreState) {
    this.core = core;
  }

  removeCircleClockClasses24h(): void {
    const circle = this.core.getCircle();
    const clockHand = this.core.getClockHand();
    circle?.classList.remove('tp-ui-circle-hand-24h');
    clockHand?.classList.remove('tp-ui-clock-hand-24h');
  }

  setCircleClockClasses24h(): void {
    const circle = this.core.getCircle();
    const clockHand = this.core.getClockHand();
    if (circle) {
      circle.classList.add('tp-ui-circle-hand-24h');
    }
    if (clockHand) {
      clockHand.classList.add('tp-ui-clock-hand-24h');
    }
  }

  setOnStartCSSClassesIfClockType24h(): void {
    if (this.core.options.clock.type === '24h') {
      const input = this.core.getInput();
      if (!input) return;

      let hour: string | undefined;

      if (input.value.length > 0) {
        hour = input.value.split(':')[0];
      }

      if (hour && (Number(hour) > 12 || Number(hour) === 0)) {
        this.setCircleClockClasses24h();
      }
    }
  }

  setBgColorToCircleWithMinutesTips(): void {
    const minutes = this.core.getMinutes();
    const circle = this.core.getCircle();
    if (!minutes || !circle) return;

    if (minutes.value && MINUTES_STEP_5.includes(minutes.value)) {
      const primaryColor = getComputedStyle(circle).getPropertyValue('--timepicker-primary').trim();
      if (primaryColor) {
        circle.style.backgroundColor = primaryColor;
      }
      circle.classList.remove('small-circle');
    }
  }

  removeBgColorToCirleWithMinutesTips(): void {
    const minutes = this.core.getMinutes();
    const circle = this.core.getCircle();
    if (!minutes || !circle) return;

    if (minutes.value && MINUTES_STEP_5.includes(minutes.value)) return;

    circle.style.backgroundColor = '';
    circle.classList.add('small-circle');
  }

  setClassActiveToHourOnOpen(): void {
    if (this.core.options.ui.mobile || this.core.isMobileView) return;
    const hour = this.core.getHour();
    hour?.classList.add(selectorActive);
  }

  toggleClassActiveToValueTips(hasClockSystem: boolean, value: string | number | null): void {
    if (hasClockSystem) return;

    const allValueTips = this.core.getAllValueTips();
    if (!allValueTips) return;

    const element = allValueTips.find((tip: HTMLElement) => Number(tip.innerText) === Number(value));

    allValueTips.forEach((el: HTMLElement) => {
      el.classList.remove(selectorActive);
      el.setAttribute('aria-selected', 'false');
    });

    if (element === undefined) return;

    element.classList.add(selectorActive);
    element.setAttribute('aria-selected', 'true');
  }
}

