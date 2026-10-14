import { clampHourValue, clampMinuteValue, clampSecondValue } from '../../utils/input/clamp';
import { runCleanups } from '../../utils/managerHelpers';
import { setSpinbuttonValue } from '../../utils/accessibility';
import { pad } from '../../utils/time/parse';
import { findNearestEnabled } from '../../utils/time/rules';
import type { CoreState } from '../../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../../utils/EventEmitter';
import {
  activateField,
  buildUpdatePayload,
  disabledCheckFor,
  emitSelect,
  fieldBounds,
  getTimeInput,
  type TimeField,
} from './timeFields';

const CLAMPS: Readonly<Record<TimeField, (value: string, is12h: boolean) => string>> = {
  hour: clampHourValue,
  minutes: clampMinuteValue,
  seconds: clampSecondValue,
};

export class InputHandlers {
  private core: CoreState;
  private emitter: EventEmitter<TimepickerEventMap>;
  private cleanupHandlers: Array<() => void> = [];

  constructor(core: CoreState, emitter: EventEmitter<TimepickerEventMap>) {
    this.core = core;
    this.emitter = emitter;
  }

  handleHourEvents(): void {
    this.bindTimeField('hour');
  }

  handleMinutesEvents(): void {
    this.bindTimeField('minutes');
  }

  handleSecondsEvents(): void {
    this.bindTimeField('seconds');
  }

  private bindTimeField(field: TimeField): void {
    const input = getTimeInput(this.core, field);
    if (!input) return;

    const clickHandler = (): void => {
      if (this.core.isDestroyed) return;
      activateField(this.core, field);
      emitSelect(this.emitter, field, input.value);
      this.emitter.emit('update', buildUpdatePayload(this.core));
    };

    input.addEventListener('click', clickHandler);
    this.cleanupHandlers.push(() => input.removeEventListener('click', clickHandler));

    let previousValue = input.value;
    const blurHandler = (): void => {
      if (this.core.isDestroyed) return;
      if (input.hasAttribute('readonly')) return;

      const clamped = CLAMPS[field](input.value, this.core.options.clock.type === '12h');
      setSpinbuttonValue(input, clamped && this.nearestEnabled(field, Number(clamped)));

      if (input.value === previousValue) return;

      previousValue = input.value;
      this.emitter.emit('animation:clock', {});
      emitSelect(this.emitter, field, input.value);
      this.emitter.emit('update', buildUpdatePayload(this.core));
    };

    input.addEventListener('blur', blurHandler);
    this.cleanupHandlers.push(() => input.removeEventListener('blur', blurHandler));
  }

  private nearestEnabled(field: TimeField, value: number): string {
    const [min, max] = fieldBounds(this.core, field);
    return pad(findNearestEnabled(value, min, max, disabledCheckFor(this.core, field)));
  }

  detach(): void {
    runCleanups(this.cleanupHandlers);
  }

  destroy(): void {
    this.detach();
  }
}
