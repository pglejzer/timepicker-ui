import type { CoreState } from '../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../utils/EventEmitter';
import { TIMINGS } from '../constants/timings';
import { prefersReducedMotion } from '../utils/accessibility';

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

  private clearAllTimeouts(): void {
    this.timeouts.forEach(clearTimeout);
    this.timeouts = [];
  }

  setAnimationToOpen(immediate = false): void {
    const modal = this.core.getModalElement();
    if (!modal) return;

    if (!immediate && this.core.options.ui.animation) {
      void modal.offsetHeight;
    }

    modal.classList.add('show');
  }

  removeAnimationToClose(): number {
    this.clearAllTimeouts();
    this.core.getModalElement()?.classList.remove('show');

    return this.core.options.ui.animation && !prefersReducedMotion() ? TIMINGS.MODAL_EXIT : 0;
  }

  handleAnimationSwitchTipsMode(): void {
    const clockHand = this.core.getClockHand();
    if (!clockHand || !this.core.options.ui.animation || prefersReducedMotion()) return;

    this.emitter.emit('animation:start', {});
    clockHand.classList.add('tp-ui-tips-animation');

    const t = setTimeout(() => {
      this.core.getClockHand()?.classList.remove('tp-ui-tips-animation');
      this.emitter.emit('animation:end', {});
    }, TIMINGS.TIPS_ANIMATION);

    this.timeouts.push(t);
  }

  destroy(): void {
    this.clearAllTimeouts();
  }
}
