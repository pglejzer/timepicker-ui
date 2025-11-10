import type { Point } from '../types';
import type { ClockController } from '../controller/ClockController';
import type { ITimepickerUI } from '../../../types/ITimepickerUI';

export class DragHandlers {
  private controller: ClockController;
  private clockFace: HTMLElement;
  private isActive: boolean = false;
  private timepicker: ITimepickerUI;

  constructor(controller: ClockController, clockFace: HTMLElement, timepicker: ITimepickerUI) {
    this.controller = controller;
    this.clockFace = clockFace;
    this.timepicker = timepicker;
  }

  attach(): void {
    this.clockFace.addEventListener('mousedown', this.handlePointerDown);
    this.clockFace.addEventListener('touchstart', this.handlePointerDown, { passive: false });
  }

  detach(): void {
    this.clockFace.removeEventListener('mousedown', this.handlePointerDown);
    this.clockFace.removeEventListener('touchstart', this.handlePointerDown);
    this.removeGlobalListeners();
  }

  private handlePointerDown = (event: MouseEvent | TouchEvent): void => {
    const target = event.target as Element;

    if (target && target.classList && target.classList.contains('timepicker-ui-tips-disabled')) {
      return;
    }

    event.preventDefault();
    this.isActive = true;

    this.processPointerEvent(event);

    document.addEventListener('mousemove', this.handlePointerMove);
    document.addEventListener('touchmove', this.handlePointerMove, { passive: false });
    document.addEventListener('mouseup', this.handlePointerUp);
    document.addEventListener('touchend', this.handlePointerUp);
  };

  private handlePointerMove = (event: MouseEvent | TouchEvent): void => {
    if (!this.isActive) return;

    const target = this.getTargetElement(event);
    if (target && target.classList && target.classList.contains('timepicker-ui-tips-disabled')) {
      return;
    }

    event.preventDefault();
    this.processPointerEvent(event);
  };

  private handlePointerUp = (): void => {
    if (!this.isActive) return;

    this.isActive = false;
    this.controller.handlePointerUp();
    this.removeGlobalListeners();

    const { autoSwitchToMinutes } = this.timepicker._options;
    const hourInput = this.timepicker.hour;
    const minutesInput = this.timepicker.minutes;

    if (autoSwitchToMinutes && hourInput?.classList.contains('active') && !this.timepicker._isMobileView) {
      minutesInput?.click();
    }
  };

  private processPointerEvent(event: MouseEvent | TouchEvent): void {
    const point = this.getPointerPosition(event);
    const center = this.getClockCenter();
    const radius = this.getClockRadius();

    this.controller.handlePointerMove(point, center, radius);
  }

  private getPointerPosition(event: MouseEvent | TouchEvent): Point {
    const rect = this.clockFace.getBoundingClientRect();

    if (event instanceof TouchEvent) {
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
    if (event instanceof TouchEvent) {
      const touch = event.touches[0] || event.changedTouches[0];
      if (touch) {
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

  private removeGlobalListeners(): void {
    document.removeEventListener('mousemove', this.handlePointerMove);
    document.removeEventListener('touchmove', this.handlePointerMove);
    document.removeEventListener('mouseup', this.handlePointerUp);
    document.removeEventListener('touchend', this.handlePointerUp);
  }
}
