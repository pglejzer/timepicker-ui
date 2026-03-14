export interface WheelColumnConfig {
  readonly type: 'hours' | 'minutes' | 'ampm';
  readonly values: readonly string[];
}

export interface WheelSelectionState {
  readonly hour: string;
  readonly minute: string;
  readonly ampm: string | null;
}

export interface WheelScrollEndCallback {
  (columnType: 'hours' | 'minutes' | 'ampm', value: string): void;
}

export type WheelColumnType = 'hours' | 'minutes' | 'ampm';
