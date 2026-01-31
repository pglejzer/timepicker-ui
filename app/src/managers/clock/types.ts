export type ClockType = '12h' | '24h';
export type ClockMode = 'hours' | 'minutes';
export type AmPmType = 'AM' | 'PM' | '';

export interface Point {
  x: number;
  y: number;
}

export interface DisabledTimeConfig {
  hours?: string[];
  minutes?: string[];
  isInterval?: boolean;
  intervals?: string[];
  clockType?: ClockType;
  rangeFromType?: string | null;
  rangeFromHour?: number;
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
  isInnerCircle?: boolean;
  currentHour?: string;
  smoothHourSnap?: boolean;
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
  amPm: AmPmType;
  hourAngle: number;
  minuteAngle: number;
  mode: ClockMode;
}

export interface RenderConfig {
  clockFace: HTMLElement;
  tipsWrapper: HTMLElement;
  tipsWrapperFor24h?: HTMLElement;
  clockHand: HTMLElement;
  circle: HTMLElement;
  theme?: string;
}
