import { getScrollbarWidth } from '../utils/config';
import type { ITimepickerUI } from '../types/ITimepickerUI';

export default class ModalManager {
  private timepicker: ITimepickerUI;

  constructor(timepicker: ITimepickerUI) {
    this.timepicker = timepicker;
  }

  /** @internal */
  setModalTemplate = (): void => {
    if (!this.timepicker._options) return;

    if (this.timepicker._options.inline?.enabled) {
      const containerElement = document.getElementById(this.timepicker._options.inline.containerId);
      if (containerElement) {
        containerElement.innerHTML = '';
        containerElement.insertAdjacentHTML('beforeend', this.timepicker.modalTemplate);
        const modalElement = containerElement.querySelector('.timepicker-ui-modal') as HTMLDivElement;
        if (modalElement) {
          modalElement.classList.add('timepicker-ui--inline');

          if (
            this.timepicker._options.inline.showButtons === false ||
            this.timepicker._options.inline.showButtons === undefined
          ) {
            const buttonWrapper = modalElement.querySelector('.timepicker-ui-wrapper-btn');
            if (buttonWrapper) {
              (buttonWrapper as HTMLElement).style.display = 'none';
            }
            const mobileButtonWrapper = modalElement.querySelector('.timepicker-ui-wrapper-btn.mobile');
            if (mobileButtonWrapper) {
              (mobileButtonWrapper as HTMLElement).style.display = 'none';
            }
          }
        }
      }
      return;
    }

    const { appendModalSelector } = this.timepicker._options;

    if (appendModalSelector === '' || !appendModalSelector) {
      document.body.insertAdjacentHTML('afterend', this.timepicker.modalTemplate);
    } else {
      const element = document?.querySelector(appendModalSelector);
      element?.insertAdjacentHTML('beforeend', this.timepicker.modalTemplate);
    }
  };

  /** @internal */
  setScrollbarOrNot = (): void => {
    if (this.timepicker._options.inline?.enabled) {
      return;
    }

    if (!this.timepicker._options.enableScrollbar) {
      document.body.style.paddingRight = `${getScrollbarWidth()}px`;
      document.body.style.overflowY = 'hidden';
    } else {
      setTimeout(() => {
        document.body.style.overflowY = '';
        document.body.style.paddingRight = '';
      }, 400);
    }
  };

  /** @internal */
  removeBackdrop = (): void => {
    if (this.timepicker._options.inline?.enabled) {
      return;
    }

    if (this.timepicker._options.backdrop) return;

    this.timepicker.modalElement?.classList.add('removed');
    this.timepicker.openElement.forEach((openEl: HTMLElement) => openEl?.classList.add('disabled'));
  };

  /** @internal */
  setNormalizeClass = (): void => {
    const allElement = this.timepicker.modalElement?.querySelectorAll('div');

    this.timepicker.modalElement?.classList.add('timepicker-ui-normalize');
    allElement?.forEach((div: HTMLDivElement) => div.classList.add('timepicker-ui-normalize'));
  };

  /** @internal */
  setShowClassToBackdrop = (): void => {
    if (this.timepicker._options.inline?.enabled) {
      this.timepicker.modalElement?.classList.add('show');
      return;
    }

    if (this.timepicker._options.backdrop) {
      setTimeout(() => {
        this.timepicker.modalElement.classList.add('show');
      }, 300);
    }
  };

  /** @internal */
  setFlexEndToFooterIfNoKeyboardIcon = (): void => {
    if (!this.timepicker._options.enableSwitchIcon && this.timepicker.footer) {
      this.timepicker.footer.style.justifyContent = 'flex-end';
    }
  };
}
