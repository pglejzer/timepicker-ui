import { createDisabledTime } from '../../utils/time/disable';
import type { CoreState } from '../../timepicker/CoreState';

export class DisabledTimeHandler {
  private core: CoreState;

  constructor(core: CoreState) {
    this.core = core;
  }

  getDisableTime(): void {
    const disabledTimeResult = createDisabledTime(this.core.options);
    this.core.setDisabledTime(disabledTimeResult || null);
  }

  destroy(): void {}
}

