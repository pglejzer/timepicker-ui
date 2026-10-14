import { EventEmitter, type TimepickerEventMap } from '@/utils/EventEmitter';
import { RangeState } from '@/managers/plugins/range/RangeState';
import { ClockEventHandler } from '@/managers/clock/handlers/ClockEventHandler';
import type { ClockSystem } from '@/managers/clock/ClockSystem';
import type { ClockType, DisabledTimeConfig } from '@/managers/clock/types';
import type { RangeValue } from '@/managers/plugins/range/types';

interface ToFaceScenario {
  readonly clockType: ClockType;
  readonly from: RangeValue;
  readonly intervals: string[];
}

const noop = (): void => {};

function buildToFaceDisabledTime({ clockType, from, intervals }: ToFaceScenario): DisabledTimeConfig {
  const emitter = new EventEmitter<TimepickerEventMap>();
  const range = new RangeState(clockType, undefined, undefined, emitter);
  range.setFromValue(from);
  range.setActivePart('to');

  const received: DisabledTimeConfig[] = [];
  const clockSystem = {
    updateDisabledTime: (disabledTime: DisabledTimeConfig | null): void => {
      if (disabledTime) received.push(disabledTime);
    },
  } as unknown as ClockSystem;
  const baseDisabled: DisabledTimeConfig = { isInterval: true, intervals, clockType };

  new ClockEventHandler(emitter, () => clockSystem, noop, noop, noop, () => baseDisabled).setup();
  emitter.emit('range:switch', { active: 'to', disabledTime: range.getDisabledTimeForEndPart() });

  const [disabledTime] = received;
  if (!disabledTime) {
    throw new Error('range:switch did not hand a "to"-face disabled time to the clock');
  }
  return disabledTime;
}

export { buildToFaceDisabledTime };
export type { ToFaceScenario };
