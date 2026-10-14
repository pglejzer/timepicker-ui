import type { CoreState } from '../../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../../utils/EventEmitter';
import type { UpdateEventData } from '../../types/types';
import { announceToScreenReader, setClass, syncClockSlider } from '../../utils/accessibility';
import { getClockType } from '../../utils/options/predicates';
import { pad, type TimeValue } from '../../utils/time/parse';
import { isUnitDisabled } from '../../utils/time/rules';

export type TimeField = 'hour' | 'minutes' | 'seconds';

interface TimeFieldConfig {
  input: 'getHour' | 'getMinutes' | 'getSeconds';
  event: 'select:hour' | 'select:minute' | 'select:second';
  announce: 'announceHour' | 'announceMinute' | 'second';
}

export const TIME_FIELDS: Readonly<Record<TimeField, TimeFieldConfig>> = {
  hour: { input: 'getHour', event: 'select:hour', announce: 'announceHour' },
  minutes: { input: 'getMinutes', event: 'select:minute', announce: 'announceMinute' },
  seconds: { input: 'getSeconds', event: 'select:second', announce: 'second' },
};

export const TIME_FIELD_NAMES: ReadonlyArray<TimeField> = ['hour', 'minutes', 'seconds'];

export const getTimeInput = (core: CoreState, field: TimeField): HTMLInputElement | null =>
  core[TIME_FIELDS[field].input]();

export const emitSelect = (
  emitter: EventEmitter<TimepickerEventMap>,
  field: TimeField,
  value: string,
): void => {
  emitter.emit(TIME_FIELDS[field].event, { [field]: value } as Record<TimeField, string>);
};

export const getActiveField = (core: CoreState): TimeField =>
  TIME_FIELD_NAMES.find((field) => getTimeInput(core, field)?.classList.contains('active')) ?? 'hour';

export const activateField = (core: CoreState, field: TimeField): void => {
  TIME_FIELD_NAMES.forEach((name) => setClass(getTimeInput(core, name), 'active', name === field));
  syncClockSlider(core.getModalElement());
};

export const announceField = (core: CoreState, field: TimeField): void => {
  const input = getTimeInput(core, field);
  if (!input) return;
  const label = core.options.labels[TIME_FIELDS[field].announce];
  announceToScreenReader(core.getModalElement(), `${label}: ${input.value}`);
};

export function buildUpdatePayload(core: CoreState): UpdateEventData {
  const payload: UpdateEventData = {
    hour: core.getHour()?.value,
    minutes: core.getMinutes()?.value,
    type: core.getActiveType(),
  };

  if (core.options.clock.showSeconds) {
    payload.seconds = core.getSeconds()?.value ?? '00';
  }

  return payload;
}

export const fieldBounds = (core: CoreState, field: TimeField): readonly [number, number] => {
  if (field !== 'hour') return [0, 59];
  return core.options.clock.type === '12h' ? [1, 12] : [0, 23];
};

const isFieldDisabled = (core: CoreState, field: TimeField, time: UpdateEventData): boolean => {
  const source = core.disabledTime?.value;
  const rules = source ? { ...source, clockType: getClockType(core.options) } : null;
  return isUnitDisabled(rules, field, time as TimeValue, !!core.options.clock.showSeconds);
};

export const disabledCheckFor = (core: CoreState, field: TimeField): ((value: number) => boolean) => {
  const time = buildUpdatePayload(core);
  return (value) => isFieldDisabled(core, field, { ...time, [field]: pad(value) });
};

export const isTimeDisabled = (core: CoreState): boolean => {
  const time = buildUpdatePayload(core);
  const field = core.options.clock.showSeconds ? 'seconds' : 'minutes';
  return !!time.hour && !!time.minutes && isFieldDisabled(core, field, time);
};
