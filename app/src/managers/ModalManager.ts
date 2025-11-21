import { getScrollbarWidth } from '../utils/config';
import { getModalTemplate } from '../utils/template';
import type { CoreState } from '../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../utils/EventEmitter';
import { isDocument, isNode } from '../utils/node';
import { TIMINGS } from '../constants/timings';

export default class ModalManager {
  private core: CoreState;
  private emitter: EventEmitter<TimepickerEventMap>;
  private timeouts: NodeJS.Timeout[] = [];
  private originalOverflow?: string;
  private originalPaddingRight?: string;

  constructor(core: CoreState, emitter: EventEmitter<TimepickerEventMap>) {
    this.core = core;
    this.emitter = emitter;
  }

  private runWithTimeout(cb: () => void, delay: number = TIMINGS.DEFAULT_DELAY): void {
    const t = setTimeout(cb, delay);
    this.timeouts.push(t);
  }

  private clearAllTimeouts(): void {
    this.timeouts.forEach(clearTimeout);
    this.timeouts = [];
  }

  private clearExistingModal(): void {
    if (isDocument() === false) {
      return;
    }

    const existing = document.querySelector('.tp-ui-modal');
    if (existing) existing.remove();
  }

  setModalTemplate(): void {
    if (isDocument() === false) {
      return;
    }

    this.clearExistingModal();

    const modalTemplate = getModalTemplate(this.core.options, this.core.instanceId);

    if (this.core.options.ui.inline?.enabled) {
      const containerElement = document.getElementById(this.core.options.ui.inline.containerId);
      if (!containerElement) return;

      containerElement.innerHTML = '';
      containerElement.insertAdjacentHTML('beforeend', modalTemplate);

      const modalElement = containerElement.querySelector('.tp-ui-modal') as HTMLDivElement;
      if (modalElement) {
        modalElement.classList.add('tp-ui--inline');

        const { showButtons } = this.core.options.ui.inline;
        if (showButtons === false || showButtons === undefined) {
          modalElement
            .querySelectorAll('.tp-ui-wrapper-btn, .tp-ui-wrapper-btn.mobile')
            .forEach((btn) => ((btn as HTMLElement).style.display = 'none'));
        }
      }
      return;
    }

    const { appendModalSelector } = this.core.options.ui;
    if (!appendModalSelector) {
      document.body.insertAdjacentHTML('beforeend', modalTemplate);
    } else {
      const element = document.querySelector(appendModalSelector);
      element?.insertAdjacentHTML('beforeend', modalTemplate);
    }
  }

  setScrollbarOrNot(): void {
    if (isDocument() === false) {
      return;
    }

    if (this.core.options.ui.inline?.enabled) return;

    if (!this.core.options.ui.enableScrollbar) {
      this.originalOverflow = document.body.style.overflowY;
      this.originalPaddingRight = document.body.style.paddingRight;

      document.body.style.paddingRight = `${getScrollbarWidth()}px`;
      document.body.style.overflowY = 'hidden';
    } else {
      this.runWithTimeout(() => {
        if (!isNode()) {
          this.runWithTimeout(() => {
            if (typeof document !== 'undefined') {
              document.body.style.overflowY = this.originalOverflow || '';
              document.body.style.paddingRight = this.originalPaddingRight || '';
            }
          }, TIMINGS.SCROLLBAR_RESTORE);
        }
      }, 400);
    }
  }

  removeBackdrop(): void {
    if (this.core.options.ui.inline?.enabled || this.core.options.ui.backdrop) return;

    const modal = this.core.getModalElement();
    const openElements = this.core.getOpenElement();

    modal?.classList.add('removed');
    openElements.forEach((openEl: Element) => openEl?.classList.add('disabled'));
  }

  setNormalizeClass(): void {
    const modal = this.core.getModalElement();
    if (!modal) return;

    modal.classList.add('tp-ui-normalize');
    const divs = modal.querySelectorAll(':scope > div') as NodeListOf<HTMLDivElement>;
    divs.forEach((div: HTMLDivElement) => div.classList.add('tp-ui-normalize'));
  }

  setShowClassToBackdrop(): void {
    if (this.core.options.ui.inline?.enabled) {
      this.core.getModalElement()?.classList.add('show');
      this.setInitialFocus();
      return;
    }

    if (this.core.options.ui.backdrop) {
      this.runWithTimeout(() => {
        this.core.getModalElement()?.classList.add('show');
        this.setInitialFocus();
      }, TIMINGS.MODAL_ANIMATION);
    }
  }

  private setInitialFocus(): void {
    if (!this.core.options.behavior.focusTrap) return;

    const wrapper = this.core.getWrapper();
    if (wrapper && typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(() => {
        wrapper.focus();
      });
    }
  }

  setFlexEndToFooterIfNoKeyboardIcon(): void {
    const footer = this.core.getFooter();
    if (!this.core.options.ui.enableSwitchIcon && footer) {
      footer.style.justifyContent = 'flex-end';
    }
  }

  destroy(): void {
    this.clearAllTimeouts();

    if (!isNode() && !this.core.options.ui.inline?.enabled) {
      document.body.style.overflowY = this.originalOverflow || '';
      document.body.style.paddingRight = this.originalPaddingRight || '';
    }

    this.clearExistingModal();
  }
}

