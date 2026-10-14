import type { CoreState } from '../../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../../utils/EventEmitter';
import type { LabelsOptions } from '../../types/options';
import { TIMINGS } from '../../constants/timings';
import { prefersReducedMotion, setOrRemoveAttribute, syncClockSlider } from '../../utils/accessibility';
import { emitSelect, getActiveField, getTimeInput } from '../events/timeFields';
import keyboardSvg from '../../../assets/keyboard.svg';
import scheduleSvg from '../../../assets/schedule.svg';

type LabelKey = keyof LabelsOptions;
type TimeInputLabels = readonly [selector: string, clockLabel: LabelKey, keyboardLabel: LabelKey];

interface SwitchParts {
  modal: HTMLElement;
  wrapper: HTMLElement;
  clockWrapper: HTMLElement | null;
  heading: HTMLElement | null;
  clockFace: HTMLElement | null;
  switchButton: HTMLElement | null;
  allElements: NodeListOf<Element>;
  isOriginallyMobile: boolean;
}

const LANDSCAPE_QUERY = '(orientation: landscape) and (max-height: 480px)';
const VIEW_SWITCHING = 'tp-ui-view-switching';

const KEYBOARD_VIEW_PARTS = [
  'select-time',
  'keyboard-icon-wrapper',
  'hour',
  'minutes',
  'seconds',
  'hour-text',
  'minute-text',
  'second-text',
  'header',
  'wrapper-type-time',
  'am',
  'pm',
  'input-wrapper',
  'input-ripple-wrapper',
]
  .map((part) => `.tp-ui-${part}`)
  .join(',');

const TIME_INPUTS: ReadonlyArray<TimeInputLabels> = [
  ['.tp-ui-hour', 'hourLabel', 'mobileHour'],
  ['.tp-ui-minutes', 'minuteLabel', 'mobileMinute'],
  ['.tp-ui-seconds', 'second', 'second'],
];

const nextFrame = (callback: () => void): void => {
  if (typeof requestAnimationFrame === 'undefined') {
    callback();
    return;
  }
  requestAnimationFrame(() => callback());
};

const markExpanded = (el: Element | null): void => {
  el?.classList.remove('mobile');
  el?.classList.add('expanded');
};

export class MobileViewHandler {
  private core: CoreState;
  private emitter: EventEmitter<TimepickerEventMap>;
  private animatingModal: HTMLElement | null = null;

  constructor(core: CoreState, emitter: EventEmitter<TimepickerEventMap>) {
    this.core = core;
    this.emitter = emitter;
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.emitter.on('switch:view', () => {
      this.toggleMobileClockFace();
    });
  }

  checkMobileOption(): void {
    this.core.setIsMobileView(!!this.core.options.ui.mobile);
  }

  toggleMobileClockFace(): void {
    const modal = this.core.getModalElement();
    if (!modal || this.animatingModal === modal) return;

    const wrapper = modal.querySelector<HTMLElement>('.tp-ui-wrapper');
    if (!wrapper) return;

    const parts: SwitchParts = {
      modal,
      wrapper,
      clockWrapper: modal.querySelector<HTMLElement>('.tp-ui-mobile-clock-wrapper'),
      heading: modal.querySelector<HTMLElement>('.tp-ui-select-time'),
      clockFace: this.core.getClockFace(),
      switchButton: this.core.getKeyboardClockIcon(),
      allElements: modal.querySelectorAll('*'),
      isOriginallyMobile: this.core.isMobileView,
    };

    this.animatingModal = modal;
    const isExpanded = wrapper.classList.contains('expanded');

    if (this.isLandscape()) {
      this.switchLandscape(parts, isExpanded);
    } else if (isExpanded) {
      nextFrame(() => this.collapsePortrait(parts));
    } else {
      this.expandPortrait(parts);
    }
  }

  private switchLandscape(parts: SwitchParts, isExpanded: boolean): void {
    const { modal, wrapper, clockWrapper, clockFace } = parts;
    const animated = this.core.options.ui.animation && !prefersReducedMotion();

    if (animated) {
      modal.classList.add(VIEW_SWITCHING);
    }
    if (isExpanded) {
      clockFace?.classList.remove('scale-in');
      clockWrapper?.classList.add('mobile');
      this.finishCollapse(parts);
    } else {
      this.showClockView(parts);
      markExpanded(wrapper);
      markExpanded(clockWrapper);
      clockFace?.classList.add('scale-in');
    }
    if (!animated) {
      this.release(parts);
      return;
    }
    setTimeout(() => {
      modal.classList.remove(VIEW_SWITCHING);
      this.release(parts);
    }, TIMINGS.WRAPPER_TRANSITION);
  }

