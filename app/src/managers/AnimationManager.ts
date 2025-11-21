import type { CoreState } from '../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../utils/EventEmitter';
import { TIMINGS } from '../constants/timings';

export default class AnimationManager {
  private core: CoreState;
  private emitter: EventEmitter<TimepickerEventMap>;
  private timeouts: NodeJS.Timeout[] = [];

  constructor(core: CoreState, emitter: EventEmitter<TimepickerEventMap>) {
    this.core = core;
    this.emitter = emitter;
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.emitter.on('animation:clock', () => {
      this.handleAnimationSwitchTipsMode();
    });
  }

  private runWithAnimation(callback: () => void, delay = TIMINGS.MODAL_ANIMATION): void {
    if (this.core.options.ui.animation) {
      const t = setTimeout(callback, delay);
      this.timeouts.push(t);
    } else {
      callback();
    }
  }

  private clearAllTimeouts(): void {
    this.timeouts.forEach(clearTimeout);
    this.timeouts = [];
  }

  setAnimationToOpen(): void {
    this.clearAllTimeouts();
    const modalElement = this.core.getModalElement();
    modalElement?.classList.add('opacity');

    this.runWithAnimation(() => {
      this.core.getModalElement()?.classList.add('show');
    });
  }

  removeAnimationToClose(): void {
    this.clearAllTimeouts();

    const modalElement = this.core.getModalElement();
    if (!modalElement) return;

    this.runWithAnimation(() => {
      const modal = this.core.getModalElement();
      modal?.classList.remove('show');
      modal?.classList.remove('opacity');
    });
  }

  handleAnimationClock(): void {
    if (!this.core.options.ui.animation) return;

    this.runWithAnimation(() => {
      const clockFace = this.core.getClockFace();
      clockFace?.classList.add('tp-ui-clock-animation');

      const t = setTimeout(() => {
        this.core.getClockFace()?.classList.remove('tp-ui-clock-animation');
      }, TIMINGS.CLOCK_ANIMATION);

      this.timeouts.push(t);
    });
  }

  handleAnimationSwitchTipsMode(): void {
    const clockHand = this.core.getClockHand();
    if (!clockHand) return;

    clockHand.classList.add('tp-ui-tips-animation');

    const t = setTimeout(() => {
      this.core.getClockHand()?.classList.remove('tp-ui-tips-animation');
    }, TIMINGS.TIPS_ANIMATION);

    this.timeouts.push(t);
  }

  destroy(): void {
    this.clearAllTimeouts();
  }
}

