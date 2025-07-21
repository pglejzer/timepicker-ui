import type { ITimepickerUI } from '../types/ITimepickerUI';

export default class AnimationManager {
  private timepicker: ITimepickerUI;

  constructor(timepicker: ITimepickerUI) {
    this.timepicker = timepicker;
  }

  /** @internal */
  setAnimationToOpen() {
    this.timepicker.modalElement?.classList.add('opacity');

    if (this.timepicker._options.animation) {
      setTimeout(() => {
        this.timepicker.modalElement?.classList.add('show');
      }, 150);
    } else {
      this.timepicker.modalElement?.classList.add('show');
    }
  }

  /** @internal */
  removeAnimationToClose() {
    if (this.timepicker.modalElement) {
      if (this.timepicker._options.animation) {
        setTimeout(() => {
          this.timepicker.modalElement?.classList.remove('show');
        }, 150);
      } else {
        this.timepicker.modalElement?.classList.remove('show');
      }
    }
  }

  /** @internal */
  handleAnimationClock() {
    if (this.timepicker._options.animation) {
      setTimeout(() => {
        this.timepicker.clockFace?.classList.add('timepicker-ui-clock-animation');

        setTimeout(() => {
          this.timepicker.clockFace?.classList.remove('timepicker-ui-clock-animation');
        }, 600);
      }, 150);
    }
  }

  /** @internal */
  handleAnimationSwitchTipsMode() {
    this.timepicker.clockHand.classList.add('timepicker-ui-tips-animation');
    setTimeout(() => {
      this.timepicker.clockHand?.classList.remove('timepicker-ui-tips-animation');
    }, 401);
  }
}
