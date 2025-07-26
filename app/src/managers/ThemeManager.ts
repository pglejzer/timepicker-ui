import { hasClass } from '../utils/config';
import type { ITimepickerUI } from '../types/ITimepickerUI';
import { name } from '../utils/variables';
import { themeClasses } from '../constants/variables';

export default class ThemeManager {
  private timepicker: ITimepickerUI;

  constructor(timepicker: ITimepickerUI) {
    this.timepicker = timepicker;
  }

  /** @internal */
  setTheme = (): void => {
    const modal = this.timepicker.modalElement;
    if (!modal || !this.timepicker._options) return;

    const { theme } = this.timepicker._options;
    if (!theme || !themeClasses[theme]) return;

    const elements = modal.querySelectorAll<HTMLInputElement | HTMLDivElement>('input, div');

    elements.forEach((el) => {
      Object.values(themeClasses).forEach((clsArr) => el.classList.remove(...clsArr));
      el.classList.add(...themeClasses[theme]);
    });
  };

  /** @internal */
  setInputClassToInputElement = (): void => {
    const input = this.timepicker.input as HTMLInputElement | null;
    if (!input) return;

    if (!hasClass(input, 'timepicker-ui-input')) {
      input.classList.add('timepicker-ui-input');
    }
  };

  /** @internal */
  setDataOpenToInputIfDoesntExistInWrapper = (): void => {
    if (this.timepicker.openElementData === null && this.timepicker.input) {
      this.timepicker.input.setAttribute('data-open', 'timepicker-ui-input');
    }
  };

  /** @internal */
  setClassTopOpenElement = (): void => {
    for (const el of this.timepicker.openElement) {
      if (el) el.classList.add('timepicker-ui-open-element');
    }
  };

  /** @internal */
  setTimepickerClassToElement = (): void => {
    const root = this.timepicker._element;
    if (!root) return;

    root.classList.add(name);

    const customClass = this.timepicker._options?.cssClass;
    if (customClass && customClass !== name) {
      root.classList.add(customClass);
    }
  };

  destroy() {
    const modal = this.timepicker.modalElement;
    if (!modal) return;

    const elements = modal.querySelectorAll('input, div');
    elements.forEach((el) => {
      Object.values(themeClasses).forEach((clsArr) => el.classList.remove(...clsArr));
    });
  }
}
