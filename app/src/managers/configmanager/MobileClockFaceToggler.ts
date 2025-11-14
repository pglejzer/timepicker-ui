import type { ITimepickerUI } from '../../types/ITimepickerUI';
import { TimeoutManager } from './TimeoutManager';
import { ViewSwitcher } from './ViewSwitcher';

export class MobileClockFaceToggler {
  private isAnimating = false;

  constructor(
    private timepicker: ITimepickerUI,
    private timeoutManager: TimeoutManager,
    private viewSwitcher: ViewSwitcher,
  ) {}

  private initializeClockFaceFirstTime() {
    const mobileMinutesInput = this.timepicker.modalElement?.querySelector(
      '.timepicker-ui-minutes',
    ) as HTMLInputElement;
    const isMinutesActive = mobileMinutesInput?.classList.contains('active');

    if (this.timepicker.clockManager) {
      if (isMinutesActive && mobileMinutesInput) {
        this.timepicker.clockManager.setMinutesToClock(mobileMinutesInput.value);
      } else {
        this.timepicker.clockManager.setHoursToClock(this.timepicker.hour.value);
      }

      if (this.timepicker.eventManager) {
        this.timepicker.eventManager.handleMoveHand();
      }
    }

    if (this.timepicker.clockFace) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.timepicker.clockFace?.classList.add('scale-in');
        });
      });
    }
  }

  private updateClockFaceSubsequent() {
    if (this.timepicker.clockManager) {
      const minutesInput = this.timepicker.modalElement?.querySelector(
        '.timepicker-ui-minutes',
      ) as HTMLInputElement;
      const hourInput = this.timepicker.modalElement?.querySelector(
        '.timepicker-ui-hour',
      ) as HTMLInputElement;
      const isMinutesActive = minutesInput?.classList.contains('active');

      if (isMinutesActive && minutesInput) {
        this.timepicker.clockManager.setMinutesToClock(minutesInput.value);
      } else if (hourInput) {
        this.timepicker.clockManager.setHoursToClock(hourInput.value);
      }

      if (this.timepicker.eventManager) {
        this.timepicker.eventManager.handleMoveHand();
      }
    }
  }

  private collapseClockFace(
    wrapper: Element,
    mobileClockWrapper: Element | null,
    allElements: NodeListOf<Element> | undefined,
    icon: HTMLElement | undefined,
    selectTimeLabel: Element | null,
    hourInput: HTMLInputElement | undefined,
    minuteInput: HTMLInputElement | undefined,
  ) {
    this.isAnimating = true;

    this.viewSwitcher.switchView(selectTimeLabel, icon, hourInput, minuteInput, true);

    allElements?.forEach((el) => {
      if (el !== mobileClockWrapper && el !== wrapper && el !== selectTimeLabel) {
        el.classList.remove('expanded');
        el.classList.add('mobile');
      }
    });

    if (selectTimeLabel) {
      selectTimeLabel.classList.remove('expanded');
      selectTimeLabel.classList.add('mobile');
    }

    requestAnimationFrame(() => {
      mobileClockWrapper?.classList.remove('expanded');
      mobileClockWrapper?.classList.add('mobile');
      wrapper?.classList.remove('expanded');
      wrapper?.classList.add('mobile');

      this.timepicker.clockFace?.classList.remove('scale-in');

      this.timeoutManager.runWithTimeout(() => {
        this.isAnimating = false;
      }, 450);
    });

    icon?.setAttribute('aria-label', 'Show clock face');
    icon?.setAttribute('aria-pressed', 'false');
  }
  private expandClockFace(
    wrapper: Element,
    mobileClockWrapper: Element | null,
    allElements: NodeListOf<Element> | undefined,
    icon: HTMLElement | undefined,
    selectTimeLabel: Element | null,
    hourInput: HTMLInputElement | undefined,
    minuteInput: HTMLInputElement | undefined,
  ) {
    this.isAnimating = true;

    const isFirstTime = !wrapper.hasAttribute('data-clock-initialized');
    if (isFirstTime) {
      wrapper.setAttribute('data-clock-initialized', 'true');
      this.timepicker.clockFace?.classList.remove('scale-in');
    }

    if (this.timepicker.clockManager) {
      const minutesInput = this.timepicker.modalElement?.querySelector(
        '.timepicker-ui-minutes',
      ) as HTMLInputElement;
      const isMinutesActive = minutesInput?.classList.contains('active');

      if (isMinutesActive && minutesInput) {
        this.timepicker.clockManager.setMinutesToClock(minutesInput.value);
      } else if (hourInput) {
        this.timepicker.clockManager.setHoursToClock(hourInput.value);
      }

      if (this.timepicker.eventManager) {
        this.timepicker.eventManager.handleMoveHand();
      }
    }

    allElements?.forEach((el) => {
      if (el !== mobileClockWrapper && el !== wrapper && el !== selectTimeLabel) {
        el.classList.remove('mobile');
        el.classList.add('expanded');
      }
    });

    if (selectTimeLabel) {
      selectTimeLabel.classList.remove('mobile');
      selectTimeLabel.classList.add('expanded');
    }

    this.viewSwitcher.switchView(selectTimeLabel, icon, hourInput, minuteInput, false);

    requestAnimationFrame(() => {
      wrapper.classList.remove('mobile');
      wrapper.classList.add('expanded');

      requestAnimationFrame(() => {
        if (mobileClockWrapper) {
          mobileClockWrapper.classList.remove('mobile');
          mobileClockWrapper.classList.add('expanded');
        }

        this.timeoutManager.runWithTimeout(() => {
          this.timepicker.clockFace?.classList.add('scale-in');
        }, 150);

        this.timeoutManager.runWithTimeout(() => {
          this.isAnimating = false;
        }, 450);
      });
    });

    icon?.setAttribute('aria-label', 'Hide clock face');
    icon?.setAttribute('aria-pressed', 'true');
  }

  toggle() {
    if (this.isAnimating) return;

    const wrapper = this.timepicker.modalElement?.querySelector('.timepicker-ui-wrapper');
    const icon = this.timepicker.keyboardClockIcon;
    const mobileClockWrapper = this.timepicker.modalElement?.querySelector(
      '.timepicker-ui-mobile-clock-wrapper',
    );

    const allElements = this.timepicker.modalElement?.querySelectorAll('*');

    const selectTimeLabel = this.timepicker.modalElement?.querySelector('.timepicker-ui-select-time');
    const hourInput = this.timepicker.hour;
    const minuteInput = this.timepicker.minutes;

    if (!wrapper) return;

    const isExpanded = wrapper.classList.contains('expanded');

    if (isExpanded) {
      this.collapseClockFace(
        wrapper,
        mobileClockWrapper,
        allElements,
        icon,
        selectTimeLabel,
        hourInput,
        minuteInput,
      );
    } else {
      this.expandClockFace(
        wrapper,
        mobileClockWrapper,
        allElements,
        icon,
        selectTimeLabel,
        hourInput,
        minuteInput,
      );
    }
  }
}
