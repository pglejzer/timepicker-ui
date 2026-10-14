export type RangePart = 'from' | 'to';

export interface RangeValue {
  hour: string;
  minutes: string;
  seconds?: string;
  type?: string;
}

export interface RangeValidationResult {
  valid: boolean;
  duration: number;
  durationSeconds?: number;
}

export interface FormattedRange {
  from: string;
  to: string;
}

export interface DisabledTimeConfig {
  hours: string[];
  minutes: string[];
  seconds?: string[];
  fromType?: string;
  fromHour?: number;
  fromMinute?: number;
}
