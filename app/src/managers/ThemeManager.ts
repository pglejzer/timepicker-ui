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
    const allElements = [
      ...(this.timepicker.modalElement?.querySelectorAll('input') ?? []),
      ...(this.timepicker.modalElement?.querySelectorAll('div') ?? []),
    ] as Array<HTMLInputElement | HTMLDivElement>;

    const { theme } = this.timepicker._options ?? {};

    if (theme && themeClasses[theme]) {
      allElements.forEach((el) => el.classList.add(...themeClasses[theme]));
    }
  };

  /** @internal */
  setInputClassToInputElement = (): void => {
    if (!hasClass(this.timepicker.input as unknown as HTMLInputElement, 'timepicker-ui-input')) {
      this.timepicker.input?.classList.add('timepicker-ui-input');
    }
  };

  /** @internal */
  setDataOpenToInputIfDosentExistInWrapper = (): void => {
    if (this.timepicker.openElementData === null) {
      this.timepicker.input?.setAttribute('data-open', 'timepicker-ui-input');
    }
  };

  /** @internal */
  setClassTopOpenElement = (): void => {
    this.timepicker.openElement.forEach((openEl: HTMLElement) =>
      openEl?.classList.add('timepicker-ui-open-element'),
    );
  };

  /** @internal */
  setTimepickerClassToElement = (): void => {
    this.timepicker._element?.classList.add(name);

    if (this.timepicker._options.cssClass && this.timepicker._options.cssClass !== name) {
      this.timepicker._element?.classList.add(this.timepicker._options.cssClass);
    }
  };
}
