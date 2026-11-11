import { resolveDisabledTime } from '../../utils/time/disable';
import type { CoreState } from '../../timepicker/CoreState';

export class DisabledTimeHandler {
  private core: CoreState;

  constructor(core: CoreState) {
    this.core = core;
  }

  getDisableTime(): void {
    const disabledTime = resolveDisabledTime(this.core.options.clock);
    this.core.setTimePredicate(disabledTime?.value.predicate ?? null);
    this.core.setDisabledTime(disabledTime);
  }

  clearPredicateCache(): void {
    this.core.timePredicate?.clear();
  }

  destroy(): void {}
}
