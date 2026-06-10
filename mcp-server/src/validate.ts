export type ClockType = '12h' | '24h';

export interface ParseResult {
  valid: boolean;
  reason?: string;
  hour24?: number;
  minutes?: number;
  meridiem?: string | null;
  normalized?: string;
}

export function parseTime(input: string, clockType: ClockType): ParseResult {
  const raw = input.trim();
  const match = raw.match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?$/);
  if (!match) {
    return { valid: false, reason: 'Expected "HH:MM" or "h:MM AM/PM".' };
  }

  let hour = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3]?.toUpperCase();

  if (minutes > 59) {
    return { valid: false, reason: 'Minutes must be 0-59.' };
  }

  if (clockType === '12h') {
    if (!meridiem) return { valid: false, reason: '12h clock requires an AM/PM suffix.' };
    if (hour < 1 || hour > 12) return { valid: false, reason: '12h hours must be 1-12.' };
    if (meridiem === 'PM' && hour !== 12) hour += 12;
    if (meridiem === 'AM' && hour === 12) hour = 0;
  } else {
    if (meridiem) return { valid: false, reason: '24h clock must not include AM/PM.' };
    if (hour > 23) return { valid: false, reason: '24h hours must be 0-23.' };
  }

  return {
    valid: true,
    hour24: hour,
    minutes,
    meridiem: meridiem ?? null,
    normalized: `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`,
  };
}

export interface DisabledTimeSpec {
  hours?: (string | number)[];
  minutes?: (string | number)[];
  interval?: string | string[];
}

export interface DisabledTimeResult {
  valid: boolean;
  issues: string[];
}

function validateNumberList(label: string, list: (string | number)[] | undefined, max: number, issues: string[]) {
  if (list === undefined) return;
  if (!Array.isArray(list)) {
    issues.push(`${label} must be an array of numbers/numeric strings.`);
    return;
  }
  for (const item of list) {
    const n = Number(item);
    if (!Number.isInteger(n) || n < 0 || n > max) {
      issues.push(`${label} entry "${item}" must be an integer 0-${max}.`);
    }
  }
}

function validateInterval(interval: string, clockType: ClockType, issues: string[]) {
  const parts = interval.split('-').map((p) => p.trim());
  if (parts.length !== 2) {
    issues.push(`interval "${interval}" must be "START - END" (e.g. "10:00 AM - 12:00 PM").`);
    return;
  }
  for (const part of parts) {
    const result = parseTime(part, clockType);
    if (!result.valid) {
      issues.push(`interval bound "${part}" is invalid: ${result.reason}`);
    }
  }
}

export function validateDisabledTime(spec: DisabledTimeSpec, clockType: ClockType): DisabledTimeResult {
  const issues: string[] = [];

  validateNumberList('hours', spec.hours, clockType === '12h' ? 12 : 23, issues);
  validateNumberList('minutes', spec.minutes, 59, issues);

  if (spec.interval !== undefined) {
    const intervals = Array.isArray(spec.interval) ? spec.interval : [spec.interval];
    for (const interval of intervals) {
      if (typeof interval !== 'string') {
        issues.push('interval must be a string or an array of strings.');
        continue;
      }
      validateInterval(interval, clockType, issues);
    }
  }

  return { valid: issues.length === 0, issues };
}