  private collapsePortrait(parts: SwitchParts): void {
    parts.clockFace?.classList.toggle('scale-in', !parts.isOriginallyMobile);
    parts.clockWrapper?.classList.remove('expanded');
    if (parts.isOriginallyMobile) {
      parts.clockWrapper?.classList.add('mobile');
    }

    nextFrame(() => {
      this.finishCollapse(parts);
      setTimeout(() => this.release(parts), TIMINGS.MOBILE_TOGGLE);
    });
  }

  private finishCollapse(parts: SwitchParts): void {
    const { wrapper, clockWrapper, isOriginallyMobile } = parts;

    wrapper.classList.remove('expanded');
    wrapper.classList.add('mobile');
    clockWrapper?.classList.remove('expanded');
    if (isOriginallyMobile) {
      clockWrapper?.classList.add('mobile');
    }

    parts.allElements.forEach((el) => {
      if (el === wrapper || el === clockWrapper) return;
      el.classList.remove('expanded');
      if (isOriginallyMobile) {
        el.classList.add('mobile');
      }
    });

    this.switchView(parts, true);
  }

  private showClockView(parts: SwitchParts): void {
    const { wrapper, clockWrapper } = parts;

    this.selectActiveField();
    parts.allElements.forEach((el) => {
      if (el !== wrapper && el !== clockWrapper) markExpanded(el);
    });
    this.switchView(parts, false);
  }

  private expandPortrait(parts: SwitchParts): void {
    const { wrapper, clockWrapper, clockFace } = parts;

    this.showClockView(parts);

    nextFrame(() => {
      markExpanded(wrapper);

      nextFrame(() => {
        markExpanded(clockWrapper);
        clockFace?.classList.remove('scale-in');

        setTimeout(() => clockFace?.classList.add('scale-in'), TIMINGS.CLOCK_SCALE_DELAY);
        setTimeout(() => this.release(parts), TIMINGS.MOBILE_TOGGLE);
      });
    });
  }

  private selectActiveField(): void {
    const activeField = getActiveField(this.core);
    const input = getTimeInput(this.core, activeField);
    if (input) {
      emitSelect(this.emitter, activeField, input.value);
    }
  }

  private switchView(parts: SwitchParts, isKeyboardView: boolean): void {
    const { modal, heading } = parts;
    const { labels, ui } = this.core.options;
    const isReadonly = !isKeyboardView && !ui.editable;

    modal.querySelectorAll(KEYBOARD_VIEW_PARTS).forEach((el) => el.classList.toggle('mobile', isKeyboardView));
    TIME_INPUTS.forEach(([selector, clockLabel, keyboardLabel]) => {
      const input = modal.querySelector(selector);
      if (!input) return;
      input.toggleAttribute('readonly', isReadonly);
      setOrRemoveAttribute(input, 'aria-label', labels[isKeyboardView ? keyboardLabel : clockLabel]);
    });
    syncClockSlider(modal);

    const headingText = isKeyboardView ? labels.mobileTime : labels.time;
    if (heading && headingText) {
      heading.textContent = headingText;
    }

    this.setClockFaceHidden(parts.clockFace, isKeyboardView);
    this.renderSwitchButton(parts.switchButton, isKeyboardView);
  }

  private renderSwitchButton(button: HTMLElement | null, isKeyboardView: boolean): void {
    if (!button) return;

    const { iconTemplate, iconTemplateMobile } = this.core.options.ui;
    const { switchToKeyboardLabel, switchToClockLabel } = this.core.options.labels;

    if (isKeyboardView) {
      button.innerHTML = iconTemplateMobile || scheduleSvg;
      button.setAttribute('aria-label', switchToClockLabel ?? '');
    } else {
      button.innerHTML = iconTemplate || keyboardSvg;
      button.setAttribute('aria-label', switchToKeyboardLabel ?? '');
    }
  }

  public updateClockFaceAccessibility(isHidden: boolean): void {
    this.setClockFaceHidden(this.core.getClockFace(), isHidden);
  }

  private setClockFaceHidden(clockFace: HTMLElement | null, isHidden: boolean): void {
    if (!clockFace) return;

    clockFace.tabIndex = isHidden ? -1 : 0;
    setOrRemoveAttribute(clockFace, 'aria-hidden', isHidden && 'true');
  }

  private isLandscape(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia(LANDSCAPE_QUERY).matches
    );
  }

  private release(parts: SwitchParts): void {
    if (this.animatingModal === parts.modal) {
      this.animatingModal = null;
    }
  }

  destroy(): void {
    this.animatingModal = null;
  }
}
