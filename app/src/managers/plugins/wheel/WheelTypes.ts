export interface WheelSelectionState {
  readonly hour: string;
  readonly minute: string;
  readonly second: string | null;
  readonly ampm: string | null;
}

export interface WheelScrollEndCallback {
  (columnType: WheelColumnType, value: string): void;
}

export type WheelColumnType = 'hours' | 'minutes' | 'seconds' | 'ampm';

export type WheelTimeColumn = Exclude<WheelColumnType, 'ampm'>;
