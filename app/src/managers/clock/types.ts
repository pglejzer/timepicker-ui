export type ClockType = '12h' | '24h';
export type ClockMode = 'hours' | 'minutes' | 'seconds';
export type SixtyMode = Exclude<ClockMode, 'hours'>;
export type AmPmType = 'AM' | 'PM' | '';

export interface Point {
  x: number;
  y: number;
}

export interface DisabledTimeConfig {
  hours?: string[];
  minutes?: string[];
  seconds?: string[];
  isInterval?: boolean;
  intervals?: string[];
  clockType?: ClockType;
  predicate?: (secondOfDay: number) => boolean;
  rangeFromType?: string | null;
  rangeFromHour?: number;
  rangeFromMinute?: number;
  rangeFromSecond?: number;
}

export interface FaceContext {
  hour: string;
  minute: string;
  amPm: AmPmType;
  disabledTime: DisabledTimeConfig | null;
  clockType: ClockType;
  showSeconds?: boolean;
}

export interface EngineInput {
  pointerPosition: Point;
  clockCenter: Point;
  clockRadius: number;
  mode: ClockMode;
  clockType: ClockType;
  amPm: AmPmType;
  disabledTime: DisabledTimeConfig | null;
  incrementHours: number;
  incrementMinutes: number;
  incrementSeconds?: number;
  isInnerCircle?: boolean;
  currentHour?: string;
  currentMinute?: string;
  smoothHourSnap?: boolean;
  showSeconds?: boolean;
}

export interface EngineOutput {
  angle: number;
  value: string;
  index: number;
  isValid: boolean;
  isInnerCircle?: boolean;
}

export interface ClockState {
  hour: string;
  minute: string;
  second: string;
  amPm: AmPmType;
  hourAngle: number;
  minuteAngle: number;
  secondAngle: number;
  mode: ClockMode;
}

export interface RenderConfig {
  clockFace: HTMLElement;
  tipsWrapper: HTMLElement;
  tipsWrapperFor24h?: HTMLElement;
  clockHand: HTMLElement;
  circle: HTMLElement;
  theme?: string;
  showSeconds?: boolean;
}
