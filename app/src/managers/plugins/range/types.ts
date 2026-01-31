export type RangePart = 'from' | 'to';

export interface RangeValue {
  hour: string;
  minutes: string;
  type?: string | null;
}

export interface RangeValidationResult {
  valid: boolean;
  duration: number;
}

export interface FormattedRange {
  from: string;
  to: string;
}

export interface DisabledTimeConfig {
  hours: string[];
  minutes: string[];
  fromType?: string | null;
  fromHour?: number;
}

