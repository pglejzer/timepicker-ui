import type { CoreState } from './CoreState';
import type { Managers } from './Managers';
import type { ErrorEventData } from '../types/types';
import {
  parseTime,
  formatTime,
  convertTime,
  hasSeconds,
  DEGREES_PER_HOUR,
  DEGREES_PER_SIXTY,
  type ClockType,
  type TimeValue,
} from '../utils/time/parse';
import { isWheelMode, getClockType, getTimeFormat } from '../utils/options/predicates';
import { setActivePeriod, setSpinbuttonValue } from '../utils/accessibility';

export type ParsedTime = TimeValue & { type: string };

export interface ResolvedTime {
  parsed: ParsedTime;
  inputText: string;
}

const INVALID_FORMAT: Record<ClockType, string> = {
  '12h': 'Invalid 12h format. Expected HH:MM AM/PM',
  '24h': 'Invalid 24h format. Expected HH:MM',
};

const OTHER_CLOCK_TYPE: Record<ClockType, ClockType> = { '12h': '24h', '24h': '12h' };

const withPeriod = (value: TimeValue): ParsedTime => ({ ...value, type: value.type ?? 'AM' });

export function resolveTimeFor(core: CoreState, trimmedTime: string): ResolvedTime | null {
  const format = getTimeFormat(core.options);
  const own = parseTime(trimmedTime, format);
  if (own) {
    const inputText = format.showSeconds || hasSeconds(trimmedTime) ? formatTime(own, format) : trimmedTime;
    return { parsed: withPeriod(own), inputText };
  }

  const otherClockType = OTHER_CLOCK_TYPE[format.clockType];
  const other = parseTime(trimmedTime, { ...format, clockType: otherClockType });
  if (!other) return null;

  const converted = convertTime(other, otherClockType, format);
  return { parsed: withPeriod(converted), inputText: formatTime(converted, format) };
}

export function invalidTimeError(core: CoreState): ErrorEventData {
  return { error: INVALID_FORMAT[getClockType(core.options)] };
}

const writeField = (input: HTMLInputElement | null, value: string | undefined): boolean => {
  if (!input || value === undefined) return false;
  setSpinbuttonValue(input, value);
  return true;
};

export function applyParsedTime(core: CoreState, parsed: ParsedTime): void {
  if (writeField(core.getHour(), parsed.hour)) {
    core.setDegreesHours(Number(parsed.hour) * DEGREES_PER_HOUR);
  }

  if (writeField(core.getMinutes(), parsed.minutes)) {
    core.setDegreesMinutes(Number(parsed.minutes) * DEGREES_PER_SIXTY);
  }

  if (writeField(core.getSeconds(), parsed.seconds)) {
    core.setDegreesSeconds(Number(parsed.seconds) * DEGREES_PER_SIXTY);
  }
}

export function seedDegrees(core: CoreState, value: Pick<TimeValue, 'hour' | 'minutes' | 'seconds'>): void {
  core.setDegreesHours(Number(value.hour) * DEGREES_PER_HOUR);
  core.setDegreesMinutes(Number(value.minutes) * DEGREES_PER_SIXTY);
  if (value.seconds !== undefined) {
    core.setDegreesSeconds(Number(value.seconds) * DEGREES_PER_SIXTY);
  }
}

export function syncPeriodIndicator(core: CoreState, typeValue: string): void {
  if (core.options.clock.type === '24h') return;
  setActivePeriod(core.getAM(), core.getPM(), typeValue === 'AM' ? 'AM' : 'PM');
}

export function syncClockVisual(core: CoreState, managers: Managers, parsed: ParsedTime): void {
  if (isWheelMode(core.options)) {
    const wheel = managers.getPlugin('wheel');
    wheel?.scrollToValue?.(parsed.hour, parsed.minutes, parsed.type, parsed.seconds);
    return;
  }

  const type = getClockType(core.options) === '24h' ? undefined : parsed.type;
  if (managers.clock.syncClockValue(parsed.hour, parsed.minutes, type, parsed.seconds)) return;

  const clockHand = core.getClockHand();
  if (clockHand) {
    clockHand.style.transform = `rotateZ(${core.degreesHours || 0}deg)`;
  }
}
