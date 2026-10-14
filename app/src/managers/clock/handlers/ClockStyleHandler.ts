import type { CoreState } from '../../../timepicker/CoreState';
import { selectorActive } from '../../../utils/variables';

export class ClockStyleHandler {
  private core: CoreState;

  constructor(core: CoreState) {
    this.core = core;
  }

  setOnStartCSSClassesIfClockType24h(): void {
    if (this.core.options.clock.type !== '24h') return;

    const hour = this.core.getInput()?.value.split(':')[0];
    if (!hour) return;

    const hourValue = Number(hour);
    if (hourValue > 12 || hourValue === 0) {
      this.core.getCircle()?.classList.add('tp-ui-circle-hand-24h');
      this.core.getClockHand()?.classList.add('tp-ui-clock-hand-24h');
    }
  }

  setClassActiveToHourOnOpen(): void {
    if (this.core.options.ui.mobile || this.core.isMobileView) return;
    const hour = this.core.getHour();
    hour?.classList.add(selectorActive);
  }
}

