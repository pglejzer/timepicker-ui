import type { ClockState, ClockType, ClockMode, DisabledTimeConfig, EngineInput, Point } from '../types';
import { ClockEngine } from '../engine/ClockEngine';
import { ClockRenderer } from '../renderer/ClockRenderer';

export interface ClockControllerCallbacks {
  onHourChange?: (hour: string) => void;
  onMinuteChange?: (minute: string) => void;
}

export class ClockController {
  private state: ClockState;
  private renderer: ClockRenderer;
  private clockType: ClockType;
  private disabledTime: DisabledTimeConfig | null;
  private incrementHours: number;
  private incrementMinutes: number;
  private smoothHourSnap: boolean;
  private isDragging: boolean = false;
  private callbacks: ClockControllerCallbacks;

  constructor(
    renderer: ClockRenderer,
    initialState: ClockState,
    clockType: ClockType,
    disabledTime: DisabledTimeConfig | null,
    incrementHours: number = 1,
    incrementMinutes: number = 1,
    smoothHourSnap: boolean = true,
    callbacks: ClockControllerCallbacks = {},
  ) {
    this.renderer = renderer;
    this.state = { ...initialState };
    this.clockType = clockType;
    this.disabledTime = disabledTime;
    this.incrementHours = incrementHours;
    this.incrementMinutes = incrementMinutes;
    this.smoothHourSnap = smoothHourSnap;
    this.callbacks = callbacks;
  }

  handlePointerMove(pointerPos: Point, clockCenter: Point, clockRadius: number): void {
    this.isDragging = true;

    const input: EngineInput = {
      pointerPosition: pointerPos,
      clockCenter,
      clockRadius,
      mode: this.state.mode,
      clockType: this.clockType,
      amPm: this.state.amPm,
      disabledTime: this.disabledTime,
      incrementHours: this.incrementHours,
      incrementMinutes: this.incrementMinutes,
      smoothHourSnap: this.smoothHourSnap,
      currentHour: this.state.hour,
    };

    const output = ClockEngine.processPointerInput(input);

    if (!output.isValid) {
      return;
    }

    if (this.state.mode === 'hours') {
      this.state.hour = output.value;
      this.state.hourAngle = output.angle;

      if (this.clockType === '24h' && output.isInnerCircle !== undefined) {
        this.renderer.setCircleSize(true);
        this.renderer.setCircle24hMode(output.isInnerCircle);
      }

      if (this.callbacks.onHourChange) {
        this.callbacks.onHourChange(output.value);
      }
    } else {
      this.state.minute = output.value;
      this.state.minuteAngle = output.angle;

      this.renderer.setCircleSize(true);
      this.renderer.setCircle24hMode(false);

      if (this.callbacks.onMinuteChange) {
        this.callbacks.onMinuteChange(output.value);
      }
    }

    this.renderer.setHandAngle(output.angle);
    this.renderer.setActiveValue(output.value);
  }

  handlePointerUp(): void {
    this.isDragging = false;
  }

  snapToNearestHour(): void {
    if (this.state.mode !== 'hours') return;

    const targetAngle = ClockEngine.valueToAngle(this.state.hour, 'hours', this.clockType);
    this.state.hourAngle = targetAngle;
    this.renderer.animateToAngle(targetAngle);
  }

  switchMode(mode: ClockMode): void {
    this.state.mode = mode;

    const angle = mode === 'hours' ? this.state.hourAngle : this.state.minuteAngle;
    const value = mode === 'hours' ? this.state.hour : this.state.minute;

    if (mode === 'hours' && this.clockType === '24h') {
      const hourValue = parseInt(value, 10);
      const isInner = hourValue === 0 || hourValue >= 13;
      this.renderer.setCircleSize(true);
      this.renderer.setCircle24hMode(isInner);
    } else {
      this.renderer.setCircleSize(true);
      this.renderer.setCircle24hMode(false);
    }

    this.renderer.setHandAngle(angle);
    this.renderer.setActiveValue(value);
  }

  setValue(mode: ClockMode, value: string): void {
    const angle = ClockEngine.valueToAngle(value, mode, this.clockType);

    if (mode === 'hours') {
      this.state.hour = value;
      this.state.hourAngle = angle;

      if (this.clockType === '24h') {
        const hourValue = parseInt(value, 10);
        const isInner = hourValue === 0 || hourValue >= 13;
        this.renderer.setCircleSize(true);
        this.renderer.setCircle24hMode(isInner);
      } else {
        this.renderer.setCircle24hMode(false);
      }
    } else {
      this.state.minute = value;
      this.state.minuteAngle = angle;
      this.renderer.setCircleSize(true);
      this.renderer.setCircle24hMode(false);
    }

    if (this.state.mode === mode) {
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

  getHour(): string {
    return this.state.hour;
  }

  getMinute(): string {
    return this.state.minute;
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
}
