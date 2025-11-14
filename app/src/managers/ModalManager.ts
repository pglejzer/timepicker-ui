import { getScrollbarWidth } from '../utils/config';
import type { ITimepickerUI } from '../types/ITimepickerUI';

export default class ModalManager {
  private timepicker: ITimepickerUI;
  private timeouts: NodeJS.Timeout[] = [];
  private originalOverflow?: string;
  private originalPaddingRight?: string;

  constructor(timepicker: ITimepickerUI) {
    this.timepicker = timepicker;
  }

  private runWithTimeout(cb: () => void, delay = 300) {
    const t = setTimeout(cb, delay);
    this.timeouts.push(t);
  }

  private clearAllTimeouts() {
    this.timeouts.forEach(clearTimeout);
    this.timeouts = [];
  }

  private clearExistingModal() {
    const existing = document.querySelector('.timepicker-ui-modal');
    if (existing) existing.remove();
  }

  /** @internal */
  setModalTemplate = (): void => {
    if (!this.timepicker._options) return;

    this.clearExistingModal();

    if (this.timepicker._options.inline?.enabled) {
      const containerElement = document.getElementById(this.timepicker._options.inline.containerId);
      if (!containerElement) return;

      containerElement.innerHTML = '';
      containerElement.insertAdjacentHTML('beforeend', this.timepicker.modalTemplate);

      const modalElement = containerElement.querySelector('.timepicker-ui-modal') as HTMLDivElement;
      if (modalElement) {
        modalElement.classList.add('timepicker-ui--inline');

        const { showButtons } = this.timepicker._options.inline;
        if (showButtons === false || showButtons === undefined) {
          modalElement
            .querySelectorAll('.timepicker-ui-wrapper-btn, .timepicker-ui-wrapper-btn.mobile')
            .forEach((btn) => ((btn as HTMLElement).style.display = 'none'));
        }
      }
      return;
    }

    const { appendModalSelector } = this.timepicker._options;
    if (!appendModalSelector) {
      document.body.insertAdjacentHTML('beforeend', this.timepicker.modalTemplate);
    } else {
      const element = document.querySelector(appendModalSelector);
      element?.insertAdjacentHTML('beforeend', this.timepicker.modalTemplate);
    }
  };

  /** @internal */
  setScrollbarOrNot = (): void => {
    if (this.timepicker._options.inline?.enabled) return;

    if (!this.timepicker._options.enableScrollbar) {
      this.originalOverflow = document.body.style.overflowY;
      this.originalPaddingRight = document.body.style.paddingRight;

      document.body.style.paddingRight = `${getScrollbarWidth()}px`;
      document.body.style.overflowY = 'hidden';
    } else {
      this.runWithTimeout(() => {
        document.body.style.overflowY = this.originalOverflow || '';
        document.body.style.paddingRight = this.originalPaddingRight || '';
      }, 400);
    }
  };

  /** @internal */
  removeBackdrop = (): void => {
    if (this.timepicker._options.inline?.enabled || this.timepicker._options.backdrop) return;

    this.timepicker.modalElement?.classList.add('removed');
    this.timepicker.openElement.forEach((openEl: Element) => openEl?.classList.add('disabled'));
  };

  /** @internal */
  setNormalizeClass = (): void => {
    const modal = this.timepicker.modalElement;
    if (!modal) return;

    modal.classList.add('timepicker-ui-normalize');
    const divs = modal.querySelectorAll(':scope > div') as NodeListOf<HTMLDivElement>;
    divs.forEach((div: HTMLDivElement) => div.classList.add('timepicker-ui-normalize'));
  };

  /** @internal */
  setShowClassToBackdrop = (): void => {
    if (this.timepicker._options.inline?.enabled) {
      this.timepicker.modalElement?.classList.add('show');
      return;
    }

    if (this.timepicker._options.backdrop) {
      this.runWithTimeout(() => {
        this.timepicker.modalElement?.classList.add('show');
      }, 300);
    }
  };

  /** @internal */
  setFlexEndToFooterIfNoKeyboardIcon = (): void => {
    if (!this.timepicker._options.enableSwitchIcon && this.timepicker.footer) {
      this.timepicker.footer.style.justifyContent = 'flex-end';
    }
  };

  destroy() {
    this.clearAllTimeouts();

    if (!this.timepicker._options.inline?.enabled) {
      document.body.style.overflowY = this.originalOverflow || '';
      document.body.style.paddingRight = this.originalPaddingRight || '';
    }

    this.clearExistingModal();
  }
}
