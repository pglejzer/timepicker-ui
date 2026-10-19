import { createDisabledTime } from '../../utils/time/disable';
import { createTimePredicate, type TimePredicate } from '../../utils/time/predicate';
import type { CoreState } from '../../timepicker/CoreState';

export class DisabledTimeHandler {
  private core: CoreState;

  constructor(core: CoreState) {
    this.core = core;
  }

  getDisableTime(): void {
    const disabledTimeResult = createDisabledTime(this.core.options) || null;
    const predicate = this.buildPredicate();

    this.core.setTimePredicate(predicate);

    if (!predicate) {
      this.core.setDisabledTime(disabledTimeResult);
      return;
    }

    this.core.setDisabledTime({ value: { ...disabledTimeResult?.value, predicate } });
  }

  clearPredicateCache(): void {
    this.core.timePredicate?.clear();
  }

  private buildPredicate(): TimePredicate | null {
    const { isTimeDisabled } = this.core.options.clock;
    return typeof isTimeDisabled === 'function' ? createTimePredicate(isTimeDisabled) : null;
  }

  destroy(): void {}
}
