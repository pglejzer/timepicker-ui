import { hasClass } from '../../utils/config';
import type { ITimepickerUI } from '../../types/ITimepickerUI';

export default class DragHandlers {
  private timepicker: ITimepickerUI;
  private _isDragging = false;
  private _animationFrameId: number | null = null;
  private _pendingUpdate = false;
  private updateHandPosition: (event: MouseEvent | TouchEvent) => void;

  constructor(timepicker: ITimepickerUI, updateHandPosition: (event: MouseEvent | TouchEvent) => void) {
    this.timepicker = timepicker;
    this.updateHandPosition = updateHandPosition;
  }

  get isDragging(): boolean {
    return this._isDragging;
  }

  get animationFrameId(): number | null {
    return this._animationFrameId;
  }

  cleanup(): void {
    document.removeEventListener('mousedown', this._onDragStart, false);
    document.removeEventListener('touchstart', this._onDragStart);
    document.removeEventListener('mousemove', this._onDragMove, false);
    document.removeEventListener('mouseup', this._onDragEnd, false);
    document.removeEventListener('touchmove', this._onDragMove);
    document.removeEventListener('touchend', this._onDragEnd, false);
    document.removeEventListener('mouseleave', this._onDragEnd, false);

    if (this._animationFrameId) {
      cancelAnimationFrame(this._animationFrameId);
      this._animationFrameId = null;
    }

    this._isDragging = false;
    this._pendingUpdate = false;
  }

  _onDragStart = (event: MouseEvent | TouchEvent) => {
    const target = event.target as Element;

    if (
      (hasClass(target, 'timepicker-ui-clock-face') ||
        hasClass(target, 'timepicker-ui-circle-hand') ||
        hasClass(target, 'timepicker-ui-hour-time-12') ||
        hasClass(target, 'timepicker-ui-minutes-time') ||
        hasClass(target, 'timepicker-ui-clock-hand') ||
        hasClass(target, 'timepicker-ui-value-tips') ||
        hasClass(target, 'timepicker-ui-value-tips-24h') ||
        hasClass(target, 'timepicker-ui-tips-wrapper') ||
        hasClass(target, 'timepicker-ui-tips-wrapper-24h')) &&
      !hasClass(target, 'timepicker-ui-tips-disabled')
    ) {
      event.preventDefault();
      this._isDragging = true;
      this.timepicker._isTouchMouseMove = true;

      document.addEventListener('mousemove', this._onDragMove, false);
      document.addEventListener('mouseup', this._onDragEnd, false);
      document.addEventListener('touchmove', this._onDragMove, { passive: false });
      document.addEventListener('touchend', this._onDragEnd, false);
      document.addEventListener('mouseleave', this._onDragEnd, false);

      this._scheduleUpdate(event);
    }
  };

  _onDragMove = (event: MouseEvent | TouchEvent) => {
    if (!this._isDragging) return;

    event.preventDefault();
    this._scheduleUpdate(event);
  };

  _onDragEnd = (event: MouseEvent | TouchEvent) => {
    if (!this._isDragging) return;

    this._isDragging = false;
    this.timepicker._isTouchMouseMove = false;

    document.removeEventListener('mousemove', this._onDragMove, false);
    document.removeEventListener('mouseup', this._onDragEnd, false);
    document.removeEventListener('touchmove', this._onDragMove);
    document.removeEventListener('touchend', this._onDragEnd, false);
    document.removeEventListener('mouseleave', this._onDragEnd, false);

    if (this._animationFrameId) {
      cancelAnimationFrame(this._animationFrameId);
      this._animationFrameId = null;
      this._pendingUpdate = false;
    }

    const target = event.target as Element;
    const { switchToMinutesAfterSelectHour } = this.timepicker._options;

    if (
      switchToMinutesAfterSelectHour &&
      (hasClass(target, 'timepicker-ui-value-tips') ||
        hasClass(target, 'timepicker-ui-value-tips-24h') ||
        hasClass(target, 'timepicker-ui-tips-wrapper'))
    ) {
      this.timepicker.minutes.click();
    }
  };

  private _scheduleUpdate = (event: MouseEvent | TouchEvent) => {
    if (this._pendingUpdate) return;

    this._pendingUpdate = true;
    this._animationFrameId = requestAnimationFrame(() => {
      this._pendingUpdate = false;
      this.updateHandPosition(event);
    });
  };

  handleEventToMoveHand = (event: TouchEvent) => {
    const { type } = event;

    if (type === 'mousedown' || type === 'touchstart') {
      this._onDragStart(event);
    } else if (type === 'mouseup' || type === 'touchend') {
      this._onDragEnd(event);
    } else if ((type === 'mousemove' || type === 'touchmove') && this._isDragging) {
      this._onDragMove(event);
    }
  };

  handleMoveHand = () => {
    if (this.timepicker._options.mobile || this.timepicker._isMobileView) return;

    document.addEventListener('mousedown', this._onDragStart, false);
    document.addEventListener('touchstart', this._onDragStart, { passive: false });
  };
}

