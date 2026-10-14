import {
  parseTime,
  timeToSeconds,
  hourToSeconds,
  hasSeconds,
  SECONDS_PER_MINUTE,
  MINUTES_PER_HOUR,
  type ClockType,
  type TimeValue,
} from './parse';

export interface DisabledRules {
  hours?: ReadonlyArray<string | number>;
  minutes?: ReadonlyArray<string | number>;
  seconds?: ReadonlyArray<string | number>;
  intervals?: ReadonlyArray<string>;
  clockType: ClockType;
}

export interface IntervalRange {
  start: number;
  end: number;
  source: string;
}

const RANGE_CACHE_LIMIT = 256;
const rangeCache = new Map<string, IntervalRange | null>();

const remember = (key: string, range: IntervalRange | null): IntervalRange | null => {
  if (rangeCache.size >= RANGE_CACHE_LIMIT) rangeCache.clear();
  rangeCache.set(key, range);
  return range;
};

export function parseInterval(text: string, clockType: ClockType): IntervalRange | null {
  const key = `${clockType}|${text}`;
  const cached = rangeCache.get(key);
  if (cached !== undefined) return cached;

  const edges = text.split('-').map((edge) => edge.trim());
  let range: IntervalRange | null = null;

  if (edges.length === 2) {
    const start = parseTime(edges[0], { clockType, showSeconds: true });
    const end = parseTime(edges[1], { clockType, showSeconds: true });
    if (start && end) {
      const endPadding = hasSeconds(edges[1]) ? 0 : SECONDS_PER_MINUTE - 1;
      range = {
        start: timeToSeconds(start, clockType),
        end: timeToSeconds(end, clockType) + endPadding,
        source: text,
      };
    }
  }

  return remember(key, range);
}

interface RangesEntry {
  clockType: ClockType;
  sources: ReadonlyArray<string>;
  ranges: ReadonlyArray<IntervalRange>;
}

const NO_RANGES: ReadonlyArray<IntervalRange> = [];
const rangesCache = new WeakMap<ReadonlyArray<string>, RangesEntry>();

const isFresh = (entry: RangesEntry, intervals: ReadonlyArray<string>, clockType: ClockType): boolean => {
  if (entry.clockType !== clockType || entry.sources.length !== intervals.length) return false;
  for (let index = 0; index < intervals.length; index++) {
    if (entry.sources[index] !== intervals[index]) return false;
  }
  return true;
};

const toRanges = (
  intervals: ReadonlyArray<string> | undefined,
  clockType: ClockType,
): ReadonlyArray<IntervalRange> => {
  if (!intervals?.length) return NO_RANGES;

  const cached = rangesCache.get(intervals);
  if (cached && isFresh(cached, intervals, clockType)) return cached.ranges;

  const ranges = intervals
    .map((text) => parseInterval(text, clockType))
    .filter((range): range is IntervalRange => range !== null);
  rangesCache.set(intervals, { clockType, sources: [...intervals], ranges });
  return ranges;
};

const inRanges = (ranges: ReadonlyArray<IntervalRange>, second: number): boolean => {
  for (let index = 0; index < ranges.length; index++) {
    if (second >= ranges[index].start && second <= ranges[index].end) return true;
  }
  return false;
};

export function findOverlappingIntervals(
  intervals: ReadonlyArray<string>,
  clockType: ClockType,
): [string, string] | null {
  const ranges = toRanges(intervals, clockType);

  for (let i = 0; i < ranges.length; i++) {
    for (let j = i + 1; j < ranges.length; j++) {
      if (ranges[i].start <= ranges[j].end && ranges[j].start <= ranges[i].end) {
        return [ranges[i].source, ranges[j].source];
      }
    }
  }

  return null;
}

const inList = (
  list: ReadonlyArray<string | number> | undefined,
  value: string | number | undefined,
): boolean => {
  if (!list || value === undefined) return false;
  const target = Number(value);
  for (let index = 0; index < list.length; index++) {
    if (Number(list[index]) === target) return true;
  }
  return false;
};

const isMinuteCovered = (
  rules: DisabledRules,
  ranges: ReadonlyArray<IntervalRange>,
  minuteStart: number,
  showSeconds: boolean,
): boolean => {
  if (!showSeconds) return inRanges(ranges, minuteStart);

  for (let second = 0; second < SECONDS_PER_MINUTE; second++) {
    if (!inList(rules.seconds, second) && !inRanges(ranges, minuteStart + second)) return false;
  }
  return true;
};

export function isSecondDisabled(rules: DisabledRules | null, time: TimeValue): boolean {
  if (!rules) return false;
  if (
    inList(rules.hours, time.hour) ||
    inList(rules.minutes, time.minutes) ||
    inList(rules.seconds, time.seconds)
  ) {
    return true;
  }
  if (!rules.intervals?.length) return false;
  return inRanges(toRanges(rules.intervals, rules.clockType), timeToSeconds(time, rules.clockType));
}

export function isMinuteDisabled(
  rules: DisabledRules | null,
  time: TimeValue,
  showSeconds: boolean,
): boolean {
  if (!rules) return false;
  if (inList(rules.hours, time.hour) || inList(rules.minutes, time.minutes)) return true;

  const second = timeToSeconds(time, rules.clockType);
  const minuteStart = second - (second % SECONDS_PER_MINUTE);
  return isMinuteCovered(rules, toRanges(rules.intervals, rules.clockType), minuteStart, showSeconds);
}

export function isHourDisabled(
  rules: DisabledRules | null,
  time: Pick<TimeValue, 'hour' | 'type'>,
  showSeconds: boolean,
): boolean {
  if (!rules) return false;
  if (inList(rules.hours, time.hour)) return true;
  if (!rules.intervals?.length) return false;

  const ranges = toRanges(rules.intervals, rules.clockType);
  const hourStart = hourToSeconds(time, rules.clockType);

  for (let minute = 0; minute < MINUTES_PER_HOUR; minute++) {
    const minuteStart = hourStart + minute * SECONDS_PER_MINUTE;
    if (!inList(rules.minutes, minute) && !isMinuteCovered(rules, ranges, minuteStart, showSeconds)) {
      return false;
    }
  }
  return true;
}

export function isUnitDisabled(
  rules: DisabledRules | null,
  unit: Exclude<keyof TimeValue, 'type'>,
  time: TimeValue,
  showSeconds: boolean,
): boolean {
  if (unit === 'hour') return isHourDisabled(rules, time, showSeconds);
  if (unit === 'minutes') return isMinuteDisabled(rules, time, showSeconds);
  return isSecondDisabled(rules, time);
}

export function findNearestEnabled(
  value: number,
  min: number,
  max: number,
  isDisabled: (candidate: number) => boolean,
): number {
  const span = max - min + 1;

  for (let offset = 0; offset <= span / 2; offset++) {
    for (const candidate of [value + offset, value - offset]) {
      const wrapped = min + ((((candidate - min) % span) + span) % span);
      if (!isDisabled(wrapped)) return wrapped;
    }
  }
  return value;
}

export const isHourOnIncrement = (hour: number, increment: number): boolean => (hour % 12) % increment === 0;
