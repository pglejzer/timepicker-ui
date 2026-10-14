import type {
  ClockState,
  ClockType,
  ClockMode,
  DisabledTimeConfig,
  EngineInput,
  Point,
  SixtyMode,
} from '../types';
import { AngleEngine } from '../engine/AngleEngine';
import { ClockEngine } from '../engine/ClockEngine';
import { HourEngine } from '../engine/HourEngine';
import { MinuteEngine } from '../engine/MinuteEngine';
import { ClockRenderer } from '../renderer/ClockRenderer';

export interface ClockControllerCallbacks {
  onHourChange?: (hour: string) => void;
  onMinuteChange?: (minute: string) => void;
  onSecondChange?: (second: string) => void;
}

export class ClockController {
  private state: ClockState;
  private renderer: ClockRenderer;
  private clockType: ClockType;
  private disabledTime: DisabledTimeConfig | null;
  private incrementHours: number;
  private incrementMinutes: number;
  private incrementSeconds: number;
  private smoothHourSnap: boolean;
  private showSeconds: boolean;
  private isDragging: boolean = false;
  private callbacks: ClockControllerCallbacks;
  private lastProcessedX: number | null = null;
  private lastProcessedY: number | null = null;
  private appliedInDrag: boolean = false;
  private readonly sixtyUnits = {
    minutes: { value: 'minute', angle: 'minuteAngle', notify: () => this.callbacks.onMinuteChange },
    seconds: { value: 'second', angle: 'secondAngle', notify: () => this.callbacks.onSecondChange },
  } as const;

  constructor(
    renderer: ClockRenderer,
    initialState: ClockState,
    clockType: ClockType,
    disabledTime: DisabledTimeConfig | null,
    incrementHours: number = 1,
    incrementMinutes: number = 1,
    smoothHourSnap: boolean = true,
    callbacks: ClockControllerCallbacks = {},
    incrementSeconds: number = 1,
    showSeconds: boolean = false,
  ) {
    this.renderer = renderer;
    this.state = { ...initialState };
    this.clockType = clockType;
    this.disabledTime = disabledTime;
    this.incrementHours = incrementHours;
    this.incrementMinutes = incrementMinutes;
    this.incrementSeconds = incrementSeconds;
    this.smoothHourSnap = smoothHourSnap;
    this.showSeconds = showSeconds;
    this.callbacks = callbacks;
  }

  handlePointerMove(pointerPos: Point, clockCenter: Point, clockRadius: number): boolean {
    this.isDragging = true;

    if (this.lastProcessedX === pointerPos.x && this.lastProcessedY === pointerPos.y) {
      return this.appliedInDrag;
    }

    this.lastProcessedX = pointerPos.x;
    this.lastProcessedY = pointerPos.y;

    const mode = this.state.mode;
    const input: EngineInput = {
      pointerPosition: pointerPos,
      clockCenter,
      clockRadius,
      mode,
      clockType: this.clockType,
      amPm: this.state.amPm,
      disabledTime: this.disabledTime,
      incrementHours: this.incrementHours,
      incrementMinutes: this.incrementMinutes,
      incrementSeconds: this.incrementSeconds,
      smoothHourSnap: this.smoothHourSnap,
      currentHour: this.state.hour,
      currentMinute: this.state.minute,
      showSeconds: this.showSeconds,
    };

    const output = ClockEngine.processPointerInput(input);

    if (!output.isValid) {
      return false;
    }

    if (mode === 'hours') {
      const prevHour = this.state.hour;
      this.state.hour = output.value;
      this.state.hourAngle = output.angle;

      if (this.clockType === '24h' && output.isInnerCircle !== undefined) {
        this.renderer.setCircle24hMode(output.isInnerCircle);
      }

      if (this.callbacks.onHourChange && prevHour !== output.value) {
        this.callbacks.onHourChange(output.value);
      }
    } else {
      const previous = this.writeSixty(mode, output.value, output.angle);
      const notify = this.sixtyUnits[mode].notify();

      if (notify && previous !== output.value) {
        notify(output.value);
      }
    }

    this.renderer.setHandAngle(output.angle);
    this.renderer.setActiveValue(output.value);
    this.appliedInDrag = true;
    return true;
  }

  handlePointerUp(): void {
    this.isDragging = false;
    this.appliedInDrag = false;
    this.lastProcessedX = null;
    this.lastProcessedY = null;
  }

  snapToNearestHour(): void {
    if (this.state.mode !== 'hours') return;

    const targetAngle = ClockEngine.valueToAngle(this.state.hour, 'hours', this.clockType);
    this.state.hourAngle = targetAngle;
    this.renderer.animateToAngle(targetAngle);
  }

  switchMode(mode: ClockMode): void {
    this.state.mode = mode;

    this.renderer.setCircle24hMode(this.isInnerFace(mode, this.getValue(mode)));
    this.renderer.setHandAngle(this.getAngle(mode));
  }

  followHand(mode: ClockMode): void {
    const value = this.getValue(mode);
    const inner = this.isInnerFace(mode, value);

    this.renderer.followHand((angle) => {
      const tip = AngleEngine.snapToIncrement(angle, 30);
      if (mode === 'hours') {
        return HourEngine.indexToValue(HourEngine.angleToIndex(tip, this.clockType, inner), this.clockType);
      }
      return MinuteEngine.indexToValue(MinuteEngine.angleToIndex(tip));
    }, value);
  }

  setValue(mode: ClockMode, value: string): void {
    const angle = ClockEngine.valueToAngle(value, mode, this.clockType);

    if (mode === 'hours') {
      this.state.hour = value;
      this.state.hourAngle = angle;
    } else {
      this.writeSixty(mode, value, angle);
    }

    if (this.state.mode === mode) {
      this.renderer.setCircle24hMode(this.isInnerFace(mode, value));
      this.renderer.setHandAngle(angle);
      this.renderer.setActiveValue(value);
    }
  }

  setAmPm(amPm: 'AM' | 'PM' | ''): void {
    this.state.amPm = amPm;
  }

  getState(): Readonly<ClockState> {
    return { ...this.state };
  }

  getValue(mode: ClockMode): string {
    return mode === 'hours' ? this.state.hour : this.state[this.sixtyUnits[mode].value];
  }

  getHour(): string {
    return this.state.hour;
  }

  getMinute(): string {
    return this.state.minute;
  }

  getSecond(): string {
    return this.state.second;
  }

  getAmPm(): string {
    return this.state.amPm;
  }

  updateDisabledTime(disabledTime: DisabledTimeConfig | null): void {
    this.disabledTime = disabledTime;
  }

  destroy(): void {
    this.renderer.destroy();
  }

  private getAngle(mode: ClockMode): number {
    return mode === 'hours' ? this.state.hourAngle : this.state[this.sixtyUnits[mode].angle];
  }

  private writeSixty(mode: SixtyMode, value: string, angle: number): string {
    const unit = this.sixtyUnits[mode];
    const previous = this.state[unit.value];

    this.state[unit.value] = value;
    this.state[unit.angle] = angle;
    return previous;
  }

  private isInnerFace(mode: ClockMode, value: string): boolean {
    if (mode !== 'hours' || this.clockType !== '24h') return false;

    const hourValue = parseInt(value, 10);
    return hourValue === 0 || hourValue >= 13;
  }
}
