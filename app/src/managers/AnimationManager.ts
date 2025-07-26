import type { ITimepickerUI } from '../types/ITimepickerUI';

const ANIMATION_DELAYS = {
  MODAL: 150,
  CLOCK: 600,
  TIPS: 401,
} as const;

export default class AnimationManager {
  private timepicker: ITimepickerUI;
  private timeouts: NodeJS.Timeout[] = [];

  constructor(timepicker: ITimepickerUI) {
    this.timepicker = timepicker;
  }

  private runWithAnimation(callback: () => void, delay = ANIMATION_DELAYS.MODAL) {
    if (this.timepicker._options.animation) {
      const t = setTimeout(callback, delay);
      this.timeouts.push(t);
    } else {
      callback();
    }
  }

  private clearAllTimeouts() {
    this.timeouts.forEach(clearTimeout);
    this.timeouts = [];
  }

  /** @internal */
  setAnimationToOpen() {
    this.clearAllTimeouts();
    this.timepicker.modalElement?.classList.add('opacity');

    this.runWithAnimation(() => {
      this.timepicker.modalElement?.classList.add('show');
    });
  }

  /** @internal */
  removeAnimationToClose() {
    this.clearAllTimeouts();

    if (!this.timepicker.modalElement) return;

    this.runWithAnimation(() => {
      this.timepicker.modalElement?.classList.remove('show');
      this.timepicker.modalElement?.classList.remove('opacity');
    });
  }

  /** @internal */
  handleAnimationClock() {
    if (!this.timepicker._options.animation) return;

    this.runWithAnimation(() => {
      this.timepicker.clockFace?.classList.add('timepicker-ui-clock-animation');

      const t = setTimeout(() => {
        this.timepicker.clockFace?.classList.remove('timepicker-ui-clock-animation');
      }, ANIMATION_DELAYS.CLOCK);

      this.timeouts.push(t);
    });
  }

  /** @internal */
  handleAnimationSwitchTipsMode() {
    const { clockHand } = this.timepicker;
    if (!clockHand) return;

    clockHand.classList.add('timepicker-ui-tips-animation');

    const t = setTimeout(() => {
      clockHand.classList.remove('timepicker-ui-tips-animation');
    }, ANIMATION_DELAYS.TIPS);

    this.timeouts.push(t);
  }

  /** @internal */
  destroy() {
    this.clearAllTimeouts();
  }
}
