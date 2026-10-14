import type { Point } from '../types';
import type { ClockController } from '../controller/ClockController';
import { isDocument, isNode } from '../../../utils/node';

export interface DragHandlersConfig {
  autoSwitchToMinutes?: boolean;
  autoSwitchToSeconds?: boolean;
  isMobileView?: boolean;
  smoothHourSnap?: boolean;
  hourElement?: HTMLInputElement | null;
  minutesElement?: HTMLInputElement | null;
  secondsElement?: HTMLInputElement | null;
  onMinuteCommit?: () => void;
}

export class DragHandlers {
  private controller: ClockController;
  private clockFace: HTMLElement;
  private isActive: boolean = false;
  private isBlocked: boolean = false;
  private config: DragHandlersConfig;
  private cachedRect: DOMRect | null = null;
  private cachedCenter: Point | null = null;
  private cachedRadius: number | null = null;
  private rafId: number | null = null;
  private hadValidSelection: boolean = false;

  constructor(controller: ClockController, clockFace: HTMLElement, config: DragHandlersConfig = {}) {
    this.controller = controller;
    this.clockFace = clockFace;
    this.config = config;
  }

  attach(): void {
    this.clockFace.addEventListener('mousedown', this.handlePointerDown);
    this.clockFace.addEventListener('touchstart', this.handlePointerDown, { passive: false });
  }

  detach(): void {
    this.clockFace.removeEventListener('mousedown', this.handlePointerDown);
    this.clockFace.removeEventListener('touchstart', this.handlePointerDown);
    this.removeGlobalListeners();
    this.cancelPendingFrame();
    this.isActive = false;
  }

  block(): void {
    this.isBlocked = true;
  }

  unblock(): void {
    this.isBlocked = false;
  }

  private handlePointerDown = (event: MouseEvent | TouchEvent): void => {
    if (isNode() || this.isBlocked) {
      return;
    }

    if (this.isDisabledTarget(event.target as Element | null)) {
      return;
    }

    event.preventDefault();
    this.isActive = true;
    this.hadValidSelection = false;

    this.cachedRect = this.clockFace.getBoundingClientRect();
    this.cachedCenter = this.getClockCenter();
    this.cachedRadius = this.getClockRadius();

    this.processPointerEvent(event);

    document.addEventListener('mousemove', this.handlePointerMove);
    document.addEventListener('touchmove', this.handlePointerMove, { passive: false });
    document.addEventListener('mouseup', this.handlePointerUp);
    document.addEventListener('touchend', this.handlePointerUp);
  };

  private handlePointerMove = (event: MouseEvent | TouchEvent): void => {
    if (!this.isActive || this.isBlocked) return;

    if (this.isDisabledTarget(this.getTargetElement(event))) {
      return;
    }

    event.preventDefault();

    if (this.rafId !== null) {
      return;
    }

    this.rafId = requestAnimationFrame(() => {
      this.rafId = null;
      this.processPointerEvent(event);
    });
  };

  private handlePointerUp = (): void => {
    if (!this.isActive) return;

    this.cancelPendingFrame();
    this.isActive = false;
    this.cachedRect = null;
    this.cachedCenter = null;
    this.cachedRadius = null;
    this.controller.handlePointerUp();

    const {
      autoSwitchToMinutes,
      autoSwitchToSeconds,
      isMobileView,
      smoothHourSnap,
      hourElement,
      minutesElement,
      secondsElement,
    } = this.config;

    if (smoothHourSnap && hourElement?.classList.contains('active')) {
      this.controller.snapToNearestHour();
    }

    this.removeGlobalListeners();

    if (!this.hadValidSelection) {
      return;
    }

    if (autoSwitchToMinutes && hourElement?.classList.contains('active') && !isMobileView) {
      this.activate(hourElement, minutesElement);
    } else if (minutesElement?.classList.contains('active') && secondsElement) {
      if (autoSwitchToSeconds !== false && !isMobileView) {
        this.activate(minutesElement, secondsElement);
      }
    } else if (this.isLastUnitActive() && this.config.onMinuteCommit) {
      this.config.onMinuteCommit();
    }
  };

  private activate(from: HTMLElement, to: HTMLElement | null | undefined): void {
    to?.click();
    to?.focus();
    from.blur();
  }

  private isLastUnitActive(): boolean {
    const { minutesElement, secondsElement } = this.config;
    return !!(secondsElement ?? minutesElement)?.classList.contains('active');
  }

  private processPointerEvent(event: MouseEvent | TouchEvent): void {
    const point = this.getPointerPosition(event);
    const center = this.cachedCenter || this.getClockCenter();
    const radius = this.cachedRadius || this.getClockRadius();

    if (this.controller.handlePointerMove(point, center, radius) !== false) {
      this.hadValidSelection = true;
    }
  }

  private isDisabledTarget(target: Element | null): boolean {
    return !!target?.closest?.('.tp-ui-tips-disabled');
  }

  private getPointerPosition(event: MouseEvent | TouchEvent): Point {
    const rect = this.cachedRect || this.clockFace.getBoundingClientRect();

    if ('touches' in event) {
      const touch = event.touches[0] || event.changedTouches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    }
  }

  private getTargetElement(event: MouseEvent | TouchEvent): Element | null {
    if ('touches' in event) {
      const touch = event.touches[0] || event.changedTouches[0];
      if (touch && !isNode()) {
        return document.elementFromPoint(touch.clientX, touch.clientY);
      }
    }
    return event.target as Element;
  }

  private getClockCenter(): Point {
    const width = this.clockFace.offsetWidth;
    const height = this.clockFace.offsetHeight;

    return {
      x: width / 2,
      y: height / 2,
    };
  }

  private getClockRadius(): number {
    return this.clockFace.offsetWidth / 2;
  }

  private cancelPendingFrame(): void {
    if (this.rafId === null) return;
    cancelAnimationFrame(this.rafId);
    this.rafId = null;
  }

  private removeGlobalListeners(): void {
    if (isDocument() === false) {
      return;
    }

    document.removeEventListener('mousemove', this.handlePointerMove);
    document.removeEventListener('touchmove', this.handlePointerMove);
    document.removeEventListener('mouseup', this.handlePointerUp);
    document.removeEventListener('touchend', this.handlePointerUp);
  }
}
