import type { ITimepickerUI } from '../../types/ITimepickerUI';
import keyboardSvg from '../../../assets/keyboard.svg';
import scheduleSvg from '../../../assets/schedule.svg';

export class ViewSwitcher {
  constructor(private timepicker: ITimepickerUI) {}

  updateIconAndLabel(icon: HTMLElement | undefined, selectTimeLabel: Element | null, isMobile: boolean) {
    if (selectTimeLabel) {
      selectTimeLabel.textContent = isMobile
        ? this.timepicker._options.mobileTimeLabel || 'Enter Time'
        : this.timepicker._options.timeLabel || 'Select time';
    }

    if (icon) {
      const iconElement = icon.querySelector('.timepicker-ui-keyboard-icon');
      if (iconElement) {
        iconElement.innerHTML = isMobile
          ? this.timepicker._options.iconTemplateMobile || scheduleSvg
          : this.timepicker._options.iconTemplate || keyboardSvg;
      }
    }
  }

  toggleViewClasses(isMobile: boolean) {
    const action = isMobile ? 'add' : 'remove';
    this.timepicker.inputWrappers?.forEach((w) => w.classList[action]('mobile'));
    this.timepicker.minutesText.classList[action]('show');
    this.timepicker.dots.classList[action]('mobile');
    this.timepicker.hourText.classList[action]('show');
    this.timepicker.header.classList[action]('show');
  }

  updateReadonlyState(
    hourInput: HTMLInputElement | undefined,
    minuteInput: HTMLInputElement | undefined,
    isMobile: boolean,
  ) {
    if (isMobile) {
      hourInput?.removeAttribute('readonly');
      minuteInput?.removeAttribute('readonly');
    } else if (!this.timepicker._options.editable) {
      hourInput?.setAttribute('readonly', '');
      minuteInput?.setAttribute('readonly', '');
    }
  }

  switchView(
    selectTimeLabel: Element | null,
    icon: HTMLElement | undefined,
    hourInput: HTMLInputElement | undefined,
    minuteInput: HTMLInputElement | undefined,
    isMobile: boolean,
  ) {
    this.timepicker._isMobileView = isMobile;
    this.toggleViewClasses(isMobile);
    this.updateIconAndLabel(icon, selectTimeLabel, isMobile);
    this.updateReadonlyState(hourInput, minuteInput, isMobile);
  }
}
