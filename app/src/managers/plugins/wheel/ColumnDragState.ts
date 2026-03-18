import type { WheelColumnType } from './WheelTypes';

const SNAP_ANIMATION_DURATION_MS = 180;
const SNAP_DISTANCE_THRESHOLD = 0.5;
const WHEEL_SNAP_DEBOUNCE_MS = 120;
const VELOCITY_SAMPLE_COUNT = 5;
const VELOCITY_SAMPLE_MAX_AGE_MS = 100;

interface VelocitySample {
  readonly time: number;
  readonly y: number;
}

export class ColumnDragState {
  readonly element: HTMLDivElement;
  readonly columnType: WheelColumnType;

  private _lastY: number = 0;
  private _isDragging: boolean = false;
  private _pointerId: number = -1;
  private _momentumRaf: number | null = null;
  private velocitySamples: VelocitySample[] = [];
  private snapTimeout: ReturnType<typeof setTimeout> | null = null;
  private snapAnimationRaf: number | null = null;
  private abortController: AbortController | null = null;

  constructor(element: HTMLDivElement, columnType: WheelColumnType) {
    this.element = element;
    this.columnType = columnType;
    this.abortController = new AbortController();
  }

  get lastY(): number {
    return this._lastY;
  }

  get isDragging(): boolean {
    return this._isDragging;
  }

  get pointerId(): number {
    return this._pointerId;
  }

  get signal(): AbortSignal {
    return this.abortController ? this.abortController.signal : new AbortController().signal;
  }

  startDrag(clientY: number, pointerId: number): void {
    this.stopMomentum();
    this._isDragging = true;
    this._lastY = clientY;
    this._pointerId = pointerId;
    this.velocitySamples = [{ time: performance.now(), y: clientY }];
  }

  updateLastY(clientY: number): void {
    this._lastY = clientY;
  }

  addVelocitySample(clientY: number): void {
    this.velocitySamples.push({ time: performance.now(), y: clientY });
    if (this.velocitySamples.length > VELOCITY_SAMPLE_COUNT) {
      this.velocitySamples.shift();
    }
  }

  computeReleaseVelocity(): number {
    const now = performance.now();
    const recentSamples = this.velocitySamples.filter((s) => now - s.time < VELOCITY_SAMPLE_MAX_AGE_MS);

    if (recentSamples.length < 2) return 0;

    const first = recentSamples[0];
    const last = recentSamples[recentSamples.length - 1];
    const dt = last.time - first.time;

    if (dt <= 0) return 0;

    return (first.y - last.y) / dt;
  }

  endDrag(): void {
    this._isDragging = false;
    this._pointerId = -1;
    this.velocitySamples = [];
  }

  setMomentumRaf(handle: number | null): void {
    this._momentumRaf = handle;
  }

  hasMomentum(): boolean {
    return this._momentumRaf !== null;
  }

  stopMomentum(): void {
    if (this._momentumRaf !== null) {
      cancelAnimationFrame(this._momentumRaf);
      this._momentumRaf = null;
    }
    if (this.snapAnimationRaf !== null) {
      cancelAnimationFrame(this.snapAnimationRaf);
      this.snapAnimationRaf = null;
    }
  }

  animateToOffset(target: number, onComplete: () => void): void {
    this.stopMomentum();

    const startOffset = this.element.scrollTop;
    const distance = target - startOffset;
    const startTime = performance.now();

    if (Math.abs(distance) < SNAP_DISTANCE_THRESHOLD) {
      this.element.scrollTop = target;
      onComplete();
      return;
    }

    const step = (): void => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / SNAP_ANIMATION_DURATION_MS, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      this.element.scrollTop = startOffset + distance * eased;

      if (progress < 1) {
        this.snapAnimationRaf = requestAnimationFrame(step);
      } else {
        this.element.scrollTop = target;
        this.snapAnimationRaf = null;
        onComplete();
      }
    };

    this.snapAnimationRaf = requestAnimationFrame(step);
  }

  scheduleSnapAfterWheel(callback: () => void): void {
    if (this.snapTimeout !== null) {
      clearTimeout(this.snapTimeout);
    }
    this.snapTimeout = setTimeout(() => {
      this.snapTimeout = null;
      callback();
    }, WHEEL_SNAP_DEBOUNCE_MS);
  }

  destroy(): void {
    this.stopMomentum();
    if (this.snapTimeout !== null) {
      clearTimeout(this.snapTimeout);
      this.snapTimeout = null;
    }
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }
}

